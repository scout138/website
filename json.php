<?php
/**
 * Created by IntelliJ IDEA.
 * User: Steve
 * Date: 7/3/14
 * Time: 12:41 AM
 */
$_GET["limit"] = (isset($_GET["limit"]) ? $_GET["limit"] : 5);
$_GET["page"] = (isset($_GET["page"]) ? $_GET["page"] : 0);

require("php/config.php");
$link = mysqli_connect($host, $user, $password, $db);
if (mysqli_connect_errno())
    die("Failed to connect to MySQL: " . mysqli_connect_error());

$return_array = array();
if($result = mysqli_query($link, "SELECT heading, albumID, description FROM post ORDER BY id DESC LIMIT " . $_GET["limit"] . " OFFSET " . $_GET["page"] * $_GET["limit"])) {

    while($row = mysqli_fetch_array($result)) {
        array_push($return_array, array(
            "title" => $row["heading"],
            "albumId" => intval($row["albumID"]),
            "description" => $row["description"]
        ));
    }

}

echo json_encode($return_array);

mysqli_close($link);