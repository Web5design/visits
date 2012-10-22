function Mainmodel(gpsLocs){
	
	this.gpsLocs = gpsLocs;
	this.timeframeStart = gpsLocs[0].timestamp;
	this.timeframeEnd = gpsLocs[gpsLocs.length-1].timestamp;
	this.timeframe = this.timeframeEnd - this.timeframeStart;
	
	//calculate bounds for all gps locations (needed for overview map)
	this.combinedLocationCluster = new Cluster();
	for(var i = 0; i < this.gpsLocs.length; i++){
		this.combinedLocationCluster.addLoc(this.gpsLocs[i], (i == this.gpsLocs.length - 1) ? this.gpsLocs[i] : this.gpsLocs[i + 1]);
	}

	this.timeIntervals = new Array();
	
	this.minTimeInterval = Number.POSITIVE_INFINITY;
	

	//calculate timeIntervals between measured Locations	
	for (var i=0; i<this.gpsLocs.length-1; i++){
		this.timeIntervals.push(this.gpsLocs[i+1].timestamp - this.gpsLocs[i].timestamp);
	}
	
	//calculate minimal timeInterval measured
	for (var i=0; i<this.timeIntervals.length; i++){
		var t = this.timeIntervals[i];
		if(t != 0 && t<this.minTimeInterval){
			this.minTimeInterval = t;
		}
	}
}