function MapBubble(map, i){
	
	this.map = map;
	this.div = $("#map_container" + i);
	this.cluster = TIMELINEMODEL.clusters[i];	
	this.x = Number(this.div.css("left").substring(0, this.div.css("left").length - 2));
	this.y = Number(this.div.css("top").substring(0, this.div.css("top").length - 2));
	this.width = this.div.width();
	this.height = this.div.height();
	this.overviewMarker;
	
}