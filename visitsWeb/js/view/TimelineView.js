function TimelineView(){
	
	this.div = $("#timeline");
	this.x = Number(this.div.css("left").substring(0, this.div.css("left").length - 2));
	this.y = Number(this.div.css("top").substring(0, this.div.css("top").length - 2));
	this.bottomMaskHeight = 25;
	
	this.visibleMapBubbles = new Array();
};

function addProjectionChangedListener(map, currentBubble){
    google.maps.event.addListener(map, 'tilesloaded', function(){
    	OVERLAYVIEW.drawMarkersAndLines(currentBubble);
    });
};

/**
 * Minimal event handling for empty bubbles: draw only the overview marker, no connection curves or stuff
 */
function addMinimalProjectionChangedListener(map, currentBubble){
    google.maps.event.addListener(map, 'tilesloaded', function(){
    	OVERLAYVIEW.drawOverviewMarker(currentBubble);
    });
};

TimelineView.prototype.absoluteXtoTime = function(x){
	var tlX = x - this.x;
	
	var deltaT = TIMELINEMODEL.displayedTimeframe / this.div.width();
	
	return (TIMELINEMODEL.displayedTimeframeStart + (deltaT * tlX));
	
};

TimelineView.prototype.timeToAbsoluteX = function(t){
	
	var deltaT = t-TIMELINEMODEL.displayedTimeframeStart;
	
	var tlX = deltaT * this.div.width() /  TIMELINEMODEL.displayedTimeframe;
	
	return (this.x + tlX);
	
};

TimelineView.prototype.timeToRelativeX = function(t){
	return this.timeToAbsoluteX(t) - this.x;
};

TimelineView.prototype.drawTimeline = function(){
	
	loadedMaps = 0;
	
	visibleMapBubbles = new Array();
	
	var emptyMapBubbles = new Array();
	var pivotVisibleMapBubble = undefined;
	
	var availableWidth = this.div.width();
	var availableHeight = this.div.height();
	
	var stepSize = availableWidth / TIMELINEMODEL.displayedTimeframe;
	var horizontalPosition = 0;
	
	for(var i = 0; i < TIMELINEMODEL.clusters.length; i++){

		var clusterWidth = TIMELINEMODEL.clusters[i].timeframe * stepSize;
		
		var verticalPosition = (availableHeight / 2.0) - (clusterWidth / 2.0);
		
		var clusterHeight = clusterWidth + this.bottomMaskHeight;
		
		this.div.append('<div class="map_container" id="map_container' + i + '" style="width:' + clusterWidth + 'px;height:' + clusterHeight + 'px;left:'+horizontalPosition+'px;top:'+verticalPosition+'px;"></div>');
		
		var currentClusterContainer = $("#map_container"+i);
		currentClusterContainer.append('<div class="map_canvas" id="map_canvas' + i + '" style="width:' + clusterWidth + 'px;height:' + clusterHeight + 'px;"></div>');
		
		if(TIMELINEMODEL.clusters[i].gpsLocs.length == 0){
			
		} else {
			//load the google maps
			if(clusterWidth>10){
				var currentCluster = TIMELINEMODEL.clusters[i];
				var clusterBounds = currentCluster.clusterBounds;
				var maxDistance = haversineLatLng(clusterBounds.getNorthEast(),clusterBounds.getSouthWest());
				
			    var mapOptions = {
			    	      center: new google.maps.LatLng(clusterBounds.getCenter().lat(), clusterBounds.getCenter().lng()),
			    	      zoom: calculateZoomLevel(clusterBounds.getNorthEast(),clusterBounds.getSouthWest(),clusterWidth),
			    	      mapTypeId: google.maps.MapTypeId.ROADMAP, 
			    	      noClear: true,
			    	      zoomControl: false,
			    	      panControl: false,
			    	      rotateControl: false,
			    	      scaleControl: false,
			    	      disableDefaultUI: true
			    	    };
			    var map = new google.maps.Map(document.getElementById("map_canvas" + i),
			    	        mapOptions);
			    
			    var currentBubble = new MapBubble(map,i);
			    currentBubble.x = this.timeToRelativeX(TIMELINEMODEL.clusters[i].timeframeStart);//horizontalPosition;
			    currentBubble.y = verticalPosition;
			    currentBubble.width = clusterWidth;
			    currentBubble.height = clusterHeight;
			    
			    this.visibleMapBubbles.push(currentBubble);
			    
			    addProjectionChangedListener(map, currentBubble);//i);		    
			    
			    pivotVisibleMapBubble = currentBubble;
			    
			} else {
				var currentBubble = new MapBubble(null,i);
				this.visibleMapBubbles.push(currentBubble);
				
				emptyMapBubbles.push(currentBubble);
			}
		}
		
		horizontalPosition = horizontalPosition + clusterWidth;
	}
	
	if(pivotVisibleMapBubble){
		for(var i = 0; i < emptyMapBubbles.length; i++){
			var currentMapBubble = emptyMapBubbles[i];
			addMinimalProjectionChangedListener(pivotVisibleMapBubble.map, currentMapBubble);
		}
	}
};

TimelineView.prototype.hideTimeline = function(){
	this.div.css("opacity","0.0");
};
