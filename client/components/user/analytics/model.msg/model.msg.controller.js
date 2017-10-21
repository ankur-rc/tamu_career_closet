(function () {
    'use strict';

    angular.module('fleet')
        .controller('ModelMsgController', controller);

    controller.$inject = ['$scope', '$mdToast', '$mdMedia', '$mdDialog', '$timeout', 'modelMsgs', 'ModelMsgService'];

    /* @ngInject */
    function controller($scope, $mdToast, $mdMedia, $mdDialog, $timeout, modelMsgs ,ModelMsgService) {

        $scope.modelMsgs = modelMsgs;
        $scope.selectedModelMsg = [];
        $scope.fab = {
            state: false,
            anim: 'md-fling'
        }
        $scope.query = {
            order: 'domain',
            limit: 5,
            page: 1
        };

        $scope.addModelMsg = addModelMsg;
        $scope.getModelMsgs = getModelMsgs;
        $scope.elaborateMessage = elaborateMessage;
        $scope.deleteModelMsg = deleteModelMsg;

        //////////////////////////////////////////////////////////////////////////////////////////

        function addModelMsg(ev) {

            $mdDialog.show({
                    controller: "AddModelMsgController",
                    templateUrl: 'components/user/analytics/model.msg/dialog/add.model.msg.modal.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose: true,
                    fullscreen: true
                })
                .then(function (form) {
                    $scope.getModelMsgs();
                }, function () {
                    console.log("ModelMsg not created.")
                });
        }

        function getModelMsgs() {
            $scope.modelMsgPromise = ModelMsgService.getModelMsgs().then(function (response) {
                $scope.modelMsgs = JSON.parse(response.data.data);
            });
        }

        function elaborateMessage($event, message) {

            $mdDialog.show({
                fullscreen: true,
                targetEvent: $event,
                template: '<md-dialog flex="initial" layout-align="center">' +
                    '  <md-toolbar layout="row"  layout-align="center center">' +
                    '       <div flex="20"></div><div flex="60" class="white-text" layout layout-align="center center">Message Model</div>' +
                    '       <div layout flex="20" layout-align="end center" ng-init="jsonTree=false">' +
                    '           <md-switch class="md-accent no-margin" ng-model="jsonTree" aria-label="Toggle json Tree">' +
                    '           </md-switch>' +
                    '       </div>' +
                    '  </md-toolbar>' +
                    '  <md-dialog-content layout-padding layout-fill>' +
                    '       <json-formatter ng-show="jsonTree" class="fade-animation" open="1" json="message" style="overflow:auto"></json-formatter>' +
                    '       <pre ng-show="!jsonTree">{{ message | json }}</pre></md-dialog-content>' +
                    '  <md-dialog-actions>' +
                    '    <md-button ng-click="closeDialog()" class="md-primary">' +
                    '      Close' +
                    '    </md-button>' +
                    '  </md-dialog-actions>' +
                    '</md-dialog>',
                controller: ['$scope', '$mdDialog', 'message', function Controller($scope, $mdDialog, message) {
                    $scope.message = JSON.parse(message);
                    $scope.closeDialog = function () {
                        $mdDialog.hide();
                    };
                }],
                locals: {
                    message: message
                }
            });

        }

        function deleteModelMsg(ev) {

            if ($scope.selectedModelMsg.length !== 0) {
                var confirm = $mdDialog.confirm()
                    .title('Are you sure you want to delete selected template?')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');

                $mdDialog.show(confirm).then(function () {
                    ModelMsgService.deleteModelMsg($scope.selectedModelMsg[0].messageId).then(function (response) {
                        $mdToast.show($mdToast.simple().textContent(response.data.msg).position("bottom left").parent(angular.element(document.getElementById('content'))));
                        $scope.getModelMsgs();
                    });
                }, function () {});
            }
        }

        

    }

})();
