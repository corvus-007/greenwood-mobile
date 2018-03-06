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
