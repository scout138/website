$(function(){

    showHide = function(element) {
        // hide all the elements
        $("#create,#edit,#calendar").hide();

        // show the one we want
        $(element).show();
    };

    getPhotoData = function(photoId, callback) {
        FB.api("/" + photoId, 'get', {pretty: 0, access_token: ACCESS_TOKEN}, callback);
    };

    preview = function() {
        $("#preview").html("");
        var header = $("#postHeader").val();
        var album = $("#postHeader").val().split(".");
        var details = $("#description").editable("getHTML");
        var i = 0;
        var post;
        if (typeof header != 'undefined') {
            $( "#preview" ).append( "<h1>" + header + "</h1>" );
        }
        if(typeof album != 'undefined') {

            while (!isFinite(album[i]) && i <= 15) {
                i++;
            }
            if (i == 15) {
                alert("Invalid facebook photo album ");
            }

            var cover;
            FB.api(
                    '/' + album[i],
                    'get',
                    {
                        pretty: 0,
                        access_token: ACCESS_TOKEN
                    },
                    function (response) {
                        console.log(response);
                        getPhotoData(response.cover_photo, function (response) {
                            console.log(response);
                            cover = response.images[(response.images.length - 3)].source;
                            $("#preview").append("<br /><img src = \"" + cover + "\" alt = \"coverPhoto\"/><br />");
                        });
                    }
            );
        }

        if(typeof details != 'undefined') {
            $( "#preview" ).append(details);
        }

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
                item.data("isLast", (response.data.length -1 == i));
                img.load(function() {
                    var item = $(this).parent();
                    iso.append(item).isotope("appended", item);
                });
                item.prepend(img);
            }

            Lightview.refresh();
        });

        Lightview.show({
            url: 'album-selector',
            type: 'inline',
            viewport: 'scale',
            options: {
                onHide: function () {
                    iso.isotope('remove', iso.children());
                }
            }
        });
    };

});