(function ( $ ) {

    $.fn.publish = function(timeout) {

        // ensure only one publisher by call.
        var uniqueness = $('.--class-publisher-plugin');
        if ($(uniqueness).length > 0) {
            actions.close($(uniqueness))
        }

        var content = $(this);
        var container = null;
        var container_width = null;
        var container_height = null;

        // publisher
        container = jQuery('<div/>', {
            id: '__id_publisher_plugin', 
            class: '--class-publisher-plugin'
        });

        // set default behavior 
        container.css({
            position: 'fixed',
            right: '10px',
            bottom: '10px',
            border: 'solid 2px #fff'
        });

        // add close button to the container
        container.prepend($('<button>×</button>').click(function(){
            actions.close(container);
        }));

        // wrap this with container
        container.css('display', 'block');
        container.append($(content).html());
        container.show();
        
        // check if document is ready
        var body = $('body');
        if (body.length < 0) {
            console.log("The pubhising has to be when the document is 'ready'");
            return;
        } 
    
        // append publisher to the body: 
        body.append(container);

        actions.open(container, timeout);

    };

    $.fn.unpublish = function() {
        var container = $('#__id_publisher_plugin');
        if (container.attr('id') == '__id_publisher_plugin') {
            actions.close(container);
        }
    }

    var actions = {

        open: function(container, timeout) {
            // transition: set initial position
            container_width = container.width() + 10;
            container.css('right', '-' + container_width + 'px');

            // transition: begin to show
            container.animate({
                right: '10px'
            }, 1100, function(){
                if (timeout) {
                    setTimeout(function() {
                        // transition: end 
                        actions.close(container);
                    }, timeout);
                }
            });

        },

        close: function(container) {
            // transition: get initial position
            container_height = $(container).height() + 10;

            // transition
            container.animate({
                bottom: '-' + container_height + 'px', 
            }, 1100, function() {
                // transition: remove publisher
                container.remove();
            });        
        }
    };

}( jQuery ));   