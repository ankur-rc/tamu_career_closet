(function () {
    'use strict';

    angular.module('fleet')
        .controller('EditCargoController', controller);

    controller.$inject = ['$scope', '$mdToast', '$mdDialog', '$mdStepper', '$state', '$stateParams', 'CargoService', '$q', 'routes'];

    /*@ngInject */
    function controller($scope, $mdToast, $mdDialog, $mdStepper, $state, $stateParams, CargoService, $q, routes) {

        $scope.isEditCargo = true;

        $scope.editCargo = editCargo;
        $scope.previousStep = previousStep;
        $scope.nextStep = nextStep;
        $scope.convertCamelCase = convertCamelCase;
        $scope.cargo = $stateParams.cargo;
        $scope.routeList = [];
        $scope.cargo.selectedRoute = {
            id: $scope.cargo.routeId,
            name: $scope.cargo.routeName
        };

        function initializeRouteList() {
            for (var i = 0; i < routes.length; i++) {
                $scope.routeList[i] = {
                    id: routes[i].id,
                    name: routes[i].name
                };
            }
        }

        (function () {
            initializeRouteList();
            $scope.cargo.startLocation = $scope.cargo.startAddress;
            $scope.cargo.endLocation = $scope.cargo.endAddress;
        })();

        function editCargo() {
            $scope.cargo.routeId = $scope.cargo.selectedRoute.id;
            $scope.cargo.routeName = $scope.cargo.selectedRoute.name;
            $scope.cargo.startLat = $scope.cargo.startLocation.latitude;
            $scope.cargo.startLong = $scope.cargo.startLocation.longitude;
            $scope.cargo.endLat = $scope.cargo.endLocation.latitude;
            $scope.cargo.endLong = $scope.cargo.endLocation.longitude;
            $scope.cargo.startAddress = $scope.cargo.startLocation.name;
            $scope.cargo.endAddress = $scope.cargo.endLocation.name;
            delete $scope.cargo.startLocation;
            delete $scope.cargo.endLocation;
            delete $scope.cargo.destAddress;
            CargoService.editCargo($scope.cargo).then(function (response) {
                if (response.data.success === true) {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Cargo updated successfully!")
                        .position("bottom right").parent(document.body));
                    $state.go("main.cargo.view");
                } else {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Could not update cargo.")
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
