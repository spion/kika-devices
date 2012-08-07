var mongodb = require('../models/db.js'),
    auth = require('../models/auth.js');

twitterAdmin = require('../models/twitter-admin.js');

module.exports = function (app) {
    app.get('/admin/twitter-test', auth.admin, function (req, res) {
        twitterAdmin.postMessage(true, function (a, b, c) {
            res.end("Test message posted");
        });
    });
   app.get('/admin/dbindex', auth.admin, function (req, res) {
        var db = mongodb();
        db.counters.ensureIndex({time:1});
        db.users.ensureIndex({'twitter.id':1});
        db.users.ensureIndex({id:1});
        db.updates.ensureIndex({type:1, time:-1});
        res.send("OK\n");
    });
    app.get('/admin/remove', auth.admin, function (req, res) {
        var db = mongodb();
        db.counters.remove({count:0});
        res.send("OK\n");
    });
    app.get('/admin/users', auth.admin, function (req, res) {
        var db = mongodb();
        db.users.find().toArray(function (err, users) {
            res.render('admin/users', {users:users});
        });
    });

    app.get('/admin/migrate', auth.admin, function (req, res) {
        var hq = mongodb(process.env.MONGOHQ_URL);
        var lab = mongodb(process.env.MONGOLAB_URI);
        var tables = ['counters', 'users', 'updates', 'statuses'];
        for (var i = 0; i < tables.length; ++i) {
            (function (t) {
                hq[t].find().toArray(function (err, arr) {
                    for (var k = 0; k < arr.length; ++k) lab[t].save(arr[k]);
                });
            }(tables[i]));

        }
    });
};
