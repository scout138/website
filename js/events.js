'use strict';

(function() {

    angular.module('138Web')

    .component('eventGroup', {
        'templateUrl': 'template/component/event/group.html',
        bindings: {
            events: '<'
        }
    })

    .component('eventItem', {
        'templateUrl': 'template/component/event/item.html',
        'bindings': {
            'event': '<'
        }
    })

    .component('eventDetail', {
        //'templateUrl': 'template/components/events/detail.html',
        'template': '<b>{{$ctrl.name}}:</b> <span ng-bind-html="$ctrl.html"></span>',
        'controller': ['$scope', '$sce', function($scope, $sce) {
            var $ctrl = this;

            $ctrl.html = '';

            $scope.$watch(function() { return $ctrl.detail; }, function($new, $old) {
                if ($ctrl.name == 'location')
                    $new = '<a href="//maps.google.ca/maps?hl=en&amp;q=' + $new + '&amp;source=calendar">' + $new + '</a>';

                $ctrl.html = $sce.trustAsHtml($new);
            });
        }],
        'bindings': {
            'name': '<',
            'detail': '<'
        }
    });

})();