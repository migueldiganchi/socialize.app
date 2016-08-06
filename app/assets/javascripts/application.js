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
    var mainLightContainer = $('#main_light_container');
    var logoutButton = $('#logout_button');
    var loginButton = $('#login_button');
    var loginButtonOriginalText = loginButton.text();
    var lightsContainer = $('#lights_container');
    var inviteButton = $('#invite_button');
    var userNameBolder = $('#user_name');
    var lightsUrl = $('#__lights_url').val();

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

                // show user name
                userNameBolder.text(' ' + userInfo.name);

                // load app panel
                 $(mainLightContainer).html(panel);

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

                        // alert(app_response);
                        
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

        // native events
        $(document).on('click', '.button.icn.plant', function(e) {
            // @todo: post positive votation service
            alert('positive votation :)');
            return false;
        });

        $(document).on('click', '.button.icn.deny', function(e) {
            // @todo: negative votation
            alert('negative votation :(');
            return false;
        });

        $(document).on('keyup', '#light_description', function(e){
            var value = $(this).val();
            var is_empty = $.trim(value).length < 1;

            $('form input[type=submit]').prop('disabled', is_empty);
        });

        $(document).on('click', '#light_a_candel', function(){

            console.log('@todo: handle this');
        });

        // always handlers
        $(document).on('click', '#btn_more_lights', function(){

            var from = $(this).attr('data-from');

            // alert('calculate this \'from\' light');

            showMoreLights(from);

        });

        // login handlers
        $(document).on('submit', 'form.light-form', function() {

            var url = $(this).attr('action');
            var data = $(this).serialize();
            var lightContainers = $(this).parents();
            var lightContainer = null;

            console.log(lightContainers);

            for (var i = 0; i < lightContainers.length; i++) {
                var container = $(lightContainers[i]);
                if ($(container).is('div.light')) {
                    lightContainer = $(container);
                }
            }

            $.post(url, data, function(response) {

                if (!isValidResponse(response)){
                    return false;
                }

                $('<div><b>@todo: notify the user that the light has saved successfuly</b></div>').publish(2000);

                var light = jQuery.parseJSON(response.light);

                lightACandle(light, lightContainer);

            }, 'json');

            return false;
        });

        // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        // :::::::::::::::::::::::::  methods ::::::::::::::::::::::::::: 
        // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        
        function lightACandle(light, container) {

            var url = lightsUrl + '/' + light.id;
            var lights_on = $(lightsContainer).find('div.light').not('.new');
            var first_light_on = lights_on.length > 0 ? lights_on[0] : null;

            for (var i = 0; i < lights_on.length; i++) {
                light_on = lights_on[i];

                console.log(light_on);
            }

            $.get(url, null, function(response) {

                if (!isValidResponse(response)) {
                    return false;
                }

                // @todo: consider trasitions here?
                if (first_light_on) {
                    $(first_light_on).remove()
                }

                var component = '<div class="light columns small-4 profile text-center float-left">' + 
                    response + 
                '</div>'; 

                $(container).before(component);

            }, 'html');
        }
        
        function showMoreLights(from) {

            var url = lightsUrl;
            var btnMoreLights = $('#btn_more_lights');
            var original_text = $(btnMoreLights).text();
            var from = from ? from : 0;

            console.log(lightsUrl);

            // ajax-loading
            $(btnMoreLights).text('Cargando más luces...');

            $.get(url, {
                from: from
            }, function(response) {

                $(btnMoreLights).text(original_text);

                // check for errors
                if (!isValidResponse(response)) {
                    return false;
                }

                $(lightsContainer).prepend(response);

                $(btnMoreLights).remove(); // will be replaced in the new element

            }, 'html');

        }

        // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        // :::::::::::::::::::::::: utilities ::::::::::::::::::::::::::: 
        // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

        function goTop(top) {
            $('html, body').animate({
                scrollTop : top
            }, 'slow');
        }

        
        function isValidResponse(response) {

            var json_data = getJSON(response);

            if (json_data) {

                var message = null;

                // check for errors 
                if (json_data.error) {

                    message = json_data.message ? json_data.message : 'Ha ocurrido un error en el servidor';

                    showFlashMessage(true, message, "info", false);
                    
                    return false            

                }

                // check for expired session
                if (json_data.session_expired) {

                    message = json_data.message ? json_data.message : 'Debe iniciar sesión para continuar';

                    $('div#session_expired_message').find('.modal-body #title').text(message);

                    $('div#session_expired_message').modal('show');

                    return false

                } 

            }
            
            return true;
        }

        function getJSON(data) {

            try {

                if (typeof data == 'object') {
                    return data;
                }

                var json = jQuery.parseJSON(data);

                return json;

            } catch (e) {

                return false;

            }

        }

    });

});
