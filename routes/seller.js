var express = require('express');
var router = express.Router();

var User = require('../models/sellerdata');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var Cart = require('../models/cart');
var Order = require('../models/order');

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
  res.render('seller/signup');
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
  	res.render('seller/signup', {errors: errors});
  }
  else{
	var uname = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	var cpassword = req.body.cpassword2;


	var newSeller = new User({
		username: uname,
		email: email,
		password: password
	});

	bcrypt.genSalt(10, function(err, salt){
		bcrypt.hash(newSeller.password, salt, function(err, hash){
			if(err){
				console.log("user error");
			}
			newSeller.password = hash;
			newSeller.save(function(err){
				if(err){
					console.log("some error:u"+ uname + ", e:"+ email +", p:" + password);
					return;
				}
				else{
					req.flash('success','You can now sign in');
					res.render('/seller/signin');
				}
			});
		});
	});
	}
});

router.get('/signin', notLoggedIn, function(req, res, next) {
  res.render('seller/signin');
});

router.post('/signin', passport.authenticate('local', {
	failureRedirect: '/seller/signin',
	failureFlash: true
}), function (req, res, next) {
	var seller = req.user;
		res.render('seller/myprofile', {user: seller});

});

router.get('/myprofile', isLoggedIn, function(req, res, next) {
  var user = req.user;
  if(user)
  	res.render('seller/myprofile', {user: user});
  else
  	res.render('seller/signin');
  console.log("error 3");
});

router.get('/myorders'/*, isLoggedIn*/, function(req, res, next) {
	Order.find({paymentId: "123"}, function(err, orders){
		if (err){
			return res.write("fetch failed");
		}
		var cart;
		orders.forEach(function(order){

			cart = new Cart(order.cart);
			order.items = cart.generateArray();
		});
		res.render('seller/myorders', {orders: orders});		
	});
  
});

router.get('/logout', function(req, res, next) {
  req.logout();
  req.flash('success', 'You are logged out');
  res.render('/all');
});

module.exports = router;
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/seller/signin');
}

function notLoggedIn(req, res, next){
	if(!req.isAuthenticated()){
		return next();
	}
	res.redirect('/');
}