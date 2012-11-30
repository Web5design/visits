
function OverlayView(){
	//initialize overlay
	this.markerCanvas = Raphael("marker",window.innerWidth,750);
	this.maskCanvas = Raphael("masks",window.innerWidth,750);
	this.connectionLineCanvas = Raphael("connectionLines",window.innerWidth,750);
	this.previewBubblesCanvas = Raphael("previewBubbles",window.innerWidth,750);
	
	this.minimumCircleRadiusOnOverviewMap = 2;
	
	this.hoverline = undefined;
	
	this.markers = new Array();

	this.borderCircles = new Array();
	
	this.selectedMarker = undefined;

};


OverlayView.prototype.drawMarkersAndLines = function(currentBubble){
	
	//var currentBubble = TIMELINEVIEW.visibleMapBubbles[i];
		
	this.drawBubbleMarkers(currentBubble);

	this.drawOverviewMarker(currentBubble);
	
	this.drawConnectionCurve(currentBubble);

	currentBubble.div.animate({
	    opacity: 1
	  }, 3500, function() {
	    // Animation complete.
	  });
};

OverlayView.prototype.drawOverviewMarker = function(currentBubble){
	var bubbleIsEmpty = (currentBubble.map == null);
	
	var overviewMarker = new Object();
	
	//draw overlay circle on overview map
	overviewMarker.ne = convertPoint(OVERVIEWMAP.map, currentBubble.cluster.clusterBounds.getNorthEast());
   	overviewMarker.sw = convertPoint(OVERVIEWMAP.map, currentBubble.cluster.clusterBounds.getSouthWest());
   	overviewMarker.radius = Math.abs(overviewMarker.ne.x - overviewMarker.sw.x);
   	if(bubbleIsEmpty){
   		overviewMarker.radius = 2;
   	} else {
   		overviewMarker.radius = 4;
   	}
   	
   	//make sure the circles are large enough to be visible
   	if(overviewMarker.radius < this.minimumCircleRadiusOnOverviewMap){
   		overviewMarker.radius = this.minimumCircleRadiusOnOverviewMap;
   	}
   	
   	overviewMarker.pos = convertPoint(OVERVIEWMAP.map, currentBubble.cluster.clusterBounds.getCenter());
   	
	overviewMarker.fill = this.connectionLineCanvas.circle(overviewMarker.pos.x + Number(OVERVIEWMAP.x), overviewMarker.pos.y + Number(OVERVIEWMAP.y), overviewMarker.radius);
	if(bubbleIsEmpty){
		overviewMarker.fill.attr({ "fill" : MARKERCOLOR, "opacity" : 0.9, "stroke-width" : 0});
	} else {
		overviewMarker.fill.attr({ "fill": MARKERCOLOR, "opacity" : 0.9, "stroke-width" : 0});
	}
	
	overviewMarker.border = this.connectionLineCanvas.circle(overviewMarker.pos.x + Number(OVERVIEWMAP.x), overviewMarker.pos.y + Number(OVERVIEWMAP.y), overviewMarker.radius);
	if(bubbleIsEmpty){
		overviewMarker.border.attr({ "stroke": "#fff", "stroke-width" : 1, "opacity":0.9});
	} else {
		overviewMarker.border.attr({ "stroke": "#fff", "stroke-width" : 2, "opacity":0.9});
	}
	
	currentBubble.overviewMarker = overviewMarker;
	
};

OverlayView.prototype.removeHoverline = function(){
	if(this.hoverline){
		this.hoverline.remove();
		this.hoverline = undefined;
	}
	if(this.selectedMarker){
		this.selectedMarker.remove();
	}
};


