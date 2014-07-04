<?php
function getNavClass($p) {
    return ($_GET["page"] == $p ? " class=\"selected\"" : "");
}
?>
<div class="header">
    <a href="/">
        <div class="logo"></div>
        <h2 class="title">138 Scout Group</h2>
    </a>
    <ul class="nav">
        <!--li><a href="/home"<?=getNavClass("home");?>>Home</a></li-->
        <li><a href="/about"<?=getNavClass("about");?>>About Us</a></li>
        <li><a href="/calendar"<?=getNavClass("calendar");?>>Calendar</a></li>
        <li><a href="/registration"<?=getNavClass("registration");?>>Registration</a></li>
    </ul>
</div>