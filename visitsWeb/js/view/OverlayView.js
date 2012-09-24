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
	
	var currentMapBubblePositionLeft = currentMapBubbleContainer.css("left").substring(0, currentMapBubbleContainer.css("left").length - 2);
	var currentMapBubblePositionTop = currentMapBubbleContainer.css("top").substring(0, currentMapBubbleContainer.css("top").length - 2);

	var currentMapBubblePosition = new google.maps.Point(currentMapBubblePositionLeft, currentMapBubblePositionTop);
	
	console.log("bubble #" + i + " is drawn at (" + currentMapBubblePositionLeft + ", " + currentMapBubblePositionTop + ")");
	
	//draw all markers on the overlay
	for(var j = 0; j < TIMELINEMODEL.clusters[i].gpsLocs.length; j++){
		var marker = TIMELINEMODEL.clusters[i].gpsLocs[j];
		var markerLatLng = new google.maps.LatLng(marker.lat, marker.lon);
		//var markerPosition = currentMapBubbleProjection.fromLatLngToPoint(markerLatLng);
		var markerPosition = convertPoint(currentMapBubble, markerLatLng);
		var circleMarker = this.canvas.circle(markerPosition.x + Number(currentMapBubblePositionLeft), markerPosition.y + Number(currentMapBubblePositionTop), 4);
		circleMarker.attr("fill", "#0000cc");
		circleMarker.attr("opacity", 0.7);
		circleMarker.attr("stroke", "#fff");
		circleMarker.attr("stroke-width", "2px");
		console.log("  drawing marker #" + j + " of cluster #" + i + " for point (" + markerLatLng.lat() + ", " + markerLatLng.lng() + ") "+
				"at (" + (markerPosition.x + Number(currentMapBubblePositionLeft)) + ", " + (markerPosition.y + Number(currentMapBubblePositionTop)) + ")");
	}	
};


function OverlayView(){
	this.drawBubblesOverlay = drawBubblesOverlay;
	
	this.drawOverlayForMap = drawOverlayForMap;
	
	//initialize overlay
	this.canvas = Raphael(0,0,window.innerWidth,window.innerHeight);

};