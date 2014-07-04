<?php
	session_start();
	if(!isset($_SESSION['id'])) {
		header('Location: login.html');

	}
?>
<!DOCTYPE html>
<html>
<head>
<title>Control Panel</title>
<link rel="stylesheet" href="style.css"/>
<script src="js/main.js"></script>
</head>

<body>
	<div id = "header">
		<div id = "logo">
			<img src = "http://www.scouts.ca/brandcentre/resources/logo/scouts-logo-notagline-web.png" alt = "logo" height = "144px"  width = "180px">
		</div>
		<div id = "title">138 Scout Group Control Panel</div>
	<br style="clear:both;"/><hr />
	</div>
		<div id = "menu">
			<ul>
				<li id = "menuItems" onclick = "showHide('create')"><a href = "#">Create Post</a></li>
				<li id = "menuItems" onclick = "showHide('edit')"><a href = "#">Edit Post</a></li>
				<li id = "menuItems" onclick = "showHide('calender')"><a href = "#">Calender</a></li>
			</ul>
		</div>
		<div id = "content">
			<div id = "create"><h1>Create Post</h1>
				<form name="input" action="php/createPost.php" method="post">
					Header:<br />
					<input type = "text" name = "header"><br />
					Add facebook photo album(copy and paste the url of album)<br />
					<input type = "text" name = "album"><br />
					Additional Details<br />
					<textarea style="width:80%; height:500px;" name = "description"></textarea><br />
					<input type="submit" value="Create Post">
				</form>	
				<button value = "Preview Post">Preview Post</button>
			</div>	
			
			<div id = "edit"><h1>Edit Post</h1> 
				Words
			</div>
			<div id = "calender"><h1>Calender</h1>
				<iframe src="https://www.google.com/calendar/embed?src=pccrovers.com_pojeic2sd1ojijt7ohop7gt338%40group.calendar.google.com&ctz=America/Vancouver" style="border: 0" width="80%" height="600" frameborder="0" scrolling="no">
				</iframe>
			</div>
		</div>

</body>

</html>