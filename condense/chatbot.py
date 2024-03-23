import sys
import logging
import argparse
from typing import List

import nltk
import torch
from transformers import BertTokenizer, BertForQuestionAnswering
from nltk.tokenize import sent_tokenize

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)


def make_parser() -> argparse.ArgumentParser:
    """
    Create the argument parser.
    """
    parser = argparse.ArgumentParser(
        description="Generate youtube comments",
        formatter_class=argparse.RawTextHelpFormatter,
    )
    parser.add_argument(
        "-s",
        "--summary",
        dest="summary",
        type=str,
        required=True,
        help="The summary of the video",
    )

    parser.add_argument(
        "-q",
        "--question",
        dest="question",
        type=str,
        required=True,
        help="The question to ask the chatbot",
    )

    return parser


def split_into_paragraphs(sentences: List[str], max_words: int = 350) -> List[str]:
    """
    Split the sentences into paragraphs based on the maximum number of words.

    :param sentences: The sentences to split into paragraphs
    :param max_words: The maximum number of words for each paragraph

    :return: The paragraphs
    """
    current_paragraph = []
    paragraphs = []
    for sentence in sentences:
        current_paragraph.append(sentence)
        word_count = sum(len(s.split()) for s in current_paragraph)

        if word_count >= max_words:
            paragraphs.append(" ".join(current_paragraph))
            current_paragraph = []

    if current_paragraph:
        paragraphs.append(" ".join(current_paragraph))
    return paragraphs


def answer_question(paragraph: str, question: str, model: BertForQuestionAnswering, tokenizer: BertTokenizer) -> str:
    """
    Answer a question based on the given paragraph.
    :param paragraph: The paragraph to answer the question from
    :param question: The question to ask the chatbot
    :param model: The BERT model to use
    :param tokenizer: The BERT tokenizer to use
    :return: The answer to the question
    """
    inputs = tokenizer(question, paragraph, return_tensors="pt")
    start_scores, end_scores = model(**inputs).values()
    answer_start = torch.argmax(start_scores)
    answer_end = torch.argmax(end_scores) + 1
    tokens = tokenizer.convert_ids_to_tokens(inputs["input_ids"][0])
    answer = tokenizer.convert_tokens_to_string(tokens[answer_start:answer_end])
    return answer


def interact_with_chatbot(summary: str, question: str) -> str:
    """
    Interact with the chatbot to ask a question about the summary.
    :param summary: The summary of the video
    :param question: The question to ask the chatbot
    :return: The answer to the question
    """
    nltk.download("punkt")

    # Load pre-trained BERT model and tokenizer
    model_name = "bert-large-uncased-whole-word-masking-finetuned-squad"
    model = BertForQuestionAnswering.from_pretrained(model_name)
    tokenizer = BertTokenizer.from_pretrained(model_name)

    sentences = sent_tokenize(summary)
    paragraphs = split_into_paragraphs(sentences)

    answers = []
    for paragraph in paragraphs:
        answer = answer_question(paragraph, question, model, tokenizer)
        answers.append(answer)

    filtered_answers = [
        answer for answer in answers if "[CLS]" not in answer and "[SEP]" not in answer and answer != ""
    ]

    try:
        final_answer = filtered_answers[0]
    except:
        raise ValueError("Could not find answer to that question")

    if final_answer == "":
        raise ValueError("Could not find answer to that question")

    return final_answer


def main(argv: list[str] = None) -> None:
    parser = make_parser()
    argv = parser.parse_args(argv)
    answer = interact_with_chatbot(argv.summary, argv.question)
    print(answer)


if __name__ == "__main__":
    sys.exit(main())
