# Copyright (C) 2024 Condense, Inc. All Rights Reserved.
from unittest.mock import ANY, MagicMock, patch

import pytest

from condense.youtube_audio_extractor import main, generate, make_parser, start_translate, get_transcript_from_video


def test_argument_parser_for_json():
    parser = make_parser()
    args = ["-u", "https://example.com/video", "--json"]
    parsed = parser.parse_args(args)
    assert parsed.video_url == "https://example.com/video"
    assert parsed.json is True


def test_argument_parser_for_csv():
    parser = make_parser()
    args = ["-u", "https://example.com/video", "--csv"]
    parsed = parser.parse_args(args)
    assert parsed.video_url == "https://example.com/video"
    assert parsed.csv is True


def test_argument_parser_for_text():
    parser = make_parser()
    args = ["-u", "https://example.com/video", "--text"]
    parsed = parser.parse_args(args)
    assert parsed.video_url == "https://example.com/video"
    assert parsed.text is True


@patch("condense.youtube_audio_extractor.whisper.load_model")
@patch("condense.youtube_audio_extractor.start_translate")
@patch("condense.youtube_audio_extractor.YouTube")
def test_generate(mock_youtube, mock_start_translate, mock_whisper):
    # Set up the return value for the transcription
    mock_transcribe_return = {
        "segments": [{"text": "test transcript"}],
        "text": "test transcript",
    }
    mock_whisper.return_value.transcribe.return_value = mock_transcribe_return
    mock_start_translate.return_value = (mock_transcribe_return["segments"], 'en')

    # Prepare the mock for the audio stream download
    mock_audio_stream = MagicMock()
    mock_youtube.streams.filter().first.return_value = mock_audio_stream

    # Call the function with the mocked YouTube object
    output_path = "dummy_path"
    filename = "dummy_file"
    segments, language = generate(mock_audio_stream, output_path, filename)

    # Assert that the download method was called correctly
    mock_audio_stream.download.assert_called_once_with(output_path=output_path, filename=filename)
    
    # Assert that start_translate was called correctly
    mock_start_translate.assert_called_once_with(output_path, filename)
    
    assert segments == mock_transcribe_return["segments"]
    assert language == 'en'


# For test_get_transcript_from_video, match the actual call
@patch("condense.youtube_audio_extractor.generate")
@patch("condense.youtube_audio_extractor.YouTube")
def test_get_transcript_from_video(mock_youtube, mock_generate):
    mock_generate.return_value = ([{"text": "test transcript"}], "en")

    transcript, language = get_transcript_from_video("https://example.com/video")
    # Ensure the correct instance or configuration of the mock is used for the assertion
    mock_generate.assert_called()
    assert len(transcript) > 0
    assert language == "en"


@patch("condense.youtube_audio_extractor.get_transcript_from_video")
@patch("condense.youtube_audio_extractor.save_to_file")
@patch("condense.youtube_audio_extractor.make_parser")
def test_main(mock_make_parser, mock_save_to_file, mock_get_transcript_from_video):
    mock_args = MagicMock(video_url="https://example.com/video", json=True, csv=False, text=False)
    mock_make_parser.return_value.parse_args.return_value = mock_args
    mock_get_transcript_from_video.return_value = ([{"text": "test transcript"}], "en")

    with patch("builtins.print") as mock_print:
        main(["-u", "https://example.com/video", "--json"])
        mock_print.assert_called_with([{"text": "test transcript"}])
        mock_save_to_file.assert_called_with([{"text": "test transcript"}], mock_args)