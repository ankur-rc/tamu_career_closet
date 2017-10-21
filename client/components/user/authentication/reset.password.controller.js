(function () {
    'use strict';

    angular
        .module('fleet')
        .controller('ResetPasswordController', Controller);

    Controller.$inject = ['$state', '$timeout', '$mdToast', '$stateParams', 'UserService'];

    /* @ngInject */
    function Controller($state, $timeout, $mdToast, $stateParams, UserService) {

        var vm = this;

        vm.$state = $state;
        vm.token = $stateParams.q
        vm.blockClick = false;
        vm.showLogin = false;
        vm.password = {
            new: '',
            confirm: ''
        }

        vm.changePassword = changePassword;
        vm.gotoLogin = gotoLogin;

        //console.log(vm.token);

        function changePassword() {
            vm.showLogin = false;
            vm.blockClick = true;
            var token = "Bearer " + vm.token;
            UserService.resetForgottenPassword(vm.password, token).then(function (response) {
                if (response.data.success === true) {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Your password has been changed successfully! Login to continue.")
                        .position("bottom right").parent(document.body));
                    vm.blockClick = false;
                    vm.showLogin = true;
                    //logout();
                } else {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Could not reset password. Please try again.")
                        .position("bottom right").parent(document.body));
                    vm.blockClick = false;
                    vm.showLogin = false;
                }
            })
        }

        function gotoLogin() {
            $state.go('root.login');
        }

        if (!vm.token) {
            $mdToast.show($mdToast.simple()
                .textContent("Reset link is invalid!")
                .position("bottom right").parent(document.body));
        }
    };

})();