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
           "event_name": {
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
		   "event_desc_short": {
			   maxlength: 50,
		   },
		   "event_desc_long": {
			   required: true,
			   maxlength: 1000
		   }
         },
		 messages :{
			event_name : {
				required : 'Enter name'
			},
			event_desc_long: {
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
        var reg = /^(0?[1-9]|1[012])(:[0-5]\d)\s(a|p)m?$/i;
		console.log(reg.test(value))
		return reg.test(value);   
    },
    "Please enter a valid time in the format hh:mm AM/PM."
);

function submitForm() {
	if(validateForm()){
		var postUrl= "https://trackd.info/post_event";
		if(document.getElementById('place').checked){
			postUrl ="https://trackd.info/post_place"
			alert("new post url " + postUrl)
		}
		var d =  document.getElementById("date").value.replace(/\//g, "-") + " " + document.getElementById("s_time").value;
		console.log(d);
		var s = new Date(d);
		var e = new Date(document.getElementById("date").value.replace(/\//g, "-") + " " + document.getElementById("e_time").value);
		
		s.setHours(s.getHours() - s.getTimezoneOffset() / 60);
        e.setHours(e.getHours() - e.getTimezoneOffset() / 60);

		document.getElementById('start_time').value = s.toJSON(); 
		document.getElementById('end_time').value = e.toJSON(); 
		
		var formData = $(subForm).serializeObject();
		var obj = JSON.stringify(formData);
		console.log(obj);
		   $.ajax({
			url: postUrl,
           type: "POST",
		   contentType: "application/json; charset=utf-8",
		   data: obj,
		   async: false,		   
           cache: false, //This will force requested pages not to be cached by the browser
		   crossDomain:true,
           success: function (msg) {
                  //alert("Post worked"+ msg);
				  //console.log("Post worked");
				  window.location = "http://localhost:9006/TrackdClient/createNew.html";
				
           },
		   error: function(request, status, error){
			   console.log("Post did not work" +error);
				//alert("Post did not work, "+ request +status + error);
				
		   },
           
       });
	    self.location = "http://localhost:9006/TrackdClient/createNew.html";
		//window.location = "http://localhost:9006/TrackdClient/createNew.html";
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
function selectEvent(){
	$("#date").show();
	$("#fbLink").show();
	$("#org_name").show();
	$("#s_time").show();
	$("#e_time").show();
	$("#event_desc_short").show();
	$( "#date" ).prop( "disabled", false );
	$( "#fbLink" ).prop( "disabled", false );
	$( "#org_name" ).prop( "disabled", false );
	$( "#s_time" ).prop( "disabled", false );
	$( "#e_time" ).prop( "disabled", false );
	$( "#event_desc_short" ).prop( "disabled", false );
};
function selectPlace(){
    $("#date").hide();
	$( "#date" ).prop( "disabled", true );
	$("#fbLink").hide();
	$( "#fbLink" ).prop( "disabled", true );
	$("#org_name").hide();
	$( "#org_name" ).prop( "disabled", true );
	$("#s_time").hide();
	$( "#s_time" ).prop( "disabled", true );
	$("#e_time").hide();
	$( "#e_time" ).prop( "disabled", true );
	$("#event_desc_short").hide();
	$( "#event_desc_short" ).prop( "disabled", true );
	
};
//$(function() {
//    $( "#date" ).datepicker();
//  });
google.maps.event.addDomListener(window, 'load', function () {
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