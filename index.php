<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <title>The 138th East Vancouver Scout Group</title>
        <meta name="description" content="">

        <link rel="stylesheet" href="css/style.css"/>
        <link rel="author" href="https://github.com/askho/138Website/graphs/contributors">
        <link rel="icon" type="image/png" href="favicon.png">
    </head>
    <body>
        <div class="header">
            <div class="logo"></div>
            <h2 class="title">138 Scout Group</h2>
            <ul class="nav">
                <li><a href="javascript:void(0);">Home</a></li>
                <li><a href="javascript:void(0);">About Us</a></li>
                <li><a href="javascript:void(0);">Calendar</a></li>
                <li><a href="javascript:void(0);">Registration</a></li>
            </ul>
        </div>
        <div class="content-wrapper">
            <div class="main-content">
            </div>
            <div class="right-side">
                there is something here
            </div>
            <div style="clear: both;"></div>
        </div>
        <script src="//connect.facebook.net/en_US/sdk.js"></script>
        <script>
            var ACCESS_TOKEN = "524905380971501|vwvIt1ualZz_1V5DX17el6NJPe0";
            FB.init({
                version: 'v2.0',
                appId: 524905380971501
            });
        </script>

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
        <script src="js/isotope.pkgd.min.js"></script>
        <script type="application/javascript">
            posts = [
                {
                    title: "Family Camp 2014 (July 27-29)",
                    albumId: 409578535847055,
                    description: "Bacon ipsum dolor sit amet filet mignon short loin t-bone hamburger. Tenderloin shank kielbasa jerky andouille drumstick spare ribs bacon hamburger cow tri-tip jowl biltong t-bone. Capicola prosciutto shoulder landjaeger bresaola shankle corned beef leberkas. Ground round andouille pancetta salami meatball. Ham pork chop flank corned beef, turkey shoulder t-bone rump doner sausage. Flank jowl turkey bresaola, turducken pork frankfurter tongue cow. Tail tenderloin doner, salami pig drumstick jerky corned beef meatloaf."
                },
                {
                    title: "Swimming at Eileen Daily Pool (July 21)",
                    albumId: 407587682712807,
                    description: "Bacon ipsum dolor sit amet filet mignon short loin t-bone hamburger. Tenderloin shank kielbasa jerky andouille drumstick spare ribs bacon hamburger cow tri-tip jowl biltong t-bone. Capicola prosciutto shoulder landjaeger bresaola shankle corned beef leberkas. Ground round andouille pancetta salami meatball. Ham pork chop flank corned beef, turkey shoulder t-bone rump doner sausage. Flank jowl turkey bresaola, turducken pork frankfurter tongue cow. Tail tenderloin doner, salami pig drumstick jerky corned beef meatloaf."
                }
            ];
            $( document ).ready(function() {
                for(var i = 0; i < posts.length; i++) {
                    posts[i].elem = $('<div class="post">' +
                            '<div class="title">' +
                            posts[i].title +
                            '</div>' +
                            '<div class="photo loading" onclick="fbAlbumInit(' + posts[i].albumId + ');"></div>' +
                            '<div class="words">' +
                            posts[i].description +
                            '</div>' +
                            '<a href="javascript:void(0);" class="read-more"></a>' +
                            '</div>');
                    $(".main-content").append(posts[i].elem);

                    FB.api(
                                    "/" + posts[i].albumId,
                            'get',
                            {
                                pretty: 0,
                                access_token: ACCESS_TOKEN
                            },
                            function ( response ) {
                                var coverElem = posts[getPostByAlbumId(response.id)].elem.find(".photo");
                                if (response && !response.error) {
                                    var img = $('<img/>');
                                    getPhotoData(response.cover_photo, function( response ) {
                                        img[0].src = response.images[4].source;
                                        img.load(function() {
                                            coverElem.css('background-image', "url(" + response.images[4].source + ")");
                                            coverElem.animate({
                                                height: "332px"
                                            }, 1000, function() {
                                                coverElem.css("height", "");
                                            });
                                            coverElem.removeClass("loading");
                                        });
                                    });
                                }
                            }
                    );
                }
            });

            var getPhotoData = function( photoId, callback ) {
                FB.api("/" + photoId, 'get', {pretty: 0, access_token: ACCESS_TOKEN}, callback);
            };

            var getPostByAlbumId = function( albumId ) {
                for(var i = 0; i < posts.length; i++) {
                    if(posts[i].albumId == albumId)
                        return i;
                }
                return -1;
            };

        </script>

        <script src="js/albumviewer.js"></script>
    </body>
</html>