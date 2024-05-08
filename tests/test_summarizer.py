# Copyright (C) 2024 Condense, Inc. All Rights Reserved.

from unittest.mock import MagicMock

import pytest

from condense.summarizer import (
    clean_data,
    get_summary,
    make_parser,
    summerize_text,
    load_summarize_model,
    get_summary_from_transcript,
)

# import pytest


input_data = [
    {"start": 0.0, "end": 10.0, "text": "Excessive whitespace!"},
    {"start": 10.0, "end": 20.0, "text": "Excessive  whitespace!"},
    {"start": 20.0, "end": 30.0, "text": "Excessive   whitespace!"},
    {"start": 30.0, "end": 40.0, "text": "Excessive    whitespace!"},
    {"start": 40.0, "end": 50.0, "text": "Excessive      whitespace!"},
    {"start": 50.0, "end": 60.0, "text": "Excessive    whitespace!"},
    {"start": 60.0, "end": 70.0, "text": "Excessive     whitespace!"},
    {"start": 70.0, "end": 80.0, "text": "Excessive       whitespace!"},
    {"start": 80.0, "end": 90.0, "text": "Excessive         whitespace!"},
    {"start": 90.0, "end": 100.0, "text": "Excessive    whitespace!"},
    {"start": 100.0, "end": 110.0, "text": "Excessive      whitespace!"},
    {"start": 110.0, "end": 120.0, "text": "Excessive         whitespace!"},
]


@pytest.fixture
def mocked_summarizer():
    return MagicMock()


def test_clean_data():
    expected_output = [
        {
            "start": 0.0,
            "end": 120.0,
            "text": "Excessive whitespace Excessive whitespace Excessive whitespace Excessive whitespace Excessive whitespace Excessive whitespace Excessive whitespace Excessive whitespace Excessive whitespace Excessive whitespace Excessive whitespace Excessive whitespace",
        }
    ]
    assert clean_data(input_data, 0) == expected_output


def test_make_parser():
    parser = make_parser()
    assert parser is not None


def test_load_summarize_model():
    model = load_summarize_model()
    assert model is not None


def test_get_summary(mocked_summarizer):
    mocked_summarizer.return_value = [{"summary_text": "Summary."}]
    summary, time_stamp = get_summary(input_data, mocked_summarizer, check_meet=0)
    print(summary)
    assert len(summary) == 12
    assert summary[0]["summary_text"] == "Summary."
    assert summary[1]["summary_text"] == "Summary."


def test_summerize_text(monkeypatch):
    monkeypatch.setattr("condense.summarizer.get_transcript", lambda url: input_data)
    mocked_summarizer = MagicMock()
    mocked_summarizer.return_value = (
        [
            {
                "start": 0.0,
                "end": 120.0,
                "summary_text": " Excessive whitespace is the result of excessive over-consumption of space . Excessive white spacespace is a sign of excessive use of space and resources . The space is so large that space can be filled with space .",
            }
        ],
        [],
    )
    summary, time_stamp = summerize_text("https://example.com/video")
    assert summary == [
        {
            "start": 0.0,
            "end": 120.0,
            "summary_text": " Excessive whitespace is the result of excessive over-consumption of space . Excessive white spacespace is a sign of excessive use of space and resources . The space is so large that space can be filled with space .",
        }
    ]


def test_get_summary_from_transcript(mocked_summarizer):
    mocked_summarizer.return_value = [{"summary_text": "Summary."}]
    summary, time_stamp = get_summary_from_transcript(input_data, mocked_summarizer, check_meet=0)
    assert len(summary) == 1
    assert summary[0]["summary_text"] == "Summary."
