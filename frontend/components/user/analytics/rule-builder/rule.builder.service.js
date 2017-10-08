(function () {
    'use strict';

    angular
        .module('fleet')
        .service('RuleBuilderService', Service);

    Service.$inject = ['API', '$http', '$httpParamSerializerJQLike'];

    /* @ngInject */
    function Service(API, $http, $httpParamSerializerJQLike) {
        this.getRules = getRules;
        this.deleteRule = deleteRule;
        this.addRule = addRule;
        this.updateRule = updateRule;

        ///////////////////////////////////////////////////////////

        function getRules() {
            return $http({
                url: API + "/ruleBuilder/getAll",
                method: 'GET'
            });
        }

        function deleteRule(id) {
            return $http({
                url: API + "/ruleBuilder/delete/"+id,
                method: 'DELETE'
            });
        }

        function addRule(rule) {
            return $http({
                url: API + "ruleBuilder/save",
                method: 'POST',
                data: rule
            })
        }

        function updateRule(rule) {
            return $http({
                url: API + "ruleBuilder/update",
                method: 'PUT',
                data: rule
            })
        }
    }
})();