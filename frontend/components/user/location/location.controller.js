(function() {
    'use strict';

    angular
        .module('fleet')
        .controller('LocationController', Controller);

    Controller.$inject = ['$scope', '$timeout', '$mdToast', '$filter', 'devicesLocation', 'LocationService'];

    /* @ngInject */
    function Controller($scope, $timeout, $mdToast, $filter, devicesLocation, LocationService) {

        /////////////// Variables ///////////////////
        $scope.devicesLocation = devicesLocation.location;
        $scope.deviceCurfew = {
            deviceId: null,
            startTime: null,
            endTime: null
        };
        $scope.deviceSpeedLimit = {
            deviceId: null,
            speedLimit: null
        };
        $scope.fence = {
            type: null
        }

        $scope.showGeoFence = false;
        $scope.geoFenceRadius = 0;
        $scope.showGeoDiv = false;
        $scope.showSpeedDiv = false;
        $scope.showCurfewDiv = false;
        $scope.showTips = true;
        $scope.polygonCoordinates = [];
        $scope.days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

        /// Internal map variables ///
        var map;
        var markers = [];
        var markerImg = "img/_extra/CarMarker.png";
        var cityCircle;
        var newPolygonCoordinates = [];
        var polygonFence;
        var polygonMarkers = [];

        // Map theme styles
        var darkTheme = [{
            featureType: "all",
            elementType: "all",
            stylers: [{
                invert_lightness: true
                    }, {
                saturation: 10
                    }, {
                lightness: 10
                    }, {
                gamma: .8
                    }, {
                hue: "#293036"
                    }]
                }, {
            featureType: "water",
            stylers: [{
                visibility: "on"
                    }, {
                color: "#293036"
                    }]
            }];

        var lightTheme = [{
            stylers: [{
                hue: "#2c3e50"
            }, {
                saturation: 250
            }]
            }, {
            featureType: "road",
            elementType: "geometry",
            stylers: [{
                lightness: 50
                }, {
                visibility: "simplified"
                }]
            }, {
            featureType: "road",
            elementType: "labels",
            stylers: [{
                visibility: "off"
                }]
        }];

        ////////////// Functions ////////////////////
        $scope.showDeviceGeoFence = showDeviceGeoFence;
        $scope.setDeviceCurfew = setDeviceCurfew;
        $scope.deleteDeviceCurfew = deleteDeviceCurfew;
        $scope.setDeviceSpeedLimit = setDeviceSpeedLimit;
        $scope.showAll = showAll;
        $scope.drawGeoFence = drawGeoFence;
        $scope.setTheme = setTheme;
        $scope.drawPolygon = drawPolygon;
        $scope.toggleTabs = toggleTabs;
        $scope.clearFence = clearFence;
        $scope.closeTips = closeTips;

        /////////////////////////////////////////////
        function showDeviceGeoFence(location, index) {
            $scope.location = index;
            $scope.showGeoFence = true;
            $scope.fence.type = location.geometry.type;
            google.maps.event.trigger(map, "resize");
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }

            var selectedDeviceLocation = [];
            selectedDeviceLocation.push(location);
            var device = { location: selectedDeviceLocation };

            eqfeed_callback(device);

            // Add the circle for this city to the map.
            if (location.geometry.type === 'Circle') {
                var coords = location.geometry.coordinates[0];
                drawFence(location.geometry.radius, coords.lat, coords.lng);
            } else {
                $scope.polygonCoordinates = location.geometry.coordinates;
                $scope.drawPolygon();
                $scope.showSummary = false;
            }
        }

        function setDeviceCurfew() {
            var curfewDTO = {
                deviceId: $scope.device.properties.deviceId,
                curfewDetails: {}
            }
            for (var i = 0; i < $scope.curfew.days.length; i++)
                curfewDTO.curfewDetails[$scope.curfew.days[i]] = {}
            $scope.deviceCurfew.startTime = $filter('date')($scope.deviceCurfew.startTime, 'HH:MM');
            $scope.deviceCurfew.endTime = $filter('date')($scope.deviceCurfew.endTime, 'HH:MM');
            for (var i = 0; i < $scope.curfew.days.length; i++) {
                curfewDTO.curfewDetails[$scope.curfew.days[i]].status = true
                curfewDTO.curfewDetails[$scope.curfew.days[i]].startTime = $scope.deviceCurfew.startTime,
                    curfewDTO.curfewDetails[$scope.curfew.days[i]].endTime = $scope.deviceCurfew.endTime

            }
            LocationService.setDeviceCurfew(curfewDTO).then(function(response) {
                if (response.data.success) {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Updated device curfew successfully!")
                        .position("bottom right").parent(document.body));
                    getDeviceCurfew();
                } else {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Could not update curfew.")
                        .position("bottom right").parent(document.body));
                }
            });
        }

        function deleteDeviceCurfew(day) {
            LocationService.deleteDeviceCurfew($scope.device.properties.deviceId, day).then(function(response) {
                if (response.data.success) {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Deleted device curfew successfully!")
                        .position("bottom right").parent(document.body));
                    delete $scope.curfews[day];
                } else {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Could not delete curfew.")
                        .position("bottom right").parent(document.body));
                }
            });
        }

        function setDeviceSpeedLimit() {
            LocationService.setDeviceSpeedLimit($scope.deviceSpeedLimit).then(function(response) {
                if (response.data.success) {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Updated device speed limit successfully!")
                        .position("bottom right").parent(document.body));
                } else {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Could not update speed limit.")
                        .position("bottom right").parent(document.body));
                }
            });
        }

        function showAll() {
            $scope.showGeoFence = false;
            google.maps.event.trigger(map, "resize");
            if (typeof cityCircle !== 'undefined')
                cityCircle.setMap(null);
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            eqfeed_callback(devicesLocation);
        }

        function drawGeoFence(color) {

            var coordinates = [];
            //Save details
            if ($scope.fence.type == 'Circle') {
                searchBox();
                drawFence($scope.geoFenceRadius, $scope.location.latitude,
                    $scope.location.longitude);
                coordinates.push({ lat: $scope.location.latitude, lng: $scope.location.longitude });
            } else {
                for (var i = 0; i < $scope.polygonCoordinates.length; i++) {
                    coordinates.push({ lat: $scope.polygonCoordinates[i].lat, lng: $scope.polygonCoordinates[i].lng });
                }
            }


            var geoDTO = {
                type: "GeospatialCollection",
                geography: {
                    type: $scope.fence.type,
                    geometry: {
                        radius: $scope.geoFenceRadius,
                        coordinates: coordinates
                    }
                }
            };
            LocationService.setDeviceGeoFence($scope.device.properties.deviceId, geoDTO, $scope.device.fence.id).then(function(response) {
                if (response.data.success) {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Updated geo-fence successfully!")
                        .position("bottom right").parent(document.body));
                    newPolygonCoordinates = [];
                    for (var i = 0; i < polygonMarkers.length; i++)
                        polygonMarkers[i].setMap(null);
                    $scope.devicesLocation[$scope.location].geometry.coordinates = coordinates;
                    $scope.devicesLocation[$scope.location].geometry.radius = $scope.geoFenceRadius;
                    $scope.devicesLocation[$scope.location].geometry.type = $scope.fence.type;
                } else {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Could not update geo-fence.")
                        .position("bottom right").parent(document.body));
                }
            });
        }

        function setTheme(theme) {
            switch (theme) {
                case 'Default':
                    map.setOptions({
                        styles: []
                    });
                    break;
                case 'Dark':
                    map.setOptions({
                        styles: darkTheme
                    });
                    break;
                case 'Light':
                    map.setOptions({
                        styles: lightTheme
                    });
                    break;
            }
        }

        function drawPolygon() {
            if (typeof polygonFence !== 'undefined') {
                polygonFence.setMap(null);
            }
            if (newPolygonCoordinates.length > 0)
                $scope.polygonCoordinates = angular.copy(newPolygonCoordinates);

            polygonFence = new google.maps.Polygon({
                paths: $scope.polygonCoordinates,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 3,
                fillColor: '#FF0000',
                fillOpacity: 0.35
            });
            polygonFence.setMap(map);

            var bound = new google.maps.LatLngBounds();

            //extend based on geo-fence
            for (var i = 0; i < $scope.polygonCoordinates.length; i++) {
                if (newPolygonCoordinates.length > 0) {
                    $scope.polygonCoordinates[i].lat = $scope.polygonCoordinates[i].lat();
                    $scope.polygonCoordinates[i].lng = $scope.polygonCoordinates[i].lng();
                }
                var latLng = new google.maps.LatLng($scope.polygonCoordinates[i].lat, $scope.polygonCoordinates[i].lng);
                bound.extend(latLng);
            }
            map.fitBounds(bound);

            $scope.showTips = true;
            $scope.showSummary = true;
            getPlaceNames();
        }

        function toggleTabs(tab) {
            switch (tab) {
                case 'showGeoDiv':
                    $scope.showGeoDiv = !$scope.showGeoDiv;
                    $scope.showCurfewDiv = false;
                    $scope.showSpeedDiv = false;
                    break;
                case 'showCurfewDiv':
                    $scope.showCurfewDiv = !$scope.showCurfewDiv;
                    $scope.showGeoDiv = false;
                    $scope.showSpeedDiv = false;
                    break;
                case 'showSpeedDiv':
                    $scope.showSpeedDiv = !$scope.showSpeedDiv;
                    $scope.showCurfewDiv = false;
                    $scope.showGeoDiv = false;
                    break;
            }
        }

        function clearFence() {
            newPolygonCoordinates = [];
            $scope.showSummary = false;
            polygonFence.setMap(null);
            for (var i = 0; i < polygonMarkers.length; i++)
                polygonMarkers[i].setMap(null);
        }

        function closeTips() {
            $scope.showTips = false;
        }
        //////////////// Internal methods for redering Google Map /////////////////////////////        

        function initMap() {
            getFenceActions();
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 2,
                center: {
                    lat: -33.865427,
                    lng: 80.196123
                },
                mapTypeId: 'terrain'
            });
            map.setOptions({ minZoom: 2 });

            eqfeed_callback(devicesLocation);
        }

        function eqfeed_callback(results) {
            markers = [];
            var icon = new google.maps.MarkerImage(markerImg,
                null, null, null, new google.maps.Size(35, 35));
            var infowindow = new google.maps.InfoWindow();
            var marker, i;
            var bound = new google.maps.LatLngBounds();
            for (i = 0; i < results.location.length; i++) {
                var coords = results.location[i].geometry.reference;
                var latLng = new google.maps.LatLng(coords[0], coords[1]);
                bound.extend(latLng);
                marker = new google.maps.Marker({
                    position: latLng,
                    animation: google.maps.Animation.DROP,
                    icon: icon,
                    map: map

                });

                markers.push(marker);

                google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {

                        infowindow.setContent('<div><b>' + results.location[i].properties.deviceAlias + '</b></div>' +
                            '<div>' + results.location[i].properties.place + '</div>');
                        infowindow.open(map, marker);
                    }
                })(marker, i));

            }
            map.fitBounds(bound);

        }

        function searchBox() {

            // For each place, get the icon, name and location.
            var bounds = new google.maps.LatLngBounds();
            var latLng = new google.maps.LatLng($scope.location.latitude, $scope.location.longitude);

            var icon = {
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: new google.maps.MarkerImage('img/map-target.svg',
                    null, null, null, new google.maps.Size(20, 20)),
                title: $scope.location.name,
                position: latLng
            }));


            bounds.extend(latLng);

            map.fitBounds(bounds);
        }

        function drawFence(radius, latitude, longitude) {
            if (typeof cityCircle !== 'undefined')
                cityCircle.setMap(null);

            cityCircle = new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map: map,
                center: { lat: latitude, lng: longitude },
                radius: radius * 1000,
                editable: true
            });

            var bound = new google.maps.LatLngBounds();

            //extend based on geo-fence
            var latLng = new google.maps.LatLng(latitude, longitude);
            bound.extend(latLng);

            map.fitBounds(cityCircle.getBounds());
        }

        function placeMarker(location) {
            newPolygonCoordinates.push(location);
            var marker = new google.maps.Marker({
                position: location,
                map: map,
                icon: new google.maps.MarkerImage('img/map-pin.png',
                    null, null, null, new google.maps.Size(50, 50))
            });
            polygonMarkers.push(marker);
        }

        // Intialise functions to populate forms based on user's saved values
        function getDeviceCurfew() {
            LocationService.getDeviceCurfew($scope.device.properties.deviceId).then(function(response) {
                if (response.data.success) {
                    // $scope.deviceCurfew.deviceId = $scope.device.properties.deviceId  
                    // var time = response.data.response.startTime.split(":"); 
                    // $scope.deviceCurfew.startTime = new Date().setHours(time[0],time[1]) ;
                    // var time = response.data.response.endTime.split(":"); 
                    // $scope.deviceCurfew.endTime = new Date().setHours(time[0],time[1]) ;
                    $scope.curfews = response.data.response.curfewDetails;
                    $scope.showCurfewHistory = true;
                } else {
                    // $scope.deviceCurfew.deviceId = $scope.device.properties.deviceId
                    // $scope.deviceCurfew.startTime = null
                    // $scope.deviceCurfew.endTime = null
                    $scope.curfews = {};
                    $scope.showCurfewHistory = false;
                }
            });
        }

        function getDeviceSpeedLimit() {
            LocationService.getDeviceSpeedLimit($scope.device.properties.deviceId).then(function(response) {
                if (response.data.success) {
                    $scope.deviceSpeedLimit.deviceId = $scope.device.properties.deviceId
                    $scope.deviceSpeedLimit.speedLimit = response.data.response.speedLimit
                } else {
                    $scope.deviceSpeedLimit.deviceId = $scope.device.properties.deviceId
                    $scope.deviceSpeedLimit.speedLimit = null
                }
            });
        }

        function getFenceActions() {
            LocationService.getGeoFenceActions().then(function(response) {
                if (response.data.success) {
                    $scope.fenceList = response.data.response.fence;
                }
            });
        }

        function getDeviceServiceEligibility() {
            $scope.loading = true;
            $scope.showGeoDiv = false;
            $scope.showSpeedDiv = false;
            $scope.showCurfewDiv = false;
            $scope.selectedDevice = {
                geoFence: {
                    eligibility: false
                },
                curfew: {
                    eligibility: false
                },
                speedLimit: {
                    eligibility: false
                }
            }
            LocationService.getGeoFenceEligibility($scope.device.properties.deviceId)
                .then(function(response) {
                    if (response.data.success) {
                        $scope.selectedDevice.geoFence.eligibility = response.data.response.eligibility;
                        if ($scope.loading)
                            $scope.loading = false;
                    }
                });
            LocationService.getCurfewEligibility($scope.device.properties.deviceId)
                .then(function(response) {
                    if (response.data.success) {
                        $scope.selectedDevice.curfew.eligibility = response.data.response.eligibility;
                        if ($scope.loading)
                            $scope.loading = false;
                    }
                });
            LocationService.getSpeedLimitEligibility($scope.device.properties.deviceId)
                .then(function(response) {
                    if (response.data.success) {
                        $scope.selectedDevice.speedLimit.eligibility = response.data.response.eligibility;
                        if ($scope.loading)
                            $scope.loading = false;
                    }
                });
        }

        function getPlaceNames() {
            $scope.fencePinNames = [];
            for (var i = 0; i < newPolygonCoordinates.length; i++) {
                LocationService.getPlaceName(newPolygonCoordinates[i].lat(), newPolygonCoordinates[i].lng()).then(function(response) {
                    $scope.fencePinNames.push(response.data.results[0].formatted_address);
                })

            }
        }

        /////////////////////////////////////////////////////////////////////////////

        $scope.$watch('device', function(oldValue, newValue) {
            if (oldValue !== newValue && oldValue !== "All") {
                //Get device curfew
                getDeviceCurfew();
                getDeviceSpeedLimit();
                getDeviceServiceEligibility();
            }
        })

        $scope.$watch('fence.type', function(value) {
            if (value == 'Polygon') {
                if (typeof cityCircle !== "undefined")
                    cityCircle.setOptions({ fillOpacity: 0, strokeOpacity: 0, editable: false });
                if (typeof polygonFence !== "undefined")
                    polygonFence.setOptions({ fillOpacity: 0.35, strokeOpacity: 0.8, editable: true });
                google.maps.event.addListener(map, 'click', function(event) {
                    placeMarker(event.latLng);
                });

            } else {
                if (typeof cityCircle !== "undefined")
                    cityCircle.setOptions({ fillOpacity: 0.35, strokeOpacity: 0.8, editable: true });
                if (typeof polygonFence !== "undefined")
                    polygonFence.setOptions({ fillOpacity: 0, strokeOpacity: 0, editable: false });
                google.maps.event.clearListeners(map, 'click');
            }
        })

        $timeout(initMap, 2000);

    };

})();