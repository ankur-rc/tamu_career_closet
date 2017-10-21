(function () {
    'use strict';

    angular.module('fleet')
        .controller('DriverController', controller);

    controller.$inject = ['$scope', '$mdToast', '$mdDialog', '$timeout', 'drivers', 'DriverService'];

    /*@ngInject */
    function controller($scope, $mdToast, $mdDialog, $timeout, drivers, DriverService) {

        $scope.drivers = drivers;
        $scope.viewLoaded = false;

        //functions
        $scope.showDetails = showDetails;
        $scope.back = back;
        $scope.deleteDriver = deleteDriver;        
        $scope.convertCamelCase = convertCamelCase;

        ////////////////////////////////////////////////////////////////////////////////////////////////////////

        function showDetails(id) {
            var id = "#" + id;
            var $ripple = $(id+".ripple")
            var $layer = $(id+".layered-content");
            $ripple.addClass("rippling");
            var $buttonWrapper = $(id+ ".button-wrapper");
            $buttonWrapper.addClass("clicked")

            setTimeout(function() {
                $layer.addClass("active");
            }, 1600);

        };

        function back(id) {
            var id = "#" + id;
            var $ripple = $(id+".ripple"),
            $buttonWrapper = $(id+ ".button-wrapper"),
            $layer = $(id+ ".layered-content");
            $buttonWrapper.removeClass("clicked");
            $ripple.removeClass("rippling");
            $layer.removeClass("active");
        };
 
        function deleteDriver($event, id) {
            $mdDialog.show({
                    fullscreen: true,
                    targetEvent: $event,
                    template: '<md-dialog flex flex-gt-md="40">' +
                        '  <md-toolbar layout="row" layout-align="center center">Delete driver</md-toolbar>' +
                        '  <md-dialog-content layout-padding>' +
                        '          <div layout="column" layout-align="center center">Are you sure you want to delete the driver?</div>' +
                        '  </md-dialog-content>' +
                        '  <md-dialog-actions>' +
                        '    <md-button ng-click="deleteDriver()" class="md-accent md-raised">' +
                        '      Yes' +
                        '    </md-button>' +
                        '    <md-button ng-click="closeDialog()" class="md-primary">' +
                        '      Cancel' +
                        '    </md-button>' +
                        '  </md-dialog-actions>' +
                        '</md-dialog>',
                    controller: ['$scope', '$mdDialog', '$timeout', 'driverID' ,'DriverService', function Controller($scope, $mdDialog, $timeout, driverID, DriverService) {
                        $scope.driverID = driverID;
                        $scope.closeDialog = function () {
                            $mdDialog.hide();
                        };

                        $scope.deleteDriver = function () {
                            DriverService.deleteDriver(driverID).then(function (response) {
                                if (!response.data.success) {
                                    $mdToast.show($mdToast.simple()
                                        .textContent(response.data.msg ? response.data.msg : "Driver deletion failed!")
                                        .position("bottom right").parent(document.body));
                                    $mdDialog.hide();
                                } else {
                                    $mdToast.show($mdToast.simple()
                                        .textContent(response.data.msg ? response.data.msg : "Driver deleted successfully!")
                                        .position("bottom right").parent(document.body));
                                    $mdDialog.hide();
                                }
                            });
                            $mdDialog.hide();
                        }
                    }],
                    locals: {
                        driverID: id
                    }
                });
        }

        function convertCamelCase(text) {
            var result = text.replace( /([A-Z])/g, " $1" );
            return result.charAt(0).toUpperCase() + result.slice(1);
        }

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

        $timeout(function() {
            $scope.viewLoaded = true;
            staggerAnimateIntro();
        }, 500);
    }

    
})();