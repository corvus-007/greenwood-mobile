window.search = (function () {
  'use strict';

  var search = document.querySelector('.search');

  if (!search) {
    return;
  }

  function declOfNum(titles) {
    var number = Math.abs(number);
    var cases = [2, 0, 1, 1, 1, 2];
    return function (number) {
      return titles[
        number % 100 > 4 && number % 100 < 20 ?
        2 :
        cases[number % 10 < 5 ? number % 10 : 5]
      ];
    };
  }

  console.log(declOfNum(['квартира', 'квартиры', 'квартир'])(12));

  var arrFilter = [];
  if (location.search) {
    var $request = getAjaxFlats('search.html', location.search.slice(1));
    var rawArrFilter = location.search.slice(1).split('&');
    arrFilter = rawArrFilter.map(function (param) {
      var searchKey = param.indexOf('=') + 1;
      return param.slice(searchKey).split('-');
    });
  }

  var filterRangeSliders = document.querySelectorAll('.filter-range-slider');
  var searchOutput = document.querySelector('.search-output');
  var searchOutputList = document.querySelector('.search-output-list');

  $(searchOutputList)
    .on('enabledStickiness.stickyTableHeaders', function (event) {
      searchOutputList.classList.add('search-output-list--sticky');
    })
    .on('disabledStickiness.stickyTableHeaders', function (event) {
      searchOutputList.classList.remove('search-output-list--sticky');
    });

  $(searchOutputList).stickyTableHeaders({
    fixedOffset: $('.page-header'),
    zIndex: 2
  });

  filterRangeSliders.forEach(function (slider, index) {
    var range = JSON.parse(slider.dataset.range);
    // var step = parseFloat(slider.dataset.step);
    var type = slider.dataset.type;
    var decimal = 0;

    noUiSlider.create(slider, {
      start: range,
      connect: true,
      tooltips: [wNumb({
        decimals: decimal
      }), wNumb({
        decimals: decimal
      })],
      // step: step,
      range: {
        min: range[0],
        max: range[1]
      }
    });

    slider.noUiSlider.set(arrFilter[index]);

    slider.noUiSlider.on('change', function () {
      var arrayGet = Array.from(filterRangeSliders).map(
        getSearchSliderRangeParams
      );
      var stringGet = arrayGet.join('&');

      window.history.pushState(null, null, 'search.html?' + stringGet);

      var $request = getAjaxFlats('search.html', stringGet);

      $request.done(function (response) {
        console.log(response);
      });
      console.log(stringGet);
    });
  });

  function getAjaxFlats(url, data) {
    return $.ajax({
      type: 'GET',
      url: url,
      data: data
      // dataType: 'json'
    });
  }

  function getSearchSliderRangeParams(slider) {
    var parametrName = slider.dataset.type;
    var parametrArrValue = slider.noUiSlider.get();
    var parametrStringValue = parametrArrValue.join('-');
    return parametrName + '=' + parametrStringValue;
  }

  searchOutput.addEventListener('click', function (event) {
    var target = event.target;

    if (target.nodeName.toLowerCase() === 'td') {
      var trElement = target.parentElement;
      var targetFlatName = trElement.dataset.src;

      if (!targetFlatName) {
        return;
      }

      // window.history.pushState(null, null, targetFlatName);
      window.location.assign(targetFlatName);

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
