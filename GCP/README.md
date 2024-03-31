# API Documentation

This document provides guidelines on how to use the APIs provided by this service.

## Base URL

The base URL for all API endpoints is:

```
https://condense-4eevndrdnq-em.a.run.app
```


## Authentication

All endpoints require authentication using an API key. Include the API key as a query parameter named `api_key` in the request URL.

Example:

```
http://your-domain.com/endpoint?api_key=xxxx
```

## Endpoints

### 1. Summarize Text

#### Endpoint

```
GET /summarize
```

#### Parameters

- `summarize`: (string) The text to be summarized.

#### Response

- Success: Returns a summarized version of the provided text.
- Failure: Returns a JSON object with an error message.

#### Example

```
GET /summarize?summarize=Lorem ipsum dolor sit amet&api_key=xxxx
```

### 2. Get Transcript

#### Endpoint

```
GET /transcript
```

#### Parameters

- `video_url`: (string) The URL of the video from which to extract the transcript.

#### Response

- Success: Returns a JSON object containing the transcript of the video.
- Failure: Returns a JSON object with an error message.

#### Example

```
GET /transcript?video_url=https://www.youtube.com/watch?v=your_video_id&api_key=xxxx
```

### 3. Summarize Video Transcript

#### Endpoint

```
GET /summerize_text
```

#### Parameters

- `video_url`: (string) The URL of the video from which to extract and summarize the transcript.

#### Response

- Success: Returns a summarized version of the transcript of the video.
- Failure: Returns a JSON object with an error message.

#### Example

```
GET /summerize_text?video_url=https://www.youtube.com/watch?v=your_video_id&api_key=xxx
```

### 4. Test Endpoint

#### Endpoint

```
GET /test
```

#### Response

- Success: Returns a JSON object confirming that the link is working.

#### Example

```
GET /test
```