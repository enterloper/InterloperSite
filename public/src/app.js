$(document).ready(function () {
  $('.home_image').hover(function () {
      $(this).stop().animate({opacity: .2}, 700);
      $(this).siblings('.foto_text').removeClass('hide').animate({opacity:1}, 2000);
  }, function () {
      $(this).stop().animate({ opacity: 1}, 900);
      $('.foto_text').addClass('hide');
  });
});


