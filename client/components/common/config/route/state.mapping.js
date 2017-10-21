(function () {
    'use strict';

    angular
        .module('fleet')
        .service('StateMappingProvider', Service);

    Service.$inject = ['OemTypeResolver', 'OEM_TYPES'];

    /* @ngInject */
    function Service(OemTypeResolver, OEM_TYPES) {
        //////////////////////////////////////////////////////////declarations///////////////////////////////////////

        this.getOemTypeResolvedStates = getOemTypeResolvedStates;

        /////////////////////////////////////////////////////////functions////////////////////////////////////////////

        function getOemTypeResolvedStates(forState) {
            var map = OemTypeResolver.getStateConfig();
            return map[forState];
        }

    }
})();