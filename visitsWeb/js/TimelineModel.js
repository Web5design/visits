function TimelineModel(){

};

TimelineModel.prototype.updateWithClustering = function(mainModelStartIndex, mainModelEndIndex, distanceThreshold){
	
	this.gpsLocs = MAINMODEL.gpsLocs;
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
};

TimelineModel.prototype.updateFromMainmodel = function(){
	this.gpsLocs = MAINMODEL.gpsLocs;
	this.displayedTimeframeStart = MAINMODEL.gpsLocs[0].timestamp;
	this.displayedTimeframeEnd = MAINMODEL.gpsLocs[MAINMODEL.gpsLocs.length - 1].timestamp;
	
	this.displayedTimeframe = this.displayedTimeframeEnd -this.displayedTimeframeStart;
	
	this.displayedGpsLocs = new Array();
	for(var i = 0; i < MAINMODEL.gpsLocs.length; i++){
		this.displayedGpsLocs.push(MAINMODEL.gpsLocs[i]);
	}
	
	this.geocoder = new google.maps.Geocoder();
		
	this.clusters = MAINMODEL.clusters;
};