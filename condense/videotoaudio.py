import sys
import logging
import argparse

from moviepy.editor import VideoFileClip

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)


def make_parser() -> argparse.Namespace:
    """
    Parse command line arguments.

    Returns:
    - args (Namespace): Parsed command line arguments.
    """
    parser = argparse.ArgumentParser(description="Extract audio from a video file.")
    parser.add_argument(
        "-v",
        "--video",
        dest="video_file",
        required=True,
        help="Path to the input video file.",
    )
    parser.add_argument(
        "-a",
        "--audio",
        dest="audio_file",
        required=True,
        help="Path to save the output audio file.",
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

    audio_path = extract_audio(args.video_file, args.audio_file)
    print(f"Audio extracted and saved to {audio_path}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
