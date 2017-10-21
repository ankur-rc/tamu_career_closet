(function () {
    'use strict';

    angular
        .module('fleet.dashboard')
        .service('DashboardService', Service);

    Service.$inject = [];

    /* @ngInject */
    function Service() {

        ////////////////////////////////////declarations//////////////////////////////////////////////////////////

        this.mapsConfig = {
            theme: {
                dark: [{
                    "featureType": "all",
                    "stylers": [{
                            "hue": "#05acff"
                        },
                        {
                            "invert_lightness": "true"
                        },
                        {
                            "saturation": 30
                        }
                    ]
                }],
                light: [{
                    stylers: [{
                        hue: "#2c3e50"
                    }, {
                        saturation: 250
                    }]
                }, {
                    featureType: "road",
                    elementType: "geometry",
                    stylers: [{
                        lightness: 50
                    }, {
                        visibility: "simplified"
                    }]
                }, {
                    featureType: "road",
                    elementType: "labels",
                    stylers: [{
                        visibility: "off"
                    }]
                }]
            }
        }

        // this.gaugeConfig = {
        //     title: 'My gauge',
        //     titleFontColor: 'blue',
        //     value: 1234.358,
        //     valueFontColor: 'red',
        //     min: 0,
        //     max: 1337,
        //     valueMinFontSize: undefined,
        //     titleMinFontSize: undefined,
        //     labelMinFontSize: undefined,
        //     minLabelMinFontSize: undefined,
        //     maxLabelMinFontSize: undefined,
        //     hideValue: false,
        //     hideMinMax: false,
        //     hideInnerShadow: false,
        //     width: undefined,
        //     height: undefined,
        //     relativeGaugeSize: undefined,
        //     gaugeWidthScale: 0.5,
        //     gaugeColor: 'grey',
        //     showInnerShadow: true,
        //     shadowOpacity: 0.5,
        //     shadowSize: 3,
        //     shadowVerticalOffset: 10,
        //     levelColors: ['#00FFF2', '#668C54', '#FFAF2E', '#FF2EF1'],
        //     customSectors: [{
        //             color: "#ff0000",
        //             lo: 0,
        //             hi: 750
        //         },
        //         {
        //             color: "#00ff00",
        //             lo: 750,
        //             hi: 1000
        //         },
        //         {
        //             color: "#0000ff",
        //             lo: 1000,
        //             hi: 1337
        //         }
        //     ],
        //     noGradient: false,
        //     label: 'Green label',
        //     labelFontColor: 'green',
        //     startAnimationTime: 0,
        //     startAnimationType: undefined,
        //     refreshAnimationTime: undefined,
        //     refreshAnimationType: undefined,
        //     donut: undefined,
        //     donutAngle: 90,
        //     counter: true,
        //     decimals: 2,
        //     symbol: 'X',
        //     formatNumber: true,
        //     humanFriendly: true,
        //     humanFriendlyDecimal: true,
        //     textRenderer: function (value) {
        //         return value;
        //     }
        // }

        this.carIcon = "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z";

    }
})();