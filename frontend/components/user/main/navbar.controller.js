(function () {

    var app = angular.module('fleet').controller('navbar.controller', controller);

    controller.$inject = ['$rootScope', 'RoutePermissionsProvider', 'AuthService'];

    /* @ngInject */
    function controller($rootScope, RoutePermissionsProvider, AuthService) {

        var vm = this;
        vm.links = [];

        $rootScope.$on('loginSuccessful', function (event, args) {
            vm.links = RoutePermissionsProvider.generatePermissibleRoutes(args.role);
        });

        (function () {
            var isAuthed = AuthService.isAuthed();
            if (isAuthed) {
                var token = AuthService.getToken();
                if (token) {
                    var params = AuthService.parseJwt(token);
                    vm.links = RoutePermissionsProvider.generatePermissibleRoutes(params.role);
                }
            }
        })();

    }

}());