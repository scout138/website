var template = $('<div class="tablecloth" style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:10000;background-color:gray;background-color:rgba(0,0,0,0.6);overflow-y: scroll; overflow-x: hidden;">' +
    '<div class="album-wrapper" style="margin: 0 auto; padding: 50px 0; max-width: 960px;">' +
    '</div>' +
    '</div>');
var next = "";
var isAlbumOpen = false;
var isLoadingNext = false;
var bigPictureResizing = false;
var bigPicture = null;
var wrapper = template.find(".album-wrapper");
var iso = wrapper.isotope({
    // options
    itemSelector: '.item',
    masonry: {
        columnWidth: 192
    }
});

template.hide();
template.appendTo("body");
template.click(function () {
    closeAlbum();
}).children().click(function() {
    return false;
});
template.scroll(function() {
    if(template.scrollTop() + template.height() > iso.height() - 100 && !isLoadingNext) {
        loadPhotos(template.data("albumId"));
    }
});

var fbAlbumInit = function( albumId ) {
    lockScroll();

    template.data("albumId", albumId);
    template.show(250, function() {
        loadPhotos(albumId);
    });

    isAlbumOpen = true;
};

function closeAlbum() {
    iso.isotope('remove', iso.children());
    iso.isotope('once', 'removeComplete', function() {
        template.hide(250, function() {
            unlockScroll();
            isAlbumOpen = false;
        });
    });
    template.removeData("albumId");
    next = "";
}

$(document).keyup(function(e) {
    if (e.keyCode == 27 && isAlbumOpen) { // ESC
        closeAlbum();
    }
});

function loadPhotos( albumId ) {
    isLoadingNext = true;
    FB.api(
        "/" + albumId + "/photos",
        'get',
        {
            pretty: 0,
            access_token: ACCESS_TOKEN,
            after: next
        },
        function ( response ) {
            console.log(response);
            if (response && !response.error) {
                for(var i = 0; i < response.data.length; i++) {
                    var photo = response.data[i];
                    var img = $('<img class="item"/>');
                    img.data("i", i);
                    img.data("photo", photo);
                    img.load(function() {
                        $(this).unbind("load");
                        wrapper.isotope().append(this).isotope('appended', this);
                        $(this).data("big", false);
                        $(this).click(function() {
                            if(bigPictureResizing) return;
                            bigPictureResizing = true;
                            if($(this).data("big")) {
                                $(this).animate({
                                    width: "162px"
                                }, 250, function() {
                                    wrapper.isotope('layout');
                                    $(this).data("big", false);
                                    this.src = $(this).data("photo").images[$(this).data("photo").images.length - 1].source;
                                    bigPicture = null;
                                    bigPictureResizing = false;
                                });
                            } else {
                                preload($(this).data("photo").images[1].source, null);
                                if(bigPicture != null) {
                                    bigPicture.animate({
                                        width: "162px"
                                    }, 250, function() {
                                        console.log("done1");
                                        $(this).data("big", false);
                                        this.src = $(this).data("photo").images[$(this).data("photo").images.length - 1].source;
                                    });
                                }
                                $(this).animate({
                                    width: "930px"
                                }, 300, function() {
                                    console.log("done2");
                                    wrapper.isotope('layout');
                                    $(this).data("big", true);
                                    this.src = $(this).data("photo").images[1].source;
                                    bigPicture = $(this);
                                    bigPictureResizing = false;
                                    wrapper.isotope( 'once', 'layoutComplete', function() {
                                        template.animate({
                                            scrollTop: bigPicture.offset().top + template.scrollTop() - $("body").scrollTop()
                                        }, 200);
                                    });
                                });
                            }
                        });
                        if($(this).data("i") == 24) {
                            if(template.scrollTop() + template.height() > wrapper.height() - 100) {
                                loadPhotos(albumId);
                            } else {
                                isLoadingNext = false;
                            }
                        }
                        $(this).removeData("i");
                    });
                    img[0].src = photo.images[photo.images.length - 1].source;
                }
                next = response.paging.cursors.after;
            }
        }
    );
}

function lockScroll() {
    var scrollPosition = [
        self.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft,
        self.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
    ];
    var html = $('html'); // it would make more sense to apply this to body, but IE7 won't have that
    html.data('scroll-position', scrollPosition);
    html.data('previous-overflow', html.css('overflow'));
    html.css('overflow', 'hidden');
    window.scrollTo(scrollPosition[0], scrollPosition[1]);
}

function unlockScroll() {
    var html = $('html');
    var scrollPosition = html.data('scroll-position');
    html.css('overflow', html.data('previous-overflow'));
    window.scrollTo(scrollPosition[0], scrollPosition[1])
}

function preload(resourceUrl) {
    var img = $("<img />");
    img.load(function() {
        $(this).remove();
    });
    img[0].src = resourceUrl;
}