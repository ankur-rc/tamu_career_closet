(function () {
    'use strict';

    angular
        .module('fleet')
        .controller('RuleBuilderEngineController', Controller);

    Controller.$inject = ['$scope', '$timeout', 'RuleBuilderEngineService', 'TemplateBuilderService', 'ModelMsgService', 'VehicleService', '$mdToast', '$mdDialog', 'initData', '$state'];

    /* @ngInject */
    function Controller($scope, $timeout, RuleBuilderEngineService, TemplateBuilderService, ModelMsgService, VehicleService, $mdToast, $mdDialog, initData, $state) {

        //////////////////////////////////////////////////declarations////////////////////////////////////////////////////////////

        //for custom rule 
        $scope.customMessageModels = [];
        $scope.customMessageModel;
        //
        $scope.pluggableModelTemplate = [];
        $scope.messageModelList = [];
        $scope.messageModelTemplate;
        $scope.jarExecutionPath;

        $scope.rule = {
            name: undefined,            
            action: {
                type: 'Store'
            },
            model: {
                id: undefined,
                template: undefined
            },
            notification: {
                email: null,
                sms: null
            }
        };
        $scope.generatedRule = "n/a";

        //functions
        $scope.loadVehicleTypes = loadVehicleTypes;
        $scope.goBack = goBack;
        $scope.getMessageModelTemplate = getMessageModelTemplate;
        $scope.getCustomMessageModels = getCustomMessageModels;
        $scope.buildFilterList = buildFilterList;
        $scope.generateRule = generateRule;

        ////////////////////////////////////////////////////definitions///////////////////////////////////////////////////////////

        function initialise() {
            //populate data
            TemplateBuilderService.getTemplateByType('email').then(function(response){
                $scope.emailList = response.data.response;
            });

            TemplateBuilderService.getTemplateByType('sms').then(function(response){
                $scope.smsList = response.data.response;
            });            

            //initialise rule-builder
            $timeout(function () {

                var qb = $('#qb');

                var options = {

                    filters: [
                        {
                            id: 'Select',
                            parentKey: 'N/A',
                            label: 'Select',
                            type: 'integer',
                            operators: ['equal']
                        }],
                    operators: RuleBuilderEngineService.getOperatorMap()
                };
                // init
                qb.queryBuilder(options);

            },1000);
        }

        function loadVehicleTypes() {
            VehicleService.getVehicleTypes().then(function(response){
                $scope.vehicleTypes = response.data.response;
            })
        }

        function goBack() {
            $state.go('main.rule-builder');
        }

        function getMessageModelTemplate(id) {
            RuleBuilderEngineService.getMessageModel(id).then(function (response) {
                if (response.data.success === true) {
                    $scope.messageModelTemplate = response.data.ruleFilters;
                } else {
                    $mdToast.show($mdToast.simple().textContent(response.data.msg).position("bottom right").parent(angular.element(document.body)));
                }
            });
        };

        function getCustomMessageModels() {
            console.log($scope.rule.vehicleType);
            RuleBuilderEngineService.getCustomRuleAssets(JSON.parse($scope.rule.vehicleType).id).then(function (response) {
                if (response.data.success === true) {
                    $scope.customMessageModels = response.data.customRuleAssets;
                } else {
                    $mdToast.show($mdToast.simple().textContent(response.data.msg).position("bottom right").parent(angular.element(document.body)));
                }
            });
        }

        function getCustomMessageModel(modelName) {
            RuleBuilderEngineService.getCustomRuleFilters(modelName, JSON.parse($scope.rule.vehicleType).id).then(function (response) {
                if (response.data.success === true) {
                    $scope.messageModelTemplate = response.data.customRuleFilters;
                } else {
                    $mdToast.show($mdToast.simple().textContent(response.data.msg).position("bottom right").parent(angular.element(document.body)));
                }
            });
        }

        function getMessageModel(type) {
            ModelMsgService.getModelMsgsByVehicleType(type).then(function(response){
                $scope.rule.messageModel = response.data.response;
            })
        }


        function generateRule($event) {
            var qb = $('#qb');

            var data = qb.queryBuilder('getRules');
            $scope.generatedRule = RuleBuilderEngineService.ruleExpressionParser(data, data.condition, $scope.rule.type.parent, $scope.messageModelTemplate);

            $mdDialog.show({
                fullscreen: true,
                targetEvent: $event,
                template:
                '<md-dialog flex="initial">' +
                '   <md-toolbar layout class="white-text" layout-align="center center">' +
                '   <div flex="20"></div><div flex="60" class="white-text" layout layout-align="center center">Generated Rule</div>' +
                '       <div layout flex="20" layout-align="end center" ng-init="jsonTree=false">' +
                '           <md-switch class="md-accent no-margin" ng-model="jsonTree" aria-label="Toggle json Tree">' +
                '           </md-switch>' +
                '       </div>' +
                '</md-toolbar>' +
                '   <md-dialog-content layout-padding>' +
                '       <json-formatter ng-show="jsonTree" class="fade-animation" open="1" json="ruleData" style="overflow:auto"></json-formatter>' +
                '       <pre ng-show="!jsonTree">{{ ruleData | json }}</pre></md-dialog-content>' +
                '   <md-dialog-actions layout-align="center center" layout="row">' +
                '       <md-button ng-disabled="formValidity" ng-click="submit()" class="md-primary md-raised">' +
                '           Submit' +
                '       </md-button>' +
                '       <md-button ng-click="closeDialog()" class="md-accent md-raised">' +
                '           Close' +
                '       </md-button>' +
                '   </md-dialog-actions>' +
                '</md-dialog>',
                controller: ['$scope', '$mdDialog', 'rule', 'metadata', 'formValidity', 'jarExecutionPath', function Controller($scope, $mdDialog, rule, metadata, formValidity, jarExecutionPath) {
                    $scope.rule = rule;
                    $scope.formValidity = formValidity;
                    $scope.ruleData = {
                        "ruleName": metadata.name,
                        "ruleType": metadata.type.parent,
                        "ruleAction": [
                            {
                                "action": metadata.action.type,
                                "uri": metadata.action.uri
                            }],
                        "windowType": metadata.type.subtype,
                        "windowUOM": "SEC",
                        "windowValue": metadata.type.size,
                        "rules": $scope.rule,
                        "jarExecutionPath": jarExecutionPath
                    }

                    $scope.closeDialog = function () {
                        $mdDialog.hide();
                    };

                    $scope.submit = function () {

                        var data = {
                            message: JSON.stringify($scope.ruleData),
                            name: metadata.name,
                            emailTemplateId: metadata.emailTemplateId,
                            smsTemplateId: metadata.smsTemplateId,
                            messageModelId: metadata.messageModel.id,
                            vehicleTypeId: JSON.parse(metadata.vehicleType).id,
                            createdTime: Date.now()/1000
                        }

                        RuleBuilderEngineService.submitRule(data).then(function (response) {
                            $mdToast.show($mdToast.simple().textContent(response.data.msg).position("bottom right").parent(angular.element(document.getElementById('content'))));
                            $scope.closeDialog();
                        });
                    }
                }],
                locals: {
                    rule: $scope.generatedRule,
                    metadata: $scope.rule,
                    formValidity: $scope.ruleForm.$invalid,
                    jarExecutionPath: $scope.jarExecutionPath
                }
            });
        }

        function buildFilterList(ruleType, messageModel) {

            var type = ruleType;
            var template = messageModel;

            var filters = [];
            for (var i = 0; i < messageModel.length; i++) {
                filters.push(RuleBuilderEngineService.filterMapper(type, template[i]));
            }

            var ruleBuilder = $('#qb');

            ruleBuilder.queryBuilder('reset');
            ruleBuilder.queryBuilder('setFilters', true, filters);            
        }

        

        ///////////////////////////////////////////////watchers////////////////////////////////////////////////////

        $scope.$watch('rule.messageModel', function (value) {
            if(typeof value !== 'undefined')
                getMessageModelTemplate(value.id);
        }); 

        $scope.$watch('rule.vehicleType', function (value) {
            if(typeof value !== 'undefined') {                
                getMessageModel(JSON.parse(value).type);
            }
                
        });      


        $scope.$watchGroup(['rule.type.parent', 'messageModelTemplate'], function (newValues, oldValues, scope) {
            /*console.log(newValues);
            console.log(oldValues);*/
            if (newValues[0] === undefined || newValues[1] === undefined || (newValues[0] === oldValues[0] && newValues[1] === oldValues[1])) {
                //console.log("nothing to do.");
            } else {
                console.log(newValues);
                scope.buildFilterList(newValues[0], newValues[1], $scope.subdomainId);
            }
        });

        $scope.$watch('customMessageModel', function (val) {
            //console.log(val);
            if (val) {
                //console.log($scope.customMessageModels);
                for (var i = 0; i < $scope.customMessageModels.length; i++) {
                    var value = $scope.customMessageModels[i];
                    //console.log(value);
                    if (value.messageModelName == val) {
                        $scope.jarExecutionPath = value.jarExecutionPath;
                        getCustomMessageModel(value.messageModelName);
                    }
                }
            }
        });

        ////////////////////////////
        initialise();
    }
})();