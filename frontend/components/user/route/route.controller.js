(function() {
    'use strict';

    angular.module('fleet')
        .controller('RouteController', controller)

    controller.$inject = ['$scope', '$mdToast', 'routes', 'RouteService'];

    /*@ngInject*/
    function controller($scope, $mdToast, routes, RouteService) {

        //////////////////////variables///////////////////////////
        $scope.routes = routes;

        ///////////////////////////functions////////////////////////////
        $scope.deleteRoute = deleteRoute;

        ////////////////////////////////////////
        function deleteRoute(id) {
            RouteService.deleteRoute(id).then(function(response){
                if(response.data.success) {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Route deleted successfully!")
                        .position("bottom right").parent(document.body));
                } else {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Could not delete route.")
                        .position("bottom right").parent(document.body));
                }
                
            })
        }
        

    }


}());