function addImage() {
    alert("add new image!");
}

function activateItem(){
	console.log("hi");
	 jQuery(this).toggleClass('active');
	  
}
/*
$(document).ready(function() {
    $('#subForm').on('init.field.fv', function(e, data) {
            // data.fv      --> The FormValidation instance
            // data.field   --> The field name
            // data.element --> The field element

            var $icon      = data.element.data('fv.icon'),
                options    = data.fv.getOptions(),                      // Entire options
                validators = data.fv.getOptions(data.field).validators; // The field validators

            if (validators.notEmpty && options.icon && options.icon.required) {
                // The field uses notEmpty validator
                // Add required icon
                $icon.addClass(options.icon.required).show();
            }
        })
		.formValidation({
            framework: 'bootstrap',
            icon: {
                required: 'fa fa-asterisk',
                valid: 'fa fa-check',
                invalid: 'fa fa-times',
                validating: 'fa fa-refresh'
            }
            
        })
		.on('status.field.fv', function(e, data) {
            // Remove the required icon when the field updates its status
            var $icon      = data.element.data('fv.icon'),
                options    = data.fv.getOptions(),                      // Entire options
                validators = data.fv.getOptions(data.field).validators; // The field validators

            if (validators.notEmpty && options.icon && options.icon.required) {
                $icon.removeClass(options.icon.required).addClass('fa');
            }
        });
});

$(document).ready(function() {
    $('#subForm').formValidation({
        icon: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        }

    });
});*/
function validateForm() {
	//console.log("hi");
	return $('#subForm').validate({
		 errorElement: "div",
		 wrapper: 'div',
		 rules: {
           "name": {
                required: true,
            },
			"optradio":{
				 required: true,
			},
           "org_name": {
               required: true,
           //     minlength: 5
		   },
		   "date": {
			   required: true,
			   isDate: true,
		   },
		   "s_time": {
			   required: true,
			   isTime:true
		   },
		   "e_time": {
			   required: true,
			   isTime:true,
		   },
		   "location": {
			   required: true,
		   },
		   "sDescr": {
			   maxlength: 50,
		   },
		   "longDescr": {
			   required: true,
			   maxlength: 1000
		   }
         },
		 messages :{
			name : {
				required : 'Enter name'
			},
			longDescr: {
				required : 'Enter description shorter than 1000 chars'
			}
		 },
        errorPlacement: function(error, element) {
			 error.css({'padding':'10px'});
			if ( element.is(":radio") ) {
				error.appendTo( element.parents('.container') );
			}
			else { // This is the default behavior 
				error.appendTo(element.next('.error_label'));
			}
		}
		
	});
	
}

//add validator method for date
$.validator.addMethod(
    "isDate",
    function(value, element) {
		console.log("check date");
        var reg = /^(0[1-9]|1[012])([\/-])(0[1-9]|[12][0-9]|3[01])\2(\d{4})$/;
		return reg.test(value);   
    },
    "Please enter a valid date in the format dd/mm/yyyy."
);

//add validator method for time 
$.validator.addMethod(
    "isTime",
    function(value, element) {
		console.log("check time");
        var reg = /^(0?[1-9]|1[012])(:[0-5]\d)(a|p)m?$/i;
		console.log(reg.test(value))
		return reg.test(value);   
    },
    "Please enter a valid time in the format hh:mmAM/PM."
);

function submitForm() {
	if(validateForm()){
		var formData = $(subForm).serializeObject();
		   $.ajax({
           type: "POST",
           url: "http://tracked-server-dev.elasticbeanstalk.com/post_event",
           dataType: "jsonp",
           success: function (msg) {
                   alert("Post worked");
				  console.log("Post worked");
           },
		   error: function(request, status, error){
			   console.log("Post did not work");
				alert("Post did not work, "+status + error);
		   },
           data: formData
       });
		console.log(formData); 
	}
	
};
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
	console.log(o);
    return o;
};

google.maps.event.addDomListener(window, 'load', function () {
		//console.log("hi");
           
			var options = {
				componentRestrictions: {country: "us"}
			};
			 var places = new google.maps.places.Autocomplete(document.getElementById('location'),options);
            google.maps.event.addListener(places, 'place_changed', function () {
			//	console.log("in function");
                var place = places.getPlace();
				document.getElementById('lat').value = place.geometry.location.lat();
				document.getElementById('long').value = place.geometry.location.lng();
                var address = place.formatted_address;
                var latitude =place.geometry.location.lat();
                var longitude = place.geometry.location.lng();
                var mesg = "Address: " + address;
                mesg += "\nLatitude: " + latitude;
                mesg += "\nLongitude: " + longitude;
              //  alert(mesg);
				//console.log("message");
            });
});