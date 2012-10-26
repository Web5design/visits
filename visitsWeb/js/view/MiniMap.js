/**
 * MiniMap constructor
 * @param targetDiv - target <div> element to put the minimap into
 * @param cMapSliderStart - callback for slider started dragging
 * @param cMapSliderDragged - callback for slider was dragged
 * @param cMapSliderEnd - callback for slider ended dragging
 */
function MiniMap(targetDiv, cMapSliderStart, cMapSliderDragged, cMapSliderEnd){
	/* drawing constants */
	this.padding = 8;	// padding left and right of the minimap to leave space for the slider
	this.handleWidth  = 16;
	this.sliderHeight = 32;
	this.handleBarHeight = 12;
	
	var jQueryDiv = $("#" + targetDiv);
	
	this.targetDiv = targetDiv;
	this.cMapSliderStart = cMapSliderStart;
	this.cMapSliderDragged = cMapSliderDragged;
	this.cMapSliderEnd = cMapSliderEnd;
	
	this.width = jQueryDiv.width();
	this.height = jQueryDiv.height();
	
	this.initialize();
};

MiniMap.prototype.drawMinimap = function(){
	var availableWidth = this.width - 2 * this.padding;
	var stepSize = availableWidth / TIMELINEMODEL.displayedTimeframe;
	var horizontalPosition = this.padding;
	
	//find the cluster with the largest expansion
	var largestClusterRadius = 0;
	$.each(TIMELINEMODEL.clusters, function(index, value){ 
		var currentClusterRadius = (value.timeframe * stepSize) / 2;
		if(largestClusterRadius < currentClusterRadius) largestClusterRadius = currentClusterRadius;
	});
	this.largestClusterRadius = largestClusterRadius;
	
	for(var i = 0; i < TIMELINEMODEL.clusters.length; i++){

		var clusterWidth = TIMELINEMODEL.clusters[i].timeframe * stepSize;
		var clusterRadius = clusterWidth / 2;
		
		//for dynamic vertical positioning:
		//var verticalPosition = (this.height - this.largestClusterRadius) - clusterRadius - 1;
		
		//for static (=middle) vertical positioning:
		var verticalPosition = (this.height / 2) - clusterRadius;
		
		var currentCircle = this.canvas.circle(horizontalPosition + clusterRadius, verticalPosition + clusterRadius, clusterRadius);
		currentCircle.node.setAttribute("class", "minimapCircle active");
		
		horizontalPosition = horizontalPosition + clusterWidth;
	}
};

MiniMap.prototype.createZoomSlider = function(){
	var halfHandleWidth = this.handleWidth / 2;
	var sliderHeight = this.sliderHeight;
	//var sliderHeight = this.height - (this.largestClusterRadius * 2) - halfHandleWidth;
	var handlePath = "M0,0l" + this.handleWidth + ",0l0," + sliderHeight + "l-"+ halfHandleWidth +"," + halfHandleWidth + "l-" + halfHandleWidth + ",-" + halfHandleWidth + "z";
	
	this.leftHandleObj = this.canvas.path(handlePath);
	this.leftHandleObj.node.setAttribute("class", "minimapHandle inactive");
	this.leftHandleLine = this.canvas.path("M" + halfHandleWidth + "," + (sliderHeight + halfHandleWidth) + "l0," + (this.height / 2 - sliderHeight));
	this.leftHandleLine.node.setAttribute("class", "minimapHandleLine inactive");
	this.leftHandle = this.canvas.set();
	this.leftHandle.push(this.leftHandleObj, this.leftHandleLine);
	this.leftHandle.transform("T0,0");
	
	this.rightHandleObj = this.canvas.path(handlePath);
	this.rightHandleObj.node.setAttribute("class", "minimapHandle inactive");
	this.rightHandleLine = this.canvas.path("M" + halfHandleWidth + "," + (sliderHeight + halfHandleWidth) + "l0," + (this.height / 2 - sliderHeight));
	this.rightHandleLine.node.setAttribute("class", "minimapHandleLine inactive");
	this.rightHandle = this.canvas.set();
	this.rightHandle.push(this.rightHandleObj, this.rightHandleLine);
	this.rightHandle.transform("T" + (this.width - this.handleWidth) + ",0");
	
	this.handleBar = this.canvas.rect(this.handleWidth, 0, (this.width - 2 * this.handleWidth), this.handleBarHeight);
	this.handleBar.node.setAttribute("class", "minimapHandleBar inactive");
};

