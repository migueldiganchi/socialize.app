function showFacebookPage() {

    if (!FB) {
        console.info('Facebook plugin (FB) is not loaded...'); // @todo: handle this
        return;
    }

    var fbPageId = $('#__fb_page_id').val();
    var fbUrlPage = '/' + fbPageId;

    FB.api(fbUrlPage, function (fb_response) {
            console.log(fb_response);
            // alert('are we here with the facebook page information?');
            if (fb_response && !fb_response.error) {
                /* handle the result */
            }
        }
    );
}