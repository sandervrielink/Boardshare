(function() {
  // cache jQuery object
  var $wrapper = $('#main-wrapper'),
      // items on the grid
      $items = $wrapper.find('div.main > a'),

      // true if dragging the container
      kinetic_moving = false,
      // current index of the opened item
      current = -1,
      // true if the item is being opened / closed
      isAnimating = false,
      // true if item is opened
      opened = {
        Video: false,
        Whiteboard: false,
        'Text-Editor': false,
        Profile: false
      };


  function init() {
    loadKinetic();
    initEvents();
  }

  function loadKinetic() {
    setWrapperSize();

    // apply the kinetic plugin to the wrapper
    $wrapper.kinetic({
      moved: function() {
        kinetic_moving = true;
      },
      stopped: function() {
        kinetic_moving = false;
      }
    });
  }

  function setWrapperSize() {
    var containerMargins = $('#top').outerHeight(true) + parseFloat( $items.css('margin-top') );
    $wrapper.css('height', $(window).height() - containerMargins );
  }

  function initEvents() {
    // open apps
    $items.bind('click.app-ui', function( event ) {
      // store context
      var $item = $(this),
          selection = $item[0].innerText.trim(); // trim away newline character

      // open only if not dragging the container
      if ( !kinetic_moving ) {
        // close any opened items
        for (var item in opened) {
          if (opened[item]) {

            // opened item stays open
            if (item === selection) {
              return false;
            }

            closeContentView(item, function(){
              // open click item after closing others
              openItem( $item );
            });
          }
        }

        openItem( $item );

        // change empty state
        $('aside').text('loading...');
      }

      return false;
    });

    // on window resize, set the wrapper and view size accordingly
    $(window).bind('resize.app-ui', function( event ) {
      setWrapperSize();

      $('.content-view').css({
        width: $(window).width() - 220,
        height: $(window).height()
      });
    });
  }

  function openItem( $item ) {
    // prevent execution before animation callback fires
    if ( isAnimating ) {
      return false;
    }

    isAnimating = true;
    current = $item.index('.content'); // used for close

    // TODO: different screen ratio of whiteboard, canvas, text-editor, user profile
    loadContentItem($item, function() {
      isAnimating = false;
    });
  }

  // opens one content item (currently fullscreen)
  function loadContentItem( $item, callback ) {

    var app = $item.find('div.teaser span').text(),
        appId = '#' + app;

    // load template for all content items
    initContentViewEvents();

    // show menu state
    // if (app === 'Video') {
    //   $item.find('div.teaser').addClass('video-open');
    // } else if (app === 'Whiteboard') {
    //   $item.find('div.teaser').addClass('whiteboard-open');
    // } else if (app === 'Text-Editor') {
    //   $item.find('div.teaser').addClass('editor-open');
    // } else if (app === 'Profile') {
    //   $item.find('div.teaser').addClass('profile-open');
    // }
    $item.find('div.teaser').addClass('item-open');

    // in content template, set values and animate view
    $( appId ).css({
      width: $item.width(),
      height: $item.height(),
      left: $item.offset().left,
      top: $item.offset().top
    }).show().animate({
      // TODO: control content layout ratio here
      width: $(window).width() - 220,
      left: 222 // menu plus scroll bar width
    }, 200, 'easeOutExpo', function() {

      $(this).animate({
        height: $(window).height(),
        top: 40 // header height
      }, 300, 'easeInQuad', function() {

        var $this = $(this),
            $teaser = $this.find('div.teaser'),
            $content= $this.find('div.content-full');

        $teaser.show();
        $content.fadeIn(600);

        // track state of item
        opened[app] = true;

        if( callback ) {
          callback();
        }

      });
    });
  }

  // events for the content preview
  function initContentViewEvents() {
    // close button
    $('.content-view')
      .find('span.close')
      .bind('click.app-ui', function( event ) {
        var app = event.currentTarget.parentElement.id;
        closeContentView(app);
      });
  }

  // closes the fullscreen content item
  function closeContentView(app, callback) {

    if( isAnimating ) {
      return false;
    }

    isAnimating = true;

    // var $item = $items.not('.user').eq( current );
    var $item = $items.eq( current );
    var appId = '#' + app;

    // clear menu state
    // if (app === 'Video') {
    //   $item.find('div.teaser').removeClass('video-open');
    // } else if (app === 'Whiteboard') {
    //   $item.find('div.teaser').removeClass('whiteboard-open');
    // } else if (app === 'Text-Editor') {
    //   $item.find('div.teaser').removeClass('editor-open');
    // } else if (app === 'Profile') {
    //   $item.find('div.teaser').removeClass('profile-open');
    // }
    $item.find('div.teaser').removeClass('item-open');

    // animation
    $( appId )
      .find('div.teaser, div.content-full')
      .hide()
      .end()
      .animate({
        height: $item.height(),
        top: $item.offset().top // account for top bar
      }, 250, function() {
        $(this).animate({
          width: $item.width(),
          left: $item.offset().left
        }, 200, 'easeOutQuart', function() {
          $(this).fadeOut(function() {
            // track state of item
            opened[app] = false;
            isAnimating = false;

            if ( callback ) {
              callback();
            }
          });
        });
      });
  }

  init();

})();
