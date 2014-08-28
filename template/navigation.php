<?php
function makeNav() {
    $nav = array(
        "about" => "About Us",
        "calendar" => "Calendar",
        "registration" => "Registration");

    foreach($nav as $k => $v)
        echo '<li><a href="' . $k . '"' . ($_GET["page"] == $k ? " class=\"selected\"" : "") . '>' . $v . '</a></li>';
}
?>
<div class="header">
    <a href=".">
        <div class="logo"></div>
        <h2 class="title">138th Scout Group</h2>
    </a>
    <ul class="nav">
        <?php makeNav(); ?>
    </ul>
</div>