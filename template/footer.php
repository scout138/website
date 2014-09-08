<div class="footer">
    Copyright &copy; 2009 - 2014 The 138th East Vancouver Scout Group
</div>
<script>
    $LAB
        .script("<?= BASE_URL ?>js/jquery.min.js").wait(function() {
            var originalHeight = $(".content-wrapper").outerHeight();

            if (window.innerHeight > originalHeight + $(".header").outerHeight() + $(".footer").outerHeight()) {
                $(".content-wrapper").css("min-height", window.innerHeight - $(".header").outerHeight() - $(".footer").outerHeight() - 100);
            }

            $(window).on('resize', function() {
                if ($(this).height() > originalHeight + $(".header").outerHeight() + $(".footer").outerHeight()) {
                    $(".content-wrapper").css("min-height", $(this).height() - $(".header").outerHeight() - $(".footer").outerHeight() - 100);
                }
            });

            initialize();
        });
</script>
</body>
</html>