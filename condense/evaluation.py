import re
import sys
import logging
import argparse

import nltk
import emoji
import torch

from condense.sentiment_lstm import SentimentLSTM

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

path = "saved_models/model2.pth"


def make_parser() -> argparse.ArgumentParser:
    """
    Create the argument parser.
    """
    parser = argparse.ArgumentParser(
        description="Get the sentiment of comment",
        formatter_class=argparse.RawTextHelpFormatter,
    )
    parser.add_argument(
        "-c",
        "--comment",
        dest="comment",
        type=str,
        required=True,
        help="comment to get the sentiment Info",
    )

    return parser


# Step 1: Data Preprocessing
def preprocess_data(comment):
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
def predict_sentiment(model, tokenizer, comment):
    comment = preprocess_data(comment)
    sequence = tokenizer.texts_to_sequences([comment])
    tensor = torch.LongTensor(sequence)

    # Pass the tensor through the model to get the predicted sentiment
    with torch.no_grad():
        output = model(tensor)
        _, predicted = torch.max(output, 1)
        sentiment_label = {1: "negative", 0: "neutral", 2: "positive"}
        predicted_sentiment = sentiment_label[predicted.item()]
        if predict_sentiment:
            logger.info("Predicted sentiment: %s", predicted_sentiment)
        else:
            logger.info("Sentiment could not be predicted.")


def main(argv: list[str] = None) -> None:
    logging.basicConfig(level=logging.DEBUG)
    parser = make_parser()
    argv = parser.parse_args(argv)

    nltk.download("punkt")
    checkpoint = torch.load(path)
    model = checkpoint["model"]
    tokenizer = checkpoint["tokenizer"]
    predict_sentiment(model, tokenizer, argv.comment)


if __name__ == "__main__":
    sys.exit(main())
