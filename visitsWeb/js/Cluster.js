function Cluster(){
	this.gpsLocs = new Array();
	
	this.clusterBounds = new google.maps.LatLngBounds();
	
	this.timeframeStart = undefined;
	this.timeframeEnd = undefined;
	
	//unique id of each cluster is a string consisting of start + end time (initially undefined)
	this.id = undefined;
	
	this.timeframe = undefined;
	
}

/**
 * 	adds a gpsLoc to this Cluster
 */
Cluster.prototype.addLoc = function (gpsLoc, nextGpsLoc){
	
	this.gpsLocs.push(gpsLoc);
	
	this.timeframeStart = this.gpsLocs[0].timestamp;
	
	//this.timeframeEnd = this.gpsLocs[this.gpsLocs.length-1];
	this.timeframeEnd = nextGpsLoc.timestamp;
	
	this.timeframe = this.timeframeEnd -this.timeframeStart;
	
	
	this.clusterBounds.extend(new google.maps.LatLng(gpsLoc.lat, gpsLoc.lon)); 

	this.id = this.timeframeStart + " " + this.timeframeEnd;

	/*if(this.gpsLocs.length == 1){
		//add artificial point to enlarge bounds
		this.clusterBounds.extend(new google.maps.LatLng(gpsLoc.lat + 0.000001, gpsLoc.lon + 0.000001));
	}*/
};