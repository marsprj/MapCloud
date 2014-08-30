MapCloud.MapCanvas = MapCloud.Class({
	
	map : null,

	initialize : function(canvas_id){
		this.map = new GeoBeans.Map(canvas_id); 
	},
	
	destory : function(){
		this.map = null;
	},
	
	resize : function(){
		
		var mapCanvas = document.getElementById("mapCanvas");
		mapCanvas.width = $("#center_panel").width();
		mapCanvas.height = $("#center_panel").height();
		this.map.transformation.update();
		this.map.draw();
	}
});
	