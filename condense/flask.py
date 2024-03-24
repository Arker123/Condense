from flask import Flask, request, jsonify
import re
import sys
import nltk
import torch
from condense.sentiment_lstm import SentimentLSTM
from nltk.tokenize import word_tokenize
from emoji import demojize

app = Flask(__name__)

# Load the PyTorch model
model_path = "condense/saved_models/model2.pth"
model = torch.load(model_path)
model.eval()

def preprocess_data(comment):
    comment = demojize(comment)
    comment = re.sub("[^a-zA-Z0-9.,;:()'`*\"\\s]", "", comment)
    comment = re.sub("\\s+", " ", comment)
    comment = comment.strip().lower()
    words = word_tokenize(comment)
    words = ["like" if "heart" in word else word for word in words]
    words = ["smile" if "smile" in word else word for word in words]
    comment = " ".join(words)
    return comment

def predict_sentiment(model, tokenizer, comment):
    comment = preprocess_data(comment)
    sequence = tokenizer.texts_to_sequences([comment])
    tensor = torch.LongTensor(sequence)
    with torch.no_grad():
        output = model(tensor)
        _, predicted = torch.max(output, 1)
        sentiment_label = {1: "negative", 0: "neutral", 2: "positive"}
        predicted_sentiment = sentiment_label[predicted.item()]
    return predicted_sentiment


@app.route('/predict_sentiment', methods=['POST'])
def predict_sentiment_api():
    if request.method == 'POST':
        try:
            comment = request.json['comment']
            checkpoint = torch.load(model_path)
            model = checkpoint["model"]
            tokenizer = checkpoint["tokenizer"]
            sentiment = predict_sentiment(model, tokenizer, comment)
            return jsonify({'sentiment': sentiment})
        except Exception as e:
            return jsonify({'error': str(e)})

if __name__ == "__main__":
    nltk.download("punkt")
    app.run(debug=True)

