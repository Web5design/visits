var handleReaderLoad = function(evt){
	var extLocationHistory = JSON.parse(evt.target.result);

	var resultGpsLoc = new Array();
	for(var i = 0; i < extLocationHistory.length; i++){
		var extLocation = extLocationHistory[i];
		var location = new gpsLoc(extLocation.lon, extLocation.lat, extLocation.t);
		resultGpsLoc.push(location);
	}
	
	var distances = "";
	var prevLoc = null;
	for(var i = 0; i < resultGpsLoc.length; i++){
		var location = resultGpsLoc[i];
		var dist = 0;
		if(prevLoc)
			dist = haversine(prevLoc, location);
		distances = distances + location.timestamp + ";" + location.lon + ";" + location.lat + ";" + dist + "\n";
		prevLoc = location;
	}
	//console.log(distances);
	
	var clusters = pivotClustering(resultGpsLoc, 50);
	for(var i = 0; i < clusters.length; i++){
		console.log("cluster #" + i + " ("+ clusters[i].length +"):");
		//for(var j = 0; j < clusters[i].length; j++){
		var j = 0;
			console.log("   " + clusters[i][j].timestamp + " - " + clusters[i][j].lon + ", " + clusters[i][j].lat);
		//}
	}
	//alert(resultGpsLoc.length);
	
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

