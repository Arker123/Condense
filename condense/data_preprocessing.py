import re
import sys

import nltk
import emoji
import pandas as pd


def preprocess_data(comment: str) -> str:
    """
    This function preprocesses the input comment by:
    - Converting emojis to text representations
    - Removing special characters except for selected punctuation
    - Normalizing whitespace
    - Converting text to lowercase
    - Replacing specific emoji-related words with standardized tokens ('like' for 'heart', 'smile' for 'smile')

    Parameters:
        comment (str): The input comment to preprocess.

    Returns:
        str: The preprocessed comment.
    """
    comment = emoji.demojize(comment)
    comment = re.sub("[^a-zA-Z0-9.,;:()'*`\"\\s]", "", comment)
    comment = re.sub("\\s+", " ", comment)
    comment = comment.strip().lower()
    words = nltk.tokenize.word_tokenize(comment)
    words = ["like" if "heart" in word else word for word in words]
    words = ["smile" if "smile" in word else word for word in words]
    comment = " ".join(words)
    return comment


def main():
    nltk.download("punkt")
    # https://www.kaggle.com/datasets/abhi8923shriv/sentiment-analysis-dataset?select=train.csv
    data = pd.read_csv("train.csv")
    data.dropna(inplace=True)
    data = data.drop(
        [
            "Density",
            "Land Area",
            "Population -2020",
            "Country",
            "Age of User",
            "Time of Tweet",
            "textID",
            "text",
        ],
        axis=1,
    )
    data.rename(columns={"selected_text": "comment"}, inplace=True)
    data["comment"] = data["comment"].apply(preprocess_data)


if __name__ == "__main__":
    sys.exit(main())
