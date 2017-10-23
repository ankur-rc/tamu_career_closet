(function () {
    'use strict';

    angular
        .module('cc')
        .directive('navbarBigLinks', directive);

    directive.$inject = [];

    /* @ngInject */
    function directive() {
        var directive = {
            restrict: 'EA',
            scope: {
                routes: '='
            },
            templateUrl: "components/common/directives/navbar-links/navbar.big.links.html",
            priority: 500,
            controller: ctlr,
            controllerAs: 'vm'
        };

        function ctlr($state, TweenMax, $timeout) {

            var vm = this;
            vm.toggleChild = toggleChild;
            vm.state = state;

            function state(link) {
                //console.log(link);
                $state.go(link);
            }

            function toggleChild($event, linkname) {

                //var arrow = angular.element($event.currentTarget.childNodes[0].children[2])
                var arrow = angular.element($event.currentTarget.nextSibling.nextSibling);
                var link = 'navlink.' + linkname;
                var element = document.getElementById(link);
                //var element = $event.currentTarget.nextSibling;
                // console.log(element);

                var tl1 = new TimelineMax();

                function hideElement() {
                    TweenMax.set(element, {
                        display: "none",
                        height: "",
                        opacity: 1
                    })
                };

                if (element.style.display === 'none') {

                    tl1.add(TweenMax.set(element, {
                            display: "block"
                        }))
                        .from(element, 1, {
                            height: 0,
                            autoAlpha: 0,
                            ease: Power3.easeInOut
                        });

                    $timeout(function () {
                        arrow.addClass('active');
                        tl1.play();
                    });

                } else {
                    tl1.to(element, 1, {
                            height: 0,
                            autoAlpha: 0,
                            ease: Power3.easeInOut
                        })
                        .add(hideElement);

                    $timeout(function () {
                        arrow.removeClass('active');
                        tl1.play();
                    });

                }

            }
        }

        ctlr.$inject = ['$state', 'TweenMax', '$timeout'];
        return directive;
    }
})();