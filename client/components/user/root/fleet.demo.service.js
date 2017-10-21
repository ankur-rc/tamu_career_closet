(function () {
    'use strict';

    angular
        .module('fleet')
        .service('DaasDemoService', Service);

    Service.$inject = ['API', '$http', '$timeout'];

    /* @ngInject */
    function Service(API, $http, $timeout) {

        var devices;
        //My vehicles
        this.getMyDevices = getMyDevices;
        this.saveMyDevicesToLocalStorage = saveMyDevicesToLocalStorage;
        this.getMyDevicesFromLocalStorage = getMyDevicesFromLocalStorage;
        this.saveNewDeviceToLocalStorage = saveNewDeviceToLocalStorage;

        this.getAllDevices = getAllDevices;
        this.saveAllDevices = saveAllDevices;

        //device registration
        this.getDeviceTypes = getDeviceTypes;
        this.getTandC = getTandC;
        this.getActivationSteps = getActivationSteps;
        this.getServicesMap = getServicesMap;
        /////////////////////////////////////////////////////////

        function getMyDevices() {
            //return $timeout(function () {
            return {
                names: ['My Sedan', 'My Car'],
                icons: ['img/vehicles/sedan.svg', 'img/vehicles/car-with-spare-tire.svg'],
                status: ['Active', 'Inactive'],
                alerts: [3, 4],
                lastAlert: ["12:00 am, 12 Sep 2016", "No alerts"],
                manufacturers: ['Oscorp', 'Oscorp'],
                models: ['Model X', 'Model Y'],
                yearOfManufacture: [2000, 2001],
                registrationDate: ['1 Jan 2016', '2 Feb 2013'],
                alertList: [
                    [{
                            date: "12:00 am, 12 Sep 2016",
                            description: "The engine is over heated!",
                            done: false
                        }, {
                            date: "9:00 am, 3 Sep 2016",
                            description: "Rear-left tyre pressure is too low",
                            done: false
                        }, {
                            date: "5:00 pm, 17 Feb 2016",
                            description: "You are running low on gas",
                            done: false
                        }, {
                            date: "5:00 pm, 8 July 2013",
                            description: "Your car servicing appointment is due",
                            done: false
                        }, {
                            date: "5:00 pm, 17 Feb 2016",
                            description: "Your road-trip is due tomorrow. Fuel is insufficient.",
                            done: false
                        }

                    ],
                    [

                    ],

                ],
                notifications: [],
                engineType: ['5 Litre V12', '6 Litre V8']
            };
            //}, 500);
        }

        function saveAllDevices(deviceList) {
            devices = deviceList;
        }

        function getAllDevices() {
            return $timeout(function () {
                return devices;
            }, 500);
        }

        function saveMyDevicesToLocalStorage() {
            getMyDevices().then(function (devices) {
                var devices = devices;
                localStorage.setItem('devices', JSON.stringify(devices));
            });

        }

        function getMyDevicesFromLocalStorage() {
            var devicesString = localStorage.getItem('devices');
            var devices = JSON.parse(devicesString);

            console.log(devices);
            return devices;
        }

        function saveNewDeviceToLocalStorage(devices) {
            localStorage.setItem('devices', JSON.stringify(devices));
        }

        function getDeviceTypes() {
            return $timeout(function (domainType) {
                switch (domainType) {
                    case 'auto':
                        return [{
                            id: 0,
                            name: 'Personal'
                        }, {
                            id: 1,
                            name: 'Commercial'
                        }];
                    case 'ca':
                        return [{
                            id: 0,
                            name: 'Washing Machine'
                        }, {
                            id: 1,
                            name: 'Refrigerator'
                        }, {
                            id: 2,
                            name: 'Microwave Oven'
                        }, {
                            id: 3,
                            name: 'Coffee Machine'
                        }];
                    default:
                        return [{
                            id: 0,
                            name: 'Personal'
                        }, {
                            id: 1,
                            name: 'Commercial'
                        }];
                }
            }, 750);
        }

        function getTandC() {
            return $timeout(function (domainType) {
                switch (domainType) {
                    case 'auto':
                        return "Auto t&c";
                    case 'ca':
                        return "CA t&c";
                    default:
                        return "Welcome to DaaS B2C App. This page ('Notice') states the terms and conditions of the App. Please review this Notice carefully. By accessing, browsing, or using the App(\"Use\"), all users and viewers (\"You,\" \"you,\" \"User,\" or \"user\") acknowledge acceptance of the " + "terms and conditions listed in this Notice. If you do not accept the terms and conditions listed in this Notice, please do not use the App. Oscorp Auto and its subsidiaries reserve the right to update this Notice from time to time in its sole discretion. You should review this Notice periodically" + "for updates and changes.";
                }
            }, 500);
        }

        function getActivationSteps() {
            return $timeout(function (domainType) {
                switch (domainType) {
                    case 'auto':
                        return "";
                    case 'ca':
                        return "CA t&c";
                    default:
                        return "../../img/device-act.jpg";
                }
            }, 500);
        }

        function getServicesMap() {
            return $timeout(function () {
                return [{
                    id: 0,
                    name: 'Connected Car',
                    status: false,
                    subservices: [{
                        id: 0,
                        name: 'Engine Overheat Alert',
                        status: false,
                        optIn: {
                            sms: false,
                            email: false
                        },
                        info: 'Get an alert when your vehicle\'s engine overheats'
                    }, {
                        id: 1,
                        name: 'Low Tire Pressure Alert',
                        status: false,
                        optIn: {
                            sms: false,
                            email: false
                        },
                        info: 'Get an alert when your vehicle\'s tire pressure gets low.'
                    }, {
                        id: 2,
                        name: 'Low Engine Oil Alert',
                        status: false,
                        optIn: {
                            sms: false,
                            email: false
                        },
                        info: 'Get an alert when your vehicle engine oil goes lower than the threshold.'
                    }]
                }, {
                    id: 1,
                    name: 'Diagnostics',
                    status: false,
                    subservices: [{
                        id: 0,
                        name: 'Battery Degradation',
                        status: false,
                        optIn: {
                            sms: false,
                            email: false
                        },
                        info: 'Get an alert if a battery degradation anomaly is detected.'
                    }, {
                        id: 1,
                        name: 'Engine Maintenance',
                        status: false,
                        optIn: {
                            sms: false,
                            email: false
                        },
                        info: 'Get a periodic maintenance alert.'
                    }]
                }];
            }, 500);
        }


    }
})();