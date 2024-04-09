# Copyright (C) 2024 Condense, Inc. All Rights Reserved.
import os
import sys
import random
import shutil
import string
import logging
import argparse
from typing import Dict, List, Tuple

import whisper
from pytube import YouTube
from langdetect import detect

from condense.utils import save_to_file

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)


def make_parser() -> argparse.ArgumentParser:
    """
    Create the argument parser.
    """
    parser = argparse.ArgumentParser(
        description="Get the transcript for a video",
        formatter_class=argparse.RawTextHelpFormatter,
    )
    parser.add_argument(
        "-u",
        "--url",
        dest="video_url",
        type=str,
        required=True,
        help="The URL of the video to get the transcript for",
    )

    output_group = parser.add_argument_group("rendering arguments")
    output_group.add_argument("-j", "--json", action="store_true", help="emit JSON instead of text")
    output_group.add_argument("-t", "--text", action="store_true", help="emit text instead of JSON")
    output_group.add_argument("-c", "--csv", action="store_true", help="emit CSV instead of JSON")

    return parser


def get_transcript(model: whisper.model, output_path: str, filename: str) -> Tuple[List[Dict[str, str]], str]:
    absolute_audio_path = os.path.join(output_path, filename)

    result = model.transcribe(absolute_audio_path)
    segments = result["segments"]

    transcribed_text = result["text"]

    language = detect(transcribed_text)
    logger.info(f"Detected language: {language}")
    return (segments, language)


def load_model(output_path : str, filename: str) -> Tuple[List[Dict[str, str]], str]:
    model = whisper.load_model("base")
    segments, language = get_transcript(model, output_path, filename)

    return (segments, language)

def generate(audio_stream: YouTube, output_path: str, filename: str) -> Tuple[List[Dict[str, str]], str]:
    """
    Generate the transcript for the audio stream.
    """
    audio_stream.download(output_path=output_path, filename=filename)
    logger.info(f"Audio downloaded to {output_path}/{filename}")

    segments, language = load_model(output_path, filename)
    return (segments, language)


def get_transcript_from_video(video_url: str) -> Tuple[List[Dict[str, str]], str]:
    """
    Get the transcript for the video.
    """
    yt = YouTube(video_url)
    audio_stream = yt.streams.filter(only_audio=True).first()

    # Create directory if it doesn't exist
    output_path = "audio"
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    filename = "".join(random.choices(string.ascii_letters + string.digits, k=16)) + ".mp3"
    text, lang = generate(audio_stream, output_path, filename)

    shutil.rmtree(output_path)

    return (text, lang)


def main(argv=None) -> int:
    logging.basicConfig(level=logging.DEBUG)
    parser = make_parser()
    args = parser.parse_args(argv)

    text, lang = get_transcript_from_video(args.video_url)
    save_to_file(text, args)
    print(text)

    return 0


if __name__ == "__main__":
    sys.exit(main())
