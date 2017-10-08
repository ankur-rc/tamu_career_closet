(function () {
    'use strict';

    angular.module('fleet')
        .controller('UserProfileController', controller);

    controller.$inject = ['$rootScope', '$mdDialog', '$mdToast', 'UserService', 'AuthService', 'userProfile', 'PreferencesService', 'ProfileAvatars'];

    /*@ngInject */
    function controller($rootScope, $mdDialog, $mdToast, UserService, AuthService, userProfile, PreferencesService, ProfileAvatars) {

        var vm = this;
        //variables
        vm.user = angular.copy(userProfile);

        vm.edit = {
            profile: {
                firstName: "",
                lastName: "",
                address: "",
                primaryEmail: "",
                alternateEmail: "",
                countryCode: 91,
                mobileNumber: "",
                otherNumberCountryCode: 91,
                otherNumber: "",
                uom: 1
            },

            password: {
                oldPassword: undefined,
                password: undefined,
                confirmPwd: undefined
            }
        };

        vm.oemList = undefined;

        _initialiseProfile();

        //functions
        vm.saveProfile = saveProfile;
        vm.getAllUoms = getAllUoms;
        vm.changeProfileAvatar = changeProfileAvatar;
        vm.changePassword = changePassword;
        vm.openThemer = openThemer;
        vm.displayCurrentProfileAvatar = displayCurrentProfileAvatar;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        function saveProfile() {
            //Check if user entered a mobile number
            if (vm.edit.profile.mobileNumber == "") {
                delete vm.edit.profile['mobileNumber'];
                delete vm.edit.profile['countryCode'];
            }

            // Only send UOM ID
            vm.edit.profile.uom = vm.edit.profile.uom.id;

            UserService.editProfile(vm.edit.profile).then(function (response) {

                    if (response.data.success === true) {
                        $mdToast.show($mdToast.simple()
                            .textContent(response.data.msg ? response.data.msg : "Updated profile successfully!")
                            .position("bottom right").parent(document.body));
                        $rootScope.uom.id = vm.edit.profile.uom;
                    } else {
                        $mdToast.show($mdToast.simple()
                            .textContent(response.data.msg ? response.data.msg : "Could not update profile.")
                            .position("bottom right").parent(document.body));
                    }
                },
                function (data) {});
        }

        function getAllUoms() {
            vm.uomList = vm.uomList || null;

            return UserService.getAllUoms().then(function (response) {
                if (response.data.success) {
                    vm.uomList = response.data.response;
                } else {
                    $mdToast.show($mdToast.simple().textContent(response.data.msg).position("bottom right").parent(document.body));
                }
            })
        }

        function changeProfileAvatar($event) {
            $mdDialog.show({
                fullscreen: true,
                targetEvent: $event,
                clickOutsideToClose: true,
                template: '<md-dialog flex flex-gt-md="60" aria-label="Profile Avatar Dialog" >' +
                    '  <md-toolbar layout="row" layout-align="center center">Choose your profile avatar</md-toolbar>' +
                    '  <md-dialog-content layout-padding>' +
                    '  <div flex layout="column" style="overflow-y:auto" layout-align="start center" layout-margin>' +
                    '          <div layout="row" flex layout-padding layout-wrap><md-icon flex="20" class="fade-animation" style="height:auto;width:auto;outline:none"' +
                    '               ng-repeat="avatar in dialog.avatars" ng-hide="dialog.avatarsLoading" ng-class="{selectedAvatar: dialog.selectedAvatar == avatar}" layout-align="center center" md-svg-icon="{{avatar}}" ng-click="dialog.setAvatar(avatar)"/></div>' +
                    '          <div layout="column" class="fade-animation" ng-show="dialog.avatarsLoading" layout-align="center center">' +
                    '               <md-progress-circular class="md-primary" md-mode="indeterminate"></md-progress-circular>' +
                    '          </div>' +
                    '  </div>' +
                    '  </md-dialog-content>' +
                    '  <md-dialog-actions>' +
                    '    <md-button ng-click="dialog.saveAvatar()" class="md-primary md-raised">' +
                    '      Save' +
                    '    </md-button>' +
                    '  </md-dialog-actions>' +
                    '</md-dialog>',
                controllerAs: 'dialog',
                controller: ['$mdDialog', '$timeout', 'ProfileAvatars', function Controller($mdDialog, $timeout, ProfileAvatars) {

                    var dialog = this;
                    dialog.avatars = ProfileAvatars;
                    console.log(dialog.avatars);
                    dialog.closeDialog = function () {
                        $mdDialog.cancel();
                    };
                    dialog.setAvatar = function (icon) {
                        dialog.selectedAvatar = icon;
                    }

                    dialog.avatarsLoading = true;
                    dialog.saveAvatar = function () {
                        if (typeof dialog.selectedAvatar !== 'undefined') {
                            $mdDialog.hide(dialog.selectedAvatar);
                        } else {
                            $mdDialog.cancel();
                        }
                    }

                    function initialise() {
                        dialog.avatarsLoading = false;
                    }

                    initialise();
                }]
                // ,
                // locals: {
                //     avatars: ProfileAvatars
                // }
            }).then(function (icon) {
                if (icon) {
                    //console.log(icon);
                    PreferencesService.setProfileAvatar(icon);
                }
            }, function () {});
        }

        function changePassword() {
            UserService.resetPassword(vm.edit.password).then(function (response) {
                if (response.data.success === true) {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Your password has been changed successfully!")
                        .position("bottom right").parent(document.body));
                    //logout();
                } else {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Could not reset password.")
                        .position("bottom right").parent(document.body));
                }
            })
        }

        function openThemer($event) {
            $mdDialog.show({
                fullscreen: true,
                targetEvent: $event,
                clickOutsideToClose: true,
                templateUrl: 'components/user/theme/select.theme.modal.html',
                controller: 'ThemeSelectController',
                controllerAs: 'vm'
            });
        }


        // private functions
        function _initialiseProfile() {
            angular.forEach(userProfile, function (value, key) {
                if (key === 'uomDTO') {
                    vm.edit.profile.uom = value;
                    $rootScope.uom.id = vm.edit.profile.uom.id;
                    console.log($rootScope.uom);
                } else
                    vm.edit.profile[key] = value;
            });
            console.log("", vm.edit.profile);
            vm.user.icon = displayCurrentProfileAvatar();
        }

        function displayCurrentProfileAvatar() {
            var avatar = PreferencesService.getProfileAvatar()
            vm.user.icon = avatar;
            return avatar;
        }

        vm.getAllUoms();

    }

})();