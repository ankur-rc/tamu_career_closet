(function () {
    'use strict';

    angular
        .module('fleet.dashboard')
        .service('TripMetricsService', Service);

    Service.$inject = [];

    /* @ngInject */
    function Service() {

        ////////////////////////////////////declarations//////////////////////////////////////////////////////////
        this.eventMapping = {
            1: {
                event: 'HARD BRAKING',
                icon: 'components/user/dashboard/img/event_markers/marker_brown.png',
                timelineIcon: 'components/user/dashboard/img/event_markers/hb.png'
            },
            2: {
                event: 'HARD ACCELERATION',
                icon: 'components/user/dashboard/img/event_markers/marker_green.png',
                timelineIcon: 'components/user/dashboard/img/event_markers/ha.png'
            },
            3: {
                event: 'TIGHT CORNERING',
                icon: 'components/user/dashboard/img/event_markers/marker_red.png',
                timelineIcon: 'components/user/dashboard/img/event_markers/tc.png'
            },
            4: {
                event: 'OVER SPEEDING',
                icon: 'components/user/dashboard/img/event_markers/marker_pink.png',
                timelineIcon: 'components/user/dashboard/img/event_markers/os.png'
            },
            5: {
                event: 'ENGINE IDLING',
                icon: 'components/user/dashboard/img/event_markers/marker_yellow.png',
                timelineIcon: 'components/user/dashboard/img/event_markers/ei.png'
            }
        }

        this.mapIconByEventType = mapIconByEventType;
        this.mapTlIconByEventType = mapTlIconByEventType;


        function mapIconByEventType(eventType) {
            var icon = this.eventMapping[1].icon;
            try {
                icon = this.eventMapping[eventType].icon;
            } catch (e) {
                console.log(e);
            }

            return icon;
        }

        function mapTlIconByEventType(eventType) {
            var icon = this.eventMapping[1].timelineIcon;
            try {
                icon = this.eventMapping[eventType].timelineIcon;
            } catch (e) {
                console.log(e);
            }

            return icon;
        }

        this.timelineOptions = {
            "align": "center",
            "autoResize": true,
            "editable": false,
            "selectable": true,
            "orientation": "bottom",
            "showCurrentTime": true,
            "showMajorLabels": true,
            "showMinorLabels": true
        };

        this.carIcon = "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z";
    }
})();