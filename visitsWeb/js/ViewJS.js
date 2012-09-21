function ViewJS(mainmodel, timelineModel){
	this.mainmodel = mainmodel;
	this.timelineModel = timelineModel;
	
	this.drawTimeline = function(){
		var timelineDocElement = $("#timeline");
		var availableWidth = timelineDocElement.width();
		var availableHeight = timelineDocElement.height();
		var stepSize = availableWidth / this.mainmodel.gpsLocs.length;
		var horizontalPosition = 0;
		
		console.log("availableWidth: " + availableWidth + ", stepSize: " + stepSize);
		
		for(var i = 0; i < this.timelineModel.clusters.length; i++){
			var clusterWidth = this.timelineModel.clusters[i].gpsLocs.length * stepSize;
			var verticalPosition = (availableHeight / 2.0) - (clusterWidth / 2.0);
			
			timelineDocElement.append('<div class="map_countainer' + i + '" style="width:' + clusterWidth + 'px;height:' + clusterWidth + 'px;border-radius:'+clusterWidth / 2+'px;position:absolute;left:'+horizontalPosition+'px;top:'+verticalPosition+'px;background-color:grey"></div>');

			horizontalPosition = horizontalPosition + clusterWidth;
			
			console.log("adding cluster " + i + " of size " + this.timelineModel.clusters[i].gpsLocs.length + "to view with a width of " + clusterWidth);
			/*if(this.timelineModel.clusters[i].length > 5){
			}*/
			
		}
	};
}

/*<div class="map_container" style="width:280px;height:300px;">
	<div class="map_canvas" id="map_canvas" style="width:280px; height:300px;top:0px;left:0px"></div>
<img class="map_mask_circle" src="img/mask1000.png" style="top:0px;left:0px;width:280px;height:280px"></img>
<div class="map_mask_bottom" style="width:280px;height:20px;top:280px;left:0px;"></div>
<div class="map_border" style="width:280px;height:280px;top:-2px;left:-2px;border-radius:140px"></div>
</div>*/