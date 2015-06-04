		var myApp = angular.module('myApp', ["ui.router"])
		.config(function config($stateProvider, $urlRouterProvider) {
			 // send to index
    		$urlRouterProvider.otherwise("/"); 

			$stateProvider
				.state("index", {
					url: "/",
					controller: "EventsCtrlAjax",
					templateUrl: "template-listView.html"
				})
				// .state("oneEvent", {
				// 	url: "event/{eventId}",
				// 	controller: "OneEvent",
				// 	//deepStateRedirect: true,
	   //  			// sticky: true,           
				// 	templateUrl: "template-eventView.html"
				// })
		})
		.config(function config($stateProvider, $urlRouterProvider) {
			 // send to index
    		$urlRouterProvider.otherwise("/"); 
			$stateProvider.state("oneEvent", {
				url: "/event/{eventId}",
				controller: "OneEvent",
				// deepStateRedirect: true,
    			// sticky: true,           
				templateUrl: "template-eventView.html"
			})
		})
		.config(function config($stateProvider) {
			$stateProvider.state("oneEventMap", {
				url: "/eventView",
				controller: "OneEvent",           
				templateUrl: "template-eventView.html"
			})
		});
		myApp.factory("Evts", function Evts($http) {
			return {
				getData: function () {
					console.log("in getdata");

			 		//var JSON;
			 		// var promise = $http({method: 'GET', url: 'eventsUpdate.json'})
			 		var promise = $http({method: 'GET', url: 'https://trackd.info/events'})
				    	.success(function(data, status, headers, config) {
				     		return data;
					   	
					   	})
						.error(function (data, status, headers, config) {
      						return {"status": false};
    					});
    				return promise;
				}
		    }
		});

		// Model for all event objects
	  	function evnt(id, name, sTime, eTime, loc_name, lat, longi, shortD, longD, orgName, pic) {
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
	  		this.img = pic;
	  	}


		myApp.controller('MainControl', function ($scope, $http, Evts) {
	  		// alert("MainControl");
	  	});

	  	function processEventInfo(events) {
	  		var eventsInfo = [];
	  		var eventIcons = ["img/recreation.png", "img/place.png", "img/rso.png", 
								"img/sport.png", "img/general.png", "img/building.png", 
								"img/campus.png", "img/ducks.png", "img/study.png",
								"img/location.png"];
		        	for(item in events) {
			   			var temp = events[item];
						var now = new Date();
				   		var start = new Date(new Date(temp.start_time).getTime() + (now.getTimezoneOffset()* 60000));
						var now = new Date();
				   		var end = new Date(new Date(temp.end_time).getTime() + (now.getTimezoneOffset()* 60000));

		  				//alert("S: " + start + " E: " + end);
				   		eventsInfo.push(
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
					   			temp.org_name,
					   			eventIcons[(((temp.event_id * 7235733333333333)) % eventIcons.length)]
				   			)
			   			);			   		
			   		}
			   		return eventsInfo;			
	  	}

		myApp.controller('EventsCtrlAjax', function ($scope, $http, Evts, $state) {
				console.log("1");
				console.log(Evts.getData());
				Evts.getData().then(function(promise) {
		     		$scope.events = processEventInfo(promise.data.events);
		     		
    				$scope.item = $scope.events;
    				function chunk(arr, size) {
						var newArr = [];
						for (var i=0; i<arr.length; i+=size) {
							newArr.push(arr.slice(i, i+size));
						}
						return newArr;
					}
    				$scope.chunkedData = chunk($scope.events, 4);
  				});		   	 
		});
		
		myApp.controller('OneEvent', function ($scope, Evts, $stateParams, $state) {

	 		$scope.item;
	   		var id;
	   		console.log($state.params);
	   		id = $stateParams.eventId;
	   		Evts.getData().then(function(promise) {
	   			
	   			var events = processEventInfo(promise.data.events);;
	   			
		   		//alert("Getting 1 event id: " + id);
		   		for(var i = 0; i < events.length; i++) {
		   			try {
			   			if (events[i].e_id == id) {
			   				$scope.item = events[i];
			   			}
		   			} catch (error) {
		   				alert(error);
		   			}
		   		}
	   		});

	   		//expect($stateParams).toBe({contactId: id});
	   		

			   	
			// setting selected event
			//$scope.item = OneEvt.item;
			//expect($stateParams).toBe({eventId: $scope.item.e_id});	

			//$state.href('oneEvent', $state.params, {absolute: true});
			console.log($stateParams.eventId);
		});

