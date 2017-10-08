(function() {
    'use strict';

    angular.module('fleet')
        .controller('EditRouteController', controller)

    controller.$inject = ['$scope', '$stateParams', 'RouteService', 'CargoService'];

    /*@ngInject*/
    function controller($scope, $stateParams, RouteService, CargoService) {

        //////////////////////variables///////////////////////////
        $scope.route = $stateParams.route;
        $scope.cargos = [];
        $scope.title = $stateParams.title;

        ///////////////////////////functions////////////////////////////
        $scope.getCargos = getCargos;
        $scope.saveRoute = saveRoute;

        ////////////////////////////////////////
        function getCargos() {
            CargoService.getOrphanCargos().then(function(response){
                if(response.data.success)
                    $scope.cargos = response.data.response;
            });
        }

        function saveRoute() {
            //If more cargos selected, then add to the original list
            for(var i=0; i<$scope.route.cargos.length; i++) {
                $scope.selectedCargos.push($scope.route.cargos[i].id);
            }
            var newRoute = {
                name: $scope.route.name,
                startLat: $scope.route.startLocation.latitude || $scope.route.startLat,
                startLong: $scope.route.startLocation.longitude || $scope.route.startLong,
                startAddress: $scope.route.startLocation.name || $scope.route.startLocation,
                endLat: $scope.route.endLocation.latitude || $scope.route.endLat,
                endLong: $scope.route.startLocation.longitude || $scope.route.endLong,
                endAddress: $scope.route.endLocation.name || $scope.route.endLocation,
                startTime: new Date($scope.route.startTime).getTime()/1000,
                eta: new Date($scope.route.eta).getTime()/1000,
                status:"created",
                cargos: $scope.selectedCargos
            }
            RouteService.updateRoute(newRoute).then(function(response){
                if (response.data.success) {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Route updated successfully!")
                        .position("bottom right").parent(document.body));
                    $state.go('main.driver.view');
                } else {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Could not update route.")
                        .position("bottom right").parent(document.body));
                }
            });
        }

        function initialize() {
            $scope.route.startLocation = $scope.route.startAddress;
            $scope.route.endLocation = $scope.route.endAddress;
            $scope.route.startTime = new Date($scope.route.startTime);
            $scope.route.eta = new Date($scope.route.eta);
        }

        initialize();

    }


}());