(function () {
    var app = angular.module('cc');
    var animation = function ($window, TweenLite) {

        //console.log("inside slide animation");
        return {
            beforeAddClass: function (element, className, done) {

                //console.log("inside before add class");
                if (className === 'ng-hide') {
                    TweenLite.to(element, 0.3, {
                        x: "-100%",
                        onComplete: done
                    });
                } else {
                    done();
                }

                console.log(done);
            },
            removeClass: function (element, className, done) {
                //console.log("inside remove class");
                if (className === 'ng-hide') {
                    TweenLite.set(element, {
                        x: "-100%"
                    });
                    TweenLite.to(element, 0.3, {
                        x: "+=100%",
                        onComplete: done
                    });
                } else {
                    done();
                }
            }
        };
    }

    animation.$inject = ['$window', 'TweenLite'];
    app.animation('.slide-animation', animation);
}());