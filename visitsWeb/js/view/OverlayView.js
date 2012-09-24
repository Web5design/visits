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
		//polygonString = polygonString + "C" + posX + "," + posY + " " + (posX + width) + "," + posY + " " + (posX + width) + "," + (posY + height / 2);
		//polygonString = polygonString + "C" + (posX + width) + "," + (posY + height) + " " + posX + "," + (posY + height) + " " + posX + "," + (posY + height / 2);
		//polygonString = polygonString + "C" + posX + "," + (posY - height * 0.25) + " " + (posX + width) + "," + (posY - height * 0.25) + " " + (posX + width) + "," + (posY + height / 2);
		//polygonString = polygonString + "C" + (posX + width) + "," + (posY + height * 1.25) + " " + posX + "," + (posY + height * 1.25) + " " + posX + "," + (posY + height / 2);
		var polyMask = this.canvas.path(polygonString);
		polyMask.attr("fill", "#fff");
		polyMask.attr("stroke-width", "0px");
		
		var borderCircle = this.canvas.circle((posX + width / 2), (posY + height / 2), width / 2);
		borderCircle.attr("stroke", "#ccc");
		//this.canvas.circle(posX + radius, posY + radius, radius);
	}
	//currentClusterContainer.append('<img class="map_mask_circle" src="img/mask1000.png" style="width:' + clusterWidth + 'px;height:' + clusterWidth + 'px"></img>');
	//currentClusterContainer.append('<div class="map_mask_bottom" style="top:' +clusterWidth + 'px;width:' + clusterWidth + 'px;height:' + bottomMaskHeight + 'px;"></div>');
	//currentClusterContainer.append('<div class="map_border" style="width:' +clusterWidth + 'px;height:' +clusterWidth + 'px;top:-2px;left:-2px;border-radius:' +clusterWidth + 'px"></div>');

};

function OverlayView(){
	this.drawBubblesOverlay = drawBubblesOverlay;
	
	this.drawOverlayForMap = drawOverlayForMap;
	this.drawMapBubbleMasks = drawMapBubbleMasks;
	
	//initialize overlay
	this.canvas = Raphael(0,0,window.innerWidth,window.innerHeight);

};