# Copyright (C) 2024 Condense, Inc. All Rights Reserved.
#https://www.youtube.com/watch?v=RqIqlmb8BYM

import requests
import csv

def send_post_request(url, video_url, lang_code="en"):
    """
    Send a POST request to the specified URL with the given video URL and language code.
    Returns the JSON response.
    """
    body = {
        "videoUrl": video_url,
        "langCode": lang_code
    }
    response = requests.post(url, json=body)
    return response.json() if response.status_code == 200 else None

def save_to_csv(data, csv_filename):
    """
    Save the transcript data to a CSV file.
    """
    with open(csv_filename, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        title = data['title']
        writer.writerow([title])
        writer.writerow(['Start', 'Duration', 'Text'])
        for caption in data['captions']:
            start = caption['start']
            duration = caption['dur']
            text = caption['text']
            writer.writerow([start, duration, text])

def save_to_text(data, text_filename):
    """
    Save the transcript text to a text file.
    """
    with open(text_filename, mode='w', encoding='utf-8') as text_file:
        title = data['title']
        text_file.write(title + "\n")
        for caption in data['captions']:
            text = caption['text']
            text_file.write(text + "\n")

if __name__ == "__main__":
    # Set the URL for the transcript API
    url = "https://tactiq-apps-prod.tactiq.io/transcript"
    video_url = input("Enter the YouTube video URL: ")

    # Send the POST request
    response_data = send_post_request(url, video_url)

    if response_data:
        print("POST request successful!")

        # Save data to CSV
        csv_filename = "transcript_data.csv"
        save_to_csv(response_data, csv_filename)
        print("Transcript data saved to", csv_filename)

        # Save transcript text to a text file
        text_filename = "transcript_text.txt"
        save_to_text(response_data, text_filename)
        print("Transcript text saved to", text_filename)

    else:
        print("POST request failed.")
