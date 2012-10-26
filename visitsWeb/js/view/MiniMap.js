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
	
	this.width = jQueryDiv.width();
	this.height = jQueryDiv.height();

	this.targetDiv = targetDiv;
	this.cMapSliderStart = cMapSliderStart;
	this.cMapSliderDragged = cMapSliderDragged;
	this.cMapSliderEnd = cMapSliderEnd;

	this.leftBorderBubbleIndex = 0;
	this.rightBorderBubbleIndex = MAINMODEL.clusters.length - 1;
	
	//currentBubbles contains all currently visible bubbles
	this.currentBubbles = new Array();
	//virtualBubbles contains pairs of bubbles that are drawn when a bubble is split by a handle
	this.virtualBubbles = new Array();
	
	this.initialize();
};

/**
 * Draws the minimap bubbles, displays them and puts them into the currentBubbles Array.
 */
MiniMap.prototype.drawMinimap = function(){
	var availableWidth = this.width - 2 * this.padding;
	var stepSize = availableWidth / MAINMODEL.timeframe;
	var horizontalPosition = this.padding;
	
	//find the cluster with the largest expansion
	var largestClusterRadius = 0;
	$.each(MAINMODEL.clusters, function(index, value){ 
		var currentClusterRadius = (value.timeframe * stepSize) / 2;
		if(largestClusterRadius < currentClusterRadius) largestClusterRadius = currentClusterRadius;
	});
	this.largestClusterRadius = largestClusterRadius;
	
	this.currentBubbles = new Array();
	
	for(var i = 0; i < MAINMODEL.clusters.length; i++){

		var clusterWidth = MAINMODEL.clusters[i].timeframe * stepSize;
		var clusterRadius = clusterWidth / 2;
		
		//for dynamic vertical positioning:
		//var verticalPosition = (this.height - this.largestClusterRadius) - clusterRadius - 1;
		
		//for static (=middle) vertical positioning:
		var verticalPosition = (this.height / 2) - clusterRadius;
		
		var currentCircle = this.canvas.circle(horizontalPosition + clusterRadius, verticalPosition + clusterRadius, clusterRadius);
		currentCircle.node.setAttribute("class", "minimapCircle active");
		
		this.currentBubbles.push(currentCircle);
		
		horizontalPosition = horizontalPosition + clusterWidth;
	}
};

/**
 * Draws the zoom slider
 */
