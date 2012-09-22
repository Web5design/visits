var haversine = function (gpsLoc1,gpsLoc2){
	var R = 6371.0; // earthradius in km
	var dLat = (gpsLoc2.lat-gpsLoc1.lat) * Math.PI/180;
	var dLon = (gpsLoc2.lon-gpsLoc1.lon) * Math.PI/180;
	var lat1 = gpsLoc1.lat * Math.PI/180;
	var lat2 = gpsLoc2.lat * Math.PI/180;

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	
	return d;
};

/*var distLon = function(a,b){
	
	var aPos = a+180;
	var bPos = b+180;
	
	var d = bPos- aPos;
	
	if (d > 180){
		return 360-d; 
	}else{
		return d;
	}
};

var distLat = function (a,b){
	
	var aPos = a+90;
	var bPos = b+90;
	
	var d = bPos- aPos;
	
	return d;
};*/