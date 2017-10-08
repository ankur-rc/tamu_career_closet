(function () {

    angular.module('fleet').config(configuration)

    configuration.$inject = ['ChartJsProvider'];

    /* @ngInject */
    function configuration(ChartJsProvider) {
        ChartJsProvider.setOptions({
            colours: ['#00b0ff', '#0091ea', '#00BCD4', '#0288d1', '#803690', '#00ADF9', '#DCDCDC'],
            responsive: true
        });

        ChartJsProvider.setOptions('Doughnut', {
            animateScale: true
        });

        // Enable the hover preview feature
        //JSONFormatterConfigProvider.hoverPreviewEnabled = true;

    }
})();