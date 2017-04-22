import tweepy
import time
import requests
from pymongo import MongoClient
import json

consumer_key = "K8GaSgJuFkCkie8oybOdDVbSG"
consumer_secret = "yfxcNwkMxoyAuDRc5VFfZWch7GEH2yMzMeporoE7R2tM6sYkea"
access_token = "711929102517866497-WUh82EoQR1gU23x7on0VNrZ0G7VQ7Fu"
access_secret = "f3sYwhattCIzqnxPYCSOOwYGFnHlv6f00o9ay28WRqFeE"

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_secret)

api = tweepy.API(auth)

since_id = 12345
count = 100
tweets_num = 0

client = MongoClient('localhost', 27017)
db = client.valdiviatweets
tweets_collections = db.tweets



while(1):
    try:

        print ("-- Start searching for tweets in Valdivia --")
        tweets = api.search(q="", since_id=since_id,
                            count=count, geocode="-39.8,-73.23,10km")
        tweets_id = []
        print("Number of tweets: " + str(len(tweets)))

        for tweet in tweets:
            tweets_id.append(tweet.id)
            data = {
                "tweets_id": tweet.id,
                "tweet_text": tweet.text,
                "screen_name": tweet.user.screen_name,
                "date": tweet.created_at
            }
            tweets_collections.insert_one(data)

        since_id = max(tweets_id)
        print("--New search in 3 minutes--")
        time.sleep(3 * 60)

    except tweepy.error.RateLimitError:
        print('Rate Limit Error, Waiting 2 Minutes')
        time.sleep(2 * 60)
