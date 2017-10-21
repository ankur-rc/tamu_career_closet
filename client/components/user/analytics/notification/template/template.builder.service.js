(function () {
    'use strict';

    angular
        .module('fleet')
        .service('TemplateBuilderService', Service);

    Service.$inject = ['API', '$http'];

    /* @ngInject */
    function Service(API, $http) {
        this.getAllTemplates = getAllTemplates;
        this.submitTemplate = submitTemplate;
        this.deleteTemplate = deleteTemplate;
        this.updateTemplate = updateTemplate;
        this.getTemplateByType = getTemplateByType;

        /////////////////////

        //initialise data
        function getAllTemplates() {
            return $http({
                url: API + '/notificationTemplate/getAll',
                method: 'GET'
            });
        }

        function submitTemplate(data) {
            return $http({
                url: API + "/notificationTemplate/save",
                method: 'POST',
                data: data
            });
        }

        function deleteTemplate(id) {
            return $http({
                url: API + "/notificationTemplate/deleteTemplate/" + id,
                method: 'DELETE'
            });
        }

        function updateTemplate(data) {
            return $http({
                url: API + "/notificationTemplate/update",
                method: 'POST',
                data: data
            });
        }

        function getTemplateByType(type) {
            return $http({
                url: API + '/notificationTemplate/getByType/'+type,
                method: 'GET'
            });
        }
    }
})();