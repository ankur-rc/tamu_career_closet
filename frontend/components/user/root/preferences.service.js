(function () {
    'use strict';

    angular
        .module('fleet')
        .service('PreferencesService', Service);

    Service.$inject = ['$window', 'ProfileAvatars'];

    /* @ngInject */
    function Service($window, ProfileAvatars) {

        ////////////////////////////////////declarations//////////////////////////////////////////////////////////

        this.setBrandLogo = setBrandLogo;
        this.forBrandLogo = forBrandLogo;
        this.resetPreferences = resetPreferences;
        this.setProfileAvatar = setProfileAvatar;
        this.getProfileAvatar = getProfileAvatar;

        ////////////////////////////////////definitions///////////////////////////////////////////////////////////

        function setBrandLogo(preference) {
            $window.localStorage['cc.brandLogo'] = preference;
        };

        function forBrandLogo() {
            return typeof ($window.localStorage['cc.brandLogo']) === 'null' ? "" : $window.localStorage['cc.brandLogo'];
        };

        function setProfileAvatar(avatar) {
            $window.localStorage['fleet.avatar'] = avatar;
        }

        function getProfileAvatar() {
            var avatar = $window.localStorage['fleet.avatar'];
            if (!avatar) {
                avatar = ProfileAvatars[0];
                this.setProfileAvatar(avatar);
            }

            //console.log(ProfileAvatars);
            //console.log(avatar);
            return avatar
        }

        function resetPreferences() {
            $window.localStorage.removeItem('cc.brandLogo');
        };
    }
})();