$.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};

$.fn.visibleElement = function(_delay) {

    var _parent = $(this);
    var _element = _parent.find("*");

    _element.each(function() {
        if ($(this).attr("vw")) {
            $(this).css('visibility', 'hidden');
        }
    });

    verify();
    _parent.on('scroll', function() {
        verify();
    });

    $(window).on('resize scroll', function() {
        verify();
    });

    function verify() {
        _element.each(function() {
            if ($(this).attr("vw")) {

                if ($(this).attr("vw-delay")) {
                    _delay = $(this).attr("vw-delay");
                }

                if ($(this).isInViewport()) {
                    var _this = this;
                    setTimeout(function() {

                        $(_this).css('visibility', 'visible');
                        $(_this).addClass('animated ' + $(_this).attr("vw"));

                    }, 1000 * _delay)
                }
            }
        });
    }

};