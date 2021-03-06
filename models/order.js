var mongoose = require('mongoose');
var DataSchema = mongoose.Schema;

var datascheme = new DataSchema({
	user: {type: DataSchema.Types.ObjectId, ref: 'User'},
	date: {type: Date, default: Date.now },
	cart: {type: Object, required: true},
	address: {type: String, required: true},
	name: {type: String, required: true},
	paymentId: {type: String, required: true},
	status: {type: String, default: 'processing'}
});


module.exports = mongoose.model('Order',datascheme);