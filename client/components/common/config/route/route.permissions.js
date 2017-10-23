(function () {
    'use strict';

    angular.module('cc').service('RoutePermissionsProvider', Service);

    Service.$inject = ['ROLES'];

    /* @ngInject */
    function Service(ROLES) {
        // ////////////////////////////////////////////////////////declarations///////////////////////////////////////

        this.getRouteConfig = getRouteConfig;
        this.generatePermissibleRoutes = generatePermissibleRoutes;

        // ///////////////////////////////////////////////////////functions////////////////////////////////////////////

        function getRouteConfig() {
            var routeConfig = [{
                    name: 'Home',
                    href: 'main.home',
                    icon: 'home',
                    roles: [ROLES.ADMIN, ROLES.USER],
                    type: 'link'
                },
                {
                    name: 'Inventory',
                    href: 'main.inventory',
                    icon: 'inventory',
                    roles: [ROLES.ADMIN],
                    type: 'link'
                },
                {
                    name: 'Users',
                    href: 'main.users',
                    icon: 'users',
                    roles: [ROLES.ADMIN],
                    type: 'link'
                },
                {
                    name: 'Reports',
                    href: 'main.reports',
                    icon: 'reports',
                    roles: [ROLES.ADMIN],
                    type: 'link'
                },
                {
                    name: 'Settings',
                    href: 'main.settings',
                    icon: 'settings',
                    roles: [ROLES.ADMIN, ROLES.USER],
                    type: 'link'
                },
                {
                    name: 'Help',
                    href: 'main.help',
                    icon: 'help',
                    roles: [ROLES.ADMIN, ROLES.USER],
                    type: 'link'
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
            // permissibleRoutes = generateRoutesByClass(permissibleRoutesByRole, undefined);

            // console.log('permissible routes:' +
            //     JSON.stringify(permissibleRoutesByRole));

            return permissibleRoutesByRole;
        }
    }
})();