<?php
	require('../../php/config.php');
	// Check connection
	$con=mysqli_connect("$host","$user","$password","$db");
	if (mysqli_connect_errno()) {
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
	$page = ($_POST['page'] - 1) * $_POST['limit'];
	$limit = $_POST['limit'];
	$request = "SELECT * FROM post LIMIT $page ,$limit";
	$result = mysqli_query($con,$request);
	while ($obj = mysqli_fetch_object($result)) {
    	$output[] = $obj;
	}
	echo json_encode($output);

	mysqli_close($con);
?>