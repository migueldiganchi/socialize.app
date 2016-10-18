window.fbAsyncInit = function() {

    var facebook_key = $('#__facebook_app_id').val();

    FB.init({
        appId   : facebook_key,
        cookie  : true,
        status  : true,
        xfbml   : true,
        version : 'v2.6'
    });

    checkForFacebookLoading(FB);
};

(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/es_LA/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
} (document, 'script', 'facebook-jssdk'));

// go check for facebook login state
function checkLoginState() {
    // @todo: check for FB var
    loginButton.text('Verificando conexión con facebook...');
    FB.getLoginStatus(function(fb_response) {
        handleFacebookResponse(fb_response);
    });
}

// status change callback
function handleFacebookResponse(fb_response) {

    if (fb_response.status === 'connected') {
        // the user is logged in and has authenticated your
        connectApplication(fb_response.authResponse.signedRequest);
    } else {

        if (fb_response.status === 'not_authorized') {
            console.log('application is not authorized');
        }
        // the user isn't logged in to Facebook 
        requestLogin();
    }
}
// request the login status
function requestLogin() {

    var scope = $('#__facebook_scope').val();

    // @todo: validate for scope value

    FB.login(function(response) {
        if (response.authResponse) {
            handleFacebookResponse(response);
        } else {
            // @todo: handle error
            loginButton.text(loginButtonOriginalText);
        }
    }, { scope: scope }); // @todo: get scope from server
}


// after loading page checking
function checkForFacebookLoading() {

    var callTo = $('#__call_to').val();

    switch(callTo) {
        case 'fb_user': 
            showFacebookUser(FB); 
            break;

        case 'fb_page': 
            showFacebookPage(FB);
            break;

        default: 
            break; // no ajax call
        
    }
}