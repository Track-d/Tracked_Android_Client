		var myApp = angular.module('myApp', []);
		myApp.controller('MainControl', function ($scope, $http) {
	     // any code here

	  	});

		// Model for all event objects
	  	function evnt(id, name, sTime, eTime, loc_name, lat, longi, shortD, longD) {
	  		this.e_id = id;
	  		this.e_name = name;
	  		this.e_sTime = sTime;
	  		this.e_eTime = eTime;
	  		this.e_loc_name = loc_name;
	  		this.e_lat = lat;
	  		this.e_log = longi;
	  		this.e_shortD = shortD;
	  		this.e_longD = longD;
	  	}

	  	$scope.events = []

		myApp.controller('EventsCtrlAjax', function ($scope, $http) {
			$http.get('https://tracked-server-dev.elasticbeanstalk.com/events').
		    success(function(data, status, headers, config) {
			   
			   	// load event objects into $scope.events
			   	for(item in data.events) {
			   		var temp = data.events[item];
			   		$scope.events.push(
			   			new evnt (
			   				temp.id,
				   			temp.event_name,
				   			Date.parse(temp.start_time),
				   			Date.parse(temp.end_time),
				   			temp.loc_info.name,
				   			temp.loc_info.lat,
				   			temp.loc_info.log,
				   			temp.event_desc_short,
				   			temp.event_desc_long
			   			)
		   			);			   		
			   	}

			   	$scope.getOneEvent = function(id){
			   		for(item in $scope.events) {
			   			$scope.item = null;
			   			if (item.e_id == id) {
			   				alert("id: " + id + " " + item);
			   				return item;
			   			}
			   		}
			   	}
		    }).
		    error(function(data, status, headers, config) {
	   
	    	});
		});


		myApp.controller('OneEvent', function ($scope, $http) {

		});
