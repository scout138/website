'use strict';

(function() {

    angular.module('138Web')

    .component('mugshotGroup', {
        //'templateUrl': 'template/component/mugshot/group.html',
        'template': '<mugshot-item ng-repeat="mug in $ctrl.mugs" model="mug"></mugshot-item>',
        'controller': ['$scope', function($scope) {
            var $ctrl = this;

            $ctrl.mugs = [];

            var sluggify = function(name) {
                return name.toLowerCase().replace(' ', '-');
            };

            $scope.$watch(function() { return $ctrl.model; }, function($new) {
                $ctrl.mugs = [];
                for(var name in $new) {
                    if (!$new.hasOwnProperty(name)) continue;

                    var title = $new[name];

                    $ctrl.mugs.push({
                        'name': name,
                        'title': title,
                        'slug': sluggify(name)
                    })
                }
            });
        }],
        'bindings': {
            "model": '<'
        }
    })

    .component('mugshotItem', {
        'templateUrl': 'template/component/mugshot/item.html',
        'bindings': {
            'model': '<'
        }
    })

})();