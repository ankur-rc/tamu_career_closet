(function () {
    angular.module("fleet.dashboard").controller("DashboardController", controller);

    /*@ngInject*/
    controller.$inject = ["AsyncMapsLoader", "$scope", "$timeout", "$interval", "$stomp", "$log", '$mdTheming', "WS_SERVER", "DashboardService"];

    function controller(AsyncMapsLoader, $scope, $timeout, $interval, $stomp, $log, $mdTheming, WS_SERVER, DashboardService) {

        var vm = this;
        //variables
        vm.selectedVehicle = undefined;
        vm.searchTerm = undefined;
        vm.vehiclesLoading = true;
        vm.vehicleList = [];
        vm.followMarker = false;
        vm.darkTheme = true;

        //map
        vm.map = undefined;
        vm.markers = [];
        vm.mapsReady = false;
        vm.showControls = false;
        __carIcon = {
            path: DashboardService.carIcon,
            scale: .7,
            strokeColor: 'white',
            strokeWeight: .10,
            fillOpacity: 1,
            fillColor: 'yellow',
            offset: '5%',
            anchor: new google.maps.Point(10, 25) // orig 10,50 back of car, 10,0 front of car, 10,25 center of car
        };

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
            subscription: undefined,
            subsForInitVehicleData: "/topic/init-vehicle-data/user-1",
            subsEndpoint: "/topic/vehicle-data/user-1",
            appEndpoint: "/app/init-vehicle-data/user-1"
        };
        var __initDataSub = undefined;
        var __markerVehicleIndexMap = {};
        var __retry = {
            init: 2000,
            limit: 4,
            attempt: 0
        }
        var __timeout = {
            ref: undefined,
            time: undefined,
            counter: undefined
        }

        //functions
        vm.selectVehicle = selectVehicle;
        vm.refineKey = refineKey;
        vm.refitInBounds = refitInBounds;

        //map functions
        var __initMap = __initMap;
        var __constructInitMarkers = __constructInitMarkers;
        var __initBounds = undefined;
        vm.toggleTheme = toggleTheme;

        //websocket functions
        var __initWS = __initWS;
        var __onWsDisconnect = __onWsDisconnect;
        var __onInitVehicleData = __onInitVehicleData;
        var __onVehicleData = __onVehicleData;

        //function definitions
        function __init() {
            AsyncMapsLoader.mapsInitialized.then(function () {
                vm.mapsReady = true;
                //__initMap();
            });
            __initWS();
        }

        function __initMap() {

            vm.map = new google.maps.Map(document.getElementById('dashboard_map'), {
                zoom: 5,
                center: {
                    lat: 0,
                    lng: 0
                }
            });

            //console.log(DashboardService);
            vm.map.setOptions({
                minZoom: 2
            });

            // console.log($mdTheming.defaultTheme());
            vm.map.setOptions({
                styles: DashboardService.mapsConfig.theme.dark
            });

            vm.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(document.getElementById('controls'));

            vm.showControls = true;
        }

        function __constructInitMarkers() {

            __initBounds = new google.maps.LatLngBounds();

            for (var i = 0; i < vm.markers.length; i++)
                vm.markers[i].setMap(null);

            vm.markers = [];

            for (var i = 0; i < vm.vehicleList.length; i++) {

                var vehicle = vm.vehicleList[i];
                var marker = new google.maps.Marker({
                    position: {
                        lat: vehicle.location.x,
                        lng: vehicle.location.y
                    },
                    map: vm.map,
                    icon: __carIcon
                });
                var infowindow = new google.maps.InfoWindow();

                vm.markers.push(marker);
                __markerVehicleIndexMap[vehicle.id] = {
                    markerIndex: i,
                    vehicleIndex: i
                }
                __initBounds.extend(marker.getPosition());

                google.maps.event.addListener(marker, 'click', (function (marker, vehicle) {
                    return function () {
                        //console.log(vehicle.id);
                        infowindow.setContent('<div style="color:grey">' + vehicle.id + '</div>');
                        infowindow.open(vm.map, marker);
                        $timeout(function () {
                            selectVehicle(vehicle, false);
                        });
                    }
                })(marker, vehicle));
            }

            // var markerCluster = new MarkerClusterer(vm.map, vm.markers, {
            //     imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
            // });

            vm.map.fitBounds(__initBounds);
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

                $stomp.send(__wsConfigInfo.appEndpoint, {}, {});

            });
        }

        function __onInitVehicleData(payloadData) {
            console.log(payloadData);
            vm.vehiclesLoading = false;
            vm.vehicleList = payloadData;
            __initDataSub.unsubscribe();
            __constructInitMarkers();
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

        function __onVehicleData(payload) {
            var vehicleData = payload;
            //update vehicleList
            vm.vehicleList[__markerVehicleIndexMap[vehicleData.id].vehicleIndex] = vehicleData;
            //update marker
            var marker = vm.markers[__markerVehicleIndexMap[vehicleData.id].markerIndex];

            var lastLocation = marker.getPosition();
            var nextLocation = new google.maps.LatLng(vehicleData.location.x, vehicleData.location.y);
            var icon = __carIcon;
            var heading = google.maps.geometry.spherical.computeHeading(lastLocation, nextLocation);
            icon.rotation = heading;

            marker.setIcon(icon);

            marker.animateTo(nextLocation);

            //update info window if required
            if (vm.selectedVehicle && vm.selectedVehicle.id == vehicleData.id) {
                vm.selectedVehicle = vehicleData;
                if (vm.followMarker)
                    vm.map.panTo(marker.getPosition());
            }

            //console.log("New vehicle data is:" + JSON.stringify(payload));
        }

        function selectVehicle(vehicle, triggerMarkerClick) {
            var triggerMarker = typeof triggerMarkerClick != 'undefined' ? triggerMarkerClick : true;
            vm.selectedVehicle = vehicle;
            var marker = vm.markers[__markerVehicleIndexMap[vehicle.id].markerIndex];
            vm.map.panTo(marker.getPosition());
            if (triggerMarker) {
                $timeout(function () {
                    new google.maps.event.trigger(marker, 'click');
                }, 500);
            }

        }

        function refineKey(key) {
            return key.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1")
            //"aABCeF == A ABC EF"
        }

        function refitInBounds() {
            vm.map.fitBounds(__initBounds);
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

        $scope.$on('navbarToggled', function () {
            console.log('navbar has been toggled.. resize map');
            $timeout(function () {
                new google.maps.event.trigger(vm.map, 'resize');
            }, 750);
        })

        $scope.$on('$destroy', function () {
            try {
                __wsConfigInfo.subscription.unsubscribe();
                $stomp.disconnect().then(function () {
                    $log.info('ws disconnected.')
                });
            } catch (e) {
                console.error(e);
            }
        });

        $timeout(function () {
            __init();
        }, 2000);
    }
}());