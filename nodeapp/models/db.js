var mongo = require('./mongodb-wrapper.js'),
	config = require('../config.js');

module.exports = function() {
	var connString = process.env.MONGOHQ_URL || config.mongodbConnectionString;
	var parts = /mongodb:\/\/(.*):(.*)@(.*):([0-9]*)\/(.*)/.exec(connString);
	parts[1] = parts[1].length ? parts[1] : null;
	parts[2] = parts[2].length ? parts[2] : null;
	var db = mongo.db(parts[3], parts[4], parts[5], null, parts[1], parts[2]);
	db.collection('counters');
	db.collection('statuses');
	db.collection('users');
	return db;
};
