//GLOBALS:
var INPUTFILETYPE = undefined;


var MAINMODEL = undefined;
var TIMELINEMODEL = undefined;
var VIEWJS = undefined;
var OVERLAYVIEW = undefined;


function readKmlLocations(kmlText){
	var result = new Array();
	
	//find beginning and end of relevant substring
	var startGxTrack = kmlText.indexOf("<gx:Track>");
	var endGxTrack = kmlText.indexOf("</gx:Track>");
	var relevantKmlText = kmlText.substring(startGxTrack, endGxTrack);
	
	var relevantKmlTextLines = relevantKmlText.split("\n");
	var currentCoord = new GpsLoc(undefined,undefined,undefined);
	for(var i = 0; i < relevantKmlTextLines.length; i++){
		var currentLine = relevantKmlTextLines[i];
		currentLine = jQuery.trim(currentLine);
		if(currentLine.indexOf("<when>") != -1){
			currentLine = currentLine.slice(6);	//remove front part ('<when>')
			currentLine = currentLine.slice(0, currentLine.length - 7); //remove end part ('</when>')
			currentWhen = new Date(currentLine);
			console.log("converted when: " + currentLine + " to: " + currentWhen.toDateString() + " and: " + currentWhen.getTime());
			currentCoord.timestamp = currentWhen.getTime() / 1000.0;		//convert to seconds
			
			//check if current point is finished
			if(currentCoord.lon){
				result.push(currentCoord);
				currentCoord = new GpsLoc(undefined, undefined, undefined);
			}
		} else if(currentLine.indexOf("<gx:coord>") != -1){
			currentLine = currentLine.slice(10);	//remove front part ('<gx:coord>')
			currentLine = currentLine.slice(0, currentLine.length - 11); //remove end part ('</gx:coord>')
			console.log("parsing coord: " + currentLine);
			var splitCoordString = currentLine.split(" ");
			//first value is lon, then lat, then altitude
			currentCoord.lon = splitCoordString[0];
			currentCoord.lat = splitCoordString[1];
			
			//check if current point is finished
			if(currentCoord.timestamp){
				result.push(currentCoord);
				currentCoord = new GpsLoc(undefined, undefined, undefined);
			}
			
		} else {
			console.log("unknown type of line: " + currentLine);
		}
	}
	return result;
};

var handleReaderLoad = function(evt){

	var resultGpsLoc = new Array();

	if(INPUTFILETYPE == "json"){
		var extLocationHistory = JSON.parse(evt.target.result);
	
		for(var i = 0; i < extLocationHistory.length; i++){
			var extLocation = extLocationHistory[i];
			var location = new GpsLoc(extLocation.lon, extLocation.lat, extLocation.t);
			resultGpsLoc.push(location);
		}
	} else if(INPUTFILETYPE == "kml"){
		resultGpsLoc = readKmlLocations(evt.target.result);
	}

	console.log("resulting array:");
	for(var i = 0; i < resultGpsLoc.length; i++){
		console.log("#" + i + ": lat: " + resultGpsLoc[i].lat + ", lon: " + resultGpsLoc[i].lon + ", timestamp: " + resultGpsLoc[i].timestamp);
	}

	MAINMODEL = new Mainmodel(resultGpsLoc);
	
	TIMELINEMODEL = new TimelineModel(MAINMODEL);
	
	VIEWJS = new ViewJS();
	VIEWJS.drawTimeline();
	VIEWJS.drawOverviewMap();
	
	OVERLAYVIEW = new OverlayView();
	OVERLAYVIEW.drawMapBubbleMasks();
	//overlayView.drawBubblesOverlay();
	
	$("#timeline").fadeIn(2500);
	$("#overview").fadeIn(2500);
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

