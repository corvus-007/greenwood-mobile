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
  genplanTip.addEventListener('click', function(event) {
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

window.search = (function() {
  'use strict';

  var search = document.querySelector('.search');

  if (!search) {
    return;
  }

  if (location.search) {
    var $request = getAjaxFlats('search.html', location.search.slice(1));
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

    slider.noUiSlider.on('change', function() {
      var arrayGet = Array.from(filterRangeSliders).map(
        getSearchSliderRangeParams
      );
      var stringGet = arrayGet.join('&');

      window.history.pushState(null, null, 'search.html?' + stringGet);

      var $request = getAjaxFlats('search.html', stringGet);

      $request.done(function(response) {
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

  searchOutput.addEventListener('click', function(event) {
    var target = event.target;

    if (target.nodeName.toLowerCase() === 'td') {
      var trElement = target.parentElement;
      var targetFlatName = trElement.dataset.src;

      if (!targetFlatName) {
        return;
      }

      window.history.pushState(null, null, targetFlatName);

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

window.district = (function() {
  'use strict';
  var district = document.querySelector('.district');

  if (!district) {
    return;
  }

  var places = {},
    districtMap = null,
    markers = null,
    districtLegendList = document.querySelector('.district-legend__list'),
    getmarkers = $.getJSON('//greenwoodclub.ru/template/js/district-map.json'),
    ICONPATH =
      '//greenwoodclub.ru/template/images/svg_icons_district/district_',
    icon = '',
    currInfoWindow;

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

  districtLegendToggle.addEventListener('click', function() {
    showLegend();
  });

  districtLegendClose.addEventListener('click', function() {
    hideLegend();
  });

  initMapDistrict();

  function initMapDistrict() {
    var districtMapCenter = {
      lat: 53.275784,
      lng: 34.34958
    };

    var districtPin = {
      lat: 53.275784,
      lng: 34.34958
    };

    districtMap = new google.maps.Map(document.getElementById('district-map'), {
      center: districtMapCenter,
      zoom: 15,
      scrollwheel: false,
      disableDefaultUI: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
      }
    });

    var districtMarkerCenter = new google.maps.Marker({
      position: districtPin,
      map: districtMap,
      icon: {
        url: '//greenwoodclub.ru/template/images/district-center.png',
        scaledSize: new google.maps.Size(74, 92)
      },
      title: 'GreenWood'
    });

    getmarkers.done(function(data) {
      markers = data;

      for (var i = 0; i < markers.length; i++) {
        var marker = markers[i];
        addMarker(marker);
      }

      var arrTypes = Object.keys(places);
      var legendList = createLegendItems(arrTypes);

      districtLegendList.appendChild(legendList);
    });
  }

  function clearMarkers(groupOfMarkers) {
    setMapOn(groupOfMarkers, null);
  }

  function setMapOn(groupOfMarkers, map) {
    for (var i = 0; i < groupOfMarkers.length; i++) {
      groupOfMarkers[i].setMap(map);
    }
  }

  function addMarker(markerOption) {
    icon = markerOption.type + '.svg';

    var svgIcon = {
      url: ICONPATH + icon
    };

    var marker = new google.maps.Marker({
      position: markerOption.location,
      icon: svgIcon,
      map: districtMap,
      scale: 0.2,
      title: chooseType(markerOption.type)
    });

    if (typeof places[markerOption.type] === 'undefined') {
      places[markerOption.type] = [];
    }

    places[markerOption.type].push(marker);
  }

  function chooseType(type) {
    switch (type) {
      // case "shcool":
      //   return "Школа, лицей";
      // case "kindergarten":
      //   return "Детский сад";
      case 'university':
        return 'Университет';
      // case "library":
      //   return "Библиотека";
      case 'health':
        return 'Мед. учреждение';
      // case "culture-palace":
      //   return "Дворец культуры";
      // case "museum":
      //   return "Музей";
      case 'post':
        return 'Почта';
      case 'food':
        return 'Питание';
      case 'mall':
        return 'Шоппинг';
      case 'park':
        return 'Парк';
      // case "cinema":
      //   return "Кинотеатр";
      // case "train-station":
      //   return "Ж/д станция";
      case 'bus-station':
        return 'Остановка';
      case 'gym':
        return 'Фитнес';
    }
  }

  // Создание легенды
  function createLegendItems(arr) {
    var fragmentHoldersButtons = document.createDocumentFragment();
    var img = null;

    for (
      var i = 0, elemListItem, elemItemIcon, elemItemLabel;
      i < arr.length;
      i++
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
})();

window.contactsMap = (function() {
  var contactsMap = document.querySelector('.contacts__map');

  if (!contactsMap) {
    return;
  }

  function initialize() {
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: 'г. Брянск, пр-кт Ленина, д. 67' }, function(
      results,
      status
    ) {
      if (status == google.maps.GeocoderStatus.OK) {
        console.log(
          results[0].geometry.location.G +
            ' - ' +
            results[0].geometry.location.K
        );
      }
    });

    var pyrmont = new google.maps.LatLng(53.25050150762013, 34.37128851179553);

    var stylesMap = [
      {
        elementType: 'geometry',
        stylers: [
          {
            color: '#ebe3cd'
          }
        ]
      },
      {
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#523735'
          }
        ]
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#f5f1e6'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#c9b2a6'
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#dcd2be'
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#ae9e90'
          }
        ]
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [
          {
            color: '#dfd2ae'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
          {
            color: '#dfd2ae'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#77b174'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#447530'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#f5f1e6'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#fdfcf8'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#f8c967'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#e9bc62'
          }
        ]
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry',
        stylers: [
          {
            color: '#e98d58'
          }
        ]
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#db8555'
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#806b63'
          }
        ]
      },
      {
        featureType: 'transit.line',
        elementType: 'geometry',
        stylers: [
          {
            color: '#dfd2ae'
          }
        ]
      },
      {
        featureType: 'transit.line',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#8f7d77'
          }
        ]
      },
      {
        featureType: 'transit.line',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#ebe3cd'
          }
        ]
      },
      {
        featureType: 'transit.station',
        elementType: 'geometry',
        stylers: [
          {
            color: '#dfd2ae'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#b9d3c2'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#92998d'
          }
        ]
      }
    ];

    var map = new google.maps.Map(document.getElementById('map'), {
      center: pyrmont,
      zoom: 16,
      scrollwheel: true,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER
      },
      scaleControl: true,
      streetViewControl: true,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
      },
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
      }
    });

    map.setOptions({ styles: stylesMap });

    var image = {
      url: 'images/contacts_icon.png',
      // This marker is 20 pixels wide by 32 pixels high.
      size: new google.maps.Size(82, 104),
      // The origin for this image is (0, 0).
      origin: new google.maps.Point(0, 0),
      // The anchor for this image is the base of the flagpole at (0, 32).
      anchor: new google.maps.Point(46, 104)
    };

    // Create a marker and set its position.
    var marker = new google.maps.Marker({
      map: map,
      position: pyrmont,
      title: 'Hello World!',
      icon: image
    });
  }

  $(window).on('load', function() {
    initialize();
  });
})();

