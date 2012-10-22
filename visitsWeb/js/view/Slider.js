var callbackSliderStarted;
var callbackSliderDragged;
var callbackSliderEnd;
var sliderValueDisplay;

function setSliderValueTo(sliderObj, nextValue){
	var sliderPosition = sliderObj.padding + nextValue * sliderObj.sliderStep;
	var sliderValueText = (Number(sliderObj.values[nextValue].value) >= 1000)? Number(sliderObj.values[nextValue].value)/1000 + "km" : sliderObj.values[nextValue].value + "m";
	sliderValueDisplay.attr({"x" : sliderPosition, "y" : Number(sliderObj.verticalPosition + 20), "text" : sliderValueText});
	sliderObj.sliderButton.attr({"cx" : sliderPosition});
	
	sliderObj.currentValue = nextValue;
	
	callbackSliderDragged(sliderObj);
};

function dragSliderTo(x, y, sliderButton){
	var parentElement = $("#slider");
	var targetPos = new Point(x - parentElement.offset().left,
							y - parentElement.offset().top);
	
	var intersectionPoint = fallLot(targetPos, sliderButton.sliderObject);
	
	/*
	
	//var targetX = x - parentElement.offset().left;
	if(targetPos.x - sliderButton.sliderObject.padding <= 0)
	if(targetX - sliderButton.sliderObject.padding <= 0){
		targetX = sliderButton.sliderObject.padding;
	}
	if(targetX + sliderButton.sliderObject.padding >= parentElement.width()){
		targetX = parentElement.width() - sliderButton.sliderObject.padding;
	}
	*/
	var sliderObj = sliderButton.sliderObject;
	
	//sliderObj.sliderLength / sliderObj.values.length;
	//var currentValue = sliderObj.getNearestValue(sliderButton.attr("cx") - sliderObj.padding);
	var nextValue = sliderObj.getNearestValue(targetX);

	if(sliderObj.currentValue != nextValue){
		setSliderValueTo(sliderObj, nextValue);
	}
};

var wegwerfDrawings = new Array();

function fallLot(targetPos, slider){
	for(i = 0; i < wegwerfDrawings.length; i++){
		wegwerfDrawings[i].remove();
	}
	wegwerfDrawings = new Array();
	//var l1 = new Line(slider.startPoint.add(new Point(slider.padding, slider.padding)), slider.endPoint.add(new Point(slider.padding, slider.padding)));
	var l1 = new Line(slider.startPointPlusPadding, slider.endPointPlusPadding);
	var orthogonalVector = new Point(-(l1.endPoint.y - l1.startPoint.y), (l1.endPoint.x - l1.startPoint.x));
	orthogonalVector = orthogonalVector.scale(0.5);
	var mouseLineEndPoint = new Point(targetPos.x + orthogonalVector.x, targetPos.y + orthogonalVector.y);
	var l2 = new Line(targetPos, mouseLineEndPoint);
	
	wegwerfDrawings.push(slider.canvas.circle(l1.startPoint.x, l1.startPoint.y, 15));
	wegwerfDrawings.push(slider.canvas.circle(l2.startPoint.x, l2.startPoint.y, 15));
	wegwerfDrawings.push(slider.canvas.circle(l1.endPoint.x, l1.endPoint.y, 15));
	wegwerfDrawings.push(slider.canvas.circle(l2.endPoint.x, l2.endPoint.y, 15));

	var line1 = slider.canvas.path("M" + l1.startPoint.x + "," + l1.startPoint.y + "L" + l1.endPoint.x + "," + l1.endPoint.y);
	line1.attr({"stroke":"red"});
	wegwerfDrawings.push(line1);
	var line2 = slider.canvas.path("M" + l2.startPoint.x + "," + l2.startPoint.y + "L" + l2.endPoint.x + "," + l2.endPoint.y);
	line2.attr({"stroke" : "green"});
	wegwerfDrawings.push(line2);
	var intersectionPoint = intersectLines(l1, l2);
	wegwerfDrawings.push(slider.canvas.circle(intersectionPoint.x, intersectionPoint.y, 5));
	
	return intersectionPoint;
};

function sliderMove(dx, dy, x, y, evt){
	dragSliderTo(x, y, this);
};

function sliderDragStart(x, y, evt){
	dragSliderTo(x, y, this);
	callbackSliderStart(this.sliderObject);
};

function sliderDragEnd(evt){
	callbackSliderEnd(this.sliderObject);
};

function initializeSliderElements(){
	this.canvas = Raphael(this.targetDiv, this.sliderWidth, this.sliderHeight);
	this.sliderLine = this.canvas.path("M"+ this.startPointPlusPadding.x +","+ this.startPointPlusPadding.y +" L"+this.endPointPlusPadding.x+"," + this.endPointPlusPadding.y);
	this.sliderLine.node.setAttribute("class", "sliderLine");
	
	this.sliderButton = this.canvas.circle(this.startPointPlusPadding.x, this.startPointPlusPadding.y,10);
	this.sliderButton.node.setAttribute("class", "sliderButton");
	this.sliderButton.sliderObject = this;
	
	sliderValueDisplay = this.canvas.text(this.startPointPlusPadding.x,this.endPointPlusPadding.y + 20, "");
	sliderValueDisplay.node.setAttribute("class", "sliderValueDisplay");
	
	this.initializeLabels();
	
	this.sliderButton.toFront();	
	var sliderValueText = (Number(this.values[this.currentValue].value) >= 1000)? Number(this.values[this.currentValue].value)/1000 + "km" : this.values[this.currentValue].value + "m";
	sliderValueDisplay.attr({"text" : sliderValueText});
	sliderValueDisplay.toFront();
	
};

