(function () {
    'use strict';

    angular
        .module('fleet')
        .controller('TemplateController', Controller);

    Controller.$inject = ['$scope', '$mdToast', '$mdMedia', '$mdDialog', '$timeout', '$state', 'TemplateBuilderService'];

    /* @ngInject */
    function Controller($scope, $mdToast, $mdMedia, $mdDialog, $timeout, $state, TemplateBuilderService) {

        $scope.$state = $state;
        $scope.templates = [];
        $scope.selectedTemplate = [];
        $scope.query = {
            order: 'id',
            limit: 5,
            page: 1
        };

        $scope.addTemplate = addTemplate;
        $scope.getTemplates = getTemplates;
        $scope.viewTemplateText = viewTemplateText;
        $scope.deleteTemplate = deleteTemplate;


        function addTemplate(ev) {
            $state.go('main.analytics.notification.template.builder');
        }

        function initialise() {
            $scope.getTemplates();
        }

        function getTemplates() {
            $scope.templatesPromise = TemplateBuilderService.getAllTemplates().then(function (response) {
                if (response.data.success) {
                    $scope.templates = response.data.response;
                } else {
                    $mdToast.show($mdToast.simple().textContent(response.data.msg ? response.data.msg : "Error occured:" + response.status).position("bottom right").parent(angular.element(document.getElementById('content'))));
                }
            });
        }

        function viewTemplateText($event, text, type) {

            $mdDialog.show({
                fullscreen: true,
                targetEvent: $event,
                template: '<md-dialog flex="initial">' +
                    '  <md-toolbar layout="row" class="white-text" layout-align="center center">Template</md-toolbar>' +
                    '  <md-dialog-content layout-padding layout-fill>' +
                    '          <div layout="column" layout-align="center center" ng-show="type==\'sms\'"> {{ text }}</div>' +
                    '          <div layout="column" layout-align="center center" ng-show="type==\'email\'" ng-bind-html="text"></div>' +
                    '  </md-dialog-content>' +
                    '  <md-dialog-actions>' +
                    '    <md-button ng-click="closeDialog()" class="md-primary">' +
                    '      Close' +
                    '    </md-button>' +
                    '  </md-dialog-actions>' +
                    '</md-dialog>',
                controller: ['$scope', '$mdDialog', '$timeout', '$sce', 'content', 'type', function Controller($scope, $mdDialog, $timeout, $sce, content, type) {
                    //console.log(content);
                    $scope.type = type;
                    if(type == 'sms')
                        $scope.text = content;
                    else
                        $scope.text = $sce.trustAsHtml(content);
                    $scope.closeDialog = function () {
                        $mdDialog.hide();
                    };

                }],
                locals: {
                    content: text,
                    type: type
                }
            });

        }

        function deleteTemplate(ev) {

            if ($scope.selectedTemplate.length !== 0) {
                var confirm = $mdDialog.confirm()
                    .title('Are you sure?')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');

                $mdDialog.show(confirm).then(function () {

                    TemplateBuilderService.deleteTemplate($scope.selectedTemplate[0].id).then(function (response) {
                        $mdToast.show($mdToast.simple().textContent(response.data.msg).position("bottom left").parent(angular.element(document.getElementById('content'))));
                        $scope.getTemplates();
                    });

                }, function () {

                });

            }
        }

        initialise();

    }
})();
