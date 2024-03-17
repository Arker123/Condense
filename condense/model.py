import os
import re
import sys
import logging
import argparse
from string import punctuation
from collections import Counter

import nltk
import emoji
import numpy as np
import torch
import pandas as pd
import torch.nn as nn
import torch.optim as optim
import torch.nn.utils.rnn as rnn_utils
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split


# Step 1: Data Preprocessing
def preprocess_data(comment):
    comment = emoji.demojize(comment)
    comment = re.sub(r"(:[\w_]+:)", r" \1 ", comment)
    comment = comment.strip().lower()
    comment = re.sub("[%s]" % re.escape(punctuation), "", comment)
    comment = re.sub(r"[^\w\s\:\d]", "", comment)
    words = nltk.tokenize.word_tokenize(comment)
    comment = " ".join(words)
    return comment


# Step 2: Prepare the Data
def prepare_data(tokenized_comments):
    all_words = [word for comment in tokenized_comments for word in comment.split()]
    word_counts = Counter(all_words)
    sorted_vocab = sorted(word_counts, key=word_counts.get, reverse=True)
    word_to_index = {word: i + 1 for i, word in enumerate(sorted_vocab)}
    numerical_comments = [[word_to_index[word] for word in comment.split()] for comment in tokenized_comments]
    return numerical_comments, word_to_index


# Step 3: Define the Model
class SentimentLSTM(nn.Module):
    def __init__(self, vocab_size, embedding_dim, hidden_dim, output_dim, num_layers, dropout):
        super(SentimentLSTM, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embedding_dim)
        self.lstm = nn.LSTM(embedding_dim, hidden_dim, num_layers, dropout=dropout, batch_first=True)
        self.fc = nn.Linear(hidden_dim, output_dim)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x):
        embedded = self.embedding(x)
        lstm_out, _ = self.lstm(embedded)
        lstm_out = self.dropout(lstm_out)
        output = self.fc(lstm_out[:, -1, :])  # get output from last time step
        return output


# Step 4: Training the Model
def train_model(model, criterion, optimizer, train_loader, num_epochs=20):
    for epoch in range(num_epochs):
        model.train()
        for inputs, labels in train_loader:
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
        print(f"Epoch [{epoch+1}/{num_epochs}], Loss: {loss.item():.4f}")


# evaluate model
def evaluate_model(model, test_loader):
    model.eval()
    correct = 0
    total = 0
    with torch.no_grad():
        for inputs, labels in test_loader:
            outputs = model(inputs)
            _, predicted = torch.max(outputs, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()
    accuracy = correct / total
    print(f"Accuracy: {accuracy:.4f}")


def sentiment(data):
    nltk.download("vader_lexicon")
    sentiments = SentimentIntensityAnalyzer()
    data["Positive"] = [sentiments.polarity_scores(i)["pos"] for i in data["comment"]]
    data["Negative"] = [sentiments.polarity_scores(i)["neg"] for i in data["comment"]]
    data["Neutral"] = [sentiments.polarity_scores(i)["neu"] for i in data["comment"]]
    data["Compound"] = [sentiments.polarity_scores(i)["compound"] for i in data["comment"]]
    score = data["Compound"].values
    sentiment = []
    for i in score:
        if i >= 0.02:
            sentiment.append("Positive")
        elif i <= -0.05:
            sentiment.append("Negative")
        else:
            sentiment.append("Neutral")
    data["Sentiment"] = sentiment
    return data


def save_model(model, word_to_index):
    model_save_dir = "saved_models"
    filename = "model1.pth"
    if not os.path.exists(model_save_dir):
        os.makedirs(model_save_dir)

    counter = 1
    model_save_path = os.path.join(model_save_dir, filename)
    while os.path.exists(model_save_path):
        counter += 1
        filename = f"model{counter}.pth"
        model_save_path = os.path.join(model_save_dir, filename)

    torch.save({"model": model, "word_to_index": word_to_index}, model_save_path)
    print(f"Model saved at: {model_save_dir}")


def set_model(data):
    X = data["comment"]
    y = data["Sentiment"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    numerical_train_comments, word_to_index = prepare_data(X_train)
    numerical_test_comments, _ = prepare_data(X_test)

    # Convert lists of numerical sequences to PyTorch tensors
    X_train_tensor = rnn_utils.pad_sequence(
        [torch.LongTensor(comment) for comment in numerical_train_comments],
        batch_first=True,
        padding_value=0,
    )
    X_test_tensor = rnn_utils.pad_sequence(
        [torch.LongTensor(comment) for comment in numerical_test_comments],
        batch_first=True,
        padding_value=0,
    )

    vocab_size = len(word_to_index) + 1
    embedding_dim = 100
    hidden_dim = 256
    output_dim = 3
    num_layers = 5
    dropout = 0.3
    model = SentimentLSTM(vocab_size, embedding_dim, hidden_dim, output_dim, num_layers, dropout)

    train_loader = torch.utils.data.DataLoader(list(zip(X_train_tensor, y_train)), batch_size=4, shuffle=True)
    test_loader = torch.utils.data.DataLoader(list(zip(X_test_tensor, y_test)), batch_size=4, shuffle=False)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)

    train_model(model, criterion, optimizer, train_loader)
    save_model(model, word_to_index)
    evaluate_model(model, test_loader)


def main():
    nltk.download("punkt")
    data = pd.read_csv("comments.csv")
    data = data.drop(["author_display_name", "comment_like_count"], axis=1)
    data.comment = data.comment.apply(lambda text: preprocess_data(text))
    data1 = sentiment(data)
    data2 = data1.drop(["Positive", "Negative", "Neutral", "Compound"], axis=1)

    nltk.download("omw-1.4")
    tokenized_comments = data2.copy()
    tokenized_comments.comment = tokenized_comments.comment.apply(lambda text: preprocess_data(text))
    le = LabelEncoder()
    tokenized_comments["Sentiment"] = le.fit_transform(tokenized_comments["Sentiment"])

    set_model(tokenized_comments)


if __name__ == "__main__":
    sys.exit(main())
