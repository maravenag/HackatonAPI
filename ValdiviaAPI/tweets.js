var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');
var url = 'mongodb://localhost:27017/valdiviatweets';

function Tweets() { }

Tweets.prototype.getTweetsList = function (user, response) {
    if (user != null) {
        MongoClient.connect(url, function (err, db) {
            var collection = db.collection("tweets");
            collection.find({ screen_name: user }).toArray(process_result);
        });
    }
    else {
        MongoClient.connect(url, function (err, db) {
            var collection = db.collection("tweets");
            collection.find().toArray(process_result);
        });
    }

    function process_result(err, docs) {
        assert.equal(err, null);
        var result = docs.map(function (d) {
            var aux = {};
            aux.screen_name = d.screen_name;
            aux.tweet_text = d.tweet_text;
            aux.date = d.date;
            return aux;
        });
        response(result);
    }
}

Tweets.prototype.getTweetsByDate = function (username, response) {
    MongoClient.connect(url, function (err, db) {
        var collection = db.collection("tweets");
        var query = [
            {
                $match: {}
            },
            {
                $group: {
                    _id: { day: { $dayOfWeek: "$date" }, hour: { $hour: "$date" } },
                    count: { $sum: 1 }
                }
            }
        ]

        if (username != null) {
            query[0].$match.screen_name = username;
        }

        collection.aggregate(query).toArray(function (err, docs) {
            response(docs);
        });
    });
}

// db.tweets.aggregate([{$group:{_id:{ $dayOfYear:"$created_at"},total: {$sum:1}}}])
module.exports = Tweets;