//GLOBALS:
var INPUTFILETYPE = undefined;


var MAINMODEL = undefined;
var TIMELINEMODEL = undefined;

var TIMELINEVIEW = undefined;
var OVERVIEWMAP = undefined;

var OVERLAYVIEW = undefined;

var CALENDER = undefined;

var INTERACTION_AREA = undefined;

var DISTANCESLIDER = undefined;
var MINIMAP = undefined;

var MARKERCOLOR = "#124BB9";

var BORDERCIRCLE_ANIMATION_DURATION = 1500;

var SLIDERVALUES = [
                    { value: 100, label: "Street"},
                    { value: 200, label: ""},
                    { value: 1000, label: ""},
                    { value: 2000, label: "Neighbourhood"},
                    { value: 5000, label: ""},
                    { value: 10000, label: ""},
                    { value: 20000, label: "City", active:true},
                    { value: 30000, label: ""},
                    { value: 70000, label: ""},
                    { value: 100000, label: "Area"},
                    { value: 300000, label: ""},
                    { value: 600000, label: ""},
                    { value: 1000000, label: "Country"}
                    ];


function loadDefaultData(){
	var defaultData = {};
	defaultData.target = {};
	defaultData.target.result = {};
	var file = "data/openpaths_dominikus_vancouvertrip.json";
	INPUTFILETYPE = "json";
	$.ajax({
        type: "GET",
        url: file,
        async: false,
        success: function(data){
            defaultData.target.result = data;
        }
    });
	handleReaderLoad(defaultData);
}

function initialize() {
    
	//prevent iOS scrolling behavior:
	document.body.addEventListener('touchmove', function(event) {
		  event.preventDefault();
	}, false); 
	
	$("#dropbox").on("click", loadDefaultData);
    var myFileReader = new DragAndDropFileReader(handleReaderLoad);
    
  };

/**
 * Reads and parses KML Files
 * @param kmlText
 * @returns {Array} gpsLocation Array
 */
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

/**
 * Called when File is dropped into the Dropbox
 * @param evt
 * @returns
 */
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
	
	/*
	var combinedLocationCluster = new Cluster();
	for(var i = 0; i < resultGpsLoc.length; i++){
		combinedLocationCluster.addLoc(resultGpsLoc[i], (i == resultGpsLoc.length - 1) ? resultGpsLoc[i] : resultGpsLoc[i + 1]);
	}
	
	var ne = combinedLocationCluster.clusterBounds.getNorthEast();
	var sw = combinedLocationCluster.clusterBounds.getSouthWest();
	
	var dist = haversineLatLng(ne,sw);
	
	var distValue;
	
	for (var i = 0; i< 7;i++){
		
		if(SLIDERVALUES[i].value>= dist*100){
			SLIDERVALUES[i].active = true;
			break;
		}
		
	}*/
	
	DISTANCESLIDER = new VerticalSlider("slider", SLIDERVALUES, handleSliderDown, handleSliderMoved, handleSliderUp);
	
	var currentDistanceValue = DISTANCESLIDER.getCurrentValue() / 1000;
	
	MAINMODEL = new Mainmodel(resultGpsLoc, currentDistanceValue);
	
	
	
	TIMELINEMODEL = new TimelineModel();
	TIMELINEMODEL.updateFromMainmodel();
	
	setSizes();
	
	
	$("#startscreen").fadeOut(500, initializeViews);
};

function setSizes(){
	
	var windowWidth = $(window).width();
	var windowHeight = $(window).height();
	
	$("#connectionLines").attr("style","height:"+ windowWidth + "px");
	
	
	$("#slider").attr("style","left:"+ (windowWidth-200) + "px");
 	$("#timeline").attr("style","height:"+ (windowHeight- $("#minimap").height() -100) + "px; width:" + (windowWidth -400) + "px");
 	$("#maskcontainer").attr("style","height:"+ (windowHeight- $("#minimap").height() -100) + "px; width:" + (windowWidth -400) + "px");
 	$("#markercontainer").attr("style","height:"+ (windowHeight- $("#minimap").height() -100) + "px; width:" + (windowWidth -400) + "px");
 	
 	
	$("#overview").attr("style","top:"+ (windowHeight- $("#overview").height() -10) + "px; left:" + (windowWidth/2- $("#overview").width() -10) + "px");
	$("#minimap").attr("style","top:"+ (windowHeight- $("#minimap").height() -10) + "px; left:" + (windowWidth/2 +10) + "px");
}

