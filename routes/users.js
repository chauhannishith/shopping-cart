var express = require('express');
var router = express.Router();

var User = require('../models/userdata');
var bcrypt = require('bcryptjs');
var passport = require('passport');

//
var app = express();
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');


app.use(session({
	secret: 'awesome',
	resave: true,
	saveUninitialized: true,
}));

//express message
app.use(require('connect-flash')());
app.use(function(req, res, next){
	res.locals.messages = require('express-messages')(req, res);
	next();
});
//express validator
app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;

		while(namespace.length){
			formParam += '[' + namespace.shift() + ']';
		}
		return{
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));
require('../config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

//

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/signup', notLoggedIn, function(req, res, next) {
  res.render('user/signup');
});

router.get('/signin', notLoggedIn, function(req, res, next) {
  res.render('user/signin');
});

router.post('/signin', notLoggedIn, function(req, res, next) {
  req.checkBody('username','Email is required').notEmpty();
  req.checkBody('password','Password is required').notEmpty();

  var errors = req.validationErrors();
  if(errors){
  	res.render('user/signin', {errors: errors});
  }
  else{
  	passport.authenticate('local', {
  		failureRedirect:'/users/signin',
  		failureFlash: true
  	}),function(req, res, next){
  		if(req.session.oldUrl){
  			res.redirect(req.session.oldUrl);
  			req.session.oldUrl = null;
  		}
  	};
  }
});

router.get('/myprofile', isLoggedIn, function(req, res, next) {
  var user = req.user;
  if(user)
  	res.render('user/myprofile',{user: user});
  else
  	res.render('user/signin');
});

router.post('/signup', notLoggedIn, function(req, res){
//	req.checkBody('Name', 'Name is required').notEmpty();
  req.checkBody('username','User name is required').notEmpty();
  req.checkBody('email','Email is required').notEmpty();
  req.checkBody('email','Email is not valid').isEmail();
  req.checkBody('password','Password is required').notEmpty();
  req.checkBody('cpassword2','Confirm password is required').notEmpty();
  req.checkBody('cpassword2','Passwords should match').equals(req.body.password);

  var errors = req.validationErrors();
  if(errors){
  	res.render('user/signup', {errors: errors});
  }
  else{
	var uname = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	var cpassword = req.body.cpassword2;


	var newUser = new User({
		username: uname,
		email: email,
		password: password
	});

	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(newUser.password, salt, function(err, hash){
			if(err){
				console.log("user error");
			}
			newUser.password = hash;
			newUser.save(function(err){
				if(err){
					console.log("some error:u"+ uname + ", e:"+ email +", p:" + password);
					return;
				}
				else{
					req.flash('success','You can now sign in');
					res.redirect('/users/signin');
				}
			});
		});
	});
	}
});

router.get('/logout', isLoggedIn, function(req, res, next) {
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/signin');
});

module.exports = router;

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/users/signin');
}

function notLoggedIn(req, res, next){
	if(!req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}