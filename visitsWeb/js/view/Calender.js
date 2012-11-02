function Calender(){

	this.canvas = Raphael("calender",window.innerWidth,window.innerHeight);
	
	this.hoverLabel = null;
	
	this.drawStartAndEndLabels = drawStartAndEndLabels;
	this.drawBGCalender = drawBGCalender;
	this.drawBGItem = drawBGItem;
	
	this.drawHoverLabels = drawHoverLabels;
	this.hideHoverLabels = hideHoverLabels;
	
	this.drawInteractionArea = drawInteractionArea;
	
	this.drawTimestampMarkers = drawTimestampMarkers;
	
	//this.drawInteractionArea();
	this.drawStartAndEndLabels();
	this.drawBGCalender();
	
	this.drawTimestampMarkers();
	
	
	//this.drawHoverLabels(TIMELINEMODEL.displayedTimeframeStart + 90000, TIMELINEMODEL.displayedTimeframeEnd -100000);
	
};

function drawInteractionArea(){
	
	var tlx = TIMELINEVIEW.x;
	var tly = TIMELINEVIEW.y;
	
	var tlWidth = TIMELINEVIEW.div.width();
	var tlHeight = TIMELINEVIEW.div.height();
	
	var calendar = INTERACTION_AREA.rect(tlx,tly,tlWidth,tlHeight/2);
	calendar.attr({"fill":"#c00", "opacity":"0"});
	
	
	calendar.mousemove(function(e){
		OVERLAYVIEW.drawHoverCurve(e.pageX,e.pageY);
	});
	
	calendar.mouseout(function(e){
		OVERLAYVIEW.removeHoverline();
	});
	
}

function drawStartAndEndLabels(){
	
	var startDate = timestampToDateLong(TIMELINEMODEL.displayedTimeframeStart);
	var startTime = timestampToTime(TIMELINEMODEL.displayedTimeframeStart);
	
	var endDate = timestampToDateLong(TIMELINEMODEL.displayedTimeframeEnd);
	var endTime = timestampToTime(TIMELINEMODEL.displayedTimeframeEnd);
	
	var tlx = TIMELINEVIEW.x;
	var tly = TIMELINEVIEW.y;
	
	var tlWidth = TIMELINEVIEW.div.width();
	var tlHeight = TIMELINEVIEW.div.height();
	
	
	
	this.startLabelDate = this.canvas.text(tlx-5,tly-20,startDate);
	this.startLabelDate.attr({"text-anchor":"end", "font-size":13});
	
	this.startLabelTime = this.canvas.text(tlx-5,tly-13,startTime);
	this.startLabelTime.attr({"text-anchor":"end", "font-size":11});
	
	this.startLine = this.canvas.path("M"+tlx+" "+(tly)+"L"+tlx+" "+ (tlHeight/2+tly));
	this.startLine.attr({"stroke" : "#777", "stroke-width" : "1", "opacity" : 0.7});
	
	this.endLabelDate = this.canvas.text(tlx+tlWidth+5,tly-20,endDate);
	this.endLabelDate.attr({"text-anchor":"start", "font-size":13});
	
	this.endLabelTime = this.canvas.text(tlx+tlWidth+5,tly-13,endTime);
	this.endLabelTime.attr({"text-anchor":"start", "font-size":11});
	
	this.endLine = this.canvas.path("M"+(tlx+tlWidth)+" "+(tly)+"L"+(tlx+tlWidth)+" "+ (tlHeight/2 + tly));
	this.endLine.attr({"stroke" : "#777", "stroke-width" : "1", "opacity" : 0.7});
	
};


function drawTimestampMarkers(){
	
	var locs = TIMELINEMODEL.displayedGpsLocs;
	var tly = TIMELINEVIEW.y;
	
	for (var i=0; i<locs.length; i++){
		
		var x = TIMELINEVIEW.timeToAbsoluteX(locs[i].timestamp);
		
		var marker = this.canvas.circle(x,tly,1);
		marker.attr({"fill":"#777","opacity" : 0.7, "stroke-width" : "0"});
	}
	
	
};


