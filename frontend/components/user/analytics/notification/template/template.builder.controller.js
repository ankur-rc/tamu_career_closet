(function () {
    'use strict';

    angular
        .module('fleet')
        .controller('TemplateBuilderController', Controller);

    Controller.$inject = ['$scope', '$timeout', '$q', '$mdToast', '$state', '$interval', '$mdDialog', 'TemplateBuilderService'];

    /* @ngInject */
    function Controller($scope, $timeout, $q, $mdToast, $state, $interval, $mdDialog, TemplateBuilderService) {
        $scope.$state = $state;

        var templateList = [];
        $scope.refinedTemplateList = [];
        $scope.template = {
            new: true,
            data: {
                id: undefined,
                name: undefined,
                type: 'sms',
                stream: 'Alert',
                text: undefined
            }
        };

        $scope.showBuilder = false;
        $scope.tinymceOptions = {
            inline: false,
            plugins: 'advlist autolink link image lists charmap print preview table code textcolor colorpicker fullscreen contextmenu',
            contextmenu: "link image colorpicker inserttable | cell row column deletetable",
            skin: 'lightgray',
            theme: 'modern',
            selector: 'div'
        };

        $scope.submitTemplate = submitTemplate;
        $scope.getTemplatesForType = getTemplatesForType;

        var streamMap = ['Welcome', 'VHR', 'Alert'];
        var typeMap = ['sms', 'email'];

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        $scope.$watchCollection('selectedTemplate', function (newVal, oldVal, scope) {
            if (newVal != oldVal) {
                if (newVal) {
                    scope.template.data.id = newVal.id;
                    scope.template.data.stream = mapIdToName('stream', undefined, newVal.stream);
                    scope.template.data.text = newVal.content;
                }
            }
        }, true);

        $scope.$watch('template.new', function (newVal, oldVal, scope) {
            if (oldVal === false && newVal === true) {
                scope.template.data.id = undefined;
                scope.template.data.text = undefined;
                scope.template.data.name = undefined;
            }
        });

        $scope.$watch('template.data.type', function (newValue, oldValue, scope) {
            console.log(scope.template.data.type);
            if (newValue != oldValue) {
                scope.template.data.id = undefined;
                scope.template.data.text = undefined;
                scope.template.data.name = undefined;
                scope.refinedTemplateList = [];
                scope.selectedTemplate = undefined;
            }
        });

        function refineTemplatesforType() {
            $scope.refinedTemplateList = [];
            for (var i = 0; i < templateList.length; i++) {
                if (templateList[i].notificationType === $scope.template.data.type)
                    $scope.refinedTemplateList.push(templateList[i]);
            }
            console.log($scope.refinedTemplateList);
        }

        function mapIdToName(type, id, name) {
            var map = [];

            if (type === 'type')
                map = typeMap;
            else if (type === 'stream')
                map = streamMap;

            if (id) {
                return map[id - 1];
            } else if (name) {
                for (var i = 0; i < map.length; i++) {
                    if (name === map[i])
                        return i + 1;
                }
            }
        }

        function submitTemplate() {
            var data = {};

            if ($scope.template.new == true) {
                data = {
                    name: $scope.template.data.name,
                    notificationType: $scope.template.data.type,
                    subType: $scope.template.data.stream,
                    content: $scope.template.data.text,
                    createdTime: Math.round(new Date().getTime()/1000),
                    alertType: "High Speed"
                };

                console.log(data);
                //create the template
                TemplateBuilderService.submitTemplate(data).then(function (response) {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : (response.data.success ? "Created successfully." : "Failed to create template."))
                        .position("bottom right").parent(angular.element(angular.element(document.getElementById('content')))));
                    $state.go('main.analytics.notification.template');
                    //$scope.getTemplates();
                });
            } else {
                data = {
                    id: $scope.template.data.id,
                    name: $scope.template.data.name,
                    notificationType: $scope.template.data.type,
                    subType: $scope.template.data.stream,
                    content: $scope.template.data.text,
                    updatedTime: new Date().getTime(),
                    alertType: "High Speed"
                };

                TemplateBuilderService.updateTemplate(data).then(function (response) {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : (response.data.success ? "Updated successfully." : "Failed to update template."))
                        .position("bottom right").parent(angular.element(angular.element(document.getElementById('content')))));

                });
            }
        }

        function getTemplatesForType() {
            return TemplateBuilderService.getAllTemplates().then(function (response) {
                if (response.data.success) {
                    templateList = response.data.response;
                    refineTemplatesforType();
                } else {
                    $mdToast.show($mdToast.simple().textContent(response.data.msg ? response.data.msg : "Error occured.").position("bottom right").parent(angular.element(document.getElementById('content'))));
                }
            });
        }

    }


})();
