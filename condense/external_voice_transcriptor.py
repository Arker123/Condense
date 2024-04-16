import sys
import time
import wave
import logging
from queue import Queue
from threading import Thread

import pyaudio
import whisper

from condense.youtube_audio_extractor import load_model, get_transcript

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

recordings = Queue()

CHANNELS = 1
FRAME_RATE = 16000
RECORD_SECONDS = 10
AUDIO_FORMAT = pyaudio.paInt16
SAMPLE_SIZE = 2
CHUNK = 1024


def speech_recognition(whisper_asr: whisper.model):
    filename = f"output_{time.time()}.wav"
    while not recordings.empty():
        frames = recordings.get()
        all_frames = b"".join(frames)
        with wave.open(filename, "wb") as wf:
            wf.setnchannels(CHANNELS)
            wf.setsampwidth(SAMPLE_SIZE)
            wf.setframerate(FRAME_RATE)
            wf.writeframes(all_frames)
        transcribed_text = get_transcript(whisper_asr, ".", filename)
        print(transcribed_text)


def record_microphone():
    logger.info(f"Recording.....")
    p = pyaudio.PyAudio()
    stream = p.open(format=AUDIO_FORMAT, channels=CHANNELS, rate=FRAME_RATE, input=True, frames_per_buffer=CHUNK)
    frames = []
    data = stream.read(CHUNK)
    frames.append(data)
    if len(frames) >= (FRAME_RATE * RECORD_SECONDS) / CHUNK:
        recordings.put(frames.copy())
        frames = []

    stream.stop_stream()
    stream.close()
    p.terminate


def start_recording():
    whisper_asr = load_model()
    while True:
        try:
            record = Thread(target=record_microphone)
            record.start()

            transcribe = Thread(target=speech_recognition, args=(whisper_asr,))
            transcribe.start()

            time.sleep(RECORD_SECONDS - 1)
        except KeyboardInterrupt:
            break


def main():
    logging.basicConfig(level=logging.DEBUG)
    start_recording()


if __name__ == "__main__":
    sys.exit(main())
