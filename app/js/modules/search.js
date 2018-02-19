window.search = (function() {
  'use strict';

  var search = document.querySelector('.search');

  if (!search) {
    return;
  }

  var filterRangeSliders = document.querySelectorAll('.filter-range-slider');
  var searchOutput = document.querySelector('.search-output');
  var searchOutputList = document.querySelector('.search-output-list');

  $(searchOutputList)
    .on('enabledStickiness.stickyTableHeaders', function(event) {
      searchOutputList.classList.add('search-output-list--sticky');
    })
    .on('disabledStickiness.stickyTableHeaders', function(event) {
      searchOutputList.classList.remove('search-output-list--sticky');
    });

  $(searchOutputList).stickyTableHeaders({
    fixedOffset: $('.page-header'),
    zIndex: 2
  });

  filterRangeSliders.forEach(function(slider) {
    var range = JSON.parse(slider.dataset.range);
    // var step = parseFloat(slider.dataset.step);
    var type = slider.dataset.type;
    var decimal = 0;
    if (type === 'price') {
      decimal = 1;
    }

    noUiSlider.create(slider, {
      start: range,
      connect: true,
      tooltips: [wNumb({ decimals: decimal }), wNumb({ decimals: decimal })],
      // step: step,
      range: {
        min: range[0],
        max: range[1]
      }
    });
  });

  searchOutput.addEventListener('click', function(event) {
    var target = event.target;

    if (target.nodeName.toLowerCase() === 'td') {
      var trElement = target.parentElement;
      var targetFlatName = trElement.dataset.src;

      if (!targetFlatName) {
        return;
      }

      location.assign(targetFlatName);

      // $.fancybox.open({
      //   src: targetFlatName,
      //   type: 'ajax',
      //   opts: {
      //     afterShow: function(instance, index) {
      //       console.log(instance, index);
      //       window.flat.init();
      //     }
      //   }
      // });
    }
  });
})();
