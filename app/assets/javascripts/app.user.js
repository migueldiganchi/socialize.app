function showFacebookUser() {

    if (!FB) {
        console.info('Facebook plugin (FB) is not loaded...'); // @todo: handle this
        return;
    }

    console.info('at this point FB global object has to exist to call the facebook user...');
    console.log(FB);

    FB.api('/me', function(userInfo) {

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
        fields: "id, name, email, cover, gender, link, accounts" 
    });
}