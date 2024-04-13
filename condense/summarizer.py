import re
import sys
import logging
import argparse
from typing import Dict, List, Tuple

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


def clean_data(data: List[Dict]) -> List[Dict]:
    final_data = []
    if data:
        sentences = []
        start, end, cnt = 0.00, 0, 0
        # Removing extra whitespaces
        for sentence in data:
            end = sentence["end"]
            cnt += 1
            sentence_text = re.sub(
                "[^a-zA-Z0-9.,;:()'\"\\s]", "", sentence["text"]
            )  # Add special symbols to preserve inside the square brackets with numbers and characters
            sentence_sym = re.sub("\\s+", " ", sentence_text)
            sentences.append(sentence_sym.strip())
            # The model maximum tokens is 500, and each sentence is approximately 10 words, so to be on the safe side, we have considered cnt = 12, so maximum 10 sentences will be used
            if cnt == 12:
                text = " ".join(sentences)
                final_data.append({"start": start, "end": end, "text": text})
                start, cnt = end, 0
                sentences = []

        return final_data
    else:
        raise ValueError("No data found")


def get_summary(data: List[Dict[str, str]]) -> Tuple[List[Dict], List[Dict]]:
    summarizer = pipeline("summarization")
    summary = []
    for chunk in data:
        summary_text = summarizer(chunk["text"], max_length=50, min_length=1, do_sample=False)[0]["summary_text"]
        summary.append({"start": chunk["start"], "end": chunk["end"], "summary_text": str(summary_text)})

    time_stamp = []
    for chunk in summary:
        summary_text = summarizer(chunk["summary_text"], max_length=13, min_length=1, do_sample=False)[0][
            "summary_text"
        ]
        time_stamp.append({"start": chunk["start"], "end": chunk["end"], "summary_text": str(summary_text)})

    return (summary, time_stamp)


def summerize_text(video_url: str) -> Tuple[List[Dict], List[Dict]]:
    nltk.download("punkt")
    data = get_transcript(video_url)
    return get_summary_from_transcript(data)


def get_summary_from_transcript(data: List[Dict[str, str]]) -> Tuple[List[Dict], List[Dict]]:
    data = clean_data(data)
    for sentence in data:
        sentences = nltk.tokenize.sent_tokenize(sentence["text"])
        sentence["text"] = " ".join(sentences)

    summary, time_stamp = get_summary(data)
    return (summary, time_stamp)


def main(argv=None) -> int:
    parser = make_parser()
    argv = parser.parse_args(argv)
    summary, time_stamp = summerize_text(argv.video_url)
    summary_text = " ".join([f"{chunk['summary_text']}" for chunk in summary])
    summary_dict = {"summary": summary_text, "time_stamp": time_stamp}
    print(summary_dict)

    return 0


if __name__ == "__main__":
    sys.exit(main())
