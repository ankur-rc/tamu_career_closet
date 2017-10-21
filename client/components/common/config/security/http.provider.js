(function () {

    angular.module('fleet').config(configuration)

    configuration.$inject = ['$httpProvider'];

    /* @ngInject */
    function configuration($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptor');
    }

})();