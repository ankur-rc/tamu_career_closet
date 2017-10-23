// directive to take an angular variable containing file url
// and embedding an object with its data attribute pointing to that url.
// currently made to work for pdf files. 

(function () {
    'use strict';

    angular
        .module('cc')
        .directive('displayFile', directive);

    directive.$inject = [];

    /* @ngInject */
    function directive() {
        return {
            restrict: 'EA',
            scope: {
                displayFile: "="
            }, 
            link: function (scope, element) {
                
                scope.$watch("displayFile", function () {
                    element.empty();
                    var objectElem = {}
                    if (scope.displayFile && scope.displayFile.fileUrl !== "") {
                        objectElem = angular.element(document.createElement("object"));
                        objectElem.attr("data", scope.displayFile.fileUrl);
                        objectElem.attr("type", "application/pdf");
                        var style = "height: " + scope.displayFile.height + "; width: " + scope.displayFile.width + ";";
                        objectElem.attr("style", style);
                    }
                    element.append(objectElem);
                });

            }
        }
    }
})();