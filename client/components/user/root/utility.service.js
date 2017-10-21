(function () {
    'use strict';

    angular.module('fleet')
        .service('UtilityService', service)

    service.$inject = ['$state', 'AuthService'];

    /*@ngInject*/
    function service($state, AuthService) {

        this.toggleFullscreen = toggleFullscreen;
        this.refreshPage = refreshPage;
        this.isAuthed = isAuthed;
        this.getUsername = getUsername;
        this.getUserRole = getUserRole;
        this.getUserId = getUserId;
        this.getOemName = getOemName;
        this.getOemId = getOemId;
        this.getOemType = getOemType;

        //////////////////////////////////////////////////////////////////////////////////

        function refreshPage() {
            $state.reload($state.current);
            // $state.go($state.current, {}, {
            //     reload: $state.$current
            // });
        }

        function toggleFullscreen() {
            if (!document.fullscreenElement && // alternative standard method
                !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) { // current working methods
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        }

        function isAuthed() {
            return AuthService.isAuthed();
        }

        function getUsername() {
            var token = AuthService.getToken();
            if (token) {
                var params = AuthService.parseJwt(token);
                // $scope.user.name = params.username;

                return params.username;
            }
        }

        function getUserRole() {
            var token = AuthService.getToken();
            if (token) {
                var params = AuthService.parseJwt(token);
                //console.log(params.role);
                return params.role;
            }
        }

        function getUserId() {
            var token = AuthService.getToken();
            if (token) {
                var params = AuthService.parseJwt(token);
                return params.userId;
            }
        }

        function getOemName() {
            var token = AuthService.getToken();
            if (token) {
                var params = AuthService.parseJwt(token);
                return params.oemName;
            }
        }

        function getOemId() {
            var token = AuthService.getToken();
            if (token) {
                var params = AuthService.parseJwt(token);
                return params.oemId;
            }
        }

        function getOemType() {
            var token = AuthService.getToken();
            if (token) {
                var params = AuthService.parseJwt(token);
                return params.oemClassification;
            }
        }
    }

})();