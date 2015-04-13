MapCloud.WMSStyleMgrDialog = MapCloud.Class(MapCloud.Dialog,{

	wmsStyleMgr 		: null,
	selectedStyle 		: null,
	selectedRuleIndex 	: null,
	mgrUrl 				: "/ows/user1/mgr?",
	wmsLayer 			: null,
	wmsMapLayer			: null,
	wfsLayer 			: null,
	fields 				: null,
	defaultStyle 		: null,  //默认的样式
	isDefaultStyle		: false,
	style 				: null,	 //生成的样式
	isStyleChanged 		: false, //是否已经更改



	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		this.wmsStyleMgr = new GeoBeans.WMSStyleManager(this.mgrUrl); 

		this.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				dialog.closeDialog();
				if(dialog.isStyleChanged){
					var name = dialog.panel.find("#wms_style_list option:selected").text(); 
					dialog.updateStyle(name);
				}
				dialog.setStyle();
			});
		});

		this.panel.find(".btn-success").each(function(){
			$(this).click(function(){
				if(dialog.isStyleChanged){
					var name = dialog.panel.find("#wms_style_list option:selected").text(); 
					dialog.updateStyle(name);
				}
				dialog.setStyle();
			});
		});		

		this.registerDefaultSymbolDisplay();
		// this.registerSymbolDisplay();
		// this.registerStyleSelected();

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

		var preStyleName = null;
		// 选中样式 有待修改
		this.panel.find("#wms_style_list").each(function(){
			$(this).focus(function(){
				preStyleName = this.value;
			}).change(function(){
				if(dialog.isStyleChanged){
					var text = "是否保存" + preStyleName + "的样式？"
					var result = confirm(text);
					if(result){
						dialog.updateStyle(preStyleName);
					}
				}
				preStyleName = this.value;
				dialog.isStyleChanged = false;
				
				dialog.panel.find("#styles_list_table").html("");
				dialog.defaultStyle = null;
				dialog.style =  null;
				dialog.isDefaultStyle = false;	

				var selected = $(this).children(":selected");
				var name = selected.text();
				var style = dialog.wmsStyleMgr.getStyle(name);
				
				if(style != null){
					dialog.wmsStyleMgr.getStyleXML(name,
					dialog.getStyleXML_callback);
				}
					
			});
		});

		// 新建样式，默认就addStyle一个样式
		this.panel.find("#add_style").each(function(){
			$(this).click(function(){
				// alert("add style");
				var type = dialog.panel.find("#wms_style_name").text();
				if(type == "All"){

				}
				var styleType = dialog.getWMSStyleType(type.toLowerCase());
				// var style = dialog.getDefaultStyle(styleType);
				// dialog.getStyleXML_callback(style);
				dialog.setDefaultStyle(styleType);
			});
		});

		//更新样式
		this.panel.find("#save_style").each(function(){
			$(this).click(function(){
				var name = dialog.panel.find("#wms_style_list option:selected").text(); 
				dialog.updateStyle(name);
				dialog.isStyleChanged = false;
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


		// this.panel.find("#default_style_table .style-symbol").each(function(){
		// 	$(this).click(function(){
		// 		var rule = dialog.defaultStyle.rules[0];
		// 		if(rule == null){
		// 			return;
		// 		}
		// 		if(MapCloud.wms_style_dialog == null){
		// 			MapCloud.wms_style_dialog = new MapCloud.WMSStyleDialog("wms-style-dialog");
		// 		}
		// 		MapCloud.wms_style_dialog.showDialog();
		// 		MapCloud.wms_style_dialog.setRule(rule);
		// 		dialog.isDefaultStyle = true; //证明是修改的默认样式
		// 	});
		// });

		
		//颜色选择
		this.panel.find(".color-ramp-div ul li").each(function(){
			$(this).click(function(){
				var html = $(this).html();
				$(this).parents(".color-ramp-div").find("#select_color_ramp").html(html);
				if(dialog.style == null){
					return;
				}
				var beginColorDiv = $(this).find(".color-ramp-item div:first");
				var endColorDiv = $(this).find(".color-ramp-item div:last");
				var beginColor = beginColorDiv.css("background-color");
				var endColor = endColorDiv.css("background-color");
				var color = new GeoBeans.Color();
				color.setByRgb(beginColor,1);
				beginColor = color.getHex();
				color.setByRgb(endColor,1);
				endColor = color.getHex();
				var number = dialog.style.rules.length;
				var colorRamp = new GeoBeans.ColorRamp(beginColor,endColor,number);
				dialog.changeStyleByColorRamp(dialog.style,colorRamp); 
				var field = dialog.panel.find("#wms_map_layer_fields option:selected").val();
				var html = dialog.getRulesListHtml(field,dialog.style.rules);
				dialog.panel.find("#styles_list_table").html(html);
				dialog.registerSymbolDisplay();	
				dialog.registerStyleSelected();			
			});
		});

		// 添加所有值
		this.panel.find("#add_all_value").each(function(){
			$(this).click(function(){
				var field = dialog.panel.find("#wms_map_layer_fields option:selected").val();
				if(field == null){
					return;
				}
				dialog.wfsLayer.getValue(field,dialog.getValuesCallback);
			});
		});

		//删除一个style 
		this.panel.find("#remove_value").each(function(){
			$(this).click(function(){
				var styleSelected = dialog.panel.find("#styles_list_table tbody tr.selected");
				var stylesTr = dialog.panel.find("#styles_list_table tbody tr");
				var index = stylesTr.index(styleSelected);
				if(index != -1){
					dialog.style.removeRule(index);
					var field = dialog.panel.find("#wms_map_layer_fields option:selected").val();
					var html = dialog.getRulesListHtml(field,dialog.style.rules);	
					dialog.panel.find("#styles_list_table").html(html);
					dialog.registerSymbolDisplay();
					dialog.registerStyleSelected();
				}
				dialog.isStyleChanged = true;
			});
		});	
		// 删除所有值
		this.panel.find("#remove_all_value").each(function(){
			$(this).click(function(){
				dialog.style = null;
				dialog.panel.find("#styles_list_table").html("");
				dialog.isStyleChanged = true;
			});
		});
		
	},

	setWMSLayer : function(wmsLayer,wmsMapLayer){
		var that = this;
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
		this.panel.find("#wms_map_layer_fields").each(function(){
			$(this).change(function(){
				that.panel.find("#styles_list_table").html("");
				that.style = null;
			});
		});

		// 考虑获取到的样式
		var styleName = this.wmsMapLayer.style_name;
		if(styleName == null){
			return;
		}

		var geomType = this.wmsMapLayer.geomType;
		if(geomType == null){
			return;
		}

		var styleGeomType = this.getStyleTypeByGeomType(geomType);
		var styleGeomTypeOptions = this.panel
						.find("#wms_style_list option[type='" + styleGeomType + "']");

		var html = styleGeomType + "<span class='caret'></span>";
		this.panel.find("#wms_style_name").html(html);
		this.panel.find("#wms_style_name").addClass("disabled");
		var styleOptions = this.panel.find("#wms_style_list");
		styleOptions.html(styleGeomTypeOptions);
		var styleOption = this.panel.find("#wms_style_list option[value='" +
							styleName + "']");
		styleOption.attr("selected",true);

		// 通过名字获取到style
		var style = this.wmsStyleMgr.getStyle(styleName);
		if(style != null){
			this.wmsStyleMgr.getStyleXML(styleName,
			this.getStyleXML_callback);
		}


	},

	getWMSStyleType : function(name){
		if(name == null){
			return null;
		}
		var type = null;
		switch(name){
			case "point":{
				type = GeoBeans.WMSStyle.FeatureStyle.GeomType.Point;
				break;
			}
			case "linestring":{
				type = GeoBeans.WMSStyle.FeatureStyle.GeomType.LineString;
				break; 
			}
			case "polygon":{
				type = GeoBeans.WMSStyle.FeatureStyle.GeomType.Polygon;
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
		this.style = null;
		this.defaultStyle = null;
		this.isDefaultStyle = false;
		this.isStyleChanged = false;
		this.panel.find("#styles_list_table").html("");
		this.panel.find("#wms_style_name").removeClass("disabled");
	},

	showDialog : function(){

		var html = "All<span class='caret'></span>";
		this.panel.find("#wms_style_name").html(html);
		this.wmsStyleMgr.getStyles(this.getStyles_callback);
		this.cleanup();
		this.panel.modal();
	},

	setDefaultStyle : function(type){
		if(type == null){
			return;
		}
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

	//展示获取的styles名字
	getStyles_callback : function(styles){
		var html = "";
		for(var i = 0; i < styles.length;++i){
			var style = styles[i];
			var name = style.name;
			var geomType = style.geomType;
			html += "<option value='" + name 
				 + "' type='" + geomType + "'>" + name + "</option>";
		}
		MapCloud.wmsStyleMgr_dialog.panel.find("#wms_style_list").html(html);
		

		//展示第一个样式
		MapCloud.wmsStyleMgr_dialog.panel.find("#styles_list_table").html("");
		MapCloud.wmsStyleMgr_dialog.defaultStyle = null;
		MapCloud.wmsStyleMgr_dialog.style =  null;
		MapCloud.wmsStyleMgr_dialog.isDefaultStyle = false;	
		var styleName = MapCloud.wmsStyleMgr_dialog.panel
					.find("#wms_style_list option:selected").val();
		MapCloud.wmsStyleMgr_dialog.wmsStyleMgr.getStyleXML(styleName,
			MapCloud.wmsStyleMgr_dialog.getStyleXML_callback);
	},

	showStyleInfo : function(name){
		this.wmsStyleMgr.getStyleXML(name,
			this.getStyleXML_callback);
	},

	//获取到的XML解析出style进行展示
	getStyleXML_callback : function(style){
		if(style == null){
			return;
		}
		// MapCloud.wmsStyleMgr_dialog.selectedStyle = style;

		// 重新设计展示页面
		var rules = style.rules;
		if(rules.length == 1){
			var rule = rules[0];
			if(rule != null){
				var filter = rule.filter;
				if(filter == null){
					MapCloud.wmsStyleMgr_dialog.defaultStyle = style; //此时为默认样式
				}
			}
		}//这种情况下就是默认样式

		if(MapCloud.wmsStyleMgr_dialog.defaultStyle == null){//证实可能是多重的样式
			//获取到字段
			var field = MapCloud.wmsStyleMgr_dialog.getProperyNameByRule(rules[0]);
			var fieldOption = MapCloud.wmsStyleMgr_dialog.panel.find("#wms_map_layer_fields option[value='" +
							field + "']");
			fieldOption.attr("selected",true);
			var html = MapCloud.wmsStyleMgr_dialog.getRulesListHtml(field,style.rules);
			MapCloud.wmsStyleMgr_dialog.panel.find("#styles_list_table").html(html);
			// 取第一个样式为默认样式
			MapCloud.wmsStyleMgr_dialog.defaultStyle = MapCloud.wmsStyleMgr_dialog.
						getDefaultStyle(style);
			MapCloud.wmsStyleMgr_dialog.style = style;
		}

		// 首先设置默认样式的页面
		MapCloud.wmsStyleMgr_dialog.
		setDefaultStyleHtml(MapCloud.wmsStyleMgr_dialog.defaultStyle);
		MapCloud.wmsStyleMgr_dialog.registerSymbolDisplay();
		MapCloud.wmsStyleMgr_dialog.registerStyleSelected();
	},

	// 有待修改和调试
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
		this.isStyleChanged = true;
		if(this.isDefaultStyle == true){
			this.isDefaultStyle = false;
			this.defaultStyle.rules[0] = rule;
			this.setDefaultStyleHtml(this.defaultStyle);
		}else{
			this.style.rules[this.selectedRuleIndex].symbolizer = rule.symbolizer;
			this.style.rules[this.selectedRuleIndex].textSymbolizer = rule.textSymbolizer;
			var field = this.panel.find("#wms_map_layer_fields option:selected").val();
			var html = this.getRulesListHtml(field,this.style.rules);
			this.panel.find("#styles_list_table").html(html);
			this.registerSymbolDisplay();
			this.registerStyleSelected();
		}
	},

	// 获取到所有的values
	getValuesCallback : function(values){
		MapCloud.wmsStyleMgr_dialog.isStyleChanged = true;
		var beginColorDiv = MapCloud.wmsStyleMgr_dialog.panel.find("#select_color_ramp .color-ramp-item div:first");
		var endColorDiv = MapCloud.wmsStyleMgr_dialog.panel.find("#select_color_ramp .color-ramp-item div:last");
		var beginColor = beginColorDiv.css("background-color");
		var endColor = endColorDiv.css("background-color");
		var color = new GeoBeans.Color();
		color.setByRgb(beginColor,1);
		beginColor = color.getHex();
		color.setByRgb(endColor,1);
		endColor = color.getHex();
		// var number = MapCloud.wmsStyleMgr_dialog.panel.find("#select_color_ramp .color-ramp-item div").length;
		var number = values.length;
		var colorRamp = new GeoBeans.ColorRamp(beginColor,endColor,number);
		var field = MapCloud.wmsStyleMgr_dialog.panel.find("#wms_map_layer_fields option:selected").val();
		// MapCloud.wmsStyleMgr_dialog.setStyleByValues(field,values,colorRamp);
		MapCloud.wmsStyleMgr_dialog.displayStyleHtmlByValues(field,
									values,colorRamp);
	},

	//根据样式生成html
	displayStyleHtmlByValues : function(field,values,colorRamp){
		var defaultSymbolizer = this.defaultStyle.rules[0].symbolizer;
		var defaultRule = this.defaultStyle.rules[0];
		var style = this.getStyleByValues(defaultRule,field,values,colorRamp);
		if(style != null){
			this.style = style;
			var html = this.getRulesListHtml(field,style.rules);
			this.panel.find("#styles_list_table").html(html);
			this.registerSymbolDisplay();
			this.registerStyleSelected();
		}
	},

	// 生成style,包含筛选的条件
	getStyleByValues : function(defaultRule,field,values,colorRamp){
		var color = null;
		var index = null;
		var colorValue = null;
		var defaultSymbolizer = defaultRule.symbolizer;
		var defaultTextSymbolizer = defaultRule.textSymbolizer;

		var colorValues = colorRamp.getValues();
		var colorValuesLength = colorValues.length;
		var type = defaultSymbolizer.type;
		var style = new GeoBeans.WMSStyle.FeatureStyle("",null);
		var rules = [];
		for(var i = 0; i < values.length; ++i){
			var value = values[i];
			var rule = new GeoBeans.Rule();
			index = i%colorValuesLength;
			colorValue = colorValues[index];

			var symbolizer = defaultSymbolizer.clone();
			if(type == GeoBeans.Symbolizer.Type.Point){
				var opacity = symbolizer.fill.getOpacity();
				color = new GeoBeans.Color();
				color.setByHex(colorValue,opacity);
				symbolizer.fill.color = color;
			}else if(type == GeoBeans.Symbolizer.Type.Line){
				var opacity = symbolizer.stroke.getOpacity();
				color = new GeoBeans.Color();
				color.setByHex(colorValue,opacity);
				symbolizer.stroke.color = color;
			}else if(type == GeoBeans.Symbolizer.Type.Polygon){
				var opacity = symbolizer.fill.getOpacity();
				color = new GeoBeans.Color();
				color.setByHex(colorValue,opacity);
				symbolizer.fill.color = color;
			}

			rule.symbolizer = symbolizer;

			var filter = new GeoBeans.BinaryComparisionFilter();
			var propertyName = new GeoBeans.PropertyName();
			propertyName.name = field;
			var literal = new GeoBeans.Literal();
			literal.value = value;
			filter.operator = GeoBeans.ComparisionFilter.OperatorType.ComOprEqual;
			filter.expression1 = propertyName;
			filter.expression2 = literal;

			rule.filter = filter;
			rule.name = i;

			if(defaultTextSymbolizer != null){
				rule.textSymbolizer = defaultTextSymbolizer;
			}

			rules.push(rule);
		}
		style.rules = rules;
		return style;
	},


	// //展示所有的值 old 版本
	// setStyleByValues : function(field,values,colorRamp){
	// 	var colorValues = colorRamp.getValues();
	// 	var colorValuesLength = colorValues.length;
	// 	var color = null;
	// 	var index = null;
	// 	var html = "";
	// 	for(var i = 0; i < values.length;++i){
	// 		var value = values[i];
	// 		index = i%colorValuesLength;
	// 		color = colorValues[index];
	// 		html += "<tr>"
	// 			+ "		<td>"
	// 			+ "			<div class='style-symbol'"
	// 			+ "			 style='background-color:" 
	// 			+ 			color + "'></div>"
	// 			+ "		</td>"
	// 			+ "		<td>" + value + "</td>"
	// 			+ "		<td>" + value + "</td>"
	// 			+ "	 </tr>";
	// 	}
	// 	this.panel.find("#styles_list_table tbody").html(html);
	// },


	//设置默认样式的样式
	setDefaultStyleHtml : function(style){
		if(style == null){
			return;
		}
		var rules = style.rules;
		if(rules.length == 1){
			var symbolDiv = this.panel.find("#default_style_table .style-symbol").first();
			var rule = rules[0];
			if(rule == null){
				return;
			}
			var symbolizer = rule.symbolizer;
			if(symbolizer == null){
				return;
			}
			var cssObj = this.getStyleSymbolCss(symbolizer);
			symbolDiv.css(cssObj);
		}
		
	},

	getStyleSymbolCss : function(symbolizer){
		var cssObj = {};
		var stroke = null;
		var fill = null;
		var strokeColor = null;
		var strokeColorRgba = null;
		var fillColor = null;
		var fillColorRgba = null;
		var type = symbolizer.type;
		switch(type){
			case GeoBeans.Symbolizer.Type.Point:{
				stroke = symbolizer.stroke;
				if(stroke != null){
					strokeColor = stroke.color;
					strokeColorRgba = strokeColor.getRgba();
				}
				var fill = symbolizer.fill;
				if(fill != null){
					fillColor = fill.color;
					fillColorRgba = fillColor.getRgba();
				}
				cssObj = {"background-color":fillColorRgba,
						 "border-color": strokeColorRgba};
				break;
			}
			case GeoBeans.Symbolizer.Type.Line:{
				var stroke = symbolizer.stroke;
				if(stroke != null){
					strokeColor = stroke.color;
					strokeColorRgba = strokeColor.getRgba();
				}
				cssObj = {"background-color":strokeColorRgba,
						  "border-color": "#fff"};
				break;
			}
			case GeoBeans.Symbolizer.Type.Polygon:{
				stroke = symbolizer.stroke;
				if(stroke != null){
					strokeColor = stroke.color;
					strokeColorRgba = strokeColor.getRgba();
				}
				var fill = symbolizer.fill;
				if(fill != null){
					fillColor = fill.color;
					fillColorRgba = fillColor.getRgba();
				}
				cssObj = {"background-color":fillColorRgba,
						 "border-color": strokeColorRgba};
				break;
			}
			default:
				break;
		}
		return cssObj;
	},


	//生成所有Style的rules的table代码
	getRulesListHtml : function(field,rules){
		if(rules == null){
			return;
		}
		var html = "<thead>"
				+  "	<tr><th><span>&nbsp;</span></th>"
				+  "		<th>值列表</th>"
				+  "		<th>" + field + "</th>"
				+  "	</tr>"
				+  "</thead>"
				+  "<tbody>";
		for(var i = 0; i < rules.length; ++i){
			var rule = rules[i];
			var filter = rule.filter;
			var value = "";
			if(filter != null){
				var expression1 = filter.expression1;
				var expression2 = filter.expression2;
				if(expression1 != null && 
					expression1.type == GeoBeans.Expression.Type.Literal){
					value = expression1.value;
				}else if(expression2 != null && 
					expression2.type == GeoBeans.Expression.Type.Literal){
					value = expression2.value;
				}
			}
			
			var symbolizer = rule.symbolizer;
			var symbolHtml = this.getSymbolHtml(symbolizer);
			html += "<tr>"
				+ "		<td>"
				+ 			symbolHtml
				+ "		</td>"
				+ "		<td>"
				+ 			value 
				+ "		</td>"
				+ "		<td>"
				+ 			value
				+ "		</td>"
				+ "	</tr>";
		}
		html += "</tbody>";
		return html;
	},

	getSymbolHtml : function(symbolizer){
		var type = symbolizer.type;
		var html = "";
		var strokeColor = null;
		var strokeColorRgba = null;
		var fillColor = null;
		var fillColorRgba = null;
		if(type == GeoBeans.Symbolizer.Type.Point){
			var stroke = symbolizer.stroke;
			if(stroke != null){
				strokeColor = stroke.color;
				strokeColorRgba = strokeColor.getRgba();
			}
			var fill = symbolizer.fill;
			if(fill != null){
				fillColor = fill.color;
				fillColorRgba = fillColor.getRgba();
			}
			html = '<div class="style-symbol" style="'
				+  'background-color:' + fillColorRgba
				+  ';border-color:' + strokeColorRgba
				+  '"></div>';
		}else if(type == GeoBeans.Symbolizer.Type.Line){
			var stroke = symbolizer.stroke;
			if(stroke != null){
				strokeColor = stroke.color;
				strokeColorRgba = strokeColor.getRgba();
			}
			html = '<div class="style-symbol" style="'
				+  'background-color:' + strokeColorRgba
				+  '"></div>';
		}else if(type == GeoBeans.Symbolizer.Type.Polygon){
			var stroke = symbolizer.stroke;
			if(stroke != null){
				strokeColor = stroke.color;
				strokeColorRgba = strokeColor.getRgba();
			}
			var fill = symbolizer.fill;
			if(stroke != null){
				fillColor = fill.color;
				fillColorRgba = fillColor.getRgba();
			}
			html = '<div class="style-symbol" style="'
				+  'background-color:' + fillColorRgba
				+  ';border-color:' + strokeColorRgba
				+  '"></div>';
		}
		return html;
	},

	registerDefaultSymbolDisplay : function(){
		var that = this;
		this.panel.find("#default_style_table .style-symbol").each(function(){
			$(this).click(function(){
				// var table_id = $(this).parents("table").first().attr("id");
				// if(table_id == "default_style_table"){
					that.isDefaultStyle = true;
					var rule = that.defaultStyle.rules[0];
					if(rule != null){
						if(MapCloud.wms_style_dialog == null){
							MapCloud.wms_style_dialog = new MapCloud.WMSStyleDialog("wms-style-dialog");
						}
						MapCloud.wms_style_dialog.showDialog();	
						MapCloud.wms_style_dialog.setRule(rule,
							that.fields);
					}
				// }
			});
		});
	},

	registerSymbolDisplay : function(){
		var that = this;
		this.panel.find("#styles_list_table .style-symbol").each(function(){
			$(this).click(function(){
				// var table_id = $(this).parents("table").first().attr("id");
				// if(table_id == "default_style_table"){
				// 	that.isDefaultStyle = true;
				// 	var rule = that.defaultStyle.rules[0];
				// 	if(rule != null){
				// 		if(MapCloud.wms_style_dialog == null){
				// 			MapCloud.wms_style_dialog = new MapCloud.WMSStyleDialog("wms-style-dialog");
				// 		}
				// 		MapCloud.wms_style_dialog.showDialog();	
				// 		MapCloud.wms_style_dialog.setRule(rule,
				// 			that.fields);
				// 	}
				// }else
				// if(table_id == "styles_list_table"){
					that.isDefaultStyle = false;
					var symbols = $(this).parents("tbody").find(".style-symbol");
					var index = symbols.index($(this));
					if(index != -1){
						var rule = that.style.rules[index];
						
						if(rule != null){
							if(MapCloud.wms_style_dialog == null){
								MapCloud.wms_style_dialog = new MapCloud.WMSStyleDialog("wms-style-dialog");
							}
							MapCloud.wms_style_dialog.showDialog();	
							MapCloud.wms_style_dialog.setRule(rule,that.fields);
							MapCloud.wmsStyleMgr_dialog.selectedRuleIndex = index;	
						}
					}
				// }
			});
		});
	},

	//选择的一个样式
	registerStyleSelected : function(){
		var tr = this.panel.find("#styles_list_table tbody tr").each(function(){
			$(this).click(function(){
				$(this).parent().children().removeClass("selected");
				$(this).addClass("selected");
			});
		});
	},

	//更新style
	updateStyle : function(name){
		var updateStyle = null;
		//如果下面的分类有值，则优先画分类的
		if(this.style != null){
			updateStyle = this.style;
		}else if(this.defaultStyle != null){
			updateStyle = this.defaultStyle;
		}

		if(updateStyle != null){
			// var name = this.panel.find("#wms_style_list option:selected").text(); 
			var xml = this.wmsStyleMgr.writer.write(updateStyle);
			this.wmsStyleMgr.updateStyle(xml,name,this.updateCallback);
		}
	},

	updateCallback : function(result){
		if(result != "success"){
			alert(result);
		}
		// var styleName = MapCloud.wmsStyleMgr_dialog.panel.
		// 			find("#wms_style_list option:selected").val();
		// if(MapCloud.wmsStyleMgr_dialog.wmsMapLayer == null){
		// 	return;
		// }
		// var oldName = MapCloud.wmsStyleMgr_dialog.wmsMapLayer.style_name;
		// if(oldName != styleName){
		// 	MapCloud.wmsStyleMgr_dialog.wmsLayer
		// 		.setMapLayerStyle(MapCloud.wmsStyleMgr_dialog.wmsMapLayer,
		// 			styleName,MapCloud.wmsStyleMgr_dialog.setStyleCallback);
		// }else{
		// 	MapCloud.wmsStyleMgr_dialog.wmsLayer.update();
		// }
		// mapObj.draw();
	},

	setStyle : function(){
		var styleName = this.panel.
					find("#wms_style_list option:selected").val();
		if(this.wmsMapLayer == null){
			return;
		}
		var oldName = this.wmsMapLayer.style_name;
		if(oldName != styleName){
			this.wmsLayer
				.setMapLayerStyle(this.wmsMapLayer,
					styleName,this.setStyleCallback);
		}else{
			this.wmsLayer.update();
		}
		mapObj.draw();
	},

	setStyleCallback : function(result){
		if(result != "success"){
			alert(result);
		}
	},
	//根据rule拿到是哪个字段
	getProperyNameByRule : function(rule){
		if(rule == null){
			return null;
		}
		var filter = rule.filter;
		if(filter == null){
			return null;
		}
		var type = filter.type;
		if(type == GeoBeans.Filter.Type.FilterComparsion){
			var operator = filter.operator;
			if(operator == GeoBeans.ComparisionFilter.OperatorType.ComOprEqual){
				var expression1 = filter.expression1;
				var expressionType = expression1.type;
				if(expressionType == GeoBeans.Expression.Type.PropertyName){
					var name = expression1.name;
					return name; 
				}
				var expression2 = filter.expression2;
				expressionType = expression2.type;
				if(expressionType == GeoBeans.Expression.Type.PropertyName){
					var name = expression1.name;
					return name; 
				}
			}
		}
		return null;
	},

	// 根据用户的样式来得到默认样式
	getDefaultStyle : function(style){
		var rules = style.rules;
		if(rules == null){
			return null;
		}
		var rule = rules[0];
		if(rule == null){
			return null;
		}
		var symbolizer = rule.symbolizer;
		if(symbolizer == null){
			return null;
		}
		var textSymbolizer = rule.textSymbolizer;
		var geomType = style.geomType;
		var defaultStyle = new GeoBeans.WMSStyle.FeatureStyle("default",geomType);
		var rule = new GeoBeans.Rule();
		var defaultSymbolizer = symbolizer.clone();
		rule.symbolizer = defaultSymbolizer;

		
		if(textSymbolizer != null){
			var defaultTextSymbolizer = textSymbolizer.clone();
			
			rule.textSymbolizer = defaultTextSymbolizer;
		}
		
		defaultStyle.addRule(rule);
		return defaultStyle;
	},

	//切换了色阶，重新生成style
	changeStyleByColorRamp : function(style,colorRamp){
		var rules = style.rules;
		if(rules == null){
			return;
		}
		var colorValues = colorRamp.getValues();
		var colorValue = null;

		for(var i = 0; i < rules.length;++i){
			var rule = rules[i];
			if(rule == null){
				continue;
			}
			var symbolizer = rule.symbolizer;
			if(symbolizer == null){
				continue;
			}
			colorValue = colorValues[i];
			var type = symbolizer.type;
			if(type == GeoBeans.Symbolizer.Type.Point){
				var opacity = symbolizer.fill.getOpacity();
				color = new GeoBeans.Color();
				color.setByHex(colorValue,opacity);
				symbolizer.fill.color = color;
			}else if(type == GeoBeans.Symbolizer.Type.Line){
				var opacity = symbolizer.stroke.getOpacity();
				color = new GeoBeans.Color();
				color.setByHex(colorValue,opacity);
				symbolizer.stroke.color = color;
			}else if(type == GeoBeans.Symbolizer.Type.Polygon){
				var opacity = symbolizer.fill.getOpacity();
				color = new GeoBeans.Color();
				color.setByHex(colorValue,opacity);
				symbolizer.fill.color = color;
			}
		}
	},

	//根据图层的样式，来获取style的样式
	getStyleTypeByGeomType : function(geomType){
		geomType = geomType.toUpperCase();
		var styleGeomType = null;
		switch(geomType){
			case "POINT":
			case "MULTIPOINT":{
				styleGeomType = GeoBeans.WMSStyle.FeatureStyle.GeomType.Point;
				break;
			}
			case "LINESTRING":
			case "MULTILINESTRING":{
				styleGeomType = GeoBeans.WMSStyle.FeatureStyle.GeomType.LineString;
				break;
			}
			case "POLYGON":
			case "MULTIPOLYGON":{
				styleGeomType = GeoBeans.WMSStyle.FeatureStyle.GeomType.Polygon;
				break;
			}
			default:
				break;
		}
		return styleGeomType;
	}

});