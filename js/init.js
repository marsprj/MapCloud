var mapObj = null;

$().ready(function(){
	
	var ribbon = new MapCloud.Ribbon();
	var layersTre = new MapCloud.LayerTree();
	
	$("#center_panel").css("width", $(window).width()-$("#left_panel").width()-1); 
	var mapCanvas = $("#mapCanvas");
	
	mapCanvas.width($("#center_panel").width());
	mapCanvas.height($("#center_panel").height());
	
//	var center = new GeoBeans.Geometry.Point(10000000,10000000);	
//	var layer  = new GeoBeans.Layer.AMapLayer("gaode");mapObj = new GeoBeans.Map("mapCanvas");
//	mapObj.setBaseLayer(layer);
//	mapObj.setCenter(center);
//	mapObj.setLevel(4);	
//	mapObj.draw();	
	
	window.onresize = function(){
		var left_panel = $("#center_panel");
		var center_panel = $("#center_panel");
		
		var left_w = left_panel.width();
		var left_h = left_panel.height();
		
		center_panel.css("width", $(window).width()-left_w); 
		//$(center_panel).width(window.document.width-left_w);
		
		var mapCanvas = $("#mapCanvas");	
		mapCanvas.width($("#center_panel").width());
		mapCanvas.height($("#center_panel").height());
	};
});

