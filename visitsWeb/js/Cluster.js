function Cluster(){
	this.gpsLocs = new Array();
	
	this.clusterBounds = new google.maps.LatLngBounds();
	
	this.geoCode;
	
	this.timeframeStart;
	this.timeframeEnd;
	
	//unique id of each cluster is a string consisting of start + end time
	this.id = this.timeframeStart + this.timeframeEnd;
	
	this.timeframe;
	
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
	
	/*if(this.gpsLocs.length == 1){
		//add artificial point to enlarge bounds
		this.clusterBounds.extend(new google.maps.LatLng(gpsLoc.lat + 0.000001, gpsLoc.lon + 0.000001));
	}*/
};