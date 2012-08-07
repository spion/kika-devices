var mongodb = require('../models/db.js');



module.exports = function (app) {


    app.get("/status/103", function (req, res) {
        var db = mongodb();
        db.updates.find({type:'103_listeners', time:{$gte:new Date().getTime() - 24 * 60 * 60 * 1000 }})
            .sort({time:-1}).toArray(function (err, listeners) {
                if (req.param('callback')) res.end(req.param('callback') + '(' + JSON.stringify(listeners) + ')');
                else res.json(listeners);
            });
    });

    app.get("/status/temps", function (req, res) {
        var db = mongodb();
        db.updates.find({type:'temperature'}).sort({time:-1}).limit(1).toArray(function (err, temps) {
            res.json(temps);
        });
    });

    app.get("/status", function (req, res) {
        var db = mongodb();
        var yesterday = new Date().getTime() - 24 * 60 * 60 * 1000;

        var maxResults = req.query && req.query.limit && parseInt(req.query.limit,10) ? parseInt(req.query.limit,10) : 86400;

        db.counters.find({time:{$gte:yesterday}}).sort({time:-1})
        .limit(maxResults)
        .toArray(function (err, counters) {
            if (err) {
                res.json({err:err});
                return;
            }
            db.statuses.find().toArray(function (err, statuses) {
                if (err) {
                    res.json({err:err});
                    return;
                }
                var stat = null;
                if (statuses.length) {
                    db.users.find({id:{$in:statuses[0].ids}}).toArray(function (err, users) {
                        var filteredUsers = users.map(function (u) {
                            return {id:u.id, name:u.name, pic:u.pic};
                        });
                        res.json({
                            err:null,
                            counters:counters,
                            present:filteredUsers
                        });
                    });
                }
                else {
                    res.json({
                        err:null,
                        counters:counters,
                        present:[]
                    });
                }
                return;
            });
        });
    });
};
