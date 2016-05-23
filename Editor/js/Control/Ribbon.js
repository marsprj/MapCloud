MapCloud.Ribbon = MapCloud.Class({
	
	height_max : "100px",
	height_min : "20px",
	ribbon : null,
	ribbonContainer : null,

	// 得到的地图
	maps : null,
	// 每页显示的个数
	maxCount : null,
	// 页数
	pageCount : null,
	
	// 显示的页数
	pageNumber : 5,

	initialize : function(){
	
		this.ribbon = $("#ribbon_wrapper").first();
		this.ribbonContainer = $("#ribbon_container").first();

		this.hideAllRibbons();
		this.displayFirstRibbon();
		this.registerRibbonEvents();
		
		this.enableMneuEffect();
		this.registerMenuEvents();
		// this.registerPageEvent();
	},
	
	destory : function(){
	},
	
	hideAllRibbons : function(){
		$(".ribbon_panel").each(function() {
			$(this).css("display","none");					
		});
	},

	displayFirstRibbon : function(){
		// $("#map_ribbon").css("display","block");
		$("#home_ribbon").css("display","block");
	},
	
	showRibbon : function(type){
		$("#"+type+"_ribbon").css("display","block");
		if(type == "home"){
			this.showMapListPanel();
			$(".query-map-name").val("");
		}else{
			// 刷新地图
			if(mapObj != null && $("#main_panel").css("display") == "none"){
				$("#map_list_panel").css("display","none");
				$("#main_panel").css("display","block");
				// mapManager.refreshMap(mapObj,this.refreshMap_callback);
			}else{
				$("#map_list_panel").css("display","none");
				$("#main_panel").css("display","block");
			}
		}
	},
	
	showMapListPanel : function(){
		$("#map_list_panel").css("display","block");
		$("#main_panel").css("display","none");
		mapManager.getMaps(this.getMaps_callback);
	},

	showMapPanel : function(){
		$("#map_list_panel").css("display","none");
		$("#main_panel").css("display","block");
	},

	expand : function(){
		this.ribbon.css("height", this.height_max);
		this.ribbonContainer.css("height","80px");
		$("#main_panel").css("height","calc(100% - 122px)");
		$("#map_list_panel").css("top","122px");
		mapManager.getMaps(ribbonObj.getMaps_callback);
		$("#ribbon_container").bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
		function(){ 
			if(mapObj != null){
				mapObj.resize("height");
			}
		});
	},
	
	collapse : function(){
		this.ribbon.css("height", this.height_min);
		this.ribbonContainer.css("height","0px");
		$("#main_panel").css("height","calc(100% - 42px)");
		$("#map_list_panel").css("top","42px");
		mapManager.getMaps(ribbonObj.getMaps_callback);
		$("#ribbon_container").bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
		function(){ 
			if(mapObj != null){
				mapObj.resize("height");
			}
		});	
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
		$(".btn-new-map").click(function(){
			// 新建地图
			that.onCreateMap();
		});


		$(".query-map-name").on("input",function(e){
			that.onQueryMap($(this).val());
		});
		
		$(".ribbon-item").each(function(index, element) {
			$(this).click(function(e) {
				switch(index){
				// Map Events
				case 0:
					// 新建地图
					that.onCreateMap();
					break;
				case 1:
					// 关闭地图
					that.onCloseMap();
					break;
				case 2:
					// 删除地图
					that.onRemoveMap();
					break;
				// case 3:
				// 	// 保存地图
				// 	that.onSaveMap();
				// 	break;
				// case 4:
				// 	that.onRefreshMap();
				// 	break;
				case 3:
					// 地图属性
					that.onMapPropertis();
					break;
				case 4:
					// 数据目录
					that.onDataSourcePanel();
					break;
				// Layer Events
				case 5:
				case 13:
					// 添加矢量图层
					that.onLayerNew();
					break;
				case 6:
				case 14:
					// 添加栅格图层
					that.onAddRasterLayer();
					break;
				case 7:
				case 15:
					// WMS图层
					that.onLayerAddWMS();
					break;
				case 8:
				case 16:
					// WFS图层
					that.onLayerAddWFS();
					break;
				case 9:
				case 17:
					// WMTS图层
					that.onLayerAddWMTS();
					break;
				case 10:
				case 18:
					// 影像底图
					that.onAddBaseLayer("image");
					break;
				case 11:
				case 19:
					// 矢量底图
					that.onAddBaseLayer("vector");
					break;
				case 12:
				case 20:
					// 全景图
					that.onAddPanorama();
					break;
				// case 13:
				// 	// 新建图层
				// 	that.onLayerNew();
				// 	break;
				// case 14:
				// 	// 编辑图层
				// 	// that.onEditLayer();
				// 	break;
				// case 15:
				// 	// 分享图层
				// 	that.onShareLayer();
				// 	break;
				// case 16:
				// 	// that.onCreateLayer();
				// 	break;
				// case 17:
				// 	//复制图层
				// 	that.onDuplicateLayer();
				// 	break;
				// case 18:
				// 	//删除图层
				// 	that.onRemoveLayer();
				// 	break;
				// case 19:
				// 	//图层定位
				// 	that.onZoomLayer();
				// 	break;
				// case 20:
				// 	//选择所有
				// 	that.onSelectAllLayers();
				// 	break;
				// case 21:
				// 	//导入图层
				// 	that.onImportLayer();
				// 	break;
				// case 22:
				// 	//导出图层
				// 	that.onExportLayer();
				// 	break;
				//Data Events
				case 21:
					// 文件管理
					that.onFile();
					break;
				case 22:
					// 地理库
					that.onDataSource();
					break;
				case 23:
					// 	影像库
					that.onImportImage();
					break;
				case 24:
					// 瓦片库
					that.onTileDataSource();
					break;
				case 25:
					// 数据目录
					that.onDataSourcePanel();
					break;
				// Chart Events
				case 26:
					// 分级图
					that.onAddRangeChart();
					break;
				case 27 :
					// 柱状图
					that.onAddBarChart();
					break;
				case 28:
					// 饼状图
					that.onAddPieChart();
					break;
				case 29:
					// 等级符号图
					that.onAddSymbolChart();
					break;
				case 30:
					// 分级+等级符号
					that.onAddRangeSymbolChart();
					break;
				case 31:
					// 点聚合图
					that.onAddClusterLayer();
					break;
				case 32:
					// 热力图
					that.onHeatMap();
					break;
				case 33:
					that.onAQI();
					break;
				case 34:
					that.onAQITimeline();
					break;
				case 35:
					// 航线图
					that.onAirline();
					break;
				// Tools Events
				case 36:
					// 标注
					that.onLayerAddVector();
					break;
				case 37:
					// 图层样式
					that.onStyleManager();
					break;
				case 38:
					// 工具箱
					that.onTools();
					break;
				case 39:
					// 进程管理
					that.onProcess();
					break;
				case 40:
					that.onVersion();
					break;
				default :
					break;
				};
			});
        });
	},

	/**************************************************************/
	/* Map Event                                                  */
	/**************************************************************/

	// 新建地图
	onCreateMap : function(){
		MapCloud.create_map_dlg.showDialog();
	},

	// 关闭地图
	onCloseMap : function(){
		if(mapObj == null){
			MapCloud.notify.showInfo("当前地图为空","Warning");
			return;
		}
		$(".mc-panel").css("display","none");
		MapCloud.refresh_panel.cleanup();
		mapObj.close();
		mapObj = null;

	},

	// 删除地图
	onRemoveMap : function(){
		if(mapObj == null){
			MapCloud.notify.showInfo("当前地图为空","Warning");
			return;
		}
		if(!confirm("确定要删除当前地图吗？")){
			return;
		}
		var result = mapManager.removeMap(mapObj.name);
		var info = "Remove Map [ " + mapObj.name + " ]";
		MapCloud.notify.showInfo(result,info);
		MapCloud.refresh_panel.cleanup();
		mapObj.close();
		mapObj = null;
	},

	// 保存地图
	onSaveMap : function(){
		if(mapObj == null){
			MapCloud.notify.showInfo("当前地图为空","Warning");
			return;
		}
		mapManager.saveMap(mapObj,this.saveMap_callback);
	},

	// 刷新地图
	onRefreshMap : function(){
		if(mapObj == null){
			MapCloud.notify.showInfo("当前地图为空","Warning");
			return;
		}
		var extent = mapObj.viewer;
		var map = mapManager.getMap("mapCanvas_wrapper",mapObj.name);
		if(map == null){
			MapCloud.notify.showInfo("failed","刷新地图");
		}else{
			MapCloud.notify.showInfo("success","刷新地图");
			mapObj = map;
			MapCloud.refresh_panel.refreshPanel();
			MapCloud.dataGrid.cleanup();
			mapObj.setViewer(extent);
			mapObj.draw();
		}
	},

	saveMap_callback : function(result){
		MapCloud.notify.showInfo(result,"保存地图");
	},

	// 地图属性
	onMapPropertis : function(){
		if(mapObj == null){
			MapCloud.notify.showInfo("当前地图为空","Warning");
			return;
		}
		MapCloud.map_info_dialog.showDialog(mapObj);		
	},

	// 数据目录
	onDataSourcePanel : function(){
		MapCloud.data_source_panel.showPanel();
	},
	
	/**************************************************************/
	/* Layer Event                                                */
	/**************************************************************/
	// 新建图层
	onLayerNew : function(){
		MapCloud.new_layer_dialog.showDialog();
	},

	// 栅格图层
	onAddRasterLayer : function(){
		MapCloud.new_raster_dblayer_dialog.showDialog();
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

	onAddBaseLayer : function(type){
		MapCloud.base_layer_dialog.showDialog(type);
	},

	// 全景图添加与显示
	onAddPanorama : function(){
		if(mapObj == null){
			MapCloud.notify.showInfo("当前地图为空","Warning");
			return;
		}
		if(mapObj.panoramaLayer.overlays.length == 0){
			this.addPanorama();
		}else{
			mapObj.clearPanoramas();
			mapObj.draw();
		}
	},
	// 添加全景图
	addPanorama : function(){
		var rootPath = "http://192.168.111.152:8088/panorama/";
		var icon = "../images/360.png";

		var point = new GeoBeans.Geometry.Point(109.2113,18.2910);
		var name = "南海观音";
		var html = rootPath + "nanshan12.html";
		mapObj.addPanorama(point,name,html,icon);

		point = new GeoBeans.Geometry.Point(109.3446,18.2887);
		name = "天涯海角";
		html = rootPath + "sanyawan7.html";
		mapObj.addPanorama(point,name,html,icon);

		point = new GeoBeans.Geometry.Point(109.4899,18.2611);
		name = "三亚湾";
		html = rootPath + "sanyawan2.html";
		mapObj.addPanorama(point,name,html,icon);

		point = new GeoBeans.Geometry.Point(109.6313,18.2300);
		name = "美高梅";
		html = rootPath + "GRANDjiudianshatan3.html";
		mapObj.addPanorama(point,name,html,icon);

		point = new GeoBeans.Geometry.Point(109.5156,18.2310);
		name = "免税店";
		html = rootPath + "sanyamianshuidian.html";
		mapObj.addPanorama(point,name,html,icon);

		point = new GeoBeans.Geometry.Point(109.311399,18.3131264);
		name = "办公楼会议室";
		html = rootPath + "bangonglouhuiyishi.html";
		mapObj.addPanorama(point,name,html,icon);

		point = new GeoBeans.Geometry.Point(109.311388,18.313209);
		name = "办公楼走道";
		html = rootPath + "bangonglouzoudao4.html";
		mapObj.addPanorama(point,name,html,icon);

		point = new GeoBeans.Geometry.Point(109.311384,18.313269);
		name = "办公楼机房";
		html = rootPath + "jieshouzhanjifang2.html";
		mapObj.addPanorama(point,name,html,icon);


		point = new GeoBeans.Geometry.Point(109.311010,18.312646);
		name = "财务楼报告厅";
		html = rootPath + "caiwuloubaogaoting.html";
		mapObj.addPanorama(point,name,html,icon);

		point = new GeoBeans.Geometry.Point(109.311476,18.312623);
		name = "财务楼大厅";
		html = rootPath + "caiwuloudating.html";
		mapObj.addPanorama(point,name,html,icon);

		point = new GeoBeans.Geometry.Point(109.311561,18.313199);
		name = "办公楼";
		html = rootPath + "yaogansuojieshouzhan22.html";
		mapObj.addPanorama(point,name,html,icon);

		point = new GeoBeans.Geometry.Point(109.31156,18.312892);
		name = "室外";
		html = rootPath + "yaogansuojieshouzhan5.html";
		mapObj.addPanorama(point,name,html,icon);

		var viewer = new GeoBeans.Envelope(108.5077,17.8683,110.8703,19.3634);
		mapObj.setViewer(viewer);
		mapObj.draw();
	},

	// 分级图
	onAddRangeChart : function(){
		if(mapObj == null){
			MapCloud.notify.showInfo("当前地图为空","Warning");
			return;
		}
		MapCloud.chart_panel.showPanel();
	},

	// 柱状图
	onAddBarChart : function(){
		if(mapObj == null){
			MapCloud.notify.showInfo("当前地图为空","Warning");
			return;
		}
		MapCloud.bar_chart_panel.showPanel();
	},

	// 饼状图
	onAddPieChart : function(){
		if(mapObj == null){
			MapCloud.notify.showInfo("当前地图为空","Warning");
			return;
		}
		MapCloud.pie_chart_panel.showPanel();
	},

	// 等级符号图
	onAddSymbolChart : function(){
		if(mapObj == null){
			MapCloud.notify.showInfo("当前地图为空","Warning");
			return;
		}
		MapCloud.symbol_chart_panel.showPanel();
	},

	// 分级+等级符号
	onAddRangeSymbolChart : function(){
		if(mapObj == null){
			MapCloud.notify.showInfo("当前地图为空","Warning");
			return;
		}
		MapCloud.range_symbol_chart_panel.showPanel();
	},

	// 聚合图
	onAddClusterLayer : function(){
		if(mapObj == null){
			MapCloud.notify.showInfo("当前地图为空","Warning");
			return;
		}
		MapCloud.cluster_chart_panel.showPanel();
	},

	// 编辑图层
	onEditLayer: function(){
	},
	
	// 分享图层
	onShareLayer:function(){
	},

	// 复制图层
	onDuplicateLayer:function(){
		
	},

	// 删除图层
	onRemoveLayer : function(){
		if($("#layers_row .layer_row.layer_row_selected").length == 0){
			MapCloud.notify.showInfo("请选择图层","Warning");
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
		MapCloud.notify.showInfo(result,"删除图层");
		var panel = MapCloud.refresh_panel;
		panel.refreshPanel();
	},

	// 图层定位
	onZoomLayer:function(){
		if($("#layers_row .layer_row.layer_row_selected").length == 0){
			MapCloud.notify.showInfo("请选择图层","Warning");
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
	},

	// 导入图层
	onImportLayer:function(){
	},
	
	// 导出图层
	onExportLayer:function(){
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
		MapCloud.chart_panel.showPanel();
	},

	// 文件管理
	onFile : function(){
		MapCloud.file_dialog.showDialog();
	},

	// 数据源管理
	onDataSource : function(){
		MapCloud.vector_db_dialog.showDialog();
	},

	//导入影像
	onImportImage : function(){
		MapCloud.raster_db_dialog.showDialog();
	},

	// 瓦片库
	onTileDataSource : function(){
		MapCloud.tile_db_dialog.showDialog();
	},

	/**************************************************************/
	/* Tool Event                                                */
	/**************************************************************/
	// 热力图
	onHeatMap : function(){
		if(mapObj == null){
			MapCloud.notify.showInfo("当前地图为空","Warning");
			return;
		}
		var layerName = $("#layers_row .layer_row_selected")
			.attr("lname");
		if(layerName == null || layerName == ""){
			MapCloud.notify.showInfo("请选择图层","Warning");
			return;
		}
		var layer = mapObj.getLayer(layerName);
		if(layer == null){
			return;
		}
		var geomType = layer.geomType;
		if(geomType != GeoBeans.Geometry.Type.POINT &&
			geomType != GeoBeans.Geometry.Type.MULTIPOINT){
			MapCloud.notify.showInfo("请选择点图层","Warning");
			return;
		}
		MapCloud.notify.hideLoading();
		MapCloud.heatMap_dialog.showDialog();
		MapCloud.heatMap_dialog.setLayer(layer);
	},

	onAQI : function(){
		if(mapObj == null){
			MapCloud.notify.showInfo("当前地图为空","Warning");
			return;
		}
		MapCloud.aqi_chart_panel.showPanel();
	},

	onAQITimeline : function(){
		if(mapObj == null){
			MapCloud.notify.showInfo("当前地图为空","Warning");
			return;
		}
		MapCloud.aqi_timeline_chart_panel.showPanel();
	},

	onAirline : function(){
		if(mapObj == null){
			MapCloud.notify.showInfo("当前地图为空","Warning");
			return;
		}
		MapCloud.airline_panel.showPanel();		
	},

	// 标注
	onLayerAddVector : function(){
		MapCloud.overlay_panel.show();
	},

	// 图层样式
	onStyleManager : function(){
		MapCloud.styleManager_dialog.showDialog();
	},

	// 工具箱
	onTools : function(){
		MapCloud.gps_oper_panel.showPanel();
	},

	// 进程管理
	onProcess : function(){
		MapCloud.process_dialog.showDialog();		
	},

	// 关于
	onVersion : function(){
		MapCloud.version_dialog.showDialog();
	},

	// 定制主题
	onTopic : function(){
		// MapCloud.topicPanel.showPanel();	
		// var name = "烤串";
		var time = new Date("2015-11-24 08:42:23");
		// var time = new Date();
		var names = ["aqi",["hotel"]];
		poiManager.beginSubscribe(names,time,this.poi_callback);
	},

	poi_callback : function(time,result,aqiFeatures,pois){
		if(result != null){
			MapCloud.notify.showInfo(result,"订阅");
			return;
		}
		MapCloud.topicPanel.setResults(time,aqiFeatures,pois);
	},

	setMaps : function(maps){
		this.maps = maps;
		var mapSize = 210;
		var rowCount = Math.floor($(".map-list-col").height()/mapSize);
		var colCount = Math.floor($("#maps_list_ul").width()/mapSize);

		// 调整左右列之间的关系
		// 取整
		// 中间的范围
		var leftWidthB = $("#maps_list_ul").css("width");
		// var leftWidthB = $(".map-list-col").css("width");
		leftWidthB = parseInt(leftWidthB.slice(0,leftWidthB.lastIndexOf("px")));
		var rightWidthB = $(".map-list-info").css("width");
		rightWidthB = parseInt(rightWidthB.slice(0,rightWidthB.lastIndexOf("px")));
		var colCountFloor = Math.floor(leftWidthB/mapSize);
		// 四舍五入的
		// var colCountRound = Math.round(leftWidthB/mapSize);
		// if(colCountFloor == colCountRound){
		// 	// 右边往左边
		// 	var leftWidth = mapSize * colCountRound; 
		// 	var addWidth =  leftWidthB - leftWidth;
		// 	var rightWidth = rightWidthB + addWidth;
		// 	$(".map-list-info").css("width",rightWidth + "px");
		// 	var leftWidth = "calc( 100% - " + rightWidth + "px)";
		// 	$(".map-list-thum").css("width",leftWidth);


		// }else if(colCountFloor < colCountRound){
		// 	//左边往右边挪
		// 	var leftWidth = mapSize * colCountRound;
		// 	var addWidth =  leftWidth - leftWidthB;
		// 	// var rightWidthB
		// 	var rightWidth = rightWidthB - addWidth;
		// 	$(".map-list-info").css("width",rightWidth + "px");
		// 	var leftWidth = "calc( 100% - " + rightWidth + "px)";
		// 	$(".map-list-thum").css("width",leftWidth);
		// }
		var floorCountLeftWidth = mapSize * colCountFloor;
		var delta = leftWidthB - floorCountLeftWidth;
		var marginWidth = Math.floor(delta / colCountFloor);
		var mapSizeMarginRight = 5 + marginWidth;
		this.mapSizeMarginRight = mapSizeMarginRight;


		var count = rowCount * colCountFloor;
		this.maxCount = count;
		var pageCount = Math.ceil(maps.length / this.maxCount);
		// 页数
		this.pageCount = pageCount;
		// this.ribbonContainer.find(".query_count span").html(maps.length);
		// this.ribbonContainer.find(".pages-form-pages").html(pageCount);
		this.ribbonContainer.find(".maps-count span").html(maps.length);
		this.initPageControl(1,this.pageCount);

		// 设置页码的右边距
		var rightWidth = $(".map-list-info").css("width");
		rightWidth = parseInt(rightWidth.slice(0,rightWidth.lastIndexOf("px")));
		$("#home_ribbon .map-page-div").css("right",rightWidth + "px");

		var mapsCountWidth = $(".maps-count").css("width");
		mapsCountWidth = parseInt(mapsCountWidth.slice(0,mapsCountWidth.lastIndexOf("px")));
		var paginationWidth = $("#home_ribbon .pagination").css("width");
		paginationWidth = parseInt(paginationWidth.slice(0,paginationWidth.lastIndexOf("px")));
		var mapPageDivWidth =  mapsCountWidth + paginationWidth;
		$("#home_ribbon .map-page-div").css("width",mapPageDivWidth + "px");
	},

	// 初始化页码
	initPageControl : function(currentPage,pageCount){
		if(currentPage <=0 || currentPage > pageCount){
			return;
		}
		var html = "";
		// 前一页
		if(currentPage == 1){
			html += '<li class="disabled">'
				+ '		<a href="javascript:void(0)" aria-label="Previous">'
				+ '			<span aria-hidden="true">«</span>'
				+ '		</a>'
				+ '	</li>';
		}else{
			html += '<li>'
				+ '		<a href="javascript:void(0)" aria-label="Previous">'
				+ '			<span aria-hidden="true">«</span>'
				+ '		</a>'
				+ '	</li>';
		}
		// 如果页码总数小于要展示的页码，则每个都显示
		if(pageCount <= this.pageNumber){
			for(var i = 1; i <= pageCount; ++i){
				if(i == currentPage){
					html += '<li class="active">'
					+ 	'	<a href="javascript:void(0)">' + currentPage.toString() 
					+ 	'		<span class="sr-only">(current)</span>'
					// + 	'		<span class="sr-only">(' + currentPage + ')</span>'
					+	'</a>'
					+ 	'</li>';
				}else{
					html += "<li>"
						+ "<a href='javascript:void(0)'>" + i + "</a>"
						+ "</li>";	
				}
			}	
		}else{
			// 开始不变化的页码
			var beginEndPage = pageCount - this.pageNumber + 1;
			if(currentPage <= beginEndPage){
				for(var i = currentPage; i < currentPage + this.pageNumber;++i){
					if(i == currentPage){
						html += '<li class="active">'
						+ 	'	<a href="javascript:void(0)">' + currentPage
						// + 	'		<span class="sr-only">(current)</span>'
						+	'</a>'
						+ 	'</li>';
					}else{
						html += "<li>"
							+ "<a href='javascript:void(0)'>" + i + "</a>"
							+ "</li>";	
					}					
				}
			}else{
				for(var i = beginEndPage; i <= pageCount; ++i){
					if(i == currentPage){
						html += '<li class="active">'
						+ 	'	<a href="javascript:void(0)">' + currentPage
						// + 	'		<span class="sr-only">(current)</span>'
						+	'</a>'
						+ 	'</li>';
					}else{
						html += "<li>"
							+ "<a href='javascript:void(0)'>" + i + "</a>"
							+ "</li>";	
					}
				}
			}
		}
		
		// 最后一页
		if(currentPage == pageCount){
			html += '<li class="disabled">'
				+ '		<a href="javascript:void(0)" aria-label="Next">'
				+ '			<span aria-hidden="true">»</span>'
				+ '		</a>'
				+ '	</li>';
		}else{
			html += '<li>'
				+ '		<a href="javascript:void(0)" aria-label="Next">'
				+ '			<span aria-hidden="true">»</span>'
				+ '		</a>'
				+ '	</li>';
		}

		$("#home_ribbon .pagination").html(html);

		this.registerPageEvent();

		// show currentPage Map
		var startIndex = (currentPage-1) * this.maxCount;
		var endIndex = currentPage*this.maxCount - 1;
		this.showMaps(startIndex,endIndex);
	},
	

	// NEW 翻页事件
	registerPageEvent : function(){
		var that = this;
		$("#home_ribbon .pagination li a").click(function(){
			var active = $("#home_ribbon .pagination li.active a").html();
			var currentPage = parseInt(active);

			var label = $(this).attr("aria-label");
			if(label == "Previous"){
				currentPage = currentPage - 1;
			}else if(label == "Next"){
				currentPage = currentPage + 1;
			}else{
				currentPage = parseInt($(this).html());
			}
			
			that.initPageControl(currentPage,that.pageCount);
		});
	},


	showMaps : function(startIndex,endIndex){
		$("#map-infos").css("display","none");
		
		if(this.maps == null){
			return;
		}
		var html = "";
		var that = this;
		for(var i = startIndex; i <= endIndex && i < this.maps.length; ++i){
			var map = this.maps[i];
			var name = map.name;
			var thumbnail = map.thumbnail;
			var aHtml = "";
			if(thumbnail != null){
				aHtml = 	"	<a href='javascript:void(0)' class='map-thumb' style=\"background-image:url("
						+			thumbnail + ")\"></a>";
			}else{
				aHtml = 	"	<a href='javascript:void(0)' class='map-thumb'></a>";
			}
			html += "<li class='maps-thumb' name='" + name + "'>"
				+	aHtml
				+ 	"	<div class='caption text-center'>"
				+ 	"		<h6>" + name + "</h6>"
				+ 	"	</div>"
				+ 	"</li>";	
		}
		$("#maps_list_ul").html(html);
		if(this.mapSizeMarginRight != null){
			$("#maps_list_ul li").css("margin-right",this.mapSizeMarginRight + "px");
		}

		//  展示第一个
		var firstMap = $("#maps_list_ul").find("li").first();
		firstMap.find("a").addClass("selected");
		var name = firstMap.attr("name");
		mapManager.getMapObj(name,this.showMapInfo);

		that.registerMapListClickEvent();
	},

	// 点击，双击地图列表事件
	registerMapListClickEvent : function(){
		var that = this;
		var DELAY = 300, clicks = 0, timer = null;
		$("#maps_list_ul").find(".map-thumb").click(function(){
			clicks++;
			if(clicks == 1){
				var node = this;
				timer = setTimeout(function() {
			        console.log("Single Click");  //perform single-click action    
			        $("#maps_list_ul").find(".map-thumb").removeClass("selected");
					$(node).addClass("selected");
					var name = $(node).parent().attr("name");
					mapManager.getMapObj(name,that.showMapInfo);

			        clicks = 0;             //after action performed, reset counter
			    }, DELAY);
			}else{
				clearTimeout(timer);    //prevent single-click action
				console.log("Double Click");  //perform double-click action
				var name = $(this).parent().attr("name");
				MapCloud.notify.loading();
				if(mapObj != null){
					mapObj.close();
				}
				mapObj = null;
				// that.showMapPanel();
				that.showMapTab();
				var info = "打开地图[" + name + "]";
				mapObj = mapManager.getMap("mapCanvas_wrapper",name);
				if(mapObj == null){
					MapCloud.notify.showInfo("Warning",info + "失败");
				}else{
					mapObj.setNavControl(false);
					$(".mc-panel").css("display","none");
					mapObj.draw();
					mapObj.addEventListener(GeoBeans.Event.MOUSE_MOVE, MapCloud.tools.onMapMove);
					MapCloud.refresh_panel.refreshPanel();
					MapCloud.dataGrid.cleanup();
					MapCloud.notify.showInfo("success",info);
				}
				clicks = 0;  
			}
		}).dblclick(function(e){
			e.preventDefault();
		});
	},

	// 显示地图的页面
	showMapTab : function(){
		$("#ribbon_tabs li").removeClass("mc-active-tab");
		$("#ribbon_tabs #map_tab").addClass("mc-active-tab");
		this.hideAllRibbons();
		this.showRibbon("map");
	},

	getMaps_callback : function(maps){
		MapCloud.notify.hideLoading();
		$(".map-list-info").css("display","none");
		$("#maps_list_ul").empty();
		ribbonObj.setMaps(maps);
		// ribbonObj.setPage(1);
	},

	// 展示地图的信息
	showMapInfo : function(map){
		$(".map-list-info").css("display","block");
		if(map == null){
			return;
		}
		var name = map.name;
		var srid = map.srid;
		$(".map-list-info .map-info-name").html(name);
		$(".map-list-info .map-info-srid").html(srid);

		var extent = map.extent;
		if(extent != null){
			var extentStr = extent.xmin.toFixed(2) + " , " + extent.ymin.toFixed(2)
					+ " , " + extent.xmax.toFixed(2) + " , " + extent.ymax.toFixed(2);
			$(".map-list-info .map-info-extent").html(extentStr);
		}

		// layer
		$(".map-list-info .map-info-layers").empty();
		// var layers = map.getLayers();
		var layers = map.layers;
		var layer = null;
		var name = null;
		var extent = null;
		var geomType = null;
		var html = "";
		var baseLayer = map.baseLayer;
		if(baseLayer != null){
			var name = baseLayer.name;
			var type = null;
			if(baseLayer.type == GeoBeans.Layer.TileLayer.Type.QS){
				type = "QuadServer";
			}else if(baseLayer.type == GeoBeans.Layer.TileLayer.Type.WMTS){
				type = "WMTS";
			}

			html += '<div class="map-info-layer-heading">'
				+	'	<span>' + name +  '</span>'
				+	'</div>';
			if(type != null){
				html +=	'<div class="map-info-row">'
						+ 	'	<span class="map-info-item">类型：</span>'
						+	'	<span class="map-info-name">' + type + '</span>'
						+	'</div>';
			}
			extent = baseLayer.extent;
			if(extent != null){
				var extentStr = extent.xmin.toFixed(2) + " , " + extent.ymin.toFixed(2)
					+ " , " + extent.xmax.toFixed(2) + " , " + extent.ymax.toFixed(2);
				html +=	'<div class="map-info-row">'
					+ 	'	<span class="map-info-item">范围：</span>'
					+	'	<span class="map-info-name">' + extentStr + '</span>'
					+	'</div>';
			}	

		}
		for(var i = 0; i < layers.length; ++i){
			layer = layers[i];
			if(layer == null){
				continue;
			}
			name = layer.name;
			geomType = layer.geomType;
			

			html += '<div class="map-info-layer-heading">'
				+	'	<span>' + name +  '</span>'
				+	'</div>';
			if(geomType != null){
				html +=	'<div class="map-info-row">'
					+ 	'	<span class="map-info-item">类型：</span>'
					+	'	<span class="map-info-name">' + geomType + '</span>'
					+	'</div>';
			}
			extent = layer.extent;
			if(extent != null){
				var extentStr = extent.xmin.toFixed(2) + " , " + extent.ymin.toFixed(2)
					+ " , " + extent.xmax.toFixed(2) + " , " + extent.ymax.toFixed(2);
				html +=	'<div class="map-info-row">'
					+ 	'	<span class="map-info-item">范围：</span>'
					+	'	<span class="map-info-name">' + extentStr + '</span>'
					+	'</div>';
			}	
		}
		$(".map-list-info .map-info-layers").append(html);
	},

	// 查询地图
	onQueryMap : function(mapName){
		if(mapName == null ){
			return;
		}
		var maps = null;
		if(mapName == ""){
			maps = mapManager.maps;
			if(mapManager.maps != null){
				this.setMaps(maps);
				return;
			}
		}else{
			maps = mapManager.getMapByNameChar(mapName);
		}
		if(maps == null ||maps.length == 0){
			return;
		}
		var map = null;
		var html = "";
		for(var i = 0; i < maps.length; ++i){
			map = maps[i];
			var name = map.name;
			var thumbnail = map.thumbnail;
			var aHtml = "";
			if(thumbnail != null){
				aHtml = 	"	<a href='javascript:void(0)' class='map-thumb' style=\"background-image:url("
						+			thumbnail + ")\"></a>";
			}else{
				aHtml = 	"	<a href='javascript:void(0)' class='map-thumb'></a>";
			}
			html += "<li class='maps-thumb' name='" + name + "'>"
				+	aHtml
				+ 	"	<div class='caption text-center'>"
				+ 	"		<h6>" + name + "</h6>"
				+ 	"	</div>"
				+ 	"</li>";	
		}
		$("#maps_list_ul").html(html);	
		
		// 展示第一个
		var firstMap = $("#maps_list_ul").find("li").first();
		firstMap.find("a").addClass("selected");
		var name = firstMap.attr("name");
		mapManager.getMapObj(name,this.showMapInfo);
		// var map = mapManager.getMap("mapCanvas_wrapper",name);
		// this.showMapInfo(map);

		$(".btn-list-maps").removeClass("disabled");

		this.registerMapListClickEvent();
	},

	refreshMap_callback : function(result){
		mapObj.draw();
		MapCloud.refresh_panel.refreshPanel();
	}


});
	