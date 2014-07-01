<?php
	require('../../php/config.php');
	if($_POST['header'] == "" || !isset($_POST['header'])) {
		echo "You need to have a header";
	} else {
		$con=mysqli_connect("$host","$user","$password","$db");

		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}
		$album = "";
		$description = "";
		$header = $_POST['header'];

		if(isset($_POST['album'])) {
			$album = explode(".",$_POST['album']);
			$i = 0;
			while(!is_numeric($album[$i])) {
				$i++;
			}
		}
		if(isset($_POST['description'])) {
			$description = $_POST['description'];
		}
		$request = "INSERT INTO post (heading, albumID, description) VALUES ('$header', '$album[$i]', '$description')";
		mysqli_query($con, $request);
		mysqli_close($con);
	}	
?>