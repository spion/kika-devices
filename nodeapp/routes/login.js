// login pages

var passport = require('passport');

module.exports = function(app) {
	app.get('/login', passport.authenticate('twitter'), function(req, res) { });
	app.get('/login/callback', passport.authenticate('twitter', { failureRedirect: '/login' }),
		function(req, res) { res.redirect('/config'); });
};

