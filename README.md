# Condense--Video-Analyser

A sophisticated and user-friendly automation that downloads audio from YouTube videos, transcribes the content into text, detects the language of the transcribed text, and saves the transcription to a text file. Save time, effort, and resources by harnessing cutting-edge technology to streamline the transcription process.

## Installation

Install the required libraries:

   ```bash
   pip install pytube
   ```

   ```bash
   pip install git+https://github.com/openai/whisper.git
   ```

   ```bash
   pip install langdetect
   ```
## Usage

    Run the script:

   ```bash
   python youtube_audio_to_text.py --url "https://www.youtube.com/watch?v=T3E9Wjbq44E&list=RDyLhJYqgVE-Y&index=10" -t -c -j 
   ```

   -c to store transcript in csv file
   -t to store transcript in text file 
   -j to store transcript in json file

## Workflow

1. The user inputs a YouTube video URL when prompted.
2. The `pytube` library is used to create a `YouTube` object and filter the audio stream.
3. The audio stream is downloaded as an MP3 file and saved in the `YoutubeAudios` folder.
4. The `whisper` library loads a base model and transcribes the downloaded audio into text.
5. The `langdetect` library detects the language of the transcribed text.
6. The transcription is saved to a text file named `output_{language}.txt` with the language code as part of the filename and opened for the user to view.