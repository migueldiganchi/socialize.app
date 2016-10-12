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
//= require jquery.history
//= require turbolinks
//= require foundation
//= require utilities

var _currentScrollTop = null;
var _currentScrollTop = 0;

// window scrolling
$(window).scroll(function(event){
   var st = $(this).scrollTop();
   if (st > _currentScrollTop){
        // console.log('scrolling down');
        $('button.go.up').removeClass('hide');
        $('button.go.down').addClass('hide');
   } else {
        // console.log('scrolling up');
        $('button.go.down').removeClass('hide');
        $('button.go.up').addClass('hide');
   }
   _currentScrollTop = st;
});

/* <foundation.init> */
$(document).foundation();

/* <document.init> */
$(function() {

    // ajax configurations
    $.ajaxSetup({ 
        cache : false,
        headers: {
            'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
        } 
    });

    // Prepare ajax routing
    var History = window.History;
    if (!History.enabled) {
        console.log('some code here?');
        return false;
    }

    // Bind to StateChange Event
    History.Adapter.bind(window, 'statechange', function() {
        var state = History.getState();
        var url = state ? state.url : '/';
        var title = state && state.title ? state.title : '';
        var target = state && state.data ? state.data.target : null;
        var params = state && state.data && state.data.params ? state.data.params : null;

        switch(target) {
            case 'post': 
                showPost(url);
                break;
            case 'profile': 
                showProfile(url);
                break;
            case 'page': 
                showPage(url);
                break;
            case 'close-modal': 
                break;
            default:
                refreshApp();
                break;
        }

        console.info('end of ajax routing...');

    });

    function refreshApp() {

        var url = $('#__root_url').val();

        $.get(url, null, function(app_response) {

            if (!isValidResponse(app_response)) {
                return false;
            }

            // get app 
            var main_container = $('main');

            console.log(main_container);

            // laod content into the container
            $(main_container).html(app_response);

        });        
    }

    function showPost(url) {

        var modalContent = $('#modal #modal_content');

        // ajax loading: on
        $(modalContent).html('Cargando...');

        // go get the post on server
        $.get(url, {
            wrap: false, 
            theather: true
        }, function(app_response) {

            // ajax-loading: off
            $(modalContent).html('');

            // validate response
            if (!isValidResponse(app_response)) {
                return false;
            }

            // show the response
            $(modalContent).html(app_response);
        });
    }

    function showPage(url) {
        
        // @todo: ajax-loading > on
        $.get(url, null, function(app_response) {
            // @todo: ajax-loading > off

            // validate response
            if (!isValidResponse(app_response)) {
                return false;
            }

            var app_dynamic = $('.app-dynamic');

            // show the response
            $(app_dynamic).html(app_response);

            // get facebook page
            showFacebookPage(FB);
        });

    }

    function showProfile(url) {

        // @todo: ajax loading: on
        $.get(url, null, function(app_response) {

            // @todo: ajax loading: off
            if (!isValidResponse(app_response)) {
                return false;
            }

            var app_dynamic = $('.app-dynamic');

            // laod content into the container
            $(app_dynamic).html(app_response);

            // get facebook user
            showFacebookUser(FB);

        });        

    }

});
/*</document.init>*/

