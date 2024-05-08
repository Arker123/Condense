#!/usr/bin/env python
# Copyright (C) 2024 Condense, Inc. All Rights Reserved.
import os
import csv
import sys
import json
import random
import logging
import argparse
import rich.traceback
import textwrap
from enum import Enum
from time import time
from typing import Dict, List, Tuple
from pathlib import Path
import matplotlib.pyplot as plt

import condense.utils
import condense.render.default
from condense.utils import get_video_id, is_type_enabled, get_runtime_diff
from condense.render import Verbosity
from condense.results import Analysis, Metadata, ResultDocument, ResultDocumentUrl
from condense.version import __version__
from condense.logging_ import TRACE, DebugLevel
from condense.analystics import word_cloud, display_engagement_metrics
from condense.summarizer import summerize_text, load_summarize_model, get_summary_from_transcript
from condense.transcript import get_transcript
from condense.video_audio_to_data import extract_audio
from condense.youtube_audio_extractor import start_translate

logger = condense.logging_.getLogger("condense")


class AnalysisType(str, Enum):
    TRANSCRIPT = "transcript"
    SUMMARY = "summary"
    WORDCLOUD = "wordcloud"
    SENTIMENT = "sentiment"
    ANALYTICS = "analytics"


class ArgumentValueError(ValueError):
    pass


class ArgumentParser(argparse.ArgumentParser):
    """
    argparse will call sys.exit upon parsing invalid arguments.
    we don't want that, because we might be parsing args within test cases, run as a module, etc.
    so, we override the behavior to raise a ArgumentValueError instead.

    this strategy is originally described here: https://stackoverflow.com/a/16942165/87207
    """

    def error(self, message):
        self.print_usage(sys.stderr)
        args = {"prog": self.prog, "message": message}
        raise ArgumentValueError("%(prog)s: error: %(message)s" % args)


def make_parser(argv):
    desc = (
        "The Condense team's open-source tool to summarize and analyse videos.\n"
        f"  %(prog)s {__version__} - https://github.com/Arker123/T07-CS305\n\n"
        "Condense has the following features:\n"
        " 1. Give video transcripts\n"
        " 2. Give video summaries from youtube videos\n"
        " 3. Give video summaries from audio files\n"
        " 4. Give video summaries from recorded audio\n"
        " 5. Give Sentiment Analysis of the video\n"
        " 6. Give Keywords of the video\n"
    )
    epilog = textwrap.dedent(
        """
        only displaying core arguments, run `condense -H` to see all supported options

        examples:
          extract transcriptions, summaries, sentiment analysis and keywords from a youtube video
            condense https://www.youtube.com/watch?v=video_id
        
          extract transcriptions from a youtube video
            condense --transcribe https://www.youtube.com/watch?v=video_id

          extract summaries from a youtube video
            condense --summarize https://www.youtube.com/watch?v=video_id

          analyze a video file
            condense --analyze video.mp4
        """
    )

    epilog_advanced = textwrap.dedent(
        """
        examples:
          extract transcriptions, summaries, sentiment analysis and keywords from audio file
            condense --audio audio.mp3

          extract transcriptions, summaries, sentiment analysis and keywords from recorded audio
            condense --recorded-audio
        """
    )

    show_all_options = "-H" in argv

    parser = ArgumentParser(
        description=desc,
        epilog=epilog_advanced if show_all_options else epilog,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.register("action", "extend", condense.utils.ExtendAction)
    parser.add_argument("-H", action="help", help="show advanced options and exit")

    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        "sample",
        type=argparse.FileType("r"),
        nargs="?",
        help="path to video to analyze",
    )
    group.add_argument(
        "--url",
        dest="video_url",
        type=str,
        help="The URL of the video to get the summary for",
    )

    keywords_group = parser.add_argument_group("keywords arguments")
    keywords_group.add_argument(
        "--keywords",
        action="store_true",
        help="give keywords of the video",
    )

    analysis_group = parser.add_argument_group("analysis arguments")
    analysis_group.add_argument(
        "--no",
        action="extend",
        dest="disabled_types",
        nargs="+",
        choices=[t.value for t in AnalysisType],
        default=[],
        help="do not analyze specified argument type(s)",
    )
    analysis_group.add_argument(
        "--only",
        action="extend",
        dest="enabled_types",
        nargs="+",
        choices=[t.value for t in AnalysisType],
        default=[],
        help="only analyze specified argument type(s)",
    )

    advanced_group = parser.add_argument_group("advanced arguments")
    advanced_group.add_argument(
        "--disable-progress",
        action="store_true",
        help="disable all progress bars" if show_all_options else argparse.SUPPRESS,
    )
    advanced_group.add_argument(
        "--version",
        action="version",
        version="%(prog)s {:s}".format(__version__),
        help=("show program's version number and exit" if show_all_options else argparse.SUPPRESS),
    )

    if sys.platform == "win32":
        advanced_group.add_argument(
            "--install-right-click-menu",
            action=condense.utils.InstallContextMenu,
            help=(
                "install Condense to the right-click context menu for Windows Explorer and exit"
                if show_all_options
                else argparse.SUPPRESS
            ),
        )

        advanced_group.add_argument(
            "--uninstall-right-click-menu",
            action=condense.utils.UninstallContextMenu,
            help=(
                "uninstall Condense from the right-click context menu for Windows Explorer and exit"
                if show_all_options
                else argparse.SUPPRESS
            ),
        )

    output_group = parser.add_argument_group("rendering arguments")
    output_group.add_argument("-j", "--json", action="store_true", help="emit JSON")
    output_group.add_argument("-t", "--text", action="store_true", help="emit text")
    output_group.add_argument("-c", "--csv", action="store_true", help="emit CSV")
    output_group.add_argument(
        "-v",
        "--verbose",
        action="count",
        default=Verbosity.DEFAULT,
        help="enable verbose results, e.g. including function offsets (does not affect JSON output)",
    )

    logging_group = parser.add_argument_group("logging arguments")
    logging_group.add_argument(
        "-d",
        "--debug",
        action="count",
        default=DebugLevel.NONE,
        help="enable debugging output on STDERR, specify multiple times to increase verbosity",
    )
    logging_group.add_argument(
        "-q",
        "--quiet",
        action="store_true",
        help="disable all status output on STDOUT except fatal errors",
    )
    logging_group.add_argument(
        "--color",
        type=str,
        choices=("auto", "always", "never"),
        default="auto",
        help="enable ANSI color codes in results, default: only during interactive session",
    )

    return parser


