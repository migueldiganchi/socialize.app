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
    var dynamicContainer = $('#dynamic_container');
    var logoutButton = $('#logout_button');
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
                    loginButton.text(loginButtonOriginalText);
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

                    if (!app_response || app_response.error) {
                        // @todo: handle errors
                        loginButton.text(loginButtonOriginalText);
                        return;
                    }

                    loginButton.text('Usuario autenticado!').addClass('logged-in');
                    logoutButton.addClass('logged-in');

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

                // show user name
                userNameBolder.text(' ' + userInfo.name);

                // load app panel
                dynamicContainer.html(panel);

            }, { 
                access_token: accessToken, 
                fields: "id, name, email" 
            });
        }

        function inviteFriends(invitationMessage) {

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
                    alert("No se ha invitado a ningún usuario"); // @todo: improve This
                    return;
                }

                // @todo: check for errors
                var request = fb_response.request;
                var fb_invited_uids = fb_response.to;
                var url = $('#__invitations_url').val();

                $.ajax({
                    url : url,
                    type : 'post', 
                    data : {
                        fb_uids: fb_invited_uids
                    },
                    beforeSend: function() {
                        
                    },
                    success : function(app_response) {

                        var message = null;

                        if (!app_response || app_response.error) {
                            var message = 'Ha ocurrido un error en la invitación';
                            alert(message);
                            return;
                        }
                        
                        dynamicContainer.html(app_response);

                    },
                    complete: function() {
                        console.log('@todo: ajax-off');
                    },
                    dataType : 'html'
                });
            });
        }

        // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        // :::::::::::::::::::::::::: handlers :::::::::::::::::::::::::: 
        // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        
        loginButton.click(function() {
            checkLoginState();
            return false;
        });

        // native events
        $(document).on('click', '#invite_button', function(e) {
            inviteFriends("Hooola! Vení a probar ésta app!");
            return false;
        });

        // $('<div style="border: solid 1px red;"><h1>This is my publication1?</h1></div>').publish(5000);
        // $('<div style="border: solid 1px red;"><h1>This is my publication2?</h1></div>').publish(5000);

    });

});