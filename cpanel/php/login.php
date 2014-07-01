<?php
	require('../../php/config.php');
	if(isset($_POST['user']) && $_POST['user'] != ""){
		$username = $_POST['user'];
	} else {
		echo "You need to enter a username<br />";
	}
	if(isset($_POST['password']) && $_POST['password'] != ""){
		$inputpassword = $_POST['password'];
	} else {
		echo "You need to enter a password<br />";
	}
	$con=mysqli_connect("$host","$user","$password","$db");
	
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	$request = "SELECT id FROM users WHERE username = '$username' && password = '$inputpassword'";
	
	//echo $request;
	$result = mysqli_query($con, $request);
    if(mysqli_num_rows($result) == 1){
     	session_start();
		while($row = mysqli_fetch_array($result)) {
		 	$_SESSION['id'] = $row['id'];
		}
		echo "Login Successful";
     	
    } else {
    	echo "Your password or username is incorrect";
    }
	mysqli_close($con);
		
?>