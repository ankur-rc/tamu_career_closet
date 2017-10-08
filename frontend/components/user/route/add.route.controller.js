(function() {
    'use strict';

    angular.module('fleet')
        .controller('AddRouteController', controller)

    controller.$inject = ['$scope', '$stateParams', '$state','$mdToast', 'RouteService', 'CargoService'];

    /*@ngInject*/
    function controller($scope, $stateParams, $state, $mdToast, RouteService, CargoService) {

        //////////////////////variables///////////////////////////
        $scope.route = {};
        $scope.cargos = [];
        $scope.title = $stateParams.title;
        $scope.searchTerm;

        ///////////////////////////functions////////////////////////////
        $scope.getCargos = getCargos;
        $scope.saveRoute = saveRoute;
        $scope.clearSearchTerm = clearSearchTerm;

        ////////////////////////////////////////
        function getCargos() {
            CargoService.getOrphanCargos().then(function(response){
                if(response.data.success)
                    $scope.cargos = response.data.response;
            });
        }

        function saveRoute() {
            var newRoute = {
                name: $scope.route.name,
                startLat: $scope.route.startLocation.latitude,
                startLong: $scope.route.startLocation.longitude,
                startAddress: $scope.route.startLocation.name,
                endLat: $scope.route.endLocation.latitude,
                endLong: $scope.route.startLocation.longitude,
                endAddress: $scope.route.endLocation.name,
                startTime: new Date($scope.route.startTime).getTime()/1000,
                eta: new Date($scope.route.eta).getTime()/1000,
                status:"created",
                cargos: $scope.selectedCargos
            }
            RouteService.createRoute(newRoute).then(function(response){
                if (response.data.success) {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "New route created successfully!")
                        .position("bottom right").parent(document.body));
                    $state.go('main.route.view');
                } else {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Could not create route.")
                        .position("bottom right").parent(document.body));
                }
            });
        }

        function clearSearchTerm() {
            $scope.searchTerm = '';
        }

    }


}());