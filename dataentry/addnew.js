<<<<<<< HEAD
var Product = require('../data/product');
var mongoose = require('mongoose');

mongoose.connect('localhost:27017/shopping');

var products = [
		new Product({
			image: 'images/1.jpg',
			title: "kurti first",
			style:"kurti",
			description: "something",
			price: 10
		}),
		new Product({
			image: 'images/2.jpg',
			title: "kurti second",
			style:"kurti",
			description: "again something",
			price: 20
		}),
		new Product({
			image: 'images/3.jpg',
			title: "gown third",
			style:"gown",
			description: "try something",
			price: 12
		}),
		new Product({
			image: 'images/4.jpg',
			title: "anarkali fourth",
			style:"anarkali",
			description: "do something",
			price: 10
		}),
			new Product({
			image: 'images/5.jpg',
			title: "gown fifth",
			style:"gown",
			description: "come on dude",
			price: 10
		}),
		new Product({
			image: 'images/1.jpg',
			title: "anarkali first",
			style:"anarkali",
			description: "something",
			price: 10
		}),
		new Product({
			image: 'images/2.jpg',
			title: "anarkali second",
			style:"anarkali",
			description: "again something",
			price: 20
		}),
		new Product({
			image: 'images/3.jpg',
			title: "kurti third",
			style:"kurti",
			description: "try something",
			price: 12
		}),
		new Product({
			image: 'images/4.jpg',
			title: "gown fourth",
			style:"gown",
			description: "do something",
			price: 10
		}),
			new Product({
			image: 'images/5.jpg',
			title: "gown fifth",
			style:"gown",
			description: "come on dude",
			price: 10
		}),
];

var count = 0;
for( var i = 0; i < products.length; i++){
		products[i].save(function(err,result){
			count++;
			if(count == products.length)
				exit();
		});	
}

function exit(){
	mongoose.disconnect();
}
=======
var Product = require('../data/product');
var mongoose = require('mongoose');

mongoose.connect('localhost:27017/shopping');

var products = [
		new Product({
			image: 'images/1.jpg',
			title: "kurti first",
			style:"kurti",
			description: "something",
			price: 10
		}),
		new Product({
			image: 'images/2.jpg',
			title: "kurti second",
			style:"kurti",
			description: "again something",
			price: 20
		}),
		new Product({
			image: 'images/3.jpg',
			title: "gown third",
			style:"gown",
			description: "try something",
			price: 12
		}),
		new Product({
			image: 'images/4.jpg',
			title: "anarkali fourth",
			style:"anarkali",
			description: "do something",
			price: 10
		}),
			new Product({
			image: 'images/5.jpg',
			title: "gown fifth",
			style:"gown",
			description: "come on dude",
			price: 10
		}),
		new Product({
			image: 'images/1.jpg',
			title: "anarkali first",
			style:"anarkali",
			description: "something",
			price: 10
		}),
		new Product({
			image: 'images/2.jpg',
			title: "anarkali second",
			style:"anarkali",
			description: "again something",
			price: 20
		}),
		new Product({
			image: 'images/3.jpg',
			title: "kurti third",
			style:"kurti",
			description: "try something",
			price: 12
		}),
		new Product({
			image: 'images/4.jpg',
			title: "gown fourth",
			style:"gown",
			description: "do something",
			price: 10
		}),
			new Product({
			image: 'images/5.jpg',
			title: "gown fifth",
			style:"gown",
			description: "come on dude",
			price: 10
		}),
];

var count = 0;
for( var i = 0; i < products.length; i++){
		products[i].save(function(err,result){
			count++;
			if(count == products.length)
				exit();
		});	
}

function exit(){
	mongoose.disconnect();
}
>>>>>>> Initial commit
