import argparse
from gtts import gTTS
import os

def text_to_speech(text, output_file = 'output.mp3', language = 'en'):
    myobj = gTTS(text=text, lang=language, slow=False)

    myobj.save(output_file)
    os.system("mpg321 " + output_file)

def main():
    parser = argparse.ArgumentParser(description="Convert text to speech and save it as an MP3 file.")
    parser.add_argument("text", type=str, help="Text to convert to speech")
    parser.add_argument("--language", "-l", type=str, default="en", help="Language of the text (default: 'en')")
    parser.add_argument("--output-file", "-o", type=str, default="output.mp3", help="Output file name (default: 'output.mp3')")
    args = parser.parse_args()

    text_to_speech(args.text, args.language, args.output_file)

if __name__ == "__main__":
    main()
