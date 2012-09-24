function drawBubblesOverlay(){
	for(var i = 0; i < this.viewJs.visibleMapBubbles.length; i++){
		var currentMapBubble = this.viewJs.visibleMapBubbles[i];
		var currentMapBubbleProjection = currentMapBubble.getProjection();
		var currentMapBubbleContainer = $("#map_container" + i);
		var currentMapBubblePosition = new google.maps.Point(currentMapBubbleContainer.css("left"), currentMapBubbleContainer.css("top"));
		
		console.log("bubble #" + i + " is drawn at (" + currentMapBubbleContainer.css("left") + ", " + currentMapBubbleContainer.css("top") + ")");
		
		//draw all markers on the overlay
		for(var j = 0; j < this.timelineModel.clusters[i].gpsLocs.length; j++){
			var marker = this.timelineModel.clusters[i].gpsLocs[j];
			var markerLatLng = new google.maps.LatLng(marker.lat, marker.lon);
			var markerPosition = currentMapBubbleProjection.fromLatLngToPoint(markerLatLng);
			var circleMarker = this.canvas.circle(markerPosition.x + currentMapBubblePosition.x, markerPosition.y + currentMapBubblePosition.y);
			console.log("  drawing marker #" + j + " of cluster #" + i + " at (" + circleMarker.x + ", " + circleMarker.y + ")");
		}
		
	}
};



function OverlayView(mainmodel, timelineModel, viewJs){
	
	this.mainmodel = mainmodel;
	this.timelineModel = timelineModel;
	
	this.viewJs = viewJs;

	this.drawBubblesOverlay = drawBubblesOverlay;
	
	//initialize overlay
	this.canvas = Raphael(0,0,window.innerWidth,window.innerHeight);

};