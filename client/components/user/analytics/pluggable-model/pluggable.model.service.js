(function () {
    'use strict';

    angular
        .module('fleet')
        .service('PluggableModelService', Service);

    Service.$inject = ['API', '$http'];

    /* @ngInject */
    function Service(API, $http) {

        this.getPluggableModels = getPluggableModels;
        this.uploadPluggableModel = uploadPluggableModel;
        this.deletePluggableModel = deletePluggableModel;

        /////////////////////

        //initialise data
        function getPluggableModels() {
            return $http({
                url: API + '/pluggableModel/getAllPluggableModels',
                method: 'GET'
            });
        }

        function uploadPluggableModel(form) {
            return Upload.upload({
                url: API + '/pluggableModel/uploadModel',
                data: {
                    fileData: form.files[0].data
                },
                params: {
                    customModelName: form.files[1].data.name,
                    jarName: form.files[0].data.name,
                    jarExecutionPath: form.jarExecutionPath,
                    vehicleTypeId: form.vehicleTypeId
                }
            });
        }

        function deletePluggableModel(model) {
            return $http({
                url: API + "/pluggableModel/deleteModel/",
                method: 'DELETE',
                params: {
                    modelId: model.modelId,
                    modelName: model.modelName,
                    modelTypeName: model.modelType
                }
            });
        }
    }
})();