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

window.flat = (function() {
  'use strict';

  var flat = document.querySelector('.flat');

  if (!flat) {
    return;
  }

  init();

  function init() {
    var flat = document.querySelector('.flat');
    var flatPlans = flat.querySelectorAll('.flat__plan');

    function processingPlan(plan) {
      var planAdjuster = plan.querySelector('.flat-plan__adjuster');
      var planImage = plan.querySelector('.flat-plan__image');

      function updatePlanAdjuster(ratio) {
        planAdjuster.style.paddingTop = ratio * 100 + '%';
      }

      updatePlanAdjuster(getImageRatio(planImage));

      planImage.addEventListener('load', function() {
        updatePlanAdjuster(getImageRatio(planImage));
      });

      planImage.addEventListener('click', function(event) {
        planImage.classList.toggle('flat-plan__image--scale');
      });
    }

    function getImageRatio(image) {
      return image.naturalHeight / image.naturalWidth;
    }

    flatPlans.forEach(processingPlan);
  }

  return {
    init: init
  };
})();

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
      var searchKey = param.indexOf('=')+1;
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

window.contactsDirectors = (function() {
  var formContactManager = document.forms['form-contact-manager'];

  if (!formContactManager) {
    return;
  }

  $('[data-fancybox-director]').fancybox({
    afterShow: function(instance, current) {
      var formContactManager = document.forms['form-contact-manager'];
      var inputEmail = formContactManager.elements.contact_manager_target_email;
      var inputName = formContactManager.elements.contact_manager_target_name;
      var $btn = instance.$lastFocus;
      var directorEmail = $btn.data('contact-director-target-email');
      var $director = $btn.closest('.contacts-directors__item');
      var directorName = $director
        .find('.contacts-directors__name')
        .text()
        .trim()
        .replace(/\s{2,}/g, ' ');

      inputEmail.value = directorEmail;
      inputName.value = directorName;
    }
  });

  // Send form
  $(formContactManager).on('submit', function(event) {
    event.preventDefault();
    var url = this.action;
    var $form = $(this);
    var formData = new FormData(this);
    formData.append('send_personal_form', '');

    var requestForm = $.ajax({
      url: url,
      data: formData,
      type: 'POST',
      contentType: false,
      processData: false
    });

    requestForm.done(function(response) {
      if (response === 'success') {
        setTimeout(function() {
          formContactManager.reset();
          $.fancybox.close(true);
          $.fancybox.open(
            '<div class="popup"><h2 class="popup__title">Спасибо. Сообщение отправлено!</h2></div>'
          );
        }, 200);
      } else {
        $.fancybox.close(true);
        $.fancybox.open(
          '<div class="popup"><h2 class="popup__title">Ошибка!</h2></div>'
        );
      }
    });

    requestForm.fail(function() {
      alert('Ошибка отправки запроса на сервер, повторите отправку позже.');
    });
  });
})();

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
      $(this).toggleClass('about-us__text-title--close-contnet').next().slideUp();
    }
  });
})();

