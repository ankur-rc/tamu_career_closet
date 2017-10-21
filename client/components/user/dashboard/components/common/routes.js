(function () {
    angular.module("fleet.dashboard").config(routeConfig);

    /*@ngInject*/
    routeConfig.$inject = ["$urlRouterProvider", "$stateProvider"];

    function routeConfig($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.when('/main/home', '/main/dashboard');

        $stateProvider.state("main.dashboard", {
                url: "/dashboard",
                templateUrl: "components/user/dashboard/components/dashboard/dashboard.html",
                controller: 'DashboardController',
                controllerAs: 'vm'
            })
            .state("main.trip.metrics", {
                url: "/metrics",
                params: {
                    'trip': null
                },
                resolve: {
                    followingTripsTrail: ['$stateParams', '$q', '$state', '$timeout', function ($stateParams, $q, $state, $timeout) {
                        var deferred = $q.defer();
                        $timeout(function () {
                            if ($stateParams.trip)
                                deferred.resolve();
                            else {
                                $state.go('main.trip.view', {});
                                deferred.reject();
                            }
                        });
                        return deferred.promise;
                    }]
                },
                views: {
                    '@main': {
                        templateUrl: "components/user/dashboard/components/trip-metrics/trip.metrics.html",
                        controller: 'TripMetricsController',
                        controllerAs: 'vm'
                    }
                }

            });
    }

}());