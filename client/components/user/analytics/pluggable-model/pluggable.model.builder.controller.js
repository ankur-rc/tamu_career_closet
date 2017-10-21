(function () {
    'use strict';

    angular
        .module('fleet')
        .controller('PluggableModelBuilderController', Controller);

    Controller.$inject = ['$scope', '$timeout', 'PluggableModelBuilderService', '$mdToast', '$mdDialog', '$state'];

    /* @ngInject */
    function Controller($scope, $timeout, PluggableModelBuilderService, $mdToast, $mdDialog, $state) {

        //////////////////////////////////////////////////declarations////////////////////////////////////////////////////////////

        $scope.$state = $state;
        $scope.messageModelTemplate = [];
        $scope.mappingList = [];
        $scope.selectedMessageModelIndex = undefined;
        $scope.messageModelName = "";
        $scope.modelType = "machineLearning";
        $scope.pmmlFile;
        $scope.modelName = "";
        $scope.arithmeticExpression = "";

        //functions
        $scope.getMessageModelTemplate = getMessageModelTemplate;
        $scope.addToMappingList = addToMappingList;
        $scope.deleteFromMappingList = deleteFromMappingList;
        $scope.selectAll = selectAll;
        $scope.deselectAll = deselectAll;
        $scope.createModel = createModel;

        ////////////////////////////////////////////////////definitions///////////////////////////////////////////////////////////

        function addToMappingList(index) {
            $scope.mappingList.push($scope.messageModelTemplate[index]);
            $scope.messageModelTemplate.splice(index, 1);
        }

        function deleteFromMappingList(index) {
            $scope.messageModelTemplate.push($scope.mappingList[index]);
            $scope.mappingList.splice(index, 1);
        }

        function selectAll() {
            $scope.mappingList = $scope.mappingList.concat($scope.messageModelTemplate);
            $scope.messageModelTemplate.splice(0, $scope.messageModelTemplate.length);
        }

        function deselectAll() {
            $scope.messageModelTemplate = $scope.messageModelTemplate.concat($scope.mappingList);
            $scope.mappingList.splice(0, $scope.mappingList.length);
        }

        function createModel() {
            var model = {
                name: $scope.modelName,
                subDomainId: $scope.subDomainList[$scope.selectedSubDomainIndex].subDomainId,
                modelType: "arithmetic",
                featureSeq: $scope.mappingList,
                expression: $scope.arithmeticExpression,
                fileData: undefined
            }

            if ($scope.modelType !== 'arithmetic') {
                model.modelType = $scope.mlModel;
                model.fileData = $scope.pmmlFile;
                //console.log(model);
                PluggableModelBuilderService.submitModelWithFile(model).then(function (response) {
                    $scope.pmmlFile.result = response.data;
                    $mdToast.show($mdToast.simple().textContent(response.data.msg).position("bottom left").parent(angular.element(document.getElementById('content'))));
                }, function (response) {
                    if (response.status > 0) {
                        $scope.errorMsg = response.status + ': ' + response.data.msg;
                        $mdToast.show($mdToast.simple().textContent($scope.errorMsg).position("bottom left").parent(angular.element(document.getElementById('content'))));
                    }
                }, function (evt) {
                    $scope.pmmlFile.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                });
            } else {
                //console.log(model);
                PluggableModelBuilderService.submitModelWithExpression(model).then(function (response) {
                    $mdToast.show($mdToast.simple().textContent(response.data.msg).position("bottom left").parent(angular.element(angular.element(document.getElementById('content')))));
                });
            }

        }

        function getMessageModelTemplate(id) {
            //console.log(id);
            PluggableModelBuilderService.getMessageModel(id).then(function (response) {
                if (response.data.success === true) {
                    var messageModelJSONArray = response.data.ruleFilters;
                    for(var i=0; i<messageModelJSONArray.length; i++) {
                        if(messageModelJSONArray[i].parentKey === 'assetDataList')
                            $scope.messageModelTemplate.push(messageModelJSONArray[i].id);
                    }
                    //console.log($scope.messageModelTemplate);
                } else {
                    $mdToast.show($mdToast.simple().textContent(response.data.msg).position("bottom left").parent(angular.element(document.body)));
                }
            });
        };

        $scope.$watch('selectedSubDomainIndex', function () {
            if ($scope.selectedSubDomainIndex !== undefined) {
                $scope.messageModelName = $scope.subDomainList[$scope.selectedSubDomainIndex].messageModelValue;
                $scope.messageModelKey = $scope.subDomainList[$scope.selectedSubDomainIndex].messageModelKey;
                getMessageModelTemplate($scope.messageModelKey);
            }
        });
    }
})();