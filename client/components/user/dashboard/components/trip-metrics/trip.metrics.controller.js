(function () {
    angular.module("fleet.dashboard").controller("TripMetricsController", controller);

    /*@ngInject*/
    controller.$inject = ["AsyncMapsLoader", "TripMetricsService", "$scope", "$timeout", "$interval", "$stomp", "$log",
        '$mdTheming', '$stateParams', '$mdToast', '$mdDialog', "WS_SERVER", "DashboardService"
    ];

    function controller(AsyncMapsLoader, TripMetricsService, $scope, $timeout, $interval, $stomp, $log,
        $mdTheming, $stateParams, $mdToast, $mdDialog, WS_SERVER, DashboardService) {

        var vm = this;
        //variables
        __vehicleId = 'Thunder Tank';
        vm.trip = $stateParams.trip;
        vm.selectedVehicle = null;
        vm.followMarker = false;
        vm.darkTheme = true;
        vm.vehicle = null;
        __eventMarkerIndexMap = {};
        __mapMarkerIndexMap = {};

        //map
        vm.map = null;
        vm.vehicleMarker = null;
        vm.mapsReady = false;
        vm.showControls = false;
        __carIcon = {
            path: TripMetricsService.carIcon,
            scale: .7,
            strokeColor: 'white',
            strokeWeight: .10,
            fillOpacity: 1,
            fillColor: 'yellow',
            offset: '5%',
            anchor: new google.maps.Point(10, 25) // orig 10,50 back of car, 10,0 front of car, 10,25 center of car
        };

        //direction
        var directionService, directionDisplay;
        var directionsFor = {
            origin: {
                x: 28.460770000000004,
                y: 77.05146
            },
            destination: {
                x: 27.128570000000003,
                y: 78.10435000000001
            }
        }

        //alert
        vm.eventMarkers = [];
        vm.eventList = [];
        vm.timelineLoading = true;
        var __markerCluster;

        //timeline
        vm.timeline = {
            ref: null,
            data: null,
            options: TripMetricsService.timelineOptions
        }
        var __initTimeline = __initTimeline;
        var __addNewTimelineEvent = __addNewTimelineEvent;
        vm.timelineNow = timelineNow;
        vm.fitTimeline = fitTimeline;
        vm.followingEvents = false;

        //websocket
        vm.socketReady = false;
        var __wsStatusCodes = {
            connecting: "Connecting...",
            subscribing: "Subscribing...",
            connected: "Live",
            disconnected: "Connection error!"
        };
        vm.wsStatus = __wsStatusCodes.connecting;
        var __wsConfigInfo = {
            subscription: null,
            subsForInitVehicleData: "/topic/init-vehicle-data/user-1",
            subsEndpoint: "/topic/vehicle-data/user-1",
            appEndpoint: "/app/init-vehicle-data/user-1"
        };
        var __wsConfigInfoForEvents = {
            subscription: null,
            subsForInitVehicleEvent: "/topic/init-vehicle-event-data/" + __vehicleId,
            subsEndpoint: "/topic/vehicle-event-data/" + __vehicleId,
            appEndpoint: "/app/init-vehicle-event-data/" + __vehicleId
        }
        var __initDataSub = null;
        var __initEventDataSub = null;

        var __retry = {
            init: 2000,
            limit: 4,
            attempt: 0
        }
        var __timeout = {
            ref: null,
            time: null,
            counter: null
        }

        //functions////////////////////////////////////////////////////////////////////////////////////////////////////
        vm.refineKey = refineKey;

        //map functions
        var __initMap = __initMap;
        var __constructInitVehicleMarker = __constructInitVehicleMarker;
        var __constructInitEventMarkers = __constructInitEventMarkers;
        var __addNewEventMarker = __addNewEventMarker;
        vm.toggleTheme = toggleTheme;
        vm.recenterVehicle = recenterVehicle;

        //websocket functions
        var __initWS = __initWS;
        var __onWsDisconnect = __onWsDisconnect;
        var __onInitVehicleData = __onInitVehicleData;
        var __onInitVehicleEvents = __onInitVehicleEvents;
        var __onVehicleData = __onVehicleData;
        var __onVehicleEvent = __onVehicleEvent;

        //function definitions
        function __init() {
            AsyncMapsLoader.mapsInitialized.then(function () {
                vm.mapsReady = true;
                //__initMap();
            });
            __initWS();
        }

        function __initMap() {

            vm.map = new google.maps.Map(document.getElementById('trip_map'), {
                zoom: 5,
                center: {
                    lat: 0,
                    lng: 0
                }
            });

            //console.log(DashboardService);
            vm.map.setOptions({
                minZoom: 2,
                styles: DashboardService.mapsConfig.theme.dark
            });

            vm.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('controls'));

            vm.showControls = true;

            directionService = new google.maps.DirectionsService();
            var polylineOptionsActual = new google.maps.Polyline({
                strokeColor: document.getElementById('wsStatus').style.backgroundColor,
                strokeOpacity: 1.0,
                strokeWeight: 7
            });
            directionDisplay = new google.maps.DirectionsRenderer({
                polylineOptions: polylineOptionsActual
            });

            directionDisplay.setMap(vm.map);

            var directionsRequest = {
                origin: new google.maps.LatLng(directionsFor.origin.x, directionsFor.origin.y),
                destination: new google.maps.LatLng(directionsFor.destination.x, directionsFor.destination.y),
                travelMode: 'DRIVING'
            }

            directionService.route(directionsRequest, function (result, status) {
                if (status == 'OK') {
                    directionDisplay.setDirections(result);
                    vm.map.setZoom(18);
                }
            });

            __markerCluster = new MarkerClusterer(vm.map, vm.eventMarkers, {
                imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
            });
        }

        function __constructInitVehicleMarker() {

            if (vm.vehicleMarker)
                vm.vehicleMarker.setMap(null);

            var marker = new google.maps.Marker({
                position: {
                    lat: vm.vehicle.location.x,
                    lng: vm.vehicle.location.y
                },
                map: vm.map,
                icon: __carIcon
            });

            var infowindow = new google.maps.InfoWindow();
            vm.vehicleMarker = marker;

            google.maps.event.addListener(marker, 'click', (function (marker, vehicle) {
                return function () {
                    //console.log(vehicle.id);
                    infowindow.setContent('<div style="color:grey">' + vehicle.id + '</div>');
                    infowindow.open(vm.map, marker);
                }
            })(marker, vm.vehicle));

            // var markerCluster = new MarkerClusterer(vm.map, vm.vehicleMarkers, {
            //     imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
            // });

            vm.map.setCenter(vm.vehicleMarker.getPosition());
        }

        function __addNewEventMarker(eventData, timeout) {

            $timeout(function () {
                var marker = new google.maps.Marker({
                    position: {
                        lat: eventData.location.x,
                        lng: eventData.location.y
                    },
                    map: vm.map,
                    icon: TripMetricsService.mapIconByEventType(eventData.event.eventId),
                    animation: google.maps.Animation.DROP
                });

                vm.eventMarkers.push(marker);
                __mapMarkerIndexMap[eventData.id] = marker;

                var infowindow = new google.maps.InfoWindow();
                google.maps.event.addListener(marker, 'click', (function (marker, eventData) {
                    return function () {
                        //console.log(vehicle.id);
                        infowindow.setContent('<div style="color:black">Id: <span style="color:grey">' + eventData.id + '</span></div>' + '<div style="color:black">Type: <span style="color:grey">' + TripMetricsService.eventMapping[eventData.event.eventId].event + '</span></div>' + '<div style="color:black">Timestamp: <span style="color:grey">' + new Date(eventData.timestamp).toLocaleString() + '</span></div>');
                        infowindow.open(vm.map, marker);
                        $timeout(function () {
                            try {
                                vm.timeline.ref.focus(eventData.id);
                            } catch (e) {

                            }
                        });
                    }
                })(marker, eventData));
                __markerCluster.addMarker(marker);
            }, timeout);

        }

        function __constructInitEventMarkers() {

            __markerCluster.removeMarkers(vm.eventMarkers);
            for (var i = 0; i < vm.eventMarkers.length; i++) {
                console.log("seting event msrkers null");
                vm.eventMarkers[i].setMap(null);
            }

            vm.eventMarkers = [];

            for (var i = 0; i < vm.eventList.length; i++) {
                var eventData = vm.eventList[i];
                __addNewEventMarker(eventData, i * 200);
            }

        }

        function __onWsDisconnect(error) {
            $timeout(function () {
                $log.info("ws disconnected for: " + __retry.attempt + " time.");
                vm.wsStatus = __wsStatusCodes.disconnected;
                if (__retry.attempt != __retry.limit) {
                    __retry.attempt = __retry.attempt + 1;
                    __retry.init = __retry.attempt * __retry.init;
                    __timeout.time = __retry.init;
                    __timeout.counter = 0;
                    __timeout.ref = $interval(function () {
                        //console.log("Retrying in " + (__timeout.time / 1000 - __timeout.counter) + "s");
                        vm.wsStatus = "Retrying in " + (__timeout.time / 1000 - __timeout.counter) + "s";
                        __timeout.counter = __timeout.counter + 1;
                    }, 1000);
                    $timeout(function () {
                        $interval.cancel(__timeout.ref);
                        __initWS();
                    }, __retry.init);
                } else {
                    //$log.info("Retry limit reached!");
                    vm.wsStatus = __wsStatusCodes.disconnected + " Retry limit reached.";
                }
            });

        }

        function __initWS() {

            $stomp.setDebug(function (args) {
                $log.debug(args)
            });

            $stomp.connect(WS_SERVER, {}, __onWsDisconnect).then(function (frame) {

                //console.log(frame);
                vm.wsStatus = __wsStatusCodes.subscribing;
                vm.socketReady = true;

                __initDataSub = $stomp.subscribe(__wsConfigInfo.subsForInitVehicleData, function (payload, headers, res) {
                    //console.log("Init vehicle data payload: " + JSON.stringify(payload));
                    $timeout(__onInitVehicleData(payload));
                });

                __initEventDataSub = $stomp.subscribe(__wsConfigInfoForEvents.subsForInitVehicleEvent, function (payload, headers, res) {
                    //console.log("Init vehicle evennt data payload: " + JSON.stringify(payload));
                    $timeout(__onInitVehicleEvents(payload));
                });

                $stomp.send(__wsConfigInfo.appEndpoint, {}, {});
                $stomp.send(__wsConfigInfoForEvents.appEndpoint, {}, {});

            });
        }

        function __onInitVehicleData(payloadData) {
            vm.vehiclesLoading = false;
            for (var i = 0; i < payloadData.length; i++) {
                if (payloadData[i].id == __vehicleId) {
                    vm.vehicle = payloadData[i];
                    break;
                }
            }
            __initDataSub.unsubscribe();
            __constructInitVehicleMarker();
            //subscribe to new data
            $timeout(function () {
                vm.wsStatus = __wsStatusCodes.connected;
                __wsConfigInfo.subscription = $stomp.subscribe(__wsConfigInfo.subsEndpoint, function (payload, headers, res) {
                    $timeout(__onVehicleData(payload));
                });
            }, 1000);
            //$scope.$apply();
            //onsole.log(vm.vehicleList[0].id);
        }

        function __onInitVehicleEvents(payloadData) {

            //console.log(payloadData);
            vm.eventList = payloadData;
            __initEventDataSub.unsubscribe();
            __initTimeline();
            __constructInitEventMarkers();
            //subscribe to new data
            $timeout(function () {
                __wsConfigInfoForEvents.subscription = $stomp.subscribe(__wsConfigInfoForEvents.subsEndpoint, function (payload, headers, res) {
                    $timeout(__onVehicleEvent(payload));
                });
            }, 1000);
        }

        function __initTimeline() {

            if (vm.timeline.ref)
                vm.timeline.ref.destroy();

            vm.timelineLoading = false;
            var container = document.getElementById("timeline");
            var items = [];
            for (var i = 0; i < vm.eventList.length; i++) {
                var id = vm.eventList[i].id;
                var content = "<img class='timeline-marker' src='" + TripMetricsService.mapTlIconByEventType(vm.eventList[i].event.eventId) + "'/>";
                var start = vm.eventList[i].timestamp;

                items.push({
                    id: id,
                    content: content,
                    start: start,
                    type: "point"
                });

                __eventMarkerIndexMap[vm.eventList[i].id] = vm.eventList[i];
            }

            vm.timeline.data = new vis.DataSet();
            vm.timeline.data.add(items);
            vm.timeline.ref = new vis.Timeline(container, vm.timeline.data);
            vm.timeline.ref.on('select', function (properties) {
                var marker = __mapMarkerIndexMap[properties.items[0]];
                vm.map.setCenter(marker.getPosition());
                vm.map.setZoom(16);

                var eventData = __eventMarkerIndexMap[properties.items[0]];
                console.log(__eventMarkerIndexMap);
                $mdDialog.show(
                    $mdDialog.alert()
                    .parent(document.body)
                    .clickOutsideToClose(true)
                    .title('Description')
                    .textContent(eventData.event.eventDescription)
                    .ariaLabel('Event Description')
                    .ok('OK')
                );
            });
        }

        function __addNewTimelineEvent(eventData) {
            var id = eventData.id;
            var content = "<img class='timeline-marker' src='" + TripMetricsService.mapTlIconByEventType(eventData.event.eventId) + "'/>";
            var start = eventData.timestamp;

            vm.timeline.data.add({
                id: id,
                content: content,
                start: start,
                type: "point"
            });

            __eventMarkerIndexMap[eventData.id] = eventData;

            if (vm.followingEvents) {
                vm.timeline.ref.moveTo(start);
            }
        }

        function __onVehicleData(payload) {
            if (payload.id == __vehicleId) {
                if ((payload.location.x == directionsFor.destination.x) && (payload.location.y == directionsFor.destination.y)) {
                    __wsConfigInfo.subscription.unsubscribe();
                    __wsConfigInfoForEvents.subscription.unsubscribe();
                    $mdToast.show($mdToast.simple()
                        .textContent('You have reached your destination.')
                        .action('OK')
                        .highlightAction(true)
                        .highlightClass('md-accent')
                        .hideDelay(false)
                        .position("bottom left").parent(document.getElementById('trip_map'))).then(function (response) {
                        $stomp.disconnect().then(function () {
                            $log.info('ws disconnected.');
                            __initWS();
                        });

                    });
                } else {
                    vm.vehicle = payload;
                    var vehicleData = payload;

                    var marker = vm.vehicleMarker;
                    var lastLocation = marker.getPosition();
                    var nextLocation = new google.maps.LatLng(vehicleData.location.x, vehicleData.location.y);
                    var icon = __carIcon;
                    var heading = google.maps.geometry.spherical.computeHeading(lastLocation, nextLocation);
                    icon.rotation = heading;

                    marker.setIcon(icon);
                    marker.animateTo(nextLocation);
                    if (vm.followMarker)
                        vm.map.panTo(marker.getPosition());
                }
                //console.log("New vehicle data is:" + JSON.stringify(payload));
            }
        }

        function __onVehicleEvent(payload) {
            var eventData = payload;
            __addNewTimelineEvent(eventData);
            __addNewEventMarker(eventData, 0);
            //console.log("New vehicle data is:" + JSON.stringify(payload));
        }

        function refineKey(key) {
            return key.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1").toUpperCase();
        }

        function recenterVehicle() {
            vm.map.panTo(vm.vehicleMarker.getPosition());
            //vm.map.setZoom(18);
        }

        function timelineNow() {
            try {
                vm.timeline.ref.moveTo(vm.timeline.ref.getCurrentTime());
            } catch (e) {}
        }

        function fitTimeline() {
            try {
                vm.timeline.ref.fit()
            } catch (e) {}
        }

        function toggleTheme() {
            if (vm.darkTheme) {
                vm.darkTheme = false;
                vm.map.setOptions({
                    styles: DashboardService.mapsConfig.theme.light
                });
            } else {
                vm.darkTheme = true;
                vm.map.setOptions({
                    styles: DashboardService.mapsConfig.theme.dark
                });
            }
        }


        $scope.$watchGroup(['vm.mapsReady', 'vm.socketReady'],
            function (newVal, oldVal) {
                if (newVal[0] === true && newVal[1] === true) {
                    //console.log(newVal + " " + oldVal);
                    console.log("Maps is ready. And so is the WS connection!");
                    __initMap();
                    //execute initMap
                }
            }
        );

        $scope.$on('navbarToggled', function () {
            console.log('navbar has been toggled.. resize map');
            $timeout(function () {
                new google.maps.event.trigger(vm.map, 'resize');
                if (vm.timeline.ref)
                    vm.timeline.ref.redraw();
            }, 750);
        })

        $scope.$on('$destroy', function () {
            try {
                __wsConfigInfo.subscription.unsubscribe();
                __wsConfigInfoForEvents.subscription.unsubscribe();
                $stomp.disconnect().then(function () {
                    $log.info('ws disconnected.')
                });
            } catch (e) {
                console.error(e);
            }
        });

        $timeout(function () {
            __init();
            //console.log(vm.trip);
        }, 2000);
    }
}());