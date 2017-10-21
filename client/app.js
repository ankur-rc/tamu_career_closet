(function () {
    var app = angular.module("fleet", ["fleet.dashboard", "ui.router", "ngMaterial", "ngAnimate", "ngMessages", "perfect_scrollbar", "chart.js",
        "angular-rickshaw", "md.data.table", "angular-loading-bar", "ngFileUpload", "ngError", "ds.clock", "ui.tinymce", "ngMaterialDatePicker",
        "ngclipboard", "ui.router.grant", "mdSteppers", "frapontillo.gage"
    ]);

    app.constant('TweenLite', TweenLite);
    app.constant('TweenMax', TweenMax);

    app.constant('ROLES', {
        ADMIN: "admin",
        USER: "user"
    });

    app.constant('API', "http://");
}());