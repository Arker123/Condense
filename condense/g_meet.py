import ipywidgets as widgets
from IPython.display import display
from threading import Thread
from queue import Queue
import pyaudio
import json
from vosk import Model, KaldiRecognizer
from transformers import pipeline
import wave

messages = Queue()
recordings = Queue()

channels = 4
frame_rate = 16000
record_seconds = 5
audio_format = pyaudio.paInt16
sample_size = 2
filename = "output.wav"

def record_microphone(chunk=1024):
    p = pyaudio.PyAudio()

    stream = p.open(format=audio_format, channels=channels,
                    rate=frame_rate, input=True, input_device_index=5,
                    frames_per_buffer=chunk)

    frames = []
    while not messages.empty():
        data = stream.read(chunk)
        frames.append(data)
        if(len(frames) >= (frame_rate*record_seconds)):
            recordings.put(frames.copy())
            frames = []

    stream.stop_stream()
    stream.close()
    p.terminate


model = Model(model_name="vosk-model-en-us-0.22")
rec = KaldiRecognizer(model, frame_rate)
rec.SetWords(True)

def speech_recognition(output):
    while not messages.empty():
        frames = recordings.get()
        all_frames = b''.join(frames)
        rec.AcceptWaveform(b''.join(frames))
        with wave.open(filename, 'wb') as wf:
            wf.setnchannels(channels)
            wf.setsampwidth(sample_size)
            wf.setframerate(frame_rate)
            wf.writeframes(all_frames)
        # whisper_asr = pipeline('automatic-speech-recognition', model='openai/whisper-medium')
        # transcribed_text = whisper_asr(filename)
        # print(transcribed_text["text"])
        result = rec.Result()
        transcribed_text = result
        output.append_stdout(transcribed_text)

# model = Model(model_name="vosk-model-en-us-0.22")
# rec = KaldiRecognizer(model, frame_rate)
# rec.SetWords(True)

# def speech_recognition(output):
#     while not messages.empty():
#         frames = recordings.get()
#         rec.AcceptWaveform(b''.join(frames))
#         result = rec.Result()
#         text = json.loads(result)["text"]
#         print(text)
#         output.append_stdout(text)
        

record_button = widgets.Button(
    description="Record",
    disabled=False,
    button_style="success",
    icon="microphone"
)
stop_button = widgets.Button(
    description="Stop",
    disabled=False,
    button_style="warning",
    icon="stop"
)
output = widgets.Output()

def start_recording(data):
    messages.put(True)
    with output:
        display("Starting....")
        record = Thread(target = record_microphone)
        record.start()
        
        transcribe = Thread(target=speech_recognition, args=(output, ))
        transcribe.start()
def stop_recording(data):
    with output:
        messages.get()
        display("Stopped.....")
        
record_button.on_click(start_recording)
stop_button.on_click(stop_recording)

display(record_button, stop_button, output) 
