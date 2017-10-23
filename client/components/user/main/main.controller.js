(function () {
    var app = angular.module('cc').controller('main.controller', Controller);

    Controller.$inject = ['$scope', '$rootScope', '$timeout', '$mdSidenav', '$state', '$mdToast', '$mdMedia', '$mdDialog', 'UtilityService', 'UserService',
        'PreferencesService', 'TweenMax', 'AuthService', 'ThemerService', 'ROLES'
    ];

    /* @ngInject*/
    function Controller($scope, $rootScope, $timeout, $mdSidenav, $state, $mdToast, $mdMedia, $mdDialog, UtilityService, UserService,
        PreferencesService, TweenMax, AuthService, ThemerService, ROLES) {

        //console.log('main.controller init');

        var vm = this;

        ////////////////////////////////declarations/////////////////////////////////////

        vm.isAppBootstrapping = true;
        vm.brandLogoUrl = "";
        vm.bNav = true;
        vm.navbarSwitch = vm.bNav;
        vm.smallScreen = true;
        vm.defaultViewLoaded = false;
        vm.user = {};

        //functions
        vm.getProfileAvatar = getProfileAvatar;
        vm.onBrandLogoFailure = onBrandLogoFailure;
        vm.getBrandLogo = getBrandLogo;
        vm.toggleNavbar = toggleNavbar;
        vm.logout = logout;
        vm.isAuthed = isAuthed;
        vm.isAdmin = isAdmin;
        vm.getUsername = getUsername;
        vm.toggleFullscreen = toggleFullscreen;
        vm.refreshPage = refreshPage;
        vm.getUserProfile = getUserProfile;
        vm.getTheme = getTheme;
        vm.openCredits = openCredits;

        ////////////////////////////////////functions/////////////////////////////////////

        function onBrandLogoFailure() {
            console.log('brand logo failed to load.');
            vm.displayBrandLogo = false;
        }

        function getBrandLogo() {
            vm.brandLogoUrl = 'img/brands/logo.jpg' || PreferencesService.forBrandLogo();
            if (typeof vm.brandLogoUrl !== 'undefined') {
                if (vm.brandLogoUrl === 'undefined')
                    vm.displayBrandLogo = false;
                else {
                    if (vm.brandLogoUrl)
                        vm.displayBrandLogo = true;
                    else
                        vm.displayBrandLogo = false;
                }
            } else {
                vm.displayBrandLogo = false;
            }

            return vm.brandLogoUrl;
        }

        function toggleNavbar() {

            if (vm.smallScreen)
                $mdSidenav('navbar').toggle();
            else {

                var nav;

                if (vm.bNav) {

                    nav = angular.element(document.getElementById("bigNavbar"));
                    //vm.sNav = true;
                    //smallNav = angular.element(document.getElementById("smallNavbar"));

                    var tl1 = new TimelineMax();

                    var setBNavFalse = function () {
                        $timeout(function () {
                            vm.bNav = false;
                            $(window).trigger('resize');
                        }, 0);
                    };

                    tl1
                        // .add(TweenMax.set(smallNav, {
                        //         width: "auto"
                        //             /* This has been added because we need to reset the original state of the smaller navbar before triggering the animation. For first time, this has no effect.*/
                        //     }))
                        .to(nav, 0.4, {
                            maxWidth: 0,
                            minWidth: 0,
                            ease: Power2.easeOut
                        })
                        .add(setBNavFalse);

                    tl1.play();

                } else {

                    //PreferencesService.setBigNavbar(true);

                    //smallNav = angular.element(document.getElementById("smallNavbar"));
                    vm.bNav = true;
                    nav = angular.element(document.getElementById("bigNavbar"));

                    var tl1 = new TimelineMax();

                    var setSNavFalse = function () {
                        $timeout(function () {
                            //vm.sNav = false;
                            $(window).trigger('resize');
                            var navbar = document.getElementById("bigNavbar");
                            var style = {
                                background: navbar.style.backgroundColor,
                                color: navbar.style.color
                            };
                            navbar.removeAttribute("style");
                            navbar.style.backgroundColor = style.background;
                            navbar.style.color = style.color; //css hack to restore bigger navbar's original state.
                        }, 0);
                    };

                    tl1.add(TweenMax.set(nav, {
                            clearProps: "min-width, max-width"
                            /*This has been added because we need to reset the original state of the bigger navbar before triggering the animation.For first time,
                            this has no effect.Make sure not to add inline styling
                            for bigger navbar,
                            or
                            else that styling will get removed.*/
                        }))
                        .from(nav, 0.4, {
                            maxWidth: 0,
                            minWidth: 0,
                            ease: Power2.easeIn
                        }).add(setSNavFalse);


                    tl1.play();
                }
            }

            $rootScope.$broadcast('navbarToggled', {});
        }

        function toggleFullscreen() {
            UtilityService.toggleFullscreen();
        }

        function refreshPage() {
            UtilityService.refreshPage();
        }

        function logout() {
            //console.log("logout");
            // AuthService.logout();
            // PreferencesService.resetPreferences();
            $rootScope.$broadcast('logout', {});
            // vm.hideLogin = false;
            // vm.hideMain = !vm.hideMain;
            // $state.go('login');
        }

        function isAuthed() {
            return UtilityService.isAuthed();
        }

        function getUsername() {
            return UtilityService.getUsername();
        }

        function isAdmin() {
            return getUserRole() === ROLES.ADMIN;
        }

        function getUserRole() {
            return UtilityService.getUserRole();
        }

        function getUserProfile() {
            UserService.getUserProfile(UtilityService.getUserId()).then(function (response) {
                vm.user = response.data.response;
            }, function (response) {
                console.error(response);
            });
        }

        function getTheme() {
            return ThemerService.getThemeFromLocalStorage();
        }

        function getProfileAvatar() {
            return PreferencesService.getProfileAvatar();
        }

        function openCredits($event) {
            $mdDialog.show({
                fullscreen: true,
                targetEvent: $event,
                clickOutsideToClose: true,
                templateUrl: 'components/user/main/credits.dialog.html',
                controller: ['$mdDialog', function ($mdDialog) {
                    var vm = this;
                    vm.hide = hide;

                    function hide() {
                        $mdDialog.cancel();
                    }
                }],
                controllerAs: 'vm'
            });
        }

        $scope.$watch(function () {
            return $mdMedia('min-width:700px');
        }, function (newVal, oldVal) {
            //console.log(newVal, oldVal);
            vm.smallScreen = !newVal;
        });

        $rootScope.$on('logout', function (event, args) {
            AuthService.logout();
            PreferencesService.resetPreferences();
            //$rootScope.$broadcast('logout', {});
            // vm.hideLogin = false;
            //vm.hideMain = !vm.hideMain;
            $state.go('root.login', {}, {
                reload: true
            });
        })

        $scope.$on('loginSuccessful', function (event, args) {

            getBrandLogo();
            getUserProfile();

            $timeout(function () {
                vm.hideMain = !vm.hideMain;
            }, 1200);

            $state.go('main.home', {}, {
                reload: true
            });

            $timeout(function () {
                $mdToast.show($mdToast.simple().textContent("Welcome back, " + UtilityService.getUsername() + ".").position("top right").parent(angular.element(document.getElementById('content'))));
            }, 1500);

        })

        $scope.$on('error', function (event, args) {
            var message = args.msg;
            //console.log("http error msg: " + message);
            vm.toast = $mdToast
                .show(
                    $mdToast.simple()
                    .textContent(message)
                    .position("bottom right")
                    .action('OK')
                    .highlightAction(true)
                    .highlightClass('md-accent')
                    .parent(angular.element(document.body))
                );

        });

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

            vm.stateChanging = true;
            vm.defaultViewLoaded = false;
            if (vm.smallScreen && vm.bNav) {
                toggleNavbar();
            }

        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {

            $timeout(function () {
                vm.stateChanging = false;
                if (toState.name == 'home') {
                    vm.defaultViewLoaded = true;
                    //vm.staggerAnimateHomeCards();
                }
            }, 0);
        });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            $timeout(function () {
                vm.stateChanging = false;
            }, 0);
            console.error(error);
        });

        (function () {
            $timeout(function () {
                vm.revealLogo = true;
                if (vm.smallScreen) {
                    toggleNavbar();
                }
                getBrandLogo();
                if (isAuthed())
                    getUserProfile();
                $timeout(function () {
                    vm.isAppBootstrapping = false;
                }, 1000);
            }, 1000);
        })();
    };

}());