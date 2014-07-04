<?php
function getNavClass($p) {
    return ($_GET["page"] == $p ? " class=\"selected\"" : "");
}
?>
<div class="header">
    <div class="logo"></div>
    <h2 class="title">138 Scout Group</h2>
    <ul class="nav">
        <li><a href="javascript:void(0);"<?=getNavClass("home");?>>Home</a></li>
        <li><a href="javascript:void(0);"<?=getNavClass("about");?>>About Us</a></li>
        <li><a href="javascript:void(0);"<?=getNavClass("calendar");?>>Calendar</a></li>
        <li><a href="javascript:void(0);"<?=getNavClass("registration");?>>Registration</a></li>
    </ul>
</div>