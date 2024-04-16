import pytest
import argparse
from unittest.mock import MagicMock, patch
from condense.summarizer import make_parser, clean_data, get_summary_from_transcript, summerize_text, main

# Define sample data for testing
sample_transcript_data = [
    {"start": 0, "end": 10, "text": "Hello,  world!   This is a test."},
    {"start": 10, "end": 20, "text": "Another sentence goes here."},
    {"start": 20, "end": 30, "text": ""}
]

def test_make_parser():
    # Test argument parser creation
    parser = make_parser()
    assert isinstance(parser, argparse.ArgumentParser)

def test_clean_data():
    # Test data cleaning function
    cleaned_data = clean_data(sample_transcript_data)

@patch('condense.summarizer.get_transcript', return_value=sample_transcript_data)
@patch('condense.summarizer.get_summary_from_transcript', return_value=([{"summary_text": "Summarized text", "start": 0, "end": 10}], []))
def test_summarize_text(mock_get_summary_from_transcript, mock_get_transcript):
    # Test summerize_text function
    video_url = "https://example.com/video"
    summary, time_stamp = summerize_text(video_url)
    mock_get_transcript.assert_called_once_with(video_url)
    mock_get_summary_from_transcript.assert_called_once_with(sample_transcript_data)
    assert summary == [{"summary_text": "Summarized text", "start": 0, "end": 10}]
    assert time_stamp == []

@patch('condense.summarizer.clean_data', return_value=sample_transcript_data)
@patch('condense.summarizer.get_summary')
def test_get_summary_from_transcript(mock_get_summary, mock_clean_data):
    # Test get_summary_from_transcript function
    summary_text = "Summarized text"
    mock_get_summary.return_value = ([{"summary_text": summary_text, "start": 0, "end": 10}], [])
    summary, time_stamp = get_summary_from_transcript(sample_transcript_data)
    print(summary,time_stamp)
    assert summary == [{"summary_text": summary_text, "start": 0, "end": 10}]
    assert time_stamp == []

@patch('condense.summarizer.summerize_text', return_value=([{"summary_text": "Summarized text", "start": 0, "end": 10}], []))
@patch('condense.summarizer.make_parser')
def test_main(mock_make_parser, mock_summerize_text):
    # Test main function
    mock_make_parser.return_value.parse_args.return_value = MagicMock(video_url="https://example.com/video")
    with patch("builtins.print") as mock_print:
        main()
        mock_print.assert_called_with({"summary": "Summarized text", "time_stamp": []})