OverlayView.prototype.drawHoverCurve = function(x,y){
	
	this.removeHoverline();
	
	
	var ts = TIMELINEMODEL.tsToGpsLocTs(TIMELINEVIEW.absoluteXtoTime(x));
	
	
	
	var xInTL = TIMELINEVIEW.timeToAbsoluteX(ts);
	
	
	var tly = TIMELINEVIEW.y+4;
	var tlHeight = TIMELINEVIEW.div.height();

	
	var date = timestampToDateShort(ts);
	var time = timestampToTime(ts);
	
	if (this.markers[ts]){
		
		var markerX = this.markers[ts].x;
		var markerY = this.markers[ts].y;
	}
	else{
		var markerX = xInTL - TIMELINEVIEW.x;
		var markerY = tlHeight/2;
	}
	
	
	if(this.selectedMarker){
		this.selectedMarker.remove();
	}
	
	this.selectedMarker = this.createMarkerSet(markerX, markerY, 4);
	
	this.selectedMarker.toFront();
	
	
	markerX = markerX + TIMELINEVIEW.x;
	markerY = markerY +TIMELINEVIEW.y;
	
	var controlX = xInTL + ((markerY -tly)/(y -tly))*(x-xInTL);
		
	var controlY = markerY;
	
	
	var labelDate = this.connectionLineCanvas.text(xInTL+5,tly/2+37,date);
	labelDate.attr({"font-size":11, "fill": "#444", "text-anchor":"start"});
	
	var labelTime = this.connectionLineCanvas.text(xInTL+5,tly/2+49,time);
	labelTime.attr({"font-size":10, "fill": "#444", "text-anchor":"start"});
	
	if(y-tly > 50){

		var line = this.connectionLineCanvas.path("M"+xInTL+" "+tly+" L "+x+" "+y+" Q "+controlX+" "+controlY+" "+markerX+" "+markerY);
		line.node.setAttribute("class", "hoverline");
	}else{
		var line = this.connectionLineCanvas.path("M"+xInTL+" "+tly+" Q "+xInTL+" "+markerY+" "+markerX+" "+markerY);
		line.node.setAttribute("class", "hoverline");

	}
	
	var circle = this.connectionLineCanvas.circle(xInTL,tly-4,4);
	circle.attr({"stroke" : MARKERCOLOR, "stroke-width" : "1", "opacity" : 0.7});
	
	this.hoverline = this.connectionLineCanvas.set();
	this.hoverline.push(labelDate,labelTime,line,circle);
	
	
};

OverlayView.prototype.drawBubbleMarkers =function(currentBubble){
	//draw all markers on the overlay
	for(var j = 0; j < currentBubble.cluster.gpsLocs.length; j++){
		var marker = currentBubble.cluster.gpsLocs[j];
		var markerLatLng = new google.maps.LatLng(marker.lat, marker.lon);
		var markerPosition = convertPoint(currentBubble.map, markerLatLng);
		
		var markerX = markerPosition.x + Number(currentBubble.x);
		var markerY = markerPosition.y + Number(currentBubble.y);
		
		var touchCircle = INTERACTION_AREA.circle(markerX+TIMELINEVIEW.x, markerY+TIMELINEVIEW.y, 3); //(maskY + circleHeight / 2), maskRadius);
		touchCircle.node.marker = currentBubble.cluster.gpsLocs[j];
		touchCircle.node.cluster = currentBubble.cluster;
		touchCircle.attr({"stroke" : "#aaa", "fill" : "#00c", "opacity" : 0.0});
		
		
		touchCircle.mouseover(function(e){
			
			var x = TIMELINEVIEW.timeToAbsoluteX(e.target.marker.timestamp);
			var y = TIMELINEVIEW.y+4;
						
			OVERLAYVIEW.drawHoverCurve(x,y);
			CALENDER.drawHoverLabels(e.target.cluster);
		});
		
		touchCircle.mouseout(function(e){
			
			OVERLAYVIEW.removeHoverline();
			CALENDER.hideHoverLabels();
		});
		
		
		var markerSet = this.createMarkerSet(markerX, markerY, 2);
		
		var marker = new Object();
		
		marker.set = markerSet;
		marker.x = markerX;
		marker.y = markerY;
		marker.gpsLoc = currentBubble.cluster.gpsLocs[j];
		
		this.markers[currentBubble.cluster.gpsLocs[j].timestamp] = marker;
		
	}	
};

