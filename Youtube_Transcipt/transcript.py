from youtube_transcript_api import YouTubeTranscriptApi
import re
import csv
import sys
import json
import random
import shutil
import string
import logging
import argparse

import os
import sys
from pytube import YouTube

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
module_dir = os.path.join(parent_dir, 'audio-to-text-transcription')
sys.path.append(module_dir)

from youtube_audio_to_text import main as main_text

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

# https://www.youtube.com/watch?v=jbjYdVYvvbg
# https://www.youtube.com/watch?v=78CMgzZptZk

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


def save_to_text(data: list[dict[str, str]], text_filename: str) -> None:
    """
    Save the transcript text to a text file.
    """
    with open(text_filename, mode="w", encoding="utf-8") as text_file:
        for caption in data:
            start = caption["start"]
            end = caption["end"]
            text = caption["text"]
            text_file.write(f"{start} --> {end}  ")
            text_file.write(f"{text}\n")


def save_to_csv(data: list[dict[str, str]], csv_filename: str) -> None:
    """
    Save the transcript data to a CSV file.
    """
    with open(csv_filename, mode="w", encoding="utf-8") as csv_file:
        fieldnames = ["start", "end", "text"]
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader()
        for field in data:
            writer.writerow(
                {
                    fieldnames[0]: field[fieldnames[0]],
                    fieldnames[1]: field[fieldnames[1]],
                    fieldnames[2]: field[fieldnames[2]],
                }
            )

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

def save_to_file(data: list[dict[str, str]], args: argparse.Namespace) -> None:
    output_path = "transcripts"
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    json_count = 0
    text_count = 0
    csv_count = 0

    # Save data to JSON
    if args.json:
        json_filename = "transcript_data.json"
        while os.path.exists(os.path.join(output_path, json_filename)):
            json_count += 1
            json_filename = f"transcript_data{json_count}.json"
        with open(os.path.join(output_path, json_filename), "w") as json_file:
            json.dump(data, json_file, indent=4)
            logger.info("Transcript data saved to %s", json_filename)

    # Save data to text
    if args.text:
        text_filename = "transcript_text.txt"
        while os.path.exists(os.path.join(output_path, text_filename)):
            text_count += 1
            text_filename = f"transcript_text{text_count}.txt"
        save_to_text(data, os.path.join(output_path, text_filename))
        logger.info("Transcript text saved to %s", text_filename)

    # Save data to CSV
    if args.csv:
        csv_filename = "transcript_data.csv"
        while os.path.exists(os.path.join(output_path, csv_filename)):
            csv_count += 1
            csv_filename = f"transcript_data{csv_count}.csv"
        save_to_csv(data, os.path.join(output_path, csv_filename))
        logger.info("Transcript data saved to %s", csv_filename)
    
def main(argv: list[str] = None) -> int:
    parser = make_parser()
    args = parser.parse_args(args=argv)
    logging.basicConfig(level=logging.DEBUG)

    transcript = get_transcript(args)
    if transcript:
        save_to_file(transcript, args)

if __name__ == "__main__":
    sys.exit(main())
