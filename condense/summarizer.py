import os
import re
import sys

from transformers import pipeline
from nltk.tokenize import sent_tokenize


def clean_data(data) -> int:
    if data:
        sentences = []
        # Removing special characters and extra whitespaces
        for sentence in data:
            print(sentence)
            sentence = re.sub("[^a-zA-Z]", " ", sentence["text"])
            sentence = re.sub("\\s+", " ", sentence)
            sentences.append(sentence.strip())
        display = ". ".join(sentences)
        return display
    else:
        print(f"data not found")
        return False


def summerize_text(data):
    summarizer = pipeline("summarization")
    max_chunk_length = 400  # Define the maximum length for each chunk
    chunks = [data[i : i + max_chunk_length] for i in range(0, len(data), max_chunk_length)]
    summary = []
    for chunk in chunks:
        summary_text = summarizer(chunk, max_length=100, min_length=20, do_sample=False)[0]["summary_text"]
        summary.append(summary_text)
    return " ".join(summary)


def save_file(summary) -> int:
    text_count = 0
    output_path = "summaries"
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    text_filename = "summary.txt"
    while os.path.exists(os.path.join(output_path, text_filename)):
        text_count += 1
        text_filename = f"summary{text_count}.txt"

    with open(os.path.join(output_path, text_filename), mode="w", encoding="utf-8") as text_file:
        text_file.write(summary)
        return True


def main(args: list[str] = None) -> int:
    data = clean_data(args)
    sentences = sent_tokenize(data)

    text = " ".join(sentences)
    summary = summerize_text(text)
    save_file(summary)
    return True


if __name__ == "__main__":
    sys.exit(main())
