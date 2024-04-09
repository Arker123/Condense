import time
import shutil
from threading import Thread

import whisper
import soundcard as sc
import soundfile as sf

from condense.youtube_audio_extractor import get_transcript

model = whisper.load_model("base")
samplerate = 48000
record_sec = 15


def record():
    print("Recording...")
    with sc.get_microphone(id=str(sc.default_speaker().name), include_loopback=True).recorder(
        samplerate=samplerate
    ) as mic:
        filename = f"output_{time.time()}.wav"
        data = mic.record(numframes=samplerate * record_sec)
        sf.write(file=filename, data=data[:, 0], samplerate=samplerate)
        transcribed_text = get_transcript(model, ".", filename)
        print(transcribed_text)
        shutil.rmtree(filename)


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
