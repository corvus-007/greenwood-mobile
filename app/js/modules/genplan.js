window.genplan = (function() {
  'use strict';

  var genplan = document.querySelector('.genplan');

  if (!genplan) {
    return;
  }

  var genplanScroller = genplan.querySelector('.genplan__scroller');
  var genplanImage = genplan.querySelector('.genplan__image');
  var genplanTip = genplan.querySelector('.genplan__tip');
  var headerLogo = document.querySelector('.page-header__logo');
  var scrollLastTime = null;

  function getViewPosition() {
    return genplanScroller.scrollWidth / 2 - genplanScroller.clientWidth / 2;
  }

  function showgGenplanTip() {
    genplanTip.classList.remove('genplan__tip--hidden');
  }

  function hideGenplanTip() {
    genplanTip.classList.add('genplan__tip--hidden');
  }

  showgGenplanTip();
  genplanTip.addEventListener('touchstart', function(event) {
    hideGenplanTip();
  });

  genplanScroller.scrollLeft = getViewPosition();

  genplanImage.addEventListener('load', function() {
    genplanScroller.scrollLeft = getViewPosition();
  });

  function changeVisibilityLogoOnScroll() {
    headerLogo.classList.add('page-header__logo--hidden');

    if (scrollLastTime) {
      clearTimeout(scrollLastTime);
    }

    scrollLastTime = setTimeout(function() {
      headerLogo.classList.remove('page-header__logo--hidden');
    }, 2000);
  }

  setTimeout(function() {
    genplanScroller.addEventListener('scroll', changeVisibilityLogoOnScroll);
  }, 300);

  genplanImage.addEventListener('click', function(event) {
    var target = event.target;

    if (target.tagName.toLowerCase() === 'polygon') {
      if (target.dataset.idFlat) {
        location.assign('flat.html');
      } else if (target.dataset.houseid) {
        location.assign('search.html');
      }
    }
  });
})();
