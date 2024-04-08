# TODO: After Condense is made public, reuse the functions
import os
import re
import random
import shutil
import string
import logging

import nltk
import emoji
import torch
import whisper
import youtube_transcript_api
from flask import Flask, jsonify, request
from pytube import YouTube, exceptions
from langdetect import detect
from transformers import pipeline

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

app = Flask(__name__)

model_path = "./model"
model_path_sentiment = "saved_models/SentimentModel.pth"
checkpoint = torch.load(model_path_sentiment)
model_sentiment = checkpoint["model"]
tokenizer = checkpoint["tokenizer"]


def clean_data(data: list[str]) -> str:
    if data:
        sentences = []
        # Removing extra whitespaces
        for sentence in data:
            sentence = re.sub(
                "[^a-zA-Z0-9.,;:()'\"\\s]", "", sentence["text"]
            )  # Add special symbols to preserve inside the square brackets with numbers and characters
            sentence = re.sub("\\s+", " ", sentence)
            sentences.append(sentence.strip())
        display = " ".join(sentences)
        return display
    else:
        raise ValueError("No data found")


def generate(
    audio_stream, output_path: str, filename: str
) -> tuple[list[dict[str, str]], str]:
    """
    Generate the transcript for the audio stream.
    """
    audio_stream.download(output_path=output_path, filename=filename)
    logger.info(f"Audio downloaded to {output_path}/{filename}")

    model = whisper.load_model("base", download_root="./whisper")
    absolute_audio_path = os.path.join(output_path, filename)

    result = model.transcribe(absolute_audio_path)
    segments = result["segments"]

    transcribed_text = result["text"]

    language = detect(transcribed_text)
    logger.info(f"Detected language: {language}")

    return segments, language


def get_transcript_copy(video_url):
    if "youtube.com/watch?v=" in video_url:
        video_id_match = re.search(
            r"(?:https?://)?(?:www\.)?youtube\.com/watch\?v=(?P<url>[^&]+)", video_url
        )
    elif "youtu.be" in video_url:
        video_id_match = re.search(
            r"(?:https?://)?(?:www\.)?youtu\.be/(?P<url>[^&]+)", video_url
        )

    if video_id_match:
        video_id = video_id_match.group("url")
    else:
        raise ValueError("Invalid YouTube URL.")

    transcript = None
    try:
        transcript = youtube_transcript_api.YouTubeTranscriptApi.get_transcript(
            video_id
        )
    except youtube_transcript_api._errors.TranscriptsDisabled:
        logger.info(
            "Transcripts are disabled for this video, using audio to text instead."
        )

    if transcript:
        captions = []
        for segment in transcript:
            start = segment["start"]
            end = segment["start"] + segment["duration"]
            text = segment["text"]
            captions.append({"start": start, "end": end, "text": text})
        return captions
    else:
        captions, _ = get_transcript_from_video(video_url)
        if captions == "Age_restriction":
            return jsonify(code=403, message="Age restiction Error")
        return captions


def get_transcript_from_video(video_url: str) -> tuple[list[dict[str, str]], str]:
    """
    Get the transcript for the video.
    """
    yt = YouTube(video_url)
    try:
        audio_stream = yt.streams.filter(only_audio=True).first()
    except exceptions.AgeRestrictedError:
        return "Age_restriction", "Error"

    # Create directory if it doesn't exist
    output_path = "audio"
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    filename = (
        "".join(random.choices(string.ascii_letters + string.digits, k=16)) + ".mp3"
    )
    text, lang = generate(audio_stream, output_path, filename)

    shutil.rmtree(output_path)

    return text, lang


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


def predict_sentiment(comment):
    comment = preprocess_data(comment)
    sequence = tokenizer.texts_to_sequences([comment])
    tensor = torch.LongTensor(sequence)

    with torch.no_grad():
        output = model_sentiment(tensor)
        _, predicted = torch.max(output, 1)
        sentiment_label = {1: "negative", 0: "neutral", 2: "positive"}
        return sentiment_label.get(predicted.item(), "unknown")


@app.route("/")
def hello_world():
    """Example Hello World route."""
    name = os.environ.get("NAME", "World")
    return f"Hello3 {name}!"


@app.route("/summarize")
def summarize():
    data = request.args.get("summarize")
    api_key = request.args.get("api_key")
    if data is None or api_key != "xxx":
        return jsonify(code=403, message="bad request")
    summarizer = pipeline("summarization", model=model_path, tokenizer=model_path)
    max_chunk_length = 400  # Define the maximum length for each chunk
    chunks = [
        data[i : i + max_chunk_length] for i in range(0, len(data), max_chunk_length)
    ]
    summary = []
    for chunk in chunks:
        summary_text = summarizer(chunk, max_length=50, min_length=10, do_sample=False)[
            0
        ]["summary_text"]
        summary.append(summary_text)
    return " ".join(summary)


@app.route("/transcript")
def get_transcript():
    video_url = request.args.get("video_url")
    api_key = request.args.get("api_key")
    if video_url is None or api_key != "xxx":
        return jsonify(code=403, message="bad request")
    if "youtube.com/watch?v=" in video_url:
        video_id_match = re.search(
            r"(?:https?://)?(?:www\.)?youtube\.com/watch\?v=(?P<url>[^&]+)", video_url
        )
    elif "youtu.be" in video_url:
        video_id_match = re.search(
            r"(?:https?://)?(?:www\.)?youtu\.be/(?P<url>[^&]+)", video_url
        )

    if video_id_match:
        video_id = video_id_match.group("url")
    else:
        raise ValueError("Invalid YouTube URL.")

    transcript = None
    try:
        transcript = youtube_transcript_api.YouTubeTranscriptApi.get_transcript(
            video_id
        )
    except youtube_transcript_api._errors.TranscriptsDisabled:
        logger.info(
            "Transcripts are disabled for this video, using audio to text instead."
        )

    transcript = None

    if transcript:
        captions = []
        for segment in transcript:
            start = segment["start"]
            end = segment["start"] + segment["duration"]
            text = segment["text"]
            captions.append({"start": start, "end": end, "text": text})
        return captions
    else:
        captions, _ = get_transcript_from_video(video_url)
        if captions == "Age_restriction":
            return jsonify(code=403, message="Age restiction Error")
        return captions


@app.route("/summerize_text")
def summerize_text() -> str:
    video_url = request.args.get("video_url")
    api_key = request.args.get("api_key")
    if video_url is None or api_key != "xxx":
        return jsonify(code=403, message="bad request")
    nltk.download("punkt")
    data = get_transcript_copy(video_url)
    data_clean = clean_data(data)
    sentences = nltk.tokenize.sent_tokenize(data_clean)
    data = " ".join(sentences)

    summarizer = pipeline("summarization", model=model_path, tokenizer=model_path)
    max_chunk_length = 400  # Define the maximum length for each chunk
    chunks = [
        data[i : i + max_chunk_length] for i in range(0, len(data), max_chunk_length)
    ]
    summary = []
    for chunk in chunks:
        summary_text = summarizer(chunk, max_length=50, min_length=10, do_sample=False)[
            0
        ]["summary_text"]
        summary.append(summary_text)
    return " ".join(summary)


@app.route("/analyze_sentiment", methods=["POST"])
def analyze_sentiment():
    data = request.get_json()
    comment = data.get("comment")

    if not comment:
        return jsonify({"error": "Comment not provided"}), 400

    sentiment = predict_sentiment(comment)
    return jsonify({"sentiment": sentiment})


@app.route("/test")
def test_route():
    """Test route."""
    return jsonify(code=200, message="The link is working")


if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
