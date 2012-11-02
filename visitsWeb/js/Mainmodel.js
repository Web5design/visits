function Mainmodel(gpsLocs, distanceThreshold){
	
	this.gpsLocs = gpsLocs;
	this.timeframeStart = gpsLocs[0].timestamp;
	this.timeframeEnd = gpsLocs[gpsLocs.length-1].timestamp;
	this.timeframe = this.timeframeEnd - this.timeframeStart;
	
	
	this.geocodeLookup = [ {distance: 100 , type: "route" },
	                       {distance: 200 , type: "route" },
	                       {distance: 1000 , type: "neighborhood" },
	                       {distance: 2000 , type: "neighborhood" },
	                       {distance: 5000 , type: "sublocality" },
	                       {distance: 10000 , type: "sublocality" },
	                       {distance: 20000 , type: "locality" },
	                       {distance: 30000 , type: "locality" },
	                       {distance: 70000 , type: "administrative_area_level_2" },
	                       {distance: 100000 , type: "administrative_area_level_2" },
	                       {distance: 300000 , type: "administrative_area_level_1" },
	                       {distance: 600000 , type: "administrative_area_level_1" },
	                       {distance: 1000000 , type: "country" }
	                      ];
	
	/*
	this.geocodeLookup[100] = "street_address";
	this.geocodeLookup[200] = "street_address";
	this.geocodeLookup[1000] = "neighborhood";
	this.geocodeLookup[2000] = "neighborhood";
	this.geocodeLookup[5000] = "sublocality";
	this.geocodeLookup[10000] = "sublocality";
	this.geocodeLookup[20000] = "locality";
	this.geocodeLookup[30000] = "locality";
	this.geocodeLookup[70000] = "administrative_area_level_3";
	this.geocodeLookup[100000] = "administrative_area_level_2";
	this.geocodeLookup[300000] = "administrative_area_level_1";
	this.geocodeLookup[600000] = "administrative_area_level_1";
	this.geocodeLookup[1000000] = "country";
	
	*/
	
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
	
	this.clusters = pivotClustering(this.gpsLocs, distanceThreshold);
}

Mainmodel.prototype.recluster = function(distanceThreshold){
	this.clusters = pivotClustering(this.gpsLocs, distanceThreshold);
};