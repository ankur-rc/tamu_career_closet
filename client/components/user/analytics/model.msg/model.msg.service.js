(function () {
    'use strict';

    angular
        .module('fleet')
        .service('ModelMsgService', Service);

    Service.$inject = ['$http', 'API', 'Upload'];

    /* @ngInject */
    function Service($http, API, Upload) {
        this.getModelMsgs = getModelMsgs;
        this.saveModelMsg = saveModelMsg;
        this.deleteModelMsg = deleteModelMsg;
        this.getModelMsgsByVehicleType = getModelMsgsByVehicleType;
        ////////////////

        function getModelMsgs() {
            return $http({
                url: API + "/messageModel/getAll",
                method: 'GET'
            });
        }

        function saveModelMsg(form) {
            return Upload.upload({
                url: API + '/messageModel/save',
                method: 'POST',
                data: {
                    name: form.name,
                    vehicleType: form.vehicleType,
                    createdTime : form.createdTime,
                    file: form.file.data
                }
            });
        }

        function deleteModelMsg(id) {
            return $http({
                url: API + "/messageModel/delete/"+id,
                method: 'DELETE'
            });
        }

        function getModelMsgsByVehicleType(type) {
            return $http({
                url: API + "/messageModel/getByVehicleType/"+type,
                method: 'GET'
            });
        }

    }
})();