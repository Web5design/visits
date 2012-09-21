// several algorithms for clustering location data

// pivotClustering
// clusters locations starting from the first point (=pivot element).
// - clusterlimit: Determines the distance threshold in kilometers for points within one cluster
// returns: an array of clusters (=arrays) of locations
var pivotClustering = function(locations, clusterThreshold){
	var result = new Array();
	var pivotElement = locations[0];
	var currentCluster = new Cluster();
	currentCluster.addLoc(locations[0]);
	
	for(var i = 1; i < locations.length; i++){
		var currentLocation = locations[i];
		var currentDistance = haversine(pivotElement, currentLocation);
		
		if(currentDistance > clusterThreshold){
			//create a new cluster
			result.push(currentCluster);
			currentCluster = new Cluster();
			currentCluster.addLoc(currentLocation);
			pivotElement = currentLocation;
		} else {
			//add the location to the current cluster
			currentCluster.addLoc(currentLocation);
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
	currentCluster.addLoc(locations[0]);
	
	for(var i = 1; i < locations.length; i++){
		var currentLocation = locations[i];
		var currentDistance = haversine(pivotElement, currentLocation);
		
		if(currentDistance > clusterThreshold){
			//create a new cluster
			result.push(currentCluster);
			currentCluster = new Cluster();
			currentCluster.addLoc(currentLocation);
		} else {
			//add the location to the current cluster
			currentCluster.addLoc(currentLocation);
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
	return result;
};

