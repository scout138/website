<?php

$_POST["limit"] = (isset($_POST["limit"]) ? $_POST["limit"] : 5);
$_POST["page"] = (isset($_POST["page"]) ? $_POST["page"] : 0);
$_POST["pretty"] = (isset($_POST["pretty"]) ? $_POST["pretty"] : 0);

require("php/config.php");
$link = mysqli_connect($host, $user, $password, $db);
if (mysqli_connect_errno())
    die("Failed to connect to MySQL: " . mysqli_connect_error());

$return_array = array();
if($result = mysqli_query($link, "SELECT id, heading, albumID, description, time FROM post ORDER BY id DESC" . ($_POST["limit"] > 0 ? " LIMIT " . $_POST["limit"] : "") . " OFFSET " . $_POST["page"] * $_POST["limit"])) {

    while($row = mysqli_fetch_array($result)) {
        array_push($return_array, array(
            "id" => $row["id"],
            "title" => $row["heading"],
            "albumId" => $row["albumID"],
            "description" => $row["description"],
            "time" => $row["time"],
        ));
    }

}

if(count($return_array) >= $_POST["limit"])
	$return_array["nextPage"] = $_POST["page"] + 1;

if($_POST["pretty"] == 1)
	echo json_encode($return_array, JSON_PRETTY_PRINT);
else
	echo json_encode($return_array);

mysqli_close($link);