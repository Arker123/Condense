import soundcard as sc
import soundfile as sf
from transformers import pipeline
from threading import Thread

filename = "output.wav"
samplerate = 48000
record_sec = 10

def record_and_transcribe():
    print("Recording...")
    with sc.get_microphone(id=str(sc.default_speaker().name), include_loopback=True).recorder(
            samplerate=samplerate) as mic:
        data = mic.record(numframes=samplerate * record_sec)
        sf.write(file=filename, data=data[:, 0], samplerate=samplerate)

    print("Transcribing...")
    whisper_asr = pipeline("automatic-speech-recognition")
    transcribed_text = whisper_asr(filename)
    print("Transcript:", transcribed_text["text"])


def main():
    while True:
        thread = Thread(target=record_and_transcribe)
        thread.start()
        # thread.join()

if __name__ == "__main__":
    main()
