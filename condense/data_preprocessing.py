import csv
import sys
import re
import emoji
import nltk
from collections import Counter

def preprocess_data(filename):
    comments = []
    with open(filename, 'r', encoding='utf-8') as file:
        reader = csv.reader(file)
        next(reader) 
        for row in reader:
            comment = row[0]
            comments.append(comment.strip().lower())
    
    # Clean and tokenize the comments
    cleaned_comments = []
    for comment in comments:
        comment = emoji.demojize(comment)        
        comment = re.sub(r'[^\w\s\:\d]', '', comment)        
        sentences = nltk.tokenize.sent_tokenize(comment)
        tokenized_comment = sentences[0].split() 
        cleaned_comments.append(tokenized_comment)
    
    return cleaned_comments

# Step 2: Prepare the Data
def prepare_data(tokenized_comments):
    all_words = [word for comment in tokenized_comments for word in comment]
    word_counts = Counter(all_words)
    sorted_vocab = sorted(word_counts, key=word_counts.get, reverse=True)
    word_to_index = {word: i+1 for i, word in enumerate(sorted_vocab)}
    numerical_comments = [[word_to_index[word] for word in comment] for comment in tokenized_comments]
    return numerical_comments, word_to_index


def main():
    nltk.download("punkt")
    tokenized_comments = preprocess_data('comments.csv')
    numerical_comments, word_to_index = prepare_data(tokenized_comments)
    print("numerical_comments....................")
    print(numerical_comments)
    print("word_to_index .............")
    print(word_to_index)


if __name__ == "__main__":
    sys.exit(main())