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

			var clusterWidth = this.timelineModel.clusters[i].timeframe * stepSize;
			var verticalPosition = (availableHeight / 2.0) - (clusterWidth / 2.0);
			var bottomMaskHeight = 20;
			var clusterVerticalHeight = clusterWidth + bottomMaskHeight;
			
			timelineDocElement.append('<div class="map_countainer" style="width:' + clusterWidth + 'px;height:' + clusterVerticalHeight + 'px;border-radius:'+clusterWidth / 2+'px;position:absolute;left:'+horizontalPosition+'px;top:'+verticalPosition+'px;background-color:#eeeeee">');
			timelineDocElement.append('<div id="map_canvas' + i + '" style="width:' + clusterWidth + 'px;height:' + clusterVerticalHeight + 'px;position:absolute;position:absolute;left:'+horizontalPosition+'px;top:'+ verticalPosition+'px;"></div>');
						
			console.log("adding cluster " + i + " of size " + this.timelineModel.clusters[i].gpsLocs.length + "to view with a width of " + clusterWidth);
			
			//load the google maps
			if(clusterWidth>10){
				var currentCluster = this.timelineModel.clusters[i];
				/*var clusterBounds = new google.maps.LatLngBounds(new google.maps.LatLng(currentCluster.minLon, currentCluster.maxLat),
						new google.maps.LatLng(currentCluster.maxLon, currentCluster.minLat));*/
				var clusterBounds = new google.maps.LatLngBounds(new google.maps.LatLng(currentCluster.maxLat, currentCluster.minLon),
						new google.maps.LatLng(currentCluster.minLat, currentCluster.maxLon));
				/*for(var j = 0; j < this.timelineModel.clusters[i].gpsLocs.length; j++){
					var currentPoint = new google.maps.LatLng(this.timelineModel.clusters[i].gpsLocs[j].lat, this.timelineModel.clusters[i].gpsLocs[j].lon);
					clusterBounds.extend(currentPoint);
				}*/
				
			    var mapOptions = {
			    	      center: new google.maps.LatLng(clusterBounds.getCenter().lat(), clusterBounds.getCenter().lng()),
			    	      zoom: 1,
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
			    	    
			    map.panToBounds(clusterBounds);
			    map.fitBounds(clusterBounds);
			    map.setCenter(clusterBounds.getCenter());
			    
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
			
			timelineDocElement.append('<img class="map_mask_circle" src="img/mask1000.png" style="position:absolute;left:'+horizontalPosition+'px;top:'+verticalPosition+'px;width:' + clusterWidth + 'px;height:' + clusterWidth + 'px"></img>');
			timelineDocElement.append('<div class="map_mask_bottom" style="position:absolute;top:' + (verticalPosition + clusterWidth) + 'px;left:'+ horizontalPosition +'px;width:' + clusterWidth + 'px;height:' + bottomMaskHeight + 'px;background-color:white"></div>');
			timelineDocElement.append('</div>');
			
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