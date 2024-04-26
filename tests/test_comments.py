# Copyright (C) 2024 Condense, Inc. All Rights Reserved.

import os
import argparse
from unittest.mock import MagicMock, patch

import pytest

from condense.comments import Ycom, main, make_parser, get_comments

# Sample data for testing
sample_comments_response = {
    "items": [
        {
            "snippet": {
                "topLevelComment": {
                    "snippet": {
                        "textOriginal": "This is a sample comment.",
                        "authorDisplayName": "Sample Author",
                        "likeCount": 10,
                    }
                }
            }
        }
    ],
    "pageInfo": {
        "totalResults": 1,
    },
}

sample_video_url = "https://www.youtube.com/watch?v=samplevideoid"


def test_make_parser():
    parser = make_parser()
    assert isinstance(parser, argparse.ArgumentParser)

    # Test argument parsing with a sample URL
    args = parser.parse_args(["-u", sample_video_url])
    assert args.video_url == sample_video_url


def test_ycom():
    ycom_instance = Ycom(apikey="test_api_key", write_to_file=False)

    # Test make_youtube method
    with patch("googleapiclient.discovery.build") as mock_build:
        ycom_instance.make_youtube()
        mock_build.assert_called_once_with("youtube", "v3", developerKey="test_api_key")
        assert ycom_instance.youtube is not None

    # Test set_video_id method
    ycom_instance.set_video_id(sample_video_url)
    assert ycom_instance.video_id_to_extract_comments == "samplevideoid"

    # Test parse_comments method
    ycom_instance.response = sample_comments_response
    ycom_instance.parse_comments()
    expected_comments = [["This is a sample comment.", "Sample Author", 10]]
    assert ycom_instance.comments == expected_comments

    # Test show_comments method
    assert ycom_instance.show_comments() == expected_comments


def test_get_comments():
    with patch.object(Ycom, "request_comments") as mock_request_comments:
        with patch.object(Ycom, "show_comments") as mock_show_comments:
            mock_show_comments.return_value = [["Sample comment", "Author", 5]]
            comments = get_comments("test_api_key", False, sample_video_url)
            mock_request_comments.assert_called_once()
            mock_show_comments.assert_called_once()
            assert comments == [["Sample comment", "Author", 5]]


def test_main(capsys):
    # Prepare arguments for the main function
    test_argv = ["-u", sample_video_url, "-c"]

    # Patch and execute the main function
    with patch("condense.comments.get_comments", return_value=[["Sample comment", "Author", 5]]):
        main(test_argv)

    # Capture the standard output
    captured = capsys.readouterr()

    # Assert that the captured output is as expected
    assert captured.out.strip() == "[['Sample comment', 'Author', 5]]"