/* <document.ready> */
$(document).ready(function() {

    // controls
    var dynamicContainer = $('#dynamic_container');
    var appContainer = $('main');
    var logoutButton = $('#logout_button');
    var loginButton = $('#login_button');
    var loginButtonOriginalText = loginButton.text();
    var inviteButton = $('#invite_button');
    var postsUrl = $('#__posts_url').val();
    var hdnLoggedIn = $('#__logged_in');
    var loggedIn = $(hdnLoggedIn).length > 0 && $(hdnLoggedIn).val() == 'true';

    $.ajaxSetup({ cache: true });

    function checkLoginState() {

        // @todo: check for FB var

        loginButton.text('Verificando conexión con facebook...');
        FB.getLoginStatus(function(fb_response) {
            handleFacebookResponse(fb_response);
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

    // status change callback
    function handleFacebookResponse(response) {

        if (response.status === 'connected') {
            // the user is logged in and has authenticated your
            connectApplication(response.authResponse.signedRequest);
        } else {

            if (response.status === 'not_authorized') {
                console.log('application is not authorized');
            }
            // the user isn't logged in to Facebook 
            requestLogin();
        }
    }

    // go register or get user
    function connectApplication(signedRequest) {

        // @todo: check for possible errors in loggedInResponse
        var url = $('#__login_url').val();

        $.ajax({
            url : url,
            type : 'get', 
            data : {
                signed_request: signedRequest
            },
            beforeSend: function() {
                loginButton.text('Obteniendo datos del usuario...'); // @todo: get from server settings
            },
            success : function(app_response) {

                if (!isValidResponse(app_response)) {
                    loginButton.text(loginButtonOriginalText);
                    return;
                }

                loginButton.text('Usuario autenticado!').addClass('logged-in');
                logoutButton.addClass('logged-in');
                
                // load app panel in the main container
                $(appContainer).html(app_response);

            },
            complete: function() {
                console.log('@todo: ajax-off');
            },
            dataType : 'html'
        });
    }

    // method: this method correspond to the user account
    function showUserInformation(accessToken) {

        // show user picture & name  
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
            access_token: accessToken, 
            fields: "id, name, email, about, cover, gender, link, accounts" 
        });
    }

    function showUserPages(fpagesToCheck) {

        var url = $('#__user_pages_url').val(); 
        var spanLoadingMessage = $('#loading_message');
        var data = null;

        alert('showUserPages method: ' + url);

        if (fpagesToCheck) {
            data = { fpages: fpagesToCheck };
        }
        // @todo: check for valid url
        
        // @todo: handle ajax-loading: on
        console.log(spanLoadingMessage);
        $(spanLoadingMessage).text('Cargando información del usuario');
        $.get(url, data, function(app_response) {

            // validate response
            if (!isValidResponse(app_response)) {
                return false;
            }

            console.log('checking for app_response: ');
            console.log(app_response);

            // render content
            $('.user-pages-container').html(app_response);

        }, 'html');            
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
    
    // handler: ajax routing
    $(document).on('click', 'a', function(e) {

        closeSelectors(); // this has to run after any task

        var url = $(this).attr('href');
        var target = null; 
        var title = null;
        var params = null;

        if ($(this).is('.show-profile')) {
            target = 'profile';
        } else if ($(this).is('.show-post')) {
            target =  'post';
            params = { wrap: false, theather: true };
        } else if ($(this).is('.show-page')) {
            target = 'page';
        } 

        History.pushState({
            url: url,
            target: target, 
            params: params
        }, null, url);

        e.preventDefault();
        return false;
    });
  
    $(document).on('click', '.selector', function() {
        openSelector(this);
    });

    $(document).mousedown(function(e) {
        // handle exceptions 
        var clickedElement = e.target ? $(e.target) : $(e.srcElement);
        if (clickedElement.is('.selector-container ul li a')) {
            return;
        }

        var selectorOpened = $('.selector-container').is(':visible');
        if (selectorOpened) {
            closeSelectors();
        }
    });

    $(document).keydown(function(e) {
        var code = e.keyCode ? e.keyCode : e.charCode;
        var selectorOpened = $('.selector-container').is(':visible');
        if (code == 27 && selectorOpened) {
            closeSelectors();
        }
    });

    $(document).on('click', '.selector-closer', function(e) {
        closeSelectors();
        e.preventDefault();
        return false;
    });

    $(document).on('submit', 'form#searcher_form', function() {
        alert('@todo: go search to server');
        return false; // avoid callback
    });

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

    // always handlers
    $(document).on('click', '#btn_more_posts', function() {
        showMorePosts();
    });

    $(document).on('click', '.go.up', function() {
        goTop();
    });

    $(document).on('click', '.go.down', function() {
        goTopElement('footer');
    });

    $(document).on('click', '.init-searcher', function() {
        alert('init searcher');
    })

    $(document).on('click', '.init-new-post', function() {
        newPost(true);
    });

    $(document).on('click', '.cancel-new-post', function() {
        newPost(false);
    });

    $(document).on('click', '.edit-post', function() {

        var post_id = $(this).data('post-id');
        var url = $(this).data('edit-post-url');
        var parents = $(this).parents();
        var post_container = parents[1];

        // go get the post
        $.get(url, null, function(response) {
            if (!isValidResponse(response)) { 
                return false;
            }

            $('.tooltip.top').remove();

            $(post_container).html(response);

            // reload foundation to the document
            $(document).foundation(); 

        }, 'html');
    });

    // cancel form button
    $(document).on('click', '.cancel-post-form', function() {

        var url = $(this).data('post-url');
        var post_container = $(this).parents('.post');
        var wrap_post = false;

        console.log(post_container);

        $.get(url, { wrap: wrap_post } , function(response) {

            if (!isValidResponse(response)) {
                return false;
            }

            // alert(response);
            console.log($(post_container));

            $('.tooltip.top').remove();

            $(post_container).html(response);

            // reload foundation to the document
            $(document).foundation(); 

        }, 'html');

    });

    // @todo: save post
    $(document).on('click', '.save-post', function() {
        var parents = $(this).parents();
        var container = parents[1]; 
        var current_form = $(container).find('form.post-form');

        $(current_form).submit();
    });

    // login handlers
    $(document).on('submit', 'form.post-form', function() {
        var url = $(this).attr('action');
        var data = $(this).serialize();
        var postContainer = $(this).parents('div.post');
        var submittedForm = $(this);

        $.post(url, data, function(response) {

            if (!isValidResponse(response)){
                return false;
            }

            showMessage();
            // $('<div><b>@todo: Notify the user: Guardado exitosamente</b></div>').publish(2000);

            var post = jQuery.parseJSON(response.post);
            var rendered_post = response.post_view;

            if (response.is_new) {
                // show rendered post before the new post element
                $('#main_post_container').before(rendered_post);
                // create a new post creator
                newPost(false); 
            } else {
                // append the rendered post into the edited post
                $(postContainer).html(rendered_post);
            }

        }, 'json');

        return false;
    });

     // @todo: check behavior
    $(document).on('click', '.remove-post', function() {

        var url = $(this).data('post-url');
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
                $('<div><b>@todo: notify the user that the post has been removed successfully</b></div>').publish(2000);

            },
            complete: function() {

                console.log('@todo: ajax-off');

            },
            dataType : 'json'
        });

        return false;

    });

    // modal closed event
    $(document).on('closed.zf.reveal', '[data-reveal]', function(){
        closeUrlModal();
    });

    /* </facebook.scripts> */

    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // :::::::::::::::::: application methods :::::::::::::::::::::::
    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    
    function openSelector(openerButton) {
        console.log('@todo: read position from html attribute');
        console.log('@todo: read width from html attribute');
        console.log('@todo: set left position as html attribute');

        // close all previous selectors
        closeSelectors();

        // mark as pressed button
        $(openerButton).addClass('pressed');

        // get current container
        var selectorContainer = $(openerButton).find('.selector-container');

        // show container
        $(selectorContainer).removeClass('hide');

        // check if the selector is empty
        if ($(selectorContainer).isEmpty()) {

            var url = $(openerButton).data('selector-url');
            var loadingMessage = 'Cargando filtro'; 
            console.log('@todo: get loading message from html attribute');

            if (url === undefined) {
                console.log('@todo: resolve this');
                return;
            }
            
            $(selectorContainer).html(loadingMessage);

            // go get selector to the server
            $.get(url, null, function(app_response) {
                // validate response
                if (!isValidResponse(app_response)){
                    // @todo: revert process
                    return false;
                }

                $(selectorContainer).html(app_response);

            }, 'html');
        }
    }
    
    function closeSelectors() {
        $('.button').removeClass('pressed');
        $('.selector-container').addClass('hide');
    }

   
    function closeUrlModal() {
        // @todo: get from configuration server (root_url)
        var url = '/'; 
        // @todo: get from configuration server
        var title = 'BubblePages'; 
        // push fake state
        History.pushState({ 
            url : url, 
            target: 'close-modal' 
        }, title, url);
    }
    
    function newPost(on) {
        // read the current containers
        var formNewPost = $('#main_post_container').find('form');
        var postContainer = $('#main_post_container').find('.base');

        console.log(postContainer);
        
        // ensure form cleaning
        clearForm($(formNewPost));

        if (on) {
            // get the current top of the body to return latter in the cancel
            _currentScrollTop = $('body').scrollTop();
            // show container form
            $(postContainer).removeClass('hide');
            // go top the form
            goTopElement(formNewPost);
            // focus text area
            $(formNewPost).find('textarea').focus();
        } else { 

            console.log(postContainer);

            // hide container form
            $(postContainer).addClass('hide');
            // return to the saved top
            goTop(_currentScrollTop);
            // reset the last position added
            _currentScrollTop = null;
        }
    }

    function showMorePosts(quantity) {

        var url = postsUrl;
        var postsContainer = $('#posts_container');
        var posts_on = postsContainer.find('.post');
        var from = posts_on.length - 1;
        var limit = quantity ? quantity : null;
        var buttonToRemove = $('#btn_more_posts');
        var original_text = $(buttonToRemove).text();

        // ajax-loading
        $(buttonToRemove).text('Cargando más luces...');

        $.get(url, { from: from, limit: limit }, function(app_response) {

            $(buttonToRemove).text(original_text);

            // check for errors
            if (!isValidResponse(app_response)) {
                return false;
            }

            $(buttonToRemove).parent().remove(); 
            $(postsContainer).prepend(app_response);

        }, 'html');
    }

    function showMessage(message) {
        $('<div><b>' + message + '</b></div>').publish(2000);
    }

});
/* </document.ready> */