def set_log_config(debug, quiet):
    if quiet:
        log_level = logging.WARNING
    elif debug >= DebugLevel.TRACE:
        log_level = TRACE
    elif debug >= DebugLevel.DEFAULT:
        log_level = logging.DEBUG
    else:
        log_level = logging.INFO

    logging.basicConfig(level=log_level)
    logging.getLogger().setLevel(log_level)

    # install the log message colorizer to the default handler.
    # because basicConfig is just above this,
    # handlers[0] is a StreamHandler to STDERR.
    #
    # calling this code from outside script main may do something unexpected.
    logging.getLogger().handlers[0].setFormatter(condense.logging_.ColorFormatter())


def is_running_standalone() -> bool:
    """
    are we running from a PyInstaller'd executable?
    if so, then we'll be able to access `sys._MEIPASS` for the packaged resources.
    """
    return hasattr(sys, "frozen") and hasattr(sys, "_MEIPASS")


def get_default_root() -> Path:
    """
    get the file system path to the default resources directory.
    under PyInstaller, this comes from _MEIPASS.
    under source, this is the root directory of the project.
    """
    if is_running_standalone():
        # pylance/mypy don't like `sys._MEIPASS` because this isn't standard.
        # its injected by pyinstaller.
        # so we'll fetch this attribute dynamically.
        return Path(getattr(sys, "_MEIPASS"))
    else:
        return Path(__file__).resolve().parent


