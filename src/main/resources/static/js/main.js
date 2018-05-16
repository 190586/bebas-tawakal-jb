$(function(){
  var ink, d, x, y;
  $(".btn").click(function(e){
    if($(this).find(".ink").length === 0){
      $(this).prepend("<span class='ink'></span>");
    }

    ink = $(this).find(".ink");
    ink.removeClass("animate-ripple");

    if(!ink.height() && !ink.width()){
      d = Math.max($(this).outerWidth(), $(this).outerHeight());
      ink.css({height: d, width: d});
    }

    x = e.pageX - $(this).offset().left - ink.width()/2;
    y = e.pageY - $(this).offset().top - ink.height()/2;

    ink.css({top: y+'px', left: x+'px'}).addClass("animate-ripple");
  });
});

function openMobileMenu() {
  $('.mobile-menu-overlay').css("display", "block");
  $('.mobile-menu-overlay').animate({
    opacity: 1
  }, 150);
  $('.mobile-menu').animate({
    left: "15%"
  }, 300);
}

function closeMobileMenu() {
  $('.mobile-menu-overlay').animate({
    opacity: 0,
  }, 300, function() {
    $('.mobile-menu-overlay').css("display", "none");
  });
  $('.mobile-menu').animate({
    left: "115%"
  }, 200);
}

if($(window).width() <= 767) {

  $('.mobile-menu-overlay').removeClass("visible-xs");
  $('.mobile-menu-overlay').css("display", "none");
  $('.fixed-header').remove();
}

if($(window).width() > 767) {
  $('.fixed-header').css({
    "top" : "-" + $(this).height() + "px"
  });

  console.log();
}

$('.button-top-holder').hide();

$(document).ready(function() {
  $('.fixed-header').html($('header .navbar.white').html());

  $('.burger-menu').click(function() {
    openMobileMenu();
  });

  $('.mobile-menu .btn-close').click(function() {
    closeMobileMenu();
  });

  $('.mobile-menu-overlay').click(function() {
    closeMobileMenu();
  });

  //cek kondisi apakah sudah login
  var logStatus = 1;
  if(logStatus == 1) {
    $('.mobile-menu .profile.logged-out').hide();
    $('.mobile-menu .glyphicon-log-in').parent().parent().remove();
  } else {
    $('.mobile-menu .profile.logged-in').hide();
    $('.mobile-menu .button-holder .btn-logout').hide();
    $('.mobile-menu .bg-gray').css("height", "20%");
    $('.mobile-menu .button-holder .btn-feedback').css("width", "75%");
  }

  $(window).scroll(function() {
    if($(window).scrollTop() + $(window).height() == $(document).height()) {
      $('.button-top-holder').fadeIn(300);
    } else {
      $('.button-top-holder').fadeOut(200);
    }

    if($(window).scrollTop() >= $('.main-content').offset().top) {
      $('.fixed-header').css({
        "top" : "0px"
      });
    } else if($(window).scrollTop() <= $('.main-content').offset().top) {
      $('.fixed-header').css({
        "top" : "-" + $(this).height() + "px"
      });
    }

  });

  $('.btn-top').click(function() {
    $("html, body").animate({ scrollTop: 0 }, 600);
  });

  $('.navbar.white li a').click(function() {
    var toScroll = $(this).attr("data-href");
    $('html, body').animate({
        scrollTop: $(toScroll).offset().top - $('.fixed-header').height()
    }, 1000);
  });
});