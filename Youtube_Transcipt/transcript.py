# Copyright (C) 2024 Condense, Inc. All Rights Reserved.
from youtube_transcript_api import YouTubeTranscriptApi
import re
import sys
import random
import string
import logging
import argparse

import os
import sys
from pytube import YouTube
sys.path.append("../audio-to-text-transcription")
from youtube_audio_to_text import main as main_text
sys.path.append("../contants")
from utils import save_to_file

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

def make_parser() -> argparse.ArgumentParser:
    """
    Create the argument parser.
    """
    parser = argparse.ArgumentParser(
        description="Get the transcript for a video", formatter_class=argparse.RawTextHelpFormatter
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
    output_group.add_argument("-a", "--audio", action="store_true", help="store audio in the output directory")

    return parser

def get_transcript(args: argparse.Namespace) -> list[dict[str, str]]:
    video_url = args.video_url
    video_id_match = re.search(r'(?:https?://)?(?:www\.)?youtube\.com/watch\?v=([^&]+)', video_url)

    if video_id_match:
        video_id = video_id_match.group(1)
    else:
        print("Invalid YouTube URL.")
        return []

    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        # print(transcript)

        yt = YouTube(video_url)
        audio_stream = yt.streams.filter(only_audio=True).first()

        output_path = "videos"
        if not os.path.exists(output_path):
            os.makedirs(output_path)

        filename = "".join(random.choices(string.ascii_letters + string.digits, k=16)) + ".mp3"
        audio_stream.download(output_path=output_path, filename=filename)
        logger.info(f"Audio downloaded to {output_path}/{filename}")

        captions = []
        for segment in transcript:
            start = segment['start']
            end = segment['start'] + segment['duration']
            text = segment['text']
            captions.append({'start': start, 'end': end, 'text': text})

        return captions
    except Exception as e:
        # print("Error fetching transcript:", e)
        main_text(args)
        return []
    
def main(argv: list[str] = None) -> int:
    parser = make_parser()
    args = parser.parse_args(args=argv)
    logging.basicConfig(level=logging.DEBUG)

    transcript = get_transcript(args)
    if transcript:
        save_to_file(transcript, args)

if __name__ == "__main__":
    sys.exit(main())