function setUpClickEventHandler(slider, i){
	return function(){
		setSliderValueTo(slider, i); 
		callbackSliderEnd(slider);
	};
};

function initializeLabels(){
	var valuesRange = this.values[this.values.length - 1].value - this.values[0].value;
	var sliderStep = this.sliderVector.length() / (this.values.length - 1);
	var ratioStep = 1.0 / (this.values.length - 1);
	
	var ratioPosition = 0.0;
	
	for(var i = 0; i < this.values.length; i++){
		var currentVector = this.sliderVector.scale(ratioPosition);
		var currentPosition = new Point(this.startPointPlusPadding.x + currentVector.x, 
				this.startPointPlusPadding.y + currentVector.y);
		//var horizontalPosition = slider.padding + (slider.values[i].value * valuesToPixels);
		if(this.values[i].label === ""){ 
			//no label - just a small circle then
			var sliderMark = this.canvas.circle(currentPosition.x, currentPosition.y, 2);
			sliderMark.node.setAttribute("class", "sliderMark");
			
			sliderMark.click(setUpClickEventHandler(this, i));
		} else {
			//draw a circle
			var sliderMark = this.canvas.circle(currentPosition.x, currentPosition.y, 5);
			sliderMark.node.setAttribute("class", "sliderMark");

			sliderMark.click(setUpClickEventHandler(this, i));

			//draw a label
			var sliderLabel = this.canvas.text(currentPosition.x + this.labelOffset.x, currentPosition.y + this.labelOffset.y, this.values[i].label);
			sliderLabel.attr({"text-anchor" : this.labelAlignment});
		}
		
		if(this.values[i].active){
			this.currentValue = i;
			this.sliderButton.attr({"cx" : currentPosition.x});
			this.sliderButton.attr({"cy" : currentPosition.y});
			sliderValueDisplay.attr({"x" : currentPosition.x});
			//sliderValueDisplay.attr({"y" : currentPosition.y});
		}
		
		ratioPosition += ratioStep;
	}

	if(!this.currentValue){
		this.currentValue = 0;
		this.sliderButton.attr({"cx" : this.startPointPlusPadding.x});
		this.sliderButton.attr({"cy" : this.startPointPlusPadding.y});
		sliderValueDisplay.attr({"x" : this.startPointPlusPadding.x});
	}
};

function getNearestValue(xPos){
	var posInRange = Math.round((this.values.length - 1) * (xPos - this.padding) / (this.sliderLength));
	return posInRange;
};

function getNearestValue(xPos, yPos){
	var posInRange = Math.round((this.values.length - 1) * (xPos - this.padding) / (this.sliderLength));
	return posInRange;
};

/**
 * creates a new slider
 * 
 * @param targetDiv - <div> element to put the slider into
 * @param values - values array in the format:
 * 					[
 * 						{ 
 * 						  value: minvalue (e.g., "0.0"),
 * 						  label: "label 1" 
 * 						},
 * 						{
 * 						  value: second value (e.g., "0.2"),
 * 						  label: "label 2",
 * 						  active : true 	// active label - only one, please
 * 						},
 * 						...,
 * 						{
 * 						  value: maxvalue (e.g., "1.0"),
 * 						  label: "label x"
 * 						}
 * 					]
 * @param sliderStart - starting position of the slider
 * @param sliderEnd - ending position of the slider
 * @param sliderPadding - how much space to the left/right and top/bottom of the slider in the <div>
 * @param labelOffset - Point: amount of offset for value labels
 * @param labelAlignment - one of "begin", "middle" and "end" (text alignment in SVG)
 * @param cSliderStart - callback for slider dragging started
 * @param cSliderDragged - callback for slider dragged
 * @param cSliderEnd - callback for slider dragging stopped
 * @returns
 */
function Slider(targetDiv, values, sliderStart, sliderEnd, sliderPadding, labelOffset, labelAlignment, cSliderStart, cSliderDragged, cSliderEnd){
	//DRAWING CONSTANTS
	this.padding = sliderPadding;	//how much space to the left/right or top/bottom of the slider in the <div>
	this.labelOffset = labelOffset;
	this.labelAlignment = labelAlignment;
	
	this.verticalPosition = 25;
	this.sliderLength = 500;
	
	this.getNearestValue = getNearestValue;

	this.targetDiv = targetDiv;
	
	/*this.startPoint = {
			"x" : this.padding,
			"y" : this.verticalPosition
	};

	this.endPoint = {
			"x" : this.padding + this.sliderLength,
			"y" : this.verticalPosition
	};*/

	callbackSliderStart = cSliderStart;
	callbackSliderDragged = cSliderDragged;
	callbackSliderEnd = cSliderEnd;

	this.startPoint = sliderStart;
	this.endPoint = sliderEnd;
	this.startPointPlusPadding = new Point(this.startPoint.x + this.padding, this.startPoint.y + this.padding);
	this.endPointPlusPadding = new Point(this.endPoint.x - this.padding, this.endPoint.y - this.padding);
	this.sliderVector = new Point(this.endPointPlusPadding.x - this.startPointPlusPadding.x, this.endPointPlusPadding.y - this.startPointPlusPadding.y);
	this.sliderWidth = Math.abs((this.endPoint.x - this.startPoint.x)) + 2 * this.padding;
	this.sliderHeight = Math.abs((this.endPoint.y - this.startPoint.y)) + 2 * this.padding;
	
	this.values = values;

	this.initializeSliderElements = initializeSliderElements;
	this.initializeLabels = initializeLabels;
	this.initializeSliderElements();

	this.sliderButton.drag(sliderMove, sliderDragStart, sliderDragEnd);
	
};