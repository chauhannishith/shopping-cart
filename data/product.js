var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scheme = new Schema({
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

module.exports = mongoose.model('Product',scheme);