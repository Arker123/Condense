import re
import sys
import logging
import argparse
from typing import Any

import nltk
import emoji
import torch
from comments import main as comments_main  # Import the main function from comments.py
from langdetect import detect
from transformers import PreTrainedModel, PreTrainedTokenizer

from condense.sentiment_lstm import SentimentLSTM

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
        "--url",
        dest="video_url",
        type=str,
        required=True,
        help="YouTube video URL to extract comments from",
    )
    output_group = parser.add_argument_group("rendering arguments")
    output_group.add_argument("-c", "--csv", action="store_true", help="emit CSV instead of JSON")

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
    if len(sequence[0]) == 0:
        return "neutral"
    tensor = torch.LongTensor(sequence)

    # Pass the tensor through the model to get the predicted sentiment
    with torch.no_grad():
        output = model(tensor)
        _, predicted = torch.max(output, 1)
        sentiment_label = {1: "negative", 0: "neutral", 2: "positive"}
        predicted_sentiment = sentiment_label[int(predicted.item())]

        return predicted_sentiment


def main(argv=None) -> str:
    nltk.download("punkt")
    checkpoint = torch.load(path)
    model = checkpoint["model"]
    tokenizer = checkpoint["tokenizer"]

    comments = comments_main(argv)

    positive_count = 0
    negative_count = 0
    neutral_count = 0

    for comment in comments:
        sentiment = predict_sentiment(model, tokenizer, comment[0])
        if sentiment == "positive":
            positive_count += 1
        elif sentiment == "negative":
            negative_count += 1
        elif sentiment == "neutral":
            neutral_count += 1

    sentiment_results = ""
    sentiment_results += "Positive comments: " + str(positive_count) + "\n"
    sentiment_results += "Negative comments: " + str(negative_count) + "\n"
    sentiment_results += "Neutral comments: " + str(neutral_count) + "\n"
    print(sentiment_results)
    return sentiment_results


if __name__ == "__main__":
    sys.exit(main())