MiniMap.prototype.createZoomSlider = function(){
	var halfHandleWidth = this.handleWidth / 2;
	var sliderHeight = this.sliderHeight;
	//var sliderHeight = this.height - (this.largestClusterRadius * 2) - halfHandleWidth;
	var handlePath = "M0,0l" + this.handleWidth + ",0l0," + sliderHeight + "l-"+ halfHandleWidth +"," + halfHandleWidth + "l-" + halfHandleWidth + ",-" + halfHandleWidth + "z";
	
	//creates the left handle and the corresponding dashed vertical line
	this.leftHandleObj = this.canvas.path(handlePath);
	this.leftHandleObj.node.setAttribute("class", "minimapHandle inactive");
	this.leftHandleLine = this.canvas.path("M" + halfHandleWidth + "," + (sliderHeight + halfHandleWidth) + "l0," + (this.height / 2 - sliderHeight - halfHandleWidth));
	this.leftHandleLine.node.setAttribute("class", "minimapHandleLine inactive");
	this.leftHandle = this.canvas.set();
	this.leftHandle.push(this.leftHandleObj, this.leftHandleLine);
	this.leftHandle.transform("T0,0");
	
	//creates the right handle and the corresponding dashed vertical line
	this.rightHandleObj = this.canvas.path(handlePath);
	this.rightHandleObj.node.setAttribute("class", "minimapHandle inactive");
	this.rightHandleLine = this.canvas.path("M" + halfHandleWidth + "," + (sliderHeight + halfHandleWidth) + "l0," + (this.height / 2 - sliderHeight - halfHandleWidth));
	this.rightHandleLine.node.setAttribute("class", "minimapHandleLine inactive");
	this.rightHandle = this.canvas.set();
	this.rightHandle.push(this.rightHandleObj, this.rightHandleLine);
	this.rightHandle.transform("T" + (this.width - this.handleWidth) + ",0");
	
	//creates the handle bar between the two handles
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

/**
 * Checks if a given bubbles is crossing one of the sliders or is within them
 * @param circle - the respective bubble
 * @returns 0   - the bubble is outside of the sliders
 * 			0.25 - the bubble is intersecting with the left slider
 * 			0.5 - the bubble is intersecting with the right slider
 * 			1   - the bubble is within both of the sliders
 */
MiniMap.prototype.isWithinSlider = function(circle){
	var leftPosition = this.leftHandle[0].transform()[0][1] + this.handleWidth / 2;
	var rightPosition = this.rightHandle[0].transform()[0][1] + this.handleWidth / 2;
	
	var position = circle.attr("cx");
	var radius = circle.attr("r");
	var leftBorder = position - radius;
	var rightBorder = position + radius;
	
	if(leftBorder >= leftPosition && rightBorder <= rightPosition){
		return 1;
	} else if((leftBorder < leftPosition && rightBorder < leftPosition) || (leftBorder > rightPosition && rightBorder > rightPosition)){
		return 0;
	} else if(leftBorder < leftPosition && rightBorder <= rightPosition){
		return 0.25;
	} else {
		return 0.5;
	}
};

/**
 * Redraws the minimap's circles: sets active/inactive classes and
 * splits circles if necessary.
 */
MiniMap.prototype.updateCircles = function(){
	//remove all virtual bubbles
	for(var i = 0; i < this.virtualBubbles.length; i++){
		this.virtualBubbles[i].remove();
	}
	this.virtualBubbles = new Array();
	
	this.leftBorderBubbleIndex = -1;
	this.rightBorderBubbleIndex = -1;
	
	//update all bubble classes and split them if necessary
	for(var i = 0; i < this.currentBubbles.length; i++){
		var currentBubble = this.currentBubbles[i];
		var withinTest = this.isWithinSlider(currentBubble);
		if(withinTest == 1){
			currentBubble.node.setAttribute("class", "minimapCircle active");
			
			if(this.leftBorderBubbleIndex == -1){
				this.leftBorderBubbleIndex = i;
			}
		} else if(withinTest == 0.5 || withinTest == 0.25){
			//set the actual bubble to inactive
			currentBubble.node.setAttribute("class", "minimapCircle split");
			
			//now show two smaller virtual bubbles
			var crossingPosition;
			if(withinTest == 0.25){
				//intersection with left slider
				crossingPosition = this.leftHandle[0].transform()[0][1] + this.handleWidth / 2;
			} else {
				//intersection with right slider
				crossingPosition = this.rightHandle[0].transform()[0][1] + this.handleWidth / 2;
			}
			
			var currentBubblePosition = currentBubble.attr("cx");
			var currentBubbleRadius = currentBubble.attr("r");
			var currentBubbleLeftBorder = currentBubblePosition - currentBubbleRadius;
			var currentBubbleRightBorder = currentBubblePosition + currentBubbleRadius;
			
			var leftCircleWidth = (crossingPosition - currentBubbleLeftBorder);
			var leftCircleCenter = currentBubbleLeftBorder + (leftCircleWidth / 2);
			var rightCircleWidth = currentBubbleRadius * 2 - leftCircleWidth;
			var rightCircleCenter = currentBubbleRightBorder - (rightCircleWidth / 2);
			
			//draw the two virtual bubbles
			var leftCircle = this.canvas.circle(leftCircleCenter, currentBubble.attr("cy"), leftCircleWidth / 2);
			var rightCircle = this.canvas.circle(rightCircleCenter, currentBubble.attr("cy"), rightCircleWidth / 2);
			
			//set the right inactive/active classes for the virtual bubbles
			if(withinTest == 0.25){
				leftCircle.node.setAttribute("class", "minimapCircle inactive");
				rightCircle.node.setAttribute("class", "minimapCircle active");
			} else {
				leftCircle.node.setAttribute("class", "minimapCircle active");
				rightCircle.node.setAttribute("class", "minimapCircle inactive");				
			}
			
			this.virtualBubbles.push(leftCircle, rightCircle);
			
		} else {
			currentBubble.node.setAttribute("class", "minimapCircle inactive");		
			
			if(this.rightBorderBubbleIndex == -1){
				this.rightBorderBubbleIndex = i;
			}
		}
	}
};

/**
 * Event handler: slider has been moved for the first time
 * Note: has to run in the context of the minimap object
 * @param x - mouse x position
 * @param y - mouse y position
 * @param evt - event
 */
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

/**
 * Event handler: slider has been moved
 * Note: has to run in the context of the minimap object
 * @param dx - difference in mouse x position to last call
 * @param dy - difference in mouse y position to last call
 * @param x - mouse x position
 * @param y - mouse y position
 * @param evt - event
 */
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
	
	//redraw the circles
	this.updateCircles();
	
	//callback:
	this.cMapSliderDragged(this);
};

