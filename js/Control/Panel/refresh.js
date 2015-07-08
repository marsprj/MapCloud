// 左侧列表
MapCloud.refresh = MapCloud.Class({
	// 面板
	panel: null,

	layerID : null,
	mapLayerID : null,
	styleID : null,

	layerName : null,

	initialize : function(id){
		var that = this;
		
		this.panel = $("#"+id);
		this.wmsStyleMgr = new GeoBeans.StyleManager(url); 
	},

	// 隐藏
	hide : function(){
		this.panel.css("display","none");
	},

	// 显示
	show : function(){
		// this.panel.css("display","block");
		this.panel.css({"display":"block","opacity":"0"}).animate({"opacity": "1"}, 1000);
	},
	
	// 刷新
	refreshPanel: function(){
		this.panel.find("#layers_row").empty();

		if(mapObj == null){
			return;
		}
		var mapName = mapObj.name;
		this.panel.find("#map_name").html(mapName);
		// var that = this;

		// 影响点击，暂时屏蔽
		// $("ul#layers_row").sortable({
		//  	vertical: true,
		//  	nested : false,
		//  	handle : "li.layer_row",
		//  	onDrop: function($item, container, _super) {
		//  		_super($item, container);
		//  		var index = $item.attr("value");
		//  		var layer = mapObj.layers[parseInt(index)];
		//  		var layer_rows = $item.parent().children();
		//  		var newIndex = layer_rows.length - 1 - layer_rows.index($item);
		//  		if(newIndex != -1){
		//  			var step = newIndex - parseInt(index);
		//  			if(step > 0){
		//  				layer.up(step);
		//  			}else if(step < 0){
		//  				step = step * (-1);
		//  				layer.down(step);
		//  			}
		//  			mapObj.draw();
		//  			that.refreshPanel();
		//  		}
		//  	}
		// 	// onDrag: function ($item, position) {
		// 	//     // $item.css({
		// 	//     // 	border:"1px solid #ccc"

		// 	//     // }); 	
		// 	// 	$item.addClass("dragged");
	 // 	// 		$("body").addClass("dragging");	
		// 	// }
		// });	


		var html = "";

		// 底图
		var baseLayer = mapObj.baseLayer;
		if(baseLayer != null){
			var baseLayerhtml = this.getBaseLayerHtml(baseLayer);
			$("#baseLayer_row").html(baseLayerhtml);
			$("#baseLayer_row").css("padding","6px");
			$("#baseLayer_row").removeClass("sm");
		}
		
		// 各个图层
		var layers = mapObj.getLayers();
		var that = this;
		for(var i = layers.length -1; i >= 0; --i){
			var layer = layers[i];
			if(layer == null){
				continue;
			}
			// 分类
			if(layer instanceof GeoBeans.Layer.WFSLayer){
				html += this.getWFSLayerHtml(i,layer);
			}else if(layer instanceof GeoBeans.Layer.WMSLayer){
				html += this.getWMSLayerHtml(i,layer);
			}else if(layer instanceof GeoBeans.Layer.DBLayer){
				html += this.getDBLayerHtml(i,layer);
			}else if(layer instanceof GeoBeans.Layer.ChartLayer){
				html += this.getChartLayerHtml(i,layer);
			}
		}

		$("#layers_row").html(html);

		//展示具体的style
		this.panel.find(".glyphicon-chevron-down").each(function(){
			$(this).click(
			function(){
				var li = $(this).parents("li");
				var row = $(this).parents(".row");
				var isWMSRow = false;
				if(row.first().hasClass("wms_layer_row")){
					isWMSRow = true;
				}
				if($(this).hasClass("mc-icon-down")){
					var id = $(this).parent().parent().attr("value");
					$("#layers_row .layer_style_row[value='" + id + "']").css("display","none");
					// $("#layers_row .wms_layer_row[value='" + id + "']").css("display","none");
					if(isWMSRow){
						// li.find(".layer_style_row[value='" + id + "']")
						// 	.css("display","none");
						li.find(".layer_style_row[lid='" + id + "']")
							.slideUp();
					}else{
						// li.find(".row").css("display","none");
						li.find(".row").slideUp();
					}
					$(this).css("transform","rotate(-90deg) translate(3px,0px)");
					$(this).addClass("mc-icon-right");
					$(this).removeClass("mc-icon-down");			
				}else{
					var id = $(this).parent().parent().attr("value");
					$("#layers_row .layer_style_row[value='" + id + "']").css("display","block");
					if(isWMSRow){
						// li.find(".layer_style_row[value='" + id + "']")
						// 	.css("display","block");
						li.find(".layer_style_row[lid='" + id + "']")
							.slideDown();						
					}else{
						// li.find(".row").css("display","block");
						li.find(".row").slideDown();
					}
					// $("#layers_row .wms_layer_row[value='" + id + "']").css("display","block");
					li.find(".row").css("display","block");
					$(this).removeClass("mc-icon-right");
					$(this).addClass("mc-icon-down");
					$(this).css("transform","rotate(0deg) translate(0px,0px)");
					// $(this).removeClass("glyphicon-chevron-right");
					// $(this).addClass("glyphicon-chevron-down");			
				}
			});
		});

		this.panel.find(".style-symbol").each(function(){
			$(this).click(function(){
				var li = $(this).parents(".layer_row");
				var layerName = li.attr("lname");
				var layer = mapObj.getLayer(layerName);
				if(layer == null){
					return;
				}
				
				var style = layer.style;
				if(style == null){
					return;
				}
				var rules = style.rules;
				if(rules == null){
					return;
				}

				var styleRow = $(this).parents(".layer_style_row");
				var sID = styleRow.first().attr("sID");
				var rule = rules[sID];
				if(rule == null){
					return;
				}
				var fields = null;
				if(layer instanceof GeoBeans.Layer.DBLayer){
					var wfsWorkspace = new GeoBeans.WFSWorkspace("tmp",
							mapObj.server,"1.0.0");
					var featureType = new GeoBeans.FeatureType(wfsWorkspace,
							layer.name);
					fields = featureType.getFields(mapObj.name);					
				}
				if(fields == null){
					return;
				}
				that.layerName = layerName;
				that.styleID = sID;
				MapCloud.style_dialog.showDialog();	
				MapCloud.style_dialog.setRule(rule,
					fields,"refresh");			
			});
		});


		//图层的显示与隐藏
		this.panel.find(".glyphicon-eye-open,.glyphicon-eye-close").each(function(){
			$(this).click(function(){

				var li = $(this).parents("li");
				var layerName = li.attr("lname");
				var layer = mapObj.getLayer(layerName);
				if(layer == null){
					return;
				}

				// wms图层内的mapLayer
				var mapLayerName = $(this).parents(".wms_layer_row").attr("mname");
				if(mapLayerName != null){
					layer = layer.getMapLayer(mapLayerName);
				}

				if(layer == null){
					return;
				}

				if($(this).hasClass("glyphicon-eye-open")){
					$(this).removeClass("glyphicon-eye-open");
					$(this).addClass("glyphicon-eye-close");
					layer.setVisiable(false);
					mapObj.draw();
				}else{
					$(this).removeClass("glyphicon-eye-close");
					$(this).addClass("glyphicon-eye-open");					
					layer.setVisiable(true);
					mapObj.draw();
				}
			})
		});

		// 选中layer
		this.panel.find(".layer_name").each(function(){
			$(this).click(function(){
				$(".layer_row").removeClass("layer_row_selected");
				$("#baseLayer_row").removeClass("layer_row_selected");
				var layer_row = $(this).parent();
				layer_row.addClass("layer_row_selected");
//				var layer_id = layer_row.attr("value");
//				MapCloud.selected_layer = mapObj.layers[layer_id];
			});
		});

		// 放大图层
		this.panel.find(".layer_row_quick_tool_zoom").each(function(){
			$(this).click(function(){
				var li = $(this).parents("li.layer_row");
				var layerName = li.attr("lname");
				mapObj.zoomToLayer(layerName);
			});
		});
		// 显示属性
		this.panel.find(".layer_row_quick_tool_features").click(function(){
			var li = $(this).parents("li.layer_row");
			var layerName = li.attr("lname");
			if(layerName == null){
				return;
			}
			MapCloud.features_dialog.setLayerName(layerName);
			MapCloud.features_dialog.showDialog();
		});

		// 简单查询
		this.panel.find(".layer_row_quick_tool_search").click(function(){
			var li = $(this).parents("li.layer_row");
			var layerName = li.attr("lname");
			if(layerName == null){
				return;
			}
			var layer = mapObj.getLayer(layerName);
			if(layer == null){
				return;
			}
			MapCloud.search_panel.showPanel();
			MapCloud.search_panel.setLayer(layer);
		});

		// 图层编辑，内容未定
		this.panel.find(".layer_row_quick_tool_edit").each(function(){
			$(this).click(function(){
				// var layer_id = $(this).parent().parent().parent().parent().parent().parent().attr("value");
				// MapCloud.selected_layer = mapObj.layers[layer_id];
				// if(MapCloud.selected_layer != null){
				// 	if(MapCloud.edit_layer_dialog == null){
				// 		MapCloud.edit_layer_dialog = new MapCloud.EditLayerDialog("editLayerDialog");
				// 	}
				// 	//设置修改的图层
				// 	MapCloud.edit_layer_dialog.setLayer(MapCloud.selected_layer);
				// 	MapCloud.edit_layer_dialog.showDialog();
				// }
			});
		});

		// 分享图层
		this.panel.find(".layer_row_quick_tool_share").each(function(){
			$(this).click(function(){
				alert("share");
			})
		});
		
		// 删除图层
		this.panel.find(".layer_row_quick_tool_remove").each(function(){
			$(this).click(function(){
				var li = $(this).parents("li.layer_row");
				var layerName = li.attr("lname");
				
				mapObj.removeLayer(layerName,that.removeLayer_callback);
			});
		});

		// 添加热力图
		this.panel.find(".layer_row_quick_tool_heatMap span").each(function(){
			$(this).click(function(){
				var checked = $(this).prop("checked");
				var li = $(this).parents("li.layer_row");
				var layerName = li.attr("lname");
				var layer = mapObj.getLayer(layerName);
				if(layer == null){
					return;
				}
				MapCloud.heatMap_dialog.showDialog();
				MapCloud.heatMap_dialog.setLayer(layer);
			});
		});

		// 热力图的展示和隐藏
		this.panel.find(".layer_row_quick_tool_heatMap input").each(function(){
			$(this).change(function(){
				var checked = $(this).prop("checked");
				var li = $(this).parents("li.layer_row");
				var layerName = li.attr("lname");
				var layer = mapObj.getLayer(layerName);
				if(layer == null){
					return;
				}
				var heatMapLayer = layer.getHeatMapLayer();
				if(heatMapLayer == null){
					return;
				}
				// 展示热力图
				mapObj.setHeatMapVisible(layerName,checked);
				mapObj.draw();
			});
		});

		this.panel.find(".layer_row_quick_tool_remove_base").each(function(){
			$(this).click(function(){
				mapObj.removeBaseLayer();
				mapObj.draw();
				that.refreshPanel();
			});
		});


		// 图表编辑
		// this.panel.find(".chart_row_quick_tool_edit").each(function(){
		// 	$(this).click(function(){
		// 		var text = $(this).parent().parent().parent().parent().parent().prev().children().html();
		// 		var layer_id = $(this).parent().parent().parent().parent().parent().parent().parent().children(".layer_row").attr('value');
		// 		var layer = mapObj.layers[layer_id];
			
		// 		var option = null;
		// 		var wfsChartID = $(this).parents(".chart_style_row").attr("value");
		// 		var wfsLayerChart = MapCloud.wfs_layer_chart[wfsChartID];
		// 		if (wfsLayerChart != null) {
		// 			option = wfsLayerChart.option;
		// 		}

		// 		if(MapCloud.new_chart_dialog == null){
		// 			MapCloud.new_chart_dialog = new MapCloud.NewChartDialog("newChartDialog");
		// 		}
		// 		MapCloud.new_chart_dialog.showDialog();		
		// 		MapCloud.new_chart_dialog.setLayerOption(layer,option,wfsChartID);
		// 	})；
		// });	

		// 删除图表
		// this.panel.find(".chart_row_quick_tool_delete").each(function(){
		// 	$(this).click(function(){
		// 		var wfsChartID = $(this).parents(".chart_style_row").attr("value");
		// 		var wfsLayerChart = MapCloud.wfs_layer_chart[wfsChartID];
		// 		if(wfsLayerChart == null){
		// 			return;
		// 		}
		// 		wfsLayerChart.removeCharts(wfsChartID);
		// 		// MapCloud.wfs_layer_chart.splice(wfsChartID,1);
		// 		MapCloud.wfs_layer_chart[wfsChartID] = null;
		// 		var refresh = new MapCloud.refresh("left_panel");
		// 		refresh.refreshPanel();
		// 	})
		// });		

		//图表显示与隐藏
		// this.panel.find(".chart_style_row .glyphicon-eye-open,.chart_style_row .glyphicon-eye-close").each(function(){
		// 	$(this).click(function(){
		// 		var wfsChartID = $(this).parents(".chart_style_row").attr("value");
		// 		if($(this).hasClass("glyphicon-eye-open")){
		// 			$(this).removeClass("glyphicon-eye-open");
		// 			$(this).addClass('glyphicon-eye-close');
		// 			var wfsLayerChart = MapCloud.wfs_layer_chart[wfsChartID];
		// 			if(wfsLayerChart == null){
		// 				return;
		// 			}
		// 			wfsLayerChart.removeCharts(wfsChartID);					
		// 		}else if($(this).hasClass("glyphicon-eye-close")){
		// 			$(this).removeClass("glyphicon-eye-close");
		// 			$(this).addClass('glyphicon-eye-open');
		// 			var wfsLayerChart = MapCloud.wfs_layer_chart[wfsChartID];
		// 			if(wfsLayerChart == null){
		// 				return;
		// 			}
		// 			wfsLayerChart.showFront();
		// 			// wfsLayerChart.show();					
		// 		}
		// 	})
			
		// });


		// WMS的MapLayer的样式编辑
		this.panel.find(".mc-icon-wmslayer").each(function(){
			$(this).click(function(){
				// var wmsLayerIndex = $(this).parents(".layer_row").attr("value");							
				// if(wmsLayerIndex == null){
				// 	return;
				// }
				// var wmsLayer = mapObj.layers[parseInt(wmsLayerIndex)];
				// if(wmsLayer == null){
				// 	return;
				// }

				// var wmsMapLayerHtml = $(this).parents(".wms_layer_row")
				// 						.find(".wms-map-layer");
				// if(wmsMapLayerHtml.length == 0){
				// 	return;
				// }
				// var wmsMapLayerName = wmsMapLayerHtml.text();	
				// var wmsMapLayer = wmsLayer.getMapLayer(wmsMapLayerName);
				// if(wmsMapLayer == null){
				// 	return;
				// }

				
				// MapCloud.styleManager_dialog.showDialog();				
				// // MapCloud.styleMgr_dialog.setWMSLayer(wmsLayer,wmsMapLayer);
			});
		});


		// wfs图层的样式编辑
		this.panel.find(".mc-icon-wfslayer").each(function(){
			$(this).click(function(){
				var li = $(this).parents("li");
				var layerName = li.attr("lname");
				var wfsLayer = mapObj.getLayer(layerName);
				
				if(wfsLayer == null){
					return;
				}
				var style = wfsLayer.style;
				if(style == null){
					return;
				}
				MapCloud.styleManager_dialog.showDialog();
				MapCloud.styleManager_dialog.setWFSLayer(wfsLayer);
			});
		});

		//DBLayer
		this.panel.find(".mc-icon-dblayer").each(function(){
			$(this).click(function(){
				var li = $(this).parents("li");
				var layerName = li.attr("lname");
				var layer = mapObj.getLayer(layerName);
				if(layer == null){
					return;
				}
				// MapCloud.styleMgr_dialog.showDialog();
				// MapCloud.styleMgr_dialog.setDBLayer(layer);
				MapCloud.styleManager_dialog.showDialog(false);
				MapCloud.styleManager_dialog.setDBLayer(layer);
			});
		});

		// chartLayer的编辑
		this.panel.find(".mc-icon-chartlayer").click(function(){
			var li = $(this).parents("li");
			var layerName = li.attr("lname");
			var layer = mapObj.getLayer(layerName);
			if(layer == null){
				return;
			}
			var type = layer.type
			switch(type){
				case GeoBeans.Layer.ChartLayer.Type.RANGE:{
					MapCloud.chart_panel.showPanel();
					MapCloud.chart_panel.setChartLayer(layer);
					break;
				}
				case GeoBeans.Layer.ChartLayer.Type.BAR:{
					MapCloud.bar_chart_panel.showPanel();
					MapCloud.bar_chart_panel.setChartLayer(layer);
					break;
				}
				case GeoBeans.Layer.ChartLayer.Type.PIE:{
					MapCloud.pie_chart_panel.showPanel();
					MapCloud.pie_chart_panel.setChartLayer(layer);
					break;
				}
				default:
					break;
			}
		});
	},
	
	createSymbolizerIcon: function(symbolizer,geomType){
		if(symbolizer == null || geomType == null){
			return null;
		}
		var iconHtml = "";
		var geomTypeLower = geomType.toLowerCase();
		switch(geomTypeLower){
			case "point":
			case "multipolygon":
			case "polygon":{
				var fillColor = symbolizer.fillColor;
				var borderColor = symbolizer.outLineColor;
				iconHtml = "background-color:" + fillColor + ";border:1px solid " + borderColor + ";";
				break;
			}
			case "multilinestring":
			case "linestring":{
				var color = symbolizer.color;
				iconHtml = "background-color:" + color;
				break;
			}
			default:
				break;
		}

		return iconHtml;
	},

	// getChartsHtml:function(layer){
	// 	var html = "";
	// 	for(var i = 0; i < MapCloud.wfs_layer_chart.length; ++i){
	// 		var wfsLayerChart = MapCloud.wfs_layer_chart[i];
	// 		if(wfsLayerChart == null){
	// 			continue;
	// 		}
	// 		var wfsLayer = wfsLayerChart.layer;
	// 		if(wfsLayer == layer){
	// 			html += "<div class=\"row chart_style_row\" value=\"" + i + "\">"
	// 					+	"	<div class=\"col-md-1 col-xs-1\"></div>"
	// 					+	"	<div class=\"col-md-1 col-xs-1\"></div>"
	// 					+	"	<div class=\"col-md-1 col-xs-1\">";

	// 			if(wfsLayerChart.showFlag){
	// 				html += "		<div class=\"glyphicon glyphicon-eye-open mc-icon\"></div>";
	// 			}else{
	// 				html += "		<div class=\"glyphicon glyphicon-eye-close mc-icon\"></div>";
	// 			}
	// 			html	+=	"	</div>"
	// 					+	"	<div class=\"col-md-1 col-xs-1\">";
	// 			var option = wfsLayerChart.option;
	// 			var type = option.type;
	// 			var typeHtml = this.getChartTypeHtml(type);
	// 			html += typeHtml;
	// 			html += "</div>";
				
	// 			var text = option.text;
	// 			html += "<div class=\"col-md-6 col-xs-6 chart_name\">"
	// 					+		"<span>" + text + "</span>"
	// 					+	"</div>";
	// 			html += "<div class=\"col-md-1 col-xs-1 chart_row_quick_tool\">"
	// 					+	"		<ul>"
	// 					+	"			<li class=\"dropdown pull-right\">"
	// 					+	"				<a href=\"#\" data-toggle=\"dropdown\" class=\"dropdown-toggle\">"
	// 					+	"					<b class=\"glyphicon glyphicon-cog\"></b>"
	// 					+	"				</a>"
	// 					+	"				<ul class=\"dropdown-menu\">"
	// 					+	"					<li><a href=\"#\" class=\"chart_row_quick_tool_edit\">编辑图表</a></li>"
	// 					+	"					<li><a href=\"#\" class=\"chart_row_quick_tool_delete\">删除图表</a></li>"
	// 					+	"				</ul>"
	// 					+	"			</li>"
	// 					+	"		</ul>"
	// 					+	"	</div>";
	// 			html += "</div>";


	// 		}
	// 	}
	// 	return html;
	// },

	// getChartTypeHtml:function(chartType){
	// 	var html = "";
	// 	switch(chartType){
	// 		case "bar":{
	// 			html = "<div class='glyphicon glyphicon-signal mc-icon'></div>";
	// 			break;
	// 		}
	// 		case "pie":{
	// 			html = "<div class='glyphicon glyphicon-adjust mc-icon'></div>";
	// 			break;

	// 		}
	// 		default:
	// 			break;
	// 	}
	// 	return html;
	// },

	//得到filter对应的TextSymbolizer的index
	getTextSymbolizerIndexByFilter:function(filter,rules){
		for(var i = 0; i < rules.length; ++i){
			var rule = rules[i];
			var symbolizer = rule.symbolizer;
			if (!(symbolizer instanceof GeoBeans.Style.TextSymbolizer)){
				continue;
			}
			var textFilter = rule.filter;
			if(textFilter == null && filter == null){
				return i;
			}
			if(textFilter != null && filter!= null && textFilter.field == filter.field 
				&& textFilter.value == filter.value){
				return i;
			}
		}
		return -1;		
	},


	setSymoblizerCallback:function(symbolizer,textSymbolizer,index,layerIndex){
		if(MapCloud.refresh_panel ==null){
			MapCloud.refresh_panel = new MapCloud.refresh("left_panel");
		}
		var layer = mapObj.layers[layerIndex];
		if(layer == null){
			return;
		}
		var layerStyle = layer.style;
		if(layerStyle == null){
			return;
		}
		var rules = layerStyle.rules;
		if(rules == null){
			return;
		}		
		var rule = rules[index];
		if(rule == null){
			return;
		}
		rules[index].symbolizer = symbolizer;
		var filter = rules[index].filter;
		var textRule = new GeoBeans.Style.Rule();
		textRule.filter =  filter;
		textRule.symbolizer = textSymbolizer;

		var oldTextSymolizerIndex = MapCloud.refresh_panel.getTextSymbolizerIndexByFilter(rule.filter,rules);
		var oldTextSymbolizer = null;
		// var oldTextSymbolizer = MapCloud.refresh_panel.getTextSymbolizerByFilter(rule.fitler,rules);
		if(oldTextSymolizerIndex == -1 && textSymbolizer != null){
			rules.push(textRule);
		}
		if(oldTextSymolizerIndex != -1 && textSymbolizer != null){
			rules[oldTextSymolizerIndex].symbolizer = textSymbolizer;
		}
		if(oldTextSymolizerIndex != -1 && textSymbolizer == null){
			rules.splice(oldTextSymolizerIndex,1);
		}
		MapCloud.refresh_panel.refreshPanel();	
		mapObj.draw();	
	},

	// 生成底图的html
	getBaseLayerHtml : function(baseLayer){
		var html = "";
		var name = baseLayer.name;
		var icon = "mc-icon-image";
		var url = baseLayer.url;
		var type = url.slice(url.lastIndexOf("=") + 1, url.length);
		if(type == "world_vector"){
			icon = "mc-icon-vector";
		}else if(type == "world_image"){
			icon = "mc-icon-image";
		}
		// html	+= 	"<li class=\"row layer_row\" value=\"" + "baseLayer" + "\">"
		html    +=	"	<div class=\"col-md-1 col-xs-1\">"
				+	"		<div class=\"glyphicon glyphicon-chevron-down mc-icon\"></div>"							
				+	"	</div>"
				+	"	<div class=\"col-md-1 col-xs-1\">"
				+	"		<div class=\"glyphicon glyphicon-ok mc-icon\"></div>"							
				+	"	</div>"
				+	"	<div class=\"col-md-1 col-xs-1\">"
				+	"		<div class=\"glyphicon glyphicon-eye-open mc-icon\"></div>"							
				+	"	</div>"
				+	"	<div class=\"col-md-1 col-xs-1\">"
				+	"		<div class=\"mc-icon " + icon + "\"></div>"	
				+	"	</div>"
				+	"	<div class=\"col-md-6 col-xs-1 layer_name\">"
				+	"		<strong>" + type + "</strong>"
				+	"	</div>"
				+	"	<div class=\"col-md-1 col-xs-1 layer_row_quick_tool\">"
				+   "		<ul>"
				+	"			<li class=\"dropdown pull-right\">"
				+	"				<a href=\"#\" data-toggle=\"dropdown\" class=\"dropdown-toggle\">"
				+	"					<b class=\"glyphicon glyphicon-cog\"></b>"
				+	"				</a>"
				+	"				<ul class=\"dropdown-menu\">"
				+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_zoom\"><i class='dropdown-menu-icon glyphicon glyphicon-zoom-in'></i>放大图层</a></li>"
				+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_edit\"><i class='dropdown-menu-icon glyphicon glyphicon-edit'></i>编辑图层</a></li>"
				+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_share\"><i class='dropdown-menu-icon glyphicon glyphicon-share'></i>分享图层</a></li>"
				+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_remove\"><i class='dropdown-menu-icon glyphicon glyphicon-remove'></i>删除图层</a></li>"				+	"				</ul>"
				+	"			</li>"
				+	"		</ul>"
				+	"	</div>";
		return html;				
	},

	// 生成WMSLayer的html
	getWMSLayerHtml : function(index,wmsLayer){
		var html = "";
		var name = wmsLayer.name;
		html	= 	"<li class=\"row layer_row\" lname=\"" + name + "\">"
				+	"	<div class=\"col-md-1 col-xs-1\">"
				+	"		<div class=\"glyphicon glyphicon-chevron-down mc-icon mc-icon-down mc-icon-rotate\"></div>"							
				+	"	</div>"
				+	"	<div class=\"col-md-1 col-xs-1\">"
				+	"		<div class=\"glyphicon glyphicon-ok mc-icon\"></div>"							
				+	"	</div>"
				+	"	<div class=\"col-md-1 col-xs-1\">";
		if(wmsLayer.visible){
			html += "		<div class=\"glyphicon glyphicon-eye-open mc-icon\"></div>"	;
		}else{
			html += "		<div class=\"glyphicon glyphicon-eye-close mc-icon\"></div>";	
		}
		html	+=	"	</div>"
				+	"	<div class=\"col-md-1 col-xs-1\">"
				+	"		<div class=\"mc-icon mc-icon-color\"></div>"	
				+	"	</div>"
				+	"	<div class=\"col-md-6 col-xs-1 layer_name\">"
				+	"		<strong>" + name + "</strong>"
				+	"	</div>"
				+	"	<div class=\"col-md-1 col-xs-1 layer_row_quick_tool\">"
				+   "		<ul class=\"layer_row_quick_tool_ul\">"
				+	"			<li class=\"dropdown pull-right\">"
				+	"				<a href=\"#\" data-toggle=\"dropdown\" class=\"dropdown-toggle\">"
				+	"					<b class=\"glyphicon glyphicon-cog\"></b>"
				+	"				</a>"
				+	"				<ul class=\"dropdown-menu\">"
				+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_zoom\"><i class='dropdown-menu-icon glyphicon glyphicon-zoom-in'></i>放大图层</a></li>"
				+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_edit\"><i class='dropdown-menu-icon glyphicon glyphicon-edit'></i>编辑图层</a></li>"
				+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_share\"><i class='dropdown-menu-icon glyphicon glyphicon-share'></i>分享图层</a></li>"
				+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_remove\"><i class='dropdown-menu-icon glyphicon glyphicon-remove'></i>删除图层</a></li>"
				+	"				</ul>"
				+	"			</li>"
				+	"		</ul>"
				+	"	</div>"
				+	"	<br/>";
				// +	"</li>";	


		var layers = wmsLayer.layers;
		var mapLayers = wmsLayer.mapLayers;
		for(var i = 0; i < mapLayers.length; ++i){
			var mapLayer = mapLayers[i];
			if(mapLayer == null){
				continue;
			}
			var name = mapLayer.name;
			var row = "<div class=\"row wms_layer_row\" mname=\"" + name + "\" style=\"display:block\">"
					 +"	<div class=\"col-md-1 col-xs-1\"></div>"
					 +"	<div class=\"col-md-1 col-xs-1\">"
					 +	"	<div class=\"glyphicon glyphicon-chevron-down mc-icon mc-icon-down mc-icon-rotate\"></div>"							
					 +"	</div>"
					 +"	<div class=\"col-md-1 col-xs-1\">";
			if(mapLayer.visible){
				row += "	<div class=\"glyphicon glyphicon-eye-open mc-icon\"></div>";
			}else{
				row += "	<div class=\"glyphicon glyphicon-eye-close mc-icon\"></div>";
			}
			row	 +=" </div>"
					 +"	<div class=\"col-md-1 col-xs-1\">"
					 +" 	<div class=\"mc-icon mc-icon-wmslayer mc-icon-layer\"></div>"
					 +"	</div>"
					 +"	<div class=\"col-md-55 col-xs-5\">"
					 +"		<strong class='wms-map-layer'>" + name + "</strong>"
					 +"	</div>"
					 +"</div>";
			
			html += row;
			var styleHtml = this.getStyleHtml(i,mapLayer.style);
			html += styleHtml;

		}
		html += "</li>";					
		return html;
	},

	// 生成style的html
	getStyleHtml : function(index,style){
		if(style == null){
			return "";
		}
		var html = "";
		var rules = style.rules;
		if(rules.length == 1){
			var rule = rules[0];
			if(rule != null){
				var filter = rule.filter;
				if(filter == null){
					var symbolizer = rule.symbolizer;
					if(symbolizer != null){
						var symbolizerHtml = this.getSymbolizerHtml(symbolizer);
						html += '<div class="row layer_style_row" lID="'
							 +			index+ '" sID="0">'
							 + 	'	<div class="col-md-1 col-xs-1"></div>'
							 + 	'	<div class="col-md-1 col-xs-1"></div>'
							 +  '	<div class="col-md-1 col-xs-1"></div>'
							 +  '	<div class="col-md-1 col-xs-1"></div>'
							 +  '	<div class="col-md-1 col-xs-1">'
							 +       symbolizerHtml
							 +  '	</div>'
							 +  '</div>';
						return html;
					}
				}
			}
		}else{
			// 多种样式
			var field = MapCloud.styleManager_dialog
						.getProperyNameByRule(rules[0]); 
			html += '<div class="row layer_style_row" lID="' + index + '">'
				 + 	'	<div class="col-md-1 col-xs-1"></div>'
				 + 	'	<div class="col-md-1 col-xs-1"></div>'
				 +  '	<div class="col-md-1 col-xs-1"></div>'
				 +  '	<div class="col-md-1 col-xs-1"></div>'
				 +  '	<div class="col-md-5 col-xs-5"><strong>'
				 +      field 
				 +  '	</strong></div>'
				 +  '</div>';

			for(var i = 0; i < rules.length;++i){
				var rule = rules[i];
				if(rule == null){
					continue;
				}
				var filter = rule.filter;
				var value = null;
				if(filter == null){
					continue;
				}
				var type = filter.type;
				if(type == GeoBeans.Filter.Type.FilterComparsion){
					var operator = filter.operator;
					if(operator == GeoBeans.ComparisionFilter.OperatorType.ComOprEqual){
						var expression1 = filter.expression1;
						var expression2 = filter.expression2;
						if(expression1 != null && 
							expression1.type == GeoBeans.Expression.Type.Literal){
							value = expression1.value;
						}else if(expression2 != null && 
							expression2.type == GeoBeans.Expression.Type.Literal){
							value = expression2.value;
						}
					}else if(operator == GeoBeans.ComparisionFilter.OperatorType.ComOprIsBetween){
						var lowerBound = filter.lowerBound;
						var upperBound = filter.upperBound;
						var lowerBoundValue = "";
						var upperBoundValue = "";
						if(lowerBound != null){
							lowerBoundValue = parseFloat(lowerBound.value);
						}
						if(upperBound != null){
							upperBoundValue = parseFloat(upperBound.value);
						}
						value = lowerBoundValue.toFixed(2) + "-" + upperBoundValue.toFixed(2);
					}
				}

				// if(filter != null){
				// 	var expression1 = filter.expression1;
				// 	var expression2 = filter.expression2;
				// 	if(expression1 != null && 
				// 		expression1.type == GeoBeans.Expression.Type.Literal){
				// 		value = expression1.value;
				// 	}else if(expression2 != null && 
				// 		expression2.type == GeoBeans.Expression.Type.Literal){
				// 		value = expression2.value;
				// 	}					
				// }

				var symbolizer = rule.symbolizer;
				var symbolizerHtml = this.getSymbolizerHtml(symbolizer);
				html += '<div class="row layer_style_row" lID="' 
				 +			 index + '" sID="' + i + '">'
				 + 	'	<div class="col-md-1 col-xs-1"></div>'
				 + 	'	<div class="col-md-1 col-xs-1"></div>'
				 +  '	<div class="col-md-1 col-xs-1"></div>'
				 +  '	<div class="col-md-1 col-xs-1"></div>'
				 +  '	<div class="col-md-1 col-xs-1">'
				 + 			symbolizerHtml
				 +  '	</div>'
				 +  '	<div class="col-md-5 col-xs-5">'
				 +    		value
				 + 	'	</div>'
				 + 	'</div>';
			}
			return html;
		}
		return "";
	},

	// 获取样式的图标示意
	getSymbolizerHtml : function(symbolizer){
		var html = MapCloud.styleManager_dialog
						.getSymbolHtml(symbolizer);
		return html;						
	},

	// 生成WFSLayer的html
	getWFSLayerHtml : function(index,layer){
		var name = layer.name;
		var style = layer.style;

		html = 	"<li class=\"row layer_row\" lname=\"" + name + "\">"
			+	"	<div class=\"col-md-1 col-xs-1\">"
			+	"		<div class=\"glyphicon glyphicon-chevron-down mc-icon mc-icon-down mc-icon-rotate\"></div>"							
			+	"	</div>"
			+	"	<div class=\"col-md-1 col-xs-1\">"
			+	"		<div class=\"glyphicon glyphicon-ok mc-icon\"></div>"							
			+	"	</div>"
			+	"	<div class=\"col-md-1 col-xs-1\">";
		if(layer.visible){
			html += "		<div class=\"glyphicon glyphicon-eye-open mc-icon\"></div>";
		}else{
			html += "		<div class=\"glyphicon glyphicon-eye-close mc-icon\"></div>";	
		}	
										
		html+=	"	</div>"
			+	"	<div class=\"col-md-1 col-xs-1\">"
			+	"		<div class=\"mc-icon mc-icon-layer mc-icon-wfslayer\"></div>"	
			+	"	</div>"
			+	"	<div class=\"col-md-6 col-xs-1 layer_name\">"
			+	"		<strong>" + name + "</strong>"
			+	"	</div>"
			+	"	<div class=\"col-md-1 col-xs-1 layer_row_quick_tool\">"
			+   "		<ul class=\"layer_row_quick_tool_ul\">"
			+	"			<li class=\"dropdown pull-right\">"
			+	"				<a href=\"#\" data-toggle=\"dropdown\" class=\"dropdown-toggle\">"
			+	"					<b class=\"glyphicon glyphicon-cog\"></b>"
			+	"				</a>"
			+	"				<ul class=\"dropdown-menu\">"
			+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_zoom\"><i class='dropdown-menu-icon glyphicon glyphicon-zoom-in'></i>放大图层</a></li>"
				+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_edit\"><i class='dropdown-menu-icon glyphicon glyphicon-edit'></i>编辑图层</a></li>"
				+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_share\"><i class='dropdown-menu-icon glyphicon glyphicon-share'></i>分享图层</a></li>"
				+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_remove\"><i class='dropdown-menu-icon glyphicon glyphicon-remove'></i>删除图层</a></li>"
			+	"				</ul>"
			+	"			</li>"
			+	"		</ul>"
			+	"	</div>"
			+	"	<br/>";
			// +	"</li>";	
		var styleHtml = this.getStyleHtml(-1,style);
		html += styleHtml;
		html += "</li>";
		return html;
	},


	// 设置样式，在style Dialog中设置
	setRule : function(rule){

		// var layer = mapObj.layers[this.layerID];
		var layer = mapObj.getLayer(this.layerName);
		if(layer == null){
			return;
		}

		var style = layer.style;
		if(style == null){
			return;
		}
		var rules = style.rules;
		if(rules == null){
			return;
		}
		var ruleO = rules[this.styleID];
		if(ruleO == null){
			return;
		}
		ruleO.symbolizer = rule.symbolizer;
		ruleO.textSymbolizer = rule.textSymbolizer;
		var styleName = style.name;

		if(styleName == "default"){
			
			mapObj.draw();
			MapCloud.refresh_panel.refreshPanel();
		}else{
			var xml = this.wmsStyleMgr.writer.write(style);
			// 更新修改的样式
			this.wmsStyleMgr.updateStyle(xml,styleName,this.updateCallback);
			// 设置样式
			mapObj.setStyle(this.layerName,style,this.setStyle_callback);
		}
	},

	// 更新样式
	updateCallback : function(result){
		MapCloud.alert_info.showInfo(result,"更新样式");
		MapCloud.refresh_panel.refreshPanel();
	},

	// 设置样式
	setStyle_callback : function(result){
		MapCloud.alert_info.showInfo(result,"设置样式");
		mapObj.draw();
		MapCloud.refresh_panel.refreshPanel();
	},

	// 生成DBLayer的html
	getDBLayerHtml : function(index,layer){
		if(layer == null){
			return "";
		}
		var name = layer.name;
		var style = layer.style;

		// html	= 	"<li class=\"row layer_row\" value=\"" + index + "\">"
		var html	= 	"<li class=\"row layer_row\" lname=\"" + name + "\">"				
				+	"	<div class=\"col-md-1 col-xs-1\">"
				+	"		<div class=\"glyphicon glyphicon-chevron-down mc-icon mc-icon-down mc-icon-rotate\"></div>"							
				+	"	</div>"
				+	"	<div class=\"col-md-1 col-xs-1\">"
				+	"		<div class=\"glyphicon glyphicon-ok mc-icon\"></div>"							
				+	"	</div>"
				+	"	<div class=\"col-md-1 col-xs-1\">";
		if(layer.visible){
			html += "		<div class=\"glyphicon glyphicon-eye-open mc-icon\"></div>"	;
		}else{
			html += "		<div class=\"glyphicon glyphicon-eye-close mc-icon\"></div>";	
		}
		var heatMapHtml = "";
		if(layer.geomType == GeoBeans.Geometry.Type.POINT 
			|| layer.geomType == GeoBeans.Geometry.Type.MULTIPOINT){
			var heatMapLayer = layer.getHeatMapLayer();
			heatMapHtml = "<li><a href=\"#\" class=\"layer_row_quick_tool_heatMap\">";
			if(heatMapLayer != null){
				if(heatMapLayer.visible){
					heatMapHtml += "<i class='dropdown-menu-icon'><input type='checkbox' checked></i>";
				}else{
					heatMapHtml += "<i class='dropdown-menu-icon'><input type='checkbox'></i>";	
				}
			}else{
				heatMapHtml += "<i class='dropdown-menu-icon'><input type='checkbox'></i>";	
			}
			heatMapHtml += "<span>热力图</span></a></li>";
		}else{
			heatMapHtml = "";
		}

		html	+=	"	</div>"
				+	"	<div class=\"col-md-1 col-xs-1\">"
				+	"		<div class=\"mc-icon mc-icon-dblayer\"></div>"	
				+	"	</div>"
				+	"	<div class=\"col-md-6 col-xs-1 layer_name\">"
				+	"		<strong>" + name + "</strong>"
				+	"	</div>"
				+	"	<div class=\"col-md-1 col-xs-1 layer_row_quick_tool\">"
				+   "		<ul class=\"layer_row_quick_tool_ul\">"
				+	"			<li class=\"dropdown pull-right\">"
				+	"				<a href=\"#\" data-toggle=\"dropdown\" class=\"dropdown-toggle\">"
				+	"					<b class=\"glyphicon glyphicon-cog\"></b>"
				+	"				</a>"
				+	"				<ul class=\"dropdown-menu\">"
				// +	"					<li><a href='#'><input id='wms_transparency' data-slider-id='wms_transparency_slider' "
				// +	"						type='text' class='form-control' data-slider-min='0' data-slider-max='100' "
				// +	"						data-slider-step='1' data-slider-value='100'  data-slider-enabled='true'/></a></li>"
				+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_zoom\"><i class='dropdown-menu-icon glyphicon glyphicon-zoom-in'></i>放大图层</a></li>"
				+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_features\"><i class='dropdown-menu-icon fa fa-list-ul'></i>显示属性</a></li>"
				+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_search\"><i class='dropdown-menu-icon fa fa-search'></i>简单查询</a></li>"
				+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_edit\"><i class='dropdown-menu-icon glyphicon glyphicon-edit'></i>编辑图层</a></li>"
				+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_share\"><i class='dropdown-menu-icon glyphicon glyphicon-share'></i>分享图层</a></li>"
				+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_remove\"><i class='dropdown-menu-icon glyphicon glyphicon-remove'></i>删除图层</a></li>"
				+						heatMapHtml
				+	"				</ul>"
				+	"			</li>"
				+	"		</ul>"
				+	"	</div>"
				+	"	<br/>";

		var styleHtml = this.getStyleHtml(-1,style);
		html += styleHtml;
		html += "</li>";
		return html;
	},

	// 删除图层结果
	removeLayer_callback : function(result){
		MapCloud.alert_info.showInfo(result,"删除图层");
		var panel = MapCloud.refresh_panel;
		panel.refreshPanel();
		mapObj.draw();
	},

	// 专题图
	getChartLayerHtml : function(index,layer){
		if(layer == null){
			return "";
		}
		var name = layer.name;
		var html = 	"<li class=\"row layer_row\" lname=\"" + name + "\">"				
				+	"	<div class=\"col-md-1 col-xs-1\">"
				+	"		<div class=\"glyphicon glyphicon-chevron-down mc-icon mc-icon-down mc-icon-rotate\"></div>"							
				+	"	</div>"
				+	"	<div class=\"col-md-1 col-xs-1\">"
				+	"		<div class=\"glyphicon glyphicon-ok mc-icon\"></div>"							
				+	"	</div>"
				+	"	<div class=\"col-md-1 col-xs-1\">";
		if(layer.visible){
			html += "		<div class=\"glyphicon glyphicon-eye-open mc-icon\"></div>"	;
		}else{
			html += "		<div class=\"glyphicon glyphicon-eye-close mc-icon\"></div>";	
		}
		html	+=	"	</div>"
				+	"	<div class=\"col-md-1 col-xs-1\">"
				+	"		<a href='javascript:void(0)' class='mc-icon-chartlayer'>"
				+	"			<i class='fa fa-bar-chart'></i>"
				+	"		</a>"
				+	"	</div>"
				+	"	<div class=\"col-md-6 col-xs-1 layer_name\">"
				+	"		<strong>" + name + "</strong>"
				+	"	</div>"
				+	"	<div class=\"col-md-1 col-xs-1 layer_row_quick_tool\">"
				+   "		<ul class=\"layer_row_quick_tool_ul\">"
				+	"			<li class=\"dropdown pull-right\">"
				+	"				<a href=\"#\" data-toggle=\"dropdown\" class=\"dropdown-toggle\">"
				+	"					<b class=\"glyphicon glyphicon-cog\"></b>"
				+	"				</a>"
				+	"				<ul class=\"dropdown-menu\">"
				+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_zoom\"><i class='dropdown-menu-icon glyphicon glyphicon-zoom-in'></i>放大图层</a></li>"
				+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_edit\"><i class='dropdown-menu-icon glyphicon glyphicon-edit'></i>编辑图层</a></li>"
				+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_share\"><i class='dropdown-menu-icon glyphicon glyphicon-share'></i>分享图层</a></li>"
				+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_remove\"><i class='dropdown-menu-icon glyphicon glyphicon-remove'></i>删除图层</a></li>"
				+	"				</ul>"
				+	"			</li>"
				+	"		</ul>"
				+	"	</div>"
				+	"	<br/>";
		html += "</li>";
		return html;
	}
});