OverlayView.prototype.createMarkerSet = function(markerX,markerY,strokewidth){
	
	var crossString  = "M" + (markerX -(strokewidth+0.25*strokewidth)) + "," + (markerY -(strokewidth+0.25*strokewidth)) + " ";
	crossString = crossString + "L" + (markerX + (strokewidth+0.25*strokewidth)) + "," + (markerY + (strokewidth+0.25*strokewidth)) + " ";
	crossString = crossString + "M" + (markerX - (strokewidth+0.25*strokewidth)) + "," + (markerY + (strokewidth+0.25*strokewidth)) + " ";
	crossString = crossString + "L" + (markerX + (strokewidth+0.25*strokewidth)) + "," + (markerY - (strokewidth+0.25*strokewidth));
	
	var crossBg = this.markerCanvas.path(crossString);
	crossBg.attr({"stroke" : "#fff", "stroke-width" : strokewidth*2 , "stroke-linecap" : "round", "opacity" : 0.7});
	
	crossString  = "M" + (markerX -strokewidth) + "," + (markerY -strokewidth) + " ";
	crossString = crossString + "L" + (markerX + strokewidth) + "," + (markerY + strokewidth) + " ";
	crossString = crossString + "M" + (markerX - strokewidth) + "," + (markerY + strokewidth) + " ";
	crossString = crossString + "L" + (markerX + strokewidth) + "," + (markerY - strokewidth);
	
	var cross = this.markerCanvas.path(crossString);
	cross.attr({"stroke" : MARKERCOLOR, "stroke-width" : strokewidth , "stroke-linecap" : "round", "opacity" : 0.9});
	
	var markerSet = this.markerCanvas.set();
	
	markerSet.push(crossBg,cross);
	
	return markerSet;
	
	
};


OverlayView.prototype.drawConnectionCurve = function(currentBubble){
	
	var curveTopX = currentBubble.x + currentBubble.width / 2  + Number(TIMELINEVIEW.x);
	
	if(currentBubble.width < TIMELINEVIEW.div.height()){
		var curveTopY = currentBubble.y + currentBubble.width + Number(TIMELINEVIEW.y);
	}else{
		var curveTopY = TIMELINEVIEW.div.height() + Number(TIMELINEVIEW.y);
		
	}
	var curveBottomX = currentBubble.overviewMarker.pos.x + Number(OVERVIEWMAP.x);
	var curveBottomY = currentBubble.overviewMarker.pos.y + Number(OVERVIEWMAP.y);
	
	var connectingCurvePath = "M" + curveTopX + "," + curveTopY + " ";
	connectingCurvePath = connectingCurvePath + "Q" + curveTopX + "," + (curveBottomY - (curveBottomY - curveTopY)/2.0) + " ";
	connectingCurvePath = connectingCurvePath + "" + curveBottomX + "," + curveBottomY;
	var connectingCurve = this.connectionLineCanvas.path(connectingCurvePath);
	connectingCurve.attr({"stroke" : "#777", "stroke-width" : "1", "opacity" : 0.7});
	
	currentBubble.connectionCurve = connectingCurve;
	
};

