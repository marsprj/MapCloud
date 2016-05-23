var mapObj = null;
var ribbonObj = null;
var mapManager = null;
var dbsManager = null;
var fileManager = null;
var styleManager = null;
var gpsManager = null;
var rasterDBManager = null;
var tileDBManger = null;
var poiManager = null;
var subManager = null;
var serviceManager = null;
// var url = "/ows/user1/mgr";
var authServer = "/ows/admin/mgr";
var authManager = new GeoBeans.AuthManager(authServer);
// var user = new GeoBeans.User("user1");

$().ready(function(){


	MapCloud.account = new MapCloud.Account("login-panel","register-panel");

	MapCloud.notify	= new MapCloud.Notify("container","alert_loading");

	MapCloud.create_map_dlg 
		= new MapCloud.CreateMapDialog("createMapDialog");

	MapCloud.wms_dialog = new MapCloud.WMSDialog("wmsDialog");
	MapCloud.wfs_datasource_dialog 
		= new MapCloud.WFSDatasourceDialog("wfsDatasourceDialog");
	MapCloud.wmts_dialog = new MapCloud.WMTSDialog("wmtsDialog");
	MapCloud.vector_db_dialog 
		= new MapCloud.VectorDBDialog("vector_db_dialog");
	MapCloud.pgis_connection_dialog 
		= new MapCloud.PGISConnectDialog("pgisConnDialog");
	MapCloud.new_layer_dialog
		= new MapCloud.NewLayerDialog("newLayerDialog");
	MapCloud.new_raster_dblayer_dialog
		= new MapCloud.NewRasterDBLayerDialog("new_raster_dblayer_dialog");
	


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
	MapCloud.importCSV_dialog
		= new MapCloud.ImportCSVDialog("import_csv_dialog");
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

	MapCloud.gps_raster_edge_detect_dialog
		= new MapCloud.GPSRasterEdgeDetectDialog("gps_raster_edge_detect_dialog");
	MapCloud.gps_raster_stretch_dialog
		= new MapCloud.GPSRasterStretchDialog("gps_raster_stretch_dialog");
	MapCloud.gps_raster_sepia_tone_dialog
		= new MapCloud.GPSRasterSepiaToneDialog("gps_raster_sepia_tone_dialog");
	MapCloud.gps_feature_import_dialog
		= new MapCloud.GPSFeatureImportDialog("gps_feature_import_dialog");
	MapCloud.gps_csv_import_dialog
		= new MapCloud.GPSCsvImportDialog("gps_csv_import_dialog");		
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
	MapCloud.gps_dem_stretch_dialog
		= new MapCloud.GPSDemStretchDialog("gps_dem_stretch_dialog");
	MapCloud.gps_dem_hillshade_dialog
		= new MapCloud.GPSDemHillshadeDialog("gps_dem_hillshade_dialog");
	MapCloud.gps_delaunay_dialog
		= new MapCloud.GPSDelaunayDialog("gps_delaunay_dialog");
	MapCloud.gps_get_area_dialog
		= new MapCloud.GPSGetAreaDialog("gps_get_area_dialog");
	MapCloud.gps_get_length_dialog
		= new MapCloud.GPSGetLengthDialog("gps_get_length_dialog");
	MapCloud.gps_centroid_dialog
		= new MapCloud.GPSCentroidDialog("gps_centroid_dialog");
	MapCloud.gps_convex_hull_dialog
		= new MapCloud.GPSConvexHullDialog("gps_convex_hull_dialog");
	MapCloud.gps_multi_point_to_points_dialog
		= new MapCloud.GPSMultiPointToPointsDialog("gps_multi_point_to_points_dialog");
	MapCloud.gps_line_to_points_dialog
		= new MapCloud.GPSLineToPointsDialog("gps_line_to_points_dialog");
	MapCloud.gps_polygon_to_points_dialog
		= new MapCloud.GPSPolygonToPointsDialog("gps_polygon_to_points_dialog");
	MapCloud.gps_polygon_to_line_dialog
		= new MapCloud.GPSPolygonToLineDialog("gps_polygon_to_line_dialog");
	MapCloud.gps_gen_random_points_dialog
		= new MapCloud.GPSGenRandomPointsDialog("gps_gen_random_points_dialog");
	MapCloud.gps_gen_random_points_in_polygon_dialog
		= new MapCloud.GenRandomPointsInPolygonDialog("gps_gen_random_points_in_polygon_dialog");
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
	MapCloud.process_dialog
		= new MapCloud.ProcessDialog("process_dialog");

	MapCloud.version_dialog
		= new MapCloud.VersionDialog("version_dialog");
		


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
	MapCloud.symbol_chart_panel
		= new MapCloud.SymbolChartPanel("symbol_chart_wrapper");
	MapCloud.range_symbol_chart_panel
		= new MapCloud.RangeSymbolChartPanel("range_symbol_chart_wrapper");
	MapCloud.cluster_chart_panel
		= new MapCloud.ClusterChartPanel("cluster_chart_wrapper");
	MapCloud.aqi_chart_panel
		= new MapCloud.AQIChartPanel("aqi_chart_wrapper");
	MapCloud.aqi_timeline_chart_panel 
		= new MapCloud.AQITimelineChartPanel("aqi_timeline_chart_wrapper");
	MapCloud.airline_panel 
		= new MapCloud.AirlinePanel("airline_wrapper");

	MapCloud.gps_oper_panel 
		= new MapCloud.GPSOperPanel("gps_oper_wrapper");
	MapCloud.data_source_panel
		= new MapCloud.DataSourcePanel("data_source_wrapper");

	MapCloud.topicPanel 
		= new MapCloud.TopicPanel("topic_panel");

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
	MapCloud.query_dialog = new MapCloud.QueryDialog("query_dialog");
	MapCloud.create_dataset_dialog = new MapCloud.CreateDataSetDialog("create_dataset_dialog");
	MapCloud.poi_dialog = new MapCloud.PoiDialog("poi_dialog");
	MapCloud.aqi_features_dialog = new MapCloud.AQIFeaturesDialog("aqi_features_dialog");

	var logo = new MapCloud.Logo();	
	ribbonObj = new MapCloud.Ribbon();
	// var mapBarObj = new MapCloud.MapBar();
	MapCloud.userToolBar = new MapCloud.UserToolBar("user_tool_bar");
	MapCloud.mapBar = new MapCloud.MapBar();
	MapCloud.dataGrid 
	= new MapCloud.DataGrid("datagrid_wrapper","datagrid_control_wrapper");

	MapCloud.tools = new MapCloud.Tools();

	MapCloud.cookieObj = new MapCloud.Cookie();
	
	// mapManager = new GeoBeans.MapManager(url);
	// dbsManager = new GeoBeans.DBSManager(url);
	// fileManager = new GeoBeans.FileManager(url);
	// styleManager = new GeoBeans.StyleManager(url);
	// gpsManager = new GeoBeans.GPSManager(url);
	// rasterDBManager = new GeoBeans.RasterDBManager(url);



	$(".modal").draggable({
	    handle: ".modal-header"
	});	

	$("#datagrid_wrapper,.mc-panel").draggable({
		handle : ".panel-header"
	});


	// // 加载地图
	// MapCloud.notify.loading();
	// mapManager.getMaps(ribbonObj.getMaps_callback);




	$(window).resize(function(){
		if($("#home_tab").hasClass("mc-active-tab")){
			// 考虑是否登录账户
			// mapManager.getMaps(ribbonObj.getMaps_callback);
		}
	});


	// 判断是否已经登录了
	var username = MapCloud.cookieObj.getCookie("username");
	if(username != null){
		// 如果是管理员用户
		var flag = false;
		if(username == "admin"){
			var url = window.location.href;
			var index = url.lastIndexOf("?name=");
			if(index != -1){
				var name =  url.slice(index + 6,url.length);
				if(name != null){
					username = name;
					flag = true;
				}
			}
		}
		MapCloud.account.hideLoginPanel();
		$(".map-panel").css("display","block");
		MapCloud.account.initUser(username);
		if(flag){
			MapCloud.cookieObj.setCookie("username","admin","/MapCloud");
		}
	}else{
		MapCloud.account.showLoginPanel();
		$(".map-panel").css("display","none");
	}



	// 日期相加
	MapCloud.dateAdd =  function(date,interval,units){
		var ret = new Date(date); //don't change original date
		switch(interval.toLowerCase()) {
			case 'year'   :  ret.setFullYear(ret.getFullYear() + units);  break;
			case 'quarter':  ret.setMonth(ret.getMonth() + 3*units);  break;
			case 'month'  :  ret.setMonth(ret.getMonth() + units);  break;
			case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
			case 'day'    :  ret.setDate(ret.getDate() + units);  break;
			case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
			case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
			case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
			default       :  ret = undefined;  break;
		}
		return ret;
	}

	MapCloud.dateFormat = function(date,fmt){ //author: meizz   
		var o = {   
			"M+" : date.getMonth()+1,                 //月份   
			"d+" : date.getDate(),                    //日   
			"h+" : date.getHours(),                   //小时   
			"m+" : date.getMinutes(),                 //分   
			"s+" : date.getSeconds(),                 //秒   
			"q+" : Math.floor((date.getMonth()+3)/3), //季度   
			"S"  : date.getMilliseconds()             //毫秒   
		};   
		if(/(y+)/.test(fmt))   
			fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
		for(var k in o)   
			if(new RegExp("("+ k +")").test(fmt))   
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
		return fmt;   
	}


});