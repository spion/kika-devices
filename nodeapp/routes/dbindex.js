var mongodb = require('../models/db.js');
module.exports = function(app) {
	app.get('/admin/dbindex', function(req, res) {
		var db = mongodb();
		db.counters.ensureIndex({time:1});
		db.users.ensureIndex({'twitter.id':1});
		db.users.ensureIndex({id:1});
		res.send("OK\n");
	});
	app.get('/admin/remove', function(req, res) {
		var db = mongodb();
		db.counters.remove({count:0});
		res.send("OK\n");
	});
};
