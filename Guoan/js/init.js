$().ready(function(){
	var userName = "user1";
	var mapName = "guoan";
	user = new GeoBeans.User(userName);
	mapManager = user.getMapManager();

	mapObj = mapManager.getMap("map_container",mapName);
	if(mapObj != null){
		var layer = new GeoBeans.Layer.QSLayer("base","/QuadServer/maprequest?services=world_vector");
		var center = new GeoBeans.Geometry.Point(0,0);
		mapObj.setBaseLayer(layer);
		mapObj.setLevel(2);
		mapObj.setCenter(center);
		mapObj.draw();
	}

	$("[data-toggle='tooltip']").tooltip({container:'body'});


	MapCloud.searchPanel = new MapCloud.SearchPanel("left_panel");
	MapCloud.baseLayerPanel = new MapCloud.BaseLayerPanel("base_layer_wrapper");
	MapCloud.mapBar = new MapCloud.MapBar("map_bar_wrapper");
	MapCloud.queryResultPanel = new MapCloud.QueryResultPanel("query_results_container");
	MapCloud.mapLayersPanel = new MapCloud.MapLayersPanel("map_layers_wrapper");
	MapCloud.mapLayersControl = new MapCloud.MapLayersControl("map_layers_icon");
	// MapCloud.mapLayersPanel.showPanel();
	MapCloud.notify = new MapCloud.Notify("container","alert_loading");	
	MapCloud.currentLayer = null;
});