function showFacebookUser(){return FB?(console.info("at this point FB global object has to exist to call the facebook user..."),console.log(FB),void FB.api("/me",function(o){isValidFacebookResponse(o)&&($("img.cover").attr("src",o.cover.source).removeClass("hide"),console.info("user accounts..."),console.log(o.accounts),$(document).foundation())},{fields:"id, name, email, cover, gender, link, accounts"})):void console.info("Facebook plugin (FB) is not loaded...")}