// login pages

var passport = require('passport'),
	TwitterStrategy = require('passport-twitter').Strategy,
	config = require('../config.js'),
	mongodb = require('../models/db.js');




passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	var db = mongodb();
	db.users.find({id: id}).toArray(function(err, users) {
		if (users && users.length) { done(err, users[0]); }
		else { done("User not found", null); }
	});
});

passport.use(new TwitterStrategy({
	consumerKey: config.twitter.key,
	consumerSecret: config.twitter.secret,
	callbackURL: config.baseUrl + "/login/callback"
}, function(token, tokenSecret, profile, done) {
	var db = mongodb(); 
	db.users.findOne({twitter: profile}, function(err, user) { 
		if (user) { 
			// return user
			done(err, user); 
		} 
		else {
			// create new user
			var usr = { macs:[], name:profile.username, pic: profile._json.profile_image_url, twitter:profile };
			db.users.save(usr, function(err, user) { 
				user.id = user._id.toString();
				db.users.save(user);
				done(err, user); 
			}); 
		} 
	});
}));

module.exports = function(app) {
	var requireAuth =  function(req, res, next) { if (req.isAuthenticated()) return next(); res.redirect('/login'); };

	app.get('/login', passport.authenticate('twitter'), function(req, res) {	
	});

	app.get('/login/callback', passport.authenticate('twitter', { failureRedirect: '/login' }),
		function(req, res) { res.redirect('/config'); });

	app.get('/config', requireAuth, function(req, res) {
		res.render('config', {user:req.user});
	});
	app.post('/config/update', function(req, res) {
		var db = mongodb();
		req.user.macs = req.body.macs.split("\n");
		db.users.save(req.user);
		res.redirect('/');
	});
};

