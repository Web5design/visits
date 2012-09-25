function drawOverlayForMap(map, i){
	
	var currentBubble = new Object();
		
	currentBubble.map = map;
	currentBubble.div = $("#map_container" + i);
	currentBubble.cluster = TIMELINEMODEL.clusters[i];	
	currentBubble.x = Number(currentBubble.div.css("left").substring(0, currentBubble.div.css("left").length - 2));
	currentBubble.y = Number(currentBubble.div.css("top").substring(0, currentBubble.div.css("top").length - 2));
	currentBubble.width = currentBubble.div.width();
	currentBubble.height = currentBubble.div.height();
	currentBubble.overviewMarker;
	
	
	var overviewMap = new Object();
	
	overviewMap.map = VIEWJS.overviewMap;
	overviewMap.div = $("#overview");
	overviewMap.x = Number(overviewMap.div.css("left").substring(0, overviewMap.div.css("left").length - 2));
	overviewMap.y = Number(overviewMap.div.css("top").substring(0, overviewMap.div.css("top").length - 2));
	
	this.drawBubbleMarkers(currentBubble);
	
	this.drawOverviewMarker(currentBubble,overviewMap);
	
	this.drawConnectionCurve(currentBubble,overviewMap);
	
	$("#map_container" + i).animate({
	    opacity: 1
	  }, 3500, function() {
	    // Animation complete.
	  });
};

function drawOverviewMarker(currentBubble,overviewMap){
	
	var overviewMarker = new Object();
	
	//draw overlay circle on overview map
	overviewMarker.ne = convertPoint(overviewMap.map, currentBubble.cluster.clusterBounds.getNorthEast());
   	overviewMarker.sw = convertPoint(overviewMap.map, currentBubble.cluster.clusterBounds.getSouthWest());
   	overviewMarker.radius = Math.abs(overviewMarker.ne.x - overviewMarker.sw.x);
   	
   	//make sure the circles are large enough to be visible
   	if(overviewMarker.radius < this.minimumCircleRadiusOnOverviewMap){
   		overviewMarker.radius = this.minimumCircleRadiusOnOverviewMap;
   	}
   	
   	overviewMarker.pos = convertPoint(overviewMap.map, currentBubble.cluster.clusterBounds.getCenter());
   	
	overviewMarker.fill = this.connectionLineCanvas.circle(overviewMarker.pos.x + Number(overviewMap.x), overviewMarker.pos.y + Number(overviewMap.y), overviewMarker.radius);
	overviewMarker.fill.attr({ "fill": MARKERCOLOR, "opacity": "0.7", "stroke-width" : 0});
	
	overviewMarker.border = this.connectionLineCanvas.circle(overviewMarker.pos.x + Number(overviewMap.x), overviewMarker.pos.y + Number(overviewMap.y), overviewMarker.radius);
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
		
		var markerX = markerPosition.x + Number(currentBubble.x);
		var markerY = markerPosition.y + Number(currentBubble.y);
		
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


function drawConnectionCurve(currentBubble,overviewMap){
	
	var curveTopX = currentBubble.x + currentBubble.width / 2;
	var curveTopY = currentBubble.y + currentBubble.width;
	var curveBottomX = currentBubble.overviewMarker.pos.x + Number(overviewMap.x);
	var curveBottomY = currentBubble.overviewMarker.pos.y + Number(overviewMap.y);
	
	var connectingCurvePath = "M" + curveTopX + "," + curveTopY + " ";
	connectingCurvePath = connectingCurvePath + "Q" + curveTopX + "," + (curveBottomY - (curveBottomY - curveTopY)/2.0) + " ";
	connectingCurvePath = connectingCurvePath + "" + curveBottomX + "," + curveBottomY;
	var connectingCurve = this.connectionLineCanvas.path(connectingCurvePath);
	connectingCurve.attr({"stroke" : "#777", "stroke-width" : "1", "opacity" : 0.7});
	
};

function drawBubbleMasks(){
	for(var i = 0; i < VIEWJS.visibleMapBubbles.length; i++){
		
		var currentBubble = new MapBubble(null,i);
		
		var maskX = currentBubble.x;
		var maskY = currentBubble.y;
		var maskWidth = currentBubble.width;
		var maskHeight = currentBubble.height +1;
		var circleHeight = maskHeight - VIEWJS.bottomMaskHeight;
		
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

function OverlayView(){
	//initialize overlay
	this.markerCanvas = Raphael("marker",window.innerWidth,window.innerHeight);
	this.maskCanvas = Raphael("masks",window.innerWidth,window.innerHeight);
	this.connectionLineCanvas = Raphael("connectionLines",window.innerWidth,window.innerHeight);
	
	this.minimumCircleRadiusOnOverviewMap = 2;
	
	this.drawOverlayForMap = drawOverlayForMap;
	this.drawBubbleMasks = drawBubbleMasks;
	this.drawConnectionCurve = drawConnectionCurve;
	
	this.drawBubbleMarkers = drawBubbleMarkers;
	
	this.drawOverviewMarker = drawOverviewMarker;
	

};