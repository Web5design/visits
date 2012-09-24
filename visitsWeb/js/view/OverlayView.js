function drawBubblesOverlay(){
	for(var i = 0; i < VIEWJS.visibleMapBubbles.length; i++){
		var currentMapBubble = VIEWJS.visibleMapBubbles[i];
		var currentMapBubbleProjection = currentMapBubble.getProjection();
		var currentMapBubbleContainer = $("#map_container" + i);
		var currentMapBubblePosition = new google.maps.Point(currentMapBubbleContainer.css("left"), currentMapBubbleContainer.css("top"));
		
		console.log("bubble #" + i + " is drawn at (" + currentMapBubbleContainer.css("left") + ", " + currentMapBubbleContainer.css("top") + ")");
		
		//draw all markers on the overlay
		for(var j = 0; j < TIMELINEMODEL.clusters[i].gpsLocs.length; j++){
			var marker = TIMELINEMODEL.clusters[i].gpsLocs[j];
			var markerLatLng = new google.maps.LatLng(marker.lat, marker.lon);
			var markerPosition = currentMapBubbleProjection.fromLatLngToPoint(markerLatLng);
			var circleMarker = this.canvas.circle(markerPosition.x + currentMapBubblePosition.x, markerPosition.y + currentMapBubblePosition.y);
			console.log("  drawing marker #" + j + " of cluster #" + i + " at (" + circleMarker.x + ", " + circleMarker.y + ")");
		}
		
	}
};

function drawOverlayForMap(map, i){
	var currentMapBubble = map;
	var currentMapBubbleProjection = currentMapBubble.getProjection();
	var currentMapBubbleContainer = $("#map_container" + i);
	
	var currentMapBubblePositionLeft = Number(currentMapBubbleContainer.css("left").substring(0, currentMapBubbleContainer.css("left").length - 2));
	var currentMapBubblePositionTop = Number(currentMapBubbleContainer.css("top").substring(0, currentMapBubbleContainer.css("top").length - 2));
	var currentMapBubbleWidth = currentMapBubbleContainer.width();
	var currentMapBubbleHeight = currentMapBubbleContainer.height();
	
	var currentMapBubblePosition = new google.maps.Point(currentMapBubblePositionLeft, currentMapBubblePositionTop);
	
	//console.log("bubble #" + i + " is drawn at (" + currentMapBubblePositionLeft + ", " + currentMapBubblePositionTop + ")");
	
	//draw all markers on the overlay
	for(var j = 0; j < TIMELINEMODEL.clusters[i].gpsLocs.length; j++){
		var marker = TIMELINEMODEL.clusters[i].gpsLocs[j];
		var markerLatLng = new google.maps.LatLng(marker.lat, marker.lon);
		//var markerPosition = currentMapBubbleProjection.fromLatLngToPoint(markerLatLng);
		var markerPosition = convertPoint(currentMapBubble, markerLatLng);
		var circleMarker = this.canvas.circle(markerPosition.x + Number(currentMapBubblePositionLeft), markerPosition.y + Number(currentMapBubblePositionTop), 4);
		circleMarker.attr({"fill" : "#0000cc", "opacity" : 0.7, "stroke" : "#fff", "stroke-width" : "2px"});
		
		//console.log("  drawing marker #" + j + " of cluster #" + i + " for point (" + markerLatLng.lat() + ", " + markerLatLng.lng() + ") "+
		//		"at (" + (markerPosition.x + Number(currentMapBubblePositionLeft)) + ", " + (markerPosition.y + Number(currentMapBubblePositionTop)) + ")");
	}	
	
	//draw overlay circle on overview map
   	var currentCluster = TIMELINEMODEL.clusters[i];
   	//console.log("overlay for cluster #" + i + " with radius: " + overlayRadius);

   	var northeastOverviewPosition = convertPoint(VIEWJS.overviewMap, currentCluster.clusterBounds.getNorthEast());
   	var southwestOverviewPosition = convertPoint(VIEWJS.overviewMap, currentCluster.clusterBounds.getSouthWest());
   	var overlayRadius = Math.abs(northeastOverviewPosition.x - southwestOverviewPosition.x);
   	
   	//make sure the circles are large enough to be visible
   	if(overlayRadius < this.minimumCircleRadiusOnOverviewMap){
   		overlayRadius = this.minimumCircleRadiusOnOverviewMap;
   	}
   	
   	var clusterPositionInOverview = convertPoint(VIEWJS.overviewMap, currentCluster.clusterBounds.getCenter());
   	
   	var overviewElement = $("#overview");
	var overviewMapPositionLeft = Number(overviewElement.css("left").substring(0, overviewElement.css("left").length - 2));
	var overviewMapPositionTop = Number(overviewElement.css("top").substring(0, overviewElement.css("top").length - 2));

	console.log("drawing overview map circle at (" + (clusterPositionInOverview.x + Number(overviewMapPositionLeft)) + ", " + (clusterPositionInOverview.y + Number(overviewMapPositionTop)) + ") with radius " + overlayRadius);
	var overviewMapCircle = this.canvas.circle(clusterPositionInOverview.x + Number(overviewMapPositionLeft), clusterPositionInOverview.y + Number(overviewMapPositionTop), overlayRadius);
	overviewMapCircle.attr({ "fill": "#0000cc", "opacity": "0.2", "stroke": "#999" });
	
	
/*
	var connectingCurvePath = "M" + (currentMapBubblePositionLeft + currentMapBubbleWidth / 2) + "," + (currentMapBubblePositionTop + currentMapBubbleWidth);
	connectingCurvePath = connectingCurvePath + "Q" + (currentMapBubblePositionLeft + currentMapBubbleWidth / 2) + "," + (clusterPositionInOverview.y + Number(overviewMapPositionTop/2) - overlayRadius) + " ";
	connectingCurvePath = connectingCurvePath + (clusterPositionInOverview.x + Number(overviewMapPositionLeft)) + "," + (clusterPositionInOverview.y + Number(overviewMapPositionTop));
	var connectingCurve = this.canvas.path(connectingCurvePath);
	connectingCurve.attr({"stroke" : "#777", "stroke-width" : "1", "opacity" : 0.7});
	*/
	
	//draw curve connecting bubble and overview map
	
	var curveTopX =  currentMapBubblePositionLeft + currentMapBubbleWidth / 2;
	var curveTopY =  currentMapBubblePositionTop + currentMapBubbleWidth;
	
	var curveBottomX = clusterPositionInOverview.x + Number(overviewMapPositionLeft);
	var curveBottomY = clusterPositionInOverview.y + Number(overviewMapPositionTop);
	
	
	var connectingCurvePath = "M" + curveTopX + "," + curveTopY + " ";
	connectingCurvePath = connectingCurvePath + "Q" + curveTopX + "," + (curveBottomY - (curveBottomY - curveTopY)/2.0) + " ";
	connectingCurvePath = connectingCurvePath + "" + curveBottomX + "," + curveBottomY;
	var connectingCurve = this.canvas.path(connectingCurvePath);
	connectingCurve.attr({"stroke" : "#777", "stroke-width" : "1", "opacity" : 0.7});
	
	
};


