<?php
//error_reporting(E_ALL);
//ini_set('display_errors', '1');

$_POST["mode"] = (isset($_POST["mode"]) ? $_POST["mode"] : "new");

if($_POST['mode'] != "new" && (!isset($_POST['id']) || $_POST['id'] == ""))
	die("Post ID is missing");

if(!isset($_POST['header']) || $_POST['header'] == "")
	die("Title is missing");

if(!isset($_POST['album']) || $_POST['album'] == "")
	die("Facebook album is missing");

if(!isset($_POST['date']) || $_POST['date'] == "")
	die("Date is missing");

if(!isset($_POST['sections']) || $_POST['sections'] == "")
	die("No sections were selected");

if(!isset($_POST['description']) || $_POST['description'] == "")
	die("Description is missing");

// connect to the database
require('../../php/config.php');
$con = mysqli_connect($host,$user,$password,$db);
$pdo = new PDO("mysql:host=" . $host . ";dbname=" . $db . ";", $user, $password);

// validate album id
$album_data = file_get_contents("http://graph.facebook.com/" . $_POST['album'] ."?access_token=524905380971501|vwvIt1ualZz_1V5DX17el6NJPe0&pretty=0");
$album_data = json_decode($album_data, true);
if(isset($album_data["error"]) || !isset($album_data["from"]))
	die("That Facebook album does not exist");
if($album_data["from"]["id"] != "292891094182467")
	die("We do not own that Facebook album");

if($_POST["mode"] == "new") {
	$stmt = $pdo->prepare("INSERT INTO post (heading, albumID, description, tags, date) VALUES (:title, :albumid, :descr, :sections, :date)");
} else if($_POST["mode"] == "edit") {
    $stmt = $pdo->prepare("UPDATE post SET heading = :title, albumID = :albumid, description = :descr, tags = :sections, date = :date WHERE id = :postid");
    $stmt->bindParam(":postid", $_POST['id']);
} else die("Bad mode given");

$stmt->bindParam(":title", $_POST['header']);
$stmt->bindParam(":albumid", $_POST['album']);
$stmt->bindParam(":descr", $_POST['description']);
$stmt->bindParam(":sections", implode("|", $_POST['sections']));
$stmt->bindParam(":date", $_POST['date']);

if(!$stmt->execute())
	die($stmt->errorInfo());

echo "ok";
$pdo = null;