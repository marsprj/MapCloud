MapCloud.Ribbon = MapCloud.Class({
	
	height_max : "100px",
	height_min : "20px",
	ribbon : null,
	ribbonContainer : null,

	// 得到的地图
	maps : null,
	// 每页显示的个数
	maxCount : null,
	
	initialize : function(){
	
		this.ribbon = $("#ribbon_wrapper").first();
		this.ribbonContainer = $("#ribbon_container").first();

		this.hideAllRibbons();
		this.displayFirstRibbon();
		this.registerRibbonEvents();
		
		this.enableMneuEffect();
		this.registerMenuEvents();
		this.registerPageEvent();
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
				case 3:
					that.onSaveMap();
					break;
				case 4:
					// 地图属性
					that.onMapPropertis();
					break;
				// Layer Events
				case 5:
					// 新建图层
					that.onLayerNew();
					break;
				case 6:
					// WMS图层
					that.onLayerAddWMS();
					break;
				case 7:
					// WFS图层
					that.onLayerAddWFS();
					break;
				case 8:
					// WMTS图层
					that.onLayerAddWMTS();
					break;

				case 9:
					// 新建图层
					that.onLayerNew();
					break;
				case 10:
					// 编辑图层
					// that.onEditLayer();
					break;
				case 11:
					// 分享图层
					that.onShareLayer();
					break;
				case 12:
					// that.onCreateLayer();
					break;
				case 13:
					//复制图层
					that.onDuplicateLayer();
					break;
				case 14:
					//删除图层
					that.onRemoveLayer();
					break;
				case 15:
					//图层定位
					that.onZoomLayer();
					break;
				case 16:
					//选择所有
					that.onSelectAllLayers();
					break;
				case 17:
					//导入图层
					that.onImportLayer();
					break;
				case 18:
					//导出图层
					that.onExportLayer();
					break;
				//Data Events
				case 19:
					// 文件管理
					that.onFile();
					break;
				case 20:
					//数据库管理
					that.onDataSource();
					break;
				case 21:
					// 导入矢量
					that.onImportVector();
					break;
				case 22:
					// 	导入影像
					that.onImportImage();
					break;
				// Chart Events
				case 23:
					// 分级图
					that.onAddRangeChart();
					break;
				case 24 :
					// 柱状图
					that.onAddBarChart();
					break;
				case 25:
					// 饼状图
					that.onAddPieChart();
					break;
				case 26:
					// 热力图
					that.onHeatMap();
					break;
				case 27:
					that.onAQI();
					break;
				case 28:
					that.onAQITimeline();
					break;
				// Tools Events
				case 29:
					// 标注
					that.onLayerAddVector();
					break;
				case 30:
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

	saveMap_callback : function(result){
		MapCloud.notify.showInfo(result,"保存地图");
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

	setMaps : function(maps){
		this.maps = maps;
		var mapSize = 220;
		var rowCount = Math.floor($(".map-list-col").height()/220);
		var colCount = Math.floor($("#maps_list_ul").width()/220);
		var count = rowCount * colCount;
		this.maxCount = count;
		var pageCount = Math.ceil(maps.length / this.maxCount);
		this.ribbonContainer.find(".query_count span").html(maps.length);
		this.ribbonContainer.find(".pages-form-pages").html(pageCount);

	},
	
	// 翻页事件
	registerPageEvent : function(){
		var that = this;
		this.ribbonContainer.find(".glyphicon-step-backward").each(function(){
			$(this).click(function(){
				var count = parseInt(that.ribbonContainer
					.find(".pages-form-pages").html());
				if(count >=1){
					that.setPage(1);
				}
			});
		});
		//末页
		this.ribbonContainer.find(".glyphicon-step-forward").each(function(){
			$(this).click(function(){
				var count = parseInt(that.ribbonContainer
					.find(".pages-form-pages").html());
				if(count >= 1){
					that.setPage(count);
				}
			});
		});

		//上一页
		this.ribbonContainer.find(".glyphicon-chevron-left").each(function(){
			$(this).click(function(){
				var page = parseInt(that.ribbonContainer
					.find(".pages-form-page").val());
				that.setPage(page - 1);
			});	
		});

		//下一页
		this.ribbonContainer.find(".glyphicon-chevron-right").each(function(){
			$(this).click(function(){
				var page = parseInt(that.ribbonContainer
					.find(".pages-form-page").val());
				that.setPage(page + 1);
			});
		});

	},
	setPage : function(page){
		var pageCount = parseInt(this.ribbonContainer
				.find(".pages-form-pages").html());

		this.ribbonContainer.find(".pages-form-page").val(page);
		if(page　== 1 ){
			this.ribbonContainer.find(".glyphicon-step-backward")
				.addClass("disabled");
		}else{
			this.ribbonContainer.find(".glyphicon-step-backward")
				.removeClass("disabled");
		}
		if(page == pageCount){
			this.ribbonContainer.find(".glyphicon-step-forward")
				.addClass("disabled");
		}else{
			this.ribbonContainer.find(".glyphicon-step-forward")
				.removeClass("disabled");
		}

		if(page - 1 <= 0){
			this.ribbonContainer.find(".glyphicon-chevron-left")
				.addClass("disabled");
		}else{
			this.ribbonContainer.find(".glyphicon-chevron-left")
				.removeClass("disabled");
		}

		if(page + 1 > pageCount){
			this.ribbonContainer.find(".glyphicon-chevron-right")
				.addClass("disabled");
		}else{
			this.ribbonContainer.find(".glyphicon-chevron-right")
				.removeClass("disabled");
		}
		if(page < 0 || page > pageCount){
			return;
		}
		var startIndex = (page-1) * this.maxCount;
		var endIndex = page*this.maxCount - 1;
		this.showMaps(startIndex,endIndex);

	},

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
		// $("#maps_list_ul").find(".map-thumb").click(function(){
		// 	$("#maps_list_ul").find(".map-thumb").removeClass("selected");
		// 	$(this).addClass("selected");
		// 	var name = $(this).parent().attr("name");
		// 	var map = mapManager.getMap("mapCanvas_wrapper",name);
		// 	that.showMapInfo(map);
		// }).dblclick(function(){
		// 	var name = $(this).parent().attr("name");
		// 	MapCloud.notify.loading();
		// 	// that.showMapPanel();
		// 	that.showMapTab();
		// 	var info = "打开地图[" + name + "]";
		// 	mapObj = mapManager.getMap("mapCanvas_wrapper",name);
		// 	if(mapObj == null){
		// 		MapCloud.notify.showInfo("Warning",info + "失败");
		// 	}else{
		// 		mapObj.setNavControl(false);
		// 		mapObj.draw();
		// 		MapCloud.refresh_panel.refreshPanel();
		// 		MapCloud.dataGrid.cleanup();
		// 		MapCloud.notify.showInfo("success",info);
		// 	}
		// });

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
		$("#map-infos").css("display","none");
		ribbonObj.setMaps(maps);
		ribbonObj.setPage(1);
	},

	showMapInfo : function(map){
		if(map == null){
			return;
		}
		$("#map-infos").css("display","block");
		var name = map.name;
		var srid = map.srid;
		$("#map-infos .map-info-name").html(name);
		$("#map-infos .map-info-srid").html(srid);

		var extent = map.extent;
		if(extent != null){
			$("#map-infos .map-info-xmin").html(extent.xmin.toFixed(2));
			$("#map-infos .map-info-ymin").html(extent.ymin.toFixed(2));
			$("#map-infos .map-info-xmax").html(extent.xmax.toFixed(2));
			$("#map-infos .map-info-ymax").html(extent.ymax.toFixed(2));
		}
		$("#map-infos .map-info-extent").html(extent.toString());

		// 图层
		$("#map-infos .layer-info-row").remove();
		var layers = map.getLayers();
		var layer = null;
		var name = null;
		var extent = null;
		var html = "";
		var geomType = null;
		for(var i = 0; i < layers.length;++i){
			layer = layers[i];
			if(layer == null){
				continue;
			}
			name = layer.name;
			html += '<li class="row layer-info-row">'
				+	'		<div class="col-md-3"></div>'
				+	'		<div class="col-md-2">' + name + '</div>'
				+	'		<div class="col-md-3"></div>'
				+	'	</li>';
			geomType = layer.geomType;
			if(geomType != null){
				html += '<li class="row layer-info-row">'
				+	'		<div class="col-md-3"></div>'
				+	'		<div class="col-md-2">类型:</div>'
				+	'		<div class="col-md-3">'+  geomType + '</div>'
				+	'	</li>';
			}
			extent = layer.extent;
			if(extent != null){
				html += '<li class="row layer-info-row">'
				+	'		<div class="col-md-3"></div>'
				+	'		<div class="col-md-2">范围:</div>'
				+   '		<div class="col-md-1 map-layer-info-extent">xMin:</div>'
				+   '		<div class="col-md-2">'+ extent.xmin.toFixed(2) + '</div>'
				+   '		<div class="col-md-1 map-layer-info-extent">yMin:</div>'
				+   '		<div class="col-md-2">'+ extent.ymin.toFixed(2) + '</div>'
				+ 	'	</li>'
				+ 	'	<li class="row layer-info-row">'
				+	'		<div class="col-md-3"></div>'
				+	'		<div class="col-md-2"></div>'
				+   '		<div class="col-md-1 map-layer-info-extent">xMax:</div>'
				+   '		<div class="col-md-2">'+ extent.xmax.toFixed(2) + '</div>'
				+   '		<div class="col-md-1 map-layer-info-extent">yMax:</div>'
				+   '		<div class="col-md-2">'+ extent.ymax.toFixed(2) + '</div>'
				+ 	'	</li>';
			}
			$("#map-infos").append(html);
		}
		
	},
});
	