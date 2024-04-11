import os
import sys
import time
import logging
import warnings
from threading import Thread

import soundcard as sc
import soundfile as sf

from condense.summarizer import load_summarize_model, get_summary_from_transcript
from condense.youtube_audio_extractor import load_model, get_transcript

import whisper  # isort: skip

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

warnings.filterwarnings("ignore", category=sc.SoundcardRuntimeWarning)

SAMPLE_RATE = 48000
RECORD_SEC = 25


# def summarize_text(text, summarizer):
#     summary_text = summarizer(text, max_length=15, min_length=1, do_sample=False)[0]["summary_text"]
#     return summary_text


def record(model: whisper.model, summarizer):
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
            text_list = transcribed_text[0]
            text = " ".join(item["text"] for item in text_list)
            print(text)
            summary_text, time_stamps = get_summary_from_transcript(text_list, summarizer, 1)
            print("summary text : ", summary_text)
            print("timestamps : ", time_stamps)
    except Exception as e:
        raise ValueError("Error occurred while recording the audio: {e}")
    finally:
        if os.path.exists(filename):
            os.remove(filename)


def main():
    """
    Main function to control the recording process.
    """
    logging.basicConfig(level=logging.DEBUG)
    model = load_model()
    summarizer = load_summarize_model()
    while True:
        try:
            thread = Thread(
                target=record,
                args=(
                    model,
                    summarizer,
                ),
            )
            thread.start()
            time.sleep(RECORD_SEC)
        except KeyboardInterrupt:
            break


if __name__ == "__main__":
    sys.exit(main())
