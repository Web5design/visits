
function OverlayView(mainmodel, timelineModel){
	
	this.mainmodel = mainmodel;
	this.timelineModel = timelineModel;

	//initialize overlay
	this.canvas = Raphael(0,0,window.innerWidth,window.innerHeight);

};