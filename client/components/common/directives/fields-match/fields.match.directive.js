(function () {
    'use strict';

    angular
        .module('cc')
        .directive('matchFields', directive);

    directive.$inject = [];

    /* @ngInject */
    function directive() {
        return {
            restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            link: function (scope, elem, attrs, ngModel) {
                if (!ngModel) return; // do nothing if no ng-model

                // watch own value and re-validate on change
                scope.$watch(attrs.ngModel, function () {
                    validate();
                });

                // observe the other value and re-validate on change
                attrs.$observe('matchFields', function (val) {
                    validate();
                });

                var validate = function () {
                    // values
                    var val1 = ngModel.$viewValue;
                    var val2 = attrs.matchFields;

                    // set validity
                    ngModel.$setValidity('matchFields', val1 === val2);
                };
            }
        }
    }
})();