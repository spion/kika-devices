var mongodb = require('../models/db.js');


module.exports = function(app) {
	app.get("/status", function(req, res) {
		var db = mongodb();
		var yesterday = new Date().getTime() - 26*60*60*1000;
		db.counters.find({time: {$gte: yesterday}}).sort({time: -1}).toArray(function(err, counters) {
			if (err) { res.end(JSON.stringify({err:err})); return; }
			db.statuses.find().toArray(function(err, statuses) {
				if (err) { res.end(JSON.stringify({err:err})); return; }
				var stat = null;
				if (statuses.length) {
					db.users.find({id: {$in: statuses[0].ids}}).toArray(function(err, users) {
						var filteredUsers = users.map(function(u) { return {name: u.name, pic: u.pic}; });
						res.end(JSON.stringify({
							err:null,
							counters: counters,					
							present: filteredUsers
						}));					
					});
				}
				else {
					res.end(JSON.stringify({
						err:null,
						counters: counters,					
						present: []
					}));
				}
				return;
			});
		});
	});
};
