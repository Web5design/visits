var gpsLocIdCounter = 0;

function GpsLoc(lon,lat,timestamp){
	this.lon = lon;
	this.lat = lat;
	this.timestamp = timestamp;
	this.id = gpsLocIdCounter++;
	
	this.geoCode;
}

