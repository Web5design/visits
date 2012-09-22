function Cluster(){
	this.gpsLocs = new Array();
	
	this.minLon = Number.POSITIVE_INFINITY;
	this.minLat = Number.POSITIVE_INFINITY;
	
	this.maxLon = Number.NEGATIVE_INFINITY;
	this.maxLat = Number.NEGATIVE_INFINITY;
	
	this.centerLon = 0;
	this.centerLat = 0;
	
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
		
		if(gpsLoc.lon <this.minLon){
			
			this.minLon = gpsLoc.lon;
		}
		
		if(gpsLoc.lat <this.minLat){
			
			this.minLat = gpsLoc.lat;
		}
		
		if(gpsLoc.lon > this.maxLon){
			
			this.maxLon = gpsLoc.lon;
		}
		
		if(gpsLoc.lat > this.maxLat){
			
			this.maxLat = gpsLoc.lat;
		}
		
		//calculate the cluster center
		
		var latDist = distLat(this.minLat,this.maxLat);
		var lonDist = distLon(this.minLon,this.maxLon);
		
		this.centerLat = this.minLat+latDist/2.0;
		this.centerLon = this.minLon+lonDist/2.0;
		
	};
	
}