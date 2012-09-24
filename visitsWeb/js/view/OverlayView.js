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
	overviewMarker.circle = this.canvas.circle(overviewMarker.pos.x + Number(overviewMap.x), overviewMarker.pos.y + Number(overviewMap.y), overviewMarker.radius);
	overviewMarker.circle.attr({ "fill": "#0000cc", "opacity": "0.2", "stroke": "#999" });
	
	currentBubble.overviewMarker = overviewMarker;
	
};


function drawBubbleMarkers(currentBubble){
	//draw all markers on the overlay
	for(var j = 0; j < currentBubble.cluster.gpsLocs.length; j++){
		var marker = currentBubble.cluster.gpsLocs[j];
		var markerLatLng = new google.maps.LatLng(marker.lat, marker.lon);
		var markerPosition = convertPoint(currentBubble.map, markerLatLng);
		var circleMarker = this.canvas.circle(markerPosition.x + Number(currentBubble.x), markerPosition.y + Number(currentBubble.y), 4);
		circleMarker.attr({"fill" : "#0000cc", "opacity" : 0.7, "stroke" : "#fff", "stroke-width" : "2px"});
	}	
};


function drawConnectionCurve(currentBubble,overviewMap){
	
	var curveTopX = currentBubble.x + currentBubble.width / 2;
	var curveTopY = currentBubble.y + currentBubble.width;
	var curveBottomX = currentBubble.overviewMarker.pos.x + Number(overviewMap.x);
	var curveBottomY = currentBubble.overviewMarker.pos.y + Number(overviewMap.y) - currentBubble.overviewMarker.radius;
	
	var connectingCurvePath = "M" + curveTopX + "," + curveTopY + " ";
	connectingCurvePath = connectingCurvePath + "Q" + curveTopX + "," + (curveBottomY - (curveBottomY - curveTopY)/2.0) + " ";
	connectingCurvePath = connectingCurvePath + "" + curveBottomX + "," + curveBottomY;
	var connectingCurve = this.canvas.path(connectingCurvePath);
	connectingCurve.attr({"stroke" : "#777", "stroke-width" : "1", "opacity" : 0.7});
	
};

function drawBubbleMasks(){
	for(var i = 0; i < VIEWJS.visibleMapBubbles.length; i++){
		/*var mapcontainerElement = $("#map_container" + i);
		var posX = mapcontainerElement.css("left");	//can't use jQuery's offset(), b/c element isn't visible (display:none) 
		posX = Number(posX.substring(0, posX.length - 2));
		var posY = mapcontainerElement.css("top");
		posY = Number(posY.substring(0, posY.length - 2));
		var radius = Number(mapcontainerElement.width() / 2);
		var width = Number(mapcontainerElement.width());
		var actualheight = Number(mapcontainerElement.height()) + 1;
		var height = actualheight - VIEWJS.bottomMaskHeight;
		console.log("drawing mask circle for map #" + i + " at (" + posX + ", " + posY + ")");*/
		
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
		
		var polyMask = this.canvas.path(polygonString);
		polyMask.attr({"fill" : "#fff", "stroke-width" : "0px"});
		
		var borderCircle = this.canvas.circle((maskX + maskWidth / 2), (maskY + circleHeight / 2), maskWidth / 2);
		borderCircle.attr({"stroke" : "#aaa"});
	}
};

function OverlayView(){
	//initialize overlay
	this.canvas = Raphael(0,0,window.innerWidth,window.innerHeight);
	
	this.minimumCircleRadiusOnOverviewMap = 5;
	
	this.drawOverlayForMap = drawOverlayForMap;
	this.drawBubbleMasks = drawBubbleMasks;
	this.drawConnectionCurve = drawConnectionCurve;
	
	this.drawBubbleMarkers = drawBubbleMarkers;
	
	this.drawOverviewMarker = drawOverviewMarker;
	

};