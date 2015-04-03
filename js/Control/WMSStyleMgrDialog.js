MapCloud.WMSStyleMgrDialog = MapCloud.Class(MapCloud.Dialog,{

	wmsStyleMgr 		: null,
	selectedStyle 		: null,
	selectedRuleIndex 	: null,
	mgrUrl 				: "/ows/user1/mgr?",
	wmsLayer 			: null,
	wmsMapLayer			: null,
	wfsLayer 			: null,
	fields 				: null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		this.wmsStyleMgr = new GeoBeans.WMSStleManager(this.mgrUrl); 

		// this.panel.find(".btn-confirm").each(function(){
		// 	$(this).click(function(){
		// 		dialog.closeDialog();
		// 	});
		// });

		this.panel.find("#wms_style_type_list li a").each(function(){
			$(this).click(function(){
				var value = $(this).text();
				var html = value + "<span class='caret'></span>";
				dialog.panel.find("#wms_style_name").html(html);
				value = value.toLowerCase();
				if(value == "all"){
					dialog.wmsStyleMgr.getStyles(dialog.getStyles_callback);
				}else{
					var type = dialog.getWMSStyleType(value);
					if(type != null){
						var styles = dialog.wmsStyleMgr.getStyleByType(type);
						dialog.getStyles_callback(styles);
					}
				}
			});
		});

		// 选中样式
		this.panel.find("#wms_style_list").each(function(){
			$(this).change(function(){
				var selected = $(this).children(":selected");
				var text = selected.text();
				dialog.showStyleInfo(text);
			});
		});

		this.panel.find("#add_style").each(function(){
			$(this).click(function(){
				// alert("add style");
				var type = dialog.panel.find("#wms_style_name").text();
				var styleType = dialog.getWMSStyleType(type.toLowerCase());
				// var style = dialog.getDefaultStyle(styleType);
				// dialog.getStyleXML_callback(style);
				dialog.setDefaultStyle(styleType);
			});
		});

		this.panel.find("#save_style").each(function(){
			$(this).click(function(){
				alert("save style");
			});
		});	

		this.panel.find("#remove_style").each(function(){
			$(this).click(function(){
				var name = dialog.panel.find("#wms_style_list option:selected").text();
				var result = confirm("确认删除" + name + "样式？");
				if(result){
					dialog.wmsStyleMgr.removeStyle(name,dialog.removeStyle_callback)
				}
			});
		});


		this.panel.find(".display-style").each(function(){
			$(this).click(function(){
				
				if(MapCloud.wms_style_dialog == null){
					MapCloud.wms_style_dialog = new MapCloud.WMSStyleDialog("wms-style-dialog");
				}
				MapCloud.wms_style_dialog.showDialog();				
			});
		});

		// this.panel.find(".edit").each(function(){
		// 	$(this).click(function(){
		// 		var name = $(this).text();
		// 		alert(name);
		// 	});
		// });

		
		//颜色选择
		this.panel.find(".color-ramp-div ul li").each(function(){
			$(this).click(function(){
				var html = $(this).html();
				$(this).parents(".color-ramp-div").find("#select_color_ramp").html(html);
			});
		});

		this.panel.find("#add_all_value").each(function(){
			$(this).click(function(){
				var field = dialog.panel.find("#wms_map_layer_fields option:selected").val();
				if(field == null){
					return;
				}

				var values = ["Russia","UK","Byelarus","Netherlands"];
				var beginColorDiv = dialog.panel.find("#select_color_ramp .color-ramp-item div:first");
				var endColorDiv = dialog.panel.find("#select_color_ramp .color-ramp-item div:last");
				var beginColor = beginColorDiv.css("background-color");
				var endColor = endColorDiv.css("background-color");
				var color = new GeoBeans.Color();
				color.setByRgb(beginColor,1);
				beginColor = color.getHex();
				color.setByRgb(endColor,1);
				endColor = color.getHex();
				var number = dialog.panel.find("#select_color_ramp .color-ramp-item div").length;
				// var colors = [beginColor,endColor];
				var colorRamp = new GeoBeans.ColorRamp(beginColor,endColor,number);

				dialog.setStyleByValues(values,colorRamp);
			});
		});
	},

	setWMSLayer : function(wmsLayer,wmsMapLayer){
		this.wmsLayer = wmsLayer;
		this.wmsMapLayer = wmsMapLayer;
		this.wfsLayer = new GeoBeans.Layer.WFSLayer(wmsLayer.name,
										wmsLayer.server,
										wmsMapLayer.name,
										"GML2");
		var fields = null;
		if(this.wfsLayer != null){
			var featureType = this.wfsLayer.featureType;
			if(featureType == null){
				featureType = this.wfsLayer.getFeatureType();
			}
			if(featureType != null){
				fields = featureType.getFields();
			}
		}
		if(fields != null){
			this.fields = fields;
			var html = "";
			var field,name;
			for(var i = 0; i < fields.length;++i){
				field = fields[i];
				if(field != null){
					name = field.name;
					html += "<option value='" + name + "'>" + name + "</option>";
				}
			}
			this.panel.find("#wms_map_layer_fields").html(html);
		}
	},

	getWMSStyleType : function(name){
		if(name == null){
			return null;
		}
		var type = null;
		switch(name){
			case "point":{
				type = GeoBeans.WMSStyle.FeatureStyle.Type.Point;
				break;
			}
			case "linestring":{
				type = GeoBeans.WMSStyle.FeatureStyle.Type.LineString;
				break; 
			}
			case "polygon":{
				type = GeoBeans.WMSStyle.FeatureStyle.Type.Polygon;
				break;
			}
			default:
				break;
		}
		return type;
	},
	cleanup : function(){
		this.wmsMapLayer = null;
		this.wfsLayer = null;
		this.wmsLayer = null;
		this.fields = [];
	},

	showDialog : function(){
		this.wmsStyleMgr.getStyles(this.getStyles_callback);
		this.cleanup();
		this.panel.modal();
	},

	setDefaultStyle : function(type){
		var dialog = this;
		var path = null;
		switch(type){
			case GeoBeans.WMSStyle.FeatureStyle.Type.Point:{
				path = "js/point.xml";
				break;
			}
			case GeoBeans.WMSStyle.FeatureStyle.Type.LineString:{
				path = "js/line.xml";
				break;
			}
			case GeoBeans.WMSStyle.FeatureStyle.Type.Polygon:{
				path = "js/polygon.xml";
				break;
			}
			default:
				break;
		}

		$.get(path,function(xml){
			var reader = new GeoBeans.StyleReader();
			var style = reader.read(xml);
			dialog.getStyleXML_callback(style);
		});
	},

	getStyles_callback : function(styles){
		var html = "";
		for(var i = 0; i < styles.length;++i){
			var style = styles[i];
			var name = style.name;
			html += "<option value='" + name + "'>" + name + "</option>";
		}
		MapCloud.wmsStyleMgr_dialog.panel.find("#wms_style_list").html(html);
		// MapCloud.wmsStyle_dialog.panel.find("#wms_style_list option").each(function(){
		// 	$(this).click(function(){
		// 		var styleName = $(this).text();
		// 		MapCloud.wmsStyle_dialog.showStyleInfo(styleName);
		// 	});
		// });
		// var html = "";
		// for(var i = 0; i < styles.length;++i){
		// 	var style = styles[i];
		// 	var name = style.name;
		// 	html += "<a href='javascript:void(0)' "
		// 	+	"class='list-group-item'>" + name + "</a>";
		// }

		// MapCloud.wmsStyle_dialog.panel.find(".list-group").html(html);
		// MapCloud.wmsStyle_dialog.panel.find(".list-group a").each(function(){
		// 	$(this).click(function(){
		// 		$(this).parent().children(".active").removeClass("active");
		// 		$(this).addClass('active');
		// 		var name = $(this).text();
		// 		MapCloud.wmsStyle_dialog.showStyleInfo(name);
		// 	});
		// });
	},

	showStyleInfo : function(name){
		this.wmsStyleMgr.getStyleXML(name,
			this.getStyleXML_callback);
	},

	getStyleXML_callback : function(style){
		if(style == null){
			return;
		}
		MapCloud.wmsStyleMgr_dialog.selectedStyle = style;
		var rules = style.rules;
		var html = "";
		for(var i = 0; i < rules.length;++i){
			var rule = rules[i];
			var ruleHtml = MapCloud.wmsStyleMgr_dialog.displayRule(rule);
			if(ruleHtml != null){
				html += ruleHtml;
			}
		}
		MapCloud.wmsStyleMgr_dialog.panel.find("#display-styles-div").html(html);
		MapCloud.wmsStyleMgr_dialog.panel.find(".display-style").each(function(){
			$(this).click(function(){
				var rule = null;
				var currentRow = $(this).parents(".row");
				var rows = $(this).parents("#display-styles-div").children();
				var index = rows.index(currentRow);
				if(index != -1){
					rule = MapCloud.wmsStyleMgr_dialog.selectedStyle.rules[index];
					MapCloud.wmsStyleMgr_dialog.selectedRuleIndex = index;
					if(MapCloud.wms_style_dialog == null){
						MapCloud.wms_style_dialog = new MapCloud.WMSStyleDialog("wms-style-dialog");
					}
					MapCloud.wms_style_dialog.showDialog();	
					MapCloud.wms_style_dialog.setRule(rule);	
				}
			});
		});
	},

	displayRule : function(rule){
		if(rule == null){
			return null;
		}

		var html = "";
		var symbolizer = rule.symbolizer;
		if(symbolizer == null){
			return null;
		}
		var fill = symbolizer.fill;
		var fillColor = "#ffffff";
		if(fill != null){
			var fillColor = fill.color.getRgba();
		}
		
		var stroke = symbolizer.stroke;
		var strokeColor = "#ffffff";
		if(stroke != null){
			strokeColor = stroke.color.getRgba();
		}
		html += '<div class="row">'
			 +	'	<div class="col-md-3">'
			 +	'		<a href="javascript:void(0)" class="'
			 +	'			thumbnail display-style" style="border-color:'
			 + 				strokeColor	+ '">'
			 + 	'			<div style="background-color:' 
			 + 				fillColor + '"></div>'
			 +	'		</a>'
			 + 	'	</div>'
			 +	'</div>';  		
		return html;
	},

	removeStyle_callback : function(result){
		if(result.toUpperCase() == "SUCCESS"){
			alert("删除成功");

			// MapCloud.wmsStyle_dialog.panel.find("#wmsStyleType").val("All");
			var value = MapCloud.wmsStyleMgr_dialog .panel.find("#wms_style_name").text();
			value = value.toLowerCase();
			if(value == "all"){
				MapCloud.wmsStyleMgr_dialog .wmsStyleMgr.getStyles(MapCloud.wmsStyleMgr_dialog.getStyles_callback);
			}else{
				var type = MapCloud.wmsStyleMgr_dialog .getWMSStyleType(value);
				if(type != null){
					var styles = MapCloud.wmsStyleMgr_dialog .wmsStyleMgr.getStyleByType(type);
					MapCloud.wmsStyleMgr_dialog.getStyles_callback(styles);
				}
			}
		}else{
			alert(result);
		}
	},


	//返回回来的rule
	setRule : function(rule){
		if(rule == null){
			return;
		}
		// this.selectedRule = rule;
		this.selectedStyle.rules[this.selectedRuleIndex] = rule;
		this.getStyleXML_callback(this.selectedStyle);
	},

	//展示所有的值
	setStyleByValues : function(values,colorRamp){
		var colorValues = colorRamp.getValues();
		var colorValuesLength = colorValues.length;
		var color = null;
		var index = null;
		var html = "";
		for(var i = 0; i < values.length;++i){
			var value = values[i];
			index = i%colorValuesLength;
			color = colorValues[index];
			html += "<tr>"
				+ "		<td>"
				+ "			<div class='style-symbol'"
				+ "			 style='background-color:" 
				+ 			color + "'></div>"
				+ "		</td>"
				+ "		<td>" + value + "</td>"
				+ "		<td>" + value + "</td>"
				+ "	 </tr>";
		}
		this.panel.find("#style_list_title").append(html);
	}

});