OverlayView.prototype.drawBubbleMasks = function(){
	this.maskCanvas.clear();
	
	this.startLine = this.maskCanvas.path("M0 0L0 "+ (TIMELINEVIEW.div.height()/2+0));
	this.startLine.attr({"stroke" : "#777", "stroke-width" : "1", "opacity" : 0.7});

	this.endLine = this.maskCanvas.path("M"+(TIMELINEVIEW.div.width() - 1)+" 0L"+(TIMELINEVIEW.div.width() - 1)+" "+ (TIMELINEVIEW.div.height()/2 + 0));
	this.endLine.attr({"stroke" : "#777", "stroke-width" : "1", "opacity" : 0.7});

	
	this.borderCircles = new Array();
	
	var upperMaskPath = "";
	var lowerMaskPath = "";
	
	var minBubbleY = Number.POSITIVE_INFINITY;
	var maxBubbleHeight = 0;
	for(var i = 0; i < TIMELINEVIEW.visibleMapBubbles.length; i++){
		var currentBubble = TIMELINEVIEW.visibleMapBubbles[i];
		if(currentBubble.y < minBubbleY){
			minBubbleY = currentBubble.y;
			maxBubbleHeight = currentBubble.height;
		}
	}
	
	//special case: if the first cluster is empty start drawing with the second cluster
	var horizontalStart = -1;
	if(TIMELINEMODEL.clusters[0].gpsLocs.length == 0){
		var secondCluster = TIMELINEMODEL.clusters[1];
		horizontalStart = TIMELINEVIEW.timeToRelativeX(secondCluster.timeframeStart) - 1;
	}
	
	//corner points:
	var upperLeft = {
			"x": horizontalStart,
			"y": Number(minBubbleY) - 1
	};
	var upperRight = {
			"x": Number(TIMELINEVIEW.div.width()) + 1,
			"y": Number(minBubbleY) - 1
	};
	var lowerRight = {
			"x": Number(TIMELINEVIEW.div.width()) + 1,
			"y": Number(minBubbleY + maxBubbleHeight + 1)
	};
	var lowerLeft = {
			"x": horizontalStart,
			"y": Number(minBubbleY + maxBubbleHeight + 1)
	};

	var verticalMiddle = Number(upperRight.y + ((lowerRight.y - upperRight.y) / 2) - (TIMELINEVIEW.bottomMaskHeight / 2));
	
	upperMaskPath = "M" + upperLeft.x + "," + verticalMiddle;
	lowerMaskPath = upperMaskPath;
	
	var addBubbleMousehandler = function(currentBubble, touchCircle){
		
		touchCircle.mouseover(function(){
			CALENDER.drawHoverLabels(currentBubble.cluster);
			if(currentBubble.connectionCurve){		
				currentBubble.connectionCurve.attr({"stroke" : MARKERCOLOR, "stroke-width" : "2", "opacity" : 0.7});
			}
				
			if(currentBubble.map == null){
				currentBubble.overviewMarker.fill.attr({"r": 4});
				currentBubble.overviewMarker.border.attr({"r": 4});
			} else {
				currentBubble.overviewMarker.fill.attr({"r": 6});
				currentBubble.overviewMarker.border.attr({"r": 6});				
			}
				currentBubble.overviewMarker.fill.toFront();
				currentBubble.overviewMarker.border.toFront();
				
				
			if(currentBubble.borderCircle){				
				currentBubble.borderCircle.node.setAttribute("class", "activeBorder");
			}
		}	
		);	
		
		touchCircle.mousemove(function(e){
			OVERLAYVIEW.drawHoverCurve(e.pageX, 0);
		}	
		);
		
		touchCircle.mouseout(function(){
			CALENDER.hideHoverLabels();
			OVERLAYVIEW.removeHoverline();
			if(currentBubble.connectionCurve){		
				currentBubble.connectionCurve.attr({"stroke" : "#777", "stroke-width" : "1", "opacity" : 0.7});
			}
				
			if(currentBubble.map == null){
				currentBubble.overviewMarker.fill.attr({"r": 2});
				currentBubble.overviewMarker.border.attr({"r": 2});
			} else {
				currentBubble.overviewMarker.fill.attr({"r": 4});
				currentBubble.overviewMarker.border.attr({"r": 4});				
			}
			if(currentBubble.borderCircle){	
				currentBubble.borderCircle.node.setAttribute("class", "borderCircle");
			}
			
		}		
		);	
	};
	
	

	for(var i = 0; i < TIMELINEVIEW.visibleMapBubbles.length; i++){
		var currentBubble = TIMELINEVIEW.visibleMapBubbles[i];
		
		var maskX = Number(currentBubble.x);
		var maskY = Number(currentBubble.y);
		var maskWidth = currentBubble.width;
		var maskRadius = Number(maskWidth / 2.0);
		var maskHeight = Number(currentBubble.height + 1);
		var circleHeight = Number(maskHeight - TIMELINEVIEW.bottomMaskHeight);
		
		//use the actual distance between the current and next bubble as radius to prevent clipping errors
		if(i < TIMELINEVIEW.visibleMapBubbles.length - 1){
			var nextBubble = TIMELINEVIEW.visibleMapBubbles[i + 1];
			maskWidth = Number(nextBubble.x) - Number(currentBubble.x);
			maskRadius = maskWidth / 2;
		}
		
		upperMaskPath = upperMaskPath + "A" + maskRadius  + "," + maskRadius + " 0 0,1 " + (maskX + maskWidth) + "," + verticalMiddle;
		lowerMaskPath = lowerMaskPath + "A" + maskRadius  + "," + maskRadius + " 0 1,0 " + (maskX + maskWidth) + "," + verticalMiddle;
		
		
		
		var borderCircle = this.maskCanvas.circle((maskX + maskRadius), verticalMiddle, maskRadius); //(maskY + circleHeight / 2), maskRadius);
		borderCircle.node.setAttribute("class", "borderCircle");
		
		currentBubble.borderCircle = borderCircle;
		
		this.borderCircles.push({
			mapBubble: currentBubble,
			raphaelObj: borderCircle
		});
		
		
		/* ========== Interactive Elements =============== */
		
		var touchCircle = INTERACTION_AREA.circle((maskX + maskRadius) + TIMELINEVIEW.x, verticalMiddle + TIMELINEVIEW.y, maskRadius); //(maskY + circleHeight / 2), maskRadius);
		touchCircle.attr({"stroke" : "#aaa", "fill" : "#c00", "opacity" : 0.0});
		
		addBubbleMousehandler(currentBubble, touchCircle);
		touchCircle.toFront();
	}
	upperMaskPath = upperMaskPath + "L" + upperRight.x + "," + upperRight.y;
	upperMaskPath = upperMaskPath + "L" + upperLeft.x + "," + upperLeft.y;
	upperMaskPath = upperMaskPath + "Z";

	lowerMaskPath = lowerMaskPath + "L" + lowerRight.x + "," + lowerRight.y;
	lowerMaskPath = lowerMaskPath + "L" + lowerLeft.x + "," + lowerLeft.y;
	lowerMaskPath = lowerMaskPath + "Z";

	this.upperMask = this.maskCanvas.path(upperMaskPath);
	this.upperMask.attr({"fill" : "#fff", "stroke-width" : "0px", "stroke" : "black"});
	this.upperMask.toBack();

	this.lowerMask = this.maskCanvas.path(lowerMaskPath);
	this.lowerMask.attr({"fill" : "#fff", "stroke-width" : "0px", "stroke" : "black"});
	this.lowerMask.toBack();


};


