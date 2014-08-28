<?php
	require('../../php/config.php');
	$con = mysqli_connect("$host","$user","$password","$db");
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	$deleteId = $_POST['id'];
	$query = "DELETE FROM post WHERE id = $deleteId";
	mysqli_query($con,$query);
	//echo $query;
	mysqli_close($con);
?>