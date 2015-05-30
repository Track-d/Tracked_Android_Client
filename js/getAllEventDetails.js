		var myApp = angular.module('myApp', ["ui.router"])

		.config(function config($stateProvider, $urlRouterProvider) {
			 // send to listView
    		$urlRouterProvider.otherwise("/"); 

			$stateProvider.state("index", {
				url: "/",
				controller: "EventsCtrlAjax",
				templateUrl: "template-listView.html"
			})
		})
		.config(function config($stateProvider) {
			$stateProvider.state("oneEvent", {
				url: "/eventView",
				controller: "OneEvent",           
				templateUrl: "template-eventView.html"
			})
		})
		.service("OneEvt", function OneEvt() {
			var eventItem = this;
			eventItem.item = "Default"
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


		myApp.controller('MainControl', function ($scope, $http, OneEvt) {
	  		// alert("MainControl");
	  	});

		myApp.controller('EventsCtrlAjax', function ($scope, $http, OneEvt) {
	 		$scope.events = []
	 		//var JSON;
	 		alert("hi");
			$http.get('eventsUpdate.json').
		     	success(function(data, status, headers, config) {
		        for(item in data.events) {
			   		var temp = data.events[item];
			   		$scope.events.push(
			   			new evnt (
			   				temp.event_id,
				   			temp.event_name,
				   			Date.parse(temp.start_time),
				   			Date.parse(temp.end_time),
				   			temp.loc_info.location,
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
				   				OneEvt.item = $scope.events[i];
				   			}
			   			} catch (error) {
			   				alert(error);
			   			}
			   		}
			   	}

			   	// console.log($scope.events);
			   	$scope.$apply();
		 	});	   	
		 });

		myApp.controller('OneEvent', function ($scope, OneEvt) {
			// setting selected event
			$scope.item = OneEvt.item;	
		});

		// myApp.controller('EventsCtrlAjax', function ($scope, $http, OneEvt) {
		// 	$scope.events = []
		// 	$http.get('/events').
		//     success(function(data, status, headers, config) {
			   
		// 	   	// load event objects into $scope.events
		// 	   	for(item in data.events) {
		// 	   		var temp = data.events[item];
		// 	   		$scope.events.push(
		// 	   			new evnt (
		// 	   				temp.event_id,
		// 		   			temp.event_name,
		// 		   			Date.parse(temp.start_time),
		// 		   			Date.parse(temp.end_time),
		// 		   			temp.loc_info.name,
		// 		   			temp.loc_info.lat,
		// 		   			temp.loc_info.log,
		// 		   			temp.event_desc_short,
		// 		   			temp.event_desc_long
		// 	   			)
		//    			);			   		
		// 	   	}
		// 	   	var chosen = this;
		// 	   	$scope.getOneEvent = function(id){
		// 	   		for(var i = 0; i < $scope.events.length; i++) {
		// 	   			try {
		// 		   			if ($scope.events[i].e_id == id) {
		// 		   				OneEvt.item = $scope.events[i];
		// 		   			}
		// 	   			} catch (error) {
		// 	   				alert(error);
		// 	   			}
		// 	   		}
		// 	   	}

		// 	   	// console.log($scope.events);
		// 	   	$scope.$apply();
		// //     }).
		//     error(function(data, status, headers, config) {
	   
	 //    	});
		// });

