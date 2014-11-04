MapCloud.refresh = MapCloud.Class({
	panel: null,
	initialize : function(id){
		var that = this;
		
		this.panel = $("#"+id);
	},
	
	refreshPanel: function(){
		$("#layers_row").empty();

		if(mapObj == null){
			return;
		}
		
		var layers = mapObj.layers;
		if(layers.length == 0){
			return;
		}

		var html = "";
		
		var dialog = this;
		for(var i = 0; i < layers.length; ++i){
			var layer = layers[i];
			if(layer == null){
				continue;
			}
			var name = layer.name;
			var style = layer.style;
			if(style == null){
				continue;
			}
			var rules = style.rules;
			if(rules == null){
				continue;
			}
			var ruleCount = rules.length;
			var geomType = MapCloud.getLayerGeomType(layer);
			// if(ruleCount == 1){				//如果只有一个准则，则不用展开
			// 	var rule = rules[0];
			// 	var symbolizer = rule.symbolizer;
			// 	var iconHtml = this.createSymbolizerIcon(symbolizer,geomType);
			// 	html	+= 	"<div class=\"row layer_row\" value=\"" + i + "\">"
			// 			+	"	<div class=\"col-md-1 col-xs-1\">"
			// 			+	"		<div class=\"mc-icon\"></div>"							
			// 			+	"	</div>"
			// 			+	"	<div class=\"col-md-1 col-xs-1\">"
			// 			+	"		<div class=\"glyphicon glyphicon-ok mc-icon\"></div>"							
			// 			+	"	</div>"
			// 			+	"	<div class=\"col-md-1 col-xs-1\">"
			// 			+	"		<div class=\"glyphicon glyphicon-eye-close mc-icon\"></div>"							
			// 			+	"	</div>"
			// 			+	"	<div class=\"col-md-1 col-xs-1\">"
			// 			+	"		<div class=\"mc-icon\" style=\"" + iconHtml +"\"></div>"	
			// 			+	"	</div>"
			// 			+	"	<div class=\"col-md-6 col-xs-1 layer_name\">"
			// 			+	"		<span>" + name + "</span>"
			// 			+	"	</div>"
			// 			+	"	<div class=\"col-md-1 col-xs-1 layer_row_quick_tool\">"
			// 			+   "		<ul>"
			// 			+	"			<li class=\"dropdown pull-right\">"
			// 			+	"				<a href=\"#\" data-toggle=\"dropdown\" class=\"dropdown-toggle\">"
			// 			+	"					<b class=\"glyphicon glyphicon-cog\"></b>"
			// 			+	"				</a>"
			// 			+	"				<ul class=\"dropdown-menu\">"
			// 			+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_zoom\">放大图层</a></li>"
			// 			+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_edit\">编辑图层</a></li>"
			// 			+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_share\">分享图层</a></li>"
			// 			+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_remove\">删除图层</a></li>"
			// 			+	"				</ul>"
			// 			+	"			</li>"
			// 			+	"		</ul>"
			// 			+	"	</div>"
			// 			+	"</div>";


			// }else if(ruleCount > 1){
				html	+= 	"<div class=\"row layer_row\" value=\"" + i + "\">"
						+	"	<div class=\"col-md-1 col-xs-1\">"
						+	"		<div class=\"glyphicon glyphicon-chevron-down mc-icon\"></div>"							
						+	"	</div>"
						+	"	<div class=\"col-md-1 col-xs-1\">"
						+	"		<div class=\"glyphicon glyphicon-ok mc-icon\"></div>"							
						+	"	</div>"
						+	"	<div class=\"col-md-1 col-xs-1\">"
						+	"		<div class=\"glyphicon glyphicon-eye-open mc-icon\"></div>"							
						+	"	</div>"
						+	"	<div class=\"col-md-1 col-xs-1\">"
						+	"		<div class=\"mc-icon mc-icon-color\"></div>"	
						+	"	</div>"
						+	"	<div class=\"col-md-6 col-xs-1 layer_name\">"
						+	"		<span>" + name + "</span>"
						+	"	</div>"
						+	"	<div class=\"col-md-1 col-xs-1 layer_row_quick_tool\">"
						+   "		<ul>"
						+	"			<li class=\"dropdown pull-right\">"
						+	"				<a href=\"#\" data-toggle=\"dropdown\" class=\"dropdown-toggle\">"
						+	"					<b class=\"glyphicon glyphicon-cog\"></b>"
						+	"				</a>"
						+	"				<ul class=\"dropdown-menu\">"
						+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_zoom\">放大图层</a></li>"
						+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_edit\">编辑图层</a></li>"
						+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_share\">分享图层</a></li>"
						+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_remove\">删除图层</a></li>"
						+	"				</ul>"
						+	"			</li>"
						+	"		</ul>"
						+	"	</div>"
						+	"</div>";

				for(var j = 0; j < ruleCount; ++j){
					var rule = rules[j];
					var symbolizer = rule.symbolizer;
					var icon = this.createSymbolizerIcon(symbolizer,geomType);
					var filter = rule.filter;
					var filterHtml = "";
					if(filter != null){
						var value = filter.value;
						var field = filter.field;
						filterHtml = field + " = " + value;
					}

					html += "<div class=\"row layer_style_row\" value=\"" + i + "\" style=\"display:block\">"
						 +	"	<div class=\"col-md-1 col-xs-1\"></div>"
						 +	"	<div class=\"col-md-1 col-xs-1\"></div>"
						 +	"	<div class=\"col-md-1 col-xs-1\"></div>"
						 +	"	<div class=\"col-md-1 col-xs-1\">"
						 +	"		<div class=\"mc-icon\" style=\"" + icon + "\"></div>"	
						 +	"	</div>"
						 +	"	<div class=\"col-md-7 col-xs-7\">"
						 +	"		<span>" + filterHtml + " </span>"
						 +	"	</div>"
						 +	"</div>"

				}
				var chartHtml = this.getChartsHtml(layer);
				html += chartHtml;
			// }

		}	
		$("#layers_row").html(html);

		//展示具体的style
		this.panel.find(".glyphicon-chevron-down").each(function(){
			$(this).click(
			function(){
				if($(this).hasClass("glyphicon-chevron-down")){
					var id = $(this).parent().parent().attr("value");
					$("#layers_row .layer_style_row[value='" + id + "']").css("display","none");
					$(this).addClass("glyphicon-chevron-right");
					$(this).removeClass("glyphicon-chevron-down");			
					
				}else{
					var id = $(this).parent().parent().attr("value");
					$("#layers_row .layer_style_row[value='" + id + "']").css("display","block");
					$(this).removeClass("glyphicon-chevron-right");
					$(this).addClass("glyphicon-chevron-down");			
				}

			});
		
		});

		//选中layer
		this.panel.find(".layer_name").each(function(){
			$(this).click(function(){
				$("#layers_row .layer_row").removeClass("layer_row_selected");
				var layer_row = $(this).parent();
				layer_row.addClass("layer_row_selected");
//				var layer_id = layer_row.attr("value");
//				MapCloud.selected_layer = mapObj.layers[layer_id];
			});
		});


		this.panel.find(".layer_row_quick_tool_zoom").each(function(){
			$(this).click(function(){
				alert("zoom");
			})
		});
		this.panel.find(".layer_row_quick_tool_edit").each(function(){
			$(this).click(function(){
				var layer_id = $(this).parent().parent().parent().parent().parent().parent().attr("value");
				MapCloud.selected_layer = mapObj.layers[layer_id];
				if(MapCloud.selected_layer != null){
					if(MapCloud.edit_layer_dialog == null){
						MapCloud.edit_layer_dialog = new MapCloud.EditLayerDialog("editLayerDialog");
					}
					//设置修改的图层
					MapCloud.edit_layer_dialog.setLayer(MapCloud.selected_layer);
					MapCloud.edit_layer_dialog.showDialog();
				}

			})
		});

		this.panel.find(".layer_row_quick_tool_share").each(function(){
			$(this).click(function(){
				alert("share");
			})
		});
		
		this.panel.find(".layer_row_quick_tool_remove").each(function(){
			$(this).click(function(){
				var layer_id = $(this).parent().parent().parent().parent().parent().parent().attr("value");
				MapCloud.selected_layer = mapObj.layers[layer_id];
				if(MapCloud.selected_layer != null){
					var layer_name = MapCloud.selected_layer.name;
					mapObj.removeLayer(layer_name);
					dialog.refreshPanel();
					mapObj.setViewer(new GeoBeans.Envelope(-180,-90,180,90));
					mapObj.draw();	

					//同时删掉相应的图表
					for(var i = 0; i < MapCloud.wfs_layer_chart.length;++i){
						var wfsLayerChart = MapCloud.wfs_layer_chart[i];
						if(wfsLayerChart == null){
							continue;
						}
						var chartLayer = wfsLayerChart.layer;
						if(chartLayer == MapCloud.selected_layer){
							wfsLayerChart.removeCharts(i);
							MapCloud.wfs_layer_chart[i] = null;
						}
					}
				}
			})
		});

		this.panel.find(".chart_row_quick_tool_edit").each(function(){
			$(this).click(function(){
				var text = $(this).parent().parent().parent().parent().parent().prev().children().html();
				var layer_id = $(this).parent().parent().parent().parent().parent().parent().parent().children(".layer_row").attr('value');
				var layer = mapObj.layers[layer_id];
			
				var option = null;
				var wfsChartID = $(this).parents(".chart_style_row").attr("value");
				var wfsLayerChart = MapCloud.wfs_layer_chart[wfsChartID];
				if (wfsLayerChart != null) {
					option = wfsLayerChart.option;
				}
				// var option = null;
				// for(var i = 0; i < MapCloud.wfs_layer_chart.length; ++i){
				// 	var wfsLayerChart = MapCloud.wfs_layer_chart[i];
				// 	var chartText = wfsLayerChart.option.text;
				// 	if(chartText == text){
				// 		option = wfsLayerChart.option;
				// 		break;
				// 	}
				// }
				if(MapCloud.new_chart_dialog == null){
					MapCloud.new_chart_dialog = new MapCloud.NewChartDialog("newChartDialog");
				}
				MapCloud.new_chart_dialog.showDialog();		
				MapCloud.new_chart_dialog.setLayerOption(layer,option,wfsChartID);
			})
		});	


		this.panel.find(".chart_row_quick_tool_delete").each(function(){
			$(this).click(function(){
				var wfsChartID = $(this).parents(".chart_style_row").attr("value");
				var wfsLayerChart = MapCloud.wfs_layer_chart[wfsChartID];
				if(wfsLayerChart == null){
					return;
				}
				wfsLayerChart.removeCharts(wfsChartID);
				// MapCloud.wfs_layer_chart.splice(wfsChartID,1);
				MapCloud.wfs_layer_chart[wfsChartID] = null;
				var refresh = new MapCloud.refresh("left_panel");
				refresh.refreshPanel();
			})
		});		

		//图表显示与隐藏
		this.panel.find(".chart_style_row .glyphicon-eye-open,.chart_style_row .glyphicon-eye-close").each(function(){
			$(this).click(function(){
				var wfsChartID = $(this).parents(".chart_style_row").attr("value");
				if($(this).hasClass("glyphicon-eye-open")){
					$(this).removeClass("glyphicon-eye-open");
					$(this).addClass('glyphicon-eye-close');
					var wfsLayerChart = MapCloud.wfs_layer_chart[wfsChartID];
					if(wfsLayerChart == null){
						return;
					}
					wfsLayerChart.removeCharts(wfsChartID);					
				}else if($(this).hasClass("glyphicon-eye-close")){
					$(this).removeClass("glyphicon-eye-close");
					$(this).addClass('glyphicon-eye-open');
					var wfsLayerChart = MapCloud.wfs_layer_chart[wfsChartID];
					if(wfsLayerChart == null){
						return;
					}
					wfsLayerChart.show();					
				}
			})
			
		})
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

	getChartsHtml:function(layer){
		var html = "";
		for(var i = 0; i < MapCloud.wfs_layer_chart.length; ++i){
			var wfsLayerChart = MapCloud.wfs_layer_chart[i];
			if(wfsLayerChart == null){
				continue;
			}
			var wfsLayer = wfsLayerChart.layer;
			if(wfsLayer == layer){
				html += "<div class=\"row chart_style_row\" value=\"" + i + "\">"
						+	"	<div class=\"col-md-1 col-xs-1\"></div>"
						+	"	<div class=\"col-md-1 col-xs-1\"></div>"
						+	"	<div class=\"col-md-1 col-xs-1\">";

				if(wfsLayerChart.showFlag){
					html += "		<div class=\"glyphicon glyphicon-eye-open mc-icon\"></div>";
				}else{
					html += "		<div class=\"glyphicon glyphicon-eye-close mc-icon\"></div>";
				}
				html	+=	"	</div>"
						+	"	<div class=\"col-md-1 col-xs-1\">";
				var option = wfsLayerChart.option;
				var type = option.type;
				var typeHtml = this.getChartTypeHtml(type);
				html += typeHtml;
				html += "</div>";
				
				var text = option.text;
				html += "<div class=\"col-md-6 col-xs-6 chart_name\">"
						+		"<span>" + text + "</span>"
						+	"</div>";
				html += "<div class=\"col-md-1 col-xs-1 chart_row_quick_tool\">"
						+	"		<ul>"
						+	"			<li class=\"dropdown pull-right\">"
						+	"				<a href=\"#\" data-toggle=\"dropdown\" class=\"dropdown-toggle\">"
						+	"					<b class=\"glyphicon glyphicon-cog\"></b>"
						+	"				</a>"
						+	"				<ul class=\"dropdown-menu\">"
						+	"					<li><a href=\"#\" class=\"chart_row_quick_tool_edit\">编辑图表</a></li>"
						+	"					<li><a href=\"#\" class=\"chart_row_quick_tool_delete\">删除图表</a></li>"
						+	"				</ul>"
						+	"			</li>"
						+	"		</ul>"
						+	"	</div>";
				html += "</div>";


			}
		}
		return html;
	},

	getChartTypeHtml:function(chartType){
		var html = "";
		switch(chartType){
			case "bar":{
				html = "<div class='glyphicon glyphicon-signal mc-icon'></div>";
				break;
			}
			case "pie":{
				html = "<div class='glyphicon glyphicon-adjust mc-icon'></div>";
				break;

			}
			default:
				break;
		}
		return html;
	}
});