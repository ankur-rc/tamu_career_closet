(function () {
    'use strict';
    angular
        .module('cc')
        .factory('AuthInterceptor', factory);

    factory.$inject = ['API', 'AuthService', '$location', '$rootScope', '$q'];

    /* @ngInject */
    function factory(API, AuthService, $location, $rootScope, $q) {

        /////////////////////////////////////////////declarations////////////////////////////////////////////////////

        var interceptor = {
            request: request,
            response: response,
            responseError: responseError,
            requestError: requestError
        };

        return interceptor;

        //////////////////////////////////////////////////////functions///////////////////////////////////////////////


        //Automatically attach token header
        function request(config) {
            var token = AuthService.getToken();
            if (config.url.indexOf(API) === 0 && token) {
                // config.headers.Authorization = 'Bearer ' + token;
                config.headers.Authorization = 'Bearer ' + token;
                
            }

            return config;
        };

        //Save token, if present in header
        function response(res) {
            if (res.config.url.indexOf(API) === 0 && res.data.auth_token) {
                AuthService.saveToken(res.data.auth_token);
            }

            return res;
        };

        function responseError(response) {
            if (response.status == 401) {
                // $rootScope.$broadcast("error", {
                //     msg: response.data.msg ? response.data.msg : "Authentication error."
                // });
                // $location.path("/#/login");
                //publish global error message
            } else if (response.status == -1) {
                $rootScope.$broadcast("error", {
                    msg: "Server not reachable."
                });
            }
            //else if (response.status >= 400 && response.status < 500) {

            //     //publish global error message
            //     $rootScope.$broadcast("error", {
            //         msg: "Error occured: " + response.status
            //     });
            // }
            else if (response.status >= 500) {

                //publish global error message
                $rootScope.$broadcast("error", {
                    msg: "Server error occured: " + response.status
                });
            }

            return response;
        };

        function requestError(config) {
            console.log("request error:");
            console.log(config);
        };

    }


})();