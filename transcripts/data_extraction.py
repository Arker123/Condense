import os
from pprint import pprint
import googleapiclient.discovery
import csv
from API_Key import myapi
from pyshorteners import Shortener  # Install pyshorteners using pip

class Ycom(object):
    def __init__(self):
        self.title = ""
        self.description = ""
        self.published_at = ""  # video
        self.rpcom = ""
        self.rppubat = ""  # comment
        self.rpauth = ""
        self.rplike = ""
        self.tcomment_count = ""
        self.tdislike_count = ""
        self.tfavorite_count = ""
        self.tlike_count = ""
        self.tview_count = ""
        self.videos = []
        self.video_id_to_extract_comments = ""
        self.subscribe_count = ""
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
        if 'youtube.com/watch?v=' in video_link:
            video_id = video_link.split('youtube.com/watch?v=')[1].split('&')[0]
        elif 'youtu.be' in video_link:
            video_id = video_link.split('youtu.be/')[1].split('?')[0]
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
        print("writing to csv ", self.video_id_to_extract_comments)
        file_exists = os.path.isfile('comments.csv')

        with open('comments.csv', 'a') as csvfile:
            headers = [
                'video_id',
                'title',
                'description',
                'comment',
                'published_at',
                'author_display_name',
                'comment_like_count',
                'comment_count',
                'video_dislike_count',
                'video_favourite_count',
                'video_like_count',
                'video_view_count',
                'channel_subscriber_count',
            ]
            writer = csv.DictWriter(csvfile, delimiter=',',
                                    lineterminator='\n',
                                    fieldnames=headers,
                                    )
            print(file_exists)
            if not file_exists:
                writer.writeheader()
            try:
                writer.writerow({
                    'video_id': self.video_id_to_extract_comments,
                    'title': self.title,
                    'description': self.description,
                    'comment': self.rpcom,
                    'published_at': self.published_at,
                    'author_display_name': self.rpauth,
                    'comment_like_count': self.rplike,
                    'comment_count': self.tcomment_count,
                    'video_dislike_count': self.tdislike_count,
                    'video_favourite_count': self.tfavorite_count,
                    'video_like_count': self.tlike_count,
                    'video_view_count': self.tview_count,
                    'channel_subscriber_count': self.subscribe_count,
                })
            except:
                writer.writerow({
                    'video_id': self.video_id_to_extract_comments,
                    'title': self.title,
                    'description': self.description,
                    'comment': 'comments disabled',
                    'published_at': self.published_at,
                    'channel_subscriber_count': self.subscribe_count,
                })
        return

    def parse_comments(self):
        print("Parsed -----------------------------------------------------------------------------------")
        print(self.response)

        # Get ratings stats ready for CSV
        ratings = self.get_ratings(self.video_id_to_extract_comments)

        if 'items' in self.response and self.response['items']:
            ncoms = self.response['pageInfo']['totalResults']

            for i in range(0, ncoms):
                self.rpcom = self.response['items'][i]['snippet']['topLevelComment']['snippet']['textOriginal']
                print("\n")
                print(self.rpcom)
                self.rppubat = self.response['items'][i]['snippet']['topLevelComment']['snippet']['publishedAt']
                self.rpauth = self.response['items'][i]['snippet']['topLevelComment']['snippet']['authorDisplayName']
                self.rplike = self.response['items'][i]['snippet']['topLevelComment']['snippet']['likeCount']

                self.write_to_csv()
                print("Adding to csv...", self.video_id_to_extract_comments)
                print(
                    self.tcomment_count,
                    "\t", self.tdislike_count,
                    "\t", self.tfavorite_count,
                    "\t", self.tlike_count,
                    "\t", self.tview_count
                )
        else:
            print("Comments are disabled for the video:", self.video_id_to_extract_comments)
            self.write_to_csv()  # Write minimum data to CSV in case of disabled comments

    def request_comments(self):
        try:
            request = self.youtube.commentThreads().list(
                part="snippet,replies",
                videoId=self.video_id_to_extract_comments
            )
            res = request.execute()
            self.response = res

            self.parse_comments()

        except Exception as e:
            print("Error fetching comments:", e)
            self.write_to_csv()  # Write minimum data to CSV in case of an error

# main driver
if __name__ == "__main__":
    Y = Ycom()
    Y.make_youtube()

    # User input for YouTube video link
    video_link = input("Enter a YouTube video link: ")
    Y.set_video_id(video_link)

    Y.request_comments()
    print("\n\n ++++++++++++ All done, check comments.csv! ++++++++++++++")
