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


def clean_data(data: list[dict]) -> str:
    if data:
        sentences = []
        # Removing extra whitespaces
        for sentence in data:
            sentence_text = re.sub(
                "[^a-zA-Z0-9.,;:()'\"\\s]", "", sentence["text"]
            )  # Add special symbols to preserve inside the square brackets with numbers and characters
            sentence_sym = re.sub("\\s+", " ", sentence_text)
            sentences.append(sentence_sym.strip())
        display = " ".join(sentences)
        return display
    else:
        raise ValueError("No data found")


def summerize_text(video_url: str) -> str:
    nltk.download("punkt")
    transcript_data = get_transcript(video_url)
    data_clean = clean_data(transcript_data)
    sentences = nltk.tokenize.sent_tokenize(data_clean)
    data = " ".join(sentences)

    summarizer = pipeline("summarization")
    max_chunk_length = 400  # Define the maximum length for each chunk
    chunks = [data[i : i + max_chunk_length] for i in range(0, len(data), max_chunk_length)]
    summary = []
    for chunk in chunks:
        summary_text = summarizer(chunk, max_length=50, min_length=10, do_sample=False)[0]["summary_text"]
        summary.append(summary_text)
    return " ".join(summary)


def main(argv=None) -> int:
    parser = make_parser()
    args = parser.parse_args(argv)
    summary = summerize_text(args.video_url)
    print(summary)

    return 0


if __name__ == "__main__":
    sys.exit(main())
