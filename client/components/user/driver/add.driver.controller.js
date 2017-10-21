(function () {
    'use strict';

    angular.module('fleet')
        .controller('AddDriverController', controller);

    controller.$inject = ['$scope', '$mdToast', '$mdDialog', '$mdStepper', '$state', 'DriverService', 'PreferencesService', 'ProfileAvatars'];

    /*@ngInject */
    function controller($scope, $mdToast, $mdDialog, $mdStepper,$state, DriverService, PreferencesService, ProfileAvatars) {

        $scope.driver = {}

        //functions
        $scope.save = save;
        $scope.previousStep = previousStep;
        $scope.nextStep = nextStep;
        $scope.displayCurrentProfileAvatar = displayCurrentProfileAvatar;
        $scope.changeProfileAvatar = changeProfileAvatar;
        $scope.convertCamelCase = convertCamelCase;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        function save() {            
            //Convert all date-time parameters to epoch time
            $scope.driver.dob = new Date($scope.driver.dob).getTime()/1000;
            $scope.driver.issueDate = new Date($scope.driver.issueDate).getTime()/1000;
            $scope.driver.expiryDate = new Date($scope.driver.expiryDate).getTime()/1000;
            DriverService.addDriver($scope.driver).then(function (response) {
                    if (response.data.success === true) {
                        $mdToast.show($mdToast.simple()
                            .textContent(response.data.msg ? response.data.msg : "New driver added successfully!")
                            .position("bottom right").parent(document.body));
                        $state.go('main.driver.view');
                    } else {
                        $mdToast.show($mdToast.simple()
                            .textContent(response.data.msg ? response.data.msg : "Could not add driver.")
                            .position("bottom right").parent(document.body));
                    }
                },
                function (data) {});
        }     

        function previousStep() {
            var steppers = $mdStepper('stepper-demo');
            steppers.back();
        }   

        function nextStep() {
            var steppers = $mdStepper('stepper-demo');
            steppers.next();
        }

        function changeProfileAvatar($event) {
            $mdDialog.show({
                fullscreen: true,
                targetEvent: $event,
                clickOutsideToClose: true,
                template: '<md-dialog flex flex-gt-md="60">' +
                    '  <md-toolbar layout="row" layout-align="center center">Choose your profile avatar</md-toolbar>' +
                    '  <md-dialog-content layout-padding>' +
                    '  <div flex layout="column" style="overflow-y:auto" layout-align="start center" layout-margin>' +
                    '          <div layout="row" flex layout-padding layout-wrap><md-icon flex="20" class="fade-animation" style="height:auto;width:auto;outline:none"' +
                    '               ng-repeat="avatar in avatars" ng-hide="avatarsLoading" ng-class="{selectedAvatar: selectedAvatar == avatar}" layout-align="center center" md-svg-icon="{{avatar}}" ng-click="setAvatar(avatar)"/></div>' +
                    '          <div layout="column" class="fade-animation" ng-show="avatarsLoading" layout-align="center center">' +
                    '               <md-progress-circular class="md-primary" md-mode="indeterminate"></md-progress-circular>' +
                    '          </div>' +
                    '  </div>' +
                    '  </md-dialog-content>' +
                    '  <md-dialog-actions>' +
                    '    <md-button ng-click="saveAvatar()" class="md-primary md-raised">' +
                    '      Save' +
                    '    </md-button>' +
                    '  </md-dialog-actions>' +
                    '</md-dialog>',
                controller: ['$scope', '$mdDialog', '$timeout', 'avatars', function Controller($scope, $mdDialog, $timeout, avatars) {

                    $scope.avatars = ProfileAvatars;
                    $scope.closeDialog = function () {
                        $mdDialog.cancel();
                    };
                    $scope.setAvatar = function (icon) {
                        $scope.selectedAvatar = icon;
                    }

                    $scope.avatarsLoading = true;
                    $scope.saveAvatar = function () {
                        if (typeof $scope.selectedAvatar !== 'undefined') {
                            $mdDialog.hide($scope.selectedAvatar);
                        } else {
                            $mdDialog.cancel();
                        }
                    }

                    function initialise() {
                        $scope.avatarsLoading = false;
                    }

                    initialise();
                }],
                locals: {
                    avatars: ProfileAvatars
                }
            }).then(function (icon) {
                if (icon) {
                    console.log(icon);
                    //return icon;
                    //PreferencesService.setProfileAvatar(icon);
                }
            }, function () {});
        }

        function displayCurrentProfileAvatar() {
            var avatar = PreferencesService.getProfileAvatar()
            $scope.photo = avatar;
            return avatar;
        }

        function convertCamelCase(text) {
            var result = text.replace( /([A-Z])/g, " $1" );
            return result.charAt(0).toUpperCase() + result.slice(1);
        }
        
    }

})();