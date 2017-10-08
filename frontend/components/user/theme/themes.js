(function () {
    'use strict';

    angular.module('fleet').constant('Themes', {

        "Tamu":{
            primary:"tamuprimary",
            accent: "tamuaccent",
            warn: 'tamuwarn',
            background: 'grey'
        },
        "Nero_Noctis":{
            primary:"grey",
            primaryHue: 900,
            accent: "light-blue",
            warn: 'amber',
            dark:true
        },
        "Azzuro_Giallo": {
            primary: 'light-blue',
            accent: 'amber',
            warn: 'brown',
            background: 'grey'
        },
        "Grigio_Arancio": {
            primary: 'blue-grey',
            accent: 'orange',
            warn: 'red',
            background: 'grey'
        },
        "Blue_Rosso": {
            primary: 'blue',
            accent: 'pink',
            warn: 'red',
            background: 'grey'
        },
        "Verde_Mantis": {
            primary: 'green',
            accent: 'lime',
            warn: 'orange',
            background: 'grey'
        }
    })
})();