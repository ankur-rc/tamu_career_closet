(function () {
    'use strict';

    angular
        .module('fleet')
        .controller('HomeController', Controller);

    Controller.$inject = ['$state', '$timeout'];

    /* @ngInject */
    function Controller($state, $timeout) {

        var vm = this;
        vm.viewLoaded = false;

        $timeout(function () {
            vm.viewLoaded = true;
        }, 500);

    };

})();