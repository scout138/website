<?php
function make_nav() {
    $nav = array(
        "Calendar" => BASE_URL . "calendar",
        "Resources" => array(
            "Reimbursement Form" => "//files.scout138.com/leader-reimbursement-form-2014.pdf?dl",
            "Canadian Path" => [
                "Beavers" => "//files.scout138.com/canadian-path/beavers.pdf?dl",
                "Cubs" => "//files.scout138.com/canadian-path/cubs.pdf?dl",
                "Scouts" => "//files.scout138.com/canadian-path/scouts.pdf?dl",
                "Venturers" => "//files.scout138.com/canadian-path/venturers.pdf?dl",
                "FAQ" => "//files.scout138.com/canadian-path/faq.pdf?dl"
            ],
            "Tech Guide" => "//sites.google.com/a/scout138.com/wiki/",
            "Attendance" => "http://attendance.scout138.com/",
            "Leaders' Contact Info" => "#",
            "Physical Fitness Forms" => [
                "Beavers" => "//files.scout138.com/physical-fitness-forms/beavers/",
                "Cubs" => "//files.scout138.com/physical-fitness-forms/cubs/",
                "Scouts" => "//files.scovut138.com/physical-fitness-forms/scouts/",
                "Venturers" => "//files.scout138.com/physical-fitness-forms/venturers/",
            ],
            "Uniform Badge Placement" => "//files.scout138.com/public/insignia-placement.pdf",
            "Police Record Check" => "//justice.gov.bc.ca/eCRC/",
        ),
        "Thank a Leader!" => "//www.myscouts.ca/ca/commendation/submit",
        "Registration" => BASE_URL . "registration",
        "About Us" => BASE_URL . "about",
    );

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
        <div class="group-logo"></div>
<!--        <h2 class="title">138th Scout Group</h2>-->
    </a>

    <?php make_nav(); ?>
</div>