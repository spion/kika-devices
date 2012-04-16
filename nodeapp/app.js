
/**
 * Module dependencies.
 */

var express = require('express'), 
	http = require('http'),
	fs = require('fs');

var app = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


var files = fs.readdirSync(__dirname + '/routes');
for (var k = 0; k < files.length; ++k) {
	var router = require("./routes/" + files[k]);
	router(app);
}

http.createServer(app).listen(8080);

console.log("Express server listening on port 8080");
