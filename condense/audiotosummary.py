from transformers import pipeline

def transcribe_audio(audio_path):
    """
    Transcribe audio from the given file path using the Whisper model.
    
    Args:
    - audio_path (str): Path to the audio file.
    
    Returns:
    - str: Transcribed text.
    """
    whisper_asr = pipeline('automatic-speech-recognition', model='openai/whisper-medium', device=0)
    transcribed_text = whisper_asr(audio_path)
    return transcribed_text["text"]

def chunk_text(text, max_chunk_length=400):
    """
    Breaks the given text into chunks of specified length.
    
    Args:
    - text (str): Text to be chunked.
    - max_chunk_length (int): Maximum length of each chunk.
    
    Returns:
    - list of str: List containing text chunks.
    """
    chunks = [text[i:i + max_chunk_length] for i in range(0, len(text), max_chunk_length)]
    return chunks

def summarize_text(text, max_length=50, min_length=10):
    """
    Summarizes the given text using a pre-trained summarization model.
    
    Args:
    - text (str): Text to be summarized.
    - max_length (int): Maximum length of the summary.
    - min_length (int): Minimum length of the summary.
    
    Returns:
    - str: Summarized text.
    """
    # summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6")
    summarizer = pipeline("summarization", model="t5-small")
    summary = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)[0]["summary_text"]
    return summary

def generate_final_summary(audio_path):
    """
    Transcribes audio, chunks the transcribed text, summarizes each chunk, and prints the final summary.
    
    Args:
    - audio_path (str): Path to the audio file.
    """
    # Transcribe audio
    transcribed_text = transcribe_audio(audio_path)
    
    # Chunk transcribed text
    text_chunks = chunk_text(transcribed_text)
    
    # Summarize each chunk
    summaries = []
    for chunk in text_chunks:
        summary = summarize_text(chunk)
        summaries.append(summary)
    
    # Print final summary
    finalsummary = " ".join(summaries)
    print(finalsummary)
    return finalsummary

if __name__ == "__main__":
    audio_path = "condense\output_audio.mp3"
    generate_final_summary(audio_path)
