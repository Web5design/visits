function Cluster(){
	this.gpsLocs = new Array();
	
	this.minLon = Number.POSITIVE_INFINITY;
	this.minLat = Number.POSITIVE_INFINITY;
	
	this.maxLon = Number.NEGATIVE_INFINITY;
	this.maxLat = Number.NEGATIVE_INFINITY;
	
	this.timeframeStart;
	this.timeframeEnd;
	
	this.timeframe;
	
	//adds a gpsLoc to this Cluster
	this.addLoc = function (gpsLoc, nextGpsLoc){
		
		this.gpsLocs.push(gpsLoc);
		
		this.timeframeStart = this.gpsLocs[0];
		
		//eigentlich nicht... (erster Punkt des nächsten Clusters!)
		//this.timeframeEnd = this.gpsLocs[this.gpsLocs.length-1];
		this.timeframeEnd = nextGpsLoc;
		
		this.timeframe = this.timeframeEnd -this.timeframeStart;
		
		for(i=0;i<this.gpsLocs.length; i++){
			var curLoc = this.gpsLocs[i];
			
			if(curLoc.lon <this.minLon){
				
				this.minLon = curLoc.lon;
			}
			
			if(curLoc.lat <this.minLat){
				
				this.minLat = curLoc.lat;
			}
			
			if(curLoc.lon > this.maxLon){
				
				this.maxLon = curLoc.lon;
			}
			
			if(curLoc.lat > this.maxLat){
				
				this.maxLat = curLoc.lat;
			}
			
			
		}
		
	};
	
}