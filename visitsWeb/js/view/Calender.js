function Calender(){
	
	

	this.canvas = Raphael("calender",window.innerWidth,window.innerHeight);
	
	
	this.drawStartAndEndLabels = drawStartAndEndLabels;
	
	this.drawStartAndEndLabels();
	
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

