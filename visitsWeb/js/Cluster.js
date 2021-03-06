function Cluster(){
	this.gpsLocs = new Array();
	
	this.clusterBounds = new google.maps.LatLngBounds();
	

	this.geoCode;
	

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

/**
 * 
 * @returns a copy of the current cluster
 */
Cluster.prototype.copy = function(){
	var newCluster = new Cluster();
	
	for(var i = 0; i < this.gpsLocs.length; i++){
		newCluster.gpsLocs.push(this.gpsLocs[i]);
	}
	newCluster.timeframeStart = this.timeframeStart;
	newCluster.timeframeEnd = this.timeframeEnd;
	newCluster.timeframe = this.timeframe;
	newCluster.clusterBounds = new google.maps.LatLngBounds(this.clusterBounds.getSouthWest(), this.clusterBounds.getNorthEast());
	newCluster.id = this.id;
	
	return newCluster;
};

/**
 * 
 * @param timeframeStart
 * @param timeframeEnd
 */
Cluster.prototype.updateClusterLimits = function(timeframeStart, timeframeEnd){
	var newGpsLocs = new Array();
	
	//remove all gpsLocs outside of the new limits
	for(var i = 0; i < this.gpsLocs.length; i++){
		var currentGpsLoc = this.gpsLocs[i];
		
		if(currentGpsLoc.timestamp >= timeframeStart && currentGpsLoc.timestamp <= timeframeEnd){
			newGpsLocs.push(currentGpsLoc);
		}
	}
	
	this.gpsLocs = newGpsLocs;
	
	var isIntersecting = (this.timeframeEnd > timeframeStart);
	
	if(this.gpsLocs.length > 0){
		//sort by timestamp
		this.gpsLocs.sort(function(a,b){ return a.timestamp - b.timestamp; });
		
		//update the cluster bounds
		this.clusterBounds = new google.maps.LatLngBounds();
		for(var i = 0; i < this.gpsLocs.length; i++){
			var gpsLoc = this.gpsLocs[i];
			this.clusterBounds.extend(new google.maps.LatLng(gpsLoc.lat, gpsLoc.lon));
		}
		
		this.timeframeStart = (this.timeframeStart > timeframeStart ? this.timeframeStart : timeframeStart);
		//this.timeframeStart = this.gpsLocs[0].timestamp;
		this.timeframeEnd = (this.timeframeEnd < timeframeEnd ? this.timeframeEnd : timeframeEnd);
		//this.timeframeEnd = this.gpsLocs[this.gpsLocs.length - 1].timestamp;
		this.timeframe = this.timeframeEnd - this.timeframeStart;
		
		this.id = this.timeframeStart + " " + this.timeframeEnd;
	} else {
		if(isIntersecting){
			this.timeframeStart = timeframeStart;
			this.timeframe = this.timeframeEnd - this.timeframeStart;
			this.id = this.timeframeStart + " " + this.timeframeEnd;
		} else {
			//cluster is empty now
			this.clusterBounds = undefined;
			this.timeframeStart = undefined;
			this.timeframeEnd = undefined;
			this.timeframe = undefined;
			this.id = "empty";
		}
	}
};

/**
 * @param timestamp - timestamp in seconds since the epoch
 * @returns timestamp is within cluster limits
 */
Cluster.prototype.isInside = function(timestamp){
	return (timestamp >= this.timeframeStart && timestamp <= this.timeframeEnd);
};

/**
 * 
 * @param start - left region border
 * @param end - right region border
 * 
 * @returns 0   - the cluster is outside of the region
 * 			0.1 - the cluster is intersecting with both of the region borders
 * 			0.25 - the cluster is intersecting with the left region border
 * 			0.5 - the cluster is intersecting with the right region border
 * 			1   - the cluster is within the region
 *
 */
Cluster.prototype.isWithinRegion = function(start, end){
	if(this.timeframeStart >= start && this.timeframeEnd <= end){
		return 1;
	} else if((this.timeframeStart < start && this.timeframeEnd < start) || (this.timeframeStart > end && this.timeframeEnd > end)){
		return 0;
	} else if((this.timeframeStart < start && this.timeframeEnd > start) && (this.timeframeStart < end && this.timeframeEnd > end)){
		return 0.1;
	} else if(this.timeframeStart < start && this.timeframeEnd <= end){
		return 0.25;
	} else {
		return 0.5;
	}
};