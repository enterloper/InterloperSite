$(document).ready(function () {
  $('.home_image').hover(function () {
      $(this).stop().animate({opacity: .2}, 300);
      $(this).siblings('.foto_text').removeClass('hide').animate({opacity:1}, 500);
  }, function () {
      $(this).stop().animate({ opacity: .95}, 500);
      $(this).siblings('.foto_text').animate({opacity:0}, 300, function(){
          $(this).addClass('hide');
      });
  });

  $('.profile_photo').animate({opacity: 1}, 2000);
});