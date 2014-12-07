<?php
if($_GET["part"] == "attendance") {
    switch($_GET["sub"]) {
        case "venturers":
            $section_id = 0;
            break;
        case "scouts":
            $section_id = 1;
            break;
        case "cubs":
            $section_id = 2;
            break;
        case "beavers":
            $section_id = 3;
            break;
    }
?>
    <div class="content-wrapper">
        <iframe src="//attendance.scout138.com/embed.php?section=<?=$section_id?>" frameborder="0" style="width:100%;height:700px;"></iframe>
    </div>
<?php
} else if($_GET["part"] == "badges") {
?>
    <div class="content-wrapper">
        <h1>This area of the site is currently unavailable.</h1>
    </div>
<?php
} else {
    include "home.php";
}
?>