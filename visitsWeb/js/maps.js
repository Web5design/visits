function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(-34.397, 150.644),
          zoom: 8,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          noClear: true,
          zoomControl: false,
          panControl: false,
          rotateControl: false,
          scaleControl: false,
          disableDefaultUI: true

        };
        var map = new google.maps.Map(document.getElementById("map_canvas"),
            mapOptions);
      }