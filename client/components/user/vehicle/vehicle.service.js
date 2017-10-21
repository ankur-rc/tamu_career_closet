(function () {
    'use strict';

    angular
        .module('fleet')
        .service('VehicleService', Service);

    Service.$inject = ['$http', 'API'];

    /* @ngInject */
    function Service($http, API) {

        ////////////////////////////////////declarations//////////////////////////////////////////////////////////

        this.getVehicles = getVehicles;
        this.addVehicle = addVehicle;
        this.editVehicle = editVehicle;
        this.deleteVehicle = deleteVehicle;
        this.getActiveVehicles = getActiveVehicles;
        this.getVehicleTypes = getVehicleTypes;
        ////////////////////////////////////definitions///////////////////////////////////////////////////////////

        function getVehicles() {
            return $http({
                url: API + 'vehicle/getAll',
                method: 'GET'
            });
        }

        function addVehicle(vehicle) {
            return $http({
                url: API + "/vehicle/add",
                method: 'POST',
                data: vehicle
            })
        }

        function editVehicle(vehicle) {
            return $http({
                url: API + "/vehicle/update",
                method: 'PUT',
                data: vehicle
            })
        }

        function deleteVehicle(vehicleID) {
            return $http({
                url: API + 'vehicle/delete/' + vehicleID,
                method: 'PUT'
            });
        }

        function getActiveVehicles() {
            return $http({
                url: API + 'vehicle/getAllActiveVehicles',
                method: 'GET'
            });
        }

        function getVehicleTypes() {
            return $http({
                url: API + 'vehicleType/getAll',
                method: 'GET'
            });
        }
    }
})();
