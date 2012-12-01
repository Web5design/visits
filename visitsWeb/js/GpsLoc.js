var gpsLocIdCounter = 0;

function GpsLoc(lon,lat,timestamp){
	this.lon = lon;
	this.lat = lat;
	this.timestamp = timestamp; //in seconds
	this.id = gpsLocIdCounter++;
	
	this.geoCode;
	
	this.removed = false;
}

