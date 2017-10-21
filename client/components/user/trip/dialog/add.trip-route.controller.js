(function () {
    'use strict';

    angular
        .module('fleet')
        .controller('AddTripRoutesController', Controller);

    Controller.$inject = ['$scope', '$mdDialog', '$timeout', 'RouteService', 'DriverService', 'routes', 'drivers'];

    /* @ngInject */
    function Controller($scope, $mdDialog, $timeout, RouteService, DriverService, routes, drivers) {
        $scope.routes = [];
        $scope.drivers = [];
        $scope.selectedDrivers = drivers;
        $scope.selectedRoutes = routes;

        $scope.getRoutes = getRoutes;
        $scope.getDrivers = getDrivers;
        $scope.addRoute = addRoute;
        $scope.addDriver = addDriver;
        $scope.removeRoute = removeRoute;
        $scope.removeDriver = removeDriver;

        function getRoutes() {
            RouteService.getScheduledRoutes().then(function(response){
                if(response.data.success)
                    $scope.routes = response.data.response;
            });
        }

        function getDrivers() {
            DriverService.getAllActivatedDrivers().then(function(response){
                if(response.data.success)
                    $scope.drivers = response.data.response;
            });
        }

        function addRoute(route) {
            $scope.selectedRoutes.push(route);
        }

        function addDriver(driver) {
            $scope.selectedDrivers.push(driver);
            $scope.a = undefined;
        }

        function removeRoute(route) {
            var idx = $scope.selectedRoutes.indexOf(route);
            $scope.selectedRoutes.splice(idx,1);
        }

        function removeDriver(driver) {
            var idx = $scope.selectedDrivers.indexOf(driver);
            $scope.selectedDrivers.splice(idx,1);
        }

        $scope.closeDialog = function () {
            $mdDialog.hide();
        };

        $scope.saveRoutes = function () {
            $mdDialog.hide({
                routes: $scope.selectedRoutes,
                drivers: $scope.selectedDrivers,
                success: $scope.selectedDrivers.length === $scope.selectedRoutes.length
            });
        }

        //Get list of routes and drivers
        $scope.getRoutes();
        $scope.getDrivers();

    }
})();

