function drawMarkersAndLines(map, i){
	
	var currentBubble = TIMELINEVIEW.visibleMapBubbles[i];
	
	this.drawBubbleMarkers(currentBubble);
	
	this.drawOverviewMarker(currentBubble);
	
	this.drawConnectionCurve(currentBubble);
	
	$("#map_container" + i).animate({
	    opacity: 1
	  }, 3500, function() {
	    // Animation complete.
	  });
};

function drawOverviewMarker(currentBubble){
	
	var overviewMarker = new Object();
	
	//draw overlay circle on overview map
	overviewMarker.ne = convertPoint(OVERVIEWMAP.map, currentBubble.cluster.clusterBounds.getNorthEast());
   	overviewMarker.sw = convertPoint(OVERVIEWMAP.map, currentBubble.cluster.clusterBounds.getSouthWest());
   	overviewMarker.radius = Math.abs(overviewMarker.ne.x - overviewMarker.sw.x);
   	
   	//make sure the circles are large enough to be visible
   	if(overviewMarker.radius < this.minimumCircleRadiusOnOverviewMap){
   		overviewMarker.radius = this.minimumCircleRadiusOnOverviewMap;
   	}
   	
   	overviewMarker.pos = convertPoint(OVERVIEWMAP.map, currentBubble.cluster.clusterBounds.getCenter());
   	
	overviewMarker.fill = this.connectionLineCanvas.circle(overviewMarker.pos.x + Number(OVERVIEWMAP.x), overviewMarker.pos.y + Number(OVERVIEWMAP.y), overviewMarker.radius);
	overviewMarker.fill.attr({ "fill": MARKERCOLOR, "opacity": "0.7", "stroke-width" : 0});
	
	overviewMarker.border = this.connectionLineCanvas.circle(overviewMarker.pos.x + Number(OVERVIEWMAP.x), overviewMarker.pos.y + Number(OVERVIEWMAP.y), overviewMarker.radius);
	overviewMarker.border.attr({ "stroke": "#aaa"});
	
	currentBubble.overviewMarker = overviewMarker;
	
};


function drawBubbleMarkers(currentBubble){
	//draw all markers on the overlay
	for(var j = 0; j < currentBubble.cluster.gpsLocs.length; j++){
		var marker = currentBubble.cluster.gpsLocs[j];
		var markerLatLng = new google.maps.LatLng(marker.lat, marker.lon);
		var markerPosition = convertPoint(currentBubble.map, markerLatLng);
		/*
		var circleMarker = this.canvas.circle(markerPosition.x + Number(currentBubble.x), markerPosition.y + Number(currentBubble.y), 4);
		circleMarker.attr({"fill" : "#0000cc", "opacity" : 0.7, "stroke" : "#fff", "stroke-width" : "2px"});
		*/
		
		var markerX = markerPosition.x + Number(currentBubble.x)  + Number(TIMELINEVIEW.x);
		var markerY = markerPosition.y + Number(currentBubble.y)  + Number(TIMELINEVIEW.y);
		
		var crossString  = "M" + (markerX -2.5) + "," + (markerY -2.5) + " ";
		crossString = crossString + "L" + (markerX + 2.5) + "," + (markerY + 2.5) + " ";
		crossString = crossString + "M" + (markerX - 2.5) + "," + (markerY + 2.5) + " ";
		crossString = crossString + "L" + (markerX + 2.5) + "," + (markerY - 2.5);
		
		var crossBg = this.markerCanvas.path(crossString);
		crossBg.attr({"stroke" : "#fff", "stroke-width" : 4 , "stroke-linecap" : "round", "opacity" : 0.7});
		
		crossString  = "M" + (markerX -2) + "," + (markerY -2) + " ";
		crossString = crossString + "L" + (markerX + 2) + "," + (markerY + 2) + " ";
		crossString = crossString + "M" + (markerX - 2) + "," + (markerY + 2) + " ";
		crossString = crossString + "L" + (markerX + 2) + "," + (markerY - 2);
		
		var cross = this.markerCanvas.path(crossString);
		cross.attr({"stroke" : MARKERCOLOR, "stroke-width" : 2 , "stroke-linecap" : "round", "opacity" : 0.9});
		
	}	
};


