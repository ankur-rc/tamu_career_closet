(function () {
    var app = angular.module("cc");
    app.animation(".root-ui-view-animation", function () {
        return {
            enter: function (element, done) {
                var tl = new TimelineLite()
                    .set(element, {
                        // scale: 0.5,
                        //y: +40,
                        autoAlpha: 0
                    })
                    .to(element, 0.5, {
                        // scale: 1,
                        //y: 0,
                        autoAlpha: 1,
                        ease: Power1.easeInOut
                    })
                    .add(done);
            },
            leave: function (element, done) {
                var tl = new TimelineLite()
                    .to(element, 0.0, {
                        //                        x: -100,
                        //                        scale: 0.5,
                        autoAlpha: 0,
                        //                        ease: Power1.easeInOut,
                        delay: 0.0,
                        display: 'none'
                    })
                    .add(done);
            }
        };
    });
}());