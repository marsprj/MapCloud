var mapObj = null;

$().ready(function(){
	
	var ribbon = new MapCloud.Ribbon();
	var layersTre = new MapCloud.LayerTree();
	
	$("#center_panel").css("width", $(window).width()-$("#left_panel").width()-1); 
		
	var mapCanvas = document.getElementById("mapCanvas");
	mapCanvas.width = $("#center_panel").width();
	mapCanvas.height = $("#center_panel").height();
	
	var center = new GeoBeans.Geometry.Point(0,0);	
	var layer  = new GeoBeans.Layer.AMapLayer("gaode");mapObj = new GeoBeans.Map("mapCanvas");
	mapObj.setBaseLayer(layer);
	mapObj.setCenter(center);
	mapObj.setLevel(1);	
	mapObj.draw();	
	
	window.onresize = function(){
		var left_panel = $("#left_panel");
		var center_panel = $("#center_panel");
		
		var left_w = left_panel.width();
		var left_h = left_panel.height();
		
		center_panel.css("width", $(window).width()-left_w); 
		center_panel.css("height", $(window).height()-$("#head_panel").height()-$("#ribbon_wrapper").height());
		//$(center_panel).width(window.document.width-left_w);
		
		var mapCanvas = document.getElementById("mapCanvas");
		mapCanvas.width = $("#center_panel").width();
		mapCanvas.height = $("#center_panel").height();
	};
});

