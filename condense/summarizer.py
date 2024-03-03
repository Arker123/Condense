import os
import re
import sys

from transformers import pipeline
from nltk.tokenize import sent_tokenize


def clean_data(file_name):
    try:
        with open(file_name, "r") as file:
            filedata = file.read()
        article = filedata.split(". ")
        sentences = []
        # Removing special characters and extra whitespaces
        for sentence in article:
            sentence = re.sub("[^a-zA-Z]", " ", sentence)
            sentence = re.sub("\\s+", " ", sentence)
            sentences.append(sentence.strip())
        display = ". ".join(sentences)
        return display
    except FileNotFoundError:
        print(f"File not found: {file_name}")


def summerize_text(data):
    summarizer = pipeline("summarization")
    max_chunk_length = 400  # Define the maximum length for each chunk
    chunks = [data[i : i + max_chunk_length] for i in range(0, len(data), max_chunk_length)]
    summary = []
    for chunk in chunks:
        summary_text = summarizer(chunk, max_length=100, min_length=20, do_sample=False)[0]["summary_text"]
        summary.append(summary_text)
    return " ".join(summary)


def save_file(summary):
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


def main(args):
    output_path = "transcripts"
    if not os.path.exists(output_path):
        print("directory not in sys.path")
        return False

    folder_name = "transcripts"
    file_name = os.path.join(folder_name, args)

    data = clean_data(file_name)
    sentences = sent_tokenize(data)

    text = " ".join(sentences)
    summary = summerize_text(text)
    save_file(summary)


if __name__ == "__main__":
    args = sys.argv
    main(args)
    sys.exit(main())
