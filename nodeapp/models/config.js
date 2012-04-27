module.exports = require('../config.js');

domains = {};
var files = require('fs').readdirSync('./config');
for (var k = 0; k < files.length; ++k)
    if (files[k].indexOf('.') !== 0)
        domains[files[k]] = require('../config/' + files[k]);


exports.domain = function (req) {
    if (domains[req.header('host').toLowerCase() + '.js'])
        return req.header('host').toLowerCase();
    return exports.defaultDomain;
};
exports.get = function (req) {
    return domains[exports.domain(req)];
};