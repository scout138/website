<!DOCTYPE html>
<html>
<head>
<title>Control Panel</title>
<link rel="stylesheet" href="style.css"/>
</head>

<body>
	<div id = "loginContainer">
		<div id ="loginHeader">Log In</div>
		<div id ="loginContainerContent">
			<form name = "login" action = "login.php" method = "POST">
				<label>Username: 
				<br /> <input type = "text" name = "user" id = "user"></label>
				<br />
				<label>Password: 
				<br /><input type = "password" name = "password" id = "password"></label>
		</div>
	</div>
</body>

</html>