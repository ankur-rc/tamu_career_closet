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

        $timeout(function () {
            vm.viewLoaded = true;
        }, 500);

    };

})();