import os
import sys
import time
import wave
import logging
from threading import Thread

import pyaudio
import whisper
from transformers import pipeline

from condense.summarizer import load_summarize_model, get_summary_from_transcript
from condense.youtube_audio_extractor import load_model, get_transcript

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

# Constants for audio recording
CHANNELS = 1
FRAME_RATE = 16000
RECORD_SECONDS = 15
AUDIO_FORMAT = pyaudio.paInt16
SAMPLE_SIZE = 2
CHUNK = 1024


def speech_recognition(whisper_asr: whisper.model, summarizer: pipeline, frames: list):
    """
    Transcribe audio frames using the provided whisper model.
    Args:
        whisper_asr (whisper.model): The pre-trained model for speech recognition.
        frames (list): List of audio frames to be transcribed.
    """
    logger.info(f"Transcribing.....")
    filename = f"output_{time.time()}.wav"
    all_frames = b"".join(frames)
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(CHANNELS)
        wf.setsampwidth(SAMPLE_SIZE)
        wf.setframerate(FRAME_RATE)
        wf.writeframes(all_frames)
    transcribed_text = get_transcript(whisper_asr, ".", filename)
    text_list = transcribed_text[0]
    text = " ".join(item["text"] for item in text_list)
    print(text)
    summary_text, time_stamps = get_summary_from_transcript(text_list, summarizer, 1)
    print("summary text : ", summary_text)
    print("timestamps : ", time_stamps)
    if os.path.exists(filename):
        os.remove(filename)


def record_microphone(whisper_asr: whisper.model, summarizer: pipeline):
    """
    Record audio from the microphone and transcribe it using the provided model.
    Args:
        whisper_asr (whisper.model): The pre-trained model for speech recognition.
    """
    p = pyaudio.PyAudio()
    stream = p.open(format=AUDIO_FORMAT, channels=CHANNELS, rate=FRAME_RATE, input=True, frames_per_buffer=CHUNK)
    frames = []
    while True:
        data = stream.read(CHUNK)
        frames.append(data)
        if len(frames) >= (FRAME_RATE * RECORD_SECONDS) / CHUNK:
            speech_recognition(whisper_asr, summarizer, frames)
            break

    stream.stop_stream()
    stream.close()
    p.terminate


def start_recording():
    """Start the audio recording process."""
    whisper_asr = load_model()
    summarizer = load_summarize_model()
    logger.info(f"Recording.....")
    while True:
        try:
            # Create a new thread for recording audio
            record = Thread(target=record_microphone, args=(whisper_asr, summarizer))
            record.start()

            # Wait for the specified recording duration before starting the next recording
            time.sleep(RECORD_SECONDS - 1)
        except KeyboardInterrupt:
            break


def main():
    logging.basicConfig(level=logging.DEBUG)
    start_recording()


if __name__ == "__main__":
    sys.exit(main())
