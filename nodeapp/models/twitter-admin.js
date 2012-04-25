var mongodb = require('./db.js'),
    oauth = require('oauth'),
    config = require('../config.js');


exports.postMessage = function (isOpened, callback) {
    var consumer = new oauth.OAuth(
        "https://twitter.com/oauth/request_token",
        "https://twitter.com/oauth/access_token",
        config.twitterAdmin.key, config.twitterAdmin.secret,
        "1.0", config.baseUrl + "/login/admin/callback", "HMAC-SHA1");
    var db = mongodb();
    //console.log("Looking for twitter UID");
    db.users.findOne({id:config.twitterPostUID}, function (err, admin) {
        if (err || !admin) {
            console.log("Twitter UID not found");
            callback("Could not find twitter post user", null);
            return;
        }
        //admin.authAdmin.token;
        //admin.authAdmin.tokenSecret
        //console.log(admin.authAdmin);
        consumer.post(
            "https://api.twitter.com/1/statuses/update.json",
            admin.authAdmin.token, admin.authAdmin.tokenSecret,
            {status:"#хаклаб #skopjehacklab e " + (isOpened ? "отворен" : "затворен")},
            null,
            callback
        );

    })
};

