var mapObj = null;

$().ready(function(){
	
	var logo = new MapCloud.Logo();
	var ribbon = new MapCloud.Ribbon();
	var layersTre = new MapCloud.LayerTree();
	var mapCanvas = new MapCloud.MapCanvas("mapCanvas");
		
	$("#center_panel").css("width", $(window).width()-$("#left_panel").width()-1); 
	
//	var center = new GeoBeans.Geometry.Point(0,0);	
//	var layer  = new GeoBeans.Layer.AMapLayer("gaode");
//	mapObj = mapCanvas.map;
//	mapObj.setBaseLayer(layer);
//	mapObj.setCenter(center);
//	mapObj.setLevel(1);	

	mapCanvas.resize();
	
	window.onresize = function(){
		var left_panel = $("#left_panel");
		var center_panel = $("#center_panel");
		
		var left_w = left_panel.width();
		var left_h = left_panel.height();
		
		center_panel.css("width", $(window).width()-left_w); 
		center_panel.css("height", $(window).height()-$("#head_panel").height()-$("#ribbon_wrapper").height());
		//$(center_panel).width(window.document.width-left_w);
		
		//mapCanvas.resize();
	};
});

