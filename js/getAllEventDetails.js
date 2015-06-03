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
		.config(function config($stateProvider) {
			$stateProvider.state("oneEventMap", {
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
	  	function evnt(id, name, sTime, eTime, loc_name, lat, longi, shortD, longD, orgName) {
	  		this.e_id = id;
	  		this.e_name = name;
	  		this.e_sTime = sTime;
	  		this.e_eTime = eTime;
	  		this.e_loc_name = loc_name;
	  		this.e_lat = lat;
	  		this.e_log = longi;
	  		this.e_shortD = shortD;
	  		this.e_longD = longD;
	  		this.org = orgName;
	  	}

		myApp.controller('MainControl', function ($scope, $http, OneEvt) {
	  		// alert("MainControl");
	  	});

		myApp.controller('EventsCtrlAjax', function ($scope, $http, OneEvt) {
	 		$scope.events = []
	 		//var JSON;
	 		//$http.get('eventsUpdate.json').
			$http.get('https://trackd.info/events').
		     	success(function(data, status, headers, config) {
		        for(item in data.events) {
			   		var temp = data.events[item];
					var now = new Date();
			   		var start = new Date(new Date(temp.start_time).getTime() + (now.getTimezoneOffset()* 60000));
					var now = new Date();
			   		var end = new Date(new Date(temp.end_time).getTime() + (now.getTimezoneOffset()* 60000));

	  				//alert("S: " + start + " E: " + end);
			   		$scope.events.push(
			   			new evnt (
			   				temp.event_id,
				   			temp.event_name,
				   			Date.parse(start),
				   			Date.parse(end),
				   			temp.loc_info.location,
				   			temp.loc_info.lat,
				   			temp.loc_info.log,
				   			temp.event_desc_short,
				   			temp.event_desc_long,
				   			temp.org_name
			   			)
		   			);			   		
			   	}

			   	function chunk(arr, size) {
				  var newArr = [];
				  for (var i=0; i<arr.length; i+=size) {
				    newArr.push(arr.slice(i, i+size));
				  }
				  return newArr;
				}

				$scope.chunkedData = chunk($scope.events, 4);

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
			   	
		 	});	  
		 });


		myApp.controller('OneEvent', function ($scope, OneEvt) {
			// setting selected event
			$scope.item = OneEvt.item;	
		});


		myApp.controller('OneEventMap', function ($scope, OneEvt) {
			// setting selected event
			$scope.item = OneEvt.item;	
			alert($scope.item);
		});


	

