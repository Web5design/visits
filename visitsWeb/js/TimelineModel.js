function TimelineModel(mainmodel){
	this.mainmodel = mainmodel;
	
	this.displayedTimeframeStart = mainmodel.timeframeStart;
	this.displayedTimeframeEnd = mainmodel.timeframeEnd;
	
	this.displayedTimeframe = this.displayedTimeframeEnd -this.displayedTimeframeStart;
	
	this.displayedGpsLocs = mainmodel.gpsLocs;
	
	//this.clusters = lastElementClustering(this.displayedGpsLocs, 10);
	this.clusters = pivotClustering(this.displayedGpsLocs, 10);
	
	
	//ausgabe
	for(var i = 0; i < this.clusters.length; i++){
		console.log("cluster #" + i + " ("+ this.clusters[i].gpsLocs.length +"):");
		//for(var j = 0; j < clusters[i].length; j++){
		var j = 0;
			console.log("   " + this.clusters[i].gpsLocs[j].timestamp + " - " + this.clusters[i].gpsLocs[j].lon + ", " + this.clusters[i].gpsLocs[j].lat);
		//}
	}
	
}