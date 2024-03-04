import os
import re
import sys
import logging
import argparse

import nltk
from transformers import pipeline

from condense.transcript import get_transcript


logger = logging.getLogger()
logger.setLevel(logging.DEBUG)


def make_parser() -> argparse.ArgumentParser:
    """
    Create the argument parser.
    """
    parser = argparse.ArgumentParser(
        description="Get the summary for a video",
        formatter_class=argparse.RawTextHelpFormatter,
    )
    parser.add_argument(
        "-u",
        "--url",
        dest="video_url",
        type=str,
        required=True,
        help="The URL of the video to get the summary for",
    )

    return parser


def clean_data(data: list[str]) -> str:
    if data:
        sentences = []
        # Removing special characters and extra whitespaces
        for sentence in data:
            sentence = re.sub("[^a-zA-Z]", " ", sentence["text"])
            sentence = re.sub("\\s+", " ", sentence)
            sentences.append(sentence.strip())
        display = ". ".join(sentences)
        return display
    else:
        raise ValueError("No data found")


def summerize_text(args: list[str]) -> str:
    nltk.download("punkt")
    data = get_transcript(args)
    data_clean = clean_data(data)
    sentences = nltk.tokenize.sent_tokenize(data_clean)

    data = " ".join(sentences)

    summarizer = pipeline("summarization")
    max_chunk_length = 400  # Define the maximum length for each chunk
    chunks = [data[i : i + max_chunk_length] for i in range(0, len(data), max_chunk_length)]
    summary = []
    for chunk in chunks:
        summary_text = summarizer(chunk, max_length=100, min_length=20, do_sample=False)[0]["summary_text"]
        summary.append(summary_text)
    return " ".join(summary)


def main(argv: list[str] = None) -> int:
    parser = make_parser()
    argv = parser.parse_args(argv)
    summary = summerize_text(argv)
    print(summary)
    return 0


if __name__ == "__main__":
    sys.exit(main())
