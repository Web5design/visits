
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


OverlayView.prototype.drawMarkersAndLines = function(map, currentBubble){
	
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

OverlayView.prototype.drawOverviewMarker =function(currentBubble){
	
	var overviewMarker = new Object();
	
	//draw overlay circle on overview map
	overviewMarker.ne = convertPoint(OVERVIEWMAP.map, currentBubble.cluster.clusterBounds.getNorthEast());
   	overviewMarker.sw = convertPoint(OVERVIEWMAP.map, currentBubble.cluster.clusterBounds.getSouthWest());
   	overviewMarker.radius = Math.abs(overviewMarker.ne.x - overviewMarker.sw.x);
   	
   	//make sure the circles are large enough to be visible
   	if(overviewMarker.radius < this.minimumCircleRadiusOnOverviewMap){
   		overviewMarker.radius = this.minimumCircleRadiusOnOverviewMap;
   	}
   	
   	overviewMarker.pos = convertPoint(OVERVIEWMAP.map, currentBubble.cluster.clusterBounds.getCenter());
   	
	overviewMarker.fill = this.connectionLineCanvas.circle(overviewMarker.pos.x + Number(OVERVIEWMAP.x), overviewMarker.pos.y + Number(OVERVIEWMAP.y), overviewMarker.radius);
	overviewMarker.fill.attr({ "fill": MARKERCOLOR, "opacity": "0", "stroke-width" : 0});
	
	overviewMarker.border = this.connectionLineCanvas.circle(overviewMarker.pos.x + Number(OVERVIEWMAP.x), overviewMarker.pos.y + Number(OVERVIEWMAP.y), overviewMarker.radius);
	overviewMarker.border.attr({ "stroke": "#aaa"});
	
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
	}else{
		var markerX = xInTL;
		var markerY = tlHeight/2+tly;
	}
	
	
	if(this.selectedMarker){
		this.selectedMarker.remove();
	}
	
	this.selectedMarker = this.createMarkerSet(markerX, markerY, 4);
	
	this.selectedMarker.toFront();
	
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
		
		var markerX = markerPosition.x + Number(currentBubble.x)  + Number(TIMELINEVIEW.x);
		var markerY = markerPosition.y + Number(currentBubble.y)  + Number(TIMELINEVIEW.y);
		
		var touchCircle = INTERACTION_AREA.circle(markerX, markerY, 3); //(maskY + circleHeight / 2), maskRadius);
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
	var curveTopY = currentBubble.y + currentBubble.width + Number(TIMELINEVIEW.y);
	var curveBottomX = currentBubble.overviewMarker.pos.x + Number(OVERVIEWMAP.x);
	var curveBottomY = currentBubble.overviewMarker.pos.y + Number(OVERVIEWMAP.y);
	
	var connectingCurvePath = "M" + curveTopX + "," + curveTopY + " ";
	connectingCurvePath = connectingCurvePath + "Q" + curveTopX + "," + (curveBottomY - (curveBottomY - curveTopY)/2.0) + " ";
	connectingCurvePath = connectingCurvePath + "" + curveBottomX + "," + curveBottomY;
	var connectingCurve = this.connectionLineCanvas.path(connectingCurvePath);
	connectingCurve.attr({"stroke" : "#777", "stroke-width" : "1", "opacity" : 0.7});
	
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
	
	//corner points:
	var upperLeft = {
			"x": -1,
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
			"x": -1,
			"y": Number(minBubbleY + maxBubbleHeight + 1)
	};

	var verticalMiddle = Number(upperRight.y + ((lowerRight.y - upperRight.y) / 2) - (TIMELINEVIEW.bottomMaskHeight / 2));
	
	//draw circles
	upperMaskPath = "M0," + verticalMiddle;
	lowerMaskPath = upperMaskPath;
	
	var addBubbleMousehandler = function(currentBubble, touchCircle){
		
		touchCircle.mouseover(function(){
			CALENDER.drawHoverLabels(currentBubble.cluster);
		}	
		);	
		
		touchCircle.mouseout(function(){
			CALENDER.hideHoverLabels();
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
		borderCircle.attr({"stroke" : "#aaa"});
		
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

OverlayView.prototype.updateBorderCircles = function(postAnimationCallback){
	//remove the masks
	this.upperMask.remove();
	this.lowerMask.remove();
	
	for(var i = 0; i < this.borderCircles.length; i++){
		var currentCluster = this.borderCircles[i].mapBubble.cluster;
		currentCluster.updateClusterLimits(TIMELINEMODEL.displayedTimeframeStart, TIMELINEMODEL.displayedTimeframeEnd);
	}
	
	var foundFirstCluster = false;
	var leftSplitOffset = 0;
	var rightSplitOffset = 0;
	for(var i = 0; i < this.borderCircles.length; i++){
		var currentCluster = this.borderCircles[i].mapBubble.cluster;
		var lastCluster = currentCluster.lastCluster;
		
		if(currentCluster.id != "empty"){
			if(currentCluster.timeframeStart != lastCluster.timeframeStart || currentCluster.timeframeEnd != lastCluster.timeframeEnd){
				//current cluster was split
				var leftx = TIMELINEVIEW.timeToRelativeX(currentCluster.timeframeStart);
				var rightx = TIMELINEVIEW.timeToRelativeX(currentCluster.timeframeEnd);
				var width = rightx - leftx;
				var oldleftx = TIMELINEVIEW.timeToRelativeX(lastCluster.timeframeStart);
				var oldrightx = TIMELINEVIEW.timeToRelativeX(lastCluster.timeframeEnd);
				var oldwidth = oldrightx - oldleftx;
				//determine if left or right
				if(currentCluster.timeframeStart > lastCluster.timeframeStart){
					//left split
					leftSplitOffset = (oldwidth - width);
				} else if(currentCluster.timeframeEnd < lastCluster.timeframeEnd){
					//right split
					rightSplitOffset = (oldwidth - width);
				}
			}
		}
	}
	
	for(var i = 0; i < this.borderCircles.length; i++){
		var currentMapBubble = this.borderCircles[i].mapBubble;
		var currentCluster = currentMapBubble.cluster;
		var currentRaphaelBubble = this.borderCircles[i].raphaelObj;

		var leftx = TIMELINEVIEW.timeToRelativeX(currentCluster.timeframeStart);
		var rightx = TIMELINEVIEW.timeToRelativeX(currentCluster.timeframeEnd);
		var middlex = leftx + ((rightx - leftx) / 2);

		if(currentCluster.id == "empty"){
			//use last coordinate values (before everything turned to zeroes)
			leftx = TIMELINEVIEW.timeToRelativeX(currentCluster.lastCluster.timeframeStart);
			rightx = TIMELINEVIEW.timeToRelativeX(currentCluster.lastCluster.timeframeEnd);
			middlex = leftx + ((rightx - leftx) / 2) + leftSplitOffset - rightSplitOffset;
			var clusterWidth = rightx - leftx;

			//make the bubble disappear: animate to zero radius, then remove
			currentRaphaelBubble.animate({
				"cx" : middlex,
				"r" : (clusterWidth / 2)
			}, BORDERCIRCLE_ANIMATION_DURATION, "<>",  (i == 0 ? postAnimationCallback : (function(removeBubble){ 
					return function(){ removeBubble.remove(); };
			})(currentRaphaelBubble)));
		} else {
			//if first cluster: use timelinemodel's left border instead
			if(!foundFirstCluster){
				leftx = TIMELINEVIEW.timeToRelativeX(TIMELINEMODEL.displayedTimeframeStart);
				foundFirstCluster = true;
			}
			//if last cluster: use timelinemodel's right border instead
			if(i == this.borderCircles.length - 1){
				rightx = TIMELINEVIEW.timeToRelativeX(TIMELINEMODEL.displayedTimeframeEnd);
			}
			var middlex = leftx + ((rightx - leftx) / 2);
			var clusterWidth = rightx - leftx;

			currentRaphaelBubble.animate({
				"cx" : middlex,
				"r" : (clusterWidth / 2)
			}, BORDERCIRCLE_ANIMATION_DURATION, "<>", (i == 0 ? postAnimationCallback : function(){}));
		}
	}
};

OverlayView.prototype.hideMarkers = function (){
	this.markerCanvas.clear();
	
};