//************************************************* MAP VIEW *****************************************************************************************************
		myApp.controller('OneEventMap', function ($scope, Evts) {

			$scope.getOneEvent = function(id){
		   		alert("Getting 1 event");
		   		for(var i = 0; i < $scope.events.length; i++) {
		   			try {
			   			if ($scope.events[i].e_id == id) {
			   				Evts.item = $scope.events[i];
			   			}
		   			} catch (error) {
		   				alert(error);
		   			}
		   		}
		   	}
			// setting selected event
			var map = map || {};
			//gov.usgs = gov.usgs || {};
			var markersArray = [];
			var markerCluster=[];
			var timeStartDefault= 8;
			var timeEndDefault =20;
			var events;
			var initialLocation;
			var uw = new google.maps.LatLng(47.6561432, -122.3062688);

			function initialize() {
			  $("#nav_bar").load("nav.html"); 
			  var mapOptions = {
				scaleControl:true,
			    zoom: 16
			  };
			  map = new google.maps.Map($('.map-container')[0],
			      mapOptions);

			  // Try HTML5 geolocation
			 // if(navigator.geolocation) {
			  //  navigator.geolocation.getCurrentPosition(function(position) {
			  //    var pos = new google.maps.LatLng(position.coords.latitude,
			  //                                     position.coords.longitude);

			      map.setCenter(uw);
			  //  }, function() {
			  //    handleNoGeolocation(true);
			  //  });
			//  } else {
			    // Browser doesn't support Geolocation
			  //  handleNoGeolocation(false);
			 // }
			}

			function handleNoGeolocation(errorFlag) {
			  if (errorFlag) {
			    var content = 'You denied geolocation!';
			  } else {
			    var content = 'Error: Your browser doesn\'t support geolocation.';
			  }

			  var options = {
			    map: map,
			    scaleControl:true,
			    zoom: 15,
			    content: content
			  };

			  var infowindow = new google.maps.InfoWindow(options);
				map.setCenter(uw);
			}
			  google.maps.event.addDomListener(window, 'load', initialize);
			  google.maps.event.addDomListener(window, "resize", function() {
				var center = map.getCenter();
				google.maps.event.trigger(map, "resize");
				map.setCenter(center); 
			});

			//url for events json
			 var eventsUrl = 'https://trackd.info/events';
			//var eventsUrl = 'eventsUpdate.json';

			//current events dataset
			var displayEvents; 

			//AJAX Error event handler
			//just alerts the user of the error
			$(document).ajaxError(function(event, jqXHR, err){
			   // alert('Problem obtaining data: ' + jqXHR.statusText);
			})

			window.onload = function getEvents() {
			console.log("try to get events"); 
				 $.ajax({
						type: 'GET',
						url: eventsUrl,
						cache: false,
			            crossDomain: true,
						async:false,
						headers: {          
			             Accept : "application/json; charset=utf-8",         
			           
						}, 
						success: function (data) {
								console.log("success getting data");
								console.log(data);
								console.log(data.events.length);
								console.log(data.events); 
								//var obj = jQuery.parseJSON(events); // convert the received response to a JSON object
								//var obj = JSON.stringify(events); 
								events = data.events; 
								parseEvents(data.events);
								
						},
						//jsonpCallback: "parseEvents",
			           // success: function(events){
							//$('.message').html('Loading... <img src="img/loading.gif">');
						//	displayEvents = events;
						//	$('.message').html('Displaying ' + events.length + ' events'); 
						//	addEventMarkers(events,map);
						//	}, 
			            error: function (xhr, status, error) {
			              console.log("error");
			            }
			        });	
			}

			function parseEvents(events){
					
					//if (events.Success) {
						//alert(eventsObj.events.event_name);
						
						//displayEvents = jsonObj;
				$('.message').html('Displaying ' +events.length + ' events'); 
				addEventMarkers(events,map,timeStartDefault,timeEndDefault);
					//} else {
					//	console.log("damnit");
					//	alert(events.details);
					//}
			            
							
			}


			function addEventMarkers(events, map, startTime,endTime) {
				markersArray =[];
				var event; //current event data
				var idx;	//loop counter
				var infoWindow; //InfoWindow for Event
				var eventStart;
				var eventEnd;
				var start;
				var end;
				var start_utc;
				var end_utc;
				var now; 
				for(idx = 0; idx < events.length; ++idx) {
					e = events[idx];
				    now = new Date();
					start_utc = new Date(e.start_time);
					end_utc = new Date(e.end_time);
					start = new Date(start_utc.getTime() + (now.getTimezoneOffset()* 60000));
					end = new Date (end_utc.getTime() + (now.getTimezoneOffset()* 60000));
					console.log("Date : " + start)	; 
					sTime = start.getHours();
					eTime = end.getHours();
					console.log("Original: " +new Date(e.start_time));
					//console.log("S time : " + sTime);
				var myIcon = new google.maps.MarkerImage("img/marker30-01.png", null, null, null, new google.maps.Size(22,31));
					if(e.loc_info){
						if(sTime >= startTime && eTime <= endTime){
							
							e.mapMarker = new google.maps.Marker({
							map: map,
							icon: myIcon,
							position: new google.maps.LatLng(e.loc_info.lat, e.loc_info.long)
							
					
							});

							var eventView = "/#/event/" + e.event_id;

							infoWindow = new google.maps.InfoWindow({
							content: '<a href="' + eventView + '">' +
								 e.event_name +'</a></br><div id="shortDescr">'+
								 e.event_desc_short +'</div>'

							// content: '<a class="marker" id=' + e.event_id + '>' +
							// 	 e.event_name +'</a></br><div id="shortDescr">'+
							// 	 e.event_desc_short +'</div>'
							});
							registerInfoWindow(map, e.mapMarker, infoWindow);
							markersArray.push(e.mapMarker);
							$scope.$apply(function(){
							    // perform any model changes or method invocations here on angular app.
							    var markers = document.getElementsByClassName("marker");
								for(var j = 0; j < markers.length; j++) {
									alert(markers[j]);
								}
								$scope.item = Evts.item;	
							});
						}
						
					}
					
				}
				
				mcOptions = {styles: [{
					height: 53,
					url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m1.png",
					width: 53
					},
					{
					height: 56,
					url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m2.png",
					width: 56
					},
					{
					height: 66,
					url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m3.png",
					width: 66
					},
					{
					height: 78,
					url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m4.png",
					width: 78
					},
					{
					height: 90,
					url: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/images/m5.png",
					width: 90
					}]}
				 markerCluster = new MarkerClusterer(map, markersArray,mcOptions);
			}

			function clearAllMarkers(){
				for (var i = 0; i < markersArray.length; i++ ) {
			    markersArray[i].setMap(null);
				}
				markersArray.length = 0;
				markerCluster.resetViewport();
			}
			function registerInfoWindow(map, marker, infoWindow) {
				var iw = infoWindow; 
				
				//google.maps.event.addListener(marker, 'mouseover', function() {
				// if(iw){
				//	 iw.close; 
				//	}
				//	iw = infoWindow;
				//	infoWindow.open(map, marker);
					
				//});

				//google.maps.event.addListener(marker, 'mouseout', function() {
			    //console.log("hello")
			    //iw.close();
				//});
				 
				 google.maps.event.addListener(marker, 'click', function(){
					if(iw){
					 iw.close; 
					}
					iw = infoWindow;
					infoWindow.open(map, marker);
				});
				
				
			}

			 
			 // With JQuery
			 console.log($);
				var time = ["12AM","6AM","10AM","2PM","6PM","10PM"];
				var startTime;
				var endTime;
			   $(function() {
					$("#slider").noUiSlider({
						handles: 2,
						   connect: true,
						   start:[480,1200],
						   step:5,
						   range: {
							'min': 0,
							'max': 1439
							}
					}).on('slide', function(evt,val){
						//$( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );	
						var val0 =val[ 0 ];
						var	val1 =val[ 1 ]; 
						var	minutes0 = parseInt(val0 % 60, 10);			
						var	hours0 = parseInt(val0 / 60 % 24, 10);
						var	minutes1 = parseInt(val1 % 60, 10);
						var	hours1 = parseInt(val1 / 60 % 24, 10);
						startTime = getTime(hours0, minutes0);
						endTime = getTime(hours1, minutes1);
						//console.log(startTime);
						//console.log(endTime);
						$("#time").text(startTime + ' - ' + endTime);
						clearAllMarkers();
						addEventMarkers(events, map, hours0,hours1);
					});
				});
				
				function getTime(hours, minutes) {
			    var time = null;
			    var minutes = minutes + "";
				
				if (hours < 12) {
					time = "AM";
				} else { 
					time = "PM";
				}
			    if (hours == 0) {
					hours = 12;
				}
			    if (hours > 12) {
					hours = hours - 12; 
				}
			    if (minutes.length == 1) {
					minutes = "0" + minutes;
				}
				console.log(hours + ":" + minutes + " " + time);
			    return (hours + ":" + minutes + " " + time);
				}
});
