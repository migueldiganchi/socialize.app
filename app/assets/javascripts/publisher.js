(function ( $ ) {

    $.fn.publish = function(timeout) { // event: [show | hide]

        // ensure only one publisher by call.
        var uniqueness = $('#__id_publisher_plugin');
        if ($(uniqueness).length > 0) {
            $(uniqueness).remove();
        }

        var content = $(this);
        var container = null;
        var container_width = null;
        var container_height = null;

        // publisher
        container = create_div({
            id: '__id_publisher_plugin', 
            class: '--class-publisher-plugin'
        });

        // set default behavior 
        $(container).css({
            position: 'fixed',
            right: '10px',
            bottom: '10px',
            border: 'solid 2px #fff'
        });

        // add close button to the container
        $(container).prepend($('<button>×</button>').click(function(){
            remove($(container));
        }));

        // wrap this with container
        $(container).append($(this).html());
        
        // show element
        $('body').append(container);

        // transition: get locations
        container_width = $(container).width() + 10;
        container_height = $(container).height() + 10; /*in case want to*/

        // transition: set new position
        $(container).css('right', '-' + container_width + 'px');
        // $(container).css('bottom', '-' + container_height + 'px');

        // show publisher
        $(container).show();

        $(container).animate({
            // bottom: '10px',
            right: '10px'
        }, 1100, function(){
            if (timeout) {
                setTimeout(function(){
                    $(content).unpublish();
                }, timeout);
            }
        });


    };

    $.fn.unpublish = function() {

        var container = $('#__id_publisher_plugin');

        if ($(container).attr('id') == '__id_publisher_plugin') {
            remove(container);
        }
    }

    function create_div(options) {
        return jQuery('<div/>', options);
    }

    function remove(container) {

        container_width = $(container).width() + 10;
        container_height = $(container).height() + 10;

        $(container).animate({
            // right: '-' + container_width + 'px',
            bottom: '-' + container_height + 'px',
        }, 1100, function() {
            $(container).remove();
        });
    }

}( jQuery ));   