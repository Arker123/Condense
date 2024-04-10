import os
import sys
import time
import logging
import warnings
from threading import Thread

import soundcard as sc
import soundfile as sf

from condense.youtube_audio_extractor import get_transcript

import whisper  # isort: skip

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

warnings.filterwarnings("ignore", category=sc.SoundcardRuntimeWarning)

SAMPLE_RATE = 48000
RECORD_SEC = 15


def load_model() -> whisper.model:
    """
    Load the pre-trained model for speech recognition.

    Returns:
        whisper.model: The loaded pre-trained model.
    """
    model = whisper.load_model("base")
    return model


def record(model: whisper.model):
    """
    Record audio from the default microphone and transcribe it using the provided model.

    Args:
        model (whisper.model): The pre-trained model for speech recognition.
    """
    logger.info(f"Recording.....")
    filename = f"output_{time.time()}.wav"
    try:
        with sc.get_microphone(id=str(sc.default_speaker().name), include_loopback=True).recorder(
            samplerate=SAMPLE_RATE
        ) as mic:
            data = mic.record(numframes=SAMPLE_RATE * RECORD_SEC)
            sf.write(file=filename, data=data[:, 0], samplerate=SAMPLE_RATE)
            transcribed_text = get_transcript(model, ".", filename)
            print(transcribed_text)
    except Exception as e:
        logger.info("Error occurred while recording the audio: {e}")
    finally:
        if os.path.exists(filename):
            os.remove(filename)


def main():
    """
    Main function to control the recording process.
    """
    logging.basicConfig(level=logging.DEBUG)
    model = load_model()
    while True:
        try:
            thread = Thread(target=record, args=(model,))
            thread.start()
            time.sleep(RECORD_SEC)
        except KeyboardInterrupt:
            break


if __name__ == "__main__":
    sys.exit(main())
