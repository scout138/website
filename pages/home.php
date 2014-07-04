<div class="content-wrapper">
    <div class="main-content">
    </div>
    <div class="right-side">
        there is something here
    </div>
    <div style="clear: both;"></div>
</div>
<script>
    $LAB
        .script("//connect.facebook.net/en_US/sdk.js").wait()
        .script("/js/fbinit.js")
        .script("//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js").wait()
        .script("/js/isotope.pkgd.min.js").wait()
        .script("/js/albumviewer.js").wait(function() {
            genPosts();
        });

    var posts = [
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

    var genPosts = function() {
        for(var i = 0; i < posts.length; i++) {
            posts[i].elem = $('<div class="post">' +
                    '<div class="title">' +
                    posts[i].title +
                    '</div>' +
                    '<div class="photo loading" onclick="fbAlbumInit(' + posts[i].albumId + ');"></div>' +
                    '<div class="words">' +
                    cropWords(posts[i].description, 40) + "..." +
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
    };

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

    var cropWords = function( str, count ) {
        return str.split(/\s+/, count).join(" ");
    }

</script>