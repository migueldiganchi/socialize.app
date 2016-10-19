window.fbAsyncInit = function() {

    // var facebook_key = $('#__facebook_app_id').val();
    
    var facebook_key = '2082688085288893';

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
        
        var signedRequest = fb_response.authResponse.signedRequest;
        var facebookAppId = $('#__facebook_app_id').val();
        var cookieName = 'fbsr_' + facebookAppId;
        var cookie = $.cookie(cookieName);

        // @todo: check if cookie exists

        if (cookie === undefined) {
            $.cookie(cookieName, signedRequest);
        }
        console.info('cookie inspection...');

        // ajax call
        connectApplication(fb_response);
        
        // no-ajax call
        // window.location = '/auth/facebook/callback'
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
function checkForFacebookLoading(FB) {

    console.info('FB inspection...');
    console.log(FB);

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