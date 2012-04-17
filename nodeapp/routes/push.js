
var mongodb = require('../models/db.js');


var macMap = function(arr) {
	//arr = [{name: 'gdamjan', twitter: {}, macs: ["mac1", "mac2", "mac3"]}]
	var map = {};
	for (var i = 0; i < arr.length; ++i) {
		if (arr[i].length) map[arr[i]] = true;
	}
	return map;
}

var blackListMac = {
	'':true,
	'00:0c:76:5d:1c:9c':true
};

module.exports = function(app) {
	app.post('/push', function(req, res) {
		var db = mongodb();
		db.users.find().toArray(function(err, users) {
			var macs = macMap(req.rawBody.split("\n"));

			var countedMacs = 0;
			for (var key in macs) { if (!blackListMac[key]) ++countedMacs; };

			var list = [];
			for (var k = 0; k < users.length; ++k) {
				for (var j = 0; j < users[k].macs.length; ++j) {
					if (macs[users[k].macs[j]]) {
						list.push(users[k].id);
						break;
					}
				}
			}
			db.counters.findOne({time: {$gt : new Date().getTime() - 1000}}, 
				function(err, counter) {
					if (!counter) { 
						counter = { time: new Date().getTime(),
							count: countedMacs, people: list.length 
						};
					}
					if (countedMacs > counter.count) {
						counter.count = countedMacs;
						counter.people = list.length;
					}
					db.counters.save(counter);
			});
			db.statuses.findOne(function(err, status) {
				if (!status) {
					status = { time: new Date().getTime(), ids: list }
				}
				if (new Date().getTime() - status.time > 1000
					|| list.length > status.ids.length) {
					status.ids = list;
					status.time = new Date().getTime();
				}
				db.statuses.save(status); 

				res.end("OK\n");
			});
		});
	});
};
