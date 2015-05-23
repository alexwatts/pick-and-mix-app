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
    });


    //!! start of app scripts !!//

    // tabs fix remove when hidden

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var target = this.href.split('#');
        $('.nav a').filter('[href="#'+target[1]+'"]').tab('show');
    })

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
    });

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
    });

});

var selectedBag = "";

var cart = new Array() // namespace for the card

var prices = {
    "three" : 23,
    "six" : 40,
    "bagPrice" : 10
}

//Cart API
function addProductToCart(e, productId) {

    e.preventDefault();

    //find the product div
    var productDiv = $('div[data-product-id=' + productId + ']');
    var productImageDiv = productDiv.find('.product-img');
    var productImage = productImageDiv.find('img');
    var productDescriptionDiv = productDiv.find('.product-description');
    var productTitle = productDescriptionDiv.find('.product-title');

    //extract the image
    if (!isCartFull()) {

        //Update the summary dom
        updateSummaryWithImage(productImage.attr('src'),  getNextImageId());

        //add the product to the card
        cart.push({
            "productId": productId,
            "src": productImage.attr('src'),
            "title": productTitle[0].innerText
        });

        fireEventChanges();

    } else {

        $('#modalError').modal();

    }

    //scrollToTop();


};

function removeProductFromCart(e, removeIndex) {

    e.preventDefault();

    console.log('remove index ' + removeIndex);
    cart.splice(removeIndex - 1, 1);
    rebuildSummaryItems();

    fireEventChanges();
};

function handleBagSelect(e, productId) {

    e.preventDefault();
    selectedBag = productId;
    fireEventChanges();

}

function handleContinue(e) {

    e.preventDefault();

    var products = new Array();
    var distinctProductCodes = new Array();
    var productMap = {};

    for (i=0; i<cart.length; i++) {
        if (productMap[cart[i].productId] == undefined) {
            distinctProductCodes.push(cart[i].productId);
            productMap[cart[i].productId] = 1;
        } else {
            productMap[cart[i].productId] = productMap[cart[i].productId] + 1;
        }
    }

    for (i = 0; i<distinctProductCodes.length; i++) {
        products.push({
            product: {
                id: distinctProductCodes[i],
                quantity: productMap[distinctProductCodes[i]]
            }
        })
    }

    if (selectedBag != "") {
        products.push({
            product: {
                id: selectedBag,
                quantity: 1
            }
        })
    }


    alert(JSON.stringify(products));


}

function rebuildSummaryItems() {

    //clear items from summary
    for (i=1; i < 7; i++) {
        console.log('clearing item ' + i);
        updateSummaryWithImage('', i);
    }

    //from 1 to cart length
    for (i=1; i <= cart.length; i++) {
        console.log('adding item ' + i);
        updateSummaryWithImage(cart[i -1].src, i);
    }

};

function buildSelectedItems() {

    var selectedItemList = $('.selected-item-list');

    selectedItemList.empty();

    //if it's three
    if (cart.length == 3) {

        addSelectedItem(selectedItemList, '', cart[0]);
        addSelectedItem(selectedItemList, '', cart[1]);
        addSelectedItem(selectedItemList, '', cart[2])

    } else if (cart.length == 6) {

        addSelectedItem(selectedItemList, 'left',  cart[0]);
        addSelectedItem(selectedItemList, 'left',  cart[1]);
        addSelectedItem(selectedItemList, '',      cart[2]);
        addSelectedItem(selectedItemList, '',      cart[3]);
        addSelectedItem(selectedItemList, 'right', cart[4]);
        addSelectedItem(selectedItemList, 'right', cart[5])

    }

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

}

function addSelectedItem(selectedItems, cssClass, product) {

    var selectedItem = '<div class="selected-item">' +
                            '<div class="selected-item-img"><img src="' + product.src + '"></div>' +
                            '<div class="more-info">' +
                                '<div class="more-info-trigger"><a href="#"><span>Info</span></a></div>' +
                                '<div class="more-info-content ' + cssClass + '">' +
                                '<span>' + product.title + '</span>'+
                                '</div>' +
                            '</div>' +
                        '</div>';

    selectedItems.append(selectedItem);

}

function updateSummaryWithImage(imageSrc, imageId) {

    var summaryDiv =  $('.item-' + imageId);
    summaryDiv.addClass('selected');
    var summaryItemImg = summaryDiv.find('.summary-item-img');
    if (imageSrc == '') {
        summaryDiv.find('.summary-item-img').empty();
        summaryDiv.removeClass('selected');
    } else {
        summaryItemImg.html("<img onclick='removeProductFromCart(event," + imageId + ")' src='" + imageSrc + "'>");
    }

};

function updateProgressIndicatorsAndPriceAndContinueAndBag() {
    updateProgressIndicators();
    updatePrice();
    updateContinue();
    updateBagPrice();
};

function updateProgressIndicators() {
    if (areWeAtThree()) {
        //active 3 status
        $('.summary-progress-3').addClass('complete');
    } else {
        $('.summary-progress-3').removeClass('complete');
    }
    if (areWeAtSix()) {
        //activate 6 status
        $('.summary-progress-6').addClass('complete');
    } else {
        $('.summary-progress-6').removeClass('complete');
    }
}

function updatePrice() {
    $('.set-price').html('Price: &pound;' + getPrice());
}

function updateBagPrice() {

    var price = 0;

    if (selectedBag == "") {
        price = getPrice();
    } else {
        price = getPrice() + prices.bagPrice;
    }
    $('.total-price').html('Price: &pound;' + price);
}

function updateContinue() {
    if (canContinue()) {
        $('.btn-continue').removeClass('disabled');
    } else {
        $('.btn-continue').addClass('disabled');
    }
}

function canContinue() {
    if (getNumberOfItemsInCart() == 3 || getNumberOfItemsInCart() == 6) {
        return true;
    } else {
        return false;
    }
}

function getPrice() {
    if (cart.length < 3) {
        return 0;
    } else if (cart.length < 6) {
        return prices.three;
    } else {
        return prices.six;
    }
}


function fireEventChanges() {
    updateProgressIndicatorsAndPriceAndContinueAndBag();
};

function getNextImageId() {
    return getNumberOfItemsInCart() + 1;
};

function isCartFull() {
    return cart.length > 5;
};

function isCartEmpty() {
    return cart.length - 0;
};

function getNumberOfItemsInCart() {
    return cart.length;
};

function areWeAtThree() {
    return cart.length >= 3 ;
};

function areWeAtSix() {
    return cart.length == 6;
};

function scrollToTop() {
  $(window).scrollTo($('#step-indicator-bar'), 300, { axis:'y' });
}
