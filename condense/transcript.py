# Copyright (C) 2024 Condense, Inc. All Rights Reserved.
import re
import sys
import logging
import argparse
from typing import Dict, List

import youtube_transcript_api

from condense.utils import save_to_file
from condense.youtube_audio_extractor import get_transcript_from_video

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


def get_transcript(video_url) -> List[Dict[str, str]]:
    if "youtube.com/watch?v=" in video_url:
        video_id_match = re.search(r"(?:https?://)?(?:www\.)?youtube\.com/watch\?v=(?P<url>[^&]+)", video_url)
    elif "youtu.be" in video_url:
        video_id_match = re.search(r"(?:https?://)?(?:www\.)?youtu\.be/(?P<url>[^&]+)", video_url)

    if video_id_match:
        video_id = video_id_match.group("url")
    else:
        raise ValueError("Invalid YouTube URL.")

    transcript = None
    try:
        transcript = youtube_transcript_api.YouTubeTranscriptApi.get_transcript(video_id)
    except youtube_transcript_api._errors.TranscriptsDisabled:
        logger.info("Transcripts are disabled for this video, using audio to text instead.")

    if transcript:
        captions = []
        for segment in transcript:
            start = segment["start"]
            end = segment["start"] + segment["duration"]
            text = segment["text"]
            captions.append({"start": start, "end": end, "text": text})
        return captions
    else:
        captions, _ = get_transcript_from_video(video_url)
        return captions


def main(argv=None) -> int:
    parser = make_parser()
    args = parser.parse_args(argv)
    logging.basicConfig(level=logging.DEBUG)

    transcript = get_transcript(args.video_url)
    print(transcript)
    save_to_file(transcript, args)

    return 0


if __name__ == "__main__":
    sys.exit(main())
