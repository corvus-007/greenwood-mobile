window.district = (function() {
  'use strict';
  var district = document.querySelector('.district');

  if (!district) {
    return;
  }

  var places = {},
    districtMap = null,
    markers = null,
    districtMapFilters = document.querySelector('.map_snoski__list'),
    getmarkers = $.getJSON('//greenwoodclub.ru/template/js/district-map.json'),
    ICONPATH =
      '//greenwoodclub.ru/template/images/svg_icons_district/district_',
    icon = '',
    currInfoWindow;

  // debugger;
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

    districtMap = new google.maps.Map(document.getElementById('district-map'), {
      center: districtMapCenter,
      zoom: 15,
      scrollwheel: false,
      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_CENTER
      }
    });

    // districtMap.setOptions({ styles: stylesMap });

    var districtMarkerCenter = new google.maps.Marker({
      position: districtPin,
      map: districtMap,
      icon: {
        url: '//greenwoodclub.ru/template/images/district-center.png',
        // size: new google.maps.Size(71, 71),
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

      var buttons = createButtons(arrTypes);

      districtMapFilters.appendChild(buttons);

      $togglerButtonMarkers = $('.js-action-toggle-markers');

      $togglerButtonMarkers.on('click', function(event) {
        var dataType = $(this).data('type');

        if ($(this).hasClass('is-disabled')) {
          $(this).removeClass('is-disabled');
          setMapOn(places[dataType], districtMap);
        } else {
          $(this).addClass('is-disabled');
          clearMarkers(places[dataType]);
        }
      });
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
  function createButtons(arr) {
    var fragmentHoldersButtons = document.createDocumentFragment();
    var img = null;

    for (
      var i = 0, elemListItem, elemItemIcon, elemItemLabel, elemButon;
      i < arr.length;
      i++
    ) {
      img = new Image();
      img.src = ICONPATH + arr[i] + '.svg';
      elemListItem = document.createElement('li');
      elemItemIcon = document.createElement('span');
      elemItemLabel = document.createElement('span');
      // elemButon = document.createElement('button');
      // elemButon.classList.add('js-action-toggle-markers');
      // elemButon.className = 'js-action-toggle-markers district-map-filter';
      // elemButon.setAttribute('data-type', arr[i]);
      // elemButon.textContent = chooseType(arr[i]);
      elemListItem.className =
        'js-action-toggle-markers map_snoski__list__item';
      elemItemIcon.className = 'map_snoski__list__item__icon';
      elemItemLabel.className = 'map_snoski__list__item__label';
      elemListItem.setAttribute('data-type', arr[i]);
      // elemButon.title = 'Скрыть';
      elemItemLabel.textContent = chooseType(arr[i]);

      // elemButon.insertBefore(img, elemButon.firstChild);
      elemItemIcon.appendChild(img);
      elemListItem.appendChild(elemItemIcon);
      elemListItem.appendChild(elemItemLabel);
      fragmentHoldersButtons.appendChild(elemListItem);
    }

    return fragmentHoldersButtons;
  }
})();
