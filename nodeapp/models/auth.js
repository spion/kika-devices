var passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    config = require('../config.js'),
    mongodb = require('../models/db.js');

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    var db = mongodb();
    db.users.find({id:id}).toArray(function (err, users) {
        if (users && users.length) {
            done(err, users[0]);
        }
        else {
            done("User not found", null);
        }
    });
});

var normalTwitterStrategy = new TwitterStrategy({
    consumerKey:config.twitter.key,
    consumerSecret:config.twitter.secret,
    callbackURL:config.baseUrl + "/login/callback"
}, function (token, tokenSecret, profile, done) {
    var db = mongodb();
    db.users.findOne({'twitter.id':profile.id}, function (err, user) {
        if (user) {
            // return user
            user.name = profile.username;
            user.pic = profile._json.profile_image_url;
            user.twitter = profile;
            user.auth = {token:token, tokenSecret:tokenSecret};
            db.users.save(user);
            done(err, user);
        }
        else {
            // create new user
            var usr = { macs:[], name:profile.username, pic:profile._json.profile_image_url, twitter:profile };
            db.users.save(usr, function (err, user) {
                user.id = user._id.toString();
                db.users.save(user);
                done(err, user);
            });
        }
    });
});
normalTwitterStrategy.name = 'twitter';

var adminTwitterStrategy = new TwitterStrategy({
    consumerKey:config.twitterAdmin.key,
    consumerSecret:config.twitterAdmin.secret,
    callbackURL:config.baseUrl + "/login/admin/callback"
}, function (token, tokenSecret, profile, done) {
    var db = mongodb();
    db.users.findOne({'twitter.id':profile.id}, function (err, user) {

        if (!user) {
            user = {};
        }
        // return user
        user.name = profile.username;
        user.pic = profile._json.profile_image_url;
        user.twitter = profile;
        user.authAdmin = {token:token, tokenSecret:tokenSecret};
        if (user.id) {
            db.users.save(user);
            done(err, user);
        }
        else {
            db.users.save(user, function (err, usr) {
                usr.id = usr._id.toString();
                db.users.save(usr);
                done(err, usr);
            });
        }

    });
});

adminTwitterStrategy.name = "twitter-admin";

passport.use(normalTwitterStrategy);
passport.use(adminTwitterStrategy);

exports.user = function (req, res, next) {
    if (req.isAuthenticated()) return next();
    res.cookie('redirect', req.url);
    res.redirect('/login');
};

exports.admin = function (req, res, next) {
    if (req.isAuthenticated() && config.admins[req.user.id]) return next();
    res.cookie('redirect', req.url);
    res.redirect('/login/admin');
};

exports.redirect = function (req, res) {
    var redirectUrl = req.cookies && req.cookies.redirect ? req.cookies.redirect : '/';
    res.redirect(redirectUrl);
};

exports.redirectAdmin = function (req, res) {
    var redirectUrl = req.cookies && req.cookies.redirect ? req.cookies.redirect : '/admin/twitter-test';
    res.redirect(redirectUrl);
};
