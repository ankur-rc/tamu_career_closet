(function () {
    angular.module('fleet').config(configuration);

    configuration.$inject = ['$stateProvider', '$urlRouterProvider'];

    /* @ngInject */
    function configuration($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise("/404");

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
            .state("main.driver", {
                abstract: true,
                url: "/driver"
            })
            .state("main.driver.view", {
                url: "/view",
                resolve: {
                    drivers: function (DriverService, $q) {
                        return DriverService.getDrivers().then(function (response) {
                            if (!response.data.success) {
                                $q.reject();
                            } else
                                return response.data.response;
                        });
                    }
                },
                views: {
                    "@main": {
                        templateUrl: "components/user/driver/drivers.html",
                        controller: "DriverController"
                    }
                }
            })
            .state("main.driver.add", {
                url: "/add",
                views: {
                    '@main': {
                        templateUrl: "components/user/driver/add.driver.html",
                        controller: "AddDriverController",
                        controllerAs: 'vm'
                    }
                },
                params: {
                    title: "Create Route"
                }
            })
            .state("main.driver.edit", {
                url: "/edit",
                views: {
                    '@main': {
                        templateUrl: "components/user/driver/add.driver.html",
                        controller: "EditDriverController",
                        controllerAs: 'vm'
                    }
                },
                params: {
                    driver: {},
                    title: "Update Driver"
                }
            })
            .state("main.vehicle", {
                abstract: true,
                url: "/vehicle"
            })
            .state("main.vehicle.view", {
                url: "/view",
                resolve: {
                    vehicles: function ($http, VehicleService) {
                        return VehicleService.getVehicles().then(function (response) {
                            return response.data.response;
                        });
                    }
                },
                views: {
                    "@main": {
                        templateUrl: "components/user/vehicle/vehicles.html",
                        controller: "VehicleController"
                    }
                }
            })
            .state("main.vehicle.add", {
                url: "/add",
                views: {
                    '@main': {
                        templateUrl: "components/user/vehicle/add.vehicle.html",
                        controller: "AddVehicleController",
                        controllerAs: 'AddVehicleCtrl'
                    }
                }
            })
            .state("main.vehicle.edit", {
                url: "/edit",
                views: {
                    '@main': {
                        templateUrl: "components/user/vehicle/add.vehicle.html",
                        controller: "EditVehicleController",
                        controllerAs: 'EditVehicleCtrl',
                    }
                },
                params: {
                    vehicle: {}
                }
            })
            .state("main.locateVehicle", {
                url: "/locateVehicle",
                templateUrl: "components/user/location/locate.device.html",
                controller: "LocationController",
                resolve: {
                    devicesLocation: ['LocationService', '$q', function (LocationService, $q) {
                        return LocationService
                            .getDeviceLocation()
                            .then(
                                function (response) {
                                    if (!response.data.success) {
                                        $q.reject();
                                    } else
                                        return response.data.response;
                                });
                    }]
                }
            })
            .state("main.analytics", {
                abstract: true,
                url: "/analytics"
            })
            .state("main.analytics.modelMsg", {
                url: "/model-message",
                views: {
                    "@main": {
                        templateUrl: "components/user/analytics/model.msg/model.msg.html",
                        controller: "ModelMsgController",
                        resolve: {
                            modelMsgs: ['ModelMsgService', '$q', function(ModelMsgService, $q) {
                                return ModelMsgService.getModelMsgs().then(function (response) {
                                    if (!response.data) {
                                        $q.reject();
                                    } else
                                        return response.data.response;
                                });
                            }]
                        }
                    }
                }
            })
            .state("main.rule-builder", {
                url: "/rule-builder",
                views: {
                    "@main": {
                        templateUrl: "components/user/analytics/rule-builder/rule.builder.html",
                        controller: "RuleBuilderController"
                    }
                }
                
            })
            .state("main.rule-builder.rule-engine", {
                url: "/rule-engine",
                views: {
                    '@main': {
                        templateUrl: "components/user/analytics/rule-builder/rule.builder.engine.html",
                        controller: "RuleBuilderEngineController",
                        resolve: {
                            initData: ['RuleBuilderEngineService', '$q', function(RuleBuilderEngineService, $q) {
                                return RuleBuilderEngineService.initData().then(function(response) {
                                    if (!response.data) {
                                        $q.reject();
                                    } else
                                        return response.data;
                                });
                            }]
                        }
                    }
                }
            })
            .state("main.pluggable-model", {
                url: "/pluggable-model",
                templateUrl: "components/user/analytics/pluggable-model/pluggable.model.html",
                controller: "PluggableModelController",
                resolve: {
                    pluggableModels: ['PluggableModelService', '$q', function(PluggableModelService, $q) {
                        return PluggableModelService.getPluggableModels().then(function(response) {
                            if (response.data && response.data.success && response.data.success === true)
                                return response.data.pluggableModels;
                            else
                                $q.reject();
                        });
                    }]
                }
            })
            .state("main.pluggable-model.builder", {
                url: "/pluggable-model-builder",
                views: {
                    '@main': {
                        templateUrl: "components/user/analytics/pluggable-model/pluggable.model.builder.html",
                        controller: "PluggableModelBuilderController"                        
                    }
                }
            })
            .state("main.analytics.notification", {
                abstract: true,
                url: "/analytics-notification"
            })
            .state("main.analytics.notification.template", {
                url: "/template",
                views: {
                    "@main": {
                        templateUrl: "components/user/analytics/notification/template/template.html",
                        controller: "TemplateController"
                    }
                }
            })
            .state("main.analytics.notification.template.builder", {
                url: "/template-builder",
                views: {
                    "@main": {
                        templateUrl: "components/user/analytics/notification/template/template.builder.html",
                        controller: "TemplateBuilderController"
                    }
                }
            })
            .state("main.route", {
                abstract: true,
                url: "/route"
            })
            .state("main.route.view", {
                url: "/view",
                resolve: {
                    routes: function (RouteService, $q) {
                        return RouteService.getRoutes().then(function (response) {
                            if (!response.data.success) {
                                $q.reject();
                            } else
                                return response.data.response;
                        });
                    }
                },
                views: {
                    "@main": {
                        templateUrl: "components/user/route/routes.html",
                        controller: "RouteController"
                    }
                }
            })
            .state("main.route.add", {
                url: "/add",
                views: {
                    '@main': {
                        templateUrl: "components/user/route/add.route.html",
                        controller: "AddRouteController",
                        controllerAs: 'vm'
                    }
                },
                params: {
                    title: "Create Route"
                }
            })
            .state("main.route.edit", {
                url: "/edit",
                views: {
                    '@main': {
                        templateUrl: "components/user/route/add.route.html",
                        controller: "EditRouteController",
                        controllerAs: 'vm'
                    }
                },
                params: {
                    title: "Update Route",
                    route: {}
                }
            })
            .state("main.cargo", {
                abstract: true,
                url: "/cargo"
            })
            .state("main.cargo.view", {
                url: "/view",
                resolve: {
                    cargoes: function ($http, CargoService) {
                        return CargoService.getCargoes().then(function (response) {
                            return response.data.response;
                        });
                    }
                },
                views: {
                    "@main": {
                        templateUrl: "components/user/cargo/cargoes.html",
                        controller: "CargoController"
                    }
                }
            })
            .state("main.cargo.add", {
                url: "/add",
                views: {
                    '@main': {
                        templateUrl: "components/user/cargo/add.cargo.html",
                        controller: "AddCargoController",
                        controllerAs: 'AddCargoCtrl'
                    }
                }
            })
            .state("main.cargo.edit", {
                url: "/edit",
                resolve: {
                    routes: function (RouteService, $q) {
                        return RouteService.getScheduledRoutes().then(function (response) {
                            if (!response.data.success) {
                                $q.reject();
                            } else
                                return response.data.response;
                        });
                    }
                },
                views: {
                    '@main': {
                        templateUrl: "components/user/cargo/add.cargo.html",
                        controller: "EditCargoController",
                        controllerAs: 'EditCargoCtrl',
                    }
                },
                params: {
                    cargo: {}
                }
            })
            .state("main.trip", {
                abstract: true,
                url: "/trip"
            })
            .state("main.trip.view", {
                url: "/view",
                resolve: {
                    trips: function (TripService, $q) {
                        return TripService.getTrips().then(function (response) {
                            if (!response.data.success) {
                                $q.reject();
                            } else
                                return response.data.response;
                        });
                    }
                },
                views: {
                    "@main": {
                        templateUrl: "components/user/trip/trips.html",
                        controller: "TripController"
                    }
                }
            })
            .state("main.trip.add", {
                url: "/add",
                views: {
                    '@main': {
                        templateUrl: "components/user/trip/add.trip.html",
                        controller: "AddTripController",
                        controllerAs: 'vm'
                    }
                }
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
