
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
	'':true
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
			db.counters.insert({time: new Date().getTime(), 
				count: countedMacs, people: list.length});
			db.statuses.find().toArray(function(err, statuses) {
				if (statuses.length < 1) {
					db.statuses.insert({ time: new Date().getTime(), ids: list });
				}
				else {
					db.statuses.update(statuses[0], 
						{ time: new Date().getTime(), ids: list });
				}
				res.end("OK\n");
			});
		});
	});
};
