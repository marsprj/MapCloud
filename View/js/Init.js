var mapObj = null;
var g_search_ctrl = null;
var g_result_ctrl = null;

$().ready(function(){
	initMap();
	initControl();
});

function initMap(){
	var extent = new GeoBeans.Envelope(-180,-90,180,90);
	mapObj = new GeoBeans.Map("/ows/user1/mgr","map_div","tmp",extent,4326,extent);

	mapObj.mapNavControl.setEnable(false);

	var layer = new GeoBeans.Layer.QSLayer("base","/QuadServer/maprequest?services=world_image");
	layer.MAX_ZOOM_LEVEL = 18;
	mapObj.setBaseLayer(layer);
	mapObj.setCenter(new GeoBeans.Geometry.Point(0,0));
	mapObj.setLevel(3);	
	mapObj.draw();			
}

function initControl(){
	g_search_ctrl = new MapView.SearchControl();
	g_result_ctrl = new MapView.ResultControl();
}
