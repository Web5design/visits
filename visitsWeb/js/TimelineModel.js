function TimelineModel(mainmodel){
	this.mainmodel = mainmodel;
	
	this.displayedTimeframeStart = mainmodel.timeframeStart;
	this.displayedTimeframeEnd = mainmodel.timeframeEnd;
	
	this.displayedTimeframe = this.displayedTimeframeEnd -this.displayedTimeframeStart;
	
	this.displayedGpsLocs = mainmodel.gpsLocs;
	
	this.clusters = pivotClustering(resultGpsLoc, 50);
	
	
	//ausgabe
	for(var i = 0; i < clusters.length; i++){
		console.log("cluster #" + i + " ("+ clusters[i].length +"):");
		//for(var j = 0; j < clusters[i].length; j++){
		var j = 0;
			console.log("   " + clusters[i][j].timestamp + " - " + clusters[i][j].lon + ", " + clusters[i][j].lat);
		//}
	}
	
}