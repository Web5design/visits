// reads a file via HTML5
// code is mostly taken from http://www.thebuzzmedia.com/html5-drag-and-drop-and-file-api-tutorial/

var DragAndDropFileReader = function(callback){
	this.stopEventPropagation = function(evt){
		evt.stopPropagation();
		evt.preventDefault();		
	};
	
	this.dropEventHandler = function(evt){
		evt.stopPropagation();
		evt.preventDefault();
		
		var files = evt.dataTransfer.files;
		var count = files.length;
		 
		// Only call the handler if 1 or more files was dropped.
		if (count > 0)
			handleFiles(files);
		
	};
	
	var handleFiles = function(files){
		var file = files[0];
		 
		document.getElementById("droplabel").innerHTML = "Processing " + file.name;
		
		//extract file ending to determine type
		var filename = file.name;
		var filenameparts = filename.split(".");
		var filetype = filenameparts[filenameparts.length - 1];
		
		if(filetype == "json"){
			inputFileType = "json";
		} else if(filetype == "kml") {
			inputFileType = "kml";
		} else {
			alert("unknown filetype ." + filetype + "!");
			return;
		}
		
		var reader = new FileReader();
		 
		// init the reader event handlers
		reader.onload = callback;
		 
		// begin the read operation
		reader.readAsText(file);
	};
	
	
	// init event handlers
	var dropbox = document.getElementById("dropbox");

	dropbox.addEventListener("dragenter", this.stopEventPropagation, false);
	dropbox.addEventListener("dragexit", this.stopEventPropagation, false);
	dropbox.addEventListener("dragover", this.stopEventPropagation, false);
	dropbox.addEventListener("drop", this.dropEventHandler, false);	
};
