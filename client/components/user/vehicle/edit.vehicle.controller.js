(function () {
    'use strict';

    angular.module('fleet')
        .controller('EditVehicleController', controller);

    controller.$inject = ['$scope', '$mdToast', '$mdDialog', '$mdStepper', '$state', '$stateParams', 'VehicleService'];

    /*@ngInject */
    function controller($scope, $mdToast, $mdDialog, $mdStepper, $state, $stateParams, VehicleService) {

        $scope.isEditVehicle = true;

        //functions
        $scope.editVehicle = editVehicle;
        $scope.previousStep = previousStep;
        $scope.nextStep = nextStep;
        $scope.convertCamelCase = convertCamelCase;
        $scope.vehicle = $stateParams.vehicle;
        this.convertModelToDto = convertModelToDto;
        var vehicleModel = {},
            vehicleDto = {};

        function convertModelToDto(vehicleModel) {
            vehicleDto = {
                "insuranceDTO": {
                    "carrierName": vehicleModel.carrierName,
                    "policyNumber": vehicleModel.policyNumber,
                    "renewalDate": vehicleModel.renewalDate ? (vehicleModel.renewalDate.getTime() / 1000) : undefined,
                    "startDate": vehicleModel.startDate ? (vehicleModel.startDate.getTime() / 1000) : undefined,
                    "vehicleId": vehicleModel.vin
                },
                "metadataDTO": {
                    "clearanceHeight": vehicleModel.clearanceHeight,
                    "initialOdometer": vehicleModel.odometer,
                    "loadCapacity": vehicleModel.loadCapacity,
                    "make": vehicleModel.make,
                    "model": vehicleModel.model,
                    "mpg": vehicleModel.statedEconomy,
                    "seats": vehicleModel.maxPassengerCount,
                    "tankCapacity": vehicleModel.fuelCapacity,
                    "vclass": vehicleModel.vehicleClass,
                    "vehicleId": vehicleModel.vin
                },
                "primaryDTO": {
                    "chassisNo": vehicleModel.chassisNo,
                    "fuelType": vehicleModel.fuelType,
                    "id": vehicleModel.vin,
                    "registrationDate": vehicleModel.lastRegistrationDate ? (vehicleModel.lastRegistrationDate.getTime() / 1000) : undefined,
                    "status": vehicleModel.status
                }
            };
            return vehicleDto;
        }

        function editVehicle() {
            vehicleDto = convertModelToDto($scope.vehicle);
            VehicleService.editVehicle(vehicleDto).then(function (response) {
                if (response.data.success === true) {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Vehicle updated successfully!")
                        .position("bottom right").parent(document.body));
                    $state.go("main.vehicle.view");
                } else {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Could not update vehicle.")
                        .position("bottom right").parent(document.body));
                }
            }, function (error) {

            });
        }

        function previousStep() {
            var steppers = $mdStepper('stepper-demo');
            steppers.back();
        }

        function nextStep() {
            var steppers = $mdStepper('stepper-demo');
            steppers.next();
        }

        function convertCamelCase(text) {
            var result = text.replace(/([A-Z])/g, " $1");
            return result.charAt(0).toUpperCase() + result.slice(1);
        }

    }

})();
