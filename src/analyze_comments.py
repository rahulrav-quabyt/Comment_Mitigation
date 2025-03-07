import json
from transformers import pipeline
from better_profanity import profanity

# Load the sentiment analysis pipeline
sentiment_analyzer = pipeline(
    "sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english", truncation=True
)

# Load the comments from db.json
with open("db.json", "r") as file:
    data = json.load(file)
    comments = data.get("comments", [])

# Function to split long comments into smaller chunks (max 512 tokens each)
def split_into_chunks(text, max_length=512):
    words = text.split()
    for i in range(0, len(words), max_length):
        yield " ".join(words[i:i + max_length])

# Analyze sentiment and check for profanity
for comment in comments:
    body = comment.get("content")

    # Handle long comments by splitting into chunks
    sentiments = [sentiment_analyzer(chunk)[0] for chunk in split_into_chunks(body)]

    # Aggregate sentiment results
    positive_count = sum(1 for s in sentiments if s['label'] == 'POSITIVE')
    negative_count = sum(1 for s in sentiments if s['label'] == 'NEGATIVE')

    # Determine if the comment contains obscene language
    obscene_flag = profanity.contains_profanity(body)

    # Assign only one column to 1 based on priority: Obscene > Negative > Positive
    positive = 0
    negative = 0
    obscene = 0

    if obscene_flag:
        obscene = 1
    elif negative_count > positive_count:
        negative = 1
    else:
        positive = 1

    # Update the comment with sentiment analysis results
    comment.update({
        "positive": positive,
        "negative": negative,
        "obscene": obscene,
    })

# Save the updated data back to db.json
with open("db.json", "w") as file:
    json.dump(data, file, indent=4)

print("Sentiment analysis results updated in 'db.json'!")