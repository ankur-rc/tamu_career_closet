(function () {
    'use strict';

    angular.module('fleet').
    directive('usernameValidator', directive);

    directive.$inject = ['UserService', '$q'];

    /*ngInject */
    function directive(UserService, $q) {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {

                var validator = function (modelValue, viewValue) {
                    return UserService.checkUsername(viewValue).then(
                        function (response) {
                            //console.log('username validation:');
                            //console.log(response.data);
                            if (!response.data.success) {
                                $q.reject(response.data.msg);
                            } else {
                                $q.resolve();
                            }
                        },
                        function () {
                            $q.reject();
                        }
                    );

                    
                };
                //ngModel.$asyncValidators.username = validator;
            }
        };

    }
})();