var mapObj = null;
var ribbonObj = null;
var mapManager = null;
var dbsManager = null;
var url = "/ows/user1/mgr";

$().ready(function(){
	MapCloud.alert_info 
		= new MapCloud.AlertInfo("alert_info","alert_loading"); 
	MapCloud.get_maps_dlg 
		= new MapCloud.GetMapsDialog("getMapsDialog");
	MapCloud.map_mgr_dialog 
		= new MapCloud.MapMgrDialog("mapMgrDialog");
	MapCloud.create_map_dlg 
		= new MapCloud.CreateMapDialog("createMapDialog");
	MapCloud.data_source_dialog 
		= new MapCloud.DataSourceDialog("dataSourceDialog");
	MapCloud.pgis_connection_dialog 
		= new MapCloud.PGISConnectDialog("pgisConnDialog");
	MapCloud.new_layer_dialog
		= new MapCloud.NewLayerDialog("newLayerDialog");

	MapCloud.style_dialog 
		= new MapCloud.StyleDialog("style-dialog");
	MapCloud.styleName_dialog 
	= new MapCloud.StyleNameDialog("style-name-dialog");
	// MapCloud.styleMgr_dialog 
		// = new MapCloud.StyleMgrDialog("style-mgr-dialog");

	MapCloud.styleManager_dialog
		= new MapCloud.StyleManagerDialog("style-mgr-dialog");
	MapCloud.heatMap_dialog 
		= new MapCloud.HeatMapDialog("heatMapDialog");
	MapCloud.importVector_dialog
		= new MapCloud.ImportVectorDialog("importVectorDialog");
	MapCloud.refresh_panel 
		= new MapCloud.refresh("left_panel");
	// $(".layer_row_quick_tool ul.layer_row_quick_tool_ul").sortable("disable");

	var logo = new MapCloud.Logo();	
	// var layersTree = new MapCloud.LayerTree();	
	ribbonObj = new MapCloud.Ribbon();
	var mapBarObj = new MapCloud.MapBar();
	MapCloud.dataGrid 
	= new MapCloud.DataGrid("datagrid_wrapper");
	
	mapManager = new GeoBeans.MapManager(url);
	dbsManager = new GeoBeans.DBSManager(url);

	// mapObj = new GeoBeans.Map("mapCanvas_wrapper");
	

	// var datagrid_collapsed = true;
	// $("#datagrid_wrapper .panel-header-collapse").click(function(){
	// 	if(datagrid_collapsed){
	// 		$("#datagrid_wrapper").css("height","300px");
	// 		$("#mapCanvas_wrapper").css("bottom","300px");
	// 		$(this).removeClass("mc-icon-close");
	// 		$(this).addClass("mc-icon-expand");
	// 		datagrid_collapsed = false;
	// 		mapObj.resize();
	// 	}else{
	// 		$("#datagrid_wrapper").css("height","30px");
	// 		$("#mapCanvas_wrapper").css("bottom","30px");
	// 		$(this).addClass("mc-icon-close");
	// 		$(this).removeClass("mc-icon-expand");
	// 		datagrid_collapsed = true;
	// 		mapObj.resize();
	// 	}

	// });

	$("#right_panel .panel-header-collapse").click(function(){
//		$("#center_panel").css("right","0px");
		$("#right_panel").css("display","none");
		$("#center_panel").removeClass("col-md-7");
		$("#center_panel").removeClass("col-xs-7");
		$("#center_panel").removeClass("col-lg-7");
		$("#center_panel").addClass("col-md-9");
		$("#center_panel").addClass("col-xs-9");
		$("#center_panel").addClass("col-lg-9");


	});

/*-------------------原有方式进行监听---------------------*/
	//新版调整不显示
	// mapObj.addEventListener("mousewheel", MapCloud.resizeCharts);



	// var canvas = mapObj.canvas;
	var onMouseDown = function(e){
		e.preventDefault();
		var mouseX = e.layerX;
		var mouseY = e.layerY;
		var onMouseMove = function(e){
			e.preventDefault();
			var moveMouseX = e.layerX;
			var moveMouseY = e.layerY;
			var d_x = moveMouseX - mouseX;
			var d_y = moveMouseY - mouseY;

			var mapCanvasWidth = $("#mapCanvas").width();
			var mapCanvasHeight = $("#mapCanvas").height();	

			for(var i = 0; i < MapCloud.wfs_layer_chart.length; ++i){
				var wfsLayerChart = MapCloud.wfs_layer_chart[i];
				if(wfsLayerChart == null ||wfsLayerChart.showFlag == false){
					continue;
				}
				var chartsArray = wfsLayerChart.chartsArray;
				for(var j = 0; j < chartsArray.length; ++j){
					var chart = chartsArray[j];
		
					chart.move(d_x,d_y);//先调整位置,进行移动
					// 再判断要不要显示
					if(chart.screenX < 0 || chart.screenY < 0 || 
						chart.screenX > mapCanvasWidth || chart.screenY > mapCanvasHeight){
						//不需要显示的
						if(chart.showFlag){
							$("#" + chart.id).remove();		
						}
						chart.showFlag = false;
					}else{
						//需要显示的
						var interSetFlag = false;
						// 继而判断和以前的有没有交集
						for(var k = 0; k < j; ++k){
							var chartPre = chartsArray[k];
							if(chartPre.showFlag && chart.intersectRect(chartPre)){
								// 此时有交集
								interSetFlag = true;
								break;
							}
						}
						if(interSetFlag){
							$("#" + chart.id).remove();	
							chart.showFlag = false;	
						}else{
							//此时没有交集，应该显示
							if(chart.showFlag){
								// 以前就显示的
								var panel = $("#" + chart.id);
								panel.height(chart.height);
								panel.width(chart.width);
								panel.css("left",chart.screenX);
								panel.css("top",chart.screenY);					
								chart.chart.resize();
							}else{
								// 以前没有的
								chart.show();
							}
							chart.showFlag = true;					
						}
					}					
				}
			}			
			mouseX = moveMouseX;
			mouseY = moveMouseY;
		};
		var onMouseUp = function(e)	{
			e.preventDefault();
			canvas.removeEventListener("mousemove", onMouseMove);
			canvas.removeEventListener("mouseup", onMouseUp);

		}
		canvas.addEventListener("mousemove", onMouseMove);
		canvas.addEventListener("mouseup", onMouseUp);
	}
	// canvas.addEventListener("mousedown", onMouseDown);

});