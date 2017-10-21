(function () {
    'use strict';

    angular
        .module('fleet')
        .controller('RuleBuilderController', Controller);

    Controller.$inject = ['$scope', '$mdToast', '$mdMedia', '$mdDialog', '$timeout', '$state', 'RuleBuilderService'];

    /* @ngInject */
    function Controller($scope, $mdToast, $mdMedia, $mdDialog, $timeout, $state, RuleBuilderService) {

        $scope.$state = $state;
        $scope.rules = [];
        $scope.selectedRule = [];
        $scope.query = {
            order: 'id',
            limit: 5,
            page: 1
        };

        $scope.addRule = addRule;
        $scope.getRules = getRules;
        $scope.viewRuleText = viewRuleText;
        $scope.deleteRule = deleteRule;
        $scope.uploadCustomRule = uploadCustomRule;

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////

        function initialise() {
            $scope.getRules();
        }

        function addRule(ev) {
            $state.go('main.rule-builder.rule-engine');
        }

        function getRules() {
            $scope.rulesPromise = RuleBuilderService.getRules().then(function (response) {
                if (response.data.success) {
                    //console.log(response);
                    $scope.rules = response.data.response;
                } else {
                    $mdToast.show($mdToast.simple().textContent(response.data.msg ? response.data.msg : "Error occured.").position("bottom right").parent(angular.element(document.getElementById('content'))));
                }
            });
        }

        function viewRuleText($event, text) {

            $mdDialog.show({
                fullscreen:true,
                targetEvent: $event,
                template: '<md-dialog flex="initial">' +
                '  <md-toolbar layout="row" class="white-text" layout-align="center center">' +
                '       <div flex="20"></div><div flex="60" class="white-text" layout layout-align="center center">Rule</div>'+
                '       <div layout flex="20" layout-align="end center" ng-init="jsonTree=false">' +
                '           <md-switch class="md-accent no-margin" ng-model="jsonTree" aria-label="Toggle json Tree">' +
                '           </md-switch>' +
                '       </div>' +
                '  </md-toolbar>' +
                '  <md-dialog-content layout-padding layout-fill>' +
                '       <json-formatter ng-show="jsonTree" class="fade-animation" open="1" json="text" style="overflow:auto"></json-formatter>' +
                '       <pre ng-show="!jsonTree">{{ text | json }}</pre></md-dialog-content>' +
                '  </md-dialog-content>' +
                '  <md-dialog-actions>' +
                '    <md-button ng-click="closeDialog()" class="md-primary">' +
                '      Close' +
                '    </md-button>' +
                '  </md-dialog-actions>' +
                '</md-dialog>',
                controller: ['$scope', '$mdDialog', 'text', function Controller($scope, $mdDialog, text) {
                    $scope.text = JSON.parse(text);
                    $scope.closeDialog = function () {
                        $mdDialog.hide();
                    };
                }],
                locals: {
                    text: text
                }
            });

        }

        function deleteRule(ev) {

            if ($scope.selectedRule.length !== 0) {
                var confirm = $mdDialog.confirm()
                    .title('Are you sure you want to delete selected rule?')
                    .targetEvent(ev)
                    .ok('Yes')
                    .cancel('No');

                $mdDialog.show(confirm).then(function () {

                    RuleBuilderService.deleteRule($scope.selectedRule[0].id).then(function (response) {
                        $mdToast.show($mdToast.simple().textContent(response.data.msg).position("bottom left").parent(angular.element(document.getElementById('content'))));
                        $scope.getRules();
                    });

                }, function () {

                });

            }
        }

        function uploadCustomRule(ev) {
            $mdDialog.show({
                controller: 'CustomRuleController',
                templateUrl: 'components/user/analytics/rule-builder/dialog/upload.custom.rule.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: true
            }).then(function () {
                $scope.getRules();
            }, function () {
                $scope.getRules();
            });
        };

        //////////////////////////////////////////////////////////////////////////////////////

        initialise();
    }
})();