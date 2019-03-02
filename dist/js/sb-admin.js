(function($) {
  "use strict"; // Start of use strict

  window.location.hash="no-back-button";
  window.location.hash="Again-No-back-button" //chrome
  window.onhashchange=function(){window.location.hash="no-back-button";}
  /*window.onbeforeunload = function() {
      return "¿Estás seguro que deseas salir de la actual página?"
  }*/

  /*if(history.forward(1)){//Deshabilitar el boton “atras” del navegador
    location.replace( history.forward() );
  }*/
  //creando cookie
    //document.cookie = "tema=0";
    let temaCookie = document.cookie;
  // Toggle the side navigation
  $("#sidebarToggle").on('click',function(e) {
    e.preventDefault();
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    $("#content-wrapper").toggleClass("toggled");
  });


  $("#temaToggle").on('click',function(e){
    e.preventDefault();
    if(readCookie("tema")=='1'){
      document.cookie = "tema=0";
    }else{
      document.cookie = "tema=1";
    }
    temaCookie = document.cookie;
    //alert(readCookie("tema"));
    cargarTema();
  });

  if(readCookie("tema")=='1'){
    cargarTema();
  }

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).on('scroll',function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    event.preventDefault();
  });

  function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');

    for(var i=0;i < ca.length;i++) {

      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) {
        return decodeURIComponent( c.substring(nameEQ.length,c.length) );
      }
    }
    return null;
  }
  function cargarTema() {
    $("nav").toggleClass("theme");
    $("body").toggleClass("theme");
    $(".navbar-nav").toggleClass("theme");
    $(".card-header").toggleClass("theme");
    $("th").toggleClass("theme");
    $("h1").toggleClass("theme");
    $("h2").toggleClass("theme");
    return null;
  }

})(jQuery); // End of use strict
