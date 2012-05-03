var mongodb = require('./db.js'),
    oauth = require('oauth'),
    config = require('../config.js');


var consumer = exports.consumer = function () {
    return new oauth.OAuth(
        "https://twitter.com/oauth/request_token",
        "https://twitter.com/oauth/access_token",
        config.twitterAdmin.key, config.twitterAdmin.secret,
        "1.0", config.baseUrl + "/login/admin/callback", "HMAC-SHA1");
};

exports.postMessage = function (isOpened, callback) {

    //console.log("Looking for twitter UID");

    exports.exec('post',
        "https://api.twitter.com/1/statuses/update.json",
        {status:"#хаклаб #skopjehacklab e " + (isOpened ? "отворен" : "затворен")},
        callback);

};

exports.exec = function (method, url, params, callback) {
    var db = mongodb();
    db.users.findOne({id:config.twitterStatus.UID}, function (err, admin) {

        if (err || !admin) {
            console.log("Twitter UID not found");
            callback("Could not find twitter post user", null);
            return;
        }

        var cons = consumer();
        cons[method](url,
            admin.authAdmin.token, admin.authAdmin.tokenSecret,
            method == 'get' ? callback : params,
            method == 'get' ? undefined : null,
            method == 'get' ? undefined : callback);

    });
};
