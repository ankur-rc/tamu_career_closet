(function () {
    'use strict';

    angular.module('fleet').run(runFn);

    runFn.$inject = ['grant', 'UtilityService', 'ROLES'];

    /* @ngInject */
    function runFn(grant, UtilityService, ROLES) {

        grant.addTest('isAuthed', function () {
            return UtilityService.isAuthed();
        });

        grant.addTest('isAdmin', function () {
            return UtilityService.getUserRole() === ROLES.ADMIN;;
        });

        grant.addTest('isNotAdmin', function () {
            return UtilityService.getUserRole() !== ROLES.ADMIN;
        })
    }

})();