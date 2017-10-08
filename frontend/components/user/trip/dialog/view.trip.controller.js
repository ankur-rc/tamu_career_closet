(function () {
    'use strict';

    angular
        .module('fleet')
        .controller('ViewTripController', Controller);

    Controller.$inject = ['$scope', '$timeout', '$mdToast', '$mdDialog', '$state', 'DashboardService', 'trip'];

    /* @ngInject */
    function Controller($scope, $timeout, $mdToast, $mdDialog, $state, DashboardService, trip) {

        $scope.trip = trip;
        /// Internal map variables ///
        var map;
        var markers = [];
        var directionsService;
        var directionsDisplay;        
        var infowindow = new google.maps.InfoWindow;  // Instantiate an info window to hold step text.

        ////////////// Functions ////////////////////
        $scope.convertCamelCase = convertCamelCase;
        $scope.closeDialog = closeDialog;
        $scope.viewTripMetrics = viewTripMetrics;

        /////////////////////////////////////////////
        // Private functions     

        function arrayObjectIndexOf(myArray, searchTerm, property) {
            for (var i = 0, len = myArray.length; i < len; i++) {
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
            map = new google.maps.Map(document.getElementById('editMap'), {
                zoom: 2,
                center: {
                    lat: 0,
                    lng: 0
                },
                mapTypeId: 'terrain'
            });
            map.setOptions({
                minZoom: 2
            });
            map.setOptions({
                styles: DashboardService.mapsConfig.theme.dark
            });

            directionsDisplay.setMap(map);

            calculateAndDisplayRoute(directionsService, directionsDisplay, JSON.parse($scope.trip.waypoints).activities);
        }

        function calculateAndDisplayRoute(directionsService, directionsDisplay, activities) {
            var waypts = [];
            var descriptions = [];
            for (var i = 0; i < activities.length; i++) {
                if (activities[i].type !== "start" && activities[i].type !== "end") {
                    var waypt = {
                        location: activities[i].locationId,
                        stopover: true
                    };
                    var idx = arrayObjectIndexOf(waypts, waypt.location, "location");
                    if (idx < 0) {
                        waypts.push(waypt);
                        descriptions.push('<b>' + convertCamelCase(activities[i].type) + '</b><br>' + activities[i].id);
                    } else
                        descriptions[idx] += '<br><b>' + convertCamelCase(activities[i].type) + '</b><br>' + activities[i].id;
                }

            }
            
            directionsService.route({
                origin: $scope.trip.startAddress,
                destination: $scope.trip.endAddress,
                waypoints: waypts,
                optimizeWaypoints: false,
                travelMode: 'DRIVING'
            }, function (response, status) {
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
                            waypoint.description = descriptions[i - 1];
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
                    if (waypointLocations[i].address !== startLocation.address)
                        i++;
                    for (var j = 0; j < waypointLocations.length; j++) {
                        var markerletter = "A".charCodeAt(0);
                        markerletter += i;
                        markerletter = String.fromCharCode(markerletter);
                        createMarker(waypointLocations[j].latlng, waypointLocations[j].address, waypointLocations[j].description, markerletter);
                        i++;
                    }
                    if (waypointLocations[j - 1].address !== endLocation.address) {
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

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent(contentString);
                infowindow.open(map, marker);
            });
        }
        

        ///////////////////////////////////////////////////////////////////////////// 

        function convertCamelCase(text) {
            var result = text.replace(/([A-Z])/g, " $1");
            return result.charAt(0).toUpperCase() + result.slice(1);
        }    

        function viewTripMetrics() {

            $state.go('main.trip.metrics', {
                'trip': $scope.trip
            });
            closeDialog();
        }  

        function closeDialog() {
            $mdDialog.hide();
        };
        
        $timeout(initMap, 2000);

    };

})();