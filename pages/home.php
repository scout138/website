<div class="content-wrapper">
    <div class="main-content">
    </div>
    <div class="right-side">
        <div class="widget">
            <div class="title">
                Upcoming Events
            </div>
            <ul class="events top">
            </ul>
        </div>
    </div>
    <div style="clear: both;"></div>
</div>
<script>
    var initialize = function() {
        $LAB
            .script("//connect.facebook.net/en_US/sdk.js").wait()
            .script("js/date.js")
            .script("//apis.google.com/js/client.js").wait()
            .script("<?= BASE_URL ?>js/fbinit.js")
            .script("<?= BASE_URL ?>js/home.js");
    };
</script>