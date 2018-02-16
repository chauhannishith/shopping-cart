module.exports = function Cart(oldCart) {
	this.items = oldCart.items || {};
	this.totalQty = oldCart.totalQty || 0;
	this.totalPrice = oldCart.totalPrice || 0;

	this.add = function(item, id){
		var storedItem = this.items[id];
		if(!storedItem) {
			storedItem = this.items[id] = {item: item, qty: 0, price:0};
		}
		storedItem.qty++;
		storedItem.price = storedItem.item.price * storedItem.qty;
		this.totalQty++;
		this.totalPrice += storedItem.item.price;
	};

	this.delete = function(item, id){
		var storedItem = this.items[id];
		var count = 0;
		if(storedItem) {
//			storedItem = this.items[id] = {item: item, qty: 0, price:0};
//			storedItem.qty++;
			storedItem.price = storedItem.item.price * storedItem.qty;
			this.totalQty -= storedItem.qty;
			this.totalPrice -= storedItem.price;
			storedItem.qty = 0;
			delete this.items[id];
		}
//TRy to improve this
		for(var i in this.items){
			count++;
		}
		if (count < 1){
//			console.log("4");
			return null;
		}
	};

	this.reduceByone = function(id){
		this.items[id].qty--;
		this.items[id].price -= this.items[id].item.price;
		this.totalQty--;
		this.totalPrice -= this.items[id].item.price;
		if(this.items[id].qty == 0){
			delete this.items[id];
		}
		var count = 0;
		for(var i in this.items){
			count++;
		}
		if (count < 1){
//			console.log("4");
			return null;
		}
	};

	this.increaseByone = function(id){
		this.items[id].qty++;
		this.items[id].price += this.items[id].item.price;
		this.totalQty++;
		this.totalPrice += this.items[id].item.price;

	};

	this.generateArray = function() {
		var arr = [];
		for(var id in this.items) {
			arr.push(this.items[id]);
		}
		return arr;
	};
};