(function () {
    angular.module('fleet.dashboard')
        .factory('AsyncMapsLoader', function ($window, $q) {

            //variables
            var asyncUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCdFbK7mW-Hh8FP13MKRW0EvwrvoeZtXbs&libraries=geometry,places&callback=',
                mapsDefer = $q.defer();

            var afterMapInit = $window.googleMapsInitialized = function () {
                console.log("callback called");
                // init 'animate marker' script
                $window.addMarkerAnimate();
                mapsDefer.resolve();
            };

            var asyncLoad = asyncLoad;

            //definitions
            function asyncLoad(asyncUrl, callbackName) {
                try {
                    if (typeof google === 'undefined' && typeof google.maps === 'undefined') {
                        //do nothing, it will throw an exception
                    } else {
                        // in case maps has already loaded
                        console.log("Maps is already loaded!");
                        afterMapInit();
                    }
                } catch (e) {
                    console.log("Loading maps...");
                    var script = document.createElement('script');
                    script.src = asyncUrl + callbackName;
                    document.body.appendChild(script);
                }
            };

            //Start loading google maps
            asyncLoad(asyncUrl, 'googleMapsInitialized');

            //Usage: AsyncMapsLoader.mapsInitialized.then(callback)
            return {
                mapsInitialized: mapsDefer.promise
            };
        })
}());