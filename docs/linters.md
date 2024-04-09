# Condense--Video-Analyser


## Installation
You can install Condense in a few different ways.
However, if you want to use Condense as a Python library,
 you can install the package directly from GitHub using `pip`.
Finally, if you'd like to contribute patches or features to Condense,
 you'll need to work with a local copy of the source code.

 
:warning: **Condense requires Python >= 3.8.**


## Method 1: Inspecting the Condense source code

If you'd like to review and modify the Condense source code,
 you'll need to check it out from GitHub and install it locally.
By following these instructions, you'll maintain a local directory
 of source code that you can modify and run easily.

### Step 1: Check out source code

- Clone the Condense git repository:

    `$ git clone https://github.com/Arker123/T07-CS305 /local/path/to/src`

### Step 2: Install the local source code

Next, use `pip` to install the source code in "editable" mode.
This means that Python will load the Condense module from this local
 directory rather than copying it to `site-packages` or `dist-packages`.
This is good, because it is easy for us to modify files and see the
 effects reflected immediately.
But be careful not to remove this directory unless uninstalling Condense!

- Install Condense:

    `$ pip install -e /local/path/to/src`

You'll find that the `condense.exe` (Windows) or `condense` (Linux, macOS) executables
 in your path now invoke the Condense binary from this directory.

### Step 3: Install development and testing dependencies

To install all testing and development dependencies, run:

`$ pip install -e /local/path/to/src[dev]`

We use the following tools to ensure consistent code style and formatting:

  - [black](https://github.com/psf/black) code formatter
  - [isort](https://pypi.org/project/isort/) code formatter
  - [mypy](https://mypy-lang.org/) type checking

We use [pre-commit](https://pre-commit.com/) so that its trivial to run the same linters & configuration locally as in CI.

Run all linters liks:
```
❯ pre-commit run --all-files
isort....................................................................Passed
black....................................................................Passed
mypy.....................................................................Passed
```

Or run a single linter like:
```
❯ pre-commit run --all-files isort
isort....................................................................Passed
```

Importantly, you can configure pre-commit to run automatically before every commit by running:
```
❯ pre-commit install --hook-type pre-commit
pre-commit installed at .git/hooks/pre-commit

❯ pre-commit install --hook-type pre-push
pre-commit installed at .git/hooks/pre-push
```

This way you can ensure that you don't commit code style or formatting offenses.
You can always temporarily skip the checks by using the `-n`/`--no-verify` git option.
