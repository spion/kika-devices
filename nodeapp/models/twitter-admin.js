var mongodb = require('./db.js'),
    oauth = require('oauth'),
    config = require('../models/config.js');


exports.postMessage = function (isOpened, req, callback) {
    var consumer = new oauth.OAuth(
        "https://twitter.com/oauth/request_token",
        "https://twitter.com/oauth/access_token",
        config.twitterAdmin.key, config.twitterAdmin.secret,
        "1.0", config.get(req).baseUrl + "/login/admin/callback", "HMAC-SHA1");
    var db = mongodb();
    db.users.findOne({id:config.get(req).twitterPostUID}, function (err, admin) {
        if (err || !admin) {
            console.log("Twitter UID not found");
            callback("Could not find twitter post user", null);
            return;
        }
        consumer.post(
            "https://api.twitter.com/1/statuses/update.json",
            admin.authAdmin.token, admin.authAdmin.tokenSecret,
            {status:"#хаклаб #skopjehacklab e " + (isOpened ? "отворен" : "затворен")},
            null,
            callback
        );

    })
};

