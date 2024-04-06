import time
from threading import Thread

import soundcard as sc
import soundfile as sf
from transformers import pipeline

model = pipeline("automatic-speech-recognition", model="openai/whisper-medium")
summarizer = pipeline("summarization")
samplerate = 48000
record_sec = 15


def summarize_text(text):
    summary_text = summarizer(text, max_length=10, min_length=1, do_sample=False)[0]["summary_text"]
    print(summary_text)


def transcription(filename):
    print("Transcribing...")
    transcribed_text = model(filename)
    text = transcribed_text["text"]
    print("Transcript:", text)
    summarize_text(text)


def record():
    print("Recording...")
    with sc.get_microphone(id=str(sc.default_speaker().name), include_loopback=True).recorder(
        samplerate=samplerate
    ) as mic:
        filename = f"output_{time.time()}.wav"
        data = mic.record(numframes=samplerate * record_sec)
        sf.write(file=filename, data=data[:, 0], samplerate=samplerate)
        transcription(filename)


def main():
    while True:
        try:
            thread = Thread(target=record)
            thread.start()
            time.sleep(record_sec - 1)
        except KeyboardInterrupt:
            break


if __name__ == "__main__":
    main()
