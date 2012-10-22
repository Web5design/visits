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

var timestampToDateLong = function(timestamp){
	
	var date = ((new Date(timestamp*1000)).toDateString()).substring(0,3) +"  "+(new Date(timestamp*1000)).getDate() + "." + ((new Date(timestamp*1000)).getMonth()+1) + "." +(new Date(timestamp*1000)).getFullYear();
	
	//date = date.substr(4);
	return (date);
	
};

var timestampToDateShort = function(timestamp){
	
	var date = ((new Date(timestamp*1000)).toDateString()).substring(0,3) +"  "+(new Date(timestamp*1000)).getDate() + "." + ((new Date(timestamp*1000)).getMonth()+1) + "."; //+ (new Date(timestamp*1000)).getFullYear();
	
	//date = date.substr(4);
	return (date);
	
};


var timestampToMonth = function(timestamp){
	
	var date = (new Date(timestamp*1000)).toDateString();
	
	date = date.substr(4,4);
	return (date);
	
};


var timestampToDay = function(timestamp){
	
	var date = (new Date(timestamp*1000)).toDateString();
	
	date = date.substr(0,3);
	return (date);
	
};

var timestampToTime = function(timestamp){
	var time = (new Date(timestamp*1000)).toTimeString();
	time = time.substring(0,5); // + time.toLowerCase().substr(8);
	return (time);
};


var firstFullHourTimestamp = function(startTs){
	var firstFullHour = 0;
	
	for(var i =startTs; i<startTs+3600; i++){
		var minutes = (new Date(i*1000)).getMinutes();
		if(minutes == 0){
			firstFullHour = i;
			break;
		}
	}
	
	return firstFullHour;
};


var firstFullDayTimestamp = function(startTs){
	var firstFullDay = 0;
	
	for(var i =startTs; i<startTs+86400; i++){
		var hours = (new Date(i*1000)).getHours();
		if(hours == 0){
			firstFullDay = i;
			break;
		}
	}
	
	return firstFullDay;
};

var firstFullMonthTimestamp = function(startTs){
	var firstFullMonth = 0;
	
	for(var i =0; i<=31; i++){
		
		var ts = startTs + i*86400;
		
		var day = (new Date(ts*1000)).getDate();
		if(day == 1){
			firstFullMonth = ts;
			break;
		}
	}
	
	return firstFullMonth;
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