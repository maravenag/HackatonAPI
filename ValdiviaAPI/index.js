var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var Tweets = require('./tweets.js');
var tweets = new Tweets();
var cors = require("cors");

var app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/getTweetList', function (req, res) {
    var query = require('url').parse(req.url, true).query;
    query.username != undefined ? tweets.getTweetsList(query.username, response) :
        tweets.getTweetsList(null, response);
    function response(d) {
        res.send(JSON.stringify(d));
    }
});

app.get('/getGroupedTweets', function (req, res) {
    var query = require('url').parse(req.url, true).query;
    query.username != undefined ? tweets.getTweetsByDate(query.username, response) :
        tweets.getTweetsByDate(null, response);

    function response(d) {
        res.send(JSON.stringify(d));
    }

});

app.listen(3000, function () {
    console.log('Listening on port 3000');
});


