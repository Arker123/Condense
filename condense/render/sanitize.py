# Copyright (C) 2024 Condense, Inc. All Rights Reserved.
import string


def sanitize(s: str, is_ascii_only=True) -> str:
    """
    Return sanitized string for printing to cli.
    """
    s = s.replace("\n", "\\n")
    s = s.replace("\r", "\\r")
    s = s.replace("\t", "\\t")
    s = s.replace("\\\\", "\\")  # print single backslashes
    if is_ascii_only:
        s = "".join(c for c in s if c in string.printable)
    return s