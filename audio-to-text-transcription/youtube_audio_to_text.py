import os
import whisper
from langdetect import detect
from pytube import YouTube
import logging

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
def startfile(fn):
    os.system('open %s' % fn)

def create_and_open_txt(text, filename):
    with open(filename, "w") as file:
        file.write(text)
    startfile(filename)

def generate(audio_stream, output_path, filename):
    audio_stream.download(output_path=output_path, filename=filename)

    print(f"Audio downloaded to {output_path}/{filename}")

    model = whisper.load_model("base")
    absolute_audio_path = os.path.join(output_path, filename)
    print(absolute_audio_path)

    result = model.transcribe(absolute_audio_path)
    transcribed_text = result["text"]
    print(transcribed_text)

    language = detect(transcribed_text)
    print(f"Detected language: {language}")

    create_and_open_txt(transcribed_text, f"output_{language}.txt")

def main():
    url = input("Enter the YouTube video URL: ")
    yt = YouTube(url)
    audio_stream = yt.streams.filter(only_audio=True).first()

    # Create directory if it doesn't exist
    output_path = "YoutubeAudios"
    if not os.path.exists(output_path):
        os.makedirs(output_path)

    filename = "audio.mp3"
    generate(audio_stream, output_path, filename)

if __name__ == "__main__":
    main()

