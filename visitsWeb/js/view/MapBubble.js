function MapBubble(map, i){
	
	this.map = map;
	this.div = $("#map_container" + i);
	this.lastcluster = undefined;
	this.cluster = TIMELINEMODEL.clusters[i];	
	this.x = Number(this.div.css("left").substring(0, this.div.css("left").length - 2));
	this.y = Number(this.div.css("top").substring(0, this.div.css("top").length - 2));
	this.width = this.div.width();
	this.height = this.div.height();
	this.overviewMarker;
}

MapBubble.prototype.update = function(x, y, width, height){
	//start the animation
	this.div.animate({
		left: x,
		top: y,
		width: width,
		height: height
	}, 5000, function(){}
	);
	/*this.div.offset({ left:x, top:y});
	this.div.width(width);
	this.div.height(height);
	*/
	
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};