(function () {
    angular.module('cc').config(configuration);

    configuration.$inject = ['$stateProvider', '$urlRouterProvider'];

    /* @ngInject */
    function configuration($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/login");

        $stateProvider
            .state("root", {
                abstract: true,
                url: "/",
                templateUrl: "components/user/root/root.html",
            })
            .state("root.404", {
                url: "404",
                views: {
                    "root": {
                        templateUrl: "components/user/root/404.html"
                    }
                }
            })
            .state("root.403", {
                url: "403",
                views: {
                    "root": {
                        templateUrl: "components/user/root/403.html"
                    }
                }
            })
            .state("root.login", {
                url: "login",
                views: {
                    'root': {
                        templateUrl: "components/user/authentication/login.html",
                        controller: "LoginAndRegController as login"
                    }
                }
            })
            .state("root.resetPassword", {
                url: "resetPassword?q",
                views: {
                    "root": {
                        templateUrl: "components/user/authentication/reset.password.html",
                        controller: "ResetPasswordController as vm"
                    }
                }
            })
            .state("main", {
                url: "/main",
                templateUrl: "components/user/main/main.html",
                resolve: {
                    isAuthed: ['grant', function (grant) {
                        return grant.only({
                            test: 'isAuthed',
                            state: 'root.403'
                        });
                    }]
                }
            })
            .state("main.home", {
                url: "/home",
                templateUrl: "components/user/main/home.html",
                controller: "HomeController as home"
            })
            .state("main.profile", {
                url: "/profile",
                templateUrl: "components/user/profile/user.profile.html",
                controller: "UserProfileController as profile",
                resolve: {
                    userProfile: ['UserService', 'UtilityService', '$q', function (UserService, UtilityService, $q) {
                        return UserService
                            .getUserProfile(UtilityService.getUserId())
                            .then(
                                function (response) {
                                    if (!response.data.success) {
                                        $q.reject();
                                    } else
                                        return response.data.response;
                                });
                    }]
                }
            });
    }

})();
