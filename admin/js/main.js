$(function(){

    showHide = function(element) {
        // hide all the elements
        $("#create,#list,#calendar").hide();

        // show the one we want
        $(element).show();
    };

    toggleSpinner = function(on) {
        if(typeof on == 'undefined') on = !$("#spinner").is(":visible");
        if(on) {
            $("#spinner").show();
            spinners.play();
        } else {
            $("#spinner").hide();
            spinners.pause();
        }
    };

    getPhotoData = function(photoId, callback) {
        FB.api("/" + photoId, 'get', {pretty: 0, access_token: ACCESS_TOKEN}, callback);
    };

    preview = function(title, album, details) {
        console.log(title);
        console.log(album);
        console.log(details);

        $("#pre-title").text(title);
        $("#pre-image").css('background-image', "");
        $("#pre-desc").html(details);

        if(album != "" || album != null || typeof album != "undefined")
            FB.api(
                    "/" + album,
                'get',
                {
                    pretty: 0,
                    access_token: ACCESS_TOKEN
                },
                function ( response ) {
                    if (response && !response.error) {
                        getPhotoData(response.cover_photo, function (response) {
                            if (response && !response.error) {
                                $("#pre-image").css('background-image', "url(" + response.images[4].source + ")");
                            }
                        });
                    }
                }
            );

        Lightview.show({
            url: 'preview',
            type: 'inline',
            viewport: 'crop'
        });

    };

    submitPost = function(form) {
        var sections = [];
        $(form).find("input[name='sections[]']").each(function() {
            if($(this).is(":checked")) sections.push($(this).val());
        });
        $.ajax({
            type: 'POST',
            url: 'php/post.php',
            data: {
                mode: $(form).attr("mode"),
                id: $(form).find("input[name='post-id']").val(),
                header: $(form).find("input[name='title']").val(),
                album:  $(form).find("input[name='album']").val(),
                date:  $(form).find("input[name='date']").val(),
                sections: sections,
                description:  $(form).find("textarea").editable("getHTML")[0]
            },
            success: function (data) {
                if(data == "ok") {
                    $.jGrowl("Post successful");
                    $(form).find("input[name='post-id']").val("");
                    $(form).find("input[name='title']").val("");
                    $(form).find("input[name='album']").val("");
                    $(form).find("input[name='album']").val("");
                    $(form).find("input[name='sections[]']").each(function() {
                        if($(this).is(":checked")) $(this).prop('checked', false);
                    });
                    $(form).find("textarea").editable("setHTML", "");
                    $("#preview").children().html("");
                    grabPosts();
                    if($("#list").is(":visible")) backToSlideFrom('#rlist', '#edit');
                    showHide($("#list"));
                } else {
                    $.jGrowl(data);
                }
            }
        });
    };

    grabPosts = function() {
        var posts = $("<table style='width:100%'><tr><td><b>Heading</b></td><td><b>Sections</b></td><td><b>Date</b></td><td><b>Action</b></td></tr></table>");
        $("#post-list").html(posts);
        toggleSpinner(true);
        $.ajax({
            url: '../json.php',
            dataType: 'json',
            type: 'post',
            data: {
                limit: 0
            },
            success: function (response) {
                var data = response.data;
                for (var i in data) {
                    var $listing = $("<tr><td class='heading'>" + data[i].title + "</td><td>" + data[i].sections.split("|").join(", ") + "</td><td>" + data[i].date + "</td><td><a href=\"javascript: if(confirm('Delete " + data[i].title + "?')) remove(" + data[i].id + ");\">Delete</a> | <a href=\"#\" onclick=\"edit($(this).parent().parent().data('post'));return false;\">Edit</a></td></tr>");
                    $listing.data("post", data[i]);
                    posts.append($listing);
                }
                $.jGrowl("Posts Loaded");
            },
            complete: function() {
                toggleSpinner(false);
            }
        });

    };

    fbAlbumPicker = function() {
        toggleSpinner(true);
        FB.api('/292891094182467/albums', 'get', {
            pretty: 0,
            limit: 100,
            access_token: ACCESS_TOKEN
        }, function (response) {
            for(var i in response.data) {
                var album = response.data[i];
                var img = $("<img />", {
                    src: "http://graph.facebook.com/" + album.id + "/picture",
                    width: "140"
                });
                var item = $("<div />", {
                    text: album.name,
                    class: "item",
                    style: "background-image: url(" + img.src + ");",
                    onclick: "$(\"input#new-album\").val(" + album.id + ");$(\"input#new-title\").val(\"" + album.name + "\");"
                });
                item.data("isLast", (response.data.length-1) == i);
                img.load(function() {
                    var item = $(this).parent();
                    iso.append(item).isotope("appended", item);
                    if(item.data("isLast")) {
                        toggleSpinner(false);
                        Lightview.show({
                            url: 'album-selector',
                            type: 'inline',
                            skin: 'light',
                            viewport: 'crop',
                            options: {
                                afterUpdate: function() {
                                    console.log("hide!");
                                    iso.isotope('layout');
                                },
                                onHide: function () {
                                    iso.isotope('remove', iso.children());
                                }
                            }
                        });
                    }
                });
                item.prepend(img);
            }
        });

    };

    edit = function(data) {
        var $formy = $("#edit-post");

        $formy.find("#edit-id").val(data.id);
        $formy.find("#edit-title").val(data.title);
        $formy.find("#edit-album").val(data.albumId);
        $formy.find("#edit-date").val(Date.parseExact(data.date, 'MMMM d, yyyy').toString('yyyy.MM.dd'));
        data.sections.split("|").forEach(function(section) {
            $formy.find("#edit-section-" + section).prop("checked", true);
        });
        $formy.find("#edit-description").editable("setHTML", data.description);

        goToSlideFrom("#edit", "#rlist");
    };

    goToSlideFrom = function(target, current) {
        $(target).css("left", $(target).outerWidth());
        $(target).show();
        $(target).animate({ left: 0 }, 400, "swing", function() {
            $(target).css("left", "");
        });
        $(current).animate({ left: -$(current).outerWidth() }, 400, "swing", function() {
            $(current).hide();
            $(current).css("left", "");
        });
    };

    backToSlideFrom = function(target, current) {
        $(target).css("left", -$(target).outerWidth());
        $(target).show();
        $(target).animate({ left: 0 }, 400, "swing", function() {
            $(target).css("left", "");
        });
        $(current).animate({ left: $(current).outerWidth() }, 400, "swing", function() {
            $(current).hide();
            $(current).css("left", "");
        });
    };

});
function remove(postId) {
    $.ajax({
        type: 'POST',
        url: 'php/delete.php',
        data: {
            id: postId

        },
        success: function (data) {
            grabPosts();
        }
    });
}