/**
 * @returns Returns the current active handle or null if none is active.
 */
MiniMap.prototype.getActiveHandle = function(){
	var leftHandleClass = this.leftHandleObj.node.getAttribute("class");
	var rightHandleClass = this.rightHandleObj.node.getAttribute("class");
	
	if(leftHandleClass.indexOf("inactive") != -1){
		this.activeHandleName = "rightHandle";
		return this.rightHandle;
	}
	if(rightHandleClass.indexOf("inactive") != -1){
		this.activeHandleName = "leftHandle";
		return this.leftHandle;
	}
	
	return null;
};

MiniMap.prototype.getInactiveHandle = function(){
	var leftHandleClass = this.leftHandleObj.node.getAttribute("class");
	var rightHandleClass = this.rightHandleObj.node.getAttribute("class");

	if(leftHandleClass.indexOf("inactive") != -1)
		return this.leftHandle;
	if(rightHandleClass.indexOf("inactive") != -1)
		return this.rightHandle;
	
	return null;
};

function sliderStarted(x, y, evt){
	this.activeSliderNode = evt.target;
	this.activeSliderNode.setAttribute("class", "minimapHandle active");
	
	var activeHandle = this.getActiveHandle();
	var currentTransform = activeHandle[0].transform();
	
	//handleTouchOffset is the offset between the mouse cursor and the slider
	this.handleTouchOffset = (x - $("#" + this.targetDiv).offset().left) - currentTransform[0][1];
	
	//callback:
	this.cMapSliderStart(this);
};

function sliderMoved(dx, dy, x, y, evt){
	var activeHandle = this.getActiveHandle();
	//mouse position relative to the minimap's <div>
	var relativePosition = x - $("#" + this.targetDiv).offset().left;
	var targetPosition = relativePosition - this.handleTouchOffset;
	
	//make sure that the target position is valid:
	if(targetPosition < 0){
		targetPosition = 0;
	}
	if(targetPosition + this.handleWidth > this.width){
		targetPosition = this.width - this.handleWidth;
	}
	
	//make sure that the two sliders don't intersect:
	var otherTranslation;
	if(this.activeHandleName == "leftHandle"){
		otherTranslation = this.rightHandle[0].transform()[0][1];
		if(targetPosition + this.handleWidth > otherTranslation){
			targetPosition = otherTranslation - this.handleWidth;
		}
	} else if(this.activeHandleName == "rightHandle"){
		otherTranslation = this.leftHandle[0].transform()[0][1];
		if(targetPosition < otherTranslation + this.handleWidth){
			targetPosition = otherTranslation + this.handleWidth;
		}
	}
	
	activeHandle.transform("T" + targetPosition + ",0");
	
	//re-scale the connecting handle bar
	if(this.activeHandleName == "leftHandle"){
		this.handleBar.attr({
			"x" : (targetPosition + this.handleWidth),
			"width" : (otherTranslation - (targetPosition + this.handleWidth))
		});
	} else if(this.activeHandleName == "rightHandle"){
		this.handleBar.attr({
			"x" : (otherTranslation + this.handleWidth),
			"width" : (targetPosition - (otherTranslation + this.handleWidth))
		});		
	}
	
	//callback:
	this.cMapSliderDragged(this);
};

function sliderEnd(evt){
	this.activeSliderNode.setAttribute("class", "minimapHandle inactive");
	
	//callback:
	this.cMapSliderEnd(this);
};


MiniMap.prototype.attachZoomSliderEventHandlers = function(){
	this.leftHandle.drag(sliderMoved, sliderStarted, sliderEnd, this);
	this.rightHandle.drag(sliderMoved, sliderStarted, sliderEnd, this);
};

MiniMap.prototype.initialize = function(){
	this.canvas = Raphael(this.targetDiv, this.width, this.height);

	//load the minimap
	this.drawMinimap();
	
	//create the zoom slider
	this.createZoomSlider();

	//attach the event handlers
	this.attachZoomSliderEventHandlers();
};