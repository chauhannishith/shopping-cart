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

router.get('/signup', function(req, res, next) {
  res.render('user/signup');
});

router.get('/signin', function(req, res, next) {
  res.render('user/signin');
});

router.post('/signin', function(req, res, next) {
  req.checkBody('username','Email is required').notEmpty();
  req.checkBody('password','Password is required').notEmpty();

  var errors = req.validationErrors();
  if(errors){
  	res.render('user/signin', {errors: errors});
  }
  else{
  	passport.authenticate('local', {
  		successRedirect:'/all',
  		failureRedirect:'/users/signin',
  		failureFlash: true
  	})(req, res, next);
  }
});

router.get('/myprofile', function(req, res, next) {
  var user = req.user;
  res.render('user/myprofile',{user: user});
});

router.post('/signup', function(req, res){
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

router.get('/logout', function(req, res, next) {
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/signin');
});

module.exports = router;
