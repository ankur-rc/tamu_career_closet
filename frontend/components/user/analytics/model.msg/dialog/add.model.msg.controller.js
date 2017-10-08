(function () {
    'use strict';

    angular
        .module('fleet')
        .controller('AddModelMsgController', Controller);

    Controller.$inject = ['$scope', '$mdDialog', '$q', '$timeout', '$mdToast', 'VehicleService', 'ModelMsgService'];

    /* @ngInject */
    function Controller($scope, $mdDialog, $q, $timeout, $mdToast, VehicleService, ModelMsgService) {

        var input, button, textInput;
        var files;
        $scope.form = {
            vehicleType: {
                name: undefined,
                id: undefined
            },
            file: {
                name: undefined,
                data: undefined
            }
        };

        $scope.hide = hide;
        $scope.close = close;
        $scope.upload = upload;
        $scope.loadVehicleTypes = loadVehicleTypes;

        ///////////////////////////////////////////////////////////////////

        function hide() {
            $mdDialog.hide();
        };

        function close() {
            $mdDialog.cancel();
        };
        
        function upload() {
            $scope.form.createdTime = Math.round(new Date().getTime()/1000);
            ModelMsgService.saveModelMsg($scope.form).then(function (response) {
                $timeout(function () {
                    $scope.form.file.data.result = response.data;
                    $mdToast.show($mdToast.simple().textContent(response.data.msg).position("bottom right").parent(angular.element(document.getElementById('content'))));
                    $mdDialog.hide();
                });
            }, function (response) {
                if (response.status > 0) {
                    $scope.errorMsg = response.status + ': ' + response.data.msg;
                    $mdToast.show($mdToast.simple().textContent($scope.errorMsg).position("bottom right").parent(angular.element(document.getElementById('content'))));
                    $mdDialog.hide();
                }
            }, function (evt) {
                $scope.form.file.data.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }

        function loadVehicleTypes() {
            VehicleService.getVehicleTypes().then(function(response) {
                $scope.vehicleTypes = response.data.response;
            })
        }

        $timeout(function () {
            input = $('#fileInput');
            button = $('#uploadButton');
            textInput = $('#textInput');

            if (input.length && button.length && textInput.length) {
                button.click(function (e) {
                    input.click();
                });
                textInput.click(function (e) {
                    input.click();
                });
            }

            input.on('change', function (e) {
                files = e.target.files;
                if (files[0]) {
                    $scope.fileName = files[0].name;
                } else {
                    $scope.fileName = null;
                }
                $scope.$apply();
            });
        });

    }
})();
