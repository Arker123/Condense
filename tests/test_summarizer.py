import pytest
from unittest.mock import patch, MagicMock
from condense.summarizer import make_parser, clean_data, summerize_text, main

def test_argument_parser():
    """
    Verify that the command-line argument parser correctly parses the video URL.
    """
    parser = make_parser()
    args = ["-u", "https://example.com/video"]
    parsed_args = parser.parse_args(args)
    assert parsed_args.video_url == "https://example.com/video"

def test_clean_data():
    """
    Ensure the clean_data function removes unwanted characters and corrects whitespace issues.
    """
    data = [{"text": " Hello,  (world!) "}]
    expected_output = "Hello, (world)"
    assert clean_data(data) == expected_output

@patch('condense.summarizer.summerize_text', return_value="Summary result")
@patch('condense.summarizer.make_parser')
def test_main(mock_make_parser, mock_summerize_text):
    """
    Test the main function to ensure it correctly integrates the components and produces the expected output.
    """
    mock_make_parser.return_value.parse_args.return_value = MagicMock(video_url="https://example.com/video")

    with patch('builtins.print') as mock_print:
        main(["-u", "https://example.com/video"])
        mock_print.assert_called_with("Summary result")
