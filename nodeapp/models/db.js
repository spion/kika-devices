var mongo = require('./mongodb-wrapper.js'),
    config = require('../config.js');

//var defaultDB = process.env.MONGOHQ_URL;
var defaultDB = process.env.MONGOLAB_URI;


var mongodb = function (dbURL) {
    var connString = dbURL || defaultDB || config.mongodbConnectionString;
    var parts = /mongodb:\/\/(.*):(.*)@(.*):([0-9]*)\/(.*)/.exec(connString);
    parts[1] = parts[1].length ? parts[1] : null;
    parts[2] = parts[2].length ? parts[2] : null;
    var db = mongo.db(parts[3], parts[4], parts[5], null, parts[1], parts[2]);
    db.collection('counters');
    db.collection('statuses');
    db.collection('users');

    db.collection('updates');
    return db;
};


module.exports = mongodb;


