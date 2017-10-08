(function () {
    'use strict';

    angular.module('fleet')
        .controller('CargoController', controller);

    controller.$inject = ['$scope', '$mdToast', '$mdDialog', '$state', 'cargoes',
        '$timeout'];

    /*@ngInject */
    function controller($scope, $mdToast, $mdDialog, $state, cargoes, $timeout) {

        $scope.cargoes = cargoes;
        $scope.cargo = {};
        $scope.viewLoaded = false;

        $scope.showDetails = showDetails;
        $scope.deleteCargo = deleteCargo;
        $scope.back = back;
        $scope.editCargo = editCargo;


        ////////////////////////////////////////////////////////////////////////////////////////////////////////


        function getCargoes() {

            CargoService.getCargoes().then(function (response) {
                    if (response.data.success === true) {
                        $scope.cargoes = response.data.response;
                    } else {
                        $mdToast.show($mdToast.simple()
                            .textContent(response.data.msg ? response.data.msg : "Could not get list of cargoes.")
                            .position("bottom right").parent(document.body));
                    }
                },
                function (error) {
                    $mdToast.show($mdToast.simple()
                        .textContent(response.data.msg ? response.data.msg : "Server error ocurred!")
                        .position("bottom right").parent(document.body));
                });
        }

        function deleteCargo($event, id) {
            $mdDialog.show({
                fullscreen: true,
                targetEvent: $event,
                template: '<md-dialog flex flex-gt-md="40">' +
                    '  <md-toolbar layout="row" layout-align="center center">Terms and Conditions</md-toolbar>' +
                    '  <md-dialog-content layout-padding>' +
                    '          <div layout="column" layout-align="center center">Are you sure you want to delete the cargo?</div>' +
                    '  </md-dialog-content>' +
                    '  <md-dialog-actions>' +
                    '    <md-button ng-click="deleteCargo()" class="md-accent md-raised">' +
                    '      Yes' +
                    '    </md-button>' +
                    '    <md-button ng-click="closeDialog()" class="md-primary">' +
                    '      Cancel' +
                    '    </md-button>' +
                    '  </md-dialog-actions>' +
                    '</md-dialog>',
                controller: ['$scope', '$mdDialog', '$timeout', 'cargoID', 'CargoService', function Controller($scope, $mdDialog, $timeout, cargoID, CargoService) {

                    $scope.cargoID = cargoID;
                    $scope.closeDialog = function () {
                        $mdDialog.hide();
                    };
                    $scope.deleteCargo = function () {
                        CargoService.deleteCargo($scope.cargoID).then(function (response) {
                            if (!response.data.success) {
                                $mdToast.show($mdToast.simple()
                                    .textContent(response.data.msg ? response.data.msg : "Cargo deletion failed!")
                                    .position("bottom right").parent(document.body));
                                $mdDialog.hide();
                            } else {
                                $mdToast.show($mdToast.simple()
                                    .textContent(response.data.msg ? response.data.msg : "Cargo deleted successfully!")
                                    .position("bottom right").parent(document.body));
                                $mdDialog.hide();
                                $state.reload();
                            }
                        });
                        $mdDialog.hide();
                    }
                    }],
                locals: {
                    cargoID: id
                }
            });
        }

        function showDetails(id) {
            var id = "#" + id;
            var $ripple = $(id + ".ripple")
            var $layer = $(id + ".layered-content");
            $ripple.addClass("rippling");
            var $buttonWrapper = $(id + ".button-wrapper");
            $buttonWrapper.addClass("clicked")

            setTimeout(function () {
                $layer.addClass("active");
            }, 1600);

        };

        function back(id) {
            var id = "#" + id;
            var $ripple = $(id + ".ripple"),
                $buttonWrapper = $(id + ".button-wrapper"),
                $layer = $(id + ".layered-content");
            $buttonWrapper.removeClass("clicked");
            $ripple.removeClass("rippling");
            $layer.removeClass("active");
        };

        function staggerAnimateIntro() {
            var infoCards = angular.element(document.getElementsByClassName("card-container"));
            TweenMax.staggerFrom(infoCards, 0.8, {
                scale: 0.7,
                opacity: 0,
                delay: 0.5,
                ease: Power2.easeInOut,
                force3D: true
            }, 0.2);
        }

        $timeout(function () {
            $scope.viewLoaded = true;
            staggerAnimateIntro();
        }, 500);


        function editCargo($event, cargo) {
            $state.go('main.cargo.edit', {
                cargo: cargo
            });
        }

    }

})();
