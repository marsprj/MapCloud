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
		}else{
			this.showMapPanel();
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
		$(".btn-new-map").click(function(){
			// 新建地图
			that.onCreateMap();
		});
		$(".ribbon-item").each(function(index, element) {
			$(this).click(function(e) {
				switch(index){
				// Map Events
				case 0:
					// // 打开地图
					// that.onGetMaps();
					// 新建地图
					that.onCreateMap();
					break;
				case 1:
					// 关闭地图
					that.onCloseMap();
					break;
				case 2:
					// // 管理地图
					// that.onMapMgr();
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
					// 添加矢量图层
					that.onLayerNew();
					break;
				case 6:
					// 添加栅格图层
					that.onAddRasterLayer();
					break;
				case 7:
					// WMS图层
					that.onLayerAddWMS();
					break;
				case 8:
					// WFS图层
					that.onLayerAddWFS();
					break;
				case 9:
					// WMTS图层
					that.onLayerAddWMTS();
					break;
				case 10:
					// 影像底图
					that.onAddBaseLayer("image");
					break;
				case 11:
					// 矢量底图
					that.onAddBaseLayer("vector");
					break;
				case 12:
					// 新建图层
					that.onLayerNew();
					break;
				case 13:
					// 编辑图层
					// that.onEditLayer();
					break;
				case 14:
					// 分享图层
					that.onShareLayer();
					break;
				case 15:
					// that.onCreateLayer();
					break;
				case 16:
					//复制图层
					that.onDuplicateLayer();
					break;
				case 17:
					//删除图层
					that.onRemoveLayer();
					break;
				case 18:
					//图层定位
					that.onZoomLayer();
					break;
				case 19:
					//选择所有
					that.onSelectAllLayers();
					break;
				case 20:
					//导入图层
					that.onImportLayer();
					break;
				case 21:
					//导出图层
					that.onExportLayer();
					break;
				//Data Events
				case 22:
					// 文件管理
					that.onFile();
					break;
				case 23:
					// 地理库
					that.onDataSource();
					break;
				case 24:
					// 	影像库
					that.onImportImage();
					break;
				case 25:
					// 瓦片库
					that.onTileDataSource();
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
					// 热力图
					that.onHeatMap();
					break;
				case 30:
					that.onAQI();
					break;
				case 31:
					that.onAQITimeline();
					break;
				// Tools Events
				case 32:
					// 标注
					that.onLayerAddVector();
					break;
				case 33:
					// 图层样式
					that.onStyleManager();
					break;
				case 34:
					// 工具箱
					that.onTools();
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

	// 关闭地图
	onCloseMap : function(){
		if(mapObj == null){
			MapCloud.notify.showInfo("当前地图为空","Warning");
			return;
		}

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

	// 管理地图
	onMapMgr : function(){
		MapCloud.map_mgr_dialog.showDialog();
	},

	// 地图属性
	onMapPropertis : function(){
		// alert("onMapPropertis");
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
		// MapCloud.db_admin_dialog.showDialog();
		MapCloud.vector_db_dialog.showDialog();
	},

	//导入矢量
	onImportVector : function(){
		MapCloud.importVector_dialog.showDialog();
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
	},

	// 工具箱
	onTools : function(){
		MapCloud.gps_oper_panel.showPanel();
	},

	setMaps : function(maps){
		this.maps = maps;
		var mapSize = 220;
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
		var colCountRound = Math.round(leftWidthB/mapSize);
		if(colCountFloor == colCountRound){
			// 右边往左边
			var leftWidth = mapSize * colCountRound; 
			var addWidth =  leftWidthB - leftWidth;
			var rightWidth = rightWidthB + addWidth;
			$(".map-list-info").css("width",rightWidth + "px");
			var leftWidth = "calc( 100% - " + rightWidth + "px)";
			$(".map-list-thum").css("width",leftWidth);


		}else if(colCountFloor < colCountRound){
			//左边往右边挪
			var leftWidth = mapSize * colCountRound;
			var addWidth =  leftWidth - leftWidthB;
			// var rightWidthB
			var rightWidth = rightWidthB - addWidth;
			$(".map-list-info").css("width",rightWidth + "px");
			var leftWidth = "calc( 100% - " + rightWidth + "px)";
			$(".map-list-thum").css("width",leftWidth);
		}

		var count = rowCount * colCountRound;
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
				+ '		<a href="#" aria-label="Previous">'
				+ '			<span aria-hidden="true">«</span>'
				+ '		</a>'
				+ '	</li>';
		}else{
			html += '<li>'
				+ '		<a href="#" aria-label="Previous">'
				+ '			<span aria-hidden="true">«</span>'
				+ '		</a>'
				+ '	</li>';
		}
		// 如果页码总数小于要展示的页码，则每个都显示
		if(pageCount <= this.pageNumber){
			for(var i = 1; i <= pageCount; ++i){
				if(i == currentPage){
					html += '<li class="active">'
					+ 	'	<a href="#">' + currentPage.toString() 
					+ 	'		<span class="sr-only">(current)</span>'
					// + 	'		<span class="sr-only">(' + currentPage + ')</span>'
					+	'</a>'
					+ 	'</li>';
				}else{
					html += "<li>"
						+ "<a href='#'>" + i + "</a>"
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
						+ 	'	<a href="#">' + currentPage
						// + 	'		<span class="sr-only">(current)</span>'
						+	'</a>'
						+ 	'</li>';
					}else{
						html += "<li>"
							+ "<a href='#'>" + i + "</a>"
							+ "</li>";	
					}					
				}
			}else{
				for(var i = beginEndPage; i <= pageCount; ++i){
					if(i == currentPage){
						html += '<li class="active">'
						+ 	'	<a href="#">' + currentPage
						// + 	'		<span class="sr-only">(current)</span>'
						+	'</a>'
						+ 	'</li>';
					}else{
						html += "<li>"
							+ "<a href='#'>" + i + "</a>"
							+ "</li>";	
					}
				}
			}
		}
		
		// 最后一页
		if(currentPage == pageCount){
			html += '<li class="disabled">'
				+ '		<a href="#" aria-label="Next">'
				+ '			<span aria-hidden="true">»</span>'
				+ '		</a>'
				+ '	</li>';
		}else{
			html += '<li>'
				+ '		<a href="#" aria-label="Next">'
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
	
	// 翻页事件
	// registerPageEvent : function(){
	// 	var that = this;
	// 	this.ribbonContainer.find(".glyphicon-step-backward").each(function(){
	// 		$(this).click(function(){
	// 			var count = parseInt(that.ribbonContainer
	// 				.find(".pages-form-pages").html());
	// 			if(count >=1){
	// 				that.setPage(1);
	// 			}
	// 		});
	// 	});
	// 	//末页
	// 	this.ribbonContainer.find(".glyphicon-step-forward").each(function(){
	// 		$(this).click(function(){
	// 			var count = parseInt(that.ribbonContainer
	// 				.find(".pages-form-pages").html());
	// 			if(count >= 1){
	// 				that.setPage(count);
	// 			}
	// 		});
	// 	});

	// 	//上一页
	// 	this.ribbonContainer.find(".glyphicon-chevron-left").each(function(){
	// 		$(this).click(function(){
	// 			var page = parseInt(that.ribbonContainer
	// 				.find(".pages-form-page").val());
	// 			that.setPage(page - 1);
	// 		});	
	// 	});

	// 	//下一页
	// 	this.ribbonContainer.find(".glyphicon-chevron-right").each(function(){
	// 		$(this).click(function(){
	// 			var page = parseInt(that.ribbonContainer
	// 				.find(".pages-form-page").val());
	// 			that.setPage(page + 1);
	// 		});
	// 	});

	// },

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

	// setPage : function(page){
	// 	var pageCount = parseInt(this.ribbonContainer
	// 			.find(".pages-form-pages").html());

	// 	this.ribbonContainer.find(".pages-form-page").val(page);
	// 	if(page　== 1 ){
	// 		this.ribbonContainer.find(".glyphicon-step-backward")
	// 			.addClass("disabled");
	// 	}else{
	// 		this.ribbonContainer.find(".glyphicon-step-backward")
	// 			.removeClass("disabled");
	// 	}
	// 	if(page == pageCount){
	// 		this.ribbonContainer.find(".glyphicon-step-forward")
	// 			.addClass("disabled");
	// 	}else{
	// 		this.ribbonContainer.find(".glyphicon-step-forward")
	// 			.removeClass("disabled");
	// 	}

	// 	if(page - 1 <= 0){
	// 		this.ribbonContainer.find(".glyphicon-chevron-left")
	// 			.addClass("disabled");
	// 	}else{
	// 		this.ribbonContainer.find(".glyphicon-chevron-left")
	// 			.removeClass("disabled");
	// 	}

	// 	if(page + 1 > pageCount){
	// 		this.ribbonContainer.find(".glyphicon-chevron-right")
	// 			.addClass("disabled");
	// 	}else{
	// 		this.ribbonContainer.find(".glyphicon-chevron-right")
	// 			.removeClass("disabled");
	// 	}
	// 	if(page < 0 || page > pageCount){
	// 		return;
	// 	}
	// 	var startIndex = (page-1) * this.maxCount;
	// 	var endIndex = page*this.maxCount - 1;
	// 	this.showMaps(startIndex,endIndex);

	// },

	showMaps : function(startIndex,endIndex){
		$("#map-infos").css("display","none");
		MapCloud.notify.hideLoading();
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
				aHtml = 	"	<a href='#' class='map-thumb' style=\"background-image:url("
						+			thumbnail + ")\"></a>";
			}else{
				aHtml = 	"	<a href='#' class='map-thumb'></a>";
			}
			html += "<li class='maps-thumb' name='" + name + "'>"
				+	aHtml
				+ 	"	<div class='caption text-center'>"
				+ 	"		<h6>" + name + "</h6>"
				+ 	"	</div>"
				+ 	"</li>";	
		}
		$("#maps_list_ul").html(html);

		//  展示第一个
		var firstMap = $("#maps_list_ul").find("li").first();
		firstMap.find("a").addClass("selected");
		var name = firstMap.attr("name");
		var map = mapManager.getMap("mapCanvas_wrapper",name);
		that.showMapInfo(map);

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
					var map = mapManager.getMap("mapCanvas_wrapper",name);
					that.showMapInfo(map);
			        clicks = 0;             //after action performed, reset counter
			    }, DELAY);
			}else{
				clearTimeout(timer);    //prevent single-click action
				console.log("Double Click");  //perform double-click action
				var name = $(this).parent().attr("name");
				MapCloud.notify.loading();
				// that.showMapPanel();
				that.showMapTab();
				var info = "打开地图[" + name + "]";
				mapObj = mapManager.getMap("mapCanvas_wrapper",name);
				if(mapObj == null){
					MapCloud.notify.showInfo("Warning",info + "失败");
				}else{
					mapObj.setNavControl(false);
					mapObj.draw();
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
		$(".map-list-info").css("display","none");
		ribbonObj.setMaps(maps);
		// ribbonObj.setPage(1);
	},

	// showMapInfo : function(map){
	// 	if(map == null){
	// 		return;
	// 	}
	// 	$("#map-infos").css("display","block");
	// 	var name = map.name;
	// 	var srid = map.srid;
	// 	$("#map-infos .map-info-name").html(name);
	// 	$("#map-infos .map-info-srid").html(srid);

	// 	var extent = map.extent;
	// 	if(extent != null){
	// 		$("#map-infos .map-info-xmin").html(extent.xmin.toFixed(2));
	// 		$("#map-infos .map-info-ymin").html(extent.ymin.toFixed(2));
	// 		$("#map-infos .map-info-xmax").html(extent.xmax.toFixed(2));
	// 		$("#map-infos .map-info-ymax").html(extent.ymax.toFixed(2));
	// 	}
	// 	$("#map-infos .map-info-extent").html(extent.toString());

	// 	// 图层
	// 	$("#map-infos .layer-info-row").remove();
	// 	var layers = map.getLayers();
	// 	var layer = null;
	// 	var name = null;
	// 	var extent = null;
	// 	var html = "";
	// 	var geomType = null;
	// 	for(var i = 0; i < layers.length;++i){
	// 		layer = layers[i];
	// 		if(layer == null){
	// 			continue;
	// 		}
	// 		name = layer.name;
	// 		html += '<li class="row layer-info-row">'
	// 			+	'		<div class="col-md-3"></div>'
	// 			+	'		<div class="col-md-2">' + name + '</div>'
	// 			+	'		<div class="col-md-3"></div>'
	// 			+	'	</li>';
	// 		geomType = layer.geomType;
	// 		if(geomType != null){
	// 			html += '<li class="row layer-info-row">'
	// 			+	'		<div class="col-md-3"></div>'
	// 			+	'		<div class="col-md-2">类型:</div>'
	// 			+	'		<div class="col-md-3">'+  geomType + '</div>'
	// 			+	'	</li>';
	// 		}
	// 		extent = layer.extent;
	// 		if(extent != null){
	// 			html += '<li class="row layer-info-row">'
	// 			+	'		<div class="col-md-3"></div>'
	// 			+	'		<div class="col-md-2">范围:</div>'
	// 			+   '		<div class="col-md-1 map-layer-info-extent">xMin:</div>'
	// 			+   '		<div class="col-md-2">'+ extent.xmin.toFixed(2) + '</div>'
	// 			+   '		<div class="col-md-1 map-layer-info-extent">yMin:</div>'
	// 			+   '		<div class="col-md-2">'+ extent.ymin.toFixed(2) + '</div>'
	// 			+ 	'	</li>'
	// 			+ 	'	<li class="row layer-info-row">'
	// 			+	'		<div class="col-md-3"></div>'
	// 			+	'		<div class="col-md-2"></div>'
	// 			+   '		<div class="col-md-1 map-layer-info-extent">xMax:</div>'
	// 			+   '		<div class="col-md-2">'+ extent.xmax.toFixed(2) + '</div>'
	// 			+   '		<div class="col-md-1 map-layer-info-extent">yMax:</div>'
	// 			+   '		<div class="col-md-2">'+ extent.ymax.toFixed(2) + '</div>'
	// 			+ 	'	</li>';
	// 		}
	// 		$("#map-infos").append(html);
	// 	}
		
	// },

	showMapInfo : function(map){
		$(".map-list-info").css("display","block");
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
		var layers = map.getLayers();
		var layer = null;
		var name = null;
		var extent = null;
		var geomType = null;
		var html = "";
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
	}
});
	