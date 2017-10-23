(function () {
    'use strict';

    angular.module('cc')
        .controller('LoginAndRegController', controller);

    controller.$inject = ['$scope', '$rootScope', '$mdToast', '$mdDialog', '$timeout', '$state', 'AuthService', 'UserService', 'PreferencesService', 'UtilityService'];

    /*@ngInject */
    function controller($scope, $rootScope, $mdToast, $mdDialog, $timeout, $state, AuthService, UserService, PreferencesService, UtilityService) {

        var vm = this;
        //variables
        vm.hideLogin = false;
        vm.user = {
            name: '',
            password: ''
        };
        vm.reg = {
            user: {
                name: undefined,
                password: undefined,
                confirmPassword: undefined,
                primaryEmail: undefined
            }
        };
        vm.forgot = {
            password: undefined
        };
        vm.hideForgotPassword = true;
        vm.selectedTab = 0;
        vm.blockClick = false;
        //functions
        vm.initiateLogin = initiateLogin;
        vm.toggleForgotPassword = toggleForgotPassword;
        vm.initiateForgotPassword = initiateForgotPassword;
        vm.initiateRegistration = initiateRegistration;
        vm.logout = logout;
        vm.gotoHome = gotoHome;
        vm.gotoRoot = gotoRoot;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        function initiateLogin() {
            vm.blockClick = true;
            // $timeout(function () {
            UserService.login(vm.user).then(function (response) {
                    console.log(response);
                    if (response.data.success === true) {
                        // AuthService.saveToken(response.data.token);
                        //console.log("login successful");
                        PreferencesService.setBrandLogo(response.data.brandLogoUrl);
                        //for demo purposes
                        // DaasDemoService.saveMyDevicesToLocalStorage();

                        var role = UtilityService.getUserRole();

                        vm.hideLogin = true;

                        $timeout(function () {
                            $rootScope.$broadcast('loginSuccessful', {
                                role: role
                            })
                        }, 800);

                    } else {
                        //console.log("login failed");
                        $mdToast.show($mdToast.simple().textContent(response.data.msg).action('Close')
                            .highlightAction(true).highlightClass('accent').position("bottom right").parent(angular.element(document.body)));

                    }

                    vm.blockClick = false;

                },
                function (data) {
                    vm.blockClick = false;
                });
            // }, 5000);

        }

        function toggleForgotPassword(state) {
            switch (state) {
                case 'hide':
                    vm.hideForgotPassword = true;
                    break;
                case 'show':
                    vm.hideForgotPassword = false;
                    break;
                default:
                    vm.hideForgotPassword = !vm.hideForgotPassword;
                    break;
            }
        }

        function initiateForgotPassword() {

            if (vm.forgot.password) {
                vm.blockClick = true;

                UserService.forgotPassword(vm.forgot.password).then(function (response) {
                    $mdToast.show($mdToast.simple().textContent(response.data.msg)
                        .position("bottom right").parent(angular.element(document.body)));

                    vm.blockClick = false;
                    toggleForgotPassword('hide');
                });

            }
        }

        function initiateRegistration() {

            vm.blockClick = true;

            UserService.register(vm.reg.user).then(function (response) {

                    if (response.data.success === true) {
                        $mdToast.show($mdToast.simple()
                            .textContent(response.data.message ? response.data.message : "Registered successfully!")
                            .position("bottom right").parent(document.body));

                        vm.selectedTab = 0;
                    } else {
                        $mdToast.show($mdToast.simple()
                            .textContent(response.data.message ? response.data.message : "Could not register.")
                            .position("bottom right").parent(document.body));
                    }

                    vm.blockClick = false;
                },
                function (data) {
                    vm.blockClick = false;
                });


        }        

        function logout() {
            $rootScope.$broadcast('logout', {});
        }

        function gotoHome() {
            $state.go("main.home");
        }

        function gotoRoot() {
            $state.go("root");
        }        

        $scope.$on('logout', function (event, args) {
            vm.hideLogin = false;

        })
    }

})();