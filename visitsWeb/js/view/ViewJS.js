function addProjectionChangedListener(map, i){
    google.maps.event.addListener(map, 'idle', function(){
    	//console.log("finished loading map " + special);
    	OVERLAYVIEW.drawOverlayForMap(map, i);
    	
    	/*VIEWJS.mapsStillLoading.splice(i, 1);
    	console.log("still " + VIEWJS.mapsStillLoading.length + " maps to load");*/
    });
};

function drawTimeline(){
	
	loadedMaps = 0;
	maps = new Array();
	
	var timelineDocElement = $("#timeline");
	
	var availableWidth = timelineDocElement.width();
	var availableHeight = timelineDocElement.height();
	
	var stepSize = availableWidth / TIMELINEMODEL.displayedTimeframe;
	var horizontalPosition = 0;
	
	console.log("availableWidth: " + availableWidth + ", stepSize: " + stepSize);
	
	for(var i = 0; i < TIMELINEMODEL.clusters.length; i++){

		var clusterWidth = Math.floor(TIMELINEMODEL.clusters[i].timeframe * stepSize);
		
		var verticalPosition = (availableHeight / 2.0) - (clusterWidth / 2.0);
		
		
		var clusterVerticalHeight = clusterWidth + this.bottomMaskHeight;
		
		timelineDocElement.append('<div class="map_container" id="map_container' + i + '" style="width:' + clusterWidth + 'px;height:' + clusterVerticalHeight + 'px;left:'+horizontalPosition+'px;top:'+verticalPosition+'px;"></div>');
		
		var currentClusterContainer = $("#map_container"+i);
		
		currentClusterContainer.append('<div class="map_canvas" id="map_canvas' + i + '" style="width:' + clusterWidth + 'px;height:' + clusterVerticalHeight + 'px;"></div>');
					
		console.log("adding cluster " + i + " of size " + TIMELINEMODEL.clusters[i].gpsLocs.length + " to view with a width of " + clusterWidth);
		
		//load the google maps
		if(clusterWidth>10){
			var currentCluster = TIMELINEMODEL.clusters[i];
			var clusterBounds = currentCluster.clusterBounds;
			var maxDistance = haversineLatLng(clusterBounds.getNorthEast(),clusterBounds.getSouthWest());
			
		    var mapOptions = {
		    	      center: new google.maps.LatLng(clusterBounds.getCenter().lat(), clusterBounds.getCenter().lng()),
		    	     // zoom: calculateZoomLevel(maxDistance,clusterWidth),
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
		    
		    
		    this.visibleMapBubbles.push(map);
		    
		    addProjectionChangedListener(map, i);		    
		    
		    //draw markers for all points from the cluster
		    /*var markerSize = new google.maps.Size(8,8);
		    
		    var markerImage = new google.maps.MarkerImage('img/marker.png', markerSize, new google.maps.Point(0,0), new google.maps.Point(markerSize.width / 2, markerSize.height / 2), markerSize);
		    
		    for(var j = 0; j < TIMELINEMODEL.clusters[i].gpsLocs.length; j++){
		    	var myMarkerLocation = TIMELINEMODEL.clusters[i].gpsLocs[j];
		        var myLatLng = new google.maps.LatLng(myMarkerLocation.lat, myMarkerLocation.lon);
		        var beachMarker = new google.maps.Marker({
		            position: myLatLng,
		            map: map,
		            icon: markerImage
		        });
		    }*/
		} else {
			this.visibleMapBubbles.push(null);
		}
		
		//currentClusterContainer.append('<img class="map_mask_circle" src="img/mask1000.png" style="width:' + clusterWidth + 'px;height:' + clusterWidth + 'px"></img>');
		//currentClusterContainer.append('<div class="map_mask_bottom" style="top:' +clusterWidth + 'px;width:' + clusterWidth + 'px;height:' + bottomMaskHeight + 'px;"></div>');
		//currentClusterContainer.append('<div class="map_border" style="width:' +clusterWidth + 'px;height:' +clusterWidth + 'px;top:-2px;left:-2px;border-radius:' +clusterWidth + 'px"></div>');
		horizontalPosition = horizontalPosition + clusterWidth;

	}
};

function drawOverviewMap(){
	var overviewDocElement = $("#overview");
	var clusterWidth = overviewDocElement.width();
	var overallClusterBounds = MAINMODEL.combinedLocationCluster.clusterBounds;
	
    var overviewMapoptions = {
  	      center: new google.maps.LatLng(overallClusterBounds.getCenter().lat(), overallClusterBounds.getCenter().lng()),
  	     // zoom: calculateZoomLevel(maxDistance,clusterWidth),
  	      zoom: calculateZoomLevel(overallClusterBounds.getNorthEast(),overallClusterBounds.getSouthWest(),overviewDocElement.height()),
  	      mapTypeId: google.maps.MapTypeId.ROADMAP, 
  	      noClear: true,
  	      zoomControl: false,
  	      panControl: false,
  	      rotateControl: false,
  	      scaleControl: false,
  	      disableDefaultUI: true
  	    };
    
    var overviewMap = new google.maps.Map(document.getElementById("overview"), overviewMapoptions);
    
    //draw clusters on the overview map
    for(var i = 0; i < TIMELINEMODEL.clusters.length; i++){
    	var currentCluster = TIMELINEMODEL.clusters[i];
    	var overlayRadius = haversineLatLng(currentCluster.clusterBounds.getNorthEast(), currentCluster.clusterBounds.getSouthWest());
    	overlayRadius = overlayRadius * 1000;	// convert to meters
    	console.log("overlay for cluster #" + i + " with radius: " + overlayRadius);
    	
    	var overlayOptions = {
    		center: currentCluster.clusterBounds.getCenter(),
    		radius: overlayRadius,
    		map: overviewMap,
    		
    		fillColor: "#0099ff",
    		fillOpacity: 0.2,
    		strokeColor: "#000099",
    		strokeOpacity: 1.0
    	};
    	
    	var overlayCircle = new google.maps.Circle(overlayOptions);
    }
}

function ViewJS(){
	this.visibleMapBubbles = new Array();
	
	this.bottomMaskHeight = 25;

	this.drawTimeline = drawTimeline;
	this.drawOverviewMap = drawOverviewMap;	
};

/*<div class="map_container" style="width:280px;height:300px;">
	<div class="map_canvas" id="map_canvas" style="width:280px; height:300px;top:0px;left:0px"></div>
<img class="map_mask_circle" src="img/mask1000.png" style="top:0px;left:0px;width:280px;height:280px"></img>
<div class="map_mask_bottom" style="width:280px;height:20px;top:280px;left:0px;"></div>
<div class="map_border" style="width:280px;height:280px;top:-2px;left:-2px;border-radius:140px"></div>
</div>*/
