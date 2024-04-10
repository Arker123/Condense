# Copyright (C) 2024 Condense, Inc. All Rights Reserved.
import pytest
from unittest.mock import patch, MagicMock
from condense.transcript import make_parser, get_transcript , main  
import youtube_transcript_api

def test_argument_parser():
    parser = make_parser()
    args_json = ["-u", "https://youtube.com/watch?v=video_id", "--json"]
    args_text = ["-u", "https://youtube.com/watch?v=video_id", "--text"]
    args_csv = ["-u", "https://youtube.com/watch?v=video_id", "--csv"]

    parsed_json = parser.parse_args(args_json)
    parsed_text = parser.parse_args(args_text)
    parsed_csv = parser.parse_args(args_csv)

    assert parsed_json.video_url == "https://youtube.com/watch?v=video_id" and parsed_json.json
    assert parsed_text.video_url == "https://youtube.com/watch?v=video_id" and parsed_text.text
    assert parsed_csv.video_url == "https://youtube.com/watch?v=video_id" and parsed_csv.csv

@patch('condense.transcript.youtube_transcript_api.YouTubeTranscriptApi.get_transcript')
def test_get_transcript_success(mock_get_transcript):
    # Setup the mock to return a successful response
    mock_transcript = [{'start': 0, 'duration': 5, 'text': 'Hello world'}]
    mock_get_transcript.return_value = mock_transcript

    # Call the function under test
    video_url = 'https://youtube.com/watch?v=video_id'
    result = get_transcript(video_url)

    # Assert the function returned the correct value
    assert result == [{'start': 0, 'end': 5, 'text': 'Hello world'}]
    mock_get_transcript.assert_called_once_with('video_id')

@patch('condense.transcript.youtube_transcript_api.YouTubeTranscriptApi.get_transcript')
def test_get_transcript_failure(mock_get_transcript):
    # Setup the mock to raise an exception, simulating an API failure
    mock_get_transcript.side_effect = youtube_transcript_api.CouldNotRetrieveTranscript('video_id')

    # Call the function and expect it to handle the exception or pass it through
    video_url = 'https://youtube.com/watch?v=video_id'

    # If your function has a fallback or error handling, you would assert that behavior here
    # If it's supposed to raise the exception, you can check that it does
    with pytest.raises(youtube_transcript_api.CouldNotRetrieveTranscript):
        get_transcript(video_url)

    mock_get_transcript.assert_called_once_with('video_id')

@patch('condense.transcript.save_to_file')
@patch('condense.transcript.get_transcript')
@patch('condense.transcript.make_parser')
def test_main(mock_make_parser, mock_get_transcript, mock_save_to_file):
    mock_args = MagicMock(video_url="https://youtube.com/watch?v=video_id", json=True)
    mock_make_parser.return_value.parse_args.return_value = mock_args
    mock_transcript = [{'start': 0, 'end': 5, 'text': 'Hello world'}]
    mock_get_transcript.return_value = mock_transcript

    # Testing successful execution
    assert main([]) == 0
    mock_get_transcript.assert_called_once_with(mock_args.video_url)
    mock_save_to_file.assert_called_once_with(mock_transcript, mock_args)

    # Testing execution with an error in get_transcript
    mock_get_transcript.side_effect = Exception("Unexpected error")
    with pytest.raises(Exception) as exc_info:
        main([])
    assert "Unexpected error" in str(exc_info.value)

