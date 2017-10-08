(function () {
    'use strict';

    angular
        .module('fleet')
        .controller('CustomRuleController', Controller);

    Controller.$inject = ['$scope', '$timeout', 'RuleBuilderEngineService', 'VehicleService', '$mdToast', '$mdDialog', '$state'];

    /* @ngInject */
    function Controller($scope, $timeout, RuleBuilderEngineService, VehicleService, $mdToast, $mdDialog, $state) {

        //////////////////////////////////////////////////declarations////////////////////////////////////////////////////////////

        $scope.customModel = {};
        $scope.jar = {};
        $scope.form = {
            jarExecutionPath: undefined,
            files: [$scope.jar, $scope.customModel]
        };

        $scope.loadVehicleTypes = loadVehicleTypes;
        $scope.close = close;
        $scope.upload = upload;
        $scope.uploadProgress;


        ///////////////////////////////////////////////////////////////////

        function loadVehicleTypes() {
            VehicleService.getVehicleTypes().then(function(response){
                $scope.vehicleTypes = response.data.response;
            })
        }
        function close() {
            $mdDialog.cancel();
        };

        
        function upload() {

            console.log($scope.form);

            $mdToast.show($mdToast.simple().textContent("Please wait. The operation may take some time to complete.").position("bottom left").parent(angular.element(document.getElementById('content'))));

            RuleBuilderEngineService.uploadCustomRuleAsset($scope.form).then(function (response) {

                $mdToast.show($mdToast.simple().textContent(response.data.msg).position("bottom left").parent(angular.element(document.getElementById('content'))));
                $mdDialog.hide();

            }, function (response) {
                if (response.status > 0) {
                    $scope.errorMsg = response.status + ': ' + response.data.msg;
                    $mdToast.show($mdToast.simple().textContent($scope.errorMsg).position("bottom left").parent(angular.element(document.getElementById('content'))));
                    //$mdDialog.hide();
                }
            }, function (evt) {
                $scope.uploadProgress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));

            })
        }

        
        $timeout(function () {
            var input = $('#fileInput');
            var button = $('#uploadButton');
            var textInput = $('#textInput');
            uploadFile(input, button, textInput);

            var input_ = $('#fileInput_');
            var button_ = $('#uploadButton_');
            var textInput_ = $('#textInput_');
            uploadFile(input_, button_, textInput_);
            
        }, 1000);

        function uploadFile(input,button,textInput) {
            if (input.length && button.length && textInput.length) {
                button.click(function (e) {
					console.log(e);
                    input.click();
                });
                textInput.click(function (e) {
                    input.click();
                });
            }

            input.on('change', function (e) {
                var files = e.target.files;
                var fileName;
                if (files[0]) {
                    fileName = files[0].name;
                } else {
                    fileName = null;
                }
                $scope.$apply();
            });
        }
    }
})();