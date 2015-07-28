
var saveMacs = require('../services/counters').saveMacs;

module.exports = function (app) {
    app.post('/push', function (req, res) {
        var macs = req.rawBody.split("\n");
        function saved() { res.end("OK\n"); }
        saveMacs(macs, saved);
    });
};
