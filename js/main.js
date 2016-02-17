'use strict';

(function() {

    angular.module('138Web', ['ngRoute'])

    .run(['$rootScope', function($rootScope) {
        var first = true;

        $rootScope.$on('$routeChangeSuccess', function() {
            if (first)
                return first = false;

            if (typeof _gaq !== 'undefined')
                _gaq.push(['_trackPageview']);
        })
    }])

    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                'templateUrl': 'template/home.html',
                'controller': 'HomeController'
            })
            .when('/calendar', {
                'templateUrl': 'template/calendar.html'
            })
            //.when('/notices', {
            //    'templateUrl': 'template/calendar.html'
            //})
            .when('/registration', {
                'templateUrl': 'template/registration.html'
            })
            .when('/leaders', {
                //'templateUrl': 'template/leaders.html',
                'template': '<mugshot-group model="leaders"></mugshot-group>'
            })
            .when('/about-us', {
                'templateUrl': 'template/about-us.html'
            })
            .otherwise({
                'templateUrl': 'template/404.html'
            });

        $locationProvider.html5Mode(true);
    }])

    .controller('MainController', ['$scope', function($scope) {
        $scope.menuPath = [];
        $scope.menuItems = {
            'Calendar': 'calendar',
            'Resources': {
                'Reimbursement Form': '//files.scout138.com/leader-reimbursement-form-2014.pdf',
                'Canadian Path': {
                    'Beavers': '//files.scout138.com/canadian-path/beavers.pdf',
                    'Cubs': '//files.scout138.com/canadian-path/cubs.pdf',
                    'Scouts': '//files.scout138.com/canadian-path/scouts.pdf',
                    'Venturers': '//files.scout138.com/canadian-path/venturers.pdf'
                },
                'Scouters\' Handbooks': {
                    'Beavers': 'http://www.scouts.ca/vstk/pdf/tools/beaver/beaver-leader-handbook.pdf',
                    'Cubs': 'http://www.scouts.ca/vstk/pdf/tools/cubs/cub-leader-handbook.pdf',
                    'Scouts': 'http://www.scouts.ca/vstk/pdf/tools/scouts/scout-leader-handbook.pdf',
                    'Venturers': 'http://www.scouts.ca/vstk/pdf/tools/venturer/Venturer-Advisors-Handbook.pdf'
                },
                'Tech Guide': 'https://sites.google.com/a/scout138.com/wiki/',
                'Attendance': 'http://attendance.scout138.com/',
                'Leaders\' Contact Info': 'javascript: void(0);',
                'Physical Fitness Forms': {
                    'Beavers': '//files.scout138.com/physical-fitness-forms/beavers/',
                    'Cubs': '//files.scout138.com/physical-fitness-forms/cubs/',
                    'Scouts': '//files.scout138.com/physical-fitness-forms/scouts/',
                    'Venturers': '//files.scout138.com/physical-fitness-forms/venturers/'
                },
                'Uniform Badge Placement': '//files.scout138.com/insignia-placement.pdf',
                'Police Record Check': 'https://justice.gov.bc.ca/eCRC/'
            },
            'Notices': '//files.scout138.com/notices/',
            'Thank a Leader!': 'https://www.myscouts.ca/ca/commendation/submit',
            'Registration': 'registration',
            'Leaders': 'leaders',
            'About Us': 'about-us'
        };
        $scope.leaders = {
            'Jackson Li': 'Group Commissioner',
            'Rita Ho': 'Head Beaver Scouter',
            'Celine Hsin': 'Beaver Scouter',
            'Adrian Lee': 'Beaver Scouter',
            'Vikki Liu': 'Beaver Scouter',
            'Jan Nguyen': 'Beaver Scouter',
            'Robin Tsui': 'Head Pack Scouter',
            'Linda Koch': 'Pack Scouter',
            'Olya Kozun': 'Pack Scouter',
            //'Karen Wong': 'Troop Scouter (on leave)',
            'Leslie Lai': 'Head Troop Scouter',
            'Leon Ho': 'Troop Scouter',
            'Steve Lam': 'Troop Scouter',
            'Lawrence Lai': 'Company Adviser',
            'Milly Cheung': 'Company Advisor',
            'Laurie Lum': 'Company Advisor',
            'Cameron Butler': 'Company Advisor'
        };
    }])

    .controller('HomeController', ['$scope', '$http', function($scope, $http) {
        var fbFields = ['id', 'cover_photo{id}', 'name', 'description', 'backdated_time', 'link'];
        var fbAfter = '';

        $scope.loadMorePosts = function(accessToken, callback) {
            $http
                .get('https://graph.facebook.com/v2.5/292891094182467/albums', {
                    'params': {
                        'access_token': accessToken,
                        'pretty': 0,
                        'limit': 10,
                        'after': fbAfter,
                        'fields': fbFields.join(',')
                    }
                })
                .success(function (res) {
                    fbAfter = res['paging']['cursors']['after'];
                    callback(res.data, res['paging'].hasOwnProperty('next'));
                });
        };

        $scope.loadEvents = function(flush) {
            $scope.loadingEvents = true;
            $scope.events = [];
            $http
                .get('https://api.scout138.com/events/list', {
                    'params': {
                        'flush': flush ? '1' : '0'
                    }
                })
                .success(function (data) {
                    $scope.loadingEvents = false;
                    $scope.events = data;
                });
        };
    }])

    .controller('LeadersController', [
        '$scope', function($scope) {
            $scope.sluggify = function(name) {
                return name.toLowerCase().replace(' ', '-');
            };
        }
    ])

})();
