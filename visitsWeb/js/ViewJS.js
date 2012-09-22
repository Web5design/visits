function ViewJS(mainmodel, timelineModel){
	this.mainmodel = mainmodel;
	this.timelineModel = timelineModel;
	
	this.drawTimeline = function(){
		var timelineDocElement = $("#timeline");
		
		var availableWidth = timelineDocElement.width();
		var availableHeight = timelineDocElement.height();
		
		var stepSize = availableWidth / this.timelineModel.displayedTimeframe;
		var horizontalPosition = 0;
		
		console.log("availableWidth: " + availableWidth + ", stepSize: " + stepSize);
		
		for(var i = 0; i < this.timelineModel.clusters.length; i++){

			var clusterWidth = Math.floor(this.timelineModel.clusters[i].timeframe * stepSize);
			var verticalPosition = (availableHeight / 2.0) - (clusterWidth / 2.0);
			
			
			
			var bottomMaskHeight = 25;
			var clusterVerticalHeight = clusterWidth + bottomMaskHeight;
			
			timelineDocElement.append('<div class="map_container" id="map_container' + i + '" style="width:' + clusterWidth + 'px;height:' + clusterVerticalHeight + 'px;left:'+horizontalPosition+'px;top:'+verticalPosition+'px;"></div>');
			
			var currentClusterContainer = $("#map_container"+i);
			
			currentClusterContainer.append('<div class="map_canvas" id="map_canvas' + i + '" style="width:' + clusterWidth + 'px;height:' + clusterVerticalHeight + 'px;"></div>');
						
			console.log("adding cluster " + i + " of size " + this.timelineModel.clusters[i].gpsLocs.length + "to view with a width of " + clusterWidth);
			
			//load the google maps
			if(clusterWidth>10){
				var currentCluster = this.timelineModel.clusters[i];
				var clusterBounds = currentCluster.clusterBounds;
				
			    var mapOptions = {
			    	      center: new google.maps.LatLng(clusterBounds.getCenter().lat(), clusterBounds.getCenter().lng()),
			    	      zoom: 5,
			    	      mapTypeId: google.maps.MapTypeId.HYBRID,
			    	      noClear: true,
			    	      zoomControl: false,
			    	      panControl: false,
			    	      rotateControl: false,
			    	      scaleControl: false,
			    	      disableDefaultUI: true

			    	    };
			    var map = new google.maps.Map(document.getElementById("map_canvas" + i),
			    	        mapOptions);
			    	    
			    map.fitBounds(clusterBounds);
			    
			    console.log("displaying map for cluster " + i + " in map_canvas: map_canvas" + i);
			    
			    //draw markers for all points from the cluster
			    var markerSize = new google.maps.Size(8,8);
			    
			    var markerImage = new google.maps.MarkerImage('img/cross.png', markerSize, new google.maps.Point(0,0), new google.maps.Point(markerSize.width / 2, markerSize.height / 2), markerSize);
			    
			    for(var j = 0; j < this.timelineModel.clusters[i].gpsLocs.length; j++){
			    	var myMarkerLocation = this.timelineModel.clusters[i].gpsLocs[j];
			        var myLatLng = new google.maps.LatLng(myMarkerLocation.lat, myMarkerLocation.lon);
			        var beachMarker = new google.maps.Marker({
			            position: myLatLng,
			            map: map,
			            icon: markerImage
			        });
			    }
			}
			
			currentClusterContainer.append('<img class="map_mask_circle" src="img/mask1000.png" style="width:' + clusterWidth + 'px;height:' + clusterWidth + 'px"></img>');
			currentClusterContainer.append('<div class="map_mask_bottom" style="top:' +clusterWidth + 'px;width:' + clusterWidth + 'px;height:' + bottomMaskHeight + 'px;"></div>');
			
			horizontalPosition = horizontalPosition + clusterWidth;

		}
	};
}

/*<div class="map_container" style="width:280px;height:300px;">
	<div class="map_canvas" id="map_canvas" style="width:280px; height:300px;top:0px;left:0px"></div>
<img class="map_mask_circle" src="img/mask1000.png" style="top:0px;left:0px;width:280px;height:280px"></img>
<div class="map_mask_bottom" style="width:280px;height:20px;top:280px;left:0px;"></div>
<div class="map_border" style="width:280px;height:280px;top:-2px;left:-2px;border-radius:140px"></div>
</div>*/