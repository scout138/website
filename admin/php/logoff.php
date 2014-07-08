<?php
	session_start();
	$_SESSION = array();
	session_destroy();
?>
<script>
setTimeout(function () {
   window.location.href = "../index.php"; //will redirect to your blog page (an ex: blog.html)
}, 2000); //will call the function after 2 secs.
</script>
You have now been logged off.