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


var haversineLatLng = function (northEast, southWest){
	var R = 6371.0; // earthradius in km
	var dLat = (southWest.lat()-northEast.lat()) * Math.PI/180;
	var dLon = (southWest.lng()-northEast.lng()) * Math.PI/180;
	var lat1 = northEast.lat() * Math.PI/180;
	var lat2 = southWest.lat() * Math.PI/180;

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	
	return d;
};

var calculateZoomLevel = function(ne,sw,width){
	
	var GLOBE_WIDTH = 256; // a constant in Google's map projection
	var west = sw.lng();
	var east = ne.lng();
	var north = ne.lat();
	var south = sw.lat();
	
	var angleLng = east - west;
	var angleLat = north - south;
	
	var angle = (angleLat > angleLng) ? angleLat : angleLng;
	
	if (angle < 0) {
	  angle += 360;
	}
	
	var zoom = Math.floor(Math.log(width * 360 / angle / GLOBE_WIDTH) / Math.LN2) -1;
	
	zoom = (width<150)? zoom-1 : zoom;
	zoom = (width<70)? zoom-1 : zoom;
	
	zoom = (zoom>15)? 15: zoom;
		
	return zoom;
	
};

function convertPoint(map, latLng) { 
    var topRight=map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast()); 
    var bottomLeft=map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest()); 
    var scale=Math.pow(2,map.getZoom()); 
    var worldPoint=map.getProjection().fromLatLngToPoint(latLng); 
    return new google.maps.Point((worldPoint.x-bottomLeft.x)*scale,(worldPoint.y-topRight.y)*scale); 
} 