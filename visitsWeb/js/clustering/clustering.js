// several algorithms for clustering location data

// clusters location starting from the first point.
// - clusterlimit: Determines the distance threshold in kilometers for points within one cluster
// returns: an array of clusters (=arrays) of locations
var pivotClustering = function(locations, clusterThreshold){
	var result = new Array();
	var pivotElement = locations[0];
	var currentCluster = new Array();
	currentCluster.push(locations[0]);
	
	for(var i = 1; i < locations.length; i++){
		var currentLocation = locations[i];
		var currentDistance = haversine(pivotElement, currentLocation);
		
		if(currentDistance > clusterThreshold){
			//create a new cluster
			result.push(currentCluster);
			currentCluster = new Array();
			currentCluster.push(currentLocation);
			pivotElement = currentLocation;
		} else {
			//add the location to the current cluster
			currentCluster.push(currentLocation);
		}
	}
	result.push(currentCluster);
	
	return result;
};
