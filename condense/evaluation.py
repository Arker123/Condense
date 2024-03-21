import re
import sys
from string import punctuation

import nltk
import emoji
import torch

from condense.sentiment_lstm import SentimentLSTM

path = "saved_models/model2.pth"


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
    print("Preprocessed comment:", comment)
    sequence = tokenizer.texts_to_sequences([comment])
    print("Tokenized sequence:", sequence)
    tensor = torch.LongTensor(sequence)
    print("Tensor representation:", tensor)
    # Pass the tensor through the model to get the predicted sentiment
    with torch.no_grad():
        output = model(tensor)
        _, predicted = torch.max(output, 1)
        print(predicted)
        sentiment_label = {1: "negative", 0: "neutral", 2: "positive"}
        predicted_sentiment = sentiment_label[predicted.item()]
        print("Predicted sentiment:", predicted_sentiment)


def main():
    checkpoint = torch.load(path)
    model = checkpoint["model"]
    tokenizer = checkpoint["tokenizer"]
    comment = input("Enter a comment: ")
    predict_sentiment(model, tokenizer, comment)


if __name__ == "__main__":
    sys.exit(main())
