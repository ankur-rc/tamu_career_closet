(function () {
    'use strict';

    angular
        .module('fleet')
        .directive('arcCountup', directive);

    directive.$inject = [];

    /* @ngInject */
    function directive() {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                value: '@',
                duration: '@?'
            }
        };
        return directive;

        function link(scope, element, attrs, controller) {

            var countup = undefined;
            var value = attrs.value;

            function getCountup() {
                var duration = attrs.duration || 2;
                var options = {
                    useEasing: true,
                    useGrouping: true,
                    separator: ',',
                    decimal: '.',
                    prefix: '',
                    suffix: ''
                };
                var countUp = new CountUp(element[0], 0, attrs.value, 0, duration, options);
                return countUp;
            }

            scope.$watch('value', function (newValue, oldValue) {
                if (newValue) {
                    if (countup == undefined) {
                        countup = getCountup();
                        countup.start();
                    } else {
                        countup.update(newValue);
                    }
                }
            })
        }
    }
})();