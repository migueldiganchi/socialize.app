
// @todo: handle history

$(document).ready(function() {

    // alert('document.ready (application logged-in)');
    
    $.getScript('//connect.facebook.net/en_US/sdk.js', function() {

        var facebook_app_id = $('#__facebook_app_id').val();

        FB.init({
            appId: facebook_app_id,
            version: 'v2.6', 
            cookie: true
        });
        
    });

});