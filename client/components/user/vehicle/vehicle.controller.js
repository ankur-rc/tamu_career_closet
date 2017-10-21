(function () {
    'use strict';

    angular.module('fleet')
        .controller('VehicleController', controller);

    controller.$inject = ['$scope', '$mdToast', '$mdDialog', '$state', 'vehicles', '$timeout'];

    /*@ngInject */
    function controller($scope, $mdToast, $mdDialog, $state, vehicles, $timeout) {

        $scope.vehicles = [];
        $scope.vehicle = {};
        $scope.viewLoaded = false;

        //functions
        //$scope.getDrivers = getDrivers;
        $scope.showDetails = showDetails;
        $scope.deleteVehicle = deleteVehicle;
        $scope.back = back;
        $scope.editVehicle = editVehicle;
        this.convertDtoToModel = convertDtoToModel;


        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        function convertDtoToModel(vehicleDto) {
            var vehicleModel = new Object();

            vehicleModel = {
                carrierName: vehicleDto.vehicleInsurance.carrierName,
                policyNumber: vehicleDto.vehicleInsurance.policyNo,
                registrationRenewalDate: new Date(vehicleDto.registrationRenewalDate),
                startDate: new Date(vehicleDto.vehicleInsurance.startDate),
                renewalDate: new Date(vehicleDto.vehicleInsurance.renewalDate),
                vin: vehicleDto.vehicleMetaData.id,
                clearanceHeight: vehicleDto.vehicleMetaData.clearanceHeight,
                odometer: vehicleDto.vehicleMetaData.initialOdometer,
                loadCapacity: vehicleDto.vehicleMetaData.loadCapacity,
                make: vehicleDto.vehicleMetaData.make,
                model: vehicleDto.vehicleMetaData.model,
                statedEconomy: vehicleDto.vehicleMetaData.mpg,
                maxPassengerCount: vehicleDto.vehicleMetaData.seats,
                fuelCapacity: vehicleDto.vehicleMetaData.tankCapacity,
                vehicleClass: vehicleDto.vehicleMetaData.vclass,
                chassisNo: vehicleDto.chassisNo,
                fuelType: vehicleDto.fuelType,
                lastRegistrationDate: new Date(vehicleDto.registrationDate),
                status: vehicleDto.status,
                monthFuelEconomy: vehicleDto.monthFuelEconomy,
                lifeFuelEconomy: vehicleDto.lifeFuelEconomy
            }
            return vehicleModel;
        }

        (function () {
            for (var i = 0; i < vehicles.length; i++) {
                $scope.vehicles[i] = convertDtoToModel(vehicles[i]);
            }
        })();

        function getVehicles() {

            VehicleService.getVehicles().then(function (response) {
                    if (response.data.success === true) {
                        $scope.vehicles = response.data.response;
                    } else {
                        $mdToast.show($mdToast.simple()
                            .textContent(response.data.msg ? response.data.msg : "Could not get list of vehicles.")
                            .position("bottom right").parent(document.body));
                    }
                },
                function (error) {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Server error ocurred!")
                        .position("bottom right").parent(document.body));
                });
        }

        function deleteVehicle($event, id) {
            $mdDialog.show({
                fullscreen: true,
                targetEvent: $event,
                template: '<md-dialog flex flex-gt-md="40">' +
                    '  <md-toolbar layout="row" layout-align="center center">Terms and Conditions</md-toolbar>' +
                    '  <md-dialog-content layout-padding>' +
                    '          <div layout="column" layout-align="center center">Are you sure you want to delete the vehicle?</div>' +
                    '  </md-dialog-content>' +
                    '  <md-dialog-actions>' +
                    '    <md-button ng-click="deleteVehicle()" class="md-accent md-raised">' +
                    '      Yes' +
                    '    </md-button>' +
                    '    <md-button ng-click="closeDialog()" class="md-primary">' +
                    '      Cancel' +
                    '    </md-button>' +
                    '  </md-dialog-actions>' +
                    '</md-dialog>',
                controller: ['$scope', '$mdDialog', '$timeout', 'vehicleID', 'VehicleService', function Controller($scope, $mdDialog, $timeout, vehicleID, VehicleService) {

                    $scope.vehicleID = vehicleID;
                    $scope.closeDialog = function () {
                        $mdDialog.hide();
                    };
                    $scope.deleteVehicle = function () {
                        VehicleService.deleteVehicle($scope.vehicleID).then(function (response) {
                            if (!response.data.success) {
                                $mdToast.show($mdToast.simple()
                                    .textContent(response.data.msg ? response.data.msg : "Vehicle deletion failed!")
                                    .position("bottom right").parent(document.body));
                                $mdDialog.hide();
                            } else {
                                $mdToast.show($mdToast.simple()
                                    .textContent(response.data.msg ? response.data.msg : "Vehicle deleted successfully!")
                                    .position("bottom right").parent(document.body));
                                $mdDialog.hide();
                                $state.reload();
                            }
                        });
                        $mdDialog.hide();
                    }
                    }],
                locals: {
                    vehicleID: id
                }
            });
        }

        function editVehicle($event, vehicle) {
            $state.go('main.vehicle.edit', {
                vehicle: vehicle
            });
        }

        function showDetails(id) {
            var id = "#" + id;
            var $ripple = $(id + ".ripple")
            var $layer = $(id + ".layered-content");
            $ripple.addClass("rippling");
            var $buttonWrapper = $(id + ".button-wrapper");
            $buttonWrapper.addClass("clicked")

            setTimeout(function () {
                $layer.addClass("active");
            }, 1600);

        };

        function back(id) {
            var id = "#" + id;
            var $ripple = $(id + ".ripple"),
                $buttonWrapper = $(id + ".button-wrapper"),
                $layer = $(id + ".layered-content");
            $buttonWrapper.removeClass("clicked");
            $ripple.removeClass("rippling");
            $layer.removeClass("active");
        };

        function staggerAnimateIntro() {
            var infoCards = angular.element(document.getElementsByClassName("card-container"));
            TweenMax.staggerFrom(infoCards, 0.8, {
                scale: 0.7,
                opacity: 0,
                delay: 0.5,
                ease: Power2.easeInOut,
                force3D: true
            }, 0.2);
        }

        $timeout(function () {
            $scope.viewLoaded = true;
            staggerAnimateIntro();
        }, 500);

    }

})();
