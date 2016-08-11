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

var _currentScrollTop = null;

$(document).foundation();

$(document).ready(function() {

    // controls
    var dynamicContainer = $('#dynamic_container');
    var appContainer = $('main');
    var logoutButton = $('#logout_button');
    var loginButton = $('#login_button');
    var loginButtonOriginalText = loginButton.text();
    var inviteButton = $('#invite_button');
    var userNameBolder = $('#user_name');
    var modalLightContainer = $('#floating_light');
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
                 $(appContainer).html(panel);

                 // reload foundation to the document
                $(document).foundation(); 

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
        // :::::::::::::::: facebook handlers ::::::::::::::::::::::::::: 
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

        // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
        // :::::::::::::::: application handlers :::::::::::::::::::::::: 
        // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

        $(document).on('click', '.button.icn.positive', function(e) {
            // @todo: post positive votation service
            alert('positive votation :)');
            return false;
        });

        $(document).on('click', '.button.icn.negative', function(e) {
            // @todo: negative votation
            alert('negative votation :(');
            return false;
        });

        $(document).on('click', '.button.icn.comment', function(e) {
            // @todo: negative votation
            alert('Init comments? ');
            return false;
        });

        $(document).on('keyup', '#light_description', function(e){
            var value = $(this).val();
            var is_empty = $.trim(value).length < 1;

            $('form input[type=submit]').prop('disabled', is_empty);
            $('form button.cancel-new-light').prop('disabled', is_empty);
        });

        $(document).on('click', '#light_a_candel', function(){
            console.log('@todo: handle this');
        });

        // always handlers
        $(document).on('click', '#btn_more_lights', function() {
            showMoreLights();
        });

        $(document).on('click', '.go.top', function() {
            goTop();
        });

        $(document).on('click', '.init-new-light', function() {
            newLight(true);
        });

        $(document).on('click', '.cancel-new-light', function() {
            newLight(false);
        });

        $(document).on('click', '.edit-light', function() {

            var light_id = $(this).data('light-id');
            var url = $(this).data('edit-light-url');
            var parents = $(this).parents();
            var light_container = parents[1];

            // go get the light
            $.get(url, null, function(response) {
                if (!isValidResponse(response)) { 
                    return false;
                }

                $('.tooltip.top').remove();

                $(light_container).html(response);

                // reload foundation to the document
                $(document).foundation(); 

            }, 'html');
                        
        });

        // cancel form button
        $(document).on('click', '.cancel-light-form', function() {

            var url = $(this).data('light-url');
            // var parents = $(this).parents('.base');
            // var light_container = parents[1];
            var light_container = $(this).parents('.light');
            var wrap_light = false;

            console.log(light_container);

            $.get(url, { wrap: wrap_light } , function(response) {

                if (!isValidResponse(response)) {
                    return false;
                }

                // alert(response);
                console.log($(light_container));

                $('.tooltip.top').remove();

                $(light_container).html(response);

                // reload foundation to the document
                $(document).foundation(); 

            }, 'html');

        });

        // @todo: save light
        $(document).on('click', '.save-light', function() {
            var parents = $(this).parents();
            var container = parents[1]; 
            var current_form = $(container).find('form.light-form');

            $(current_form).submit();
        });

        // login handlers
        $(document).on('submit', 'form.light-form', function() {
            var url = $(this).attr('action');
            var data = $(this).serialize();
            var lightContainer = $(this).parents('div.light');
            var submittedForm = $(this);

            $.post(url, data, function(response) {

                if (!isValidResponse(response)){
                    return false;
                }

                $('<div><b>@todo: notify the user that the light has been saved successfully</b></div>').publish(2000);

                var light = jQuery.parseJSON(response.light);
                var rendered_light = response.light_view;

                lightACandle(rendered_light, lightContainer, response.is_new);

            }, 'json');

            return false;
        });

         // @todo: check behavior
        $(document).on('click', '.remove-light', function() {

            var url = $(this).data('light-url');
            var parents = $(this).parents();
            var containerToRemove = parents[1];

            $.ajax({
                url : url,
                type : 'delete',
                beforeSend: function() {

                    console.log('@todo: ajax-on');

                },
                success : function(app_response) {

                    if (!app_response || app_response.error) {
                        // @todo: handle errors
                        loginButton.text(loginButtonOriginalText);
                        return;
                    }

                    // hide deleted element
                    $(containerToRemove).addClass('hide');

                    // @todo: 
                    $('<div><b>@todo: notify the user that the light has been removed successfully</b></div>').publish(2000);

                },
                complete: function() {

                    console.log('@todo: ajax-off');

                },
                dataType : 'json'
            });

            return false;

        });

    });

    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // :::::::::::::::::: application methods :::::::::::::::::::::::
    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    
    function showRanking() {
        
        var url = $('#__ranking_url').val();
        var rankingContainer = $('#ranking_container');

        $(rankingContainer).html('Cargando ranking de luces más votadas...');

        $.get(url, null, function(response) {

            // clear container
            $(rankingContainer).html('');

            if (!isValidResponse(response)) {
                alert('Ha ocurrido un inconveniente al cargar el ranking');
                return;
            }

            $(rankingContainer).html(response);

        }, 'html')
    }
    
    function lightACandle(rendered_light, container, is_new) {

        if (is_new) {
            // show rendered light before the new light element
            (container).before(rendered_light);

            // offer the user to turn on a new light
            newLight(true);
        } else {
            $(container).html(rendered_light);
        }

        // var url = lightsUrl + '/' + light.id;

        // $.get(url, null, function(response) {

        //     if (!isValidResponse(response)) {
        //         return false;
        //     }

        //     if (is_new) {
        //         // create a new light
        //         var lights = $(lightsContainer).find('.light');
                
        //         // append before the new form the created light
        //         $(container).before(response);

        //         // show another light to turn on
        //         newLight(true);
        //     } else {

        //         // replace existing light
        //         $(container).html(response);
        //     }

        //     // reload tooltip's foundation to the document
        //     $(document).foundation(); 

        // }, 'html');
    }

    function newLight(on) {
        var formNewLight = $('#main_light_container').find('form');
        var lightContainer = $('#main_light_container').find('.base');
        
        // clear form
        clearForm($(formNewLight));

        if (on) {

            _currentScrollTop = $('body').scrollTop();

            console.info('getting the top');
            console.log(_currentScrollTop);

            // show container form
            $(lightContainer).removeClass('hide');
            // go top the form
            goTopElement(formNewLight);
            // focus text area
            $(formNewLight).find('textarea').focus();
        } else { 
            // hide container form
            $(lightContainer).addClass('hide');

            goTop(_currentScrollTop);

            _currentScrollTop = null;

            console.info('cleaning the top?');
            console.log(_currentScrollTop);
        }

    }

    function showLight(light_id) {
        // console.log($(modalLightContainer).html());

        // $(modalLightContainer).html('Loading light...');

        // $.get(lightsUrl + '/' + light_id, null, function(response) {

        //     if (!isValidResponse(response)) {
        //         alert('@todo: close modal');
        //         return false;
        //     }

        //     // @todo: show light into the container
        //     modalLightContainer.html(response);

        // }, 'html');
        
        console.log('@todo: show light number: ' + light_id);
    }
    
    function showMoreLights(quantity) {

        var url = lightsUrl;
        var lightsContainer = $('#lights_container');
        var lights_on = lightsContainer.find('.light');
        var from = lights_on.length - 1;
        var limit = quantity ? quantity : null;
        var buttonToRemove = $('#btn_more_lights');
        var original_text = $(buttonToRemove).text();

        console.log(buttonToRemove);

        // ajax-loading
        $(buttonToRemove).text('Cargando más luces...');

        $.get(url, { from: from, limit: limit }, function(app_response) {

            $(buttonToRemove).text(original_text);

            // check for errors
            if (!isValidResponse(app_response)) {
                return false;
            }

            $(buttonToRemove).parent().remove(); 
            $(lightsContainer).prepend(app_response);

        }, 'html');
    }
    

    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // :::::::::::::::::::::::: utilities ::::::::::::::::::::::::::: 
    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    
    function clearForm(form) {

        if (!$(form).is('form')) {
            return;
        }

        $(form).find('textarea').val('');
    }

    function goTop(top) {

        top = top ? top : 0;

        $('html, body').animate({
            scrollTop : top
        }, 'slow');
    }

    function goTopElement(element, topless_pixels) {
        topless_pixels = topless_pixels ? topless_pixels : 30;

        if (!element || element == undefined) {
            alert('the element not exist');
        }

        var position = $(element).offset();
        var position_final = ( position.top - topless_pixels);

        goTop(position_final);
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
