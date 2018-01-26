var mongoose = require('mongoose');
var DataSchema = mongoose.Schema;

var datascheme = new DataSchema({
	image: {
		type: String,
		required: true
	},
	title: {
		type: String,
		required: true
	},
	style: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	}
});

module.exports = mongoose.model('Product',datascheme);