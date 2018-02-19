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
