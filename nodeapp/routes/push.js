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
                if (!status)
                    status = {};

                status.dbtag = config.domain(req).dbtag;
                status.ids = peopleIds;
                status.time = new Date().getTime();

                db.statuses.save(status);

            });
            var counter = counter = {
                time:new Date().getTime(),
                count:countedMacs,
                people:peopleIds.length,
                dbtag:config.domains(req).dbtag
            };
            db.counters.find({dbtag:config.domain(req).dbtag}).sort({time:-1}).limit(1).toArray(function (err, arr) {
                var lastCounter = arr[0];
                var hadDevicesPresentBefore = lastCounter.count > 0;
                var hasDevicesPresentNow = counter.count > 0;
                if (hasDevicesPresentNow !== hadDevicesPresentBefore) {
                    twitterAdmin.postMessage(hasDevicesPresentNow, req);
                }
                db.counters.save(counter, function (err, cnt) {
                    res.end("OK\n");
                });
            });


        });

    });
};
