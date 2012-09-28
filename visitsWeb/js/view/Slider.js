var callbackSliderDragged;
var callbackSliderEnd;
var sliderValueDisplay;

function dragSliderTo(x, sliderButton){
	var parentElement = $("#slider");
	var targetX = x - parentElement.offset().left;
	if(targetX - sliderButton.sliderObject.padding <= 0){
		targetX = sliderButton.sliderObject.padding;
	}
	if(targetX + sliderButton.sliderObject.padding >= parentElement.width()){
		targetX = parentElement.width() - sliderButton.sliderObject.padding;
	}
	
	var sliderObj = sliderButton.sliderObject;
	
	sliderObj.sliderWidth / sliderObj.values.length;
	//var currentValue = sliderObj.getNearestValue(sliderButton.attr("cx") - sliderObj.padding);
	var nextValue = sliderObj.getNearestValue(targetX);

	if(sliderObj.currentValue != nextValue){
		var sliderPosition = sliderObj.padding + nextValue * sliderObj.sliderHorizontalStep;
		sliderValueDisplay.attr({"x" : sliderPosition, "y" : Number(sliderObj.verticalPosition + 20), "text" : sliderObj.values[nextValue].value});
		sliderButton.attr({"cx" : sliderPosition});
		
		sliderObj.currentValue = nextValue;
		
		callbackSliderDragged();
	}
}

function sliderMove(dx, dy, x, y, evt){
	//console.log(dx + ", " + dy + ", " + x + ", " + y + ", " + evt);
	dragSliderTo(x, this);
};

function sliderDragStart(x, y, evt){
	//console.log(x + ", " + y + ", " + evt);
	//this.sliderButton.attr({"cx" : x});
	dragSliderTo(x, this);
};

function sliderDragEnd(evt){
	//console.log(evt);
	//sliderValueDisplay.attr({"text" : ""});
	
	callbackSliderEnd();
	};

function initializeSliderElements(targetDiv, slider){
	slider.canvas = Raphael(targetDiv, slider.sliderWidth + 2 * slider.padding, 100);
	slider.sliderLine = slider.canvas.path("M"+ slider.padding +","+ slider.verticalPosition +" L"+(slider.sliderWidth + slider.padding)+"," + slider.verticalPosition);
	slider.sliderLine.node.setAttribute("class", "sliderLine");
	
	slider.sliderButton = slider.canvas.circle(150,slider.verticalPosition,10);
	slider.sliderButton.node.setAttribute("class", "sliderButton");
	slider.sliderButton.sliderObject = slider;
	
	sliderValueDisplay = slider.canvas.text(150,Number(slider.verticalPosition), "");
	sliderValueDisplay.node.setAttribute("class", "sliderValueDisplay");
	
	initializeLabels(slider);
	
	slider.sliderButton.toFront();	
	sliderValueDisplay.attr({"text" : slider.values[slider.currentValue].value});
	sliderValueDisplay.toFront();
	
};

function initializeLabels(slider){
	var valuesRange = slider.values[slider.values.length - 1].value - slider.values[0].value;
	//var valuesToPixels = slider.sliderWidth / valuesRange;
	slider.sliderHorizontalStep = slider.sliderWidth / (slider.values.length - 1);
	var horizontalPosition = slider.padding;
	
	for(var i = 0; i < slider.values.length; i++){
		//var horizontalPosition = slider.padding + (slider.values[i].value * valuesToPixels);
		if(slider.values[i].label === ""){ 
			//no label - just a small circle then
			var sliderMark = slider.canvas.circle(horizontalPosition, slider.verticalPosition, 2);
			sliderMark.node.setAttribute("class", "sliderMark");
		} else {
			//draw a circle
			var sliderMark = slider.canvas.circle(horizontalPosition, slider.verticalPosition, 5);
			sliderMark.node.setAttribute("class", "sliderMark");
			//draw a label
			var sliderLabel = slider.canvas.text(horizontalPosition, slider.verticalPosition - 20, slider.values[i].label);
		}
		
		if(slider.values[i].active){
			slider.currentValue = i;
			slider.sliderButton.attr({"cx" : horizontalPosition});
			sliderValueDisplay.attr({"x" : horizontalPosition});
		}
		
		horizontalPosition += slider.sliderHorizontalStep;
	}

	if(!slider.currentValue){
		slider.currentValue = 0;
		slider.sliderButton.attr({"cx" : slider.padding});
		sliderValueDisplay.attr({"x" : slider.padding});
	}
};

function getNearestValue(xPos){
	var posInRange = Math.round((this.values.length - 1) * (xPos - this.padding) / (this.sliderWidth));
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
 * @param cSliderDragged - callback for slider dragged
 * @param cSliderEnd - callback for slider dragging stopped
 * @returns
 */
function Slider(targetDiv, values, cSliderDragged, cSliderEnd){
	//DRAWING CONSTANTS
	this.padding = 30;	//how much space to the left and right of the slider in the <div>
	this.verticalPosition = 25;
	this.sliderWidth = 500;
	
	this.getNearestValue = getNearestValue;

	callbackSliderDragged = cSliderDragged;
	callbackSliderEnd = cSliderEnd;

	this.values = values;

	initializeSliderElements(targetDiv, this);

	this.sliderButton.drag(sliderMove, sliderDragStart, sliderDragEnd);
	
};