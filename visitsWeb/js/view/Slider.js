function dragSliderTo(x, sliderButton){
	var parentElement = $("#slider");
	var targetX = x - parentElement.offset().left;
	if(targetX - 20 <= 0){
		targetX = 20;
	}
	if(targetX + 20 >= parentElement.width()){
		targetX = parentElement.width() - 20;
	}
	sliderButton.attr({"cx" : targetX});

}

function sliderMove(dx, dy, x, y, evt){
	console.log(dx + ", " + dy + ", " + x + ", " + y + ", " + evt);
	dragSliderTo(x, this);
};

function sliderDragStart(x, y, evt){
	console.log(x + ", " + y + ", " + evt);
	//this.sliderButton.attr({"cx" : x});
	dragSliderTo(x, this);
};

function sliderDragEnd(evt){
	console.log(evt);
};

function Slider(targetDiv, values){
	this.canvas = Raphael(targetDiv, 350, 50);
	this.sliderRange = this.canvas.path("M10,25 L340,25");
	this.sliderRange.attr({"stroke-width" : "2px", "fill" : "#fff"});
	
	this.sliderButton = this.canvas.circle(150,25,10);
	this.sliderButton.attr({"stroke-width" : "2px", "fill" : "#fff"});
	
	this.sliderMove = sliderMove;
	this.sliderDragStart = sliderDragStart;
	this.sliderDragEnd = sliderDragEnd;
	
	this.sliderButton.drag(this.sliderMove, this.sliderDragStart, this.sliderDragEnd);
};