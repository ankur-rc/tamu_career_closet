(function () {
    'use strict';

    angular
        .module('fleet')
        .controller('PluggableModelController', Controller);

    Controller.$inject = ['$scope', '$mdToast', '$mdMedia', '$mdDialog', '$timeout', '$state', 'PluggableModelService', 'pluggableModels'];

    /* @ngInject */
    function Controller($scope, $mdToast, $mdMedia, $mdDialog, $timeout, $state, PluggableModelService, pluggableModels) {

        $scope.pluggableModels = pluggableModels;
        $scope.selectedPluggableModel = [];
        $scope.query = {
            order: 'modelId',
            limit: 5,
            page: 1
        };

        ////////////////////////////////////////////////////////////////////////////

        $scope.createPluggableModel = createPluggableModel;
        $scope.getPluggableModels = getPluggableModels;
        $scope.viewPluggableModel = viewPluggableModel;
        $scope.deletePluggableModel = deletePluggableModel;

        ////////////////////////////////////////////////////////////////////////////

        function createPluggableModel(ev) {
            $state.go('main.pluggable-model.builder');
        }

        function getPluggableModels() {
            $scope.pluggableModelsPromise = PluggableModelService.getPluggableModels().then(function (response) {
                if (response.data.success) {
                    //console.log(response);
                    $scope.pluggableModels = response.data.pluggableModels;
                } else {
                    $mdToast.show($mdToast.simple().textContent(response.data.msg ? response.data.msg : "Server Error occured.").position("bottom left").parent(angular.element(document.getElementById('content'))));
                }
            });
        }

        function viewPluggableModel($event, modelContent) {

            $mdDialog.show({
                fullscreen:true,
                targetEvent: $event,
                clickOutsideToClose: true,
                template: '<md-dialog flex="initial">' +
                    '  <md-toolbar layout="row" class="white-text" layout-align="center center">Model</md-toolbar>' +
                    '  <md-dialog-content layout-padding layout-fill>' +
                    '      <div layout="column" layout-align="center center">' +
                    '           <pre style="display: inline-table">{{ content }}</pre>' +
                    '       </div>' +
                    '  </md-dialog-content>' +
                    '  <md-dialog-actions>' +
                    '    <md-button ng-click="closeDialog()" class="md-primary">' +
                    '      Close' +
                    '    </md-button>' +
                    '  </md-dialog-actions>' +
                    '</md-dialog>',
                controller: ['$scope', '$mdDialog', '$timeout', 'content', function Controller($scope, $mdDialog, $timeout, content) {
                    $scope.content = content;
                    $scope.closeDialog = function () {
                        $mdDialog.hide();
                    };
                }],
                locals: {
                    content: modelContent
                }
            });

        }

        function deletePluggableModel(ev) {

            if ($scope.selectedPluggableModel.length !== 0) {
                var confirm = $mdDialog.confirm()
                    .title('Are you sure?')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');

                $mdDialog.show(confirm).then(function () {

                    PluggableModelService.deletePluggableModel($scope.selectedPluggableModel[0]).then(function (response) {
                        $mdToast.show($mdToast.simple().textContent(response.data.msg).position("bottom left").parent(angular.element(document.getElementById('content'))));
                        $scope.getPluggableModels();
                    });

                }, function () {

                });

            }
        }

        $timeout(function () {
            var input = $('#fileInput');
            var button = $('#uploadButton');
            var textInput = $('#textInput');
            uploadFile(input, button, textInput);
            
        }, 1000);

        function uploadFile(input,button,textInput) {
            if (input.length && button.length && textInput.length) {
                button.click(function (e) {
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