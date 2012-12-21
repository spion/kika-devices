var http = require('http'),
    url = require('url'),
    path = require('path');

module.exports = function(app) {



    // Cache doesnt work right now.
    //
    var cache = (function cache() {
        var self = {}, objs = {};

        self.add = function(url, pres) {
            var obj = {time: Date.now() / 1000, headers: pres.headers, statusCode: pres.statusCode, data: []};
            pres.on('data', function(d) { 
                obj.data.push(d); 
            });
            pres.on('end', function() {
                objs[url] = obj;
            });
            return self;
        }

        self.has = function(url, maxage) {
            //console.log(objs);
            console.log(url, objs);
            return objs[url] && Date.now() / 1000 - objs[url].time < maxage
        };

        self.serve = function(url, res) {
            var pres = objs[url];
            res.writeHead(pres.statusCode, "", pres.headers);
            res.end(Buffer.concat(pres.data));
            return self;
        };

        return self;
        
    }());



    var proxy = function (path) {
        return function (req, res) {
            var real_url = path + req.url.replace(/^\//, '');
            //if (cache.has(real_url, 300)) return cache.serve(real_url, res);
            
            var requrl = url.parse(real_url);
            requrl.method = req.method;
            requrl.headers = req.headers;
            requrl.headers.host = requrl.host;
            var preq = http.request(requrl, function (pres) {
                console.log(req.method, real_url, "OK");
                res.writeHead(pres.statusCode, "", pres.headers);
                pres.pipe(res);
                //cache.add(real_url, pres);
            });
            preq.on('error', function (err) {
                console.log(req.method, real_url, "FAIL:", err);
                res.on('error', function() { });
                try { res.end("" + err, 500); } catch (e) { }
            });
            if (~['post','put'].indexOf(req.method.toLowerCase())) req.pipe(preq);
            else preq.end();

        };
    };

    app.use('/cosm-feeds', proxy('http://api.cosm.com/v2/feeds/'));
};
