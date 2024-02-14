import os
import csv
import sys
import json
import random
import shutil
import string
import logging
import argparse

import whisper
from langdetect import detect
from pytube import YouTube

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

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

def save_data(data: list[dict[str, str]], args: argparse.Namespace) -> None:
    """
    Save the data to the specified format(s).
    """
    # Save data to JSON
    if args.json:
        json_filename = "transcript_data.json"
        with open(json_filename, "w") as json_file:
            json.dump(data, json_file, indent=4)
            logger.info("Transcript data saved to %s", json_filename)

    # Save data to text
    if args.text:
        text_filename = "transcript_text.txt"
        save_to_text(data, text_filename)
        logger.info("Transcript text saved to %s", text_filename)

    # Save data to CSV
    if args.csv:
        csv_filename = "transcript_data.csv"
        save_to_csv(data, csv_filename)
        logger.info("Transcript data saved to %s", csv_filename)


def generate(audio_stream: YouTube, output_path: str, filename: str) -> tuple[list[dict[str, str]], str]:
    """
    Generate the transcript for the audio stream.
    """
    audio_stream.download(output_path=output_path, filename=filename)
    logger.info(f"Audio downloaded to {output_path}/{filename}")

    model = whisper.load_model("base")
    absolute_audio_path = os.path.join(output_path, filename)

    result = model.transcribe(absolute_audio_path)
    print(result)

    segments = result["segments"]

    transcribed_text = result["text"]

    language = detect(transcribed_text)
    logger.info(f"Detected language: {language}")

    return segments, language


def get_transcript(args: argparse.Namespace) -> tuple[list[dict[str, str]], str]:
    """
    Get the transcript for the video.
    """
    video_url = args.video_url

    yt = YouTube(video_url)
    audio_stream = yt.streams.filter(only_audio=True).first()

    # Create directory if it doesn't exist
    output_path = "videos"
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    filename = "".join(random.choices(string.ascii_letters + string.digits, k=16)) + ".mp3"
    text, lang = generate(audio_stream, output_path, filename)

    # keep the audio file, if specified
    if args.audio:
        shutil.move(f"{output_path}/{filename}", "audio.mp3")
        shutil.rmtree(output_path)
    else:
        shutil.rmtree(output_path)

    return text, lang

def main(args):
    logging.basicConfig(level=logging.DEBUG)
    text, lang = get_transcript(args)
    save_data(text, args)
    print("Language: ", lang)
    print(text)

if __name__ == "__main__":
    args = sys.argv[1]
    main(args)

