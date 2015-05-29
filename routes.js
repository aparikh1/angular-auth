var router = require('express').Router();
var crypto = require('crypto')
var flash = require('connect-flash')

var User = require('./user.model.js');

router.get('/', function (req, res) {
	res.render('home');
});

router.get('/signup', function (req, res) {
	res.render('signup');
});

router.post('/signup', function (req, res, next) {

	User.create(req.body, function (err, user) {
		if (err) next(err);
		else res.redirect('/success');
	});
});

router.get('/login', function (req, res) {
	res.render('login');
});

router.post('/login', function (req, res, next) {

	User.findOne({ username: req.body.username }, function (err, user) {
		var dbPassword = crypto.pbkdf2Sync(req.body.password, user.salt, 0, 64).toString('base64');

		if(dbPassword === user.hashedPassword) {
			if (req.body.role) {
				req.session.admin = req.body.role;
			}

			req.session.userId = req.body.username;
			req.session.cookie.maxAge = 60000;
			res.render('success');
		}
		else if(err) next(err);
		else { res.redirect('/failure');}
	});
});

router.get('/membersOnly', isAuthenticated);

router.get('/adminsOnly', isAuthenticated);

function isAdmin (req, res, next) {
	if (req.session.admin) {
		res.render('secret');
	} else {
		next(401);
	}
}

function isAuthenticated (req, res, next) {
	if (req.session.userId) {
		res.render('secret');
	} else {
		next(401);
	}
}


router.get('/success', function (req, res) {
	res.render('success');
});

router.get('/logout', function (req, res) {
	req.session.userId = null;

	req.session.destroy(function(err) {
		if(err) next(err);
	})
	res.redirect('/');
});

router.get('/failure', function (req, res, next) {
	var err = new Error('Not Authenticated');
	err.status = 401;
	next(err);
});

module.exports = router;