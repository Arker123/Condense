# Copyright (C) 2024 Condense, Inc. All Rights Reserved.

import re
import json
import datetime
from enum import Enum
from typing import Dict, List, Tuple
from pathlib import Path
from dataclasses import field

from pydantic import ValidationError
from wordcloud import WordCloud

# we use pydantic for dataclasses so that we can
# easily load and validate JSON reports.
#
# pydantic checks all the JSON fields look as they should
# while using the nice and familiar dataclass syntax.
#
# really, you should just pretend we're using stock dataclasses.
from pydantic.dataclasses import dataclass

import condense.logging_
from condense.render import Verbosity
from condense.version import __version__
from condense.render.sanitize import sanitize

logger = condense.logging_.getLogger(__name__)


class InvalidResultsFile(Exception):
    pass


@dataclass
class Runtime:
    start_date: datetime.datetime = datetime.datetime.now()
    total: float = 0


@dataclass
class Metadata:
    path: str
    version: str = __version__
    size: int = 0
    runtime: Runtime = field(default_factory=Runtime)


@dataclass
class Analysis:
    enable_transcript: bool = False
    enable_summary: bool = True
    enable_wordcloud: bool = True
    enable_analytics: bool = True
    enable_sentiment: bool = True


@dataclass
class Aggregate:
    transcript: List[Dict[str, str]] = field(default_factory=list)
    summary: Tuple[List[Dict], List[Dict]] = field(default_factory=lambda: ([], []))
    wordcloud: str = field(default_factory=str)
    analytics: Dict[str, List[str]] = field(default_factory=dict)
    sentiment: Dict[str, List[str]] = field(default_factory=dict)


@dataclass
class ResultDocument:
    metadata: Metadata
    analysis: Analysis = field(default_factory=Analysis)
    aggregate: Aggregate = field(default_factory=Aggregate)


@dataclass
class ResultDocumentUrl:
    metadata: Metadata
    url: str
    analysis: Analysis = field(default_factory=Analysis)
    aggregate: Aggregate = field(default_factory=Aggregate)


def read(sample: Path) -> ResultDocument:
    try:
        with sample.open("rb") as f:
            results = json.loads(f.read().decode("utf-8"))
    except (json.decoder.JSONDecodeError, UnicodeDecodeError) as e:
        raise InvalidResultsFile(f"{e}")

    try:
        results = ResultDocument(**results)
    except (TypeError, ValidationError) as e:
        raise InvalidResultsFile(f"{str(sample)} is not a valid Condense result document: {e}")

    return results
