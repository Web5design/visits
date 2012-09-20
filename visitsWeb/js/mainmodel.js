function mainmodel(gpsLocs){
	
	this.gpsLocs = gpsLocs;
	this.timeframeStart = gpsLocs[0].timestamp;
	this.timeframeEnd = gpsLocs[gpsLocs.length-1].timestamp;
	this.timeframe = this.timeframeEnd - this.timeframeStart;
	
}