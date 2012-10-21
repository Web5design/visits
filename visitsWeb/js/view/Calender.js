function Calender(){

	this.canvas = Raphael("calender",window.innerWidth,window.innerHeight);
	
	
	this.drawStartAndEndLabels = drawStartAndEndLabels;
	this.drawBGCalender = drawBGCalender;
	this.drawBGItem = drawBGItem;
	
	this.drawStartAndEndLabels();
	this.drawBGCalender();
	
};

function drawStartAndEndLabels(){
	
	var startDate = timestampToDate(TIMELINEMODEL.displayedTimeframeStart);
	var startTime = timestampToTime(TIMELINEMODEL.displayedTimeframeStart);
	
	var endDate = timestampToDate(TIMELINEMODEL.displayedTimeframeEnd);
	var endTime = timestampToTime(TIMELINEMODEL.displayedTimeframeEnd);
	
	var tlx = TIMELINEVIEW.x;
	var tly = TIMELINEVIEW.y;
	
	var tlWidth = TIMELINEVIEW.div.width();
	var tlHeight = TIMELINEVIEW.div.height();
	
	
	
	this.startLabelDate = this.canvas.text(tlx,tly/2-7,startDate);
	this.startLabelDate.attr({"text-anchor":"end", "font-size":13});
	this.startLabelTime = this.canvas.text(tlx,tly/2,startTime);
	this.startLabelTime.attr({"text-anchor":"end", "font-size":11});
	
	this.startLine = this.canvas.path("M"+tlx+" "+tly+"L"+tlx+" "+ (tlHeight/2+tly));
	this.startLine.attr({"stroke" : "#777", "stroke-width" : "1", "opacity" : 0.7});
	
	this.endLabelDate = this.canvas.text(tlx+tlWidth,tly/2-7,endDate);
	this.endLabelDate.attr({"text-anchor":"start", "font-size":13});
	this.endLabelTime = this.canvas.text(tlx+tlWidth,tly/2,endTime);
	this.endLabelTime.attr({"text-anchor":"start", "font-size":11});
	
	this.endLine = this.canvas.path("M"+(tlx+tlWidth)+" "+tly+"L"+(tlx+tlWidth)+" "+ (tlHeight/2 + tly));
	this.endLine.attr({"stroke" : "#777", "stroke-width" : "1", "opacity" : 0.7});
	
};

function drawBGItem(ts,text){
	
	 var x = TIMELINEVIEW.timeToAbsoluteX(ts);
		var tly = TIMELINEVIEW.y;
	 
	 var line = this.canvas.path("M"+x+" "+tly+"L"+x+" "+ (TIMELINEVIEW.div.height()/2 + tly));
	 line.attr({"stroke" : "#777", "stroke-width" : "1", "opacity" : 0.3});
	 
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
	
	
	/*for (var i=0;i<TIMELINEMODEL.displayedGpsLocs;i++){
		
	}*/
};