window.district = (function () {
  'use strict';

  var district = document.querySelector('.district');

  if (!district) {
    return;
  }

  ymaps.ready(init);
  var districtMap;
  var districtPin;
  var places = {};
  var markers = null;
  var districtLegendList = document.querySelector('.district-legend__list');
  var getmarkers = $.getJSON('js/district-map.json');
  var ICONPATH = 'images/district/district_';
  var icon = '';

  var centerMap = [53.276568, 34.350277];
  var pinSize = [64, 79];
  var pinOffset = [-32, -79];

  var districtLegend = district.querySelector('.district-legend');
  var districtLegendToggle = district.querySelector('.district-legend-toggle');
  var districtLegendClose = districtLegend.querySelector(
    '.district-legend__close'
  );

  function showLegend() {
    districtLegend.classList.remove('district-legend--hidden');
    districtLegendToggle.classList.add('district-legend-toggle--hidden');
  }

  function hideLegend() {
    districtLegend.classList.add('district-legend--hidden');
    districtLegendToggle.classList.remove('district-legend-toggle--hidden');
  }

  // Создание легенды
  function createLegendItems(arr) {
    var fragmentHoldersButtons = document.createDocumentFragment();
    var img = null;

    for (
      var i = 0, elemListItem, elemItemIcon, elemItemLabel; i < arr.length; i++
    ) {
      img = new Image();
      img.src = ICONPATH + arr[i] + '.svg';
      img.width = 36;
      img.height = 45;
      img.className = 'district-legend__icon';
      elemListItem = document.createElement('li');
      elemItemIcon = document.createElement('span');
      elemItemLabel = document.createElement('span');
      elemListItem.className = 'district-legend__item';
      elemItemIcon.className = 'district-legend__iconbox';
      elemItemLabel.className = 'district-legend__label';
      elemItemLabel.textContent = chooseType(arr[i]);

      elemItemIcon.appendChild(img);
      elemListItem.appendChild(elemItemIcon);
      elemListItem.appendChild(elemItemLabel);
      fragmentHoldersButtons.appendChild(elemListItem);
    }

    return fragmentHoldersButtons;
  }

  function chooseType(type) {
    switch (type) {
      case 'university':
        return 'Университет';
      case 'health':
        return 'Мед. учреждение';
      case 'post':
        return 'Почта';
      case 'food':
        return 'Питание';
      case 'mall':
        return 'Шоппинг';
      case 'park':
        return 'Парк';
      case 'bus-station':
        return 'Остановка';
      case 'gym':
        return 'Фитнес';
    }
  }

  districtLegendToggle.addEventListener('click', function () {
    showLegend();
  });

  districtLegendClose.addEventListener('click', function () {
    hideLegend();
  });

  function init() {
    var myCollection = new ymaps.GeoObjectCollection({});

    function addMarker(markerOption) {
      icon = markerOption.type + '.svg';
      var svgIcon = ICONPATH + icon;
      var marker = new ymaps.Placemark([markerOption.location.lat, markerOption.location.lng], {}, {
        iconLayout: 'default#image',
        iconImageHref: svgIcon
      });

      if (typeof places[markerOption.type] === 'undefined') {
        places[markerOption.type] = [];
      }

      places[markerOption.type].push(marker);
      myCollection.add(marker);
    }

    districtMap = new window.ymaps.Map("district-map", {
      center: centerMap,
      zoom: 15,
      controls: []
    });

    districtMap.controls.add('zoomControl', {
      size: 'small',
      zoomDuration: 400
    });

    districtPin = new ymaps.Placemark(centerMap, {
      balloonContent: 'Жилой комплекс Гринвуд'
    }, {
      iconLayout: 'default#image',
      iconImageHref: 'images/district/district-center.png',
      iconImageSize: pinSize,
      iconImageOffset: pinOffset
    });

    districtMap.geoObjects.add(districtPin);

    getmarkers.done(function (data) {
      markers = data;

      for (var i = 0; i < markers.length; i++) {
        var marker = markers[i];
        addMarker(marker);
      }

      var arrTypes = Object.keys(places);
      var legendList = createLegendItems(arrTypes);

      districtLegendList.appendChild(legendList);
      districtMap.geoObjects.add(myCollection);
    });
  }
})();

window.contactsMap = (function () {
  var contacts = document.querySelector('.contacts');

  if (!contacts) {
    return;
  }

  ymaps.ready(init);

  var centerMap = [53.250513, 34.371768];
  var pinSize = [48, 60];
  var pinOffset = [-24, -60];

  function init() {
    contactsMap = new window.ymaps.Map("contacts-map", {
      center: centerMap,
      zoom: 17,
      controls: []
    });

    contactsMap.controls.add('zoomControl', {
      size: 'small',
      zoomDuration: 400
    });

    districtPin = new ymaps.Placemark(centerMap, {
      balloonContent: 'г. Брянск, пр-кт Ленина, д. 67'
    }, {
      iconLayout: 'default#image',
      iconImageHref: 'images/contacts_icon.png',
      iconImageSize: pinSize,
      iconImageOffset: pinOffset
    });

    contactsMap.geoObjects.add(districtPin);

  }
})();

