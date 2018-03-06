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
