var handleReaderLoad = function(evt){
	var extLocationHistory = JSON.parse(evt.target.result);

	var resultGpsLoc = new Array();
	for(var extLocation in extLocationHistory){
		var location = new gpsLoc(extLocation.lon, extLocation.lat, extLocation.t);
		resultGpsLoc.push(location);
	}

	alert(resultGpsLoc.length);
	
};

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
    
    var myFileReader = new dragAndDropFileReader(handleReaderLoad);
  }

