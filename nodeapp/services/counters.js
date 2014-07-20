
var mongodb = require('../models/db.js');

var config = require('../config');

var macMap = function (arr) {
    //arr = [{name: 'gdamjan', twitter: {}, macs: ["mac1", "mac2", "mac3"]}]
    var map = {};
    for (var i = 0; i < arr.length; ++i) {
        if (arr[i].length) map[arr[i]] = true;
    }
    return map;
};


function getPeopleMatching(users, macs) {
    var peopleIds = [];
    for (var k = 0; k < users.length; ++k) {
        if (users[k].macs) for (var j = 0; j < users[k].macs.length; ++j) {
            if (macs[users[k].macs[j]]) {
                peopleIds.push(users[k].id);
                break;
            }
        }
    }
    return peopleIds;
}

function updatePresentPeople(db, peopleIds, callback) {
    db.statuses.findOne(function (err, status) {
        if (err) return callback(err);
        if (!status) {
            status = { time:new Date().getTime(), ids:peopleIds };
        }
        else {
            status.ids = peopleIds;
            status.time = new Date().getTime();
        }
        db.statuses.save(status, callback);
    });
}

function updateCounters(db, peopleIds, macs, callback) {
    var countedMacs = 0;
    for (var key in macs)
        if (!blackListMac[key])
            ++countedMacs;

    var currentCounter = {
        time:new Date().getTime(),
        count:countedMacs,
        people:peopleIds.length
    };
    db.counters.save(currentCounter, callback);
}

function saveMacs(macs, saved) {
    macs = macMap(macs);

    var db = mongodb();
    db.users.find().toArray(function (err, users) {
        var peopleIds = getPeopleMatching(users, macs);
        updatePresentPeople(db, peopleIds, function(){
            updateCounters(db, peopleIds, macs, saved);
        });

    });
}

function getCounters(since, maxResults, callback) {
    var db = mongodb();

    db.counters.find({time:{$gte:since}}).sort({time:-1})
        .limit(maxResults)
        .toArray(function (err, counters) {
            if (err) {
                callback({err:err});
                return;
            }
            db.statuses.find().toArray(function (err, statuses) {
                if (err) {
                    callback({err:err});
                    return;
                }
                var stat = null;
                if (statuses.length) {
                    db.users.find({id:{$in:statuses[0].ids}}).toArray(function (err, users) {
                        var filteredUsers = users.map(function (u) {
                            return {id:u.id, name:u.name, pic:u.pic};
                        });
                        callback({
                            err:null,
                            counters:counters,
                            present:filteredUsers
                        });
                    });
                }
                else {
                    callback({
                        err:null,
                        counters:counters,
                        present:[]
                    });
                }
                return;
            });
        });
}



var blackListMac = config.blacklist || {};

exports.saveMacs = saveMacs;
exports.getCounters = getCounters;