function drawConnetionCurve(){
	
}

function drawMapBubbleMasks(){
	for(var i = 0; i < VIEWJS.visibleMapBubbles.length; i++){
		var mapcontainerElement = $("#map_container" + i);
		var posX = mapcontainerElement.css("left");	//can't use jQuery's offset(), b/c element isn't visible (display:none) 
		posX = Number(posX.substring(0, posX.length - 2));
		var posY = mapcontainerElement.css("top");
		posY = Number(posY.substring(0, posY.length - 2));
		var radius = Number(mapcontainerElement.width() / 2);
		var width = Number(mapcontainerElement.width());
		var actualheight = Number(mapcontainerElement.height()) + 1;
		var height = actualheight - VIEWJS.bottomMaskHeight;
		console.log("drawing mask circle for map #" + i + " at (" + posX + ", " + posY + ")");
		
		var polygonString = "M" + posX + "," + posY + "L" + (posX + width) + "," + posY;
		polygonString = polygonString + "L" + (posX + width) + "," + (posY + actualheight);
		polygonString = polygonString + "L" + posX + "," + (posY + actualheight);
		polygonString = polygonString + "L" + posX + "," + posY;
		polygonString = polygonString + "M" + posX + "," + (posY + height / 2);
		polygonString = polygonString + "A" + (width / 2) + "," + (width / 2) + " " + "0 0 0" + " " + (posX + width) + "," + (posY + height / 2);
		polygonString = polygonString + "A" + (width / 2) + "," + (width / 2) + " " + "0 0 0" + " " + (posX) + "," + (posY + height / 2);
		var polyMask = this.canvas.path(polygonString);
		polyMask.attr({"fill" : "#fff", "stroke-width" : "0px"});
		
		var borderCircle = this.canvas.circle((posX + width / 2), (posY + height / 2), width / 2);
		borderCircle.attr({"stroke" : "#aaa"});
	}
};

function OverlayView(){
	this.minimumCircleRadiusOnOverviewMap = 5;
	
	this.drawBubblesOverlay = drawBubblesOverlay;
	
	this.drawOverlayForMap = drawOverlayForMap;
	this.drawMapBubbleMasks = drawMapBubbleMasks;
	
	//initialize overlay
	this.canvas = Raphael(0,0,window.innerWidth,window.innerHeight);

};