import requests

url = "https://tactiq-apps-prod.tactiq.io/transcript"
body = {
    "videoUrl": "https://www.youtube.com/watch?v=RqIqlmb8BYM",
    "langCode": "en"
}

response = requests.post(url, json=body)

if response.status_code == 200:
    print("POST request successful!")
else:
    print("POST request failed with status code:", response.status_code)
    
print(response.json())