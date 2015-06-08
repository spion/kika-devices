var http = require('http'),
    url = require('url'),
    path = require('path'),
    async = require('async'),
    request = require('request');

module.exports = function(app) {

    function qs(obj) {
        var str = [];
        for (var key in obj) if (obj.hasOwnProperty(key))
            str.push(key + '=' + obj[key]);
        var jstr = str.join('&');
        return jstr.length ? '?' + jstr : '';    
    }

    function urlify(base, subpath, params) {
        return url.parse(base + subpath + qs(params));
    }



    var cache = {};

    function updateCache() {
        var yesterday = new Date(Date.now() - 1000 * 86400).toISOString();
        var feeds = [{
                url:'86779/datastreams/hacklab_status', 
                params: {start: yesterday} 
            },{
                url: '64655', 
                params: {start: yesterday, limit:300}
            }];
        var urls = feeds.map(function(f) { 
            return {
                url: urlify('http://api.cosm.com/v2/feeds/', f.url, f.params),
                headers: {
                    'X-ApiKey':'TgZljX6Yu10Bnwja0xOtSu6IXh6SAKw4UlBualJSajZXcz0g'
                }
            };
        });
        async.map(urls, function(item, cb) { 
            request(item, function(err, res, body) {
                cb(err, body);
            });
        }, function(err, results) {
            if (err) throw err;
            for (var k = 0; k < results.length; ++k) {
                cache[feeds[k].url] = results[k];
            }
        });
    }
    setInterval(updateCache, 300 * 1000);
    updateCache();


    app.use('/cosm-feeds', function(req, res) {
        var path = req.url.split('?')[0].substr(1);
        res.contentType('application/json');
        return res.end(cache[path] || {});
    });
 
    app.get('/space.json', function(req, res) {
        // http://spaceapi.net/documentation
        var path = '86779/datastreams/hacklab_status'
        var hacklab_status = JSON.parse(cache[path])
        var space = {
            "api": "0.13",
            "space": "Hacklab Kika",
            "url": "http://b10g.spodeli.org/",
            "location": {
                "address": "8, Vasil Stefanovski, Kapishtec, Skopje, Macedonia",
                "lon": 41.9962347,
                "lat": 21.4183671,
            },
            "state": {
                'open': hacklab_status.current_value === '1'
            }
        }
        res.contentType('application/json');
        return res.end(JSON.stringify(space))
    });
};
