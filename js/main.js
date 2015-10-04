// Generated by CoffeeScript 1.9.3
(function() {
  var app;

  app = angular.module('mainweb', ['ngRoute']).config([
    '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $routeProvider.when('/', {
        templateUrl: 'template/home.html',
        controller: 'HomeController'
      }).when('/calendar', {
        templateUrl: 'template/calendar.html'
      }).when('/registration', {
        templateUrl: 'template/registration.html'
      }).when('/leaders', {
        templateUrl: 'template/leaders.html',
        controller: 'LeadersController'
      }).when('/about-us', {
        templateUrl: 'template/about-us.html'
      }).otherwise({
        templateUrl: 'template/404.html'
      });
      $locationProvider.html5Mode(true);
    }
  ]).directive('eventItem', [
    '$compile', '$sce', function($compile, $sce) {
      return {
        scope: {
          eventData: '='
        },
        restrict: 'C',
        link: function(scope, element, attrs) {
          scope.makeDetail = function(detail) {
            return $sce.trustAsHtml('<b>' + detail.key + ':</b> ' + detail.value);
          };
          element.append('<a href="javascript: void(0);" ng-click="open = !open" ng-class="{open: open}" class="summary' + (scope.eventData.type === 'week' ? ' day' : void 0) + '">' + scope.eventData.title + '</a>');
          if (scope.eventData.type === 'week') {
            element.append('<div ng-show="open"><ul class="events"><li ng-repeat="date in eventData.dates" class="event-item item" event-data="date"></li></ul></div>');
          } else {
            element.append('<div ng-show="open"><div ng-repeat="detail in eventData.details" ng-bind-html="makeDetail(detail)" style="padding-left: 0;"></div></div>');
          }
          $compile(element.contents())(scope);
        }
      };
    }
  ]).directive('nav', [
    '$compile', '$location', function($compile, $location) {
      return {
        scope: {
          name: '=',
          link: '='
        },
        restrict: 'A',
        link: function(scope, element, attrs) {
          var isParent;
          isParent = function(link) {
            return typeof link === 'object';
          };
          scope.isSelected = function() {
            if (!isParent(scope.link)) {
              return $location.path() === '/' + scope.link;
            }
          };
          if (isParent(scope.link)) {
            element.addClass('parent');
          }
          element.append('<a href="' + (isParent(scope.link) ? 'javascript: void(0);' : scope.link) + '" ng-class="{selected: isSelected()}" ng-click="$parent.$parent.subopen = ($parent.$parent.subopen == name ? \'\' : name);subopen = \'\';$event.stopPropagation();">' + scope.name + '</a>');
          if (isParent(scope.link)) {
            element.append('<ul><li ng-repeat="(name, child) in link" nav name="name" link="child" ng-class="{open: $parent.subopen == name}"></li></ul>');
          }
          $compile(element.contents())(scope);
        }
      };
    }
  ]).controller('MainController', [
    '$scope', function($scope) {
      $scope.menuItems = {
        'Calendar': 'calendar',
        'Resources': {
          'Reimbursement Form': '//files.scout138.com/leader-reimbursement-form-2014.pdf?dl',
          'Canadian Path': {
            'Beavers': 'https://files.scout138.com/canadian-path/beavers.pdf?dl',
            'Cubs': 'https://files.scout138.com/canadian-path/cubs.pdf?dl',
            'Scouts': 'https://files.scout138.com/canadian-path/scouts.pdf?dl',
            'Venturers': 'https://files.scout138.com/canadian-path/venturers.pdf?dl'
          },
          'Tech Guide': 'https://sites.google.com/a/scout138.com/wiki/',
          'Attendance': 'http://attendance.scout138.com/',
          'Leaders\' Contact Info': 'javascript: void(0);',
          'Physical Fitness Forms': {
            'Beavers': 'https://files.scout138.com/physical-fitness-forms/beavers/',
            'Cubs': 'https://files.scout138.com/physical-fitness-forms/cubs/',
            'Scouts': 'https://files.scout138.com/physical-fitness-forms/scouts/',
            'Venturers': 'https://files.scout138.com/physical-fitness-forms/venturers/'
          },
          'Uniform Badge Placement': 'https://files.scout138.com/insignia-placement.pdf',
          'Police Record Check': 'https://justice.gov.bc.ca/eCRC/'
        },
        'Thank a Leader!': 'https://www.myscouts.ca/ca/commendation/submit',
        'Registration': 'registration',
        'Leaders': 'leaders',
        'About Us': 'about-us'
      };
    }
  ]).controller('LeadersController', [
    '$scope', function($scope) {
      $scope.leadersList = {
        'Jackson Li': 'Group Commissioner',
        'Rita Ho': 'Head Beaver Leader',
        'Celine Hsin': 'Beaver Leader',
        'Adrian Lee': 'Beaver Leader',
        'Vikki Liu': 'Beaver Leader',
        'Robin Tsui': 'Head Pack Leader',
        'Linda Koch': 'Pack Leader',
        'Karen Wong': 'Head Troop Leader',
        'Leslie Lai': 'Troop Leader',
        'Leon Ho': 'Troop Leader',
        'Steve Lam': 'Troop Leader',
        'Lawrence Lai': 'Company Adviser',
        'Laurie Lum': 'Company Advisor',
        'Cameron Butler': 'Company Advisor'
      };
      return $scope.sluggify = function(name) {
        return name.toLowerCase().replace(' ', '-');
      };
    }
  ]).controller('HomeController', [
    '$scope', '$sce', function($scope, $sce) {
      var ACCESS_TOKEN, GCAL_API_KEY, getEvents, limit, nextPage;
      ACCESS_TOKEN = '524905380971501|vwvIt1ualZz_1V5DX17el6NJPe0';
      GCAL_API_KEY = 'AIzaSyCvuJzS-Q7uGdliRFqySq0mYar0YOBQEGE';
      nextPage = 0;
      limit = 5;
      FB.init({
        version: 'v2.4',
        appId: 524905380971501
      });
      $scope.weeks = [];
      $scope.posts = [];
      $scope.loadPosts = function() {
        FB.api({
          method: 'fql.query',
          query: 'SELECT cover_pid, description, name, link, backdated_time FROM album WHERE owner=292891094182467 AND backdated_time ORDER BY backdated_time DESC LIMIT ' + limit + ' OFFSET ' + (nextPage * limit)
        }, function(response) {
          var data, fn, j, len;
          $scope.hasMorePosts = response.length >= limit;
          fn = function(data) {
            var anchor, i, nextRef, pts, ref;
            if (data.hasOwnProperty('description')) {
              while ((nextRef = data.description.indexOf('@[')) >= 0) {
                ref = data.description.substring(nextRef, data.description.indexOf(']', nextRef) + 1);
                pts = ref.substring(2, ref.length - 1).split(':');
                anchor = '<a href="//facebook.com/' + pts[0] + '" target="_blank">' + pts[2] + '</a>';
                data.description = data.description.replace(ref, anchor);
              }
            } else {
              data.description = '';
            }
            i = $scope.posts.length;
            $scope.posts.push({
              description: $sce.trustAsHtml(data.description),
              title: data.name,
              date: new Date(data.backdated_time * 1000).toString('MMMM d, yyyy'),
              link: data.link
            });
            FB.api({
              method: 'fql.query',
              query: 'SELECT src_big FROM photo WHERE pid="' + data.cover_pid + '"'
            }, function(response) {
              $scope.$apply(function() {
                $scope.posts[i].cover = response[0].src_big;
              });
            });
          };
          for (j = 0, len = response.length; j < len; j++) {
            data = response[j];
            fn(data);
          }
        });
        return nextPage++;
      };
      getEvents = function() {
        var today;
        if (gapi.client === void 0) {
          window.setTimeout(getEvents, 100);
          return;
        }
        today = new Date().clearTime();
        gapi.client.setApiKey(GCAL_API_KEY);
        gapi.client.load('calendar', 'v3', function() {
          return gapi.client.calendar.events.list({
            calendarId: 'pccrovers.com_pojeic2sd1ojijt7ohop7gt338@group.calendar.google.com',
            orderBy: 'startTime',
            singleEvents: true,
            timeMin: today.toISOString(),
            timeMax: today.moveToDayOfWeek(0).addWeeks(8).toISOString(),
            timeZone: 'America/Vancouver',
            fields: 'items(summary,description,start,end,endTimeUnspecified,location,htmlLink,updated)'
          }).execute(function(response) {
            var bb, end, g_event, g_events, g_week, g_weeks, isAllDay, isMultiDay, item, j, k, len, len1, prefix, props, ref1, ret_dates, start;
            if (response.hasOwnProperty('error')) {
              return;
            }
            g_weeks = [];
            ref1 = response.items;
            for (j = 0, len = ref1.length; j < len; j++) {
              item = ref1[j];
              if (!item.hasOwnProperty('summary')) {
                continue;
              }
              start = Date.parse(item.start.dateTime || item.start.date);
              if (!g_weeks.hasOwnProperty(start.toString('MMM d'))) {
                g_weeks[start.toString('MMM d')] = [];
              }
              g_weeks[start.toString('MMM d')].push(item);
            }
            for (g_week in g_weeks) {
              g_events = g_weeks[g_week];
              g_events.sort(function(a, b) {
                var rowA, rowB;
                rowA = a.summary.toLowerCase();
                rowB = b.summary.toLowerCase();
                if (rowA < rowB) {
                  return -1;
                } else if (rowA > rowB) {
                  return 1;
                } else {
                  return 0;
                }
              });
              ret_dates = [];
              for (k = 0, len1 = g_events.length; k < len1; k++) {
                g_event = g_events[k];
                if ((prefix = g_event.summary.indexOf('GC')) >= 0) {
                  g_week += g_event.summary.substring(prefix + 2);
                  continue;
                }
                props = [];
                start = Date.parse(g_event.start.dateTime || g_event.start.date);
                end = Date.parse(g_event.end.dateTime || g_event.end.date);
                isAllDay = !g_event.start.hasOwnProperty('dateTime');
                isMultiDay = start.getDate() !== end.getDate();
                props.push({
                  key: 'date',
                  value: start.toString('dddd MMMM d, yyyy')
                });
                props.push({
                  key: 'time',
                  value: isAllDay ? 'All Day' : start.toString((isMultiDay ? 'ddd ' : '') + 'h:mmtt') + ' &ndash; ' + end.toString((isMultiDay ? 'ddd ' : '') + 'h:mmtt')
                });
                while (g_event.hasOwnProperty('description') && (bb = g_event.description.indexOf('[info')) >= 0) {
                  g_event.description.replace(/\[info=([^\s\]]+)\s*\](.*(?=\[\/info\]))\[\/info\]/g, function(match, p1, p2) {
                    return props.push({
                      key: p1,
                      value: p2.replace(/\[url=([^\s\]]+)\s*\](.*(?=\[\/url\]))\[\/url\]/g, '<a href=\"$1\">$2</a>')
                    });
                  });
                  g_event.description = g_event.description.substring(bb + 5);
                }
                if (g_event.location) {
                  props.push({
                    key: 'location',
                    value: '<a href="//maps.google.ca/maps?hl=en&q=' + g_event.location + '&source=calendar">' + g_event.location + '</a>'
                  });
                }
                ret_dates.push({
                  type: 'date',
                  title: g_event.summary,
                  details: props
                });
              }
              $scope.$apply(function() {
                return $scope.weeks.push({
                  type: 'week',
                  title: g_week,
                  dates: ret_dates
                });
              });
            }
          });
        });
      };
      $scope.loadPosts();
      return getEvents();
    }
  ]);

}).call(this);

//# sourceMappingURL=main.js.map
