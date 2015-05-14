function addImage() {
    alert("add new image!");
}

function activateItem(){
	console.log("hi");
	 jQuery(this).toggleClass('active');
	  
}

function submitForm() {
	alert("submit:http://tracked-server-dev.elasticbeanstalk.com/post_event");
	var formData = JSON.stringify(jQuery('#form-inline').serializeArray()); // store json string
	console.log(formData); 
}
