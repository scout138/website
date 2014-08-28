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

    submit = function() {
        $.ajax({
            type: 'POST',
            url: 'php/post.php',
            data: {
                header: $("#postHeader").val(),
                album: $("#album").val(),
                description: $("#description").editable("getHTML")[0]
            },
            success: function (data) {
                if(data == "ok") {
                    $.jGrowl("Post successful");
                    $("#postHeader").val("");
                    $("#album").val("");
                    $("#description").editable("setHTML", "");
                    $("#preview").children().html("");
                    grabPosts();
                    showHide($("#list"));
                } else {
                    $.jGrowl(data)
                }
            }
        });
    };

    grabPosts = function() {
        var posts = $("<table style='width:100%'><tr><td><b>Heading</b></td><td><b>Created On</b></td><td><b>Action</b></td></tr></table>");
        $("#post-list").html(posts);
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
                    posts.append("<tr id=\"listedpostid" + data[i].id + "\"><td class='heading'>" + data[i].title + "</td> <td>" + data[i].time + "</td><td><a href='javascript: remove(" + data[i].id + ");'>Delete</a> | <a href='javascript: edit(" + data[i].id + ");'>Edit</a></td></tr>");
                    posts.find("#listedpostid" + data[i].id).data("post", data[i]);
                }
                $.jGrowl("Posts Loaded");
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
                    onclick: "$(\"input#album\").val(" + album.id + ");$(\"input#postHeader\").val(\"" + album.name + "\");"
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

    edit = function(postId) {
        var data = $("#listedpostid" + postId).data("post");
        var $formy = $("#edit-post");

        $formy.find("#edit-id").val(data.id);
        $formy.find("#edit-title").val(data.title);
        $formy.find("#edit-album").val(data.albumId);
        $formy.find("#edit-description").editable("setHTML", data.description);

        goToSlideFrom("#edit", "#rlist");
    };

    save = function() {
        $.ajax({
            type: 'POST',
            url: 'php/post.php',
            data: {
                mode: "edit",
                id: $("#edit-id").val(),
                header: $("#edit-title").val(),
                album: $("#edit-album").val(),
                description: $("#edit-description").editable("getHTML")[0]
            },
            success: function (data) {
                if(data == "ok") {
                    $.jGrowl("Post successful");
                    $("#postHeader").val("");
                    $("#album").val("");
                    $("#description").editable("setHTML", "");
                    $("#preview").children().html("");
                    grabPosts();
                    backToSlideFrom('#rlist', '#edit');
                } else {
                    $.jGrowl(data)
                }
            }
        });
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