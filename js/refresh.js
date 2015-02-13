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
		var html = "";

		var baseLayer = mapObj.baseLayer;
		if(baseLayer != null){
			var baseLayerhtml = this.getBaseLayerHtml(baseLayer);
			$("#baseLayer_row").html(baseLayerhtml);
		}
		
		var layers = mapObj.layers;

		var dialog = this;
		for(var i = 0; i < layers.length; ++i){
			var layer = layers[i];
			if(layer == null){
				continue;
			}

			if(layer instanceof GeoBeans.Layer.WFSLayer){
				html += this.getWFSLayerHtml(i,layer);
			}else if(layer instanceof GeoBeans.Layer.WMSLayer){
				html += this.getWMSLayerHtml(i,layer);
			}
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
					$("#layers_row .wms_layer_row[value='" + id + "']").css("display","none");
					$(this).addClass("glyphicon-chevron-right");
					$(this).removeClass("glyphicon-chevron-down");			
				}else{
					var id = $(this).parent().parent().attr("value");
					$("#layers_row .layer_style_row[value='" + id + "']").css("display","block");
					$("#layers_row .wms_layer_row[value='" + id + "']").css("display","block");
					$(this).removeClass("glyphicon-chevron-right");
					$(this).addClass("glyphicon-chevron-down");			
				}
			});
		});

		//图层的显示与隐藏
		this.panel.find(".glyphicon-eye-open").each(function(){
			$(this).click(function(){
				var id = $(this).parent().parent().attr("value");
				var layer = null;
				if(id == "baseLayer"){
					layer = mapObj.baseLayer;
				}else{
					layer = mapObj.layers[id];
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
					// mapObj.setViewer(new GeoBeans.Envelope(-180,-90,180,90));
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

		this.panel.find(".layer_row_quick_tool_remove_base").each(function(){
			$(this).click(function(){
				mapObj.removeBaseLayer();
				mapObj.draw();
				dialog.refreshPanel();
			});
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
					wfsLayerChart.showFront();
					// wfsLayerChart.show();					
				}
			})
			
		});

		var that = this;
		this.panel.find(".layer_style_row .layer-style-icon").each(function(){
			$(this).click(function(){
				var layerID = $(this).parents(".layer_style_row").attr("value");
				var layerStyleID = $(this).attr("value");
				var layer = mapObj.layers[layerID];
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
				var rule = rules[layerStyleID];
				if(rule == null){
					return;
				}
				var symbolizer = rule.symbolizer;
				if(symbolizer == null){
					return;
				}
				if(MapCloud.layer_appearance_dialog == null){
					MapCloud.layer_appearance_dialog = new MapCloud.LayerAppearanceDialog("layerAppearanceDialog");
				}
				var geomType = MapCloud.getLayerGeomType(layer);
				MapCloud.layer_appearance_dialog.setGeomSymbolizer(geomType,symbolizer,layerStyleID,that.setSymoblizerCallback,layerID);
				var fields = layer.featureType.fields;
				var textSymoblizerIndex = that.getTextSymbolizerIndexByFilter(rule.filter,rules);
				var textSymbolizer = null;
				if(textSymoblizerIndex != -1){
					textSymbolizer = rules[textSymoblizerIndex].symbolizer;
				}
				MapCloud.layer_appearance_dialog.setLayerFields(fields);
				MapCloud.layer_appearance_dialog.setTextSymbolizer(textSymbolizer);
				MapCloud.layer_appearance_dialog.showDialog();
			});
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
	},

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
				+	"		<span>" + type + "</span>"
				+	"	</div>"
				+	"	<div class=\"col-md-1 col-xs-1 layer_row_quick_tool\">"
				+   "		<ul>"
				+	"			<li class=\"dropdown pull-right\">"
				+	"				<a href=\"#\" data-toggle=\"dropdown\" class=\"dropdown-toggle\">"
				+	"					<b class=\"glyphicon glyphicon-cog\"></b>"
				+	"				</a>"
				+	"				<ul class=\"dropdown-menu\">"
				+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_zoom\">放大图层</a></li>"
				// +	"					<li><a href=\"#\" class=\"layer_row_quick_tool_edit\">编辑图层</a></li>"
				+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_share\">分享图层</a></li>"
				+	"					<li><a href=\"#\" class=\"layer_row_quick_tool_remove_base\">删除图层</a></li>"
				+	"				</ul>"
				+	"			</li>"
				+	"		</ul>"
				+	"	</div>";
		return html;				
	},


	getWMSLayerHtml : function(index,wmsLayer){
		var html = "";
		var name = wmsLayer.name;
		html	= 	"<li class=\"row layer_row\" value=\"" + index + "\">"
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
				+	"</li>";	


		var layers = wmsLayer.layers;
		for(var i = 0; i < layers.length; ++i){
			var layer = layers[i];
			var row = "<div class=\"row wms_layer_row\" value=\"" + i + "\" style=\"display:block\">"
					 +"	<div class=\"col-md-1 col-xs-1\"></div>"
					 +"	<div class=\"col-md-1 col-xs-1\"></div>"
					 +"	<div class=\"col-md-1 col-xs-1\"></div>"
					 +"	<div class=\"col-md-1 col-xs-1\">"
					 +" 	<div class=\"mc-icon mc-icon-layer\"></div>"
					 +"	</div>"
					 +"	<div class=\"col-md-7 col-xs-7\">"
					 +"		<span>" + layer + "</span>"
					 +"	</div>"
					 +"</div>";
			html += row;

		}					
		return html;
	},

	getWFSLayerHtml : function(i,layer){
		var name = layer.name;
		var style = layer.style;
		if(style == null){
			return "";
		}
		var rules = style.rules;
		if(rules == null){
			return "";
		}
		var ruleCount = rules.length;
		var geomType = MapCloud.getLayerGeomType(layer);
		html	= 	"<li class=\"row layer_row\" value=\"" + i + "\">"
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
				+	"	</div>";
				// +	"</li>";
		// html += "<div class=\"row\">";
		for(var j = 0; j < ruleCount; ++j){
			var rule = rules[j];
			var symbolizer = rule.symbolizer;
			if (symbolizer instanceof GeoBeans.Style.TextSymbolizer){
				continue;
			}
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
				 +	"		<div class=\"mc-icon layer-style-icon\" value=\"" + j + "\" style=\"" + icon + "\"></div>"	
				 +	"	</div>"
				 +	"	<div class=\"col-md-7 col-xs-7\">"
				 +	"		<span>" + filterHtml + " </span>"
				 +	"	</div>"
				 +	"</div>"
		}
		// html += "</div>";
		var chartHtml = this.getChartsHtml(layer);
		html += chartHtml;

		html += "</li>";

		return html;
	}
});