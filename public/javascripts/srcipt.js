function transfer(){
	window.open("/users/signup","_self");
}

function transferSeller(){
	window.open("/seller/signup","_self");
}

function add(id){

	var url = "/add-to-cart/"+ id;
	window.open(url,"_self");
}