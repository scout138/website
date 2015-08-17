nextPage = 0
limit = 5

getPosts = (page, limit) ->
  limit = limit || 5;
  FB.api(
      method: 'fql.query'
      query: 'SELECT cover_pid, description, name, link, backdated_time FROM album WHERE owner=292891094182467 AND backdated_time ORDER BY backdated_time DESC LIMIT ' + limit + ' OFFSET ' + (page * limit)
    (response) ->
      appendPost post for post in response

      if response.length >= limit
        $('.main-content').append(
          $('<div/>').addClass('load-more').on('click', ->
            $(this).remove();
            getPosts(++nextPage)
          )
        )
  )

appendPost = (data) ->
  if not isNaN(new Date(data.name.split(' - ')[0]).valueOf()) then data.name = data.name.substring(data.name.indexOf(' - ') + 3);

  if data.hasOwnProperty('description') then while((nextRef = data.description.indexOf('@[')) >= 0)
    ref = data.description.substring(nextRef, data.description.indexOf(']', nextRef) + 1)
    pts = ref.substring(2, ref.length - 1).split(':')
    anchor = '<a href="//facebook.com/' + pts[0] + '">' + pts[2] + '</a>'
    data.description = data.description.replace(ref, anchor)

  $elem = $('<div/>')
    .addClass('post')
    .append(
      $top = $('<div/>')
        .addClass('top')
        .append(
          $title = $('<div/>')
            .addClass('title')
            .attr('title', data.name)
            .text(data.name)
        )
        .append(
          $date = $('<div/>')
            .addClass('date')
            .text(new Date(data.backdated_time * 1000).toString('MMMM d, yyyy'))
        )
    )
    .append(
      $photo = $('<a/>')
        .attr('target', '_blank')
        .addClass('photo')
        .addClass('loading')
    )
    .append(
      $words = $('<div/>')
        .addClass('words')
        .html(data.description)
    )

  FB.api(
      method: 'fql.query'
      query: 'SELECT src_big FROM photo WHERE pid="' + data.cover_pid + '"'
    (response) ->
      $('<img/>')
        .attr('src', response[0].src_big)
        .load( ->
          $photo
            .attr('href', data.link)
            .css('background-image', 'url(' + response[0].src_big + ')')
            .animate(
              height: '332px'
              1000
              ->
                $photo.css('height', '')
            )
            .removeClass('loading')
        )
  )

  $('.main-content').append($elem);

getEvents = ->
  if gapi.client is undefined
    window.setTimeout(getEvents, 100)
    return

  today = new Date().clearTime()
  gapi.client.setApiKey('AIzaSyCvuJzS-Q7uGdliRFqySq0mYar0YOBQEGE')
  gapi.client.load('calendar', 'v3', ->
    gapi.client.calendar.events.list(
      calendarId: 'pccrovers.com_pojeic2sd1ojijt7ohop7gt338@group.calendar.google.com'
      orderBy: 'startTime'
      singleEvents: true
      timeMin: today.toISOString()
      timeMax: today.moveToDayOfWeek(0).addWeeks(8).toISOString()
      timeZone: 'America/Vancouver'
      fields: 'items(summary,description,start,end,endTimeUnspecified,location,htmlLink,updated)'
    ).execute((response) ->
      if response.hasOwnProperty('error') then return

      dates = {}

      for item in response.items
        do (item) ->
          if not item.hasOwnProperty('summary') then return

          start = Date.parse(item.start.dateTime || item.start.date)
          if not dates.hasOwnProperty(start.toString('MMM d')) then dates[start.toString('MMM d')] = []
          dates[start.toString('MMM d')].push(item)

      appendEvent date, events for date, events of dates

      return
    )
  )

appendEvent = (date, events) ->
  events.sort((a, b) ->
    rowA = a.summary.toLowerCase()
    rowB = b.summary.toLowerCase()
    if rowA < rowB then return -1
    else if rowA > rowB then return 1
    else return 0
  )

  $date = $('<li/>')
    .addClass('item')
    .append(
      $label = $('<a/>')
        .attr('href', 'javascript: void(0);')
        .addClass('summary')
        .addClass('day')
        .text(date)
        .on('click', ->
          $(this).next().slideToggle(200)
          $(this).toggleClass('open')
        )
    )
    .append(
      $container = $('<div/>')
        .css('display', 'none')
        .append(
          $events = $('<ul/>')
            .addClass('events')
        )
    )

  for event in events
    do (event) ->
      if (prefix = event.summary.indexOf('GC')) >= 0
        $label.text(date + event.summary.substring(prefix + 2))
        return

      props = {}

      start = Date.parse(event.start.dateTime || event.start.date)
      end = Date.parse(event.end.dateTime || event.end.date)

      isAllDay = not event.start.hasOwnProperty('dateTime');
      isMultiDay = start.getDate() isnt end.getDate();

      props['Date'] = start.toString('dddd MMMM d, yyyy')
      props['Time'] = if isAllDay then 'All Day' else start.toString((if isMultiDay then 'ddd ' else '') + 'h:mmtt') + ' &ndash; ' + end.toString((if isMultiDay then 'ddd ' else '') + 'h:mmtt')
      if event.location then props['Location'] = '<a href="//maps.google.ca/maps?hl=en&q=' + event.location + '&source=calendar">' + event.location + '</a>'

      $event = $('<li/>')
        .addClass('item')
        .append(
          $eventLabel = $('<a/>')
            .attr('href', 'javascript: void(0);')
            .addClass('summary')
            .text(event.summary)
            .on('click', ->
              $(this).next().slideToggle(200)
              $(this).toggleClass('open')
            )
        )
        .append(
          $props = $('<div/>')
            .css('display', 'none')
        )

      $props.append('<b>' + key + ':</b> ' + value + '<br>') for key, value of props
      $events.append($event)

  $('ul.events.top').append($date)
  return

getPosts(nextPage, limit)
getEvents()