# Copyright (C) 2024 Condense, Inc. All Rights Reserved.
import csv
import sys
import json
import logging
import argparse

import requests

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)


def make_parser():
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

    return parser


def send_post_request(url, video_url, lang_code="en"):
    """
    Send a POST request to the specified URL with the given video URL and language code.
    Returns the JSON response.
    """
    body = {"videoUrl": video_url, "langCode": lang_code}
    response = requests.post(url, json=body)
    return response.json() if response.status_code == 200 else None


def save_to_csv(data, csv_filename):
    """
    Save the transcript data to a CSV file.
    """
    with open(csv_filename, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        title = data["title"]
        writer.writerow([title])
        writer.writerow(["Start", "Duration", "Text"])
        for caption in data["captions"]:
            start = caption["start"]
            duration = caption["dur"]
            text = caption["text"]
            writer.writerow([start, duration, text])


def save_to_text(data, text_filename):
    """
    Save the transcript text to a text file.
    """
    with open(text_filename, mode="w", encoding="utf-8") as text_file:
        title = data["title"]
        text_file.write(title + "\n")
        for caption in data["captions"]:
            text = caption["text"]
            text_file.write(text + "\n")


def save_data(data, args):
    """
    Save the data to the specified format(s).
    """
    # Save data to JSON
    if args.json:
        json_filename = "transcript_data.json"
        with open(json_filename, "w") as json_file:
            json.dump(data, json_file, indent=4)
            logger.info("Transcript data saved to %s", json_filename)

    # Save data to CSV
    if args.csv:
        csv_filename = "transcript_data.csv"
        save_to_csv(data, csv_filename)
        logger.info("Transcript data saved to %s", csv_filename)

    # Save data to text
    if args.text:
        text_filename = "transcript_text.txt"
        save_to_text(data, text_filename)
        logger.info("Transcript text saved to %s", text_filename)


def main(argv=None):
    url = "https://tactiq-apps-prod.tactiq.io/transcript"  # URL to send the POST request to

    parser = make_parser()
    args = parser.parse_args(args=argv)

    logging.basicConfig(level=logging.DEBUG)

    video_url = args.video_url
    response_data = send_post_request(url, video_url)

    if response_data:
        logger.info("POST request successful!")

        for caption in response_data["captions"]:
            print(caption["text"])

    else:
        raise Exception("POST request failed!")


if __name__ == "__main__":
    sys.exit(main())
