var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var Cart = require('../models/cart');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Riddhi Fashion' });
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
});

router.get('/gown', function(req, res, next) {
	var products = Product.find({style: "gown"},function(err, docs){
		res.render('shops/shop',{ title: 'Riddhi Fashion', products: docs });
	});
});

router.get('/kurti', function(req, res, next) {
	var products = Product.find({style: "kurti"},function(err, docs){
		res.render('shops/shop',{ title: 'Riddhi Fashion', products: docs });
	});
});

router.get('/anarkali', function(req, res, next) {
	var products = Product.find({style: "anarkali"},function(err, docs){
		res.render('shops/shop',{ title: 'Riddhi Fashion', products: docs });
	});
});

router.get('/add-to-cart/:id', function(req, res, next) {
	var productId = req.params.id;
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	Product.findById(productId, function(err, product){
		if(err) {
			return res.redirect('/all');
		}
		cart.add(product, product.id);
		req.session.cart = cart;
		res.redirect('/'+product.style);
	});
});


router.get('/cart', function(req, res, next) {
	if (!req.session.cart) {
		return res.render('cart', {products: null});
	}
	var cart = new Cart(req.session.cart);
	res.render('cart',{products: cart.generateArray(), totalPrice: cart.totalPrice});
	
});

router.get('/checkout', function(req, res, next) {
	if (!req.session.cart){
		return res.render('cart')
	}
	var cart = new Cart(req.session.cart);
	res.render('shops/checkout', {total: cart.totalPrice});
});

module.exports = router;
