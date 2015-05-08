MapCloud.StyleMgrDialog = MapCloud.Class(MapCloud.Dialog,{

	styleMgr 		: null,
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
	addStyleName 		: null, //新增样式的名称
	dbLayer 			: null,


	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		this.styleMgr = new GeoBeans.StyleManager(this.mgrUrl); 

		this.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				
				var name = dialog.panel.find("#wms_style_list option:selected").text(); 
				if(name != "default"){
					var style = dialog.styleMgr.getStyle(name);
					if(style == null){
						//save
						var s = null;
						if(dialog.style != null){
							s = dialog.style;
						}else{
							s = dialog.defaultStyle;
						}
						dialog.addStyle(s);
					}else{
						//update
						dialog.updateStyle(name);
					}
				}
				// if(dialog.isStyleChanged){
				// 	var name = dialog.panel.find("#wms_style_list option:selected").text(); 
				// 	dialog.updateStyle(name);
				// }
				dialog.setStyle();
				dialog.closeDialog();
			});
		});

		this.panel.find(".btn-success").each(function(){
			$(this).click(function(){
				// if(dialog.isStyleChanged){
				// 	var name = dialog.panel.find("#wms_style_list option:selected").text(); 
				// 	dialog.updateStyle(name);
				// }
				var name = dialog.panel.find("#wms_style_list option:selected").text(); 
				if(name != "default"){
					var style = dialog.styleMgr.getStyle(name);
					if(style == null){
						//save
						var s = null;
						if(dialog.style != null){
							s = dialog.style;
						}else{
							s = dialog.defaultStyle;
						}
						dialog.addStyle(s);
					}else{
						//update
						dialog.updateStyle(name);
					}
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
					dialog.styleMgr.getStyles(dialog.getStyles_callback);
				}else{
					var type = dialog.getStyleType(value);
					if(type != null){
						var styles = dialog.styleMgr.getStyleByType(type);
						dialog.getStyles_callback(styles);
					}
				}
			});
		});

		var preStyleName = null;
		// 切换样式
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
				var style = dialog.styleMgr.getStyle(name);
				
				if(style != null){
					dialog.styleMgr.getStyleXML(name,
					dialog.getStyleXML_callback);
				}
					
			});
		});

		// 新建样式，
		this.panel.find("#add_style").each(function(){
			$(this).click(function(){
				// alert("add style");

				var type = dialog.panel.find("#wms_style_name").text();
				if(type == "All"){
					alert("请选择一个类型");
					return;
				}
				if(MapCloud.styleName_dialog == null){
					MapCloud.styleName_dialog = new MapCloud.StyleNameDialog("style-name-dialog");
				}
				MapCloud.styleName_dialog.setFlag("add");
				MapCloud.styleName_dialog.showDialog();
				dialog.isStyleChanged = true;
				// var styleType = dialog.getStyleType(type.toLowerCase());
				// // var style = dialog.getDefaultStyle(styleType);
				// // dialog.getStyleXML_callback(style);
				// dialog.setDefaultStyle(styleType);
			});
		});

		//更新样式
		this.panel.find("#save_style").each(function(){
			$(this).click(function(){
				var name = dialog.panel.find("#wms_style_list option:selected").text(); 
				if(name == "default"){
					//保存当前样式
					if(MapCloud.styleName_dialog == null){
						MapCloud.styleName_dialog = new MapCloud.StyleNameDialog("style-name-dialog");
					}
					MapCloud.styleName_dialog.setFlag("save");
					MapCloud.styleName_dialog.showDialog();					
					return;
					// dialog.addStyle(name);
				}else{
					var style = dialog.styleMgr.getStyle(name);
					if(style == null){
						//save
						var s = null;
						if(dialog.style != null){
							s = dialog.style;
						}else{
							s = dialog.defaultStyle;
						}
						dialog.addStyle(s);
					}else{
						//update
						dialog.updateStyle(name);
					}
					
				}
				dialog.isStyleChanged = false;
			});
		});	

		this.panel.find("#remove_style").each(function(){
			$(this).click(function(){
				var name = dialog.panel.find("#wms_style_list option:selected").text();
				var result = confirm("确认删除" + name + "样式？");
				if(result){
					dialog.styleMgr.removeStyle(name,dialog.removeStyle_callback)
				}
			});
		});

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
				if(dialog.wfsLayer == null){
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
		var style = this.styleMgr.getStyle(styleName);
		if(style != null){
			this.styleMgr.getStyleXML(styleName,
			this.getStyleXML_callback);
		}
	},

	getStyleType : function(name){
		if(name == null){
			return null;
		}
		var type = null;
		switch(name){
			case "point":{
				type = GeoBeans.Style.FeatureStyle.GeomType.Point;
				break;
			}
			case "linestring":{
				type = GeoBeans.Style.FeatureStyle.GeomType.LineString;
				break; 
			}
			case "polygon":{
				type = GeoBeans.Style.FeatureStyle.GeomType.Polygon;
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
		this.dbLayer = null;
		this.fields = [];
		this.style = null;
		this.defaultStyle = null;
		this.isDefaultStyle = false;
		this.isStyleChanged = false;
		this.addStyleName = null;
		this.panel.find("#styles_list_table").html("");
		this.panel.find("#wms_map_layer_fields").html("");
		this.panel.find("#wms_style_name").removeClass("disabled");
	},

	closeDialog : function(){
		this.panel.modal("hide");

		if(this.wmsMapLayer != null){
			if(this.fields != null){
				this.wmsMapLayer.fields = this.fields;
			}
			if(this.style != null){
				this.wmsMapLayer.style = this.style;
			}else if(this.defaultStyle != null){
				this.wmsMapLayer.style = this.defaultStyle;
			}
		}
		if(MapCloud.refresh_panel == null){
			MapCloud.refresh_panel = 
					new MapCloud.refresh("left_panel");
		}
		MapCloud.refresh_panel.refreshPanel();
		
	},
	showDialog : function(){

		var html = "All<span class='caret'></span>";
		this.panel.find("#wms_style_name").html(html);
		this.styleMgr.getStyles(this.getStyles_callback);
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
			case GeoBeans.Style.FeatureStyle.Type.Point:{
				path = "js/point.xml";
				break;
			}
			case GeoBeans.Style.FeatureStyle.Type.LineString:{
				path = "js/line.xml";
				break;
			}
			case GeoBeans.Style.FeatureStyle.Type.Polygon:{
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
		MapCloud.styleMgr_dialog.panel.find("#wms_style_list").html(html);
		

		//展示第一个样式
		MapCloud.styleMgr_dialog.panel.find("#styles_list_table").html("");
		MapCloud.styleMgr_dialog.defaultStyle = null;
		MapCloud.styleMgr_dialog.style =  null;
		MapCloud.styleMgr_dialog.isDefaultStyle = false;	
		var styleName = MapCloud.styleMgr_dialog.panel
					.find("#wms_style_list option:selected").val();
		MapCloud.styleMgr_dialog.styleMgr.getStyleXML(styleName,
			MapCloud.styleMgr_dialog.getStyleXML_callback);
	},

	showStyleInfo : function(name){
		this.styleMgr.getStyleXML(name,
			this.getStyleXML_callback);
	},

	//获取到的XML解析出style进行展示
	getStyleXML_callback : function(style){
		if(style == null){
			return;
		}
		// MapCloud.styleMgr_dialog.selectedStyle = style;

		// 重新设计展示页面
		var rules = style.rules;
		if(rules.length == 1){
			var rule = rules[0];
			if(rule != null){
				var filter = rule.filter;
				if(filter == null){
					MapCloud.styleMgr_dialog.defaultStyle = style; //此时为默认样式
				}
			}
		}//这种情况下就是默认样式

		if(MapCloud.styleMgr_dialog.defaultStyle == null){//证实可能是多重的样式
			//获取到字段
			var field = MapCloud.styleMgr_dialog.getProperyNameByRule(rules[0]);
			var fieldOption = MapCloud.styleMgr_dialog.panel.find("#wms_map_layer_fields option[value='" +
							field + "']");
			fieldOption.attr("selected",true);
			var html = MapCloud.styleMgr_dialog.getRulesListHtml(field,style.rules);
			MapCloud.styleMgr_dialog.panel.find("#styles_list_table").html(html);
			// 取第一个样式为默认样式
			MapCloud.styleMgr_dialog.defaultStyle = MapCloud.styleMgr_dialog.
						getDefaultStyle(style);
			MapCloud.styleMgr_dialog.style = style;
		}

		// 首先设置默认样式的页面
		MapCloud.styleMgr_dialog.
		setDefaultStyleHtml(MapCloud.styleMgr_dialog.defaultStyle);
		MapCloud.styleMgr_dialog.registerSymbolDisplay();
		MapCloud.styleMgr_dialog.registerStyleSelected();
	},

	// 有待修改和调试
	removeStyle_callback : function(result){
		if(result.toUpperCase() == "SUCCESS"){
			alert("删除成功");

			// MapCloud.wmsStyle_dialog.panel.find("#wmsStyleType").val("All");
			var value = MapCloud.styleMgr_dialog .panel.find("#wms_style_name").text();
			value = value.toLowerCase();
			if(value == "all"){
				MapCloud.styleMgr_dialog .styleMgr.getStyles(MapCloud.styleMgr_dialog.getStyles_callback);
			}else{
				var type = MapCloud.styleMgr_dialog .getStyleType(value);
				if(type != null){
					var styles = MapCloud.styleMgr_dialog .styleMgr.getStyleByType(type);
					MapCloud.styleMgr_dialog.getStyles_callback(styles);
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
		MapCloud.styleMgr_dialog.isStyleChanged = true;
		var beginColorDiv = MapCloud.styleMgr_dialog.panel.find("#select_color_ramp .color-ramp-item div:first");
		var endColorDiv = MapCloud.styleMgr_dialog.panel.find("#select_color_ramp .color-ramp-item div:last");
		var beginColor = beginColorDiv.css("background-color");
		var endColor = endColorDiv.css("background-color");
		var color = new GeoBeans.Color();
		color.setByRgb(beginColor,1);
		beginColor = color.getHex();
		color.setByRgb(endColor,1);
		endColor = color.getHex();
		// var number = MapCloud.styleMgr_dialog.panel.find("#select_color_ramp .color-ramp-item div").length;
		var number = values.length;
		var colorRamp = new GeoBeans.ColorRamp(beginColor,endColor,number);
		var field = MapCloud.styleMgr_dialog.panel.find("#wms_map_layer_fields option:selected").val();
		// MapCloud.styleMgr_dialog.setStyleByValues(field,values,colorRamp);
		MapCloud.styleMgr_dialog.displayStyleHtmlByValues(field,
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
		var geomType = this.defaultStyle.geomType;
		var styleName = this.panel.find("#wms_style_list option:selected")
					.text();
		var style = new GeoBeans.Style.FeatureStyle(styleName,geomType);
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
			if(fill != null){
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
						if(MapCloud.style_dialog == null){
							MapCloud.style_dialog = new MapCloud.StyleDialog("style-dialog");
						}
						MapCloud.style_dialog.showDialog();	
						MapCloud.style_dialog.setRule(rule,
							that.fields,"styleMgr");
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
				// 		if(MapCloud.style_dialog == null){
				// 			MapCloud.style_dialog = new MapCloud.StyleDialog("style-dialog");
				// 		}
				// 		MapCloud.style_dialog.showDialog();	
				// 		MapCloud.style_dialog.setRule(rule,
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
							if(MapCloud.style_dialog == null){
								MapCloud.style_dialog = new MapCloud.StyleDialog("style-dialog");
							}
							MapCloud.style_dialog.showDialog();	
							MapCloud.style_dialog.setRule(rule,that.fields,"styleMgr");
							MapCloud.styleMgr_dialog.selectedRuleIndex = index;	
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
		//如果是默认样式，则不绘制。
		if(name == "default"){
			return;
		}
		var updateStyle = null;
		//如果下面的分类有值，则优先画分类的
		if(this.style != null){
			updateStyle = this.style;
		}else if(this.defaultStyle != null){
			updateStyle = this.defaultStyle;
		}

		if(updateStyle != null){
			// var name = this.panel.find("#wms_style_list option:selected").text(); 
			var xml = this.styleMgr.writer.write(updateStyle);
			this.styleMgr.updateStyle(xml,name,this.updateCallback);
		}
	},

	updateCallback : function(result){
		if(result != "success"){
			alert(result);
		}
		// var styleName = MapCloud.styleMgr_dialog.panel.
		// 			find("#wms_style_list option:selected").val();
		// if(MapCloud.styleMgr_dialog.wmsMapLayer == null){
		// 	return;
		// }
		// var oldName = MapCloud.styleMgr_dialog.wmsMapLayer.style_name;
		// if(oldName != styleName){
		// 	MapCloud.styleMgr_dialog.wmsLayer
		// 		.setMapLayerStyle(MapCloud.styleMgr_dialog.wmsMapLayer,
		// 			styleName,MapCloud.styleMgr_dialog.setStyleCallback);
		// }else{
		// 	MapCloud.styleMgr_dialog.wmsLayer.update();
		// }
		// mapObj.draw();
	},

	setStyle : function(){
		var styleName = this.panel.
					find("#wms_style_list option:selected").val();
		if(this.wmsMapLayer != null){
			var oldName = this.wmsMapLayer.style_name;
			if(oldName != styleName){
				this.wmsLayer
					.setMapLayerStyle(this.wmsMapLayer,
						styleName,this.setStyleCallback);
			}else{
				this.wmsLayer.update();
			}
		}

		if(this.wmsMapLayer == null && this.wfsLayer != null){
			var style = this.wfsLayer.style;
			if(this.style != null){
				this.wfsLayer.setStyle(this.style);
			}else{
				this.wfsLayer.setStyle(this.defaultStyle);
			}
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
		var defaultStyle = new GeoBeans.Style.FeatureStyle("default",geomType);
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
				styleGeomType = GeoBeans.Style.FeatureStyle.GeomType.Point;
				break;
			}
			case "LINESTRING":
			case "MULTILINESTRING":{
				styleGeomType = GeoBeans.Style.FeatureStyle.GeomType.LineString;
				break;
			}
			case "POLYGON":
			case "MULTIPOLYGON":{
				styleGeomType = GeoBeans.Style.FeatureStyle.GeomType.Polygon;
				break;
			}
			default:
				break;
		}
		return styleGeomType;
	},

	setAddStyleName : function(styleName,flag){
		if(styleName == null){
			return;
		}
		this.addStyleName = styleName;
		var style = this.styleMgr.getStyle(styleName);
		if(style != null){
			alert("已经有" + styleName + "样式，请重新输入");
			if(MapCloud.styleName_dialog == null){
				MapCloud.styleName_dialog = new MapCloud.StyleNameDialog("style-name-dialog");
			}
			MapCloud.styleName_dialog.showDialog();
			return;
		}
		var styleOptions = this.panel.find("#wms_style_list");
		if(flag == "add"){
			var type = this.panel.find("#wms_style_name").text();
			var styleType = this.getStyleType(type.toLowerCase())
			var option = '<option value="' + styleName + '" type="' 
						+ styleType + '">' + styleName + '</option>';
			styleOptions.append(option);
			styleOptions.find("option[value='" 
					+ styleName + "']").attr("selected",true);
			this.loadAddStyle(styleType);
		}else if(flag == "save"){
			//默认样式则修改名称
			this.panel.find("#wms_style_list option[value='default']").text(styleName);
			var addstyle = null;
			if(this.style != null){
				addstyle = this.style;
			}else{
				addstyle = this.defaultStyle;
			}
			this.addStyle(addstyle);
		}
		// var styleOptions = this.panel.find("#wms_style_list");
		// styleNameCur = this.panel.find("#wms_style_list option:selected").text();
		// if(styleNameCur == "default"){
		// 	//默认样式则修改名称
		// 	this.panel.find("#wms_style_list option[value='default']").text(styleName);
		// 	this.addStyle(styleName);
		// }else{
		// 	var type = this.panel.find("#wms_style_name").text();
		// 	var styleType = this.getStyleType(type.toLowerCase())
		// 	var option = '<option value="' + styleName + '" type="' 
		// 				+ styleType + '">' + styleName + '</option>';
		// 	styleOptions.append(option);
		// 	this.loadAddStyle(styleType);
		// }
		// this.addStyleName = styleName;
		// var type = this.panel.find("#wms_style_name").text();
		// var styleType = this.getStyleType(type.toLowerCase());
		// this.addStyleByType(styleType,styleName);
	},

	//页面上展示从本地读到的样式
	loadAddStyle : function(styleType){
		if(styleType == null){
			return;
		}
		var that = this;
		var path = null;
		switch(styleType){
			case GeoBeans.Style.FeatureStyle.GeomType.Point:{
				path = "js/point.xml";
				break;
			}
			case GeoBeans.Style.FeatureStyle.GeomType.LineString:{
				path = "js/line.xml";
				break;
			}
			case GeoBeans.Style.FeatureStyle.GeomType.Polygon:{
				path = "js/polygon.xml";
				break;
			}
			default:
				break;
		}	
		$.get(path,function(xml){
			// var xmlString = (new XMLSerializer()).serializeToString(xml);
			// that.styleMgr.addStyle(xmlString,styleName
			// 	,styleType,that.addStyleCallback);
			var style = that.styleMgr.reader.read(xml);
			style.name = that.addStyleName;
			var geomType = that.panel.find("#wms_style_name").text();
			style.geomType = geomType;
			that.panel.find("#styles_list_table").html("");
			that.panel.find("#styles_list_table").html("");
			that.defaultStyle = null;
			that.style =  null;
			that.isDefaultStyle = false;	
			that.getStyleXML_callback(style);
		});
	},

	//调取默认样式
	addStyleByType : function(styleType,styleName){
		if(styleType == null){
			return;
		}
		var that = this;
		var path = null;
		switch(styleType){
			case GeoBeans.Style.FeatureStyle.GeomType.Point:{
				path = "js/point.xml";
				break;
			}
			case GeoBeans.Style.FeatureStyle.GeomType.LineString:{
				path = "js/line.xml";
				break;
			}
			case GeoBeans.Style.FeatureStyle.GeomType.Polygon:{
				path = "js/polygon.xml";
				break;
			}
			default:
				break;
		}	
		$.get(path,function(xml){
			var xmlString = (new XMLSerializer()).serializeToString(xml);
			that.styleMgr.addStyle(xmlString,styleName
				,styleType,that.addStyleCallback);
		});
	},

	addStyleCallback : function(result){
		var dialog = MapCloud.styleMgr_dialog;
		if(result != "success"){
			alert(result);
			return;
		}
		

		var type = dialog.panel.find("#wms_style_name").text();
		var styleType = dialog.getStyleType(type.toLowerCase());
		var styles = dialog.styleMgr.getStyleByType(styleType);
		dialog.getStyles_callback(styles);
		var styleName = dialog.addStyleName;
		var styleOption = dialog.panel.find("#wms_style_list option[value='" +
							styleName + "']");
		styleOption.attr("selected",true);
		dialog.panel.find("#styles_list_table").html("");
		dialog.defaultStyle = null;
		dialog.style =  null;
		dialog.isDefaultStyle = false;	
		// 通过名字获取到style
		var style = dialog.styleMgr.getStyle(styleName);
		if(style != null){
			dialog.styleMgr.getStyleXML(styleName,
			dialog.getStyleXML_callback);
		}
		dialog.addStyleName = null;
	},

	setWFSLayer : function(wfsLayer){
		if(wfsLayer == null){
			return;
		}
		this.wfsLayer = wfsLayer;

		var style = wfsLayer.style;
		if(style == null){
			return;
		}
		var fields = wfsLayer.featureType.fields;
		if(fields == null){
			return;
		}
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
		
		var styleName = style.name;
		var styleGeomType = style.geomType;
		// var styleGeomType = this.getStyleTypeByGeomType(geomType);
		var styleGeomTypeOptions = this.panel
						.find("#wms_style_list option[type='" + styleGeomType + "']");
		// var styleList = this.panel.find("#wms_style_list");
		var html = styleGeomType + "<span class='caret'></span>";
		this.panel.find("#wms_style_name").html(html);
		this.panel.find("#wms_style_name").addClass("disabled");
		var styleOptions = this.panel.find("#wms_style_list");
		styleOptions.html(styleGeomTypeOptions);

		var styleS = this.styleMgr.getStyle(styleName);
		if(styleName == "default" ||styleS == null){
			styleOptions.append("<option value='default'>default</option>");
			styleOptions.find("option[value='default']")
					.attr("selected",true);
			//证明是默认的样式
			this.getStyleXML_callback(style);
		}else{
			//证明是某一个样式
			styleOptions.find("option[value='" + styleName + "']")
					.attr("selected",true);
			this.getStyleXML_callback(style);
		}
	},

	addStyle : function(style){
		// var addStyle = null;
		// if(this.style != null){
		// 	addStyle = this.style;
		// }else{
		// 	addStyle = this.defaultStyle;
		// }
		if(style == null){
			return;
		}
		var xml =this.styleMgr.writer.write(style);
		if(xml == null){
			return;
		}
		var name = style.name;
		var geomType = style.geomType;
		this.styleMgr.addStyle(xml,name
				,geomType,this.addStyleCallback);
	},

	setDBLayer : function(dbLayer){
		this.dbLayer = dbLayer;
		this.wfsWorkspace = new GeoBeans.WFSWorkspace("tmp",
				mapObj.server,"1.0.0");
		var featureType = new GeoBeans.FeatureType(this.wfsWorkspace,
				this.dbLayer.name);
		var fields = featureType.getFields(mapObj.name);
		var that = this;
		// this.wfsLayer = new GeoBeans.Layer.WFSLayer(dbLayer.name,
		// 								mapObj.server,
		// 								dbLayer.name,
		// 								"GML2");
		// var fields = null;
		// if(this.wfsLayer != null){
		// 	var featureType = this.wfsLayer.featureType;
		// 	if(featureType == null){
		// 		featureType = this.wfsLayer.getFeatureType();
		// 	}
		// 	if(featureType != null){
		// 		fields = featureType.getFields();
		// 	}
		// }
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
	}
});