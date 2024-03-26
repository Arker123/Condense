import os
import re
import sys
import logging
from typing import Tuple
from datetime import datetime

import nltk
import emoji
import numpy as np
import torch
import pandas as pd
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

from condense.sentiment_lstm import SentimentLSTM


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


def train_model(
    model: torch.nn.Module, criterion, optimizer, train_loader: torch.utils.data.DataLoader, num_epochs: int = 20
) -> None:
    """
    This function trains the specified model using the provided criterion and optimizer on the training data.

    Parameters:
        model (torch.nn.Module): The PyTorch model to train.
        criterion: The loss criterion used for optimization.
        optimizer: The optimizer used to update the model parameters.
        train_loader (torch.utils.data.DataLoader): DataLoader for the training dataset.
        num_epochs (int): Number of training epochs (default is 20).
    """
    for epoch in range(num_epochs):
        model.train()
        t0 = datetime.now()
        for inputs, labels in train_loader:
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
        dt = datetime.now() - t0
        logger.info(f"Epoch [{epoch+1}/{num_epochs}], Loss: {loss.item():.4f}, Duration:{dt}")


def evaluate_model(model: torch.nn.Module, test_loader: torch.utils.data.DataLoader) -> None:
    """
    This function evaluates the performance of the trained model on the test dataset and prints the accuracy.

    Parameters:
        model (torch.nn.Module): The trained PyTorch model to evaluate.
        test_loader (torch.utils.data.DataLoader): DataLoader for the test dataset.
    """
    model.eval()
    correct = 0
    total = 0
    with torch.no_grad():
        for inputs, labels in test_loader:
            outputs = model(inputs)
            _, predicted = torch.max(outputs, 1)
            total += labels.size(0)
            correct += (predicted == labels.argmax(dim=1)).sum().item()
    accuracy = correct / total
    print(f"Accuracy: {accuracy:.4f}")


def save_model(model: torch.nn.Module, tokenizer: Tokenizer) -> None:
    """
    This function saves the trained model and tokenizer to a file.

    Parameters:
        model (torch.nn.Module): The trained PyTorch model to save.
        tokenizer: The tokenizer used to preprocess the text data.
    """
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
    torch.save({"model": model, "tokenizer": tokenizer}, model_save_path)
    print(f"Model saved at: {model_save_dir}")


def set_model(data: pd.DataFrame, padded_sequences: np.ndarray, vocab_size: int, tokenizer: Tokenizer) -> None:
    """
    This function sets up the model architecture, loss criterion, optimizer, and data loaders,
    then trains and evaluates the model.

    Parameters:
        data (pd.DataFrame): The preprocessed DataFrame containing text comments and sentiments.
        padded_sequences (np.ndarray): The padded sequence data for the text comments.
        vocab_size (int): The size of the vocabulary.
        tokenizer: The tokenizer used to preprocess the text data.
    """
    labels = pd.get_dummies(data["sentiment"]).values
    X_train, X_test, y_train, y_test = train_test_split(padded_sequences, labels, test_size=0.1)
    embedding_dim = 128
    hidden_dim = 256
    output_dim = 3
    num_layers = 5
    dropout = 0.3
    model = SentimentLSTM(vocab_size, embedding_dim, hidden_dim, output_dim, num_layers, dropout)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)

    X_train_tensor = torch.tensor(X_train, dtype=torch.long)
    X_test_tensor = torch.tensor(X_test, dtype=torch.long)
    y_train_tensor = torch.tensor(y_train, dtype=torch.float)
    y_test_tensor = torch.tensor(y_test, dtype=torch.float)

    train_dataset = torch.utils.data.TensorDataset(X_train_tensor, y_train_tensor)
    train_loader = torch.utils.data.DataLoader(train_dataset, batch_size=32, shuffle=True)

    test_dataset = torch.utils.data.TensorDataset(X_test_tensor, y_test_tensor)
    test_loader = torch.utils.data.DataLoader(test_dataset, batch_size=32, shuffle=False)

    train_model(model, criterion, optimizer, train_loader)
    evaluate_model(model, test_loader)
    save_model(model, tokenizer)


def tokenized_text(data: pd.DataFrame) -> Tuple[np.ndarray, int, Tokenizer]:
    """
    This function tokenizes the text comments using Keras Tokenizer and pads sequences to ensure uniform length.

    Parameters:
        data (pd.DataFrame): The DataFrame containing text comments.

    Returns:
        np.ndarray: Padded sequences of tokenized text comments.
        int: Vocabulary size.
        tokenizer: The tokenizer used for tokenization.
    """
    tokenizer = Tokenizer()
    tokenizer.fit_on_texts(data["comment"])
    sequences = tokenizer.texts_to_sequences(data["comment"])
    max_length = max([len(seq) for seq in sequences])
    padded_sequences = pad_sequences(sequences, maxlen=max_length, padding="post")
    vocab_size = len(tokenizer.word_index) + 1
    return padded_sequences, vocab_size, tokenizer


def main():
    nltk.download("punkt")
    data = pd.read_csv("train.csv")
    data.dropna(inplace=True)
    data = data.drop(
        ["Density", "Land Area", "Population -2020", "Country", "Age of User", "Time of Tweet", "textID", "text"],
        axis=1,
    )
    data.rename(columns={"selected_text": "comment"}, inplace=True)
    data["comment"] = data["comment"].apply(preprocess_data)
    padded_sequence, vocab_size, tokenizer = tokenized_text(data)
    set_model(data, padded_sequence, vocab_size, tokenizer)


if __name__ == "__main__":
    sys.exit(main())
