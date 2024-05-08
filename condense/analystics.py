import os
import sys
import random
import string
import logging
import argparse
from typing import Optional

import pandas as pd
import matplotlib.pyplot as plt
from dotenv import load_dotenv
from wordcloud import STOPWORDS, WordCloud
from googleapiclient.discovery import build

from condense.utils import get_video_id
from condense.comments import get_comments
from condense.evaluation import evaluate_sentiment

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


def word_cloud(video_url: str) -> str:
    """
    Generate a word cloud from the comments of a YouTube video.
    """
    
    load_dotenv()

    api_key = os.getenv("API_KEY")
    if api_key is None:
        raise ValueError("Please provide an API key to use this feature.")

    # df = pd.read_csv(r"comments.csv", encoding="latin-1")
    comments = get_comments(video_url)

    comment_words = ""
    stopwords = set(STOPWORDS)

    for val in comments:
        val = str(val)
        tokens = val.split()
        for i in range(len(tokens)):
            tokens[i] = tokens[i].lower()

        comment_words += " ".join(tokens) + " "
            
    wordcloud = WordCloud(
        width=800, height=800, background_color="white", stopwords=stopwords, min_font_size=10
    ).generate(comment_words)

    return wordcloud


def display_engagement_metrics(video_url: str):
    load_dotenv()

    api_key = os.getenv("API_KEY")
    if api_key is None:
        raise ValueError("Please provide an API key to use this feature.")
    video_id = get_video_id(video_url)
    if not video_id:
        raise ValueError("Invalid YouTube video URL.")

    youtube = build("youtube", "v3", developerKey=api_key)
    request = youtube.videos().list(part="statistics", id=video_id)
    response = request.execute()
    if "items" not in response:
        raise ValueError("Video statistics not available.")

    statistics = response["items"][0]["statistics"]
    return statistics  # type: ignore


def main(argv=None) -> int:

    parser = make_parser()
    args = parser.parse_args(argv)
    sentiment_results = evaluate_sentiment(args.video_url)
    print("\nSentiment Analysis Results:")
    print(sentiment_results)

    # Word cloud generation
    filename = "".join(random.choices(string.ascii_letters + string.digits, k=16)) + ".png"
    wordcloud = word_cloud(args.video_url, filename)
    
    plt.figure(figsize=(8, 8), facecolor=None)
    plt.imshow(wordcloud)
    plt.axis("off")
    plt.tight_layout(pad=0)
    plt.savefig(filename)

    # Display engagement metrics
    statistics = display_engagement_metrics(args.video_url)

    print("Engagement Metrics for Video ID:", get_video_id(args.video_url))
    print("Views:", statistics.get("viewCount", 0))
    print("Likes:", statistics.get("likeCount", 0))
    print("Dislikes:", statistics.get("dislikeCount", 0))
    print("Comments:", statistics.get("commentCount", 0))
    print("Shares:", statistics.get("shareCount", 0))
    os.remove("./comments.csv")

    print(filename)
    return 0


if __name__ == "__main__":
    sys.exit(main())
