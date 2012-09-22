function Cluster(){
	this.gpsLocs = new Array();
	
	this.clusterBounds = new google.maps.LatLngBounds();
	
	this.timeframeStart;
	this.timeframeEnd;
	
	this.timeframe;
	
	//adds a gpsLoc to this Cluster
	this.addLoc = function (gpsLoc, nextGpsLoc){
		
		this.gpsLocs.push(gpsLoc);
		
		this.timeframeStart = this.gpsLocs[0].timestamp;
		
		//this.timeframeEnd = this.gpsLocs[this.gpsLocs.length-1];
		this.timeframeEnd = nextGpsLoc.timestamp;
		
		this.timeframe = this.timeframeEnd -this.timeframeStart;
		
		this.clusterBounds = new google.maps.LatLngBounds();
		for(var i = 0; i < this.gpsLocs.length; i++){
			this.clusterBounds.extend(new google.maps.LatLng(this.gpsLocs[i].lat, this.gpsLocs[i].lon));
		}
		
		/*if(this.gpsLocs.length == 1){
			//add artificial point to enlarge bounds
			this.clusterBounds.extend(new google.maps.LatLng(gpsLoc.lat + 0.000001, gpsLoc.lon + 0.000001));
		}*/
	};
	
}