function HoverLabel(cluster){
	
	this.cluster = cluster; 
	
	var startTs = cluster.timeframeStart;
	var endTs = cluster.timeframeEnd;
	
	
	var tly = TIMELINEVIEW.y;
	var tlHeight = TIMELINEVIEW.div.height();
	
	var startX = TIMELINEVIEW.timeToAbsoluteX(startTs);
	var endX = TIMELINEVIEW.timeToAbsoluteX(endTs);
	
	var startDate = timestampToDateShort(startTs);
	var startTime = timestampToTime(startTs);
	
	var endDate = timestampToDateShort(endTs);
	var endTime = timestampToTime(endTs);
	
	this.startLabelDate = CALENDER.canvas.text(startX,tly/2+4,startDate);
	this.startLabelDate.attr({"text-anchor":"end", "font-size":11, "fill": "#444"});
	
	this.startLabelTime = CALENDER.canvas.text(startX,tly/2+16,startTime);
	this.startLabelTime.attr({"text-anchor":"end", "font-size":10, "fill": "#444"});
	
	this.startLine = CALENDER.canvas.path("M"+startX+" "+(tly+4)+"L"+startX+" "+ (tlHeight/2+tly));
	this.startLine.attr({"stroke" : "#777", "stroke-width" : "1", "opacity" : 0.7});
	
	this.startCircle = CALENDER.canvas.circle(startX,tly,4);
	this.startCircle.attr({"stroke" : "#777", "stroke-width" : "1", "opacity" : 0.7});
	
	this.endLabelDate = CALENDER.canvas.text(endX,tly/2+4,endDate);
	this.endLabelDate.attr({"text-anchor":"start", "font-size":11, "fill": "#444"});
	
	this.endLabelTime = CALENDER.canvas.text(endX,tly/2+16,endTime);
	this.endLabelTime.attr({"text-anchor":"start", "font-size":10, "fill": "#444"});
	
	this.endLine = CALENDER.canvas.path("M"+endX+" "+(tly+4)+"L"+endX+" "+ (tlHeight/2 + tly));
	this.endLine.attr({"stroke" : "#777", "stroke-width" : "1", "opacity" : 0.7});
	
	this.endCircle = CALENDER.canvas.circle(endX,tly,4);
	this.endCircle.attr({"stroke" : "#777", "stroke-width" : "1", "opacity" : 0.7});
	
	this.geoCode = "";
	
	this.locLabel = CALENDER.canvas.text(startX+(endX-startX)/2,tly-40,this.geoCode);
	this.locLabel.attr({"font-size":14});
	this.locLabel.id = "locLabel";
	
	var geoCodeGpsLoc = cluster.gpsLocs[Math.floor(cluster.gpsLocs.length/2)];
	var ll = new google.maps.LatLng(geoCodeGpsLoc.lat,geoCodeGpsLoc.lon);
	
	if(geoCodeGpsLoc.geoCode != null){
		var text = geoCodeToLabel(geoCodeGpsLoc.geoCode, google.maps.GeocoderStatus.OK);
		CALENDER.canvas.getById("locLabel").attr({"text":text});
		
		console.log("found cached geocode: " + geoCodeGpsLoc.geoCode);
	} else {
		TIMELINEMODEL.geocoder.geocode({'latLng': ll}, 
			function(cluster){
				return function(results, status){
					var text = geoCodeToLabel(results, status);
			    	  CALENDER.canvas.getById("locLabel").attr({"text":text});
			    	  cluster.geoCode = results;
				};
				
		}(geoCodeGpsLoc));
	}
};

function geoCodeToLabel(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
  	  
  	  var text;
  	  
  	  var slidervalue = DISTANCESLIDER.getCurrentValue();
  	  
  	  for(var i=0; i<MAINMODEL.geocodeLookup.length; i++){
  		  if(MAINMODEL.geocodeLookup[i].distance >= slidervalue){
  			  for(var j= 0; j< results[0].address_components.length;j++){
  				  
  				  if(MAINMODEL.geocodeLookup[i].type == results[0].address_components[j].types[0]){
  					  text = results[0].address_components[j].long_name; 
  					  
  					  //break out of outer loop
  					  i = MAINMODEL.geocodeLookup.length;
  					  break;
  				  }
  				  
  			  }
  		  }
  	  }
  	  
  	  return text;
  	  console.log("setting geocode of cluster " + cluster + " to " + results);
  	  
    } else {
      console.log("Geocoder failed due to: " + status);
    }
};

function drawHoverLabels(cluster){
	
	this.hoverLabel = new HoverLabel(cluster);
	
}

function hideHoverLabels(){
	
	this.hoverLabel.startLabelDate.remove();
	this.hoverLabel.startLabelTime.remove();
	
	this.hoverLabel.endLabelDate.remove();
	this.hoverLabel.endLabelTime.remove();
	
	this.hoverLabel.startLine.remove();
	this.hoverLabel.startCircle.remove();
	
	this.hoverLabel.endLine.remove();
	this.hoverLabel.endCircle.remove();
	
	this.hoverLabel.locLabel.remove();
	
	this.hoverLabel = null;
	
}

function drawBGItem(ts,text){
	
	var x = TIMELINEVIEW.timeToAbsoluteX(ts);
	var tly = TIMELINEVIEW.y+20;
	/*
	 var line = this.canvas.path("M"+x+" "+tly+"L"+x+" "+ (TIMELINEVIEW.div.height()/2 + tly));
	 line.attr({"stroke" : "#777", "stroke-width" : "1", "opacity" : 0.3});
	 */
	 
	var label = this.canvas.text(x,tly/2-2,text);
	label.attr({"fill" : "#777", "opacity" : 0.3});
	
};


function drawBGCalender(){
	
	//tf in secs
	var tf = TIMELINEMODEL.displayedTimeframe;
	
	var startTs = TIMELINEMODEL.displayedTimeframeStart;
	var endTs = TIMELINEMODEL.displayedTimeframeEnd;
	
	//tf less than one day -> show hours
	if (tf<=86400){
		
		var firstFullHour = firstFullHourTimestamp(startTs);
		
		for (var i=firstFullHour; i< endTs; i+=3600){
			this.drawBGItem(i,timestampToTime(i));
		}
		
	}
	//tf less than a month -> show days
	else if(tf<=2678400){
		var firstFullDay = firstFullDayTimestamp(startTs);
		
		for (var i=firstFullDay; i< endTs; i+=86400){
			this.drawBGItem(i,timestampToDay(i));
		}
	}
	//tf more than a month -> show months
	else {
		var firstFullMonth = firstFullMonthTimestamp(startTs);
		
		for (var i=firstFullMonth; i< endTs; i+=2419200){
			for (var j=i; j< (i+ 86400*4); j+=86400){
				//if the day is the first of the month
				i=j;
				if((new Date(j*1000)).getDate() == 1){				
					this.drawBGItem(j,timestampToMonth(j));
					break;
				}
			}
		}
	}
};

