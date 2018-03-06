window.aboutUs = (function () {
  'use strict';
  var aboutUs = document.querySelector('.about-us');

  if (!aboutUs) {
    return;
  }

  var aboutUsText = aboutUs.querySelector('.about-us__text');

  for (var tag of aboutUsText.children) {
    if (tag && tag.tagName.toLocaleLowerCase() === 'h2') {
      var h2 = tag;

      $(h2)
        .addClass('about-us__text-title')
        .nextUntil('h2')
        .wrapAll('<div class="about-us__text-content"></div>');
    }
  }

  $('.about-us__text-title').addClass('about-us__text-title--close-contnet');
  $('.about-us__text-content').hide();

  $(aboutUs).on('click', '.about-us__text-title', function (event) {
    var $sectionText = $(this).next('.about-us__text-content');

    if ($sectionText.is(':hidden')) {
      $(this).toggleClass('about-us__text-title--close-contnet').next().slideDown();
    } else {
      $(this).next().slideUp();
      $(this).toggleClass('about-us__text-title--close-contnet').next().slideDown();
    }
  });
})();
