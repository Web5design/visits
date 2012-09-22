var handleReaderLoad = function(evt){
	var extLocationHistory = JSON.parse(evt.target.result);

	var resultGpsLoc = new Array();
	for(var i = 0; i < extLocationHistory.length; i++){
		var extLocation = extLocationHistory[i];
		var location = new GpsLoc(extLocation.lon, extLocation.lat, extLocation.t);
		resultGpsLoc.push(location);
	}
	
	var mainmodel = new Mainmodel(resultGpsLoc);
	
	var tlModel = new TimelineModel(mainmodel);
	
	var viewJS = new ViewJS(mainmodel, tlModel);
	viewJS.drawTimeline();
	
	$("#timeline").fadeIn(2500);
	$("#dropbox").fadeOut(2500);
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
    
    var myFileReader = new DragAndDropFileReader(handleReaderLoad);
  }

