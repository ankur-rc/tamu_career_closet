(function () {
    'use strict';

    angular
        .module('cc')
        .controller('HomeController', Controller);

    Controller.$inject = ['$state', '$timeout'];

    /* @ngInject */
    function Controller($state, $timeout) {

        var vm = this;
        vm.viewLoaded = false;
        vm.metrics = [];
        var initialMetrics = {
            titles: ['Suits Checked Out', 'Active Users', 'Pending Returns', 'Next Audit In', 'Dry Cleaning', 'Defaulters'],
            icons: ['suits', 'users', 'returns', 'audit', 'clean', 'default'],
            values: [61, 73, 80, 15, 5, 5],
            href: ['#', '#', '#','#', '#', '#']
        }

        for (var i = 0; i < initialMetrics.titles.length; i++) {
            vm.metrics.push({
                title: initialMetrics.titles[i],
                icon: initialMetrics.icons[i],
                value: initialMetrics.values[i],
                href: initialMetrics.href[i]
            });
        }

        $timeout(function () {
            vm.viewLoaded = true;
        }, 500);

    };

})();