// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks
//= require foundation
//= require_tree .

$(document).foundation();

$(document).ready(function() {

    // controls
    var appContainer = $('#app_container');
    var loginButton = $('#login_button');
    var loginButtonOriginalText = loginButton.text();
    var inviteButton = $('#invite_button');
    var userNameBolder = $('#user_name');
    var userImage = $('img#user_image');

    $.ajaxSetup({ cache: true });

    $.getScript('//connect.facebook.net/en_US/sdk.js', function() {

        var facebook_app_id = $('#__facebook_app_id').val();

        FB.init({
            appId: facebook_app_id,
            version: 'v2.6', 
            cookie: true
        });

        // status change callback
        function handleFacebookResponse(response) {

            if (response.status === 'connected') {
                // the user is logged in and has authenticated your
                getRegisteredUser(response);
            } else {
                if (response.status === 'not_authorized') {
                    console.log('application is not authorized');
                }
                // the user isn't logged in to Facebook 
                requestLogin();
            }
        }

        // check for login status
        function checkLoginState() {
            loginButton.text('Verificando conexión con facebook...');
            FB.getLoginStatus(function(response) {
                handleFacebookResponse(response);
            });
        }

        // request the login status
        function requestLogin() {
            var scope = $('#__facebook_scope').val();
            FB.login(function(response) {
                if (response.authResponse) {
                    handleFacebookResponse(response);
                } else {
                    // @todo: handle error
                    console.log(response);
                }
            }, { scope: scope }); // @todo: get scope from server
        }

        // go register or get user
        function getRegisteredUser(loggedInResponse) {

            // @todo: check for possible errors in loggedInResponse
            var url = $('#__login_url').val();

            $.ajax({
                url : url,
                type : 'get', 
                data : {
                    signed_request: loggedInResponse.authResponse.signedRequest
                },
                beforeSend: function() {
                    loginButton.text('Obteniendo datos de usuario...');
                },
                success : function(app_response) {

                    if (app_response.error) {
                        // @todo: handle errors
                        loginButton.text(loginButtonOriginalText);
                        return;
                    }

                    loginButton.text('Usuario autenticado!');

                    var user = app_response.user;
                    var uid = user.uid;
                    var accessToken = loggedInResponse.authResponse.accessToken;
                    var panel = app_response.app_panel;

                    showUserInformation(uid, accessToken, panel);
                },
                complete: function() {
                    console.log('@todo: ajax-off');
                },
                dataType : 'json'
            });
        }

        function showUserInformation(uid, accessToken, panel) {
            // show user picture & name  
            FB.api('/me', function(userInfo) {

                // show user image profile
                userImage.attr('src', "http://graph.facebook.com/" + uid + "/picture?type=normal");

                console.log(userInfo)

                // show user name
                userNameBolder.text(userInfo.name);

                // load app panel
                appContainer.html(panel);

            }, { 
                access_token: accessToken, 
                fields: "id, name, email" 
            });
        }

        // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        // :::::::::::::::::::::::::: handlers :::::::::::::::::::::::::: 
        // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        
        loginButton.click(function() {
            checkLoginState();
            return false;
        });

    });
});