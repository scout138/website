$(function(){

    showHide = function(element) {
        // hide all the elements
        $("#create,#edit,#calendar").hide();

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
    }

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
            url: 'php/createPost.php',
            data: {
                header: $("#postHeader").val(),
                album: $("#album").val(),
                description: CKEDITOR.instances.description.getData()
            },
            success: function (data) {
                $("#error").html(data);
            },
        });
    };

    grabPosts = function(pageNum, numOfItems) {
        var posts = $("<table style='width:80%'><tr><td><b>Heading</b></td><td><b>Created On</b></td><td><b>Action</b></td></tr></table>");
        $.ajax({
            type: 'POST',
            url: 'php/grabPosts.php',
            data: {
                page: pageNum,
                limit: numOfItems
            },
            dataType: 'json',
            success: function (data) {
                for (i in data) {
                    posts.append("<tr><td class = 'heading'>" + data[i].heading + "</td> <td>" + data[i].time + "</td><td><a href = 'delete(" + data[i].id + ")'>Delete</a></td></tr>");
                }
                $("#editPosts").html(posts);
                //alert(data);
            },
        });

    };

    fbAlbumPicker = function() {
        toggleSpinner(true);
        FB.api('/292891094182467/albums', 'get', {
            pretty: 0,
            limit: 100,
            access_token: ACCESS_TOKEN
        }, function (response) {
            for(i in response.data) {
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

});