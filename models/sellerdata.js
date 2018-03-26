var mongoose = require('mongoose');
var SellerSchema = mongoose.Schema({
	username:{
		type: String,
		required: true
	},
	email:{
		type: String,
		required: true
	},
	password:{
		type: String,
		required: true
	}
});

module.exports = mongoose.model('Seller',SellerSchema);