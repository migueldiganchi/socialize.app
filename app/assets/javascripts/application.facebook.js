window.fbAsyncInit = function() {

    var facebook_key = document.getElementById("__facebook_app_id").value;

    FB.init({
        appId   : facebook_key,
        status  : true,
        cookie  : true,
        version : 'v2.6'
    });

    checkForFacebookCallbacks();

};

(function(d, s, id, FB) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/es_LA/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
} (document, 'script', 'facebook-jssdk'));


function inviteFacebookFriends(invitationMessage) {

    // request app
    FB.ui({
        method: 'apprequests',
        filters: ['app_non_users'], // @todo: review this
        fields: "id, name, email",
        message: invitationMessage

    }, function(fb_response) {

        if (!fb_response || fb_response.error_code) {

            if (fb_response && fb_response.error_message) {
                console.log('Ha ocurrido el siguiente error: ' + fb_response.error_message);
            }

            // No se ha invitado a ningún usuario
            alert("No se ha invitado a ningún usuario"); // @todo: improve this
            return;
        }

        createInvitations(fb_response);
    });
}

// ensures logged in facebook calls
function doFacebookCallback(callback) {

    if (typeof callback != 'function') {
        // method is not defined
        return;
    }

    // check the facebook status before do some facebook call
    FB.getLoginStatus(function(fb_response) {
        handleFacebookResponse(fb_response, callback);
    });
}

// go check for facebook login state
function checkFacebookLoginStatus() {
    // @todo: check for FB var
    
    var loginButton = $('#login_button');
    loginButton.text('Verificando conexión con facebook...');

    FB.getLoginStatus(function(fb_response) {
        handleFacebookResponse(fb_response);
    });
}

// status change callback
function handleFacebookResponse(fb_response, callback) {

    try {
        if (fb_response.status === 'connected') {

            if (!callback) {
                connectApplication(fb_response);
                return;
            } else if (typeof callback != 'function') {
                return;
            }

            // do callback
            callback();

        } else {

            if (fb_response.status === 'not_authorized') {
                console.log('application is not authorized');
            }

            // the user isn't logged in to Facebook 
            requestFacebookLogin();
        }

    } catch (e) {
        // @todo: handle error response...
        console.log('error while check facebook user status...');
    }
}
// request the login status
function requestFacebookLogin() {

    var scope = $('#__facebook_scope').val();
    var loginButton = $('#login_button');

    FB.login(function(fb_response) {
        if (fb_response.authResponse) {
            handleFacebookResponse(fb_response);
        } else {
            // @todo: handle error
            loginButton.text(loginButtonOriginalText);
        }
    }, { scope: scope }); // @todo: get scope from server
}


// Call facebook methods if they were defined
function checkForFacebookCallbacks() {

    // if function is defined it will be called
    if (typeof showFacebookUser == 'function') {
        doFacebookCallback(showFacebookUser); 
    }

    // if function is defined it will be called
    if (typeof showFacebookPage == 'function') {
        doFacebookCallback(showFacebookPage);
    }

}