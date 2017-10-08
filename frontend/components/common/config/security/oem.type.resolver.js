(function () {
    'use strict';

    angular.module('fleet').service('OemTypeResolver', Service);

    angular.module('fleet').constant('OEM_TYPES', {
        AUTO: "Auto",
        CE: "Consumer Electronics"
    });

    Service.$inject = ['UtilityService', 'OEM_TYPES'];

    /* @ngInject */
    function Service(UtilityService, OEM_TYPES) {
        // ////////////////////////////////////////////////////////declarations///////////////////////////////////////

        this.oemType = UtilityService.getOemType();
        this.getConfig = getConfig;
        this.getType = getType;
        this.getStateConfig = getStateConfig;

        var stateMap = {
            [OEM_TYPES.AUTO]: {
                "main.devices": {
                    templateUrl: "template/devices.html",
                    controller: "DevicesController"
                }
            },
            [OEM_TYPES.CE]: {
                "main.devices": {
                    templateUrl: "template/devices.html",
                    controller: "DevicesController"
                }
            }
        };

        var linkMap = {
            [OEM_TYPES.AUTO]: {
                "main.devices": {
                    icon: "vehicles",
                    name: "My Vehicles"
                },
                "main.registerDevice": {
                    icon: "addVehicle",
                    name: "Add Vehicle"
                },
                "main.device-detail": {
                    icon: "vehicleStatus",
                    name: "Vehicle Status"
                }
            },
            [OEM_TYPES.CE]: {
                "main.devices": {
                    icon: "devices",
                    name: "My Devices"
                },
                "main.registerDevice": {
                    icon: "addDevice",
                    name: "Add Device"
                },
                "main.device-detail": {
                    icon: "deviceStatus",
                    name: "Device Status"
                }
            }

        };

        // ///////////////////////////////////////////////////////functions////////////////////////////////////////////

        function getType() {
            return this.oemType;
        }

        function getConfig() {

            if (linkMap[this.oemType])
                return linkMap[this.oemType];
            else
                return linkMap[OEM_TYPES.CE];
        }

        function getStateConfig() {
            if (stateMap[this.oemType])
                return stateMap[this.oemType];
            else
                return stateMap[OEM_TYPES.CE];
        }


    }
})();