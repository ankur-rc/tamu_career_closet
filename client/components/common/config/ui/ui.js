(function () {
    angular.module('cc').config(['$mdThemingProvider', '$provide', 'Themes', function ($mdThemingProvider, $provide, Themes) {

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

    angular.module('cc').config(['$mdIconProvider', function ($mdIconProvider) {
        // Configure URLs for icons specified by [set:]id.
        $mdIconProvider
            .icon('login:user', 'img/login/user.svg')
            .icon('login:password', 'img/login/password.svg')
            .icon('login:logout', 'img/login/logout.svg')

            .icon('link:home', 'img/links/home.svg')
            .icon('link:fullscreen', 'img/links/fullscreen.svg')
            .icon('link:inventory', 'img/clothes/suit.svg')
            .icon('link:users', 'img/clothes/users.svg')
            .icon('link:reports', 'img/clothes/audit.svg')
            .icon('link:settings', 'img/clothes/settings.svg')
            .icon('link:help', 'img/clothes/help.svg')

            .icon('metrics:suits', 'img/clothes/suit.svg')
            .icon('metrics:users', 'img/clothes/users.svg')
            .icon('metrics:returns', 'img/clothes/return.svg')
            .icon('metrics:audit', 'img/clothes/audit.svg')
            .icon('metrics:clean', 'img/clothes/rack.svg')
            .icon('metrics:default', 'img/clothes/defaulter.svg')
            

           

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

    angular.module('cc').config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }]);

})();