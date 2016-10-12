
function showFacebookPage(_FB) {

    if (!_FB) {
        console.info('Facebook plugin (FB) is not loaded...'); // @todo: handle this
        return;
    }

    var accessToken = _FB.getAccessToken();


    console.log(_FB);
    alert('in showFacebookPage');

    var accessToken = null;
    var fbPageId = $('#__fb_page_id').val();
    // @todo: validate pageId content
    
    var fbUrlPage = '/' + fbPageId;

    _FB.api(
        fbUrlPage,
        function (fb_response) {
            console.log(fb_response);
            alert('are we here with the facebook page information?');
            if (fb_response && !fb_response.error) {
                /* handle the result */
            }
        }
    );
}