def main(argv=None) -> int:
    """
    arguments:
      argv: the command line arguments
    """
    # use rich as default Traceback handler
    rich.traceback.install(show_locals=True)
    
    if argv is None:
        argv = sys.argv[1:]

    parser = make_parser(argv)
    try:
        args = parser.parse_args(args=argv)
        if args.enabled_types and args.disabled_types:
            parser.error("--no and --only arguments are not allowed together")
    except ArgumentValueError as e:
        print(e)
        return -1

    set_log_config(args.debug, args.quiet)

    analysis = Analysis(
        enable_transcript=is_type_enabled(AnalysisType.TRANSCRIPT, args.disabled_types, args.enabled_types),
        enable_summary=is_type_enabled(AnalysisType.SUMMARY, args.disabled_types, args.enabled_types),
        enable_wordcloud=is_type_enabled(AnalysisType.WORDCLOUD, args.disabled_types, args.enabled_types),
        enable_analytics=is_type_enabled(AnalysisType.ANALYTICS, args.disabled_types, args.enabled_types),
        enable_sentiment=is_type_enabled(AnalysisType.SENTIMENT, args.disabled_types, args.enabled_types),
    )

    time0 = time()

    if args.sample:
        sample = args.sample.name

        results = ResultDocument(metadata=Metadata(path=str(sample)), analysis=analysis)

        tmp_audio_dir = "tmp_audio"
        tmp_audio_file = None
        # check if file is a video file or an audio file
        if Path(sample).suffix in [".mp4", ".avi", ".mov", ".mkv"]:
            logger.info("Video file detected")
            if not os.path.exists(tmp_audio_dir):
                os.makedirs(tmp_audio_dir)
            tmp_audio_file = f"tmp_audio_{random.randint(0, 100000)}.mp3"
            audio_path = f"{tmp_audio_dir}/{tmp_audio_file}"
            audio_path = extract_audio(sample, audio_path)
            logger.info(f"Audio extracted and saved to {audio_path}")

        elif Path(sample).suffix in [".mp3", ".wav"]:
            logger.info("Audio file detected")
            audio_path = sample
        else:
            raise ValueError(
                "Please provide either a video or audio file.\n The supported file types are: .mp4, .avi, .mov, .mkv, .mp3, .wav"
            )

        if results.analysis.enable_transcript:
            transcript, _ = start_translate("./", audio_path)
            results.aggregate.transcript = transcript

        if results.analysis.enable_summary and not results.aggregate.transcript:
            
            transcript, _ = start_translate("./", audio_path)
            results.aggregate.transcript = transcript
            summarizer = load_summarize_model()
            results.aggregate.summary = get_summary_from_transcript(transcript, summarizer, 0)

        elif results.analysis.enable_summary and results.aggregate.transcript:
            print("yoo")
            summarizer = load_summarize_model()
            summary = get_summary_from_transcript(transcript, summarizer, 0)
            results.aggregate.summary = summary

        # cleanup
        if tmp_audio_file:
            os.remove(audio_path)

        args.sample.close()
        
        results.metadata.runtime.total = get_runtime_diff(time0)
        logger.info("finished execution after %.2f seconds", results.metadata.runtime.total)

    elif args.video_url:
        sample = args.video_url
        get_transcript(sample)

        resultsurl = ResultDocumentUrl(metadata=Metadata(path=str(sample)), analysis=analysis, url=sample)
        

        if resultsurl.analysis.enable_transcript:
            resultsurl.aggregate.transcript = get_transcript(sample)

        if resultsurl.analysis.enable_summary and not resultsurl.aggregate.transcript:
            resultsurl.aggregate.summary = summerize_text(sample)

        elif resultsurl.analysis.enable_summary and resultsurl.aggregate.transcript:
            summarizer = load_summarize_model()
            resultsurl.aggregate.summary = get_summary_from_transcript(resultsurl.aggregate.transcript, summarizer, 0)

        if resultsurl.analysis.enable_wordcloud:
            resultsurl.aggregate.wordcloud = word_cloud(sample)
            
            if resultsurl.analysis.enable_wordcloud:
                plt.figure(figsize=(8, 8), facecolor=None)
                plt.imshow(resultsurl.aggregate.wordcloud)
                plt.axis("off")
                plt.tight_layout(pad=0)
                plt.show()


        if resultsurl.analysis.enable_analytics:
            resultsurl.aggregate.analytics = display_engagement_metrics(sample)

        if resultsurl.analysis.enable_sentiment:
            # TODO: get sentiment analysis of the video
            pass
        
        resultsurl.metadata.runtime.total = get_runtime_diff(time0)
        logger.info("finished execution after %.2f seconds", resultsurl.metadata.runtime.total)

    else:
        raise ValueError("Please provide either a sample file or a video URL.")

    
    

    if args.json:
        # TODO: write render json script
        pass
    else:
        # this may be slow when there's many strings, so informing users what's happening
        logger.info("rendering results")
        if args.video_url:
            r = condense.render.default.renderUrl(resultsurl, args.verbose, args.quiet, args.color)
            print(r)
        elif args.sample:
            ru = condense.render.default.render(results, args.verbose, args.quiet, args.color)
            print(ru)

    return 0


if __name__ == "__main__":
    sys.exit(main())
