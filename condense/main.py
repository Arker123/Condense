#!/usr/bin/env python
# Copyright (C) 2024 Condense, Inc. All Rights Reserved.
import csv
import sys
import json
import time
import logging
import argparse
import textwrap
from typing import Dict, List, Tuple
from pathlib import Path

import condense.utils
from condense.utils import get_video_id
from condense.render import Verbosity
from condense.version import __version__
from condense.logging_ import TRACE, DebugLevel
from condense.analystics import word_cloud, display_engagement_metrics
from condense.summarizer import summerize_text
from condense.transcript import get_transcript

logger = condense.logging_.getLogger("condense")


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

    parser.add_argument(
        "sample",
        type=argparse.FileType("r"),
        help="path to video to analyze",
    )

    transcribe_group = parser.add_argument_group("transcribe arguments")
    transcribe_group.add_argument(
        "--transcribe",
        action="store_true",
        help="transcribe the video",
    )

    summarize_group = parser.add_argument_group("summarize arguments")
    summarize_group.add_argument(
        "--summarize",
        action="store_true",
        help="summarize the video",
    )

    sentiment_group = parser.add_argument_group("sentiment arguments")
    sentiment_group.add_argument(
        "--sentiment",
        action="store_true",
        help="give sentiment analysis of the video",
    )

    keywords_group = parser.add_argument_group("keywords arguments")
    keywords_group.add_argument(
        "--keywords",
        action="store_true",
        help="give keywords of the video",
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
    # TODO: use rich as default Traceback handler

    if argv is None:
        argv = sys.argv[1:]

    parser = make_parser(argv)
    try:
        args = parser.parse_args(args=argv)
    except ArgumentValueError as e:
        print(e)
        return -1

    set_log_config(args.debug, args.quiet)

    sample = Path(args.sample.name)
    args.sample.close()

    start_time = time.time()

    if args.transcribe:
        logger.debug("transcribing")
        transcript = get_transcript(sample)
        print(json.dumps(transcript))

    if args.summarize:
        logger.debug("summarizing")
        summary, timestamp = summerize_text(sample)
        print(json.dumps({"summary": summary, "timestamp": timestamp}))

    if args.sentiment:
        logger.debug("getting sentiment analysis")
        # TODO: get sentiment analysis of the video

    if args.keywords:
        logger.debug("getting keywords")
        word_cloud(sample)
        statistics = display_engagement_metrics(sample)
        print("Engagement Metrics for Video ID:", get_video_id(sample))
        print("Views:", statistics.get("viewCount", 0))
        print("Likes:", statistics.get("likeCount", 0))
        print("Dislikes:", statistics.get("dislikeCount", 0))
        print("Comments:", statistics.get("commentCount", 0))
        print("Shares:", statistics.get("shareCount", 0))

    if not args.transcribe and not args.summarize and not args.sentiment and not args.keywords:
        logger.debug("doing everything")
        transcript = get_transcript(sample)
        summary, timestamp = summerize_text(sample)
        word_cloud(sample)
        statistics = display_engagement_metrics(sample)

        # TODO: Improve rendering
        print(json.dumps(transcript))
        print(json.dumps({"summary": summary, "timestamp": timestamp}))
        print("Engagement Metrics for Video ID:", get_video_id(sample))
        print("Views:", statistics.get("viewCount", 0))
        print("Likes:", statistics.get("likeCount", 0))
        print("Dislikes:", statistics.get("dislikeCount", 0))
        print("Comments:", statistics.get("commentCount", 0))
        print("Shares:", statistics.get("shareCount", 0))

    logger.info("finished execution after %.2f seconds", time.time() - start_time)

    if args.json:
        logger.debug("emitting JSON")
        # TODO: emit JSON

    if args.text:
        logger.debug("emitting text")
        # TODO: emit text

    if args.csv:
        logger.debug("emitting CSV")
        # TODO: emit CSV

    return 0


if __name__ == "__main__":
    sys.exit(main())
