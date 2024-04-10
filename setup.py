#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Copyright (C) 2024 Condense, Inc. All Rights Reserved.

from pathlib import Path

import setuptools

requirements = [
    "tqdm==4.65.0",
    "rich==13.4.2",
    "pytube==15.0.0",
    "youtube_transcript_api==0.6.2",
    "langdetect==1.0.9",
    "openai-whisper==20231117",
    "pyshorteners==1.0.1",
    "google-api-python-client==2.122.0",
    "nltk==3.8.1",
    "tensorflow==2.13.1",
    "transformers==4.37.2",
    "python-dotenv==1.0.1",
    "torch==2.0",
]

# this sets __version__
# via: http://stackoverflow.com/a/7071358/87207
# and: http://stackoverflow.com/a/2073599/87207
file_path = Path("condense") / "version.py"
exec(file_path.read_text())


# via: https://packaging.python.org/guides/making-a-pypi-friendly-readme/
this_directory = Path(__file__).resolve().parent
readme_file = this_directory / "README.md"
long_description = readme_file.read_text()

pkgs = setuptools.find_packages()


setuptools.setup(
    name="condense",
    version=__version__,
    description="A tool to condense and analyze youtube videos",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="Dhananjay Goel, Arnav Kharbanda, Arpit Kumar Gautam, Kritika Bansal, Virat Jain, Dhruv Singh Negi, Edgar Aditya, Niti Shyamsukha, Hardik Aggarwal, Nandini Mundhra, Vikalp",
    author_email="kharbandarnav@gmail.com",
    url="https://github.com/Arker123/T07-CS305",
    packages=pkgs,
    package_dir={"condense": "condense"},
    entry_points={
        "console_scripts": [
            "condense=condense.main:main",
        ]
    },
    include_package_data=True,
    install_requires=requirements,
    extras_require={
        "dev": [
            "pydantic==1.10.9",
            "pyyaml==6.0.1",
            "pytest==8.1.1",
            "pytest-sugar==1.0.0",
            "pytest-instafail==0.5.0",
            "pytest-cov==5.0.0",
            "pycodestyle==2.11.1",
            "black==24.3.0",
            "isort==5.13.2",
            "mypy==1.9.0",
            "emoji==2.10.1",
            # type stubs for mypy
            "types-PyYAML==6.0.12.20240311",
            "types-tensorflow==2.15.0.20240314",
            "google-api-python-client-stubs==1.25.0",
        ],
        "build": ["pyinstaller==6.5.0", "setuptools==69.2.0", "build==1.1.1"],
    },
    zip_safe=False,
    keywords="Condense, YouTube, Video, Analysis",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Artists",
        "Environment :: GPU :: NVIDIA CUDA :: 12 :: 12.1",
        "Environment :: Web Environment",
        "Intended Audience :: YouTube Users",
        "License :: OSI Approved :: Apache Software License",
        "Natural Language :: English",
        "Programming Language :: Python :: 3",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
    ],
    python_requires=">=3.9",
)
