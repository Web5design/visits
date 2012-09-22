// several algorithms for clustering location data

// pivotClustering
// clusters locations starting from the first point (=pivot element).
// - clusterlimit: Determines the distance threshold in kilometers for points within one cluster
// returns: an array of clusters (=arrays) of locations
var pivotClustering = function(locations, clusterThreshold){
	var result = new Array();
	var pivotElement = locations[0];
	var currentCluster = new Cluster();
	
	currentCluster.addLoc(locations[0], 
			(locations.length == 1)? locations[0] : locations[1]);
	
	for(var i = 1; i < locations.length; i++){
		var currentLocation = locations[i];
		var currentDistance = haversine(pivotElement, currentLocation);
		
		if(currentDistance > clusterThreshold){
			//create a new cluster
			result.push(currentCluster);
			currentCluster = new Cluster();
			currentCluster.addLoc(currentLocation,
					(i == locations.length - 1)? currentLocation : locations[i + 1]);
			pivotElement = currentLocation;
		} else {
			//add the location to the current cluster
			currentCluster.addLoc(currentLocation,
					(i == locations.length - 1)? currentLocation : locations[i + 1]);
		}
	}
	result.push(currentCluster);
	
	return result;
};


var averagePivotClustering = function(locations, clusterThreshold){
	var result = new Array();
	var pivotElement = locations[0];
	var currentCluster = new Cluster();
	
	currentCluster.addLoc(locations[0], 
			(locations.length == 1)? locations[0] : locations[1]);
	
	for(var i = 1; i < locations.length; i++){
		var currentLocation = locations[i];
		var currentDistance = haversine(pivotElement, currentLocation);
		
		if(currentDistance > clusterThreshold){
			//create a new cluster
			result.push(currentCluster);
			currentCluster = new Cluster();
			currentCluster.addLoc(currentLocation,
					(i == locations.length - 1)? currentLocation : locations[i + 1]);
			pivotElement = currentLocation;
		} else {
			//add the location to the current cluster
			currentCluster.addLoc(currentLocation,
					(i == locations.length - 1)? currentLocation : locations[i + 1]);
			
			//change the pivot point to the average
			pivotElement = new GpsLoc(currentCluster.centerLon, currentCluster.centerLat, 0);
		}
	}
	result.push(currentCluster);
	
	return result;
};

//with cluster Datatype
var lastElementClustering = function(locations, clusterThreshold){
	
	var result = new Array();
	var pivotElement = locations[0];
	var currentCluster = new Cluster();
	currentCluster.addLoc(locations[0], 
			(locations.length == 1)? locations[0] : locations[1]);
	
	for(var i = 1; i < locations.length; i++){
		var currentLocation = locations[i];
		var currentDistance = haversine(pivotElement, currentLocation);
		
		if(currentDistance > clusterThreshold){
			//create a new cluster
			result.push(currentCluster);
			currentCluster = new Cluster();
			currentCluster.addLoc(currentLocation,
					(i == locations.length - 1)? currentLocation : locations[i + 1]);
		} else {
			//add the location to the current cluster
			currentCluster.addLoc(currentLocation,
					(i == locations.length - 1)? currentLocation : locations[i + 1]);
		}
		
		pivotElement = currentLocation;
	}
	result.push(currentCluster);
	
	return result;
};



// hierarchical clustering
// 
var hierarchicalClustering = function(locations, clusterThreshold){
	var result = new Array();
	var pivotElement = locations[0];
	var currentCluster = new Cluster();
	currentCluster.addLoc(locations[0], 
			(locations.length == 1)? locations[0] : locations[1]);
	
	for(var i = 1; i < locations.length; i++){
		var currentLocation = locations[i];
		var currentDistance = haversine(pivotElement, currentLocation);
		
		if(currentDistance > clusterThreshold){
			//create a new cluster
			result.push(currentCluster);
			currentCluster = new Cluster();
			currentCluster.addLoc(currentLocation,
					(i == locations.length - 1)? currentLocation : locations[i + 1]);
		} else {
			//add the location to the current cluster
			currentCluster.addLoc(currentLocation,
					(i == locations.length - 1)? currentLocation : locations[i + 1]);
		}
		
		pivotElement = currentLocation;
	}
	result.push(currentCluster);
	
	return result;
};

