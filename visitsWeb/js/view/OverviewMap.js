function OverviewMap(){
	
	this.div = $("#overview");
	this.x = Number(this.div.css("left").substring(0, this.div.css("left").length - 2));
	this.y = Number(this.div.css("top").substring(0, this.div.css("top").length - 2));
	this.map;
	
	this.drawOverviewMap = drawOverviewMap;
}

function drawOverviewMap(){
	var clusterWidth = this.div.width();
	var overallClusterBounds = TIMELINEMODEL.combinedLocationCluster.clusterBounds;
	
    var overviewMapoptions = {
  	      center: new google.maps.LatLng(overallClusterBounds.getCenter().lat(), overallClusterBounds.getCenter().lng()),
  	      zoom: calculateZoomLevel(overallClusterBounds.getNorthEast(),overallClusterBounds.getSouthWest(),this.div.height()),
  	      mapTypeId: google.maps.MapTypeId.ROADMAP, 
  	      noClear: true,
  	      zoomControl: false,
  	      panControl: false,
  	      rotateControl: false,
  	      scaleControl: false,
  	      disableDefaultUI: true
  	    };
    
    this.map = new google.maps.Map(document.getElementById("overview"), overviewMapoptions);
    this.map.fitBounds(overallClusterBounds);
}