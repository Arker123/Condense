import os
import sys
import json
import random
import logging
import argparse

from moviepy.editor import VideoFileClip

from condense.summarizer import get_summary_from_transcript
from condense.youtube_audio_extractor import start_translate

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)


def make_parser() -> argparse.Namespace:
    """
    Parse command line arguments.

    Returns:
    - args (Namespace): Parsed command line arguments.
    """
    parser = argparse.ArgumentParser(description="Extract audio from a video file.")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        "-v",
        "--video",
        dest="video_file",
        action="store_true",
        help="Extract audio from a video file.",
    )
    group.add_argument(
        "-a",
        "--audio",
        dest="audio_file",
        action="store_true",
        help="Save the output audio file.",
    )
    args = parser.parse_args()
    return args


def extract_audio(video_file: str, audio_file: str) -> str:
    """
    Extracts audio from a video file and saves it to another file.

    Args:
    - video_file (str): Path to the input video file.
    - audio_file (str): Path to save the output audio file.
    """
    video_clip = VideoFileClip(video_file)
    audio_clip = video_clip.audio
    audio_clip.write_audiofile(audio_file)
    audio_clip.close()
    video_clip.close()

    return audio_file


def main(argv=None) -> int:
    logging.basicConfig(level=logging.DEBUG)
    parser = make_parser()
    args = parser.parse_args(argv)

    if args.audio_file is None:
        # video_file is provided
        tmp_audio_dir = "tmp_audio"
        tmp_audio_file = f"tmp_audio_{random.randint(0, 100000)}.mp3"
        audio_path = f"{tmp_audio_dir}/{tmp_audio_file}"
        audio_path = extract_audio(args.video_file, audio_path)
        print(f"Audio extracted and saved to {audio_path}")

    audio_path = args.audio_file if args.audio_file else tmp_audio_file
    transcript, _ = start_translate("./", audio_path)

    # remove the temporary audio file
    if args.audio_file is None:
        os.remove(audio_path)

    # get the summary
    summary, timestamps = get_summary_from_transcript(transcript)
    print(json.dumps(transcript))
    print(json.dumps(summary))
    print(json.dumps(timestamps))

    return 0


if __name__ == "__main__":
    sys.exit(main())
