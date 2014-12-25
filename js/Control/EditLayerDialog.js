MapCloud.EditLayerDialog = MapCloud.Class(MapCloud.Dialog, {
	
	layer : null,
	geomType : null,
	textSymbolizer : null,
	geoRules: new Array(),
	textRules:new Array(),
	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		
		var dialog = this;

		this.panel.find("#editLayerDialogTab a").each(function(){
			$(this).click(function(e){
				e.preventDefault()
				$(this).tab("show");
			});
		});

		

		//透明度
		$("#label_fill_color_transparency").slider();
		$("#label_fill_color_transparency").on("slide",function(slideEvt){
			$("#label_fill_color_transparency_value").val(slideEvt.value);
			$("#label_fill_color div").css("opacity",slideEvt.value/100);
		});

		$("#label_border_color_transparency").slider();
		$("#label_border_color_transparency").on("slide",function(slideEvt){
			$("#label_border_color_transparency_value").val(slideEvt.value);
			$("#label_border_color div").css("opacity",slideEvt.value/100);
		});
		
		$("#label_shadow_color_transparency").slider();
		$("#label_shadow_color_transparency").on("slide",function(slideEvt){
			$("#label_shadow_color_transparency_value").val(slideEvt.value);
			$("#label_shadow_color div").css("opacity",slideEvt.value/100);
		});

		//颜色选择器
		$('#label_fill_color').colpick({
			onChange:function(hsb,hex,rgb,el,bySetColor) {
				$("#label_fill_color div").css("background-color","#" + hex);
			},
			onSubmit:function(hsb,hex,rgb,el,bySetColor) {
				$("#label_fill_color div").css("background-color","#" + hex);	
				$('#label_fill_color').colpickHide();
			},
		});


		$('#label_border_color').colpick({
			onChange:function(hsb,hex,rgb,el,bySetColor) {
				$("#label_border_color div").css("background-color","#" + hex);
			},
			onSubmit:function(hsb,hex,rgb,el,bySetColor) {
				$("#label_border_color div").css("background-color","#" + hex);	
				$('#label_border_color').colpickHide();
			},
		});


		$('#label_shadow_color').colpick({
			onChange:function(hsb,hex,rgb,el,bySetColor) {
				$("#label_shadow_color div").css("background-color","#" + hex);
			},
			onSubmit:function(hsb,hex,rgb,el,bySetColor) {
				$("#label_shadow_color div").css("background-color","#" + hex);	
				$('#label_shadow_color').colpickHide();
			},
		});


		this.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				dialog.drawMap();
				if(MapCloud.refresh_panel ==null){
					MapCloud.refresh_panel = new MapCloud.refresh("left_panel");
				}
				MapCloud.refresh_panel.refreshPanel();
				dialog.closeDialog();


//				dialog.displayFeatures();
//				dialog.showFeaturesTable();
			});
		});

		this.panel.find(".btn-cancel").each(function(){
			$(this).click(function(){
				var rules = dialog.layer.style.rules;
				if (dialog.textSymbolizer != null) {
					var textRule =  new GeoBeans.Style.Rule(dialog.textSymbolizer, null);
					rules[rules.length] = textRule;			
				}
				// mapObj.setViewer(new GeoBeans.Envelope(-180,-90,180,90));
				mapObj.draw();
			});
		});
		this.panel.find(".glyphicon-remove").each(function(){
			$(this).click(function(){
				dialog.deleteStyle($(this));
			});
		});
		
		this.panel.find(".glyphicon-plus-sign").each(function(){
		$(this).click(function(){
			dialog.addStyle();
		});



	});


	},
	
	destory : function(){
		MapCloud.Dialog.prototype.destory.apply(this, arguments);
	},
	
	cleanup : function(){
	},

	
	setLayer:function(layer){
		var dialog = this;
		this.layer = layer;
		var layer_type = layer.CLASS_NAME;
		var layer_type_str = null;
		switch(layer_type){
			case "GeoBeans.Layer.WFSLayer":{
				layer_type_str = "WFS";	
				this.setLayerFeatureGeomType(layer);

				break;
			}
		}
		
		this.panel.find("#edit_layer_name").each(function(){
			$(this).val(layer.name);
		});
		this.panel.find("#edit_layer_type").each(function(){
			$(this).val(layer_type_str);
		});
		


		//获得各个样式
		var style = layer.style;
		if(style == null){
			return;
		}
		var rules = style.rules;
		if(rules == null){
			return;
		}


		this.geoRules = new Array();
		this.textRules = new Array();
		for(var i = 0; i < rules.length; ++i){
			var rule = rules[i];
			var symbolizer = rule.symbolizer;
			if (symbolizer instanceof GeoBeans.Style.TextSymbolizer) {
				continue;
			}
			this.geoRules[this.geoRules.length] = rule;
		}

		var textRules = this.getTextRules(this.geoRules,rules);
		this.textRules = textRules;
		$("#layer_style ul").empty();
		for(var i = 0; i < this.geoRules.length; ++i){
			var rule = this.geoRules[i];
			if(rule == null)
				continue;
			var symbolizer = rule.symbolizer;
			if(symbolizer == null)
				continue;
			var html = dialog.createStyleLiHtml(rule,i);

			$("#layer_style ul").append(html);
			$("#layer_style ul li:last").find(".glyphicon-remove").each(function(){
				$(this).click(function(){
					dialog.deleteStyle($(this));
				});
			});
			$("#layer_style ul li:last").find(".glyphicon-plus-sign").each(function(){
				$(this).click(function(){
					dialog.addStyle();
				});
			});
			
			$("#layer_style ul li:last").find(".style_icon").each(function(){
				$(this).click(function(){
					if(MapCloud.layer_appearance_dialog == null){
						MapCloud.layer_appearance_dialog = new MapCloud.LayerAppearanceDialog("layerAppearanceDialog");
					}
					var index = $(this).parent().parent().attr("value");
//					var symbolizer = dialog.layer.style.rules[index].symbolizer;
					var symbolizer = dialog.geoRules[index].symbolizer;
					MapCloud.layer_appearance_dialog.setGeomSymbolizer(dialog.geomType,symbolizer,index,dialog.callback,null);
					var fields = dialog.layer.featureType.fields;
					MapCloud.layer_appearance_dialog.setLayerFields(fields);
					var textSymbolizer = dialog.getTextSymbolizerByIndex(index);
					MapCloud.layer_appearance_dialog.setTextSymbolizer(textSymbolizer);

					MapCloud.layer_appearance_dialog.showDialog();
				});
			});

		}
		
	},

	setLayerFeatureGeomType:function(layer){
		var layer_type = layer.CLASS_NAME;
		if(layer_type != "GeoBeans.Layer.WFSLayer"){
			return;
		}
		var ft = layer.featureType;
		if(ft == null){
			ft = layer.workspace.getFeatureType(layer.typeName);
			if(ft == null){
				return;
			}
			layer.featureType = ft;
		}
		var fieldsArray = ft.fields;
		if(fieldsArray == null){
			fieldsArray = layer.featureType.getFields();
			if(fieldsArray == null){
				return;
			}
		}
		var geom = ft.geomFieldName;
		if(geom == null){
			return;
		}

		var index = ft.getFieldIndex(geom);
		if(index < -1 || index >= fieldsArray.length){
			return;
		}
		var field = fieldsArray[index];
		if(field == null){
			return;
		}
		var geomType = field.geomType;
		if(geomType == null){
			return;
		}
		this.geomType = geomType;
	},


	//根据样式生成li
	createStyleLiHtml:function(rule,i){
		var symbolizer = rule.symbolizer;
		var filter = rule.filter;
		var field = "";
		var value = "";
		if(filter != null){
			field = filter.field;
			value = filter.value;
		}
		var fillColor = symbolizer.fillColor;
		var outLineColor = symbolizer.outLineColor;
		var color = symbolizer.color;
		var background_color = "";
		var border_color = "";
		if(color != null){
			background_color = color;
			border_color = "white";
		}else{
			background_color = fillColor;
			border_color = outLineColor;
		}
		var html =  "<li value='" + i + "' class=\"row\">"
					+	"<span class=\"glyphicon glyphicon-eye-open control-label col-sm-1\"></span>"
					+	"<div class=\"col-sm-3\">"
					+	"	<input type=\"text\" class=\"form-control layer_field\" style=\"height:28px\" value=\"" + field + "\"></input>"
					+	"</div>"
					+	"<span class=\"col-sm-1\">=</span>"
					+	"<div class=\"col-sm-3\">"
					+	"	<input type=\"text\" class=\"form-control layer_value\" style=\"height:28px\"value=\"" + value + "\"></input>"
					+	"</div>"
					+	"<div class=\"col-sm-1\">"
					+	"	<span class=\"style_icon\" style=\"background-color:" + background_color + ";border-color:" + border_color + "\"></span>"
					+	"</div>"
					+	"<span class=\"glyphicon glyphicon-remove control-label col-sm-1\"></span>"
					+	"<span class=\"glyphicon glyphicon glyphicon-plus-sign control-label col-sm-1\"></span>"
		
		return html;
	},
	
	deleteStyle: function(obj){
		var li_length = $("#layer_style ul li").length;
		if(li_length <=1){
			return;
		}
		var currentLi = obj.parent();
		if(currentLi == null){
			return;
		}
		var currentIndex = obj.parent().attr("value");
		var nextLi = currentLi.next();
		var nextIndex = currentIndex;
		while(nextLi.length != 0){
			nextLi.attr("value", nextIndex++);
			nextLi = nextLi.next();
		}
		currentLi.remove();

		this.geoRules.splice(currentIndex,1);
		this.textRules.splice(currentIndex,1);
		//改变textRules里面的序列号
		for(var i = 0; i < this.textRules.length; ++i){
			var textRuleObject = this.textRules[i];
			var index = textRuleObject.index;
			if (index > currentIndex) {
				textRuleObject.index = index -1;
			}
		}


	},

	addStyle:function(){
		var index = parseInt($("#layer_style li:last").attr("value")) + 1;

		var dialog = this;
		var symbolizer = MapCloud.getDeafaultSymbolizer(dialog.geomType);
		var rule = new GeoBeans.Style.Rule(symbolizer,null)
//		dialog.layer.style.rules[index] = rule;
		dialog.geoRules[index] = rule;
		var textRuleObject = new Object();
		textRuleObject.index = index;
		textRuleObject.textRule = new GeoBeans.Style.Rule(null,null);
		dialog.textRules.push(textRuleObject);

		var html = this.createStyleLiHtml(rule,index);
		$("#layer_style ul li:last").after(html);
		$("#layer_style ul li:last").find(".glyphicon-remove").each(function(){
			$(this).click(function(){
				dialog.deleteStyle($(this));
			});
		});
		$("#layer_style ul li:last").find(".glyphicon-plus-sign").each(function(){
			$(this).click(function(){
				dialog.addStyle();
			});
		});

		$("#layer_style ul li:last").find(".style_icon").each(function(){
			$(this).click(function(){
				if(MapCloud.layer_appearance_dialog == null){
					MapCloud.layer_appearance_dialog = new MapCloud.LayerAppearanceDialog("layerAppearanceDialog");
				}
				var index = $(this).parent().parent().attr("value");

				var rule = dialog.geoRules[index];
				var symbolizer = dialog.geoRules[index].symbolizer;
				MapCloud.layer_appearance_dialog.setGeomSymbolizer(dialog.geomType,symbolizer,index,dialog.callback,null);
				var fields = dialog.layer.featureType.fields;
				MapCloud.layer_appearance_dialog.setLayerFields(fields);				
				var textSymbolizer = dialog.getTextSymbolizerByIndex(index);
				MapCloud.layer_appearance_dialog.setTextSymbolizer(textSymbolizer);
				MapCloud.layer_appearance_dialog.showDialog();
			});
		});
	},
	
	//设置完style之后的回调函数
	callback:function(symbolizer,textSymbolizer,index,layerIndex){
		var fillColor = symbolizer.fillColor;
		var outLineColor = symbolizer.outLineColor;
		var color = symbolizer.color;

		var styleSpan = $("#layer_style li[value='" + index + "'] span.style_icon");
		if(styleSpan != null){
			if(color != null){
				styleSpan.css("background-color",color);
				styleSpan.css("border-color","white");
			}else{
				styleSpan.css("background-color",fillColor);
				styleSpan.css("border-color",outLineColor);
			}
		}

		var field = $("#layer_style li[value='" + index + "'] .layer_field").val();
		var value = $("#layer_style li[value='" + index + "'] .layer_value").val();
		var filter = null;
		if(field != "" && value != ""){
			filter = new GeoBeans.Filter(field,value);	
		}
		MapCloud.edit_layer_dialog.geoRules[parseInt(index)] = new GeoBeans.Style.Rule(symbolizer, filter);


		MapCloud.edit_layer_dialog.setTextRule(index,textSymbolizer);


	},
	//确实之后绘制地图
	drawMap:function(){
		var dialog = this;
		this.panel.find("#layer_style ul li").each(function(){
//			var rules = dialog.layer.style.rules;

			var li = $(this);
			var index = li.attr("value");
			var field = li.find(".layer_field").val();
			var value = li.find(".layer_value").val();
			var filter = null;
			if(field != "" && value != ""){
				filter = new GeoBeans.Filter(field,value);
			}

			dialog.geoRules[index].filter = filter;
		});
	
		var allRules = this.getAllRules();
		this.layer.style.rules = allRules;
		// mapObj.setViewer(new GeoBeans.Envelope(-180,-90,180,90));
		mapObj.draw();	

	},

	getAllRules: function(){
		var allRules = new Array();
		for(var i = 0; i < this.geoRules.length; ++i){
			var geoRule = this.geoRules[i];
			allRules.push(geoRule);
			var geoFilter = geoRule.filter;
			var textSymbolizer = this.getTextSymbolizerByIndex(i);
			if (textSymbolizer != null) {
				var textRule = new GeoBeans.Style.Rule(textSymbolizer,geoFilter);
				allRules.push(textRule);
			}
		}
		return allRules;
	},


	//设置字段
	setLayerFields: function(){
		var fields = this.layer.featureType.fields;
		if(fields == null){
			return;
		}
		var html = "";
		for(var i = 0; i < fields.length;++i){
			var field = fields[i];
			if (field == null) {
				continue;
			}
			var type = field.type;
			var name = field.name; 
			if(type.toLowerCase() == "geometry"){
				continue;
			}
			html += "<option value=\"" + name + "\">" + name + "</option>";
		}
		this.panel.find("#label_field").html(html);

	},

	//根据filter获得TextSymbolizer
	getTextSymbolizerByFilter: function(filter,rules){
//		var rules = this.layer.style.rules;
		for(var i = 0; i < rules.length; ++i){
			var rule = rules[i];
			var symbolizer = rule.symbolizer;
			if (!(symbolizer instanceof GeoBeans.Style.TextSymbolizer)){
				continue;
			}
			var textFilter = rule.filter;
			if(textFilter == null && filter == null){
				return symbolizer;
			}
			if(textFilter != null && filter!= null && textFilter.field == filter.field 
				&& textFilter.value == filter.value){
				return symbolizer;
			}
		}
		return null;
	},

	getTextSymbolizerByIndex: function(index){
		if(index < -1){
			return null;
		}
		for(var i = 0; i < this.textRules.length; ++i){
			var textRuleObject = this.textRules[i];
			var textRule = textRuleObject.textRule;
			var symbolizer = textRule.symbolizer;
			var textRuleindex = textRuleObject.index;
			if(index == textRuleindex){
				return symbolizer;
			}
		}
		return null;
	},

	//生成textRules记录每一个geoRule对应的textRule
	getTextRules:function(geomRules,rules){
		var textRules = new Array();
		for(var i = 0; i < geomRules.length; ++i){
			var rule = geomRules[i];
			var symbolizer = rule.symbolizer;
			var filter = rule.filter;
			if (symbolizer instanceof GeoBeans.Style.TextSymbolizer){
				continue;
			}
			var textSymbolizer = this.getTextSymbolizerByFilter(filter,rules);
			var textRuleObject = new Object();
			textRuleObject.index = i;
			var textRule = new GeoBeans.Style.Rule(textSymbolizer,filter);
			textRuleObject.textRule = textRule;
			textRules.push(textRuleObject);

		}
		return textRules;
	},

	setTextRule:function(index,symbolizer){
		for(var i = 0; i < this.textRules.length; ++i){
			var textRuleObject = this.textRules[i];
			var textRuleIndex = textRuleObject.index;
			var textRule = textRuleObject.textRule;
			if (index == textRuleIndex) {
				textRule.symbolizer = symbolizer;
			}
		}
	}


	
});
	