function TimelineModel(){

};

TimelineModel.prototype.updateWithClustering = function(mainModelStartIndex, mainModelEndIndex, distanceThreshold){
	this.displayedTimeframeStart = MAINMODEL.gpsLocs[mainModelStartIndex].timestamp;
	this.displayedTimeframeEnd = MAINMODEL.gpsLocs[mainModelEndIndex].timestamp;
	
	this.displayedTimeframe = this.displayedTimeframeEnd -this.displayedTimeframeStart;
	
	
	this.displayedGpsLocs = new Array();
	for(var i = mainModelStartIndex; i <= mainModelEndIndex; i++){
		this.displayedGpsLocs.push(MAINMODEL.gpsLocs[i]);
	}
	
	this.geocoder = new google.maps.Geocoder();
		
	//this.clusters = lastElementClustering(this.displayedGpsLocs, 10);
	this.clusters = pivotClustering(this.displayedGpsLocs, distanceThreshold);
	
	/*
	//ausgabe
	for(var i = 0; i < this.clusters.length; i++){
		console.log("cluster #" + i + " ("+ this.clusters[i].gpsLocs.length +"):");
		//for(var j = 0; j < clusters[i].length; j++){
		var j = 0;
			console.log("   " + this.clusters[i].gpsLocs[j].timestamp + " - " + this.clusters[i].gpsLocs[j].lon + ", " + this.clusters[i].gpsLocs[j].lat);
		//}
	}
	*/
	
	//calculate bounds for all gps locations (needed for overview map)
	this.combinedLocationCluster = new Cluster();
	for(var i = 0; i < this.displayedGpsLocs.length; i++){
		this.combinedLocationCluster.addLoc(this.displayedGpsLocs[i], (i == this.displayedGpsLocs.length - 1) ? this.displayedGpsLocs[i] : this.displayedGpsLocs[i + 1]);
	}
	
};

TimelineModel.prototype.updateFromMainmodel = function(){
	this.displayedTimeframeStart = MAINMODEL.gpsLocs[0].timestamp;
	this.displayedTimeframeEnd = MAINMODEL.gpsLocs[MAINMODEL.gpsLocs.length - 1].timestamp;
	
	this.displayedTimeframe = this.displayedTimeframeEnd -this.displayedTimeframeStart;
	
	this.displayedGpsLocs = new Array();
	for(var i = 0; i < MAINMODEL.gpsLocs.length; i++){
		this.displayedGpsLocs.push(MAINMODEL.gpsLocs[i]);
	}
	
	this.geocoder = new google.maps.Geocoder();
	
	this.clusters = new Array();
	for(var i = 0; i < MAINMODEL.clusters.length; i++){
		this.clusters.push(MAINMODEL.clusters[i].copy());
	}
	
	
	//calculate bounds for all gps locations (needed for overview map)
	this.combinedLocationCluster = new Cluster();
	for(var i = 0; i < this.displayedGpsLocs.length; i++){
		this.combinedLocationCluster.addLoc(this.displayedGpsLocs[i], (i == this.displayedGpsLocs.length - 1) ? this.displayedGpsLocs[i] : this.displayedGpsLocs[i + 1]);
	}
	
};

TimelineModel.prototype.updateFromAbsoluteValues = function(leftTime, rightTime, distanceThreshold){	
	var hrTimeLeft = new Date(leftTime * 1000);
	var hrTimeRight = new Date(rightTime * 1000);
	
	console.log("displaying (" + leftTime + ", " + rightTime + ") (" + hrTimeLeft.toDateString() + ", " + hrTimeRight.toDateString() + ")");
	
	this.displayedTimeframeStart = leftTime;
	this.displayedTimeframeEnd = rightTime;
	
	this.displayedTimeframe = this.displayedTimeframeEnd -this.displayedTimeframeStart;
	
	this.displayedGpsLocs = new Array();
	for(var i = 0; i < MAINMODEL.gpsLocs.length; i++){
		var currentGpsLoc = MAINMODEL.gpsLocs[i];
		if(currentGpsLoc.timestamp >= leftTime && currentGpsLoc.timestamp <= rightTime){
			this.displayedGpsLocs.push(currentGpsLoc);
		}
	}

	this.clusters = new Array();
	for(var i = 0; i < MAINMODEL.clusters.length; i++){
		var currentCluster = MAINMODEL.clusters[i].copy();
		currentCluster.updateClusterLimits(this.displayedTimeframeStart, this.displayedTimeframeEnd);
		if(currentCluster.id == "empty"){
			//cluster is outside
		} else {
			this.clusters.push(currentCluster);
		}
	}
	//this.clusters = pivotClustering(this.displayedGpsLocs, distanceThreshold);
	
	//calculate bounds for all gps locations (needed for overview map)
	//BUT: if we look at only a section of the full gpslocs ignore the last one
	this.combinedLocationCluster = new Cluster();
	for(var i = 0; i < this.displayedGpsLocs.length; i++){
		if(i == (this.displayedGpsLocs.length - 1) && (MAINMODEL.timeframeEnd != this.displayedTimeframeEnd)){
			//ignore this one - it's not actually there
		} else {
			this.combinedLocationCluster.addLoc(this.displayedGpsLocs[i], (i == this.displayedGpsLocs.length - 1) ? this.displayedGpsLocs[i] : this.displayedGpsLocs[i + 1]);
		}
	}
};

TimelineModel.prototype.tsToGpsLocTs = function(ts){
	
	var tsOld = this.displayedGpsLocs[0].timestamp;
	
	for (var i=1; i<this.displayedGpsLocs.length;i++){
		
		var distTs = this.displayedGpsLocs[i].timestamp - tsOld;
		
		if(this.displayedGpsLocs[i].timestamp >= ts){
			if((ts-tsOld) < distTs/2){
				return tsOld; 
				
			}else{
				
				return this.displayedGpsLocs[i].timestamp; 
			}
		}
		
		tsOld = this.displayedGpsLocs[i].timestamp;
	}
};

