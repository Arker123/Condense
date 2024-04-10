import sys
import logging
import argparse
import os
from dotenv import load_dotenv 

import pandas as pd
import matplotlib.pyplot as plt
from wordcloud import STOPWORDS, WordCloud

from condense.comments import get_comments

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)


def make_parser() -> argparse.ArgumentParser:
    """
    Create the argument parser.
    """
    parser = argparse.ArgumentParser(
        description="Get the analytics for a video",
        formatter_class=argparse.RawTextHelpFormatter,
    )
    parser.add_argument(
        "-u",
        "--url",
        dest="video_url",
        type=str,
        required=True,
        help="The URL of the video to get the analytics for",
    )

    return parser


def word_cloud(video_url: str, api_key: str) -> None:
    get_comments(api_key, file=False, video_url=video_url)
    df = pd.read_csv(r"comments.csv", encoding="latin-1")

    comment_words = ""
    stopwords = set(STOPWORDS)

    for val in df.CONTENT:
        val = str(val)
        tokens = val.split()
        for i in range(len(tokens)):
            tokens[i] = tokens[i].lower()

        comment_words += " ".join(tokens) + " "
    wordcloud = WordCloud(
        width=800, height=800, background_color="white", stopwords=stopwords, min_font_size=10
    ).generate(comment_words)

    plt.figure(figsize=(8, 8), facecolor=None)
    plt.imshow(wordcloud)
    plt.axis("off")
    plt.tight_layout(pad=0)

    plt.show()


def main(argv: list[str] = None):
    load_dotenv()  
    api_key = os.getenv("API_KEY")
    if api_key is None:
        raise ValueError("API_KEY environment variable is not set.")

    parser = make_parser()
    args = parser.parse_args(argv)
    word_cloud(args.video_url, api_key)


if __name__ == "__main__":
    sys.exit(main())
