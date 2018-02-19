window.offcanvas = (function() {
  'use strict';

  var offcanvasToggler = document.querySelector('.offcanvas-toggler');
  var offcanvas = document.querySelector('.offcanvas');

  var onOffcanvasEscPress = function(event) {
    if (event.keyCode === window.util.KEYCODE_ESC) {
      hideOffcanvas();
    }
  };

  var showOffcanvas = function() {
    document.body.classList.add('is-offcanvas-show');
    offcanvasToggler.classList.add('offcanvas-toggler--triggerred');
    offcanvas.classList.add('offcanvas--opened');
    document.addEventListener('keydown', onOffcanvasEscPress);
  };

  var hideOffcanvas = function() {
    document.body.classList.remove('is-offcanvas-show');
    offcanvasToggler.classList.remove('offcanvas-toggler--triggerred');
    offcanvas.classList.remove('offcanvas--opened');
    document.removeEventListener('keydown', onOffcanvasEscPress);
  };

  offcanvasToggler.addEventListener('click', function(event) {
    event.preventDefault();
    if (document.body.classList.contains('is-offcanvas-show')) {
      hideOffcanvas();
    } else {
      showOffcanvas();
    }
  });
})();
