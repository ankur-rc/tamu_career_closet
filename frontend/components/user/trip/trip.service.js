(function () {
    'use strict';

    angular
        .module('fleet')
        .service('TripService', Service);

    Service.$inject = ['$http', '$httpParamSerializerJQLike', 'API'];

    /* @ngInject */
    function Service($http, $httpParamSerializerJQLike, API) {

        ////////////////////////////////////declarations//////////////////////////////////////////////////////////

        this.createTrip = createTrip;
        this.updateTrip = updateTrip;
        this.getTrips = getTrips;
        this.deleteTrip = deleteTrip;
        this.updateTrip = updateTrip;

        ////////////////////////////////////definitions///////////////////////////////////////////////////////////        
 
        function createTrip(trip) {
            return $http({
                url: API + "/trip/add",
                method: 'POST',
                data: trip
            })
        };

        function updateTrip(trip) {
            return $http({
                url: API + "/trip/update",
                method: 'POST',
                data: trip
            })
        };

        function getTrips() {
            return $http({
                url: API + 'trip/getAllTrips/',
                method: 'GET'
            });
        }

        function deleteTrip(id) {
            return $http({
                url: API + 'trip/delete/'+id,
                method: 'DELETE'
            })
        }

        function updateTrip(trip) {
            return $http({
                url: API + "/trip/update",
                method: 'PUT',
                data: trip
            })
        }
        
    }
})();