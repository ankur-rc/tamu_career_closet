(function () {
    'use strict';

    angular
        .module('fleet')
        .service('PluggableModelBuilderService', Service);

    Service.$inject = ['API', '$http', '$timeout', '$httpParamSerializerJQLike', 'Upload'];

    /* @ngInject */
    function Service(API, $http, $timeout, $httpParamSerializerJQLike, Upload) {
        //http
        //rule builder
        this.initData = initData;
        this.getMessageModel = getMessageModel;
        this.submitModelWithExpression = submitModelWithExpression;
        this.submitModelWithFile = submitModelWithFile;

        ////////////////

        //initialise data for rule engine - messageModel and notificationTemplate Ids.
        function initData() {
            return $http({
                url: API + "/ruleBuilderInitData",
                method: 'GET'
            });
        }

        //get messageModelTemplate for provided Id.
        function getMessageModel(id) {
            return $http({
                url: API + "/messageModelList",
                method: 'GET',
                params: {
                    "messageMasterId": id
                }
            });
        }

        function submitModelWithExpression(model) {
            return $http({
                url: API + "/pluggableModel/saveModel",
                method: 'PUT',
                params: {
                    "modelName": model.name,
                    "modelTypeName": model.modelType,
                    "subDomainId": model.subDomainId,
                    "featureSeq": model.featureSeq,
                    "expression": model.expression
                }
            });
        }

        function submitModelWithFile(model) {
            //console.log(model.fileData);
            return Upload.upload({
                url: API + "/pluggableModel/uploadModel",
                params: {
                    "modelName": model.name,
                    "modelTypeName": model.modelType,
                    "subDomainId": model.subDomainId,
                    "featureSeq": model.featureSeq
                },
                data: {
                    "fileData": model.fileData
                }
            });
        }
    }
})();