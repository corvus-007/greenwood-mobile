document.addEventListener('DOMContentLoaded', function() {
  svg4everybody();
  $.fancybox.defaults.animationEffect = 'zoom-in-out';
  $.fancybox.defaults.gutter = 0;
  $.fancybox.defaults.buttons = ['close'];
  $.fancybox.defaults.transitionEffect = 'zoom-in-out';
  $.fancybox.defaults.transitionDuration = 500;
  $.fancybox.defaults.loop = true;
  $.fancybox.defaults.smallBtn = false;

  //  Phone inputmask
  $('input[type="tel"]').mask("+7 (999) 999 99 99", {
    autoclear: false,
    // jitMasking: true
  });


    /*=================================
    =            Accordion            =
    =================================*/

    var $accordion = $('.js-accordion');

    if ($accordion.length) {
      $accordion.find('dd').hide();
      $accordion.on('click', 'dt', function (event) {
        event.preventDefault();

        $accordion
          .find('dt')
          .not($(this))
          .removeClass('is-opened')
          .next('dd')
          .slideUp();

        if (!$(this).hasClass('is-opened')) {
          $(this).addClass('is-opened');
          $(this).next('dd').stop().slideDown();
        } else {
          $(this).removeClass('is-opened');
          $(this).next('dd').stop().slideUp();
        }
      });
    }

    /*=====  End of Accordion  ======*/
});
