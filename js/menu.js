'use strict';

(function() {

    angular.module('138Web')

    .component('menuGroup', {
        //'templateUrl': 'template/component/menu/group.html',
        'template': '<menu-item ng-repeat="(name,data) in $ctrl.items" name="name" data="data"></menu-item>',
        'controller': ['$scope', '$element', function($scope, $element) {
            var self = this;

            if (!$element.hasClass('child')) {
                $element.on('click', function($event) {
                    $element.toggleClass('open', self.open = !self.open);

                    if (!self.open)
                        $scope.$broadcast('closemenu', $scope);

                    $event.stopPropagation();
                });

                angular.element(document).on('click', function($event) {
                    $element.toggleClass('open', self.open = false);
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
            var self = this;

            self.isParent = typeof self.data == 'object';
            self.isSelected = !self.isParent && $location.path() == '/' + self.href;

            if (!self.isParent)
                self.href = self.data;
            else
                $element.addClass('parent');

            $element.on('click', function($event) {
                $scope.$emit('menuopen');

                if (self.isParent)
                    $element.toggleClass('open', self.open = !self.open);
                else if (self.href.indexOf('//') == -1){
                    $scope.$apply(function() {
                        $location.path(self.href);
                    });
                    $event.preventDefault();
                }

                $event.stopPropagation();
            });

            $scope.$on('closemenu', function($event, $targetScope) {
                if ($targetScope == $scope)
                    return;

                if (self.isParent && self.open) {
                    self.open = false;
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