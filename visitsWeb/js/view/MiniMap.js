/**
 * MiniMap constructor
 * @param targetDiv - target <div> element to put the minimap into
 */
function MiniMap(targetDiv){
	/* drawing constants */
	this.padding = 8;	// padding left and right of the minimap to leave space for the slider
	this.handleWidth  = 16;
	this.handleBarHeight = 8;
	
	var jQueryDiv = $("#" + targetDiv);
	
	this.targetDiv = targetDiv;
	
	this.width = jQueryDiv.width();
	this.height = jQueryDiv.height();
	
	this.initialize();
};

MiniMap.prototype.drawMinimap = function(){
	var availableWidth = this.width - 2 * this.padding;
	var stepSize = availableWidth / TIMELINEMODEL.displayedTimeframe;
	var horizontalPosition = this.padding;
	
	var largestClusterWidth = 0;
	$.each(TIMELINEMODEL.clusters, function(index, value){});
	
	for(var i = 0; i < TIMELINEMODEL.clusters.length; i++){

		var clusterWidth = TIMELINEMODEL.clusters[i].timeframe * stepSize;
		var clusterRadius = clusterWidth / 2;
		
		var verticalPosition = (this.height / 2.0) - clusterRadius;
		
		var currentCircle = this.canvas.circle(horizontalPosition + clusterRadius, verticalPosition + clusterRadius, clusterRadius);
		currentCircle.node.setAttribute("class", "minimapCircle active");
		
		horizontalPosition = horizontalPosition + clusterWidth;
	}
};

MiniMap.prototype.createZoomSlider = function(){
	var sliderHeight = this.height / 4;
	var halfHandleWidth = this.handleWidth / 2;
	var handlePath = "l" + this.handleWidth + ",0l0," + sliderHeight + "l-"+ halfHandleWidth +"," + halfHandleWidth + "l-" + halfHandleWidth + ",-" + halfHandleWidth + "z";
	
	this.leftHandle = this.canvas.path("M0,0" + handlePath);
	this.leftHandle.node.setAttribute("class", "minimapHandle inactive");
	this.leftHandleLine = this.canvas.path("M" + halfHandleWidth + "," + (sliderHeight + halfHandleWidth) + "l0," + (this.height - sliderHeight));
	this.leftHandleLine.node.setAttribute("class", "minimapHandleLine inactive");
	
	this.rightHandle = this.canvas.path("M" + (this.width - this.handleWidth) + ",0" + handlePath);
	this.rightHandle.node.setAttribute("class", "minimapHandle inactive");
	this.rightHandleLine = this.canvas.path("M" + (halfHandleWidth + this.width - this.handleWidth) + "," + (sliderHeight + halfHandleWidth) + "l0," + (this.height - sliderHeight));
	this.rightHandleLine.node.setAttribute("class", "minimapHandleLine inactive");
	
	this.handleBar = this.canvas.rect(this.handleWidth, 0, (this.width - 2 * this.handleWidth), this.handleBarHeight);
	this.handleBar.node.setAttribute("class", "minimapHandleBar inactive");
};

MiniMap.prototype.initialize = function(){
	this.canvas = Raphael(this.targetDiv, this.width, this.height);

	//load the minimap
	this.drawMinimap();
	
	//create the zoom slider
	this.createZoomSlider();
};