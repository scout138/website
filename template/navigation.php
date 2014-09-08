<?php
function make_nav() {
    $nav = array(
        "Sections" => array(
            "Beavers" => array(
                "Posts" => BASE_URL . "tag/beavers",
                "Attendance" => BASE_URL . "section/beavers/attendance",
            ),
            "Cubs" => array(
                "Posts" => BASE_URL . "tag/cubs",
                "Attendance" => BASE_URL . "section/cubs/attendance",
                "Badges" => BASE_URL . "section/cubs/badges",
            ),
            "Scouts" => array(
                "Posts" => BASE_URL . "tag/scouts",
                "Attendance" => BASE_URL . "section/scouts/attendance",
                "Badges" => BASE_URL . "section/scouts/badges",
            ),
            "Venturers" => array(
                "Posts" => BASE_URL . "tag/venturers",
                "Attendance" => BASE_URL . "section/venturers/attendance",
                "Badges" => BASE_URL . "section/venturers/badges",
            ),
        ),
        "Calendar" => BASE_URL . "calendar",
        "Leaders' Resources" => "javascript: void(); /*files*/",
        "Registration" => BASE_URL . "registration",
        "About Us" => BASE_URL . "about",);

    echo "<ul class=\"nav\">";
        generate_dom($nav);
    echo "</ul>";
}

function generate_dom($nav) {
    foreach($nav as $k => $v) {
        if(is_array($v)) {
            echo "<li class=\"parent\"><a href=\"javascript:void();\"" . ($_GET["page"] == $v ? " class=\"selected\"" : "") . ">" . $k . "</a><ul>";
            generate_dom($v);
            echo "</ul></li>";
        } else {
            echo "<li><a href=\"" . $v . "\"" . ($_GET["page"] == $v ? " class=\"selected\"" : "") . ">" . $k . "</a></li>";
        }
    }
}
?>
<div class="header">
    <a href="<?= BASE_URL ?>">
        <div class="logo"></div>
        <h2 class="title">138th Scout Group</h2>
    </a>

    <?php make_nav(); ?>
</div>