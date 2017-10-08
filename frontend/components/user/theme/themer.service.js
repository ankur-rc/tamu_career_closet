(function () {
    'use strict';

    angular.module('fleet').service('ThemerService', service);


    service.$inject = ['$mdTheming', 'themeProvider', 'Themes'];

    /*@ngInject*/
    function service($mdTheming, themeProvider, Themes) {

        this.availableThemes = availableThemes;
        this.setTheme = setTheme;
        this.getThemeFromLocalStorage = getThemeFromLocalStorage;
        this.saveThemeToLocalStorage = saveThemeToLocalStorage;

        /////////////////////////////////////////////////////////////////////

        function getThemeFromLocalStorage() {
            var theme = undefined;
            try {
                theme = window.localStorage['fleet.theme'];
            } catch (e) {
                theme = 'Azzuro_Giallo';
            }

            return theme;
        }

        function saveThemeToLocalStorage(theme) {
            window.localStorage['fleet.theme'] = theme;
        }

        function availableThemes() {
            return Themes;
        }

        function setTheme(name) {
            themeProvider.setDefaultTheme(name);
            $mdTheming.setBrowserColor({
                theme: name,
                palette: 'primary',
                hue: '900'
            });
            this.saveThemeToLocalStorage(name);
        }

    }

})()