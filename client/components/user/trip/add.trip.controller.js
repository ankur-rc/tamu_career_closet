(function () {
    'use strict';

    angular
        .module('fleet')
        .controller('AddTripController', Controller);

    Controller.$inject = ['$scope', '$timeout', '$mdToast', '$mdDialog', '$mdSidenav', 'TripService', 'VehicleService'];

    /* @ngInject */
    function Controller($scope, $timeout, $mdToast, $mdDialog, $mdSidenav, TripService, VehicleService) {        

        $scope.selected = [];
        $scope.selectedDrivers = [];
        $scope.selectedRoutes = [];
        var list = [];

        /// Internal map variables ///
        var map;
        var markers = [];
        var directionsService;
        var directionsDisplay;
        // Instantiate an info window to hold step text.
        var infowindow = new google.maps.InfoWindow;              

        // Map theme styles    

        var customTheme = [
                    {
                        "featureType": "all",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "weight": "2.00"
                            }
                        ]
                    },
                    {
                        "featureType": "all",
                        "elementType": "geometry.stroke",
                        "stylers": [
                            {
                                "color": "#9c9c9c"
                            }
                        ]
                    },
                    {
                        "featureType": "all",
                        "elementType": "labels.text",
                        "stylers": [
                            {
                                "visibility": "on"
                            }
                        ]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "all",
                        "stylers": [
                            {
                                "color": "#f2f2f2"
                            }
                        ]
                    },
                    {
                        "featureType": "landscape",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "color": "#ffffff"
                            }
                        ]
                    },
                    {
                        "featureType": "landscape.man_made",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "color": "#ffffff"
                            }
                        ]
                    },
                    {
                        "featureType": "poi",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "all",
                        "stylers": [
                            {
                                "saturation": -100
                            },
                            {
                                "lightness": 45
                            }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "color": "#eeeeee"
                            }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#7b7b7b"
                            }
                        ]
                    },
                    {
                        "featureType": "road",
                        "elementType": "labels.text.stroke",
                        "stylers": [
                            {
                                "color": "#ffffff"
                            }
                        ]
                    },
                    {
                        "featureType": "road.highway",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "simplified"
                            }
                        ]
                    },
                    {
                        "featureType": "road.arterial",
                        "elementType": "labels.icon",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "transit",
                        "elementType": "all",
                        "stylers": [
                            {
                                "visibility": "off"
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "all",
                        "stylers": [
                            {
                                "color": "#46bcec"
                            },
                            {
                                "visibility": "on"
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "geometry.fill",
                        "stylers": [
                            {
                                "color": "#c8d7d4"
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "labels.text.fill",
                        "stylers": [
                            {
                                "color": "#070707"
                            }
                        ]
                    },
                    {
                        "featureType": "water",
                        "elementType": "labels.text.stroke",
                        "stylers": [
                            {
                                "color": "#ffffff"
                            }
                        ]
                    }
                ];
        
        ////////////// Functions ////////////////////
        $scope.close = close;
        $scope.toggleRight = buildToggler('right');
        $scope.isOpenRight = isOpenRight;
        $scope.toggle = toggle;
        $scope.exists = exists;
        $scope.addRoutes = addRoutes;
        $scope.createTrip = createTrip;
        $scope.getVehicles = getVehicles;
        /////////////////////////////////////////////

        function close() {
            // Component lookup should always be available since we are not using `ng-if`
            $mdSidenav('right').close()
                .then(function () {
                
                });
        };
        
        function isOpenRight(){
            return $mdSidenav('right').isOpen();
        };

        function buildToggler(navID) {
            return function() {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                .toggle()
                .then(function () {
                    
                });
            };        
        }
        
        function toggle(item) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            }
            else {
                list.push(item);
            }
        };

        function exists(item) {
            return list.indexOf(item) > -1;
        };
            
        function addRoutes($event) {
            $scope.trip.routeMap = [];
            $mdDialog.show({
                    fullscreen: true,
                    targetEvent: $event,
                    parent: angular.element(document.body),
                    templateUrl: 'components/user/trip/dialog/add.trip-routes.html',
                    controller: "AddTripRoutesController",
                    locals: {
                        drivers: $scope.selectedDrivers,
                        routes: $scope.selectedRoutes
                    }
                }).then(function(result) {
                    $scope.isRoutesSelected = result.success;
                    if(result.success) {
                        $scope.selectedRoutes = result.routes;
                        $scope.selectedDrivers = result.drivers;
                        for(var i=0; i<result.routes.length; i++) {
                            var json = {};
                            json.routeId = result.routes[i].id,
                            json.driverId = result.drivers[i].id;

                            $scope.trip.routeMap.push(json);
                        }
                    }
                }) 
        }

        function createTrip() {           

            var newTrip = {
                name: $scope.trip.name,
                owner: $scope.trip.owner,
                vehicleId: $scope.trip.vin,
                startLat: $scope.trip.startLocation.latitude,
                startLong: $scope.trip.startLocation.longitude,
                startAddress: $scope.trip.startLocation.name,
                endLat: $scope.trip.endLocation.latitude,
                endLong: $scope.trip.startLocation.longitude,
                endAddress: $scope.trip.endLocation.name,
                startTime: new Date($scope.trip.startTime).getTime()/1000,
                status:"scheduled",
                avoidHighways: exists('Avoid Highways') ? "Y" : "N",
                avoidTolls: exists('Avoid Tolls') ? "Y" : "N",
                routes: JSON.stringify($scope.trip.routeMap) 
            }
            
            TripService.createTrip(newTrip).then(function (response){
                if(response.data.success) {
                    var waypoints = response.data.route.activities;
                    calculateAndDisplayRoute(directionsService, directionsDisplay, waypoints);
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "New trip created successfully!")
                        .position("bottom right").parent(document.body));
                }
                else
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Could not create trip.")
                        .position("bottom right").parent(document.body));
                
            });          

            
        }

        function getVehicles() {
            VehicleService.getActiveVehicles().then(function(response){
                if(response.data.success) {
                    $scope.vehicles = response.data.response;
                }
            })
        }
        
        // Internal functions
        function convertCamelCase(text) {
            var result = text.replace( /([A-Z])/g, " $1" );
            return result.charAt(0).toUpperCase() + result.slice(1);
        }

        function arrayObjectIndexOf(myArray, searchTerm, property) {
            for(var i = 0, len = myArray.length; i < len; i++) {
                if (myArray[i][property] === searchTerm) return i;
            }
            return -1;
        }
        
        //////////////// Internal methods for redering Google Map /////////////////////////////        

        function initMap() {
            directionsService = new google.maps.DirectionsService;
            directionsDisplay = new google.maps.DirectionsRenderer({
                                    suppressMarkers: true
                                });
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 3
                , center: {lat: 0, lng: 0}
                , mapTypeId: 'terrain'
            });
            map.setOptions({ minZoom: 2 });  
            map.setOptions({styles: customTheme}); 

            directionsDisplay.setMap(map); 
        }

        function calculateAndDisplayRoute(directionsService, directionsDisplay, activities) {
            var waypts = [];
            var descriptions = [];
            for(var i=0; i<activities.length; i++) {
                if(activities[i].type !== "start" && activities[i].type !== "end") {
                    var waypt = {
                        location: activities[i].locationId,
                        stopover: true
                    };
                    var idx = arrayObjectIndexOf(waypts, waypt.location, "location");
                    if(idx < 0) {
                    waypts.push(waypt); 
                    descriptions.push('<b>' + convertCamelCase(activities[i].type) + '</b><br>' + activities[i].id);
                    }
                    else
                        descriptions[idx] += '<br><b>' + convertCamelCase(activities[i].type) + '</b><br>' + activities[i].id;                     
                }
                
            }
           
            directionsService.route({
                origin: $scope.trip.startLocation.name,
                destination: $scope.trip.endLocation.name,
                waypoints: waypts,
                optimizeWaypoints: false,
                travelMode: 'DRIVING'
            }, function(response, status) {
            if (status === 'OK') {
                //console.log(response);
                directionsDisplay.setDirections(response);
                var startLocation = new Object();
                var endLocation = new Object();
                var waypointLocations = [];

                // Display start and end markers for the route.
                var legs = response.routes[0].legs;
                for (i = 0; i < legs.length; i++) {
                if (i == 0) {
                    startLocation.latlng = legs[i].start_location;
                    startLocation.address = legs[i].start_address;
                    startLocation.description = "";
                }
                if (i != 0) {
                    var waypoint = {};
                    waypoint.latlng = legs[i].start_location;
                    waypoint.address = legs[i].start_address;
                    waypoint.description = descriptions[i-1];
                    waypointLocations.push(waypoint);
                }
                if (i == legs.length - 1) {
                    endLocation.latlng = legs[i].end_location;
                    endLocation.address = legs[i].end_address;
                    endLocation.description = "";
                }
                var steps = legs[i].steps;
            }
                var markerletter = "A".charCodeAt(0);
                markerletter = String.fromCharCode(markerletter);                
                createMarker(startLocation.latlng, startLocation.address, startLocation.description, markerletter);
                
                var i = 0;
                if(waypointLocations[i].address !== startLocation.address)
                        i++;
                for (var j=0; j < waypointLocations.length; j++) {                    
                    var markerletter = "A".charCodeAt(0);
				    markerletter += i;
                    markerletter = String.fromCharCode(markerletter);
                    createMarker(waypointLocations[j].latlng, waypointLocations[j].address, waypointLocations[j].description, markerletter);
                    i++;
                }
                if(waypointLocations[j-1].address !== endLocation.address) {
                    markerletter = "A".charCodeAt(0);
                    markerletter += i;
                    markerletter = String.fromCharCode(markerletter);
                    createMarker(endLocation.latlng, endLocation.address, endLocation.description, markerletter)
                }                              
                
                
            } else {
                window.alert('Directions request failed due to ' + status);
            }
            });
        }      
       
        function createMarker(latlng, label, html, color) {
            var contentString = '<span style="color:black">' + label + '<br>' + html + '</span>';
            var marker = new google.maps.Marker({
                position: latlng,
                map: map,
                label: color,
                title: label,
                zIndex: Math.round(latlng.lat() * -100000) << 5
            });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.setContent(contentString);
                infowindow.open(map, marker);
            });
        }

        /////////////////////////////////////////////////////////////////////////////       
        
        $timeout(initMap,1000);
    };   

})();