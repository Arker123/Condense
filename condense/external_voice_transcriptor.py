import sys
import time
import wave
from queue import Queue
from threading import Thread

import pyaudio

from condense.youtube_audio_extractor import load_model, get_transcript

recordings = Queue()

channels = 1
frame_rate = 16000
record_seconds = 10
audio_format = pyaudio.paInt16
sample_size = 2
chunk = 1024


def speech_recognition(whisper_asr):
    filename = f"output_{time.time()}.wav"
    while not recordings.empty():
        frames = recordings.get()
        all_frames = b"".join(frames)
        with wave.open(filename, "wb") as wf:
            wf.setnchannels(channels)
            wf.setsampwidth(sample_size)
            wf.setframerate(frame_rate)
            wf.writeframes(all_frames)
        transcribed_text = get_transcript(whisper_asr, ".", filename)
        print(transcribed_text)


def record_microphone():
    p = pyaudio.PyAudio()
    stream = p.open(format=audio_format, channels=channels, rate=frame_rate, input=True, frames_per_buffer=chunk)
    frames = []
    data = stream.read(chunk)
    frames.append(data)
    if len(frames) >= (frame_rate * record_seconds) / chunk:
        recordings.put(frames.copy())
        frames = []

    stream.stop_stream()
    stream.close()
    p.terminate


def start_recording(whisper_asr):
    while True:
        record = Thread(target=record_microphone)
        record.start()

        transcribe = Thread(target=speech_recognition, args=(whisper_asr,))
        transcribe.start()

        time.sleep(record_seconds - 1)


def main():
    whisper_asr = load_model()
    start_recording(whisper_asr)


if __name__ == "__main__":
    sys.exit(main())
