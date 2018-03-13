window.contactsMap = (function () {
  var contactsMap = document.querySelector('.contacts__map');

  if (!contactsMap) {
    return;
  }

  function initialize() {
    var pyrmont = new google.maps.LatLng(53.25050150762013, 34.37128851179553);

    var map = new google.maps.Map(document.getElementById('contacts-map'), {
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
      title: 'г. Брянск, пр-кт Ленина, д. 67',
      icon: image
    });
  }

  $(window).on('load', function () {
    initialize();
  });
})();
