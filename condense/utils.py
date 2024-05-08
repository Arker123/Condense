import os
import csv
import sys
import json
import logging
import argparse
from typing import Dict, List

import tqdm

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)


class ExtendAction(argparse.Action):
    # stores a list, and extends each argument value to the list
    # Since Python 3.8 argparse supports this
    # TODO: remove this code when only supporting Python 3.8+
    def __call__(self, parser, namespace, values, option_string=None):
        items = getattr(namespace, self.dest, None) or []
        items.extend(values)
        setattr(namespace, self.dest, items)


class InstallContextMenu(argparse.Action):
    def __init__(self, option_strings, dest, nargs=None, **kwargs):
        super(InstallContextMenu, self).__init__(option_strings, dest, nargs=0, **kwargs)

    def __call__(self, parser, namespace, values, option_string=None):
        # Theoretically, we don't need to check the platform again here,
        # because non-Windows platforms will not accept the --install-right-click-menu parameter at all.
        # This judgment is just to make the mypy type check pass.
        # The same logic applies to `UninstallContextMenu` below.
        if sys.platform == "win32":
            import winreg as reg

            menu_name = "Open with Condense"
            icon_path = None

            if getattr(sys, "frozen", False):
                # If this is a standalone condense.exe, the path to the condense is sys.executable
                menu_command = f'C:\\windows\\system32\\cmd.exe /K "^"{sys.executable}^" ^"%1^""'
                icon_path = sys.executable
            else:
                menu_command = f'C:\\windows\\system32\\cmd.exe /K "python -m condense ^"%1^""'

            # Create `shell` if it does not exist
            try:
                shell_key = reg.OpenKey(reg.HKEY_CURRENT_USER, r"Software\\Classes\\*\\shell", 0, reg.KEY_SET_VALUE)
            except FileNotFoundError:
                shell_key = reg.CreateKey(reg.HKEY_CURRENT_USER, r"Software\\Classes\\*\\shell")
                shell_key = reg.OpenKey(reg.HKEY_CURRENT_USER, r"Software\\Classes\\*\\shell", 0, reg.KEY_SET_VALUE)

            reg.SetValue(shell_key, menu_name, reg.REG_SZ, menu_name)

            menu_key = reg.OpenKey(shell_key, menu_name, 0, reg.KEY_SET_VALUE)
            if icon_path:
                reg.SetValueEx(menu_key, "Icon", 0, reg.REG_SZ, icon_path)
            reg.SetValue(menu_key, "command", reg.REG_SZ, menu_command)
            sys.exit(0)


class UninstallContextMenu(argparse.Action):
    def __init__(self, option_strings, dest, nargs=None, **kwargs):
        super(UninstallContextMenu, self).__init__(option_strings, dest, nargs=0, **kwargs)

    def __call__(self, parser, namespace, values, option_string=None):
        if sys.platform == "win32":
            import winreg as reg

            menu_name = "Open with Condense"

            shell_key = reg.OpenKey(reg.HKEY_CURRENT_USER, r"Software\\Classes\\*\\shell")
            menu_key = reg.OpenKey(shell_key, menu_name)

            reg.DeleteKey(menu_key, "command")
            reg.DeleteKey(shell_key, menu_name)
            sys.exit(0)


def get_progress_bar(functions, disable_progress, desc="", unit=""):
    pbar = tqdm.tqdm
    if disable_progress:
        # do not use tqdm to avoid unnecessary side effects when caller intends
        # to disable progress completely
        pbar = lambda s, *args, **kwargs: s
    return pbar(functions, desc=desc, unit=unit)


def get_video_id(video_link: str) -> str:
    # Extract video ID from YouTube video link
    if "youtube.com/watch?v=" in video_link:
        video_id = video_link.split("youtube.com/watch?v=")[1].split("&")[0]
    elif "youtu.be" in video_link:
        video_id = video_link.split("youtu.be/")[1].split("?")[0]
    else:
        raise ValueError("Invalid YouTube video link")
    return video_id


def save_to_text(data: List[Dict[str, str]], text_filename: str) -> None:
    """
    Save the transcript text to a text file.
    """
    with open(text_filename, mode="w", encoding="utf-8") as text_file:
        for caption in data:
            start = caption["start"]
            end = caption["end"]
            text = caption["text"]
            text_file.write(f"{start} --> {end}  ")
            text_file.write(f"{text}\n")


def save_to_csv(data: List[Dict[str, str]], csv_filename: str) -> None:
    """
    Save the transcript data to a CSV file.
    """
    with open(csv_filename, mode="w", encoding="utf-8") as csv_file:
        fieldnames = ["start", "end", "text"]
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
        writer.writeheader()
        for field in data:
            writer.writerow(
                {
                    fieldnames[0]: field[fieldnames[0]],
                    fieldnames[1]: field[fieldnames[1]],
                    fieldnames[2]: field[fieldnames[2]],
                }
            )


def save_to_file(data: List[Dict[str, str]], args: argparse.Namespace) -> None:
    output_path = "transcripts"
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    json_count = 0
    text_count = 0
    csv_count = 0

    # Save data to JSON
    if args.json:
        json_filename = "transcript_data.json"
        while os.path.exists(os.path.join(output_path, json_filename)):
            json_count += 1
            json_filename = f"transcript_data{json_count}.json"
        with open(os.path.join(output_path, json_filename), "w") as json_file:
            json.dump(data, json_file, indent=4)
            logger.info("Transcript data saved to %s", json_filename)

    # Save data to text
    if args.text:
        text_filename = "transcript_text.txt"
        while os.path.exists(os.path.join(output_path, text_filename)):
            text_count += 1
            text_filename = f"transcript_text{text_count}.txt"
        save_to_text(data, os.path.join(output_path, text_filename))
        logger.info("Transcript text saved to %s", text_filename)

    # Save data to CSV
    if args.csv:
        csv_filename = "transcript_data.csv"
        while os.path.exists(os.path.join(output_path, csv_filename)):
            csv_count += 1
            csv_filename = f"transcript_data{csv_count}.csv"
        save_to_csv(data, os.path.join(output_path, csv_filename))
        logger.info("Transcript data saved to %s", csv_filename)
