var editPostLoaded = 0;
function showHide(element) {
	//hide all the elements
	var id = document.getElementById("create");
	id.style.display = 'none';
	id = document.getElementById("edit");
	if(editPostLoaded ==0) {
		grabPosts(1, 25);
	}
	id.style.display = "none";
	id = document.getElementById("calender");
	id.style.display = "none";
	//show the one we want
	id = document.getElementById(element);
	id.style.display = "block";
}
function getPhotoData(photoId, callback) {
    FB.api("/" + photoId, 'get', {pretty: 0, access_token: ACCESS_TOKEN}, callback);
}
function preview() {
	document.getElementById("preview").innerHTML = "";
	var header = document.getElementById("postHeader").value;
	var album = document.getElementById("album").value.split(".");
	var details = CKEDITOR.instances.description.getData();
	var i = 0;
	var post;
	if (typeof header != 'undefined') {
		$( "#preview" ).append( "<h1>" + header + "</h1>" );
	}
	if(typeof album != 'undefined'){
   		
   	while(!isFinite(album[i]) && i <=15) {
		i++;
	}
	if(i == 15) {
		alert("Invalid facebook photo album ");
	}
	
	var cover;
	FB.api('/'+album[i], 'get', {
                            pretty: 0,
                            access_token: ACCESS_TOKEN
                        }, function(response) {
		console.log(response)
		getPhotoData(response.cover_photo, function(response) {
			console.log(response);
			cover = response.images[(response.images.length-3)].source;
			$( "#preview" ).append( "<br /><img src = '" + cover + "' alt = 'coverPhoto'/><br />"  );
		});
	});
   	}	
   	if(typeof details != 'undefined') {
   		$( "#preview" ).append(details);
   	}

}
function submit() {
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
}


function grabPosts(pageNum, numOfItems) {
	var posts;
	posts = "<table style='width:80%'><tr><td><b>Heading</b></td><td><b>Created On</b></td><td><b>Action</b></td></tr>";
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
    			posts += "<tr><td class = 'heading'>" +data[i].heading + "</td> <td>" + data[i].time + "</td><td><a href = 'delete(" + data[i].id + ")'>Delete</a></td></tr>";
			}
			posts += "</table";
			$("#editPosts").html(posts);
			//alert(data);
	    },
	});
	
}
