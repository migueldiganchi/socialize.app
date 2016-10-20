function showFacebookUser(_FB) {

    if (!_FB) {
        console.info('Facebook plugin (FB) is not loaded...'); // @todo: handle this
        return;
    }

    console.info('FB inspection in app.user.js file...');
    console.log(_FB);

    _FB.api('/me', function(userInfo) {

        if (!isValidFacebookResponse(userInfo)) { 
            // @todo: handle not valid facebook response
            return;
        }
        
        // show user cover 
        $('img.cover').attr('src', userInfo.cover.source).removeClass('hide');
        
        // @todo: load user pages account to manage
        console.info('user accounts...');
        console.log(userInfo.accounts);

        // reload foundation to the document
        $(document).foundation(); 
    }, { 
        access_token: accessToken, 
        fields: "id, name, email, cover, gender, link, accounts" 
    });
}