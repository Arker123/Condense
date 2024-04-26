
# Copyright (C) 2024 Condense, Inc. All Rights Reserved.

import pytest
from unittest.mock import MagicMock
from condense.summarizer import (
    make_parser,
    load_summarize_model,
    clean_data,
    get_summary,
    summerize_text,
    get_summary_from_transcript,
)

@pytest.fixture
def mocked_data():
    return [
        {"start": 0.0, "end": 10.0, "text": "This is a test test test test sentence."},
        {"start": 10.0, "end": 20.0, "text": "Another test test test test test sentence."},
    ]

@pytest.fixture
def mocked_summarizer():
    return MagicMock()


def test_make_parser():
    parser = make_parser()
    assert parser is not None


def test_load_summarize_model():
    model = load_summarize_model()
    assert model is not None


def test_clean_data(mocked_data):
    print(mocked_data)
    cleaned_data = clean_data(mocked_data, check_meet=0)
    print(cleaned_data)
    assert len(cleaned_data) == 2
    assert cleaned_data[0]["text"] == "This is a test sentence."
    assert cleaned_data[1]["text"] == "Another test sentence."


def test_get_summary(mocked_data, mocked_summarizer):
    mocked_summarizer.return_value = [{"summary_text": "Summary."}]
    summary, time_stamp = get_summary(mocked_data, mocked_summarizer, check_meet=0)
    assert len(summary) == 2
    assert summary[0]["summary_text"] == "Summary."
    assert summary[1]["summary_text"] == "Summary."


def test_summerize_text(monkeypatch, mocked_data):
    monkeypatch.setattr("condense.summarizer.get_transcript", lambda url: mocked_data)
    mocked_summarizer = MagicMock()
    mocked_summarizer.return_value = ([], [])
    summary, time_stamp = summerize_text("https://example.com/video")
    assert summary == []
    assert time_stamp == []


def test_get_summary_from_transcript(mocked_data, mocked_summarizer):
    mocked_summarizer.return_value = [{"summary_text": "Summary."}]
    summary, time_stamp = get_summary_from_transcript(mocked_data, mocked_summarizer, check_meet=0)
    assert len(summary) == 2
    assert summary[0]["summary_text"] == "Summary."
    assert summary[1]["summary_text"] == "Summary."
