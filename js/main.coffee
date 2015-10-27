app = angular.module('mainweb', ['ngRoute'])

.config ['$routeProvider', '$locationProvider', ($routeProvider, $locationProvider) ->
  $routeProvider
  .when '/', templateUrl: 'template/home.html', controller: 'HomeController'
  .when '/calendar', templateUrl: 'template/calendar.html'
  .when '/registration', templateUrl: 'template/registration.html'
  .when '/leaders', templateUrl: 'template/leaders.html', controller: 'LeadersController'
  .when '/about-us', templateUrl: 'template/about-us.html'
  .otherwise templateUrl: 'template/404.html'

  $locationProvider.html5Mode(true)
  return
]

.directive 'eventItem', ['$compile', '$sce', ($compile, $sce) ->
  scope:
    eventData: '='
  restrict: 'C'
  link: (scope, element, attrs) ->
    scope.makeDetail = (detail) ->
      return $sce.trustAsHtml('<b>' + detail.key + ':</b> ' + detail.value)

    element.append('<a href="javascript: void(0);" ng-click="open = !open" ng-class="{open: open, day: eventData.type == \'week\', holiday: eventData.type == \'holiday\'}" class="summary">' + scope.eventData.title + '</a>')
    if(scope.eventData.type is 'week')
      element.append('<div ng-show="open"><ul class="events"><li ng-repeat="date in eventData.dates" class="event-item item" event-data="date"></li></ul></div>')
    else if(scope.eventData.type is 'date')
      element.append('<div ng-show="open"><div ng-repeat="detail in eventData.details" ng-bind-html="makeDetail(detail)" style="padding-left: 0;"></div></div>')

    $compile(element.contents())(scope);

    return
]

.directive 'nav', ['$compile', '$location', ($compile, $location) ->
  scope:
    name: '='
    link: '='
  restrict: 'A'
  link: (scope, element, attrs) ->
    isParent = (link) ->
      typeof link == 'object'
    scope.isSelected = ->
      if not isParent scope.link then $location.path() is '/' + scope.link

    if isParent scope.link then element.addClass 'parent'

    element.append '<a href="' + (if isParent scope.link then 'javascript: void(0);' else scope.link) + '" ng-class="{selected: isSelected()}" ng-click="$parent.$parent.subopen = ($parent.$parent.subopen == name ? \'\' : name);subopen = \'\';$event.stopPropagation();">' + scope.name + '</a>'

    if isParent scope.link then element.append '<ul><li ng-repeat="(name, child) in link" nav name="name" link="child" ng-class="{open: $parent.subopen == name}"></li></ul>'

    $compile(element.contents())(scope);
    return
]

.controller 'MainController', ['$scope', ($scope) ->
  $scope.menuItems =
    'Calendar': 'calendar'
    'Resources':
      'Reimbursement Form': '//files.scout138.com/leader-reimbursement-form-2014.pdf?dl'
      'Canadian Path':
        'Beavers': 'https://files.scout138.com/canadian-path/beavers.pdf?dl'
        'Cubs': 'https://files.scout138.com/canadian-path/cubs.pdf?dl'
        'Scouts': 'https://files.scout138.com/canadian-path/scouts.pdf?dl'
        'Venturers': 'https://files.scout138.com/canadian-path/venturers.pdf?dl'
      'Scouters\' Handbooks':
        'Beavers': 'http://www.scouts.ca/vstk/pdf/tools/beaver/beaver-leader-handbook.pdf'
        'Cubs': 'http://www.scouts.ca/vstk/pdf/tools/cubs/cub-leader-handbook.pdf'
        'Scouts': 'http://www.scouts.ca/vstk/pdf/tools/scouts/scout-leader-handbook.pdf'
        'Venturers': 'http://www.scouts.ca/vstk/pdf/tools/venturer/Venturer-Advisors-Handbook.pdf'
      'Tech Guide': 'https://sites.google.com/a/scout138.com/wiki/'
      'Attendance': 'http://attendance.scout138.com/'
      'Leaders\' Contact Info': 'javascript: void(0);'
      'Physical Fitness Forms':
        'Beavers': 'https://files.scout138.com/physical-fitness-forms/beavers/'
        'Cubs': 'https://files.scout138.com/physical-fitness-forms/cubs/'
        'Scouts': 'https://files.scout138.com/physical-fitness-forms/scouts/'
        'Venturers': 'https://files.scout138.com/physical-fitness-forms/venturers/'
      'Uniform Badge Placement': 'https://files.scout138.com/insignia-placement.pdf'
      'Police Record Check': 'https://justice.gov.bc.ca/eCRC/'
    'Thank a Leader!': 'https://www.myscouts.ca/ca/commendation/submit'
    'Registration': 'registration'
    'Leaders': 'leaders'
    'About Us': 'about-us'

  return
]

.controller 'LeadersController', ['$scope', ($scope) ->
  $scope.leadersList =
    'Jackson Li': 'Group Commissioner'
    'Rita Ho': 'Head Beaver Leader'
    'Celine Hsin': 'Beaver Leader'
    'Adrian Lee': 'Beaver Leader'
    'Vikki Liu': 'Beaver Leader'
    'Robin Tsui': 'Head Pack Leader'
    'Linda Koch': 'Pack Leader'
    'Karen Wong': 'Head Troop Leader'
    'Leslie Lai': 'Troop Leader'
    'Leon Ho': 'Troop Leader'
    'Steve Lam': 'Troop Leader'
    'Lawrence Lai': 'Company Adviser'
    'Laurie Lum': 'Company Advisor'
    'Cameron Butler': 'Company Advisor'

  $scope.sluggify = (name) ->
    name.toLowerCase().replace(' ', '-')
]

