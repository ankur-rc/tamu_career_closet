(function () {
    'use strict';

    angular.module('fleet')
        .controller('AddCargoController', controller);

    controller.$inject = ['$scope', '$mdToast', '$mdDialog', '$mdStepper', '$state', 'CargoService'];

    /*@ngInject */
    function controller($scope, $mdToast, $mdDialog, $mdStepper, $state, CargoService) {

        $scope.cargo = {};
        $scope.addCargo = addCargo;
        $scope.previousStep = previousStep;
        $scope.nextStep = nextStep;
        $scope.convertCamelCase = convertCamelCase;

        function addCargo() {

            $scope.cargo.startLat = $scope.cargo.startLocation.latitude;
            $scope.cargo.startLong = $scope.cargo.startLocation.longitude;
            $scope.cargo.endLat = $scope.cargo.endLocation.latitude;
            $scope.cargo.endLong = $scope.cargo.endLocation.longitude;
            $scope.cargo.startAddress = $scope.cargo.startLocation.name;
            $scope.cargo.endAddress = $scope.cargo.endLocation.name;
            delete $scope.cargo.startLocation;
            delete $scope.cargo.endLocation;
            CargoService.addCargo($scope.cargo).then(function (response) {
                if (response.data.success === true) {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "New cargo added successfully!")
                        .position("bottom right").parent(document.body));
                    $state.go("main.cargo.view");
                } else {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Could not add new cargo.")
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
