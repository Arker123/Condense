# Copyright (C) 2024 Condense, Inc. All Rights Reserved.

import io
import sys
import textwrap
import collections
from typing import Dict, List, Tuple, Union

from rich import box
from rich.table import Table
from rich.markup import escape
from rich.console import Console

import condense.utils as util
import condense.logging_
from condense.render import Verbosity
from condense.render.sanitize import sanitize
from condense.results import ResultDocument

MIN_WIDTH_LEFT_COL = 22
MIN_WIDTH_RIGHT_COL = 82

DISABLED = "Disabled"

logger = condense.logging_.getLogger(__name__)


def heading_style(s: str):
    colored_string = "[cyan]" + escape(s) + "[/cyan]"
    return colored_string


def string_style(s: str):
    colored_string = "[green]" + escape(s) + " [/green]"
    return colored_string


def width(s: str, character_count: int) -> str:
    """pad the given string to at least `character_count`"""
    if len(s) < character_count:
        return s + " " * (character_count - len(s))
    else:
        return s


def render_meta(results: ResultDocument, console, verbose):
    rows: List[Tuple[str, str]] = list()

    lang = f"{results.metadata.language}" if results.metadata.language else ""
    lang_v = (
        f" ({results.metadata.language_version})"
        if results.metadata.language != "unknown" and results.metadata.language_version
        else ""
    )
    lang_s = f" - selected: {results.metadata.language_selected}" if results.metadata.language_selected else ""
    language_value = f"{lang}{lang_v}{lang_s}"

    if verbose == Verbosity.DEFAULT:
        rows.append((width("file path", MIN_WIDTH_LEFT_COL), width(results.metadata.file_path, MIN_WIDTH_RIGHT_COL)))
        rows.append(("identified language", language_value))
    else:
        rows.extend(
            [
                (width("file path", MIN_WIDTH_LEFT_COL), width(results.metadata.file_path, MIN_WIDTH_RIGHT_COL)),
                ("start date", results.metadata.runtime.start_date.strftime("%Y-%m-%d %H:%M:%S")),
                ("runtime", strtime(results.metadata.runtime.total)),
                ("version", results.metadata.version),
            ]
        )
        
    table = Table(box=box.ASCII2, show_header=False)
    for row in rows:
        table.add_row(str(row[0]), str(row[1]))

    console.print(table)


def strtime(seconds):
    m, s = divmod(seconds, 60)
    return f"{m:02.0f}:{s:02.0f}"



def render_sub_heading(heading, n, console, disable_headers):
    """
    example::

        +----------------------------+
        | Condense Transcripts (862) |
        +----------------------------+
    """
    if disable_headers:
        return
    table = Table(box=box.ASCII2, show_header=False)
    table.add_row(heading + f" ({n})")
    console.print(table)
    console.print()


def get_color(color):
    if color == "always":
        color_system = "256"
    elif color == "auto":
        color_system = "windows"
    elif color == "never":
        color_system = None
    else:
        raise RuntimeError("unexpected --color value: " + color)

    return color_system


def render(results: condense.results.ResultDocument, verbose, disable_headers, color):
    sys.__stdout__.reconfigure(encoding="utf-8")
    console = Console(file=io.StringIO(), color_system=get_color(color), highlight=False, soft_wrap=True)

    if not disable_headers:
        console.print("\n")
        if verbose == Verbosity.DEFAULT:
            console.print(f"Condense RESULTS (version {results.metadata.version})\n")
        else:
            colored_str = heading_style(f"Condense RESULTS (version {results.metadata.version})\n")
            console.print(colored_str)
        render_meta(results, console, verbose)
        console.print("\n")

    console.file.seek(0)
    return console.file.read()