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
};

function Line(sp, ep) {
	this.startPoint = sp;
	this.endPoint = ep;
};

// code from: http://forum.worldofplayers.de/forum/threads/783387-JAVA-Methode-zum-Schnittpunkt-zweier-Geraden(am-besten-Line2D-Objecte)-berechnen
/**
 * Berechnet den Schnittpunkt zweier Strecken.
 *
 * Formel von http://en.wikipedia.org/wiki/Line-line_intersection
 *
 * @param l Eine Strecke
 * @param m Eine Strecke
 * @return Der Schnittpunkt der beiden Strecken
 */
function intersectLines(l, m)
{
    // Wegen der Lesbarkeit
	var x1 = l.startPoint.x;
	var x2 = l.endPoint.x;
	var x3 = m.startPoint.x;
	var x4 = m.endPoint.x;
	var y1 = l.startPoint.y;
	var y2 = l.endPoint.y;
	var y3 = m.startPoint.y;
	var y4 = m.endPoint.y;

    // Zaehler
    var zx = (x1 * y2 - y1 * x2) - (x1 - x2) * (x3 * y4 - y3 * x4);
    var zy = (x1 * y2 - y1 * x2) - (y1 - y2) * (x3 * y4 - y3 * x4);
      
    // Nenner
    var n = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    
    // Koordinaten des Schnittpunktes
    var x = zx/n;
    var y = zy/n;

    // Vielleicht ist bei der Division duch n etwas schief gelaufen
    if (isNaN(x) || isNaN(y))
    {
    	console.log("no unique intersection point.");
    	return null;
    }
    
    // Test ob der Schnittpunkt auf den angebenen Strecken liegt oder au§erhalb.
    if
    (
        (x - x1) / (x2 - x1) > 1 ||
        (x - x3) / (x4 - x3) > 1 ||
        (y - y1) / (y2 - y1) > 1 ||
        (y - y3) / (y4 - y3) > 1
    )
    {
    	console.log("intersection point is outside of lines");
    	//return null;
    }

    return new Point(x, y);
};

function Point(x, y){
	this.x = x;
	this.y = y;
	
	this.length = function(){ return Math.sqrt(x*x+y*y); };
	this.scale = function(factor){ return new Point(x * factor, y * factor); };
	this.normalize = function(){ return new Point(x / length(), y / length()); };
	this.add = function(p){ return new Point(x + p.x, y + p.y); };
};

