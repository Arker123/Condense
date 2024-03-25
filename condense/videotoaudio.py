from moviepy.editor import VideoFileClip

def extract_audio(video_file, audio_file):
    """
    Extracts audio from a video file and saves it to another file.
    
    Args:
    - video_file (str): Path to the input video file.
    - audio_file (str): Path to save the output audio file.
    """
    # Load the video clip
    video_clip = VideoFileClip(video_file)
    
    # Extract the audio
    audio_clip = video_clip.audio
    
    # Save the audio to a file
    audio_clip.write_audiofile(audio_file)
    
    # Close the clips
    audio_clip.close()
    video_clip.close()

if __name__ == "__main__":
    input_video_file = "condense/input_video.mp4"
    output_audio_file = "condense/output_audio.mp3" 
    
    # Call the function to extract audio
    extract_audio(input_video_file, output_audio_file)
