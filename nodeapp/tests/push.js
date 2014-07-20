var Promise = require('bluebird');
var t = require('blue-tape');
var mwserver = require('middleware-tester');
var through2 = require('through2');
var app = require('../app');

var testableServer = new mwserver.TestableServer(app)
var tester;

function postString(tester, url, string) {
    var t = through2();
    t.end(string);
    return t.pipe(tester.post(url)).then(function(res) {
        return res.body;
    });
}

var macs = [
    "00:21:cc:b9:0e:3d",
    "00:21:cc:b9:0e:3e",
    "00:21:cc:b9:0e:3f"
];

t.test("prepare", function(t) {
    return testableServer.ready().then(function() {
        tester = testableServer.tester();
    });
});

t.test("push", function(t) {
    var initial = tester.getJSONAsync('/status');
    var after = initial.then(function() {
        return postString(tester, '/push', macs.join('\n'));
    }).then(function(res) {
        return tester.getJSONAsync('/status');
    });
    return Promise.join(initial, after).spread(function(before, after) {
        t.equals(before.body.counters.length + 1,
                 after.body.counters.length,
                 'should add a counter');
    });

});

t.test("after", function(t) {
    return testableServer.close().then(function() {
        t.end();
        process.exit();
    })
});
