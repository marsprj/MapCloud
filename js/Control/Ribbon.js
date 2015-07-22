MapCloud.Ribbon = MapCloud.Class({
	
	height_max : "100px",
	height_min : "20px",
	ribbon : null,
	ribbonContainer : null,
	
	initialize : function(){
	
		this.ribbon = $("#ribbon_wrapper").first();
		this.ribbonContainer = $("#ribbon_container").first();

		this.hideAllRibbons();
		this.displayFirstRibbon();
		this.registerRibbonEvents();
		
		this.enableMneuEffect();
		this.registerMenuEvents();
	},
	
	destory : function(){
	},
	
	hideAllRibbons : function(){
		$(".ribbon_panel").each(function() {
			$(this).css("display","none");					
		});
	},

	displayFirstRibbon : function(){
		$("#map_ribbon").css("display","block");
	},
	
	showRibbon : function(type){
		$("#"+type+"_ribbon").css("display","block");
	},
	
	expand : function(){
		this.ribbon.css("height", this.height_max);
		this.ribbonContainer.css("height","80px");
		$("#main_panel").css("height","calc(100% - 122px)");
	},
	
	collapse : function(){
		this.ribbon.css("height", this.height_min);
		this.ribbonContainer.css("height","0px");
		$("#main_panel").css("height","calc(100% - 42px)");
	},
	
	isCollapsed : function(){
		return (this.ribbon.css("height") == this.height_min);
	},
	
	// 注册各个菜单项的事件
	registerRibbonEvents : function(){
	
		var mcribbon = this;	
		$("#ribbon_tabs li").each(function() {
						
			$(this).mouseover(function(){
				$(this).addClass("mc-theme-color-hover");
			});
			$(this).mouseout(function(){
				$(this).removeClass("mc-theme-color-hover");
			});			
			$(this).click(function(){
				var id =  $(this).attr("id");
				var type = id.substr(0, id.length-4);
				$("#ribbon_tabs li").each(function() {
                    $(this).removeClass("mc-active-tab");					
                });
				$(this).addClass("mc-active-tab");
				
				mcribbon.hideAllRibbons();
				mcribbon.showRibbon(type);
			});
        });
	},
	
	enableMneuEffect : function(){
		$(".ribbon-item").each(function(index, element) {
			$(this).mouseover(function(){
				$(this).addClass("ribbon-item-over");
			});
			$(this).mouseout(function(){
				$(this).removeClass("ribbon-item-over");
			});	
        });
	},
	
	registerMenuEvents : function(){
		var that = this;
		$(".ribbon-item").each(function(index, element) {
			$(this).click(function(e) {
				switch(index){
				// Map Events
				case 0:
					// 打开地图
					that.onGetMaps();
					break;
				case 1:
					// 新建地图
					that.onCreateMap();
					break;
				case 2:
					// 管理地图
					that.onMapMgr();
					break;
				case 3:
					// 地图属性
					that.onMapPropertis();
					break;
				// Layer Events
				case 4:
					// 新建图层
					that.onLayerNew();
					break;
				case 5:
					// WMS图层
					that.onLayerAddWMS();
					break;
				case 6:
					// WFS图层
					that.onLayerAddWFS();
					break;
				case 7:
					// WMTS图层
					that.onLayerAddWMTS();
					break;

				case 8:
					// 新建图层
					that.onLayerNew();
					break;
				case 9:
					// 编辑图层
					// that.onEditLayer();
					break;
				case 10:
					// 分享图层
					that.onShareLayer();
					break;
				case 11:
					// that.onCreateLayer();
					break;
				case 12:
					//复制图层
					that.onDuplicateLayer();
					break;
				case 13:
					//删除图层
					that.onRemoveLayer();
					break;
				case 14:
					//图层定位
					that.onZoomLayer();
					break;
				case 15:
					//选择所有
					that.onSelectAllLayers();
					break;
				case 16:
					//导入图层
					that.onImportLayer();
					break;
				case 17:
					//导出图层
					that.onExportLayer();
					break;
				//Data Events
				case 18:
					// 文件管理
					that.onFile();
					break;
				case 19:
					//数据库管理
					that.onDataSource();
					break;
				case 20:
					// 导入矢量
					that.onImportVector();
					break;
				case 21:
					// 	导入影像
					that.onImportImage();
					break;
				// Chart Events
				case 22:
					// 分级图
					that.onAddRangeChart();
					break;
				case 23 :
					// 柱状图
					that.onAddBarChart();
					break;
				case 24:
					// 饼状图
					that.onAddPieChart();
					break;
				case 25:
					// 热力图
					that.onHeatMap();
					break;
				case 26:
					that.onAQI();
					break;
				case 27:
					that.onAQITimeline();
					break;
				// Tools Events
				case 28:
					// 标注
					that.onLayerAddVector();
					break;
				case 29:
					// 图层样式
					that.onStyleManager();
					break;
				};
			});
        });
	},

	/**************************************************************/
	/* Map Event                                                  */
	/**************************************************************/
	// 打开地图
	onGetMaps : function(){
		MapCloud.get_maps_dlg.showDialog();
	},

	// 新建地图
	onCreateMap : function(){
		MapCloud.create_map_dlg.showDialog();
	},

	// 管理地图
	onMapMgr : function(){
		MapCloud.map_mgr_dialog.showDialog();
	},

	// 地图属性
	onMapPropertis : function(){
		alert("onMapPropertis");
	},

	
	/**************************************************************/
	/* Layer Event                                                */
	/**************************************************************/
	// 新建图层
	onLayerNew : function(){
		MapCloud.new_layer_dialog.showDialog();
	},

	// WMS图层
	onLayerAddWMS : function(){
		MapCloud.wms_dialog.showDialog();
	},

	// WFS图层
	onLayerAddWFS : function(){
		MapCloud.wfs_datasource_dialog.showDialog();
	},

	// WMTS图层
	onLayerAddWMTS : function(){
		MapCloud.wmts_dialog.showDialog();
	},

	// 分级图
	onAddRangeChart : function(){
		MapCloud.chart_panel.showPanel();
	},

	// 柱状图
	onAddBarChart : function(){
		MapCloud.bar_chart_panel.showPanel();
	},

	// 饼状图
	onAddPieChart : function(){
		MapCloud.pie_chart_panel.showPanel();
		// MapCloud.chart_dialog.showDialog();
		// MapCloud.chart_dialog.setChartType("pie");
	},

	// 编辑图层
	onEditLayer: function(){
		alert("edit");
	},
	
	// 分享图层
	onShareLayer:function(){
		alert("share");
	},

	// 复制图层
	onDuplicateLayer:function(){
		if(confirm("你确定要复制图层吗？")){
			alert("复制图层并刷新tree");
		}
	},

	// 删除图层
	onRemoveLayer : function(){
		if($("#layers_row .layer_row.layer_row_selected").length == 0){
			MapCloud.alert_info.showInfo("请选择图层","Warning");
			return;			
		}
		var layerName = $("#layers_row .layer_row.layer_row_selected").attr("lname");
		if(layerName == null){
			return;
		}
		if(confirm("你确定要删除图层吗？")){
			mapObj.removeLayer(layerName,this.removeLayer_callback);
		}
	},

	removeLayer_callback : function(result){
		MapCloud.alert_info.showInfo(result,"删除图层");
		var panel = MapCloud.refresh_panel;
		panel.refreshPanel();
	},

	// 图层定位
	onZoomLayer:function(){
		if($("#layers_row .layer_row.layer_row_selected").length == 0){
			MapCloud.alert_info.showInfo("请选择图层","Warning");
			return;			
		}
		var layerName = $("#layers_row .layer_row.layer_row_selected").attr("lname");
		if(layerName == null){
			return;
		}
		mapObj.zoomToLayer(layerName);
	},
	
	// 选择所有图层
	onSelectAllLayers:function(){
		alert("选择所有图层");
	},

	// 导入图层
	onImportLayer:function(){
		alert("导入图层");
	},
	
	// 导出图层
	onExportLayer:function(){
		alert("导出图层");
	},
	onCreateLayer:function(){
		if(MapCloud.create_layer_dialog == null){
			MapCloud.create_layer_dialog = new MapCloud.CreateLayerDialog("create_layer_dialog");
		}
		MapCloud.create_layer_dialog.showDialog();
	},

	/**************************************************************/
	/* Data Event                                                */
	/**************************************************************/
	// 新增图表
	addChart:function(){
		// if($("#layers_row .layer_row.layer_row_selected").length == 0){
		// 	MapCloud.alert_info.showInfo("请选择图层","Warning");
		// 	return;			
		// }
		// var layerName = $("#layers_row .layer_row.layer_row_selected").attr("lname");
		// var layer = mapObj.getLayer(layerName);
		// if(layer == null){
		// 	return;
		// }
		MapCloud.chart_panel.showPanel();
		// MapCloud.chart_panel.setLayer(layer);
		// alert('新增图表');
		// if(MapCloud.new_chart_dialog == null){
		// 	MapCloud.new_chart_dialog = new MapCloud.NewChartDialog("newChartDialog");
		// }
		// MapCloud.new_chart_dialog.showDialog();		

	},

	// 文件管理
	onFile : function(){
		MapCloud.file_dialog.showDialog();
	},

	// 数据源管理
	onDataSource : function(){
		// MapCloud.data_source_dialog.showDialog();
		MapCloud.db_admin_dialog.showDialog();
	},

	//导入矢量
	onImportVector : function(){
		MapCloud.importVector_dialog.showDialog();
	},

	//导入影像
	onImportImage : function(){
		alert("导入影像")
	},


	/**************************************************************/
	/* Tool Event                                                */
	/**************************************************************/
	// 热力图
	onHeatMap : function(){
		var layerName = $("#layers_row .layer_row_selected")
			.attr("lname");
		if(layerName == null || layerName == ""){
			MapCloud.alert_info.showInfo("请选择图层","Warning");
			return;
		}
		var layer = mapObj.getLayer(layerName);
		if(layer == null){
			return;
		}
		var geomType = layer.geomType;
		if(geomType != GeoBeans.Geometry.Type.POINT &&
			geomType != GeoBeans.Geometry.Type.MULTIPOINT){
			MapCloud.alert_info.showInfo("请选择点图层","Warning");
			return;
		}
		MapCloud.alert_info.hide();
		MapCloud.heatMap_dialog.showDialog();
		MapCloud.heatMap_dialog.setLayer(layer);
	},

	onAQI : function(){
		// MapCloud.aqi_dialog.showDialog();
		MapCloud.aqi_chart_panel.showPanel();
	},

	onAQITimeline : function(){
		MapCloud.aqi_timeline_chart_panel.showPanel();
	},

	// 标注
	onLayerAddVector : function(){
		MapCloud.overlay_panel.show();
	},

	// 图层样式
	onStyleManager : function(){
		MapCloud.styleManager_dialog.showDialog();
	}
});
	