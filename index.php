<?php
$_GET["page"] = (isset($_GET["page"]) ? $_GET["page"] : "home");
if(!in_array($_GET["page"], array("home", "registration", "about", "calendar", "files", "section"))) {
    header("HTTP/1.0 404 Not Found");
    $_GET["page"] = "404";
}

define("BASE_URL", "/scout-web/");

include("template/header.php");
include("pages/" . $_GET["page"] . ".php");
include("template/footer.php");
