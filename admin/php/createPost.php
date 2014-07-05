<?php
	require('../../php/config.php');
	if($_POST['header'] == "" || !isset($_POST['header'])) {
		echo "You need to have a header";
	} else {
		$con=mysqli_connect("$host","$user","$password","$db");

		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}
		$description = "";
		$header = $_POST['header'];
		$albumID = "";
		if(isset($_POST['album']) && $_POST['album'] != "") {
			$album = explode(".",$_POST['album'],10);
			
			$count = 0;
			foreach($album as $value) {
				if(is_numeric($value) && $albumID == "") {
					$albumID = $album[$count];
				}
				$count++;
			}
		} else {
			$i = 0;
			$album[$i] = "";
		}
		//echo $albumID;
		if(isset($_POST['description'])) {
			$description = $_POST['description'];
		} else {
			echo "You need to put a description";
		}
		$request = "INSERT INTO post (heading, albumID, description) VALUES ('$header', '$albumID', '$description')";
		//echo $request;
		if(mysqli_query($con, $request)) {
			echo "Successful.";
		} else {
			echo "Failed";
		}
		mysqli_close($con);
	}	
?>