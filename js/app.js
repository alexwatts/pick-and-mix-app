$(function(){

    // touch detection

    function is_touch_device() {
      return 'ontouchstart' in window // works on most browsers 
          || 'onmsgesturechange' in window; // works on ie10
    };

    if (is_touch_device()) {
        $('html').addClass('touch');
    } else {
        $('html').addClass('non-touch');
    }

    $(window).load(function() {
        $("#loader").fadeOut();
        $("#overlay").delay(800).fadeOut("slow");
        // console.log( "window loaded" );          
    })


    //!! start of app scripts !!//

    // add bag radio button

    $(".partner-item a").click(function(event){
        $(".partner-item a").removeClass("selected");
        $(this).addClass("selected");
        event.preventDefault()
    });

    // product details show hide

    $(".more-info-trigger a").click(function(event){

      if( $(this).hasClass("active") ) {
        $(this).removeClass("active");
        $(".more-info-content").hide();
        event.preventDefault();
      } else {
        $(".more-info-trigger a").removeClass("active");
        $(".more-info-content").hide();
        $(this).addClass("active");
        $(this).parent().next(".more-info-content").show();
        event.preventDefault();
      }
    });

    // product list scroll to function

    $('ul.category-list a').bind('click',function(event){
      $anchor = $(this).attr('href');

      $('.product-container').stop().scrollTo($anchor, 1000, { axis:'x' });
      event.preventDefault();
    });

    // category highlighting function

    //this does right scroll

    $.each(['category-itemlist'], function(i, classname) {
      var $elements = $('.' + classname)

      $elements.each(function() {
        new Waypoint({
          element: this,
          handler: function(direction) {
            if (direction === 'right') {
              var nav = $('ul.category-list')

              $elements.removeClass('current')
              nav.find('a').removeClass('active')
              $(this.element).addClass('current')
              nav.find('a[href="#'+$(this.element).attr('id')+'"]').addClass('active')
            }
          },
          offset: 1,
          group: classname,
          context: $('.product-container'),
          horizontal: true
        })
      })
    })

    // this does left scroll

    $.each(['category-itemlist'], function(i, classname) {
      var $elements = $('.' + classname)

      $elements.each(function() {
        new Waypoint({
          element: this,
          handler: function(direction) {
            if (direction === 'left') {
              var nav = $('ul.category-list')

              $elements.removeClass('current')
              nav.find('a').removeClass('active')
              $(this.element).addClass('current')
              nav.find('a[href="#'+$(this.element).attr('id')+'"]').addClass('active')
            }
          },
          // offset: '-100%',
          offset: 'right-in-view',
          group: classname,
          context: $('.product-container'),
          horizontal: true
        })
      })
    })


});