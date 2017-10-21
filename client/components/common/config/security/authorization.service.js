(function () {
    'use strict';

    angular
        .module('fleet')
        .service('AuthService', Service);

    Service.$inject = ['$window'];

    /* @ngInject */
    function Service($window) {

        // JWT functions follow

        ////////////////////////////////////declarations//////////////////////////////////////////////////////////

        this.parseJwt = parseJwt;
        this.saveToken = saveToken;
        this.getToken = getToken;
        this.isAuthed = isAuthed;
        this.logout = logout;

        ////////////////////////////////////definitions////////////////////////////////////////////////////////////

        function parseJwt(token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
        };

        function saveToken(token) {
            $window.localStorage['fleet.token'] = token;
        };

        function getToken() {
            return $window.localStorage['fleet.token'];
        };

        function isAuthed() {
            var token = this.getToken();
            if (token) {
                var params = this.parseJwt(token);
                return (Math.round(new Date().getTime() / 1000) <= params.exp);
            }
        };

        function logout() {
            $window.localStorage.removeItem('fleet.token');
        };
    }
})();
