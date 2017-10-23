(function () {
    'use strict';

    angular
        .module('cc')
        .service('UserService', Service);

    Service.$inject = ['API', '$http', '$httpParamSerializerJQLike'];

    /* @ngInject */
    function Service(API, $http, $httpParamSerializerJQLike) {
        this.login = login;
        this.register = register;
        this.forgotPassword = forgotPassword;
        this.getUserProfile = getUserProfile;
        this.editProfile = editProfile;
        this.resetPassword = resetPassword;
        this.resetForgottenPassword = resetForgottenPassword;

        ///////////////////////////////////////////////////////////

        function login(credentials) {
            return $http({
                url: API + "auth/login",
                method: 'POST',
                data: $httpParamSerializerJQLike({
                    email: credentials.name,
                    password: credentials.password
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        }

        function register(credentials) {
            return $http({
                url: API + "signup",
                method: 'POST',
                data: $httpParamSerializerJQLike({
                    name: credentials.firstName,
                    // lastName: credentials.lastName,
                    // role: credentials.role,
                    // phone: credentials.phoneNumber,
                    // username: credentials.username,
                    password: credentials.password,
                    password_confirmation: credentials.confirmPassword,
                    email: credentials.primaryEmail
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        }

        function forgotPassword(username) {
            return $http({
                url: API + "forgotPassword",
                method: 'POST',
                data: $httpParamSerializerJQLike({
                    username: username
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
        }

        function resetPassword(credentials) {
            return $http({
                url: API + "resetPassword",
                method: 'POST',
                data: {
                    password: credentials.password,
                    confirmPwd: credentials.confirmPwd
                }
            })
        }

        function getUserProfile(id) {
            return $http({
                url: API + '/user/get/id/'+id,
                method: 'GET'
            });
        }

        function editProfile(newProfile) {
            return $http({
                url: API + "profile",
                method: 'POST',
                data: $httpParamSerializerJQLike(newProfile),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        }

        function resetPassword(newPassword) {
            return $http({
                url: API + "profile/changePassword",
                method: 'POST',
                data: $httpParamSerializerJQLike(newPassword),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        }

        function resetForgottenPassword(password, token) {
            return $http({
                url: API + "/resetPassword",
                method: 'POST',
                data: $httpParamSerializerJQLike({
                    password: password.new,
                    confirmPwd: password.confirm,
                    token: token
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
        }
    }
})();