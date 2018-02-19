window.util = (function() {
  'use strict';

  var DEBOUNCE_INTERVAL = 500;

  return {
    setMaxHeight: function(selector) {
      var maxHeight;
      var elements = document.querySelectorAll(selector);

      if (!elements.length) {
        return;
      }

      maxHeight = Array.from(elements).reduce(function findMaxHeight(
        prevValue,
        element
      ) {
        var currentValue = element.offsetHeight;
        return prevValue > currentValue ? prevValue : currentValue;
      },
      0);

      Array.from(elements).forEach(function specifyMaxHeight(it) {
        it.style.height = maxHeight + 'px';
      });
    },
    debounce: function(func) {
      var lastTimeout;
      return function () {
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(func, DEBOUNCE_INTERVAL);
        return lastTimeout;
      };
    }
  };
})();