OverlayView.prototype.drawPreviewBubbles = function(){
	
	$("#previewBubbles").css("display","block");
	
	this.previewBubblesCanvas.clear();
	
	var availableWidth = TIMELINEVIEW.div.width();
	var availableHeight = TIMELINEVIEW.div.height();
	
	var stepSize = availableWidth / TIMELINEMODEL.displayedTimeframe;
	var horizontalPosition = 0;
	
	for(var i = 0; i < TIMELINEMODEL.clusters.length; i++){
		
		var radius = TIMELINEMODEL.clusters[i].timeframe * stepSize / 2;
		
		var verticalPosition = (availableHeight / 2.0) - (radius);
		
		var maskX = horizontalPosition + radius + TIMELINEVIEW.x;
		var maskY = verticalPosition + radius + TIMELINEVIEW.y;

		
		var borderCircle = this.previewBubblesCanvas.circle(maskX, maskY, radius);
		borderCircle.attr({"fill" : "#aaa", "stroke-width" : "0px", "opacity" : 0.2});
		
		horizontalPosition = horizontalPosition + radius * 2;
	}
	
};

/**
 * Calculates positions and radii of the (potentially) three circles of a cluster
 * @param cluster - the cluster to draw a circle for
 * @param timeframeStart - start of the currently visible timeframe
 * @param timeframeEnd - end of the current visible timefram
 * @returns {Array} of three objects (left, middle, and right circle) 
 * 					- each circle object contains attributes for cx, cy and r
 */
