(function () {
    'use strict';

    angular
        .module('fleet')
        .service('RouteService', Service);

    Service.$inject = ['$http', '$httpParamSerializerJQLike', 'API'];

    /* @ngInject */
    function Service($http, $httpParamSerializerJQLike, API) {

        ////////////////////////////////////declarations//////////////////////////////////////////////////////////

        this.createRoute = createRoute;
        this.updateRoute = updateRoute;
        this.getRoutes = getRoutes;
        this.deleteRoute = deleteRoute;
        this.getScheduledRoutes = getScheduledRoutes;

        ////////////////////////////////////definitions///////////////////////////////////////////////////////////        
 
        function createRoute(route) {
            return $http({
                url: API + "/route/add",
                method: 'POST',
                data: route
            })
        };

        function updateRoute(route) {
            return $http({
                url: API + "/route/update",
                method: 'POST',
                data: route
            })
        };

        function getRoutes() {
            return $http({
                url: API + 'route/getAll',
                method: 'GET'
            });
        }

        function deleteRoute(id) {
            return $http({
                url: API + 'route/delete/'+id,
                method: 'PUT'
            })
        }

        function getScheduledRoutes() {
            return $http({
                url: API + 'route/getAllScheduled',
                method: 'GET'
            })
        }

        
    }
})();