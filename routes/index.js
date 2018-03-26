var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');
var Order = require('../models/order');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Riddhi Fashion' });
});


router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Riddhi Fashion' });
});

router.get('/faq', function(req, res, next) {
  res.render('faq', { title: 'Riddhi Fashion' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Riddhi Fashion' });
});

router.get('/all', function(req, res, next) {
	var products = Product.find(function(err, docs){
		res.render('shops/shop',{ title: 'Riddhi Fashion', products: docs });
	});
	req.session.oldUrl = req.url;
});

router.get('/gown', function(req, res, next) {
	var products = Product.find({style: "gown"},function(err, docs){
		res.render('shops/shop',{ title: 'Riddhi Fashion', products: docs });
	});
	req.session.oldUrl = req.url;
});

router.get('/kurti', function(req, res, next) {
	var products = Product.find({style: "kurti"},function(err, docs){
		res.render('shops/shop',{ title: 'Riddhi Fashion', products: docs });
	});
	req.session.oldUrl = req.url;
});

router.get('/anarkali', function(req, res, next) {
	var products = Product.find({style: "anarkali"},function(err, docs){
		res.render('shops/shop',{ title: 'Riddhi Fashion', products: docs });
	});
	req.session.oldUrl = req.url;
});

router.get('/product-detail/:id', function(req, res, next) {
	var productId = req.params.id;
	Product.findById(productId, function(err, data){
		if(err) {
			return res.redirect('/all');
		}
		res.render('shops/productdisplay', {product: data});
	});
});

router.get('/add-to-cart/:id', function(req, res, next) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	Product.findById(productId, function(err, product){
		if(err) {
			req.flash('danger', 'Some error occured,Sorry :(');
			return res.redirect('/all');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		req.flash('success', 'Product added successfully');
		res.redirect(req.session.oldUrl);
		req.session.oldUrl = null;
//		res.redirect('/'+product.style);
	});
});


router.get('/cart', function(req, res, next) {
	if (!req.session.cart) {
		return res.render('cart', {products: null});
	}
	var cart = new Cart(req.session.cart);
	res.render('cart',{products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/delete/:id', function(req, res, next){
	var productId = req.params.id;
	if (!req.session.cart) {
		console.log("5");
		return res.render('cart', {products: null});
	}
//	var cart = new Cart(req.session.cart ? req.session.cart : {});
	var cart = new Cart(req.session.cart);
	Product.findById(productId, function(err, product){
		if(err) {
//			console.log("1");
			req.flash('danger', 'Some error occured,Sorry :(');
			return res.redirect('/all');
		}
//		cart.delete(product, product.id);
//		req.flash('success', 'Product removed successfully');
		if (cart.delete(product, product.id) !== null) {
//			console.log("2");
			req.flash('success', 'Product removed successfully');
			req.session.cart = cart;
			return res.render('cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
		}
		else{
//			console.log("6");
			req.session.cart = null;
			return res.render('cart', {products: null});
		} 
	});
});


router.get('/reduce/:id', function(req, res, next) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	if(cart.reduceByone(productId) !== null ){
		req.session.cart = cart;
		res.render('cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
	}
	else{
		req.session.cart = null;
		res.render('cart', {products: null});

	}
});

router.get('/increase/:id', function(req, res, next) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});
	cart.increaseByone(productId);
	req.session.cart = cart;
	res.render('cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', isLoggedIn, function(req, res, next) {
	if (!req.session.cart){
		return res.render('cart');
	}
	var cart = new Cart(req.session.cart);

	res.render('shops/checkout', {total: cart.totalPrice});
});

/*PAYMENTS HERE as it requires post method*/
router.post('/checkout', isLoggedIn, function(req, res, next) {
	var cart = new Cart(req.session.cart);	
	var order = new Order({
		user: req.user,
		cart: cart,
		address: req.body.addone,
		name: req.body.name,
		paymentId: 123 //will be given by merchant
	});
	order.save(function(err, result){
		if(err){
			res.redirect('/',{errors: err});
		}
		req.flash('success', 'Order placed successfully');
		req.session.cart = null;
		res.redirect('cart');
	});
});


module.exports = router;

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.session.oldUrl = req.url;
	res.redirect('users/signin');
}