.controller 'HomeController', ['$scope', '$sce', ($scope, $sce) ->
  ACCESS_TOKEN = '524905380971501|vwvIt1ualZz_1V5DX17el6NJPe0'
  GCAL_API_KEY = 'AIzaSyCvuJzS-Q7uGdliRFqySq0mYar0YOBQEGE'

  nextPage = 0
  limit = 5

  FB.init version:'v2.4', appId:524905380971501

  $scope.weeks = []
  $scope.posts = []

  $scope.loadPosts = ->
    FB.api
      method: 'fql.query'
      query: 'SELECT cover_pid, description, name, link, backdated_time FROM album WHERE owner=292891094182467 AND backdated_time ORDER BY backdated_time DESC LIMIT ' + limit + ' OFFSET ' + (nextPage * limit)
      (response) ->
        $scope.hasMorePosts = response.length >= limit

        for data in response
          do (data) ->
            if data.hasOwnProperty('description')
              while((nextRef = data.description.indexOf('@[')) >= 0)
                ref = data.description.substring(nextRef, data.description.indexOf(']', nextRef) + 1)
                pts = ref.substring(2, ref.length - 1).split(':')
                anchor = '<a href="//facebook.com/' + pts[0] + '" target="_blank">' + pts[2] + '</a>'
                data.description = data.description.replace(ref, anchor)
            else
              data.description = '';

            if (ndi = data.name.indexOf(' - ')) >= 0
              data.name = data.name.substring(ndi + 3);

            i = $scope.posts.length;
            $scope.posts.push
              description: $sce.trustAsHtml(data.description)
              title: data.name
              date: new Date(data.backdated_time * 1000).toString('MMMM d, yyyy')
              link: data.link

            FB.api(
              method: 'fql.query'
              query: 'SELECT src_big FROM photo WHERE pid="' + data.cover_pid + '"'
              (response) ->

                $scope.$apply ->
                  $scope.posts[i].cover = response[0].src_big
                  return
                return
            )
            return

        return

    nextPage++


  $scope.getEvents = ->
    if gapi.client is undefined
      window.setTimeout($scope.getEvents, 100)
      return

    today = new Date().clearTime()
    gapi.client.setApiKey(GCAL_API_KEY)
    gapi.client.load('calendar', 'v3', $scope.getEvents = ->
      gapi.client.calendar.events.list(
        calendarId: 'pccrovers.com_pojeic2sd1ojijt7ohop7gt338@group.calendar.google.com'
        orderBy: 'startTime'
        singleEvents: true
        timeMin: today.toISOString()
        timeMax: today.moveToDayOfWeek(0).addWeeks(8).toISOString()
        timeZone: 'America/Vancouver'
        fields: 'items(summary,description,start,end,endTimeUnspecified,location,htmlLink,updated)'
      ).execute((response) ->
        $scope.$apply ->
          $scope.weeks = []

        if response.hasOwnProperty('error') then return

        g_weeks = []
        for item in response.items
          if not item.hasOwnProperty('summary') then continue

          start = Date.parse(item.start.dateTime || item.start.date)
          if not g_weeks.hasOwnProperty(start.toString('MMM d')) then g_weeks[start.toString('MMM d')] = []
          g_weeks[start.toString('MMM d')].push(item)

        for g_week, g_events of g_weeks
          g_events.sort((a, b) ->
            rowA = a.summary.toLowerCase()
            rowB = b.summary.toLowerCase()
            if rowA < rowB then return -1
            else if rowA > rowB then return 1
            else return 0
          )

          is_holiday = false
          has_title = false
          ret_dates = []
          for g_event in g_events
            if (prefix = g_event.summary.indexOf('GC')) >= 0
              g_week += g_event.summary.substring(prefix + 2)
              is_holiday = g_event.summary.toLowerCase().indexOf('no meeting') >= 0
              has_title = true
              continue

            props = []

            start = Date.parse(g_event.start.dateTime || g_event.start.date)
            end = Date.parse(g_event.end.dateTime || g_event.end.date)

            isAllDay = not g_event.start.hasOwnProperty('dateTime');
            isMultiDay = start.getDate() isnt end.getDate();

            props.push key: 'date', value: start.toString('dddd MMMM d, yyyy')

            props.push key: 'time', value: if isAllDay then 'All Day' else start.toString((if isMultiDay then 'ddd ' else '') + 'h:mmtt') + ' &ndash; ' + end.toString((if isMultiDay then 'ddd ' else '') + 'h:mmtt')

            while (g_event.hasOwnProperty('description') && (bb = g_event.description.indexOf('[info')) >= 0)
              g_event.description.replace(/\[info=([^\s\]]+)\s*\](.*(?=\[\/info\]))\[\/info\]/g, (match, p1, p2) ->
                props.push key: p1, value: p2.replace(/\[url=([^\s\]]+)\s*\](.*(?=\[\/url\]))\[\/url\]/g, '<a href=\"$1\">$2</a>')
              )
              g_event.description = g_event.description.substring(bb + 5)

            if g_event.location then props.push key: 'location', value: '<a href="//maps.google.ca/maps?hl=en&q=' + g_event.location + '&source=calendar" title="' + g_event.location + '">' + g_event.location + '</a>'

            ret_dates.push type: 'date', title: g_event.summary, details: props;

          if not has_title
            g_week += ' - Regular Meeting'

          $scope.$apply ->
            if(is_holiday)
              $scope.weeks.push type: 'holiday', title: g_week
            else if(ret_dates.length == 1 && ret_dates[0].title.toLowerCase().indexOf("group") >= 0)
              ret_dates[0].title = g_week
              $scope.weeks.push ret_dates[0]
            else
              $scope.weeks.push type: 'week', title: g_week, dates: ret_dates

        return
      )
    )

    return

  $scope.loadPosts()
  $scope.getEvents()
  return
]