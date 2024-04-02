import time
import wave
from queue import Queue
from threading import Thread

import pyaudio
import ipywidgets as widgets
from vosk import Model, KaldiRecognizer
from transformers import pipeline
from IPython.display import display

messages = Queue()
recordings = Queue()

channels = 1
frame_rate = 16000
record_seconds = 10
audio_format = pyaudio.paInt16
sample_size = 2
filename = "output.wav"


def record_microphone(chunk=1024):
    p = pyaudio.PyAudio()

    stream = p.open(format=audio_format, channels=channels, rate=frame_rate, input=True, frames_per_buffer=chunk)

    frames = []
    start_time = time.time()
    while not messages.empty():
        data = stream.read(chunk)
        frames.append(data)
        if len(frames) >= (frame_rate * record_seconds) / chunk:
            start_time = time.time()
            print("inside the if statement : ", time.time())
            recordings.put(frames.copy())
            frames = []

    stream.stop_stream()
    stream.close()
    p.terminate


def speech_recognition(output):
    while not messages.empty():
        frames = recordings.get()
        all_frames = b"".join(frames)
        with wave.open(filename, "wb") as wf:
            wf.setnchannels(channels)
            wf.setsampwidth(sample_size)
            wf.setframerate(frame_rate)
            wf.writeframes(all_frames)
        whisper_asr = pipeline("automatic-speech-recognition")
        transcribed_text = whisper_asr(filename)
        print(transcribed_text["text"])
        output.append_stdout(transcribed_text["text"])


record_button = widgets.Button(description="Record", disabled=False, button_style="success", icon="microphone")
stop_button = widgets.Button(description="Stop", disabled=False, button_style="warning", icon="stop")
output = widgets.Output()


def start_recording(data):
    messages.put(True)
    with output:
        display("Starting....")
        record = Thread(target=record_microphone)
        record.start()

        transcribe = Thread(target=speech_recognition, args=(output,))
        transcribe.start()


def stop_recording(data):
    with output:
        messages.get()
        display("Stopped.....")


record_button.on_click(start_recording)
stop_button.on_click(stop_recording)

display(record_button, stop_button, output)
