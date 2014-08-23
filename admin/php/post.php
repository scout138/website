<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

$_POST["mode"] = (isset($_POST["mode"]) ? $_POST["mode"] : "new");

if($_POST['mode'] && (!isset($_POST['id']) || $_POST['id'] == ""))
	die("Post ID is missing");

if(!isset($_POST['header']) || $_POST['header'] == "")
	die("Title is missing");

if(!isset($_POST['album']) || $_POST['album'] == "")
	die("Facebook album is missing");

if(!isset($_POST['description']) || $_POST['description'] == "")
	die("Description is missing");

// connect to the database
require('../../php/config.php');
$con = mysqli_connect("$host","$user","$password","$db");
if (mysqli_connect_errno())
  die("Failed to connect to MySQL: " . mysqli_connect_error());

// escape the user input to prevent sql injection attacks!
$header = mysqli_real_escape_string($con, $_POST['header']);
$albumID = mysqli_real_escape_string($con, $_POST['album']);
$description = mysqli_real_escape_string($con, $_POST['description']);

// validate album id
$album_data = file_get_contents("http://graph.facebook.com/" . $albumID ."?pretty=0");
$album_data = json_decode($album_data, true);
if(isset($album_data["error"]) || !isset($album_data["from"]))
	die("That Facebook album does not exist");
if($album_data["from"]["id"] != "292891094182467")
	die("We do not own that Facebook album");

if($_POST["mode"] == "new") {
	$request = "INSERT INTO post (heading, albumID, description) VALUES ('$header', '$albumID', '$description')";
} else if($_POST["mode"] == "edit") {
	$request = "UPDATE post SET heading='" . $header . "', albumID='" . $albumID . "', description='" . $description . "' WHERE id=" . $_POST['id'] . ";";
}

if(!mysqli_query($con, $request))
	die(mysqli_error($con));

echo "ok";
mysqli_close($con);