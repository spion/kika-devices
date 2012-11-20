
var twitterAdmin = require('../models/twitter-admin.js');

exports.timeline = function(test) {
    test.expect(1);

    twitterAdmin.exec('get',
        'https://api.twitter.com/1/statuses/user_timeline.json',
        null,
        function (err, data, response) {
            data = JSON.parse(data);
            console.log(err, data);
            test.ok(!err && data, "Error receiving timeline: " + JSON.stringify(err));
            test.done();
        });
};