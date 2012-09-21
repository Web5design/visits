function Mainmodel(gpsLocs){
	
	this.gpsLocs = gpsLocs;
	this.timeframeStart = gpsLocs[0].timestamp;
	this.timeframeEnd = gpsLocs[gpsLocs.length-1].timestamp;
	this.timeframe = this.timeframeEnd - this.timeframeStart;
	
	
	
	//TODO: evtl lšschen!
	this.timeIntervals = new Array();
	
	this.minTimeInterval = Number.POSITIV_INFINITY;
	

	//calculate timeIntervals between measured Locations	
	for (var i=0; i<_gpsLocs.length-1; i++){
		this.timeIntervals.push(gpsLocs[i+1].timestamp - gpsLocs[i].timestamp);
	}
	
	//calculate minimal timeInterval measured
	for (var i=0; i<timeIntervals.length; i++){
		var t = timeIntervals[i];
		if(t != 0 && t<this.minTimeInterval){
			this.minTimeInterval = t;
		}
	}
}