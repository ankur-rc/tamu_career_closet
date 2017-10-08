(function () {
    'use strict';

    angular
        .module('fleet')
        .service('LocationService', Service);

    Service.$inject = ['API', '$http', '$httpParamSerializerJQLike'];

    /* @ngInject */
    function Service(API, $http, $httpParamSerializerJQLike) {
        
        this.getDeviceLocation = getDeviceLocation;
        this.getGeoFenceActions = getGeoFenceActions;
        this.setDeviceGeoFence = setDeviceGeoFence;
        this.getDeviceGeoFence = getDeviceGeoFence;
        this.setDeviceCurfew = setDeviceCurfew;
        this.getDeviceCurfew = getDeviceCurfew;
        this.deleteDeviceCurfew = deleteDeviceCurfew;
        this.setDeviceSpeedLimit = setDeviceSpeedLimit;
        this.getDeviceSpeedLimit = getDeviceSpeedLimit;
        this.getGeoFenceEligibility = getGeoFenceEligibility;
        this.getCurfewEligibility = getCurfewEligibility;
        this.getSpeedLimitEligibility = getSpeedLimitEligibility;
        this.getPlaceName = getPlaceName;

        ///////////////////////// Function Definitions /////////////////////////////

        function getDeviceLocation() {
            return $http({
                url: API + "locate/all",
                method: 'POST'
            });
        }

        function getGeoFenceActions() {
            return $http({
                url: API + 'device/fenceArea',
                method: 'GET'
            });
        }   

        function setDeviceGeoFence(deviceId, geoDTO,  fenceAreaId) {
            return $http({
                url: API + "device/geofence",
                method: 'POST',
                data: $httpParamSerializerJQLike({
                    geoDTO: JSON.stringify(geoDTO),
                    deviceId: deviceId,
                    fenceAreaId: fenceAreaId
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
        }    

        function getDeviceGeoFence(deviceId) {
            return $http({
                url: API + "device/geofence",
                method: 'GET',
                params: {
                    deviceId : deviceId
                }
            })
        }

        function setDeviceCurfew(data) {
            return $http({
                url: API + "device/curfew",
                method: 'POST',
                data: data
            })
        }

        function getDeviceCurfew(deviceId) {
            return $http({
                url: API + "device/curfew",
                method: 'GET',
                params: {
                    deviceId : deviceId
                }
            })
        }

        function deleteDeviceCurfew(deviceId,day) {
            return $http({
                url: API + "device/curfew",
                method: 'DELETE',
                params: {
                    deviceId : deviceId,
                    day: day
                }
            })
        }

        function setDeviceSpeedLimit(data) {
            return $http({
                url: API + "device/speedLimit",
                method: 'POST',
                data: $httpParamSerializerJQLike(data),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
        }

        function getDeviceSpeedLimit(deviceId) {
            return $http({
                url: API + "device/speedLimit",
                method: 'GET',
                params: {
                    deviceId : deviceId
                }
            })
        }

        function getGeoFenceEligibility(deviceId) {
            return $http({
                url: API + "device/geofence/eligibility",
                method: 'GET',
                params: {
                    deviceId : deviceId
                }
            })
        }

        function getCurfewEligibility(deviceId) {
            return $http({
                url: API + "device/curfew/eligibility",
                method: 'GET',
                params: {
                    deviceId : deviceId
                }
            })
        }

        function getSpeedLimitEligibility(deviceId) {
            return $http({
                url: API + "device/speedLimit/eligibility",
                method: 'GET',
                params: {
                    deviceId : deviceId
                }
            })
        }

        function getPlaceName(lat,lng) {
            return $http({
                url: "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCdFbK7mW-Hh8FP13MKRW0EvwrvoeZtXbs&latlng="+lat+","+lng,
                method: 'GET'
            })
        }

    }
})();