OverlayView.prototype.calculateCircleExtents = function(cluster, timeframeStart, timeframeEnd){
	var timeframe = timeframeEnd - timeframeStart;

	var absoluteL = cluster.timeframeStart - timeframeStart;
	var absoluteLeftpos = absoluteL * TIMELINEVIEW.div.width() / timeframe;
	var absoluteR = cluster.timeframeEnd - timeframeStart;
	var absoluteRightpos = absoluteR * TIMELINEVIEW.div.width() / timeframe;
		
	var leftCircle = {};
	var centerCircle = {};
	var rightCircle = {};
	
	var leftBorder = cluster.timeframeStart;
	var rightBorder = cluster.timeframeEnd;
	
	//check how the cluster is split:
	var splitStatus = cluster.isWithinRegion(timeframeStart, timeframeEnd);
	
	switch(splitStatus){
	case 0:
		//cluster is outside of the region - still: we have to draw it so moving into the visible region works
		var radius = (absoluteRightpos - absoluteLeftpos) / 2;
		
		centerCircle.cx = absoluteLeftpos + radius;
		centerCircle.cy = TIMELINEVIEW.div.height() / 2;
		centerCircle.r = radius;
		
		return [{"cx" : centerCircle.cx - centerCircle.r, "cy" : TIMELINEVIEW.div.height() / 2, "r" : 0}, 
		        centerCircle, 
		        {"cx" : centerCircle.cx + centerCircle.r, "cy" : TIMELINEVIEW.div.height() / 2, "r" : 0}];
		break;
	case 0.1:
		//dual intersection
		leftBorder = timeframeStart;
		rightBorder = timeframeEnd;
		break;
	case 0.25:
		//left intersection
		leftBorder = timeframeStart;
		break;
	case 0.5:
		//right intersection
		rightBorder = timeframeEnd;
		break;
	case 1:
		//borders untouched, cluster not split
		break;
	}
	
	var deltaL = leftBorder - timeframeStart;
	var leftpos = deltaL * TIMELINEVIEW.div.width() / timeframe;
	
	var deltaR = rightBorder - timeframeStart;
	var rightpos = deltaR * TIMELINEVIEW.div.width() / timeframe;
	
	var centerRadius = (rightpos - leftpos) / 2;
	
	centerCircle.cx = leftpos + centerRadius;
	centerCircle.cy = TIMELINEVIEW.div.height() / 2;
	centerCircle.r = centerRadius;
	
	//left circle
	if(splitStatus == 0.5 || splitStatus == 1){
		leftCircle.cx = centerCircle.cx - centerCircle.r;
		leftCircle.cy = TIMELINEVIEW.div.height() / 2;
		leftCircle.r = 0;
	} else {
		//intersection with left border
		var leftCircleRadius = ((centerCircle.cx - centerCircle.r) - absoluteLeftpos) / 2;
		leftCircle.cx = -leftCircleRadius;
		leftCircle.cy = TIMELINEVIEW.div.height() / 2;
		leftCircle.r = leftCircleRadius;
	}
	
	//right circle
	if(splitStatus == 0.25 || splitStatus == 1){
		rightCircle.cx = centerCircle.cx + centerCircle.r;
		rightCircle.cy = TIMELINEVIEW.div.height() / 2;
		rightCircle.r = 0;
	} else {
		//intersection with right border
		var rightCircleRadius = (absoluteRightpos - (centerCircle.cx + centerCircle.r)) / 2;
		rightCircle.cx = centerCircle.cx + centerCircle.r + rightCircleRadius;
		rightCircle.cy = TIMELINEVIEW.div.height() / 2;
		rightCircle.r = rightCircleRadius;
	}
	
	return [leftCircle, centerCircle, rightCircle];
};

