		var myApp = angular.module('myApp', []);
		// myApp.factory('Data', function(){
		// 	var savedData = null;
		// 	function set(data) {
		// 		savedData = data;
		// 	}

		// 	function get() {
		// 			return savedData;
		// 	}

		// 	return {
		// 		set: set,
		// 		get: get
		// 	}
		// });

		myApp.factory('Data', function () {

		    var data = "hi";

		    return {
		        get: function () {
		            return data;
		        },
		        set: function (evt) {
		            this.data = evt;
		        }
		    };
		});

		myApp.controller('MainControl', function ($scope, $http, Data) {
	  		$scope.events = []
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


		myApp.controller('EventsCtrlAjax', function ($scope, $http, Data) {
			$http.get('http://tracked-server-dev.elasticbeanstalk.com/events').
		    success(function(data, status, headers, config) {
			   
			   	// load event objects into $scope.events
			   	for(item in data.events) {
			   		var temp = data.events[item];
			   		$scope.events.push(
			   			new evnt (
			   				temp.event_id,
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
			   		for(var i = 0; i < $scope.events.length; i++) {
			   			try {
				   			if ($scope.events[i].e_id == id) {
				   				Data.set($scope.events[i].e_name);
				   				$scope.item = $scope.events[i].e_name;
				   				alert("listView: " + Data.data);
				   			}
			   			} catch (error) {
			   				alert(error);
			   			}
			   		}
			   	}
		    }).
		    error(function(data, status, headers, config) {
	   
	    	});
		});


		myApp.controller('OneEvent', function ($scope, Data) {
			$scope.item = $scope.events[0].e_name;
			alert("eventView: " + $scope.item);
		});

