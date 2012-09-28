function addProjectionChangedListener(map, i){
	
    google.maps.event.addListener(map, 'idle', function(){

    	OVERLAYVIEW.drawMarkersAndLines(map, i);
    });
};

function drawTimeline(){
	
	loadedMaps = 0;
	maps = new Array();
	
	visibleMapBubbles = new Array();
	
	var availableWidth = this.div.width();
	var availableHeight = this.div.height();
	
	var stepSize = availableWidth / TIMELINEMODEL.displayedTimeframe;
	var horizontalPosition = 0;
	
	for(var i = 0; i < TIMELINEMODEL.clusters.length; i++){

		var clusterWidth = Math.floor(TIMELINEMODEL.clusters[i].timeframe * stepSize);
		
		var verticalPosition = (availableHeight / 2.0) - (clusterWidth / 2.0);
		
		
		var clusterHeight = clusterWidth + this.bottomMaskHeight;
		
		this.div.append('<div class="map_container" id="map_container' + i + '" style="width:' + clusterWidth + 'px;height:' + clusterHeight + 'px;left:'+horizontalPosition+'px;top:'+verticalPosition+'px;"></div>');
		
		var currentClusterContainer = $("#map_container"+i);
		
		currentClusterContainer.append('<div class="map_canvas" id="map_canvas' + i + '" style="width:' + clusterWidth + 'px;height:' + clusterHeight + 'px;"></div>');
						
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
		    
		    this.visibleMapBubbles.push(currentBubble);
		    
		    addProjectionChangedListener(map, i);		    
		    
		} else {
			var currentBubble = new MapBubble(null,i);
			this.visibleMapBubbles.push(currentBubble);
		}
		
		horizontalPosition = horizontalPosition + clusterWidth;

	}
};

function drawOverviewMap(){
	var overviewDocElement = $("#overview");
	var clusterWidth = overviewDocElement.width();
	var overallClusterBounds = MAINMODEL.combinedLocationCluster.clusterBounds;
	
    var overviewMapoptions = {
  	      center: new google.maps.LatLng(overallClusterBounds.getCenter().lat(), overallClusterBounds.getCenter().lng()),
  	      zoom: calculateZoomLevel(overallClusterBounds.getNorthEast(),overallClusterBounds.getSouthWest(),overviewDocElement.height()),
  	      mapTypeId: google.maps.MapTypeId.ROADMAP, 
  	      noClear: true,
  	      zoomControl: false,
  	      panControl: false,
  	      rotateControl: false,
  	      scaleControl: false,
  	      disableDefaultUI: true
  	    };
    
    this.overviewMap = new google.maps.Map(document.getElementById("overview"), overviewMapoptions);
    this.overviewMap.fitBounds(overallClusterBounds);
}

function TimelineView(){
	
	this.div = $("#timeline");
	this.x = Number(this.div.css("left").substring(0, this.div.css("left").length - 2));
	this.y = Number(this.div.css("top").substring(0, this.div.css("top").length - 2));
	
	this.visibleMapBubbles = new Array();
	
	this.bottomMaskHeight = 25;
	
	this.overviewMap;

	this.drawTimeline = drawTimeline;
	this.drawOverviewMap = drawOverviewMap;	
};
