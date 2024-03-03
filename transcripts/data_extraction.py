import os
import csv
from pprint import pprint

import googleapiclient.discovery
from dotenv import load_dotenv
from pyshorteners import Shortener  # Install pyshorteners using pip


class Ycom(object):
    def __init__(self):
        self.published_at = ""  # video
        self.rpcom = ""
        self.rppubat = ""  # comment
        self.rpauth = ""
        self.rplike = ""
        self.video_id_to_extract_comments = ""
        self.response = ""
        self.api_service_name = "youtube"
        self.api_version = "v3"
        self.developer_key = myapi
        self.youtube = None

    def make_youtube(self):
        print("function make_youtube_object")
        os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
        self.youtube = googleapiclient.discovery.build(
            self.api_service_name, self.api_version, developerKey=self.developer_key
        )

    def get_video_id(self, video_link):
        # Extract video ID from YouTube video link
        if "youtube.com/watch?v=" in video_link:
            video_id = video_link.split("youtube.com/watch?v=")[1].split("&")[0]
        elif "youtu.be" in video_link:
            video_id = video_link.split("youtu.be/")[1].split("?")[0]
        else:
            raise ValueError("Invalid YouTube video link")
        return video_id

    def shorten_url(self, video_link):
        # Shorten the YouTube video link using pyshorteners
        s = Shortener()
        shortened_url = s.tinyurl.short(video_link)
        return shortened_url

    def set_video_id(self, video_link):
        self.video_id_to_extract_comments = self.get_video_id(video_link)

    def write_to_csv(self):
        file_exists = os.path.isfile("comments.csv")

        with open("comments.csv", "a", encoding="utf-8") as csvfile:
            headers = [
                "comment",
                "author_display_name",
                "comment_like_count",
            ]
            writer = csv.DictWriter(
                csvfile,
                delimiter=",",
                lineterminator="\n",
                fieldnames=headers,
            )
            if not file_exists:
                writer.writeheader()
            try:
                writer.writerow(
                    {
                        "comment": self.rpcom.encode("utf-8").decode("utf-8"),
                        "author_display_name": self.rpauth.encode("utf-8").decode("utf-8"),
                        "comment_like_count": self.rplike,
                    }
                )
            except Exception as e:
                print("Error writing to CSV:", e)
                writer.writerow(
                    {
                        "comment": "comments disabled",
                        "author_display_name": "",
                        "comment_like_count": "",
                    }
                )
        return

    def parse_comments(self):

        if "items" in self.response and self.response["items"]:
            ncoms = self.response["pageInfo"]["totalResults"]
            for i in range(0, ncoms):
                self.rpcom = self.response["items"][i]["snippet"]["topLevelComment"]["snippet"]["textOriginal"]
                self.rpauth = self.response["items"][i]["snippet"]["topLevelComment"]["snippet"]["authorDisplayName"]
                self.rplike = self.response["items"][i]["snippet"]["topLevelComment"]["snippet"]["likeCount"]
                self.write_to_csv()

        else:
            print("Comments are disabled for the video:", self.video_id_to_extract_comments)
            self.write_to_csv()  # Write minimum data to CSV in case of disabled comments

    def request_comments(self):
        try:
            nextPageToken = None

            while True:
                request = self.youtube.commentThreads().list(
                    part="snippet,replies", videoId=self.video_id_to_extract_comments, pageToken=nextPageToken
                )
                res = request.execute()
                self.response = res

                self.parse_comments()

                if "nextPageToken" in res:
                    nextPageToken = res["nextPageToken"]
                else:
                    break

        except Exception as e:
            print("Error fetching comments:", e)
            self.write_to_csv()  # Write minimum data to CSV in case of an error


# main driver
if __name__ == "__main__":
    load_dotenv()
    myapi = os.getenv("API_KEY")
    Y = Ycom()
    Y.make_youtube()

    video_link = input("Enter a YouTube video link: ")
    Y.set_video_id(video_link)

    Y.request_comments()
