(function ( $ ) {

    $.fn.publish = function(timeout) {

        // ensure only one container by publishing
        var uniqueness = $('.--class-publisher-plugin');
        if ($(uniqueness).length > 0) {
            publisher.disappear($(uniqueness))
        }

        var content = $(this);
        var container = null;
        var container_width = null;
        var container_height = null;

        // container is the publisher
        container = jQuery('<div/>', {
            id: '__id_publisher_plugin', 
            class: '--class-publisher-plugin'
        });

        // set default behavior: appear at bottom-right of the screan
        container.css({
            position: 'fixed',
            right: '10px',
            bottom: '10px',
            border: 'solid 2px #fff'
        });

        // add close button to the container
        container.prepend($('<button>×</button>').click(function(){
            publisher.disappear(container);
        }));

        // wrap this with container
        container.css('display', 'block');
        container.append($(content).html());
        container.show();
        
        // check if document is ready
        var body = $('body');
        if (body.length < 0) {
            console.log("The publishing has to be when the document is 'ready'");
            return;
        } 
    
        // append publisher to the body: 
        body.append(container);

        publisher.appear(container, timeout);

    };

    $.fn.unpublish = function() {
        var container = $('#__id_publisher_plugin');
        if (container.attr('id') == '__id_publisher_plugin') {
            publisher.disappear(container);
        }
    }

    var publisher = {

        appear: function(container, timeout) {
            // transition: set initial position
            container_width = container.width() + 10;
            container.css('right', '-' + container_width + 'px');

            // transition: begin to show
            container.animate({
                right: '10px'
            }, 1100, function(){
                if (timeout) {
                    setTimeout(function() {
                        // transition: end to show
                        publisher.disappear(container);
                    }, timeout);
                }
            });

        },

        disappear: function(container) {
            // transition: get initial position
            container_height = $(container).height() + 10;

            // transition: begin to hide
            container.animate({
                bottom: '-' + container_height + 'px', 
            }, 1100, function() {
                // transition: end to hide, we must remove complete element
                container.remove();
            });        
        }
    };

}( jQuery ));   