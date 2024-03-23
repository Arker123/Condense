import re
import sys
import logging
from string import punctuation

import nltk
import emoji
import pandas as pd
from nltk.stem import PorterStemmer, LancasterStemmer, WordNetLemmatizer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.utils import resample
from sklearn.metrics import accuracy_score, confusion_matrix
from nltk.stem.snowball import SnowballStemmer
from sklearn.naive_bayes import GaussianNB
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer

# Configure logger
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

nltk.download("wordnet")
nltk.download("stopwords")
nltk.download("vader_lexicon")
nltk.download("omw-1.4")

stop_words = stopwords.words("english")
porter_stemmer = PorterStemmer()
lancaster_stemmer = LancasterStemmer()
snowball_stemer = SnowballStemmer(language="english")
lzr = WordNetLemmatizer()


def text_processing(text):
    text = text.lower()
    text = emoji.demojize(text)
    text = re.sub(r"\n", " ", text)

    text = re.sub("[%s]" % re.escape(punctuation), "", text)
    text = re.sub("^a-zA-Z0-9$,.", "", text)
    text = re.sub(r"[^\w\s\:\d]", "", text)
    text = re.sub(r"\s+", " ", text, flags=re.I)
    text = re.sub(r"\W", " ", text)

    sentences = nltk.tokenize.sent_tokenize(text)
    text = " ".join([word for word in word_tokenize(sentences[0]) if word not in stop_words])
    text = " ".join([lzr.lemmatize(word) for word in word_tokenize(text)])
    return text


def model(processed_data):
    df_neutral = processed_data[(processed_data["Sentiment"] == 1)]
    df_negative = processed_data[(processed_data["Sentiment"] == 0)]
    df_positive = processed_data[(processed_data["Sentiment"] == 2)]

    df_negative_upsampled = resample(df_negative, replace=True, n_samples=205, random_state=42)
    df_neutral_upsampled = resample(df_neutral, replace=True, n_samples=205, random_state=42)
    final_data = pd.concat([df_negative_upsampled, df_neutral_upsampled, df_positive])

    corpus = []
    for sentence in final_data["comment"]:
        corpus.append(sentence)
    corpus[0:5]

    cv = CountVectorizer(max_features=1500)
    X = cv.fit_transform(corpus).toarray()
    y = final_data.iloc[:, -1].values

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=0)
    classifier = GaussianNB()
    classifier.fit(X_train, y_train)

    y_pred = classifier.predict(X_test)
    cm = confusion_matrix(y_test, y_pred)
    nb_score = accuracy_score(y_test, y_pred)
    logger.info("accuracy : %s", nb_score)


def sentiment(data):
    sentiments = SentimentIntensityAnalyzer()
    data["Positive"] = [sentiments.polarity_scores(i)["pos"] for i in data["comment"]]
    data["Negative"] = [sentiments.polarity_scores(i)["neg"] for i in data["comment"]]
    data["Neutral"] = [sentiments.polarity_scores(i)["neu"] for i in data["comment"]]
    data["Compound"] = [sentiments.polarity_scores(i)["compound"] for i in data["comment"]]
    score = data["Compound"].values
    sentiment = []
    for i in score:
        if i >= 0.05:
            sentiment.append("Positive")
        elif i <= -0.05:
            sentiment.append("Negative")
        else:
            sentiment.append("Neutral")
    data["Sentiment"] = sentiment
    return data


def main():
    data = pd.read_csv("comments.csv")
    data1 = data.drop(["author_display_name", "comment_like_count"], axis=1)
    data1 = sentiment(data1)
    data2 = data1.drop(["Positive", "Negative", "Neutral", "Compound"], axis=1)

    data_copy = data2.copy()
    data_copy.comment = data_copy.comment.apply(lambda text: text_processing(text))

    le = LabelEncoder()
    data_copy["Sentiment"] = le.fit_transform(data_copy["Sentiment"])
    model(data_copy)


if __name__ == "__main__":
    sys.exit(main())
