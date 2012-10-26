var callbackSliderStart;
var callbackSliderDragged;
var callbackSliderEnd;
var sliderValueDisplay;

/**
 * Set the value of the slider
 * @param sliderObj - the slider object to set the value of
 * @param nextValue - new target value
 */
function setSliderValueTo(sliderObj, nextValue){
	var sliderPosition = sliderObj.padding + nextValue * sliderObj.sliderVerticalStep;
	var sliderObjectNextValue = Number(sliderObj.values[nextValue].value);
	var sliderValueText = (sliderObjectNextValue >= 1000)? sliderObjectNextValue/1000 + "km" : sliderObjectNextValue + "m";
	
	sliderValueDisplay.attr({"x" : Number(sliderObj.horizontalPosition - 15), 
						     "y" : sliderPosition, 
						     "text" : sliderValueText, 
						     "text-anchor":"end"});
	sliderObj.sliderButton.attr({"cy" : sliderPosition});
	
	sliderObj.currentValue = nextValue;
	
	callbackSliderDragged(sliderObj);
};

/**
 * Slider was dragged to a given y-position
 * @param y - current y-position of the mouse
 * @param sliderButton - slider button object on the slider
 */
function dragSliderTo(y, sliderButton){
	var parentElement = $("#slider");
	var targetY = y - parentElement.offset().top;
	var sliderObj = sliderButton.sliderObject;
	var sliderPadding = sliderObj.padding;
	var parentHeight = parentElement.height();
	
	//make sure y-position is within bounds:
	if(targetY - sliderPadding <= 0){
		targetY = sliderPadding;
	} else if(targetY + sliderPadding >= parentHeight){
		targetY = parentHeight - sliderPadding;
	}

	var nextValue = sliderObj.getNearestValue(targetY);

	//check if value was changed
	if(sliderObj.currentValue != nextValue){
		setSliderValueTo(sliderObj, nextValue);
	}
};

/**
 * Event handler: slider started dragging
 * @param x - current x-position of the mouse
 * @param y - current y-position of the mouse
 * @param evt - event object
 */
function sliderDragStart(x, y, evt){
	dragSliderTo(y, this);
	callbackSliderStart(this.sliderObject);
};

/**
 * Event handler: slider moved
 * @param dx - moved horizontal distance since last event
 * @param dy - moved vertical distance since last event
 * @param x - current x-position of the mouse
 * @param y - current y-position of the mouse
 * @param evt - event object
 */
function sliderMove(dx, dy, x, y, evt){
	dragSliderTo(y, this);
	callbackSliderDragged(this.sliderObject);
};

/**
 * Event handler: slider stopped dragging
 * @param evt - event object
 */
function sliderDragEnd(evt){
	callbackSliderEnd(this.sliderObject);
};

/**
 * Initialize the main elements of the slider: background line, moveable button and value display
 * @returns {initializeSliderElements}
 */
function initializeSliderElements(){
	//init canvas
	this.canvas = Raphael(this.targetDiv, 200, this.sliderHeight + 2 * this.padding);
	
	//init background line of slider
	this.sliderLine = this.canvas.path("M"+ this.horizontalPosition +","+ this.padding +" L"+(this.horizontalPosition)+"," + (this.sliderHeight + this.padding));
	this.sliderLine.node.setAttribute("class", "sliderLine");
	
	//init moveable button
	this.sliderButton = this.canvas.circle(this.horizontalPosition,150, 5);
	this.sliderButton.node.setAttribute("class", "sliderButton");
	this.sliderButton.sliderObject = this;
	
	//init value display
	sliderValueDisplay = this.canvas.text(Number(this.horizontalPosition) - 15, 150, "");
	sliderValueDisplay.node.setAttribute("class", "sliderValueDisplay");
	
	this.initializeLabels();
	
	//after labels are initialized:
	this.sliderButton.toFront();	
	var sliderValueText = (Number(this.values[this.currentValue].value) >= 1000)? Number(this.values[this.currentValue].value)/1000 + "km" : this.values[this.currentValue].value + "m";
	sliderValueDisplay.attr({
							 "text" : sliderValueText, 
							 "text-anchor":"end"
							});
	sliderValueDisplay.toFront();
	
};

/**
 * Initialize the value labels of a slider
 * @returns {initializeLabels}
 */
function initializeLabels(){
	this.sliderVerticalStep = this.sliderHeight / (this.values.length - 1);
	var verticalPosition = this.padding;
	
	// helper function that creates suitable events handlers for the slider marks
	var setUpClickEventHandler = function(slider, i){
		return function(){
			setSliderValueTo(slider, i); 
			callbackSliderEnd(slider);
		};		
	};
	
	for(var i = 0; i < this.values.length; i++){
		if(this.values[i].label === ""){ 
			//no label - just a small circle then
			var sliderMark = this.canvas.circle(this.horizontalPosition+3, verticalPosition, 1);
			sliderMark.node.setAttribute("class", "sliderMark");
			
			sliderMark.click(setUpClickEventHandler(this, i));
		} else {
			//draw a circle
			var sliderMark = this.canvas.circle(this.horizontalPosition+3, verticalPosition, 1);
			sliderMark.node.setAttribute("class", "sliderMark");

			sliderMark.click(setUpClickEventHandler(this, i));

			//draw a label
			var sliderLabel = this.canvas.text(this.horizontalPosition + 15, verticalPosition, this.values[i].label);
			sliderLabel.attr({"text-anchor":"start", "fill":"#444"});
		}
		
		if(this.values[i].active){
			this.currentValue = i;
			this.sliderButton.attr({"cy" : verticalPosition});
			sliderValueDisplay.attr({"y" : verticalPosition, "font-size": 14});
		}
		
		verticalPosition += this.sliderVerticalStep;
	}

	if(!this.currentValue){
		this.currentValue = 0;
		this.sliderButton.attr({"cy" : this.padding});
		sliderValueDisplay.attr({"y" : this.padding});
	}
};

/**
 * Returns the closest valid value for a given y-coordinate
 * @param yPos - the current y-coordinate
 * @returns the index of the closest value in the values-array
 */
function getNearestValue(yPos){
	var posInRange = Math.round((this.values.length - 1) * (yPos - this.padding) / (this.sliderHeight));
	return posInRange;
};

/**
 * creates a new vertical slider
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
 * @param cSliderStart - callback for slider dragging started
 * @param cSliderDragged - callback for slider dragged
 * @param cSliderEnd - callback for slider dragging stopped
 * @returns
 */
function VerticalSlider(targetDiv, values, cSliderStart, cSliderDragged, cSliderEnd){
	//DRAWING CONSTANTS
	this.padding = 10;	//how much space to the top and bottom of the slider in the <div>
	this.horizontalPosition = 70;	//how much is the slider shifted from the left-hand side of the <div>
	this.sliderHeight = 250;	//how high is the slider

	//initialize class attributes
	this.targetDiv = targetDiv;
	this.values = values;
	this.getNearestValue = getNearestValue;
	this.initializeSliderElements = initializeSliderElements;
	this.initializeLabels = initializeLabels;
	
	//initialize event handlers
	callbackSliderStart = cSliderStart;
	callbackSliderDragged = cSliderDragged;
	callbackSliderEnd = cSliderEnd;

	//initialize class
	this.initializeSliderElements();
	//add event handlers
	this.sliderButton.drag(sliderMove, sliderDragStart, sliderDragEnd);
	
};