function drawConnectionCurve(currentBubble){
	
	var curveTopX = currentBubble.x + currentBubble.width / 2  + Number(TIMELINEVIEW.x);
	var curveTopY = currentBubble.y + currentBubble.width + Number(TIMELINEVIEW.y);
	var curveBottomX = currentBubble.overviewMarker.pos.x + Number(OVERVIEWMAP.x);
	var curveBottomY = currentBubble.overviewMarker.pos.y + Number(OVERVIEWMAP.y);
	
	var connectingCurvePath = "M" + curveTopX + "," + curveTopY + " ";
	connectingCurvePath = connectingCurvePath + "Q" + curveTopX + "," + (curveBottomY - (curveBottomY - curveTopY)/2.0) + " ";
	connectingCurvePath = connectingCurvePath + "" + curveBottomX + "," + curveBottomY;
	var connectingCurve = this.connectionLineCanvas.path(connectingCurvePath);
	connectingCurve.attr({"stroke" : "#777", "stroke-width" : "1", "opacity" : 0.7});
	
};

function drawBubbleMasks(){
	
	this.maskCanvas.clear();
	
	for(var i = 0; i < TIMELINEVIEW.visibleMapBubbles.length; i++){
		
		var currentBubble = TIMELINEVIEW.visibleMapBubbles[i];
		
		var maskX = currentBubble.x  + Number(TIMELINEVIEW.x);
		var maskY = currentBubble.y  + Number(TIMELINEVIEW.y);
		var maskWidth = currentBubble.width;
		var maskHeight = currentBubble.height +1;
		var circleHeight = maskHeight - TIMELINEVIEW.bottomMaskHeight;
		
		var polygonString = "M" + maskX + "," + maskY + "L" + (maskX + maskWidth) + "," + maskY;
		polygonString = polygonString + "L" + (maskX + maskWidth) + "," + (maskY + maskHeight);
		polygonString = polygonString + "L" + maskX + "," + (maskY + maskHeight);
		polygonString = polygonString + "L" + maskX + "," + maskY;
		polygonString = polygonString + "M" + maskX + "," + (maskY + circleHeight / 2);
		polygonString = polygonString + "A" + (maskWidth / 2) + "," + (maskWidth / 2) + " " + "0 0 0" + " " + (maskX + maskWidth) + "," + (maskY + circleHeight / 2);
		polygonString = polygonString + "A" + (maskWidth / 2) + "," + (maskWidth / 2) + " " + "0 0 0" + " " + (maskX) + "," + (maskY + circleHeight / 2);
		
		var polyMask = this.maskCanvas.path(polygonString);
		polyMask.attr({"fill" : "#fff", "stroke-width" : "0px"});
		
		var borderCircle = this.maskCanvas.circle((maskX + maskWidth / 2), (maskY + circleHeight / 2), maskWidth / 2);
		borderCircle.attr({"stroke" : "#aaa"});
	}
};

function drawPreviewBubbles(){
	
	this.previewBubblesCanvas.clear();
	
	var availableWidth = TIMELINEVIEW.div.width();
	var availableHeight = TIMELINEVIEW.div.height();
	
	var stepSize = availableWidth / TIMELINEMODEL.displayedTimeframe;
	var horizontalPosition = 0;
	
	for(var i = 0; i < TIMELINEMODEL.clusters.length; i++){
		
		var radius = Math.floor(TIMELINEMODEL.clusters[i].timeframe * stepSize) / 2;
		
		var verticalPosition = (availableHeight / 2.0) - (radius);
		
		var maskX = horizontalPosition + radius + TIMELINEVIEW.x;
		var maskY = verticalPosition + radius + TIMELINEVIEW.y;

		
		var borderCircle = this.previewBubblesCanvas.circle(maskX, maskY, radius);
		borderCircle.attr({"fill" : "#aaa", "stroke-width" : "0px", "opacity" : 0.2});
		
		horizontalPosition = horizontalPosition + radius * 2;
	}
	
}

function hideMarkers(){
	this.markerCanvas.clear();
}

function OverlayView(){
	//initialize overlay
	this.markerCanvas = Raphael("marker",window.innerWidth,750);
	this.maskCanvas = Raphael("masks",window.innerWidth,750);
	this.connectionLineCanvas = Raphael("connectionLines",window.innerWidth,750);
	this.previewBubblesCanvas = Raphael("previewBubbles",window.innerWidth,750);
	
	this.minimumCircleRadiusOnOverviewMap = 2;
	
	this.drawMarkersAndLines = drawMarkersAndLines;
	this.drawBubbleMasks = drawBubbleMasks;
	this.drawConnectionCurve = drawConnectionCurve;
	
	this.drawBubbleMarkers = drawBubbleMarkers;
	
	this.drawOverviewMarker = drawOverviewMarker;
	
	this.hideMarkers = hideMarkers;
	
	this.drawPreviewBubbles = drawPreviewBubbles;
	

};