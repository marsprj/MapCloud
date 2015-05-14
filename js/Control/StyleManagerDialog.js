MapCloud.StyleManagerDialog = MapCloud.Class(MapCloud.Dialog,{
	styleMgr 			: null,
	styleNameCur 		: null, //当前样式名称
	styleCur 			: null, //当前样式
	defaultStyle 		: null,
	selectedRuleIndex 	: null,
	// isStyleChanged 		: false, //当前样式是否已经更改
	isDefaultStyle 		: false,
	wfsWorkspace 		: null,
	typeName 			: null,
	uniqueValues 		: null,
	dbLayer 			: null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		//确定
		this.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				var name = dialog.panel.find("#style_list option:selected").text(); 
				if(name != "default"){
					var style = dialog.styleMgr.getStyle(name);
					if(style == null){
						//添加
						dialog.addStyle(dialog.styleCur);
					}else{
						dialog.updateStyle(dialog.styleCur);
					}
				}
				if(dialog.typeName != null){
					dialog.setStyle(dialog.typeName,dialog.styleCur,
					dialog.setStyle_callback);
				}
				dialog.closeDialog();
			});
		});

		//应用
		this.panel.find(".btn-success").each(function(){
			$(this).click(function(){
				var name = dialog.panel.find("#style_list option:selected").text(); 
				if(name != "default"){
					var style = dialog.styleMgr.getStyle(name);
					if(style == null){
						//添加
						dialog.addStyle(dialog.styleCur);
					}else{
						dialog.updateStyle(dialog.styleCur);
					}
				}
				if(dialog.typeName != null){
					dialog.setStyle(dialog.typeName,dialog.styleCur,
					dialog.setStyle_callback);
				}
			});
		});

		this.registerDefaultSymbolDisplay();
		
		//切换样式类型
		this.panel.find("#style_type_list li a").each(function(){
			$(this).click(function(){
				var value = $(this).text();
				var html = value + "<span class='caret'></span>";
				dialog.panel.find("#style_type_name").html(html);
				value = value.toLowerCase();
				if(value == "all"){
					var styles = dialog.styleMgr.getStyles();
					dialog.getStyles_callback(styles);
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
		this.panel.find("#style_list").each(function(){
			$(this).focus(function(){
				preStyleName = this.value;
			}).change(function(){
				if(this.value == "default" 
					&& dialog.wfsLayer != null){
					var style = dialog.wfsLayer.style;
					dialog.styleNameCur = "default";
					dialog.getStyleXML_callback(style);
					return;
				}
				// if(dialog.isStyleChanged){
				// 	var text = "是否保存" + preStyleName + "的样式？"
				// 	var result = confirm(text);
				// 	if(result){
				// 		dialog.updateStyle(preStyleName);
				// 	}
				// }
				preStyleName = this.value;

				// dialog.isStyleChanged = false;

				dialog.panel.find("#styles_list_table").html("");
				dialog.defaultStyle = null;
				dialog.styleNameCur = this.value;
				dialog.styleCur = null;

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
				var type = dialog.panel.find("#style_type_name").text();
				if(type == "All"){
					alert("请选择一个类型");
					return;
				}
				MapCloud.styleName_dialog.setFlag("add");
				MapCloud.styleName_dialog.showDialog();
				// dialog.isStyleChanged = true;
			});
		});

		//更新样式
		this.panel.find("#save_style").each(function(){
			$(this).click(function(){
				var name = dialog.styleNameCur;
				if(name == "default"){
					MapCloud.styleName_dialog.setFlag("save");
					MapCloud.styleName_dialog.showDialog();					
					return;
				}else{
					var style = dialog.styleMgr.getStyle(name);
					if(style == null){
						dialog.addStyle(dialog.styleCur);
					}else{
						dialog.updateStyle(name);
					}
				}
				// dialog.isStyleChanged = false;
			});
		});

		//删除样式
		this.panel.find("#remove_style").each(function(){
			$(this).click(function(){
				var name = dialog.panel.find("#style_list option:selected").text();
				var result = confirm("确认删除" + name + "样式？");
				if(result){
					MapCloud.alert_info.loading();
					dialog.styleMgr.removeStyle(name,dialog.removeStyle_callback)
				}
			});
		});

		// 添加所有值
		this.panel.find("#add_all_value").each(function(){
			$(this).click(function(){
				var field = dialog.panel.find("#layer_fields option:selected").val();
				if(field == null){
					return;
				}
				// var wfsWor
				// var featureType = dialog.wfsLayer.featureType;
				dialog.wfsWorkspace.getValue(dialog.typeName,field,
					mapObj.name,
					dialog.getValuesCallback);
			});
		});

		//删除一个rule 
		this.panel.find("#remove_value").each(function(){
			$(this).click(function(){
				var styleSelected = dialog.panel.find("#styles_list_table tbody tr.selected");
				var stylesTr = dialog.panel.find("#styles_list_table tbody tr");
				var index = stylesTr.index(styleSelected);
				if(index != -1){
					dialog.styleCur.removeRule(index);
					var field = dialog.panel.find("#layer_fields option:selected").val();
					var html = dialog.getRulesListHtml(field,dialog.styleCur.rules);	
					dialog.panel.find("#styles_list_table").html(html);
					dialog.registerSymbolDisplay();
					dialog.registerStyleSelected();
				}
				// dialog.isStyleChanged = true;
			});
		});

		// 删除所有值
		this.panel.find("#remove_all_value").each(function(){
			$(this).click(function(){
				dialog.styleCur = null;
				dialog.styleCur = dialog.defaultStyle.clone();
				dialog.styleCur.name = dialog.styleNameCur;
				dialog.panel.find("#styles_list_table").html("");
				// dialog.isStyleChanged = true;
			});
		});
	},

	showDialog : function(){
		this.cleanup();
		this.panel.modal();
		var html = "All<span class='caret'></span>";
		this.panel.find("#style_type_name").html(html);

		if(mapObj == null){
			return;
		}
		var url = mapObj.server;
		this.styleMgr = new GeoBeans.StyleManager(url);
		
		var styles = this.styleMgr.getStyles();
		this.getStyles_callback(styles);
		this.styleMgr.getColorMaps(this.getColorMaps_callback);
	},

	cleanup : function(){
		this.panel.find("#styles_list_table").html("");
		this.typeName = null;
		this.styleCur = null;
		this.styleNameCur = null;
		this.defaultStyle = null;
		this.uniqueValues = null;
		this.wfsWorkspace = null;
		this.selectedRuleIndex = null;
		this.panel.find("#style_type_name").removeClass("disabled");
		this.panel.find("#layer_fields").html("");
		this.dbLayer = null;
	},

	//获得style的类型
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

	closeDialog : function(){
		this.panel.modal("hide");
		MapCloud.refresh_panel.refreshPanel();
	},

	//展示获取的styles名字
	getStyles_callback : function(styles){
		var html = "";
		var html = "";
		for(var i = 0; i < styles.length;++i){
			var style = styles[i];
			var name = style.name;
			var geomType = style.geomType;
			html += "<option value='" + name 
				 + "' type='" + geomType + "'>" + name + "</option>";
		}

		var dialog = MapCloud.styleManager_dialog;
		var panel = dialog.panel;
		panel.find("#style_list").html(html);
		
		var styleName = panel.find("#style_list option:selected").val();
		dialog.styleNameCur = styleName;
		dialog.styleMgr.getStyleXML(dialog.styleNameCur,
			dialog.getStyleXML_callback);
		//展示第一个样式
		// MapCloud.styleMgr_dialog.panel.find("#styles_list_table").html("");
	},

	//获取到的XML解析出style进行展示
	getStyleXML_callback : function(style){
		if(style == null){
			return;
		}
		var dialog = MapCloud.styleManager_dialog;
		var panel = dialog.panel;
		dialog.styleCur = style;
		var defaultStyle = 
			dialog.getDefaultStyle(style);
		if(defaultStyle == null){
			return;
		}
		dialog.defaultStyle = defaultStyle;

		//多重样式
		if(dialog.defaultStyle != dialog.styleCur){
			//获取到字段
			var field = dialog.getProperyNameByRule(
				dialog.styleCur.rules[0]);
			var fieldOption = dialog.panel.find("#layer_fields option[value='" +
							field + "']");
			fieldOption.attr("selected",true);
			var html = dialog.getRulesListHtml(field,style.rules);
			dialog.panel.find("#styles_list_table").html(html);
			dialog.registerSymbolDisplay();
			dialog.registerStyleSelected();
		}else{
			dialog.panel.find("#styles_list_table").html("");
		}
		dialog.displayDefaultStyle(dialog.defaultStyle);

	},

	//获得默认样式值
	getDefaultStyle : function(style){
		if(style == null){
			return null;
		}
		var rules = style.rules;
		if(rules == null){
			return null;
		}
		if(rules.length == 1){
			var rule = rules[0];
			if(rule != null){
				var filter = rule.filter;
				if(filter == null){
					return style;//此时就是默认样式
				}
			}
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

	// 展示默认样式
	displayDefaultStyle : function(style){
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

	// 样式CSS
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

	//style的html
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

	// 有待修改和调试
	removeStyle_callback : function(result){
		var dialog = MapCloud.styleManager_dialog;
		var panel = dialog.panel;
		
		var name = dialog.panel.find("#style_list option:selected").text();
		var info = "删除样式 [ " + name + " ]";
		MapCloud.alert_info.showInfo(result,info);

		if(result.toUpperCase() == "SUCCESS"){
			var value = panel.find("#style_type_name").text();
			value = value.toLowerCase();
			if(value == "all"){
				var styles = dialog.styleMgr.getStyles();
				dialog.getStyles_callback(styles);
			}else{
				var type = dialog.getStyleType(value);
				if(type != null){
					var styles = dialog.styleMgr.getStyleByType(type);
					dialog.getStyles_callback(styles);
				}
			}
		}
	},

	// 注册样式修改
	registerSymbolDisplay : function(){
		var that = this;
		this.panel.find("#styles_list_table .style-symbol").each(function(){
			$(this).click(function(){
				
				that.isDefaultStyle = false;
				var symbols = $(this).parents("tbody").find(".style-symbol");
				var index = symbols.index($(this));
				if(index != -1){
					var rule = that.styleCur.rules[index];
					if(rule != null){
						MapCloud.style_dialog.showDialog();	
						MapCloud.style_dialog.setRule(rule,that.fields,"styleMgr");
						MapCloud.styleManager_dialog.selectedRuleIndex = index;	
					}
				}
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
	//返回回来的rule
	setRule : function(rule){
		if(rule == null){
			return;
		}
		// this.isStyleChanged = true;
		if(this.isDefaultStyle == true){
			this.isDefaultStyle = false;
			this.defaultStyle.rules[0] = rule;
			this.displayDefaultStyle(this.defaultStyle);
		}else{
			this.styleCur.rules[this.selectedRuleIndex].symbolizer = rule.symbolizer;
			this.styleCur.rules[this.selectedRuleIndex].textSymbolizer = rule.textSymbolizer;
			var field = this.panel.find("#layer_fields option:selected").val();
			var html = this.getRulesListHtml(field,this.styleCur.rules);
			this.panel.find("#styles_list_table").html(html);
			this.registerSymbolDisplay();
			this.registerStyleSelected();
		}
	},

	// 设置新增的样式名称
	setAddStyleName : function(styleName,flag){
		if(styleName == null){
			return;
		}
		this.addStyleName = styleName;
		var style = this.styleMgr.getStyle(styleName);
		if(style != null){
			var info = "已经有" + styleName + "样式，请重新输入";
			MapCloud.alert_info.showInfo("failed",info);
			MapCloud.styleName_dialog.showDialog();
			return;
		}
		var styleOptions = this.panel.find("#style_list");
		if(flag == "add"){
			var type = this.panel.find("#style_type_name").text();
			var styleType = this.getStyleType(type.toLowerCase())
			var option = '<option value="' + styleName + '" type="' 
						+ styleType + '">' + styleName + '</option>';
			styleOptions.append(option);
			styleOptions.find("option[value='" 
					+ styleName + "']").attr("selected",true);
			this.loadAddStyle(styleType);
		}else if(flag == "save"){
			//默认样式则修改名称 待修改
			this.panel.find("#style_list option[value='default']").text(styleName);
			var addstyle = null;
			// if(this.style != null){
			// 	addstyle = this.style;
			// }else{
			// 	addstyle = this.defaultStyle;
			// }
			addStyle = this.styleCur;
			this.addStyle(addstyle);
		}
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
			var style = that.styleMgr.reader.read(xml);
			style.name = that.addStyleName;
			var geomType = that.panel.find("#style_type_name").text();
			style.geomType = geomType;
			that.panel.find("#styles_list_table").html("");
			that.defaultStyle = null;
			that.styleCur =  null;
			that.isDefaultStyle = false;
			that.styleNameCur = style.name;
			that.getStyleXML_callback(style);
		});
	},

	// 更新style
	updateStyle : function(style){
		if(style == null){
			return;
		}
		var name = style.name;
		//如果是默认样式，则不绘制。
		if(name == "default"){
			return;
		}
		var xml = this.styleMgr.writer.write(style);
		MapCloud.alert_info.loading();
		this.styleMgr.updateStyle(xml,name,this.updateCallback);
	},

	updateCallback : function(result){
		var dialog = MapCloud.styleManager_dialog;
		var panel = dialog.panel;
		var styleName = panel
					.find("#style_list option:selected").text();
		var info = "更新样式 [ " + styleName + " ]";
		MapCloud.alert_info.showInfo(result,info);
	},

	addStyle : function(style){
		if(style == null){
			return;
		}
		var xml =this.styleMgr.writer.write(style);
		if(xml == null){
			return;
		}
		var name = style.name;
		var geomType = style.geomType;
		MapCloud.alert_info.loading();
		this.styleMgr.addStyle(xml,name
				,geomType,this.addStyleCallback);
	},

	addStyleCallback : function(result){
		var dialog = MapCloud.styleManager_dialog;

		var type = dialog.panel.find("#style_type_name").text();
		var styleType = dialog.getStyleType(type.toLowerCase());
		var styles = dialog.styleMgr.getStyleByType(styleType);
		dialog.getStyles_callback(styles);

		var styleName = dialog.addStyleName;

		var info = "添加样式 [ " + styleName + " ]";
		MapCloud.alert_info.showInfo(result,info);

		var styleOption = dialog.panel.find("#style_list option[value='" +
							styleName + "']");
		styleOption.attr("selected",true);
		dialog.panel.find("#styles_list_table").html("");
		dialog.defaultStyle = null;
		dialog.styleCur =  null;
		dialog.styleNameCur = dialog.addStyleName;
		dialog.isDefaultStyle = false;	
		// 通过名字获取到style
		var style = dialog.styleMgr.getStyle(styleName);
		if(style != null){
			dialog.styleMgr.getStyleXML(styleName,
			dialog.getStyleXML_callback);
		}
		dialog.addStyleName = null;
	},

	/******************绑定图层*************/

	// wfsLayer
	setWFSLayer : function(wfsLayer){
		if(wfsLayer == null){
			return;
		}
		this.wfsLayer = wfsLayer;
		var workspace = this.wfsLayer.workspace;
		this.wfsWorkspace = workspace;
		var style = this.wfsLayer.style;
		if(style == null){
			return;
		}
		var fields = wfsLayer.featureType.fields;
		this.setFields(fields);

		var styleName = style.name;
		this.styleNameCur = styleName;
		var styleGeomType = style.geomType;
		var styleGeomTypeOptions = this.panel
						.find("#style_list option[type='" + styleGeomType + "']");
		var html = styleGeomType + "<span class='caret'></span>";
		this.panel.find("#style_type_name").html(html);
		this.panel.find("#style_type_name").addClass("disabled");
		var styleOptions = this.panel.find("#style_list");
		styleOptions.html(styleGeomTypeOptions);

		//
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

	//DBLayer
	setDBLayer : function(dbLayer){
		if(dbLayer == null){
			return;
		}
		this.dbLayer = dbLayer;
		this.typeName = dbLayer.name;

		this.wfsWorkspace = new GeoBeans.WFSWorkspace("tmp",
				mapObj.server,"1.0.0");
		var featureType = new GeoBeans.FeatureType(this.wfsWorkspace,
				this.dbLayer.name);
		var fields = featureType.getFields(mapObj.name);
		this.setFields(fields);

		

		var geomType = this.dbLayer.geomType;
		var styleGeomType = this.getStyleTypeByGeomType(geomType);
		var styleGeomTypeOptions = this.panel
						.find("#style_list option[type='" + styleGeomType + "']");
		var html = styleGeomType + "<span class='caret'></span>";
		this.panel.find("#style_type_name").html(html);
		this.panel.find("#style_type_name").addClass("disabled");
		var styleOptions = this.panel.find("#style_list");
		styleOptions.html(styleGeomTypeOptions);

		var styleName = this.dbLayer.styleName;
		if(styleName != null  && styleName != ""){
			this.styleNameCur = styleName;

			styleOptions.find("option[value='" + styleName + "']")
						.attr("selected",true);
			this.styleMgr.getStyleXML(this.styleNameCur,
				this.getStyleXML_callback);
		}else{
			var styles = this.styleMgr.getStyleByType(styleGeomType);
			this.getStyles_callback(styles);
		}
		
	},

	setFields : function(fields){
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
			this.panel.find("#layer_fields").html(html);
		}
		var that = this;
		this.panel.find("#layer_fields").each(function(){
			$(this).change(function(){
				that.panel.find("#styles_list_table").html("");
				that.styleCur = null;
				// that.style = null;
				// 修改
			});
		});
	},

	//色阶
	getColorMaps_callback : function(colorMaps){
		if(colorMaps == null){
			return;
		}
		var dialog = MapCloud.styleManager_dialog;
		var panel = dialog.panel;
		var colorMap = null;
		var url = null;
		var html = "";
		for(var i = 0; i < colorMaps.length; ++i){
			colorMap = colorMaps[i];
			url = colorMap.url;
			html += "<li cid='" + colorMap.id + "'>"
				+ 	"	<div class='color-ramp-item' style='background-image:"
				+ 	"	url(" + url + ")'>"
				+ 	"	</div>"
				+	"</li>"
		}
		panel.find(".color-ramp-div ul").html(html);

		colorMap = colorMaps[0];
		if(colorMap != null){
			url = colorMap.url;
			var id = colorMap.id;
			var htmlSel = "<li cid='" + id + "'>"
				+ 	"	<div class='color-ramp-item' style='background-image:"
				+ 	"	url(" + url + ")'>"
				+ 	"	</div>"
				+	"</li>";
			panel.find("#select_color_ramp").html(htmlSel);
		}
		
		
		//颜色选择
		dialog.panel.find(".color-ramp-div ul li").each(function(){
			$(this).click(function(){
				var id = $(this).attr("cid");
				panel.find("#select_color_ramp li").attr("cid",id);
				var backgroundUrl 
				= $(this).find(".color-ramp-item").css("background-image");
				panel.find("#select_color_ramp li .color-ramp-item")
				.css("background-image",backgroundUrl);

				var dialog = MapCloud.styleManager_dialog;
				if(dialog.defaultStyle == dialog.styleCur){
					return;
				}

				if(dialog.uniqueValues == null){
					var field = dialog.panel.find("#layer_fields option:selected").val();
					if(field == null){
						return;
					}
					dialog.wfsWorkspace.getValue(dialog.typeName,field,
						mapObj.name,
						dialog.getValuesCallback);
				}else{
					var count = dialog.uniqueValues.length;
					dialog.styleMgr.getColorMap(id,count,
						dialog.getColorMap_callback);					
				}
			});
		});
	},

	getValuesCallback : function(values){
		if(values == null){
			return;
		}

		var count = values.length;
		var dialog = MapCloud.styleManager_dialog;
		var panel = dialog.panel;
		dialog.uniqueValues = values;
		var id = panel.find("#select_color_ramp li").attr("cid");
		dialog.styleMgr.getColorMap(id,count,
			dialog.getColorMap_callback);
	},

	getColorMap_callback : function(colors){
		if(colors == null){
			return;
		}
		var dialog = MapCloud.styleManager_dialog;
		var panel = dialog.panel;

		var defaultRule = dialog.defaultStyle.rules[0];
		var field = dialog.panel.find("#layer_fields option:selected").val();
		var values = dialog.uniqueValues;
		var style = dialog.getStyleByValues(defaultRule,field,values,colors);
		dialog.styleCur = style;
		if(style != null){
			var html = dialog.getRulesListHtml(field,style.rules);
			panel.find("#styles_list_table").html(html);
			dialog.registerSymbolDisplay();
			dialog.registerStyleSelected();
		}
	},

	//根据图层的样式，来获取style的样式
	getStyleTypeByGeomType : function(geomType){
		if(geomType == null){
			return null;
		}
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

	// 生成style,包含筛选的条件
	getStyleByValues : function(defaultRule,field,values,colorValues){
		var color = null;
		var index = null;
		var colorValue = null;
		var defaultSymbolizer = defaultRule.symbolizer;
		var defaultTextSymbolizer = defaultRule.textSymbolizer;

		// var colorValues = colorRamp.getValues();
		var colorValuesLength = colorValues.length;
		var type = defaultSymbolizer.type;
		var geomType = this.defaultStyle.geomType;
		var styleName = this.panel.find("#style_list option:selected")
					.text();
		var style = new GeoBeans.Style.FeatureStyle(styleName,geomType);
		var rules = [];
		for(var i = 0; i < values.length; ++i){
			var value = values[i];
			var rule = new GeoBeans.Rule();
			
			colorValue = colorValues[i];

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

	setStyle : function(typeName,style){
		if(typeName == null || style == null){
			return;
		}
		mapObj.setStyle(typeName,style,this.setStyle_callback);
	},

	setStyle_callback : function(result){
		var info = "设置样式";
		MapCloud.alert_info.showInfo(result,info);
		mapObj.draw();
	}
});