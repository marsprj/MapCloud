var mapObj = null;
var ribbonObj = null;
var mapManager = null;
var dbsManager = null;
var styleManager = null;
var gpsManager = null;
var rasterDBManager = null;
var tileDBManger = null;
var url = "/ows/user1/mgr";
var user = new GeoBeans.User("user1");

$().ready(function(){


	mapManager = user.getMapManager();
	styleManager = user.getStyleManager();


	MapCloud.alert_info 
		= new MapCloud.AlertInfo("alert_info","alert_loading"); 
	MapCloud.notify
		= new MapCloud.Notify("container","alert_loading");
	MapCloud.get_maps_dlg 
		= new MapCloud.GetMapsDialog("getMapsDialog");
	MapCloud.map_mgr_dialog 
		= new MapCloud.MapMgrDialog("mapMgrDialog");
	MapCloud.create_map_dlg 
		= new MapCloud.CreateMapDialog("createMapDialog");

	MapCloud.wms_dialog = new MapCloud.WMSDialog("wmsDialog");
	MapCloud.wfs_datasource_dialog 
		= new MapCloud.WFSDatasourceDialog("wfsDatasourceDialog");
	MapCloud.wmts_dialog = new MapCloud.WMTSDialog("wmtsDialog");
	MapCloud.data_source_dialog 
		= new MapCloud.DataSourceDialog("dataSourceDialog");
	MapCloud.db_admin_dialog 
		= new MapCloud.DBAdminDialog("dbAdminDialog");
	MapCloud.vector_db_dialog 
		= new MapCloud.VectorDBDialog("vector_db_dialog");
	MapCloud.pgis_connection_dialog 
		= new MapCloud.PGISConnectDialog("pgisConnDialog");
	MapCloud.new_layer_dialog
		= new MapCloud.NewLayerDialog("newLayerDialog");
	MapCloud.new_raster_dblayer_dialog
		= new MapCloud.NewRasterDBLayerDialog("new_raster_dblayer_dialog");
	MapCloud.chart_dialog
		= new MapCloud.ChartDialog("chart_Dialog");


	MapCloud.style_dialog 
		= new MapCloud.StyleDialog("style-dialog");
	MapCloud.styleName_dialog 
	= new MapCloud.StyleNameDialog("style-name-dialog");

	MapCloud.file_dialog 
		= new MapCloud.FileDialog("fileDialog");
	MapCloud.import_dialog 
		= new MapCloud.ImportDialog("import_dialog");
	

	MapCloud.styleManager_dialog
		= new MapCloud.StyleManagerDialog("style-mgr-dialog");
	MapCloud.heatMap_dialog 
		= new MapCloud.HeatMapDialog("heatMapDialog");
	MapCloud.importVector_dialog
		= new MapCloud.ImportVectorDialog("importVectorDialog");
	MapCloud.features_dialog
		= new MapCloud.FeaturesDialog("featuresDialog");

	MapCloud.aqi_24h_dialog
		= new MapCloud.AQI24hDialog("aqi24hDialog");

	MapCloud.aqi_stat_comp_dialog
		= new MapCloud.AQIStatCompDialog("aqiStatCompDialog","aqi_station_comp_panel");
	// MapCloud.file_dialog 
	// 	= new MapCloud.FileDialog("fileDialog");
	MapCloud.create_folder_dialog 
		= new MapCloud.CreateFolderDialog("create_folder_dialog");
	MapCloud.raster_db_dialog
		= new MapCloud.RasterDBDialog("raster_db_dialog");
	MapCloud.import_raster_dialog
		= new MapCloud.ImportRasterDialog("import_raster_dialog");

	MapCloud.gps_output_source_dialog
		= new MapCloud.GPSOutputSourceDialog("gps_output_source_dialog");
	MapCloud.gps_kmean_dialog
		= new MapCloud.GPSKMeanDialog("gps_kmean_dialog");
	MapCloud.gps_feature_project_dialog
		= new MapCloud.GPSFeatureProjectDialog("gps_feature_project_dialog");
	MapCloud.gps_convex_hull_dialog
		= new MapCloud.GPSConvexHullDialog("gps_convex_hull_dialog");
	MapCloud.gps_raster_edge_detect_dialog
		= new MapCloud.GPSRasterEdgeDetectDialog("gps_raster_edge_detect_dialog");
	MapCloud.gps_raster_stretch_dialog
		= new MapCloud.GPSRasterStretchDialog("gps_raster_stretch_dialog");
	MapCloud.gps_raster_sepia_tone_dialog
		= new MapCloud.GPSRasterSepiaToneDialog("gps_raster_sepia_tone_dialog");
	MapCloud.gps_feature_import_dialog
		= new MapCloud.GPSFeatureImportDialog("gps_feature_import_dialog");
	MapCloud.gps_raster_extract_dialog
		= new MapCloud.GPSRasterExtractDialog("gps_raster_extract_dialog");
	MapCloud.gps_raster_reverse_dialog
		= new MapCloud.GPSRasterReverseDialog("gps_raster_reverse_dialog");
	MapCloud.gps_raster_graylize_dialog
		= new MapCloud.GPSRasterGraylizeDialog("gps_raster_graylize_dialog");
	MapCloud.gps_raster_smooth_dialog
		= new MapCloud.GPSRasterSmoothDialog("gps_raster_smooth_dialog");
	MapCloud.gps_raster_subtract_dialog
		= new MapCloud.GPSRasterSubtractDialog("gps_raster_subtract_dialog");
	MapCloud.gps_raster_pixel_blend_dialog
		= new MapCloud.GPSRasterPixelBlendDialog("gps_raster_pixel_blend_dialog");
	MapCloud.gps_raster_threshold_dialog 
		= new MapCloud.GPSRasterThresholdDialog("gps_raster_threshold_dialog");
	MapCloud.gps_raster_his_equal_dialog
		= new MapCloud.GPSRasterHisEquaDialog("gps_raster_his_equal_dialog");
	MapCloud.gps_dem_slope_dialog
		= new MapCloud.GPSDemSlopeDialog("gps_dem_slope_dialog");
	MapCloud.gps_dem_aspect_dialog
		= new MapCloud.GPSDemAspectDialog("gps_dem_aspect_dialog");
	MapCloud.gps_get_area_dialog
		= new MapCloud.GPSGetAreaDialog("gps_get_area_dialog");
	MapCloud.gps_get_length_dialog
		= new MapCloud.GPSGetLengthDialog("gps_get_length_dialog");
	MapCloud.gps_centroid_dialog
		= new MapCloud.GPSCentroidDialog("gps_centroid_dialog");
	MapCloud.gps_buffer_dialog
		= new MapCloud.GPSBufferDialog("gps_buffer_dialog");
	MapCloud.gps_build_pyramid_dialog
		= new MapCloud.GPSBuildPyramidDialog("gps_build_pyramid_dialog");
	MapCloud.gps_update_tile_dialog
		= new MapCloud.GPSUpdateTileDialog("gps_update_tile_dialog");
	MapCloud.gps_srid_dialog = new MapCloud.GPSSridDialog("gps_srid_dialog");
	MapCloud.cut_map_dialog = new MapCloud.CutMapDialog("cut_map_dialog");
	MapCloud.tile_db_dialog = new MapCloud.TileDBDialog("tile_db_dialog");
	MapCloud.create_tile_store_dialog 
		= new MapCloud.CreateTileStoreDialog("create_tile_store_dialog");


	MapCloud.refresh_panel 
		= new MapCloud.refresh("left_panel");
	MapCloud.overlay_panel 
		= new MapCloud.TrackOverlay("left_panel_overlay",
			"map_overlay_wrapper");

	MapCloud.search_panel
		= new MapCloud.SearchPanel("search_wrapper");

	MapCloud.chart_panel
		= new MapCloud.ChartPanel("chart_wrapper");
	MapCloud.bar_chart_panel
		= new MapCloud.BarChartPanel("bar_chart_wrapper");
	MapCloud.pie_chart_panel
		= new MapCloud.PieChartPanel("pie_chart_wrapper");
	MapCloud.aqi_chart_panel
		= new MapCloud.AQIChartPanel("aqi_chart_wrapper");
	MapCloud.aqi_timeline_chart_panel 
		= new MapCloud.AQITimelineChartPanel("aqi_timeline_chart_wrapper");

	MapCloud.gps_oper_panel 
		= new MapCloud.GPSOperPanel("gps_oper_wrapper");
	MapCloud.data_source_panel
		= new MapCloud.DataSourcePanel("data_source_wrapper");

	MapCloud.login_dialog
		= new MapCloud.LoginDialog("loginDialog");
	MapCloud.style_list_dialog
		= new MapCloud.StyleListDialog("style_list_dialog");
	MapCloud.map_info_dialog 
		= new MapCloud.MapInfoDialog("map_info_dialog");
	MapCloud.base_layer_dialog 
		= new MapCloud.BaseLayerDialog("base_layer_dialog");

	MapCloud.symbol_dialog = new MapCloud.SymbolDialog("symbol_dialog");
	MapCloud.layer_info_dialog = new MapCloud.LayerInfoDialog("layer_info_dialog");



	var logo = new MapCloud.Logo();	
	ribbonObj = new MapCloud.Ribbon();
	// var mapBarObj = new MapCloud.MapBar();
	MapCloud.userToolBar = new MapCloud.UserToolBar("user_tool_bar");
	MapCloud.mapBar = new MapCloud.MapBar();
	MapCloud.dataGrid 
	= new MapCloud.DataGrid("datagrid_wrapper","datagrid_control_wrapper");

	MapCloud.tools = new MapCloud.Tools();
	
	// mapManager = new GeoBeans.MapManager(url);
	dbsManager = new GeoBeans.DBSManager(url);
	fileManager = new GeoBeans.FileManager(url);
	// styleManager = new GeoBeans.StyleManager(url);
	gpsManager = new GeoBeans.GPSManager(url);
	rasterDBManager = new GeoBeans.RasterDBManager(url);



	$(".modal").draggable({
	    handle: ".modal-header"
	});	

	$("#datagrid_wrapper,.mc-panel").draggable({
		handle : ".panel-header"
	});

	$("#map_btn").click(function(){
		if($(".left-panel").css("display") == "block"){
			$("#map_btn").css("left","0px");
			$(".left-panel").css("width","0px");
			$(".left-panel").css("display","none");
			$(".right-panel").css("width","100%");
			mapObj.resize("width");
		}else{
			$("#map_btn").css("left","320px");
			$(".left-panel").css("width","320px");
			$(".left-panel").css("display","block");
			$(".right-panel").css("width","calc(100% - 320px)");
			mapObj.resize("width");
		}
	});

	// 加载地图
	MapCloud.notify.loading();
	mapManager.getMaps(ribbonObj.getMaps_callback);


	$(window).resize(function(){
		if($("#home_tab").hasClass("mc-active-tab")){
			mapManager.getMaps(ribbonObj.getMaps_callback);
		}
	});




// 	$("#right_panel .panel-header-collapse").click(function(){
// //		$("#center_panel").css("right","0px");
// 		$("#right_panel").css("display","none");
// 		$("#center_panel").removeClass("col-md-7");
// 		$("#center_panel").removeClass("col-xs-7");
// 		$("#center_panel").removeClass("col-lg-7");
// 		$("#center_panel").addClass("col-md-9");
// 		$("#center_panel").addClass("col-xs-9");
// 		$("#center_panel").addClass("col-lg-9");


// 	});

/*-------------------原有方式进行监听---------------------*/
	//新版调整不显示
	// mapObj.addEventListener("mousewheel", MapCloud.resizeCharts);



	// // var canvas = mapObj.canvas;
	// var onMouseDown = function(e){
	// 	e.preventDefault();
	// 	var mouseX = e.layerX;
	// 	var mouseY = e.layerY;
	// 	var onMouseMove = function(e){
	// 		e.preventDefault();
	// 		var moveMouseX = e.layerX;
	// 		var moveMouseY = e.layerY;
	// 		var d_x = moveMouseX - mouseX;
	// 		var d_y = moveMouseY - mouseY;

	// 		var mapCanvasWidth = $("#mapCanvas").width();
	// 		var mapCanvasHeight = $("#mapCanvas").height();	

	// 		for(var i = 0; i < MapCloud.wfs_layer_chart.length; ++i){
	// 			var wfsLayerChart = MapCloud.wfs_layer_chart[i];
	// 			if(wfsLayerChart == null ||wfsLayerChart.showFlag == false){
	// 				continue;
	// 			}
	// 			var chartsArray = wfsLayerChart.chartsArray;
	// 			for(var j = 0; j < chartsArray.length; ++j){
	// 				var chart = chartsArray[j];
		
	// 				chart.move(d_x,d_y);//先调整位置,进行移动
	// 				// 再判断要不要显示
	// 				if(chart.screenX < 0 || chart.screenY < 0 || 
	// 					chart.screenX > mapCanvasWidth || chart.screenY > mapCanvasHeight){
	// 					//不需要显示的
	// 					if(chart.showFlag){
	// 						$("#" + chart.id).remove();		
	// 					}
	// 					chart.showFlag = false;
	// 				}else{
	// 					//需要显示的
	// 					var interSetFlag = false;
	// 					// 继而判断和以前的有没有交集
	// 					for(var k = 0; k < j; ++k){
	// 						var chartPre = chartsArray[k];
	// 						if(chartPre.showFlag && chart.intersectRect(chartPre)){
	// 							// 此时有交集
	// 							interSetFlag = true;
	// 							break;
	// 						}
	// 					}
	// 					if(interSetFlag){
	// 						$("#" + chart.id).remove();	
	// 						chart.showFlag = false;	
	// 					}else{
	// 						//此时没有交集，应该显示
	// 						if(chart.showFlag){
	// 							// 以前就显示的
	// 							var panel = $("#" + chart.id);
	// 							panel.height(chart.height);
	// 							panel.width(chart.width);
	// 							panel.css("left",chart.screenX);
	// 							panel.css("top",chart.screenY);					
	// 							chart.chart.resize();
	// 						}else{
	// 							// 以前没有的
	// 							chart.show();
	// 						}
	// 						chart.showFlag = true;					
	// 					}
	// 				}					
	// 			}
	// 		}			
	// 		mouseX = moveMouseX;
	// 		mouseY = moveMouseY;
	// 	};
	// 	var onMouseUp = function(e)	{
	// 		e.preventDefault();
	// 		canvas.removeEventListener("mousemove", onMouseMove);
	// 		canvas.removeEventListener("mouseup", onMouseUp);

	// 	}
	// 	canvas.addEventListener("mousemove", onMouseMove);
	// 	canvas.addEventListener("mouseup", onMouseUp);
	// }
	// // canvas.addEventListener("mousedown", onMouseDown);

});