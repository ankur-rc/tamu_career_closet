(function() {
    'use strict';

    angular.module('fleet')
        .controller('TripController', controller)

    controller.$inject = ['$scope', '$mdToast', '$mdDialog', 'trips', 'TripService'];

    /*@ngInject*/
    function controller($scope, $mdToast, $mdDialog, trips, TripService) {

        //////////////////////variables///////////////////////////
        $scope.trips = trips;

        ///////////////////////////functions////////////////////////////
        $scope.deleteTrip = deleteTrip;
        $scope.viewTrip = viewTrip;
        $scope.editTrip = editTrip;
        $scope.getTrips = getTrips;

        ////////////////////////////////////////
        function deleteTrip(id) {
            TripService.deleteTrip(id).then(function(response){
                if(response.data.success) {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Trip deleted successfully!")
                        .position("bottom right").parent(document.body));
                    $scope.getTrips();
                } else {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Could not delete trip.")
                        .position("bottom right").parent(document.body));
                }
                
            })
        }

        function viewTrip(trip,$event) {
            $mdDialog.show({
                    fullscreen: true,
                    targetEvent: $event,
                    parent: angular.element(document.body),
                    templateUrl: 'components/user/trip/dialog/view.trip.html',
                    controller: "ViewTripController",
                    locals: {
                        trip: trip
                    }
                })
        }

        function editTrip(trip,$event) {
            $mdDialog.show({
                    fullscreen: true,
                    targetEvent: $event,
                    templateUrl: 'components/user/trip/dialog/edit.trip.html',
                    controller: ['$scope', '$mdDialog', '$timeout', 'trip' ,'TripService', function Controller($scope, $mdDialog, $timeout, trip, TripService) {
                        $scope.trip = trip;
                        var list = [];
                        if($scope.trip.avoidHighways == 'Y')
                            list.push("Avoid Highways");
                        if($scope.trip.avoidTolls == 'Y')
                            list.push("Avoid Tolls");

                        $scope.closeDialog = function () {
                            $mdDialog.hide();
                        };

                        $scope.toggle = function(item) {
                            var idx = list.indexOf(item);
                            if (idx > -1) {
                                list.splice(idx, 1);
                            }
                            else {
                                list.push(item);
                            }
                        };

                        $scope.exists = function(item) {
                            return list.indexOf(item) > -1;
                        };

                        $scope.updateTrip = function () {
                            var updatedTrip = {
                                id: $scope.trip.id,
                                name: $scope.trip.name,
                                owner: $scope.trip.owner,
                                vehicleId: $scope.trip.vehicleBean.id,
                                startLat: $scope.trip.startAddress.latitude || $scope.trip.startLat,
                                startLong: $scope.trip.startAddress.longitude || $scope.trip.startLon,
                                startAddress: $scope.trip.startAddress.name || $scope.trip.startAddress,
                                endLat: $scope.trip.endAddress.latitude || $scope.trip.endLat,
                                endLong: $scope.trip.endAddress.longitude || $scope.trip.endLon,
                                endAddress: $scope.trip.endAddress.name || $scope.trip.endAddress,
                                startTime: new Date($scope.trip.startTime).getTime()/1000,
                                endTime: new Date($scope.trip.endTime).getTime()/1000,
                                status: $scope.trip.status,
                                avoidHighways: $scope.exists('Avoid Highways') ? "Y" : "N",
                                avoidTolls: $scope.exists('Avoid Tolls') ? "Y" : "N",
                                routes: $scope.trip.routeDriverMapping
                            }
                            TripService.updateTrip(updatedTrip).then(function (response) {
                                if (!response.data.success) {
                                    $mdToast.show($mdToast.simple()
                                        .textContent(response.data.msg ? response.data.msg : "Trip updation failed!")
                                        .position("bottom right").parent(document.body));
                                    $mdDialog.hide();
                                } else {
                                    $mdToast.show($mdToast.simple()
                                        .textContent(response.data.msg ? response.data.msg : "Trip updated successfully!")
                                        .position("bottom right").parent(document.body));
                                    $mdDialog.hide();
                                }
                            });
                            $mdDialog.hide();
                        }
                    }],
                    locals: {
                        trip: trip
                    }
                }).then(function() {
                    $scope.getTrips();
                })
        }

        function getTrips() {
            TripService.getTrips().then(function(response){
                if(response.data.success) {
                    $scope.trips = response.data.response;
                } 
            })
        }
        
        $scope.query = {
            order: 'name',
            limit: 5,
            page: 1
        };
    }


}());