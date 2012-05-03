var mongodb = require('../models/db.js'),
    config = require('../config.js'),
    twitterAdmin = require('../models/twitter-admin.js');

var macMap = function (arr) {
    //arr = [{name: 'gdamjan', twitter: {}, macs: ["mac1", "mac2", "mac3"]}]
    var map = {};
    for (var i = 0; i < arr.length; ++i) {
        if (arr[i].length) map[arr[i]] = true;
    }
    return map;
};

var blackListMac = {
    '':true,
    '00:0c:76:5d:1c:9c':true,
    '78:e4:00:ee:42:88':true
};

module.exports = function (app) {
    app.post('/push/update', function (req, res) {
        try {
            var db = mongodb();
            var json = req.rawBody ? JSON.parse(req.rawBody) : req.body;
            if (!json.time) json.time = new Date().getTime();
            if (json.type) {
                db.updates.save(json);
            }
            res.end("OK\n");
        }
        catch (e) {
            console.log(e);
            res.end(JSON.stringify(e));
        }
    });
    app.post('/push', function (req, res) {
        var db = mongodb();
        db.users.find().toArray(function (err, users) {
            var macs = macMap(req.rawBody.split("\n"));

            var countedMacs = 0;
            for (var key in macs) {
                if (!blackListMac[key]) ++countedMacs;
            }


            var peopleIds = [];
            for (var k = 0; k < users.length; ++k) {
                if (users[k].macs) for (var j = 0; j < users[k].macs.length; ++j) {
                    if (macs[users[k].macs[j]]) {
                        peopleIds.push(users[k].id);
                        break;
                    }
                }
            }

            db.statuses.findOne(function (err, status) {
                if (!status) {
                    status = { time:new Date().getTime(), ids:peopleIds }
                }
                else {
                    status.ids = peopleIds;
                    status.time = new Date().getTime();
                }
                db.statuses.save(status);

            });
            var currentCounter = {
                time:new Date().getTime(),
                count:countedMacs,
                people:peopleIds.length
            };
            db.counters.find({time:{$gt:currentCounter.time
                - config.twitterStatus[currentCounter.count ? 'minutesToTwitOpen' : 'minutesToTwitClosed'] * 1000 * 60 * 60}})
                .sort({time:-1}).toArray(
                function (err, counters) {
                    console.log(counters);
                    if (counters.length && counters.reduce(function (allOthers, counter, counterIndex) {
                        return allOthers && (counterIndex >= counters.length - 1 ||
                            (currentCounter.count ? counter.count : !counter.count));
                    }, true) && ((counters[counters.length - 1] > 0) != (currentCounter.count > 0))) {
                        console.log('counter rules satisfied, checking twitter')
                        // url, oauth_token, oauth_token_secret, callback
                        var rightNow = new Date().getTime();
                        var searchKeyword = currentCounter.count > 0
                            ? config.twitterStatus.openedKeyword
                            : config.twitterStatus.closedKeyword;
                        twitterAdmin.exec('get',
                            'http://api.twitter.com/1/statuses/user_timeline.format',
                            null,
                            function (err, data) {
                                console.log(err, data);
                                if (JSON.parse(data).reduce(function (other, item) {
                                    return other
                                        && new Date(item.created_at).getTime() > rightNow
                                        - 1000 * 60 * config.twitterStatus.maxTwitterStatusAgeMinutes
                                        && item.text.indexOf(searchKeyword) < 0;
                                }, true)) {
                                    console.log("timeline seems to be ok, posting...")
                                    twitterAdmin.postMessage(currentCounter.count > 0);
                                }
                            });
                    }
                    db.counters.save(currentCounter, function (err, cnt) {
                        res.end("OK\n");
                    });
                });


        });

    });
};
