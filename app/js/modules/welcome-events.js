window.welcomeEvents = (function () {
  'use strict';

  var welcomeEventsElem = document.querySelector('.welcome-events');

  if (!welcomeEventsElem) {
    return;
  }

  var welcomeEventsItems = welcomeEventsElem.querySelectorAll('.welcome-events__item');

  $(welcomeEventsElem).on('click', '.welcome-events__item', function (event) {
    if (this.classList.contains('welcome-events__item--hidden')) {
      this.classList.remove('welcome-events__item--hidden');
    } else {
      this.classList.add('welcome-events__item--hidden');
    }
  });

  setTimeout(function () {
    welcomeEventsItems.forEach(function (eventItem, index) {
      setTimeout(function () {
        eventItem.classList.add('welcome-events__item--hidden');
      }, 220 * index);
    });
  }, 1600);
})();
