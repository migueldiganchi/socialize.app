// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// :::::::::::::::::::: custom jquery ::::::::::::::::::::::::::: 
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
$.fn.isEmpty = function() {
    var content = $(this).html();
    // @todo: improve this, when the container has html comments, 
    // these are detected as content
    return isEmptyString(content);
};

$.fn.hasAttr = function(attribute_name) {
    var attr = $(this).attr(attribute_name);
    return (typeof attr !== typeof undefined && attr !== false);
};

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

function isValidFacebookResponse(fb_response) {
    // @todo: handle this (IMPORTANT)
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

function isEmptyString(str) {
    return (!str || 0 === str.length || /^\s*$/.test(str));
}


function decodeBase64(s) {
    var e={},i,b=0,c,x,l=0,a,r='',w=String.fromCharCode,L=s.length;
    var A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for(i=0;i<64;i++){e[A.charAt(i)]=i;}
    for(x=0;x<L;x++){
        c=e[s.charAt(x)];b=(b<<6)+c;l+=6;
        while(l>=8){((a=(b>>>(l-=8))&0xff)||(x<(L-2)))&&(r+=w(a));}
    }
    return r;
};