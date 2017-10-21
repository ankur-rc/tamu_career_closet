(function () {
    'use strict';

    angular.module('fleet').controller('ThemeSelectController', Controller);

    Controller.$inject = ['$mdDialog', 'ThemerService'];

    /*@ngInject*/
    function Controller($mdDialog, ThemerService) {

        var vm = this;
        vm.themes = ThemerService.availableThemes();
        vm.setTheme = setTheme;
        vm.hide = hide;
        vm.formatName = formatName;
        vm.isCurrentTheme = isCurrentTheme;

        function setTheme(name) {
            ThemerService.setTheme(name);
        }

        function hide() {
            $mdDialog.cancel();
        }

        function formatName(key) {
            var index = key.indexOf('_');
            return key.substring(0, index) + " " + key.substring(index + 1);
        }

        function _getCurrentTheme() {
            return ThemerService.getThemeFromLocalStorage();
        }

        function isCurrentTheme(key) {
            if (_getCurrentTheme() == key) {
                //console.log(_getCurrentTheme() + "==" + key);
                return true;
            } else {
                //console.log(_getCurrentTheme() + "!=" + key);
                return false;
            }
        }
    }
})();