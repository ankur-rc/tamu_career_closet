(function () {
    'use strict';

    angular
        .module('fleet')
        .service('CargoService', Service);

    Service.$inject = ['$http', 'API'];

    /* @ngInject */
    function Service($http, API) {

        ////////////////////////////////////declarations//////////////////////////////////////////////////////////

        this.getCargoes = getCargoes;
        this.getOrphanCargos = getOrphanCargos;
        this.addCargo = addCargo;
        this.editCargo = editCargo;
        this.deleteCargo = deleteCargo;
        ////////////////////////////////////definitions///////////////////////////////////////////////////////////

        function getCargoes() {
            return $http({
                url: API + 'cargo/getAll',
                method: 'GET'
            });
        }

        function getOrphanCargos() {
            return $http({
                url: API + 'cargo/getOrphanCargos',
                method: 'GET'
            });
        }

        function addCargo(cargo) {
            return $http({
                url: API + "/cargo/save",
                method: 'POST',
                data: cargo
            })
        }

        function editCargo(cargo) {
            return $http({
                url: API + "/cargo/update",
                method: 'PUT',
                data: cargo
            })
        }

        function deleteCargo(cargoID) {
            return $http({
                url: API + 'cargo/deleteCargo/' + cargoID,
                method: 'PUT'
            });
        }
    }
})();
