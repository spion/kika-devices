var requireAuth = require('../models/auth.js'),
    mongodb = require('../models/db.js');

module.exports = function(app) {
	app.get('/config', requireAuth, function(req, res) {
		res.render('config', {user:req.user});
	});
	app.post('/config/update', requireAuth, function(req, res) {
		var db = mongodb();
		req.user.macs = req.body.macs.split("\n");
		db.users.save(req.user);
		res.redirect('/');
	});
};
