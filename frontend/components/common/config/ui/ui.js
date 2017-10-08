(function () {
    angular.module('fleet').config(['$mdThemingProvider', '$provide', 'Themes', function ($mdThemingProvider, $provide, Themes) {

        $mdThemingProvider.alwaysWatchTheme(true);
        //$mdThemingProvider.generateThemesOnDemand(true);

        $mdThemingProvider.definePalette('tamuprimary', {
            '50': 'eae0e0',
            '100': 'cbb3b3',
            '200': 'a88080',
            '300': '854d4d',
            '400': '6a2626',
            '500': '500000',
            '600': '490000',
            '700': '400000',
            '800': '370000',
            '900': '270000',
            'A100': 'ff6262',
            'A200': 'ff2f2f',
            'A400': 'fb0000',
            'A700': 'e10000',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': [
                '50',
                '100',
                '200',
                'A100'
            ],
            'contrastLightColors': [
                '300',
                '400',
                '500',
                '600',
                '700',
                '800',
                '900',
                'A200',
                'A400',
                'A700'
            ]
        });
        $mdThemingProvider.definePalette('tamuaccent', {
            '50': 'ffffff',
            '100': 'fff8ba',
            '200': 'fff382',
            '300': 'ffeb3a',
            '400': 'ffe81c',
            '500': 'fce300',
            '600': 'ddc700',
            '700': 'bfac00',
            '800': 'a09000',
            '900': '827500',
            'A100': 'fffffc',
            'A200': 'fff596',
            'A400': 'ffea30',
            'A700': 'ffe816',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': [
                '50',
                '100',
                '200',
                '300',
                '400',
                '500',
                '600',
                '700',
                '800',
                'A100',
                'A200',
                'A400',
                'A700'
            ],
            'contrastLightColors': [
                '900'
            ]
        });
        $mdThemingProvider.definePalette('tamuwarn', {
            '50': 'ffeef1',
            '100': 'ffa2b3',
            '200': 'ff6a86',
            '300': 'ff224c',
            '400': 'ff0433',
            '500': 'e4002b',
            '600': 'c50025',
            '700': 'a7001f',
            '800': '88001a',
            '900': '6a0014',
            'A100': 'ffe4e9',
            'A200': 'ff7e96',
            'A400': 'ff1844',
            'A700': 'fd0030',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': [
                '50',
                '100',
                '200',
                'A100',
                'A200'
            ],
            'contrastLightColors': [
                '300',
                '400',
                '500',
                '600',
                '700',
                '800',
                '900',
                'A400',
                'A700'
            ]
        });


        angular.forEach(Themes, function (value, key) {
            if (!value.dark) {
                $mdThemingProvider.theme(key).primaryPalette(value.primary)
                    .accentPalette(value.accent).warnPalette(value.warn)
                    .backgroundPalette(value.background);
            } else {
                $mdThemingProvider.theme(key).primaryPalette(value.primary)
                    .accentPalette(value.accent).warnPalette(value.warn)
                    .dark();
            }
        })

        var themeName = window.localStorage['fleet.theme'];
        if (!themeName) {
            themeName = "Tamu";
            window.localStorage['fleet.theme'] = themeName;
        }

        $mdThemingProvider.setDefaultTheme(themeName);
        $mdThemingProvider.enableBrowserColor({
            theme: themeName,
            palette: 'primary',
            hue: '900'
        });

        $provide.value('themeProvider', $mdThemingProvider);

    }]);

    angular.module('fleet').config(['$mdIconProvider', function ($mdIconProvider) {
        // Configure URLs for icons specified by [set:]id.
        $mdIconProvider
            .icon('login:user', 'img/login/user.svg')
            .icon('login:password', 'img/login/password.svg')
            .icon('login:logout', 'img/login/logout.svg')

            .icon('link:home', 'img/links/home.svg')
            .icon('link:fullscreen', 'img/links/fullscreen.svg')
            .icon('link:dashboard', 'img/links/dashboard.svg')
            .icon('link:driver-parent', 'img/links/delivery-man.svg')
            .icon('link:driver-view', 'img/links/driver-license.svg')
            .icon('link:driver-add', 'img/links/user-add.svg')
            .icon('link:vehicle-parent', 'img/links/sedan.svg')
            .icon('link:vehicle-view', 'img/links/driver-license.svg')
            .icon('link:vehicle-add', 'img/links/user-add.svg')
            .icon('link:route-parent', 'img/links/routes.svg')
            .icon('link:route-view', 'img/links/view-route.svg')
            .icon('link:route-add', 'img/links/add-route.svg')
            .icon('link:cargo-parent', 'img/links/cargo.svg')
            .icon('link:cargo-view', 'img/links/driver-license.svg')
            .icon('link:cargo-add', 'img/links/user-add.svg')
            .icon('link:trip-parent', 'img/links/trips.svg')
            .icon('link:trip-add', 'img/links/trip-add.svg')
            .icon('link:trip-view', 'img/links/routes.svg')
            .icon('link:trip-metrics', 'img/links/trip-metrics.svg')
            .icon('link:locate-vehicle', 'img/links/trip-metrics.svg')
            .icon('link:analytics-parent', 'img/links/stream-analytics.svg')
            .icon('link:notification-parent', 'img/links/notification-parent.svg')
            .icon('link:template', 'img/links/templates.svg')
            .icon('link:message-model', 'img/links/model_message.svg')
            .icon('link:rule-builder', 'img/links/rule-builder.svg')
            .icon('link:pluggable-model', 'img/links/pluggable-model.svg')

            .icon('vehicle:make', 'img/vehicles/car.svg')
            .icon('vehicle:passengers', 'img/vehicles/users.svg')
            .icon('vehicle:height', 'img/vehicles/resize.svg')
            .icon('vehicle:odometer', 'img/vehicles/dashboard.svg')
            .icon('vehicle:loadCap', 'img/vehicles/trolley.svg')

            .icon('menu:add', 'img/menu/add.svg')
            .icon('menu:remove', 'img/menu/remove.svg')


            .icon('profile:avatar1', 'img/profile-avatars/boy.svg')
            .icon('profile:avatar2', 'img/profile-avatars/boy-1.svg')
            .icon('profile:avatar3', 'img/profile-avatars/girl.svg')
            .icon('profile:avatar4', 'img/profile-avatars/girl-1.svg')
            .icon('profile:avatar5', 'img/profile-avatars/man.svg')
            .icon('profile:avatar6', 'img/profile-avatars/man-2.svg')
            .icon('profile:avatar7', 'img/profile-avatars/man-3.svg')
            .icon('profile:avatar8', 'img/profile-avatars/man-4.svg')
            .icon('profile:avatar9', 'img/profile-avatars/man-1.svg')
            .icon('profile:avatar10', 'img/profile-avatars/driver.svg');

    }]);

    angular.module('fleet').config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }]);

})();