function initializeViews(){
	OVERVIEWMAP = new OverviewMap();
	OVERVIEWMAP.drawOverviewMap();

	reInitializeAllViews();
	$("#overview").fadeIn(500);
	
	MINIMAP = new MiniMap("minimap", handleMinimapSliderDown, handleMinimapSliderMoved, handleMinimapSliderUp);

}


function reInitializeAllViews(){
	console.log("reinitializing all views...");
	
	INTERACTION_AREA = Raphael("interactionArea",window.innerWidth,window.innerHeight);
	
	TIMELINEVIEW = new TimelineView();
	TIMELINEVIEW.drawTimeline();
		
	OVERLAYVIEW = new OverlayView();
	OVERLAYVIEW.drawBubbleMasks();
	
	CALENDER = new Calender();
	CALENDER.drawInteractionArea();
	
	//$("svg").fadeIn(1500);
	$("#markercontainer").fadeIn(1500);
	$("#marker").fadeIn(1500);
	$("#maskcontainer").fadeIn(1500);
	$("#masks").fadeIn(1500);
	$("#connectionLines").fadeIn(1500);
	$("#calenderBG").fadeIn(1500);
	$("#calender").fadeIn(1500);
	$("#interactionArea").fadeIn(1500);
	$("#timeline").fadeIn(1500);
		
	$("#slider").animate({
		"opacity": 1
	},1500, function(){
		
	});
	
}

function handleSliderDown(slider){
	OVERLAYVIEW.hideMarkers();
	TIMELINEVIEW.hideTimeline();
	console.log("slider down!!");
};

function handleSliderMoved(slider){
	var clusterThreshold = DISTANCESLIDER.getCurrentValue() / 1000;
	
	MAINMODEL.recluster(clusterThreshold);
	MINIMAP.removeBubbles();
	MINIMAP.drawMinimap();
	MINIMAP.updateCircles();
	
	var minimapPositions = MINIMAP.getHandleTimestamps();
	var leftAbsoluteTime = minimapPositions[0];
	var rightAbsoluteTime = minimapPositions[1];


	TIMELINEMODEL.updateFromAbsoluteValues(leftAbsoluteTime, rightAbsoluteTime, clusterThreshold);
	OVERLAYVIEW.drawPreviewBubbles();
};

function emptyAndHideAllViews(){
	$("#previewBubbles").empty();
	$("#interactionArea").empty();
	$("#marker").empty();
	$("#connectionLines").empty();
	$("#calender").empty();
	$("#timeline").empty();
	
	$("#marker").css("display","none");
	$("#connectionLines").css("display","none");
	$("#calenderBG").css("display","none");
	$("#calender").css("display","none");
	$("#timeline").css("opacity", "1");
}

function handleSliderUp(slider){

	emptyAndHideAllViews();
	
	$("#masks").empty();
	$("#masks").css("display","none");
	
	//update the main model's clustering
	MAINMODEL.recluster(DISTANCESLIDER.getCurrentValue() / 1000);
	
	reInitializeAllViews();
	
};

var handleMinimapSliderDown = function(minimap){
	
}; 

var handleMinimapSliderMoved = function(minimap){
	
};

var handleMinimapSliderUp = function(minimap){
	emptyAndHideAllViews();
	
	var oldModelLeftLimit = TIMELINEMODEL.displayedTimeframeStart;
	var oldModelRightLimit = TIMELINEMODEL.displayedTimeframeEnd;
	
	var minimapPositions = MINIMAP.getHandleTimestamps();
	var leftAbsoluteTime = minimapPositions[0];
	var rightAbsoluteTime = minimapPositions[1];

	TIMELINEMODEL.updateFromAbsoluteValues(leftAbsoluteTime, rightAbsoluteTime, DISTANCESLIDER.getCurrentValue() / 1000);
	OVERLAYVIEW.updateBorderCircles(reInitializeAllViews, oldModelLeftLimit, oldModelRightLimit);
	CALENDER.updateTimestampMarkers();
	OVERVIEWMAP.panToCurrentBounds();
};
