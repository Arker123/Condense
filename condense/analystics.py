import sys
import logging
import argparse

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
        description="Get the summary for a video",
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


def word_cloud(video_url: str) -> None:
    get_comments(video_url)
    df = pd.read_csv(r"comments.csv", encoding ="latin-1")

    comment_words = ''
    stopwords = set(STOPWORDS)

    for val in df.CONTENT:
        val = str(val)
        tokens = val.split()
        for i in range(len(tokens)):
            tokens[i] = tokens[i].lower()

        comment_words += " ".join(tokens)+" "
    wordcloud = WordCloud(width = 800, height = 800,
                    background_color ='white',
                    stopwords = stopwords,
                    min_font_size = 10).generate(comment_words)

    plt.figure(figsize = (8, 8), facecolor = None)
    plt.imshow(wordcloud)
    plt.axis("off")
    plt.tight_layout(pad = 0)

    plt.show()


def main(argv: list[str] = None) -> None:
    parser = make_parser()
    argv = parser.parse_args(argv)
    summary = word_cloud(argv.video_url)
    print(summary)


if __name__ == "__main__":
    sys.exit(main())