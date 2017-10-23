(function () {
    'use strict';

    angular.module('cc').service('RoutePermissionsProvider', Service);

    Service.$inject = ['ROLES', 'OemTypeResolver'];

    /* @ngInject */
    function Service(ROLES, OemTypeResolver) {
        // ////////////////////////////////////////////////////////declarations///////////////////////////////////////

        this.getRouteConfig = getRouteConfig;
        this.generatePermissibleRoutes = generatePermissibleRoutes;

        // ///////////////////////////////////////////////////////functions////////////////////////////////////////////

        function getRouteConfig() {

            var routeConfig = [{
                    name: 'Dashboard',
                    href: 'main.dashboard',
                    icon: 'dashboard',
                    roles: [ROLES.ADMIN, ROLES.USER],
                    type: 'link'
                },
                {
                    name: 'Drivers',
                    type: 'sub-menu',
                    icon: 'driver-parent',
                    children: [{
                        name: 'View',
                        href: 'main.driver.view',
                        icon: 'driver-view',
                        roles: [ROLES.ADMIN],
                        type: 'link'
                    }, {
                        name: 'Add',
                        href: 'main.driver.add',
                        icon: 'driver-add',
                        roles: [ROLES.ADMIN],
                        type: 'link'
                    }]
                },
                {
                    name: 'Vehicles',
                    type: 'sub-menu',
                    icon: 'vehicle-parent',
                    children: [{
                        name: 'View',
                        href: 'main.vehicle.view',
                        icon: 'vehicle-view',
                        roles: [ROLES.ADMIN],
                        type: 'link'
                    }, {
                        name: 'Add',
                        href: 'main.vehicle.add',
                        icon: 'vehicle-add',
                        roles: [ROLES.ADMIN],
                        type: 'link'
                    }]
                },
                {
                    name: 'Cargo',
                    type: 'sub-menu',
                    icon: 'cargo-parent',
                    children: [{
                        name: 'View',
                        href: 'main.cargo.view',
                        icon: 'cargo-view',
                        roles: [ROLES.ADMIN],
                        type: 'link'
                    }, {
                        name: 'Add',
                        href: 'main.cargo.add',
                        icon: 'cargo-add',
                        roles: [ROLES.ADMIN],
                        type: 'link'
                    }]
                },
                {
                    name: 'Routes',
                    type: 'sub-menu',
                    icon: 'route-parent',
                    children: [{
                        name: 'View',
                        href: 'main.route.view',
                        icon: 'route-view',
                        roles: [ROLES.ADMIN],
                        type: 'link'
                    }, {
                        name: 'Add',
                        href: 'main.route.add',
                        icon: 'route-add',
                        roles: [ROLES.ADMIN],
                        type: 'link'
                    }]
                },
                {
                    name: 'Trips',
                    type: 'sub-menu',
                    icon: 'trip-parent',
                    children: [{
                            name: 'View',
                            href: 'main.trip.view',
                            icon: 'trip-view',
                            roles: [ROLES.ADMIN],
                            type: 'link'
                        }, {
                            name: 'Add',
                            href: 'main.trip.add',
                            icon: 'trip-add',
                            roles: [ROLES.ADMIN],
                            type: 'link'
                        }
                        // ,
                        // {
                        //     name: 'Metrics',
                        //     href: 'main.trip.metrics',
                        //     icon: 'trip-metrics',
                        //     roles: [ROLES.ADMIN],
                        //     type: 'link'
                        // }
                    ]
                }, {
                    name: 'Location Services',
                    href: 'main.locateVehicle',
                    icon: 'locate-vehicle',
                    roles: [ROLES.ADMIN],
                    type: 'link'
                },
                
                {
                    name: 'Analytics',
                    type: 'sub-menu',
                    icon: 'analytics-parent',
                    children: [{
                        name: 'Notification',
                        icon: 'notification-parent',
                        type: 'sub-menu',
                        children: [{
                            name: 'Template',
                            href: 'main.analytics.notification.template',
                            icon: 'template',
                            roles: [ROLES.ADMIN],
                            type: 'link'
                        }]
                    }, {
                        name: 'Message Model',
                        href: 'main.analytics.modelMsg',
                        icon: 'message-model',
                        roles: [ROLES.ADMIN],
                        type: 'link'
                    },
                    {
                        name: 'Rule Builder',
                        href: 'main.rule-builder',
                        icon: 'rule-builder',
                        roles: [ROLES.ADMIN],
                        type: 'link'
                    },
                    {
                        name: 'Pluggable Model',
                        href: 'main.pluggable-model',
                        icon: 'pluggable-model',
                        roles: [ROLES.ADMIN],
                        type: 'link'
                    }]
                }
            ];

            return routeConfig;
        }

        function generateRoutesByRole(routes, role) {

            var returnRoutes = [];

            for (var i = 0; i < routes.length; i++) {

                if (typeof (routes[i].roles) !== 'undefined') {

                    var index = routes[i].roles.indexOf(role);
                    if (index !== -1) {
                        returnRoutes.push({
                            name: routes[i].name,
                            href: routes[i].href,
                            icon: routes[i].icon,
                            class: routes[i].class,
                            type: 'link'
                        });
                    }

                } else {
                    var childRoutes = [];
                    childRoutes = generateRoutesByRole(routes[i].children, role);
                    if (childRoutes.length > 0) {
                        returnRoutes.push({
                            name: routes[i].name,
                            icon: routes[i].icon,
                            class: routes[i].class,
                            type: 'sub-menu',
                            children: childRoutes
                        });
                    }
                }

            }

            return returnRoutes;
        }

        function generateRoutesByClass(routes, clazz) {

            var returnRoutes = [];

            for (var i = 0; i < routes.length; i++) {

                if (typeof (routes[i].class) !== 'undefined') {

                    if (routes[i].type == 'link') {

                        var index = routes[i].class.indexOf(clazz);
                        if (index !== -1) {
                            returnRoutes.push({
                                name: routes[i].name,
                                href: routes[i].href,
                                icon: routes[i].icon,
                                type: 'link'
                            });
                        }

                    } else {
                        var childRoutes = [];
                        childRoutes = generateRoutesByClass(routes[i].children, clazz);
                        if (childRoutes.length > 0) {
                            returnRoutes.push({
                                name: routes[i].name,
                                icon: routes[i].icon,
                                type: 'sub-menu',
                                children: childRoutes
                            });
                        }
                    }
                } else {
                    if (routes[i].type == 'link') {
                        returnRoutes.push({
                            name: routes[i].name,
                            href: routes[i].href,
                            icon: routes[i].icon,
                            type: 'link'
                        });

                    } else {
                        var childRoutes = [];
                        childRoutes = generateRoutesByClass(routes[i].children, clazz);
                        if (childRoutes.length > 0) {
                            returnRoutes.push({
                                name: routes[i].name,
                                icon: routes[i].icon,
                                type: 'sub-menu',
                                children: childRoutes
                            });
                        }
                    }
                }

            }

            return returnRoutes;
        }

        function generatePermissibleRoutes(role) {
            var existingRoutes = this.getRouteConfig();
            // console.log('existing routes are' +
            // JSON.stringify(existingRoutes));

            var permissibleRoutes = [];

            var permissibleRoutesByRole = generateRoutesByRole(existingRoutes, role);
            permissibleRoutes = generateRoutesByClass(permissibleRoutesByRole, undefined);

            // console.log('permissible routes:' +
            //     JSON.stringify(permissibleRoutesByRole));

            return permissibleRoutesByRole;
        }
    }
})();