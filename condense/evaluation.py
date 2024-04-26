import re
import sys
import logging
import argparse
from typing import Any

import nltk
import emoji
import torch
from transformers import PreTrainedModel, PreTrainedTokenizer

from comments import get_comments

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

path = "saved_models/SentimentModel.pth"


def make_parser() -> argparse.ArgumentParser:
    """
    Create the argument parser.
    """
    parser = argparse.ArgumentParser(
        description="Get the sentiment of comments extracted from a YouTube video",
        formatter_class=argparse.RawTextHelpFormatter,
    )
    parser.add_argument(
        "-v",
        "--video",
        dest="video_url",
        type=str,
        required=True,
        help="YouTube video URL to extract comments from",
    )
    parser.add_argument(
        "-c",
        "--csv",
        dest="csv_output",
        action="store_true",
        help="Store results in a CSV file (optional)",
    )

    return parser


# Step 1: Data Preprocessing
def preprocess_data(comment: str) -> str:
    comment = emoji.demojize(comment)
    comment = re.sub("[^a-zA-Z0-9.,;:()'`*\"\\s]", "", comment)
    comment = re.sub("\\s+", " ", comment)
    comment = comment.strip().lower()
    words = nltk.tokenize.word_tokenize(comment)
    words = ["like" if "heart" in word else word for word in words]
    words = ["smile" if "smile" in word else word for word in words]
    comment = " ".join(words)
    return comment


# Step 2: Predict Sentiment
def predict_sentiment(model: PreTrainedModel, tokenizer: PreTrainedTokenizer, comment: str) -> str:
    refined_comment = preprocess_data(comment)
    sequence = tokenizer.texts_to_sequences([refined_comment])
    tensor = torch.LongTensor(sequence)

    # Pass the tensor through the model to get the predicted sentiment
    with torch.no_grad():
        output = model(tensor)
        _, predicted = torch.max(output, 1)
        sentiment_label = {1: "negative", 0: "neutral", 2: "positive"}
        predicted_sentiment = sentiment_label[int(predicted.item())]

        return predicted_sentiment


def main(argv=None) -> str:
    logging.basicConfig(level=logging.DEBUG)
    parser = make_parser()
    args = parser.parse_args(argv)

    nltk.download("punkt")
    checkpoint = torch.load(path)
    model = checkpoint["model"]
    tokenizer = checkpoint["tokenizer"]

    # Extract comments from the YouTube video
    comments = get_comments(file=args.csv_output, video_url=args.video_url)

    # Perform sentiment analysis on each comment and count the results
    positive_count = 0
    negative_count = 0
    neutral_count = 0

    for comment in comments:
        sentiment = predict_sentiment(model, tokenizer, comment)
        if sentiment == "positive":
            positive_count += 1
        elif sentiment == "negative":
            negative_count += 1
        elif sentiment == "neutral":
            neutral_count += 1

    # Print or store the results
    sentiment_results = ""
    sentiment_results += "Positive comments: " + str(positive_count) + "\n"
    sentiment_results += "Negative comments: " + str(negative_count) + "\n"
    sentiment_results += "Neutral comments: " + str(neutral_count) + "\n"

    return sentiment_results


if __name__ == "__main__":
    sys.exit(main())
