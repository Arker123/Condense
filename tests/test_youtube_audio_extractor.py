from unittest.mock import MagicMock, patch

import pytest

from condense.youtube_audio_extractor import main, generate, make_parser, get_transcript_from_video

def test_argument_parser():
    """
    Test if the argument parser correctly parses the video URL and output flags.
    """
    parser = make_parser()
    args = ["-u", "https://example.com/video", "--json"]
    parsed = parser.parse_args(args)
    assert parsed.video_url == "https://example.com/video"
    assert parsed.json is True


@patch("condense.youtube_audio_extractor.whisper.load_model")
@patch("condense.youtube_audio_extractor.YouTube")
def test_generate(mock_youtube, mock_whisper):
    """
    Test the generate function to ensure it downloads the audio and generates a transcript.
    """
    mock_whisper.return_value.transcribe.return_value = {
        "segments": [{"text": "test transcript"}],
        "text": "test transcript",
    }

    mock_youtube.streams.filter().first().download.return_value = "path/to/audio"

    segments, language = generate(mock_youtube, "dummy_path", "dummy_file")
    assert len(segments) > 0
    assert language is not None


@patch("condense.youtube_audio_extractor.generate")
@patch("condense.youtube_audio_extractor.YouTube")
def test_get_transcript_from_video(mock_youtube, mock_generate):
    """
    Test get_transcript_from_video to ensure it returns the transcript and language.
    """
    mock_generate.return_value = ([{"text": "test transcript"}], "en")

    transcript, language = get_transcript_from_video("https://example.com/video")
    assert len(transcript) > 0
    assert language == "en"


@patch("condense.youtube_audio_extractor.get_transcript_from_video")
@patch("condense.youtube_audio_extractor.save_to_file")
@patch("condense.youtube_audio_extractor.make_parser")
def test_main(mock_make_parser, mock_save_to_file, mock_get_transcript_from_video):
    """
    Test the main function to ensure it calls the necessary functions and processes the command-line arguments.
    """
    mock_get_transcript_from_video.return_value = ([{"text": "test transcript"}], "en")
    mock_make_parser.return_value.parse_args.return_value = MagicMock(video_url="https://example.com/video")

    with patch("builtins.print") as mock_print:
        main(["-u", "https://example.com/video"])
        mock_print.assert_called_with([{"text": "test transcript"}])
        mock_save_to_file.assert_called()
