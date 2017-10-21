(function () {
    'use strict';

    angular
        .module('fleet')
        .service('DriverService', Service);

    Service.$inject = ['$http', '$httpParamSerializerJQLike', 'API', 'ProfileAvatars'];

    /* @ngInject */
    function Service($http, $httpParamSerializerJQLike, API, ProfileAvatars) {

        ////////////////////////////////////declarations//////////////////////////////////////////////////////////

        this.getDrivers = getDrivers;
        this.addDriver = addDriver;
        this.updateDriver = updateDriver;
        this.deleteDriver = deleteDriver;
        this.getAllActivatedDrivers = getAllActivatedDrivers;

        ////////////////////////////////////definitions///////////////////////////////////////////////////////////

        function getDrivers() {
            return $http({
                url: API + 'driver/getAll',
                method: 'GET'
            });
        }
 
        function addDriver(driver) {
            return $http({
                url: API + "/driver/save",
                method: 'POST',
                data: driver
            })
        };

        function updateDriver(driver) {
            return $http({
                url: API + "/driver/update",
                method: 'POST',
                data: driver
            })
        };

        function deleteDriver(driverID) {
            return $http({
                url: API + 'driver/delete/'+driverID,
                method: 'GET'
            });
        }

        function getAllActivatedDrivers() {
            return $http({
                url: API + 'driver/getAllActivatedDrivers',
                method: 'GET'
            });
        }
        
    }
})();