/**
 * Draws all visible border circles and performs an animation to move them to their new positions
 * @param postAnimationCallback - callback function once all animations are finished
 * @param oldModelLeftLimit - left limit of the currently visible region
 * @param oldModelRightLimit - right limit of the currently visible region
 */
OverlayView.prototype.updateBorderCircles = function(postAnimationCallback, oldModelLeftLimit, oldModelRightLimit){
	//remove the masks
	this.upperMask.remove();
	this.lowerMask.remove();

	//remove all existing circles
	for(var i = 0; i < this.borderCircles.length; i++){
		this.borderCircles[i].raphaelObj.remove();
	}
	this.borderCircles = new Array();
	
	var newModelLeftLimit = TIMELINEMODEL.displayedTimeframeStart;
	var newModelRightLimit = TIMELINEMODEL.displayedTimeframeEnd;
	
	//determine the utmost extensions of the timeframe, i.e., the limits of both old and new sections combined
	var minTimestamp = Math.min(oldModelLeftLimit, newModelLeftLimit);
	var maxTimestamp = Math.max(oldModelRightLimit, newModelRightLimit);
	
	for(var i = 0; i < MAINMODEL.clusters.length; i++){
		var cluster = MAINMODEL.clusters[i];
		var generalClusterIntersection = cluster.isWithinRegion(minTimestamp, maxTimestamp);
		
		//only draw something if the circle is within the visible region somewhere
		if(generalClusterIntersection > 0){
			//calculate current and future state of the circle(s) of the cluster
			var extents = this.calculateCircleExtents(cluster, oldModelLeftLimit, oldModelRightLimit);
			var targets = this.calculateCircleExtents(cluster, newModelLeftLimit, newModelRightLimit);
			
			var leftCircleExtent = extents[0];
			var centerCircleExtent = extents[1];
			var rightCircleExtent = extents[2];

			var leftCircleTarget = targets[0];
			var centerCircleTarget = targets[1];
			var rightCircleTarget = targets[2];
			
			var centerCircle = this.maskCanvas.circle(centerCircleExtent.cx, centerCircleExtent.cy, centerCircleExtent.r);
			var leftCircle = this.maskCanvas.circle(leftCircleExtent.cx, leftCircleExtent.cy, leftCircleExtent.r);
			var rightCircle = this.maskCanvas.circle(rightCircleExtent.cx, rightCircleExtent.cy, rightCircleExtent.r);
			centerCircle.node.setAttribute("class", "borderCircle");
			leftCircle.node.setAttribute("class", "borderCircle");
			rightCircle.node.setAttribute("class", "borderCircle");
			
			centerCircle.animate({"cx" : centerCircleTarget.cx, "r" : centerCircleTarget.r }, BORDERCIRCLE_ANIMATION_DURATION, "<>");
			leftCircle.animate({"cx" : leftCircleTarget.cx, "r" :leftCircleTarget.r }, BORDERCIRCLE_ANIMATION_DURATION, "<>");
			rightCircle.animate({"cx" : rightCircleTarget.cx, "r" : rightCircleTarget.r }, BORDERCIRCLE_ANIMATION_DURATION, "<>");
		}		
	}
	
	//call the callback function once the animations are finished
	window.setTimeout(postAnimationCallback, BORDERCIRCLE_ANIMATION_DURATION);
};


OverlayView.prototype.hideMarkers = function (){
	this.markerCanvas.clear();
	
};
