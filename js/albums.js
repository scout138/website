'use strict';

(function() {
    var accessToken = '524905380971501|vwvIt1ualZz_1V5DX17el6NJPe0';

    angular.module('138Web')

    .component('albumList', {
        'templateUrl': 'template/component/album/list.html',
        'controller': ['$scope', '$element', '$sce', '$http', function($scope, $element, $sce, $http) {
            var $ctrl = this;

            $ctrl.albums = [];
            $ctrl.end = false;

            $ctrl.load = function() {
                $ctrl.loadMore({
                    'accessToken': accessToken,
                    'callback': function(data, hasMore) {
                        var photoIds = [];

                        for(var i = 0; i < data.length; i++) {
                            if (!data[i].hasOwnProperty('backdated_time'))
                                continue;

                            if (data[i].hasOwnProperty('description')) {
                                var nextRef;
                                while ((nextRef = data[i]['description'].indexOf('@[')) >= 0) {
                                    var ref = data[i]['description'].substring(nextRef, data[i]['description'].indexOf(']', nextRef) + 1);
                                    var pts = ref.substring(2, ref.length - 1).split(':');
                                    var link = '<a href="//facebook.com/' + pts[0] + '" target="_blank">' + pts[2] + '</a>';
                                    data[i]['description'] = data[i]['description'].replace(ref, link);
                                }
                            } else {
                                data[i]['description'] = '';
                            }

                            var ndi = data[i]['name'].indexOf(' - ');
                            if (ndi != -1)
                                data[i]['name'] = data[i]['name'].substring(ndi + 3);

                            photoIds.push(data[i]['cover_photo']['id']);
                        }

                        $http
                            .get('https://graph.facebook.com/v2.5/', {
                                'params': {
                                    'access_token': accessToken,
                                    'pretty': 0,
                                    'fields': 'source',
                                    'ids' : photoIds.join(',')
                                }
                            })
                            .success(function (res) {
                                for(var i = 0; i < data.length; i++) {
                                    if(!res.hasOwnProperty(data[i]['cover_photo']['id']))
                                        continue;

                                    $ctrl.albums.push({
                                        'title': data[i]['name'],
                                        'date': new Date(data[i]['backdated_time']).toString('MMMM d, yyyy'),
                                        'link': data[i]['link'],
                                        'description': $sce.trustAsHtml(data[i]['description']),
                                        'image': res[data[i]['cover_photo']['id']]['source']
                                    });
                                }
                            });

                        $ctrl.end = !hasMore;
                    }
                });
            };

            $ctrl.load();
        }],
        'bindings': {
            'loadMore': '&'
        }
    })

    .component('albumPost', {
        'templateUrl': 'template/component/album/post.html',
        'bindings': {
            'album': '<'
        }
    });

})();