/**
 * Event handler: slider is no longer moved
 * Note: has to run in the context of the minimap object
 * @param evt - event
 */
function sliderEnd(evt){
	this.activeSliderNode.setAttribute("class", "minimapHandle inactive");
	
	//callback:
	this.cMapSliderEnd(this);
};

/**
 * Event handler: bar handle has been moved for the first time
 * Note: has to run in the context of the minimap object
 * @param x - mouse x position
 * @param y - mouse y position
 * @param evt - event
 */
function barStarted(x, y, evt){
	this.handleBar.node.setAttribute("class", "minimapHandleBar active");

	var currentPosition = this.handleBar.attr("x");
	//handleTouchOffset is the horizontal offset between the mouse cursor and the handle bar
	this.handleTouchOffset = (x - $("#" + this.targetDiv).offset().left) - currentPosition;

	//callback:
	this.cMapSliderStart(this);
};

/**
 * Event handler: bar handle has been moved
 * Note: has to run in the context of the minimap object
 * @param dx - difference in mouse x position to last call
 * @param dy - difference in mouse y position to last call
 * @param x - mouse x position
 * @param y - mouse y position
 * @param evt - event
 */
function barMoved(dx, dy, x, y, evt){
	//mouse position relative to the minimap's <div>
	var relativePosition = x - $("#" + this.targetDiv).offset().left;
	var targetPosition = relativePosition - this.handleTouchOffset;
	var handleBarWidth = this.handleBar.attr("width");

	//make sure that the target position is valid:
	if(targetPosition - this.handleWidth < 0){
		targetPosition = this.handleWidth;
	}
	if(targetPosition + this.handleWidth + handleBarWidth > this.width){
		targetPosition = this.width - this.handleWidth - handleBarWidth;
	}

	//the horizontal difference since the last call (dx parameter is unreliable...)
	var diffx = this.handleBar.attr("x") - targetPosition;

	this.handleBar.attr("x", targetPosition);
	
	//also move the handles left and right of the handle bar
	var currentLeftHandlePosition = this.leftHandle[0].transform()[0][1];
	this.leftHandle.transform("T" + (currentLeftHandlePosition - diffx) + ",0");
	var currentRightHandlePosition = this.rightHandle[0].transform()[0][1];
	this.rightHandle.transform("T" + (currentRightHandlePosition - diffx) + ",0");
	
	//redraw the circles
	this.updateCircles();
	
	//callback:
	this.cMapSliderDragged(this);
};

/**
 * Event handler: bar handle is no longer moved
 * Note: has to run in the context of the minimap object
 * @param evt - event
 */
function barEnd(evt){
	this.handleBar.node.setAttribute("class", "minimapHandleBar inactive");	

	//callback:
	this.cMapSliderEnd(this);
};

/**
 * Initializes the zoom slider's event handlers
 */
MiniMap.prototype.attachZoomSliderEventHandlers = function(){
	//attach handlers to the handles
	this.leftHandle.drag(sliderMoved, sliderStarted, sliderEnd, this);
	this.rightHandle.drag(sliderMoved, sliderStarted, sliderEnd, this);
	
	//attach handlers to the handle bar
	this.handleBar.drag(barMoved, barStarted, barEnd, this);
};

/**
 * Initializes the graphical elements of the minimap
 */
MiniMap.prototype.initialize = function(){
	this.canvas = Raphael(this.targetDiv, this.width, this.height);

	//load the minimap
	this.drawMinimap();
	
	//create the zoom slider
	this.createZoomSlider();

	//attach the event handlers
	this.attachZoomSliderEventHandlers();
};