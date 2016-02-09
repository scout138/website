'use strict';

(function() {

    angular.module('138Web')

    .component('menuGroup', {
        //'templateUrl': 'template/component/menu/group.html',
        'template': '<menu-item ng-repeat="(name,data) in $ctrl.items" name="name" data="data"></menu-item>',
        'controller': ['$scope', '$element', function($scope, $element) {
            var $ctrl = this;

            if (!$element.hasClass('child')) {
                $element.on('click', function($event) {
                    $element.toggleClass('open', $ctrl.open = !$ctrl.open);

                    if (!$ctrl.open)
                        $scope.$broadcast('closemenu', $scope);

                    $event.stopPropagation();
                });

                angular.element(document).on('click', function($event) {
                    $element.toggleClass('open', $ctrl.open = false);
                    $scope.$broadcast('closemenu', $scope);
                });
            }

            $scope.$on('menuopen', function($event) {
                $scope.$broadcast('closemenu', $event.targetScope);
                $event.stopPropagation();
            })
        }],
        'bindings': {
            'items': '<'
        }
    })

    .component('menuItem', {
        'templateUrl': 'template/component/menu/item.html',
        'controller': ['$location', '$scope', '$element', function($location, $scope, $element) {
            var $ctrl = this;

            $ctrl.isParent = typeof $ctrl.data == 'object';
            $ctrl.isSelected = !$ctrl.isParent && $location.path() == '/' + $ctrl.href;

            if (!$ctrl.isParent)
                $ctrl.href = $ctrl.data;
            else
                $element.addClass('parent');

            $element.on('click', function($event) {
                $scope.$emit('menuopen');

                if ($ctrl.isParent)
                    $element.toggleClass('open', $ctrl.open = !$ctrl.open);
                else if ($ctrl.href.indexOf('//') == -1){
                    $scope.$apply(function() {
                        $location.path($ctrl.href);
                    });
                    $event.preventDefault();
                }

                $event.stopPropagation();
            });

            $scope.$on('closemenu', function($event, $targetScope) {
                if ($targetScope == $scope)
                    return;

                if ($ctrl.isParent && $ctrl.open) {
                    $ctrl.open = false;
                    $element.removeClass('open');
                }
            });

        }],
        'bindings': {
            'name': '<',
            'data': '<'
        }
    });

})();