// 样式对话框
MapCloud.StyleDialog = MapCloud.Class(MapCloud.Dialog,{
	// 当前样式
	rule : null,

	// 是从哪里点击的该对话框
	source : null,

	// 类型
	type : null,

	// 字体
	fonts : null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this,arguments);
		var dialog = this;
		this.rule = null;

		this.panel.find("#style-info-div-tab a").each(function(){
			$(this).click(function(e){
				e.preventDefault()
				$(this).tab("show");
			});
		});

		this.panel.find('[data-toggle="tooltip"]').tooltip();

		//样式初始化，拖动条
		this.panel.find(".slider").each(function(){
			$(this).slider({
				tooltip : 'hide'
			});
			$(this).on("slide",function(slideEvt){
				var parent = $(this).parents(".form-group");
				var input = parent.find(".slider-value")
								.val(slideEvt.value + "%");
				parent.find(".colorSelector div").css("opacity",
							slideEvt.value/100);	
			});
		});

		// 颜色选择器
		this.panel.find(".colorSelector").each(function(){
			$(this).colpick({
				color:'cccccc',
				onChange:function(hsb,hex,rgb,el,bySetColor) {
					$(el).children().css("background-color","#" + hex);

				},
				onSubmit:function(hsb,hex,rgb,el,bySetColor){
					$(el).children().css("background-color","#" + hex);
					$(el).colpickHide();
				}
			});
		});

		// 样式可编辑
		this.panel.find(".style_enable").each(function(){
			$(this).change(function(){
				var parent = $(this).parents(".form-group");
				dialog.setSytleItemEnable(parent,this.checked);
			});		
		});		

		var textPropCheck = this.panel.find("#style-text .text-prop .style_enable");
		var textTextCheck = this.panel.find("#style-text .text-text .style_enable");
		textPropCheck.change(function(){
			if(this.checked){
				textTextCheck.prop("checked",false);
				var item = textTextCheck.parents(".form-group");
				dialog.setSytleItemEnable(item,false);
				dialog.setFontEnable(true);
			}else{
				dialog.setFontEnable(false);
			}
		});
		
		textTextCheck.change(function(){
			if(this.checked){
				textPropCheck.prop("checked",false);
				var item = textPropCheck.parents(".form-group");
				dialog.setSytleItemEnable(item,false);
				dialog.setFontEnable(true);
			}else{
				dialog.setFontEnable(false);
			}
		});

		// 确定
		this.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				var rule = dialog.getRule();
				if(dialog.source == "styleMgr"){
					// 返回样式管理对话框
					MapCloud.styleManager_dialog.setRule(rule);
				}else if(dialog.source == "refresh"){
					// 返回refresh
					MapCloud.refresh_panel.setRule(rule);
				}
				dialog.closeDialog();
			});
		});

		// //拿到字体
		// if(this.fonts == null){
		// 	var fontManager = new GeoBeans.FontManager("/ows/user1/mgr","1.0.0");
		// 	this.fonts = fontManager.getFonts(this.getFontsCallback);
		// 	this.displayFonts(this.fonts);
		// }
	},

	showDialog : function(){
		this.cleanup();
		this.panel.modal();
		// 获得字体
		var fontManager = new GeoBeans.FontManager("/ows/user1/mgr","1.0.0");
		this.fonts = fontManager.getFonts(this.getFontsCallback);
		this.displayFonts(this.fonts);
	},

	cleanup : function(){
		var first = this.panel.find("ul.nav-tabs li a").first();
		first.tab("show");
	},

	setFontEnable : function(checked){
		var textPanel = this.panel.find("#style-text");
		var fontItem = textPanel.find(".text-font");
		var fillItem = textPanel.find(".text-fill");
		if(checked){
			this.setSytleItemEnable(fontItem,true);
			fontItem.find(".style_enable").prop("checked",true);
			this.setSytleItemEnable(fillItem,true);
			fillItem.find(".style_enable").prop("checked",true);
		}else {
			this.setSytleItemEnable(fontItem,false);
			fontItem.find(".style_enable").prop("checked",false);
			this.setSytleItemEnable(fillItem,false);
			fillItem.find(".style_enable").prop("checked",false);
		}
	},

	displayFonts : function(fonts){
		if(fonts == null){
			return;
		}
		var html = "";
		for(var i = 0; i < fonts.length;++i){
			var font = fonts[i];
			var face = font.face;
			var family = font.family;
			html += "<option value='" + family +
					"'>" + face + "</option>";
		}
		this.panel.find(".font-family").html(html);
	},

	// 设置样式，来源，字段
	setRule : function(rule,fields,source){
		this.rule = rule;
		this.source = source;
		this.displayFields(fields);
		this.displayRule(this.rule);
	},

	//设置每行的样式是否可用
	setSytleItemEnable : function(item,checked){
		var inputs = item.find("input[type='text']").not(".slider-value ,.slider");
		var selects = item.find("select");
		var sliderControl = item.find("input.slider");
		var colorPicker = item.find(".colorSelector");
		if(checked){		//可用
			inputs.prop("readonly",false);
			sliderControl.slider("enable");
			selects.prop("disabled",false);

		}else{
			inputs.prop("readonly",true);
			sliderControl.slider("disable");
			selects.prop("disabled",true);
		}
	},

	//设置字段
	displayFields : function(fields){
		if(fields == null){
			return;
		}
		var html = null;
		var field = null;
		var name = null;
		for(var i = 0; i < fields.length;++i){
			field = fields[i];
			name = field.name;
			html += "<option value='" + name + "''>"
			+	name + "</option>";
		}
		this.panel.find("#style-text .text-prop select").html(html);
	},

	//按照样式初始化页面
	displayRule : function(rule){
		var symbolizer = rule.symbolizer;
		if(symbolizer != null){
			var type = symbolizer.type;
			this.setType(type);
			// this.type = type;
			switch(type){
				case GeoBeans.Symbolizer.Type.Point:
					this.displayPointSymbolizer(symbolizer);
					break;
				case GeoBeans.Symbolizer.Type.Line:
					this.displayLineSymbolizer(symbolizer);
					break;
				case GeoBeans.Symbolizer.Type.Polygon:
					this.displayPolygonSymoblizer(symbolizer);
					break;
				default:
					break;
			}
		}

		var minScale = rule.minScale;
		var minScaleItem = this.panel.find("#style-info .sytle-min-scale");
		this.displayMinScale(minScaleItem,minScale);

		var maxScale = rule.maxRule;
		var maxScaleItem = this.panel.find("#style-info .sytle-max-scale");
		this.displayMaxScale(maxScaleItem,maxScale);

		var textSymbolizer = rule.textSymbolizer;
		this.displayTextSymbolizer(textSymbolizer);
	},

	// 显示当前编辑的样式
	setType : function(type){
		this.type = type; 
		// this.panel.find(".style-type .btn-group a").each(function(){
		// 	$(this).removeClass('btn-primary');
		// 	$(this).attr("disabled",true);
		// });
		// switch(type){
		// 	case GeoBeans.Symbolizer.Type.Point:
		// 		this.panel.find("#point_style").addClass("btn-primary");
		// 		this.panel.find("#point_style").attr("disabled",false);
		// 		break;
		// 	case GeoBeans.Symbolizer.Type.Line:
		// 		this.panel.find("#line_style").addClass("btn-primary");
		// 		this.panel.find("#line_style").attr("disabled",false);
		// 		break;
		// 	case GeoBeans.Symbolizer.Type.Polygon:
		// 		this.panel.find("#polygon_style").addClass("btn-primary");
		// 		this.panel.find("#polygon_style").attr("disabled",false);
		// 		break;
		// 	default:
		// 		break;
		// }
		var html = null;
		switch(type){
			case GeoBeans.Symbolizer.Type.Point:{
				html = "点样式";
				break;
			}
			case GeoBeans.Symbolizer.Type.Line:{
				html = "线样式";
				break;
			}
			case GeoBeans.Symbolizer.Type.Polygon:{
				html = "面样式";
				break;
			}
			default:{
				html = "样式";
				break;
			}
		}
		this.panel.find(".modal-header .modal-title").html(html);
	},

	// 展示点样式
	displayPointSymbolizer : function(symbolizer){
		var stroke = symbolizer.stroke;
		var strokeItem = this.panel.find("#style-info .style-stroke");
		this.displayStroke(strokeItem,stroke);
		var fill = symbolizer.fill;
		var fillItem = this.panel.find("#style-info .style-fill");
		this.displayFill(fillItem,fill);
		var shadow = symbolizer.shadow;
		var shadowItem = this.panel.find("#style-info .style-shadow");
		this.displayShadow(shadowItem,shadow);
		var size = symbolizer.size;
		var markItem = this.panel.find("#style-info .style-mark");
		this.displaySize(markItem,size);
	},

	// 展示线样式
	displayLineSymbolizer : function(symbolizer){
		var stroke = symbolizer.stroke;
		var strokeItem = this.panel.find("#style-info .style-stroke");
		this.displayStroke(strokeItem,stroke);
		var fill = symbolizer.fill;
		var fillItem = this.panel.find("#style-info .style-fill");
		this.displayFill(fillItem,fill);
		var shadow = symbolizer.shadow;
		var shadowItem = this.panel.find("#style-info .style-shadow");
		this.displayShadow(shadowItem,shadow);
		// var fillItem = this.panel.find("#style-info .style-fill");
		// this.undisplayStyleItem(fillItem);
		var markItem = this.panel.find("#style-info .style-mark");
		this.undisplayStyleItem(markItem);
	},

	// 展示面样式
	displayPolygonSymoblizer : function(symbolizer){
		var stroke = symbolizer.stroke;
		var strokeItem = this.panel.find("#style-info .style-stroke");
		this.displayStroke(strokeItem,stroke);
		var fill = symbolizer.fill;
		var fillItem = this.panel.find("#style-info .style-fill");
		this.displayFill(fillItem,fill);
		var shadow = this.shadow;
		var shadowItem = this.panel.find("#style-info .style-shadow");
		this.displayShadow(shadowItem,shadow);
		var markItem = this.panel.find("#style-info .style-mark");
		this.undisplayStyleItem(markItem);
	},

	displayStroke : function(strokeItem,stroke){
		if(stroke == null){
			 strokeItem.find(".style_enable").prop("checked",false);
			 this.setSytleItemEnable(strokeItem,false);
		}else{
			strokeItem.find(".style_enable").prop("checked",true);
			this.setSytleItemEnable(strokeItem,true);
			var color = stroke.color;
			if(color != null){
				var hex = color.getHex();
				var opacity = color.getOpacity()*100;
				opacity = parseInt(opacity.toFixed());
				strokeItem.find(".colorSelector").colpickSetColor(hex);
				strokeItem.find(".colorSelector div").css("background-color",hex);
				strokeItem.find(".slider-value").val(opacity + "%");
				strokeItem.find("input.slider").slider("setValue",opacity);

			}
			var width = stroke.width;
			strokeItem.find(".stroke-width").val(width);
			
			var lineCap = stroke.lineCap;
			if(lineCap != null){
				strokeItem.find(".stroke-line-cap")
					.find("option[value=" + lineCap + "]")
					.attr("selected",true);
			}

			var lineJoin = stroke.lineJoin;
			if(lineJoin != null){
				strokeItem.find(".stroke-line-join")
					.find("option[value=" + lineJoin + "]")
					.attr("selected",true);
			}
		}
	},

	displayFill : function(fillItem,fill){
		if(fill == null){
			fillItem.find(".style_enable").prop("checked",false);
			this.setSytleItemEnable(fillItem,false);
		}else{
			fillItem.find(".style_enable").prop("checked",true);
			this.setSytleItemEnable(fillItem,true);
			var color = fill.color;
			if(color != null){
				var hex = color.getHex();
				var opacity = color.getOpacity();
				var opacityPercent = opacity*100;
				opacityPercent = parseInt(opacityPercent.toFixed());
				fillItem.find(".colorSelector").colpickSetColor(hex);
				fillItem.find(".colorSelector div").css("background-color",hex);
				fillItem.find(".colorSelector div").css("opacity",opacity);
				fillItem.find(".slider-value").val(opacityPercent + "%");
				fillItem.find("input.slider").slider("setValue",opacityPercent);
			}

		}
	},

	displayShadow : function(shadowItem,shadow){
		if(shadow == null){
			shadowItem.find(".style_enable").prop("checked",false);
			this.setSytleItemEnable(shadowItem,false);
		}else{
			shadowItem.find(".style_enable").prop("checked",true);
			this.setSytleItemEnable(shadowItem,true);
		}
	},

	displaySize : function(markItem,size){
		if(size == null){
			markItem.find(".style_enable").prop("checked",false);
			this.setSytleItemEnable(markItem,false);
		}else{
			markItem.find(".style_enable").prop("checked",true);
			this.setSytleItemEnable(markItem,true);
			markItem.find(".mark-size").val(size);
		}
	},

	displayMinScale : function(minScaleItem,scale){
		
		if(scale == null){
			minScaleItem.find(".style_enable").prop("checked",false);
			this.setSytleItemEnable(minScaleItem,false);
		}else{
			minScaleItem.find(".style_enable").prop("checked",true);
			this.setSytleItemEnable(minScaleItem,true);
			minScaleItem.find(".min-scale-value").val(scale);
		}
	},

	displayMaxScale : function(maxScaleItem,scale){
		
		if(scale == null){
			maxScaleItem.find(".style_enable").prop("checked",false);
			this.setSytleItemEnable(maxScaleItem,false);
		}else{
			maxScaleItem.find(".style_enable").prop("checked",true);
			this.setSytleItemEnable(maxScaleItem,true);
			maxScaleItem.find(".max-scale-value").val(scale);
		}
	},

	undisplayStyleItem : function(styleItem){
		styleItem.find(".style_enable").prop("checked",false).prop("disabled",true);
		this.setSytleItemEnable(styleItem,false);
	},

	displayTextSymbolizer : function(textSymbolizer){
		var textPanel = this.panel.find("#style-text");
		var propItem = textPanel.find(".text-prop");
		var textItem = textPanel.find(".text-text");
		var fontItem = textPanel.find(".text-font");
		var strokeItem = textPanel.find(".text-stroke");
		var fillItem = textPanel.find(".text-fill");
		var shadowItem = textPanel.find(".text-shadow");
		if(textSymbolizer == null){
			this.displayTextProp(propItem,null);
			this.displayTextText(textItem,null);
			this.displayTextFont(fontItem,null);
			this.displayStroke(strokeItem,null);
			this.displayFill(fillItem,null);
			this.displayShadow(shadowItem,null);
		}else{
			var labelProp = textSymbolizer.labelProp;
			this.displayTextProp(propItem,labelProp);
			var labelText = textSymbolizer.labelText;
			this.displayTextText(textItem,labelText);
			var font = textSymbolizer.font;
			this.displayTextFont(fontItem,font);
			var stroke = textSymbolizer.stroke;
			this.displayStroke(strokeItem,stroke);
			var fill = textSymbolizer.fill;
			this.displayFill(fillItem,fill);
			var shadow = textSymbolizer.shadow;
			this.displayShadow(shadowItem,shadow);
		}
	},

	displayTextProp : function(propItem,textProp){
		if(textProp == null){
			propItem.find(".style_enable").prop("checked",false);
			this.setSytleItemEnable(propItem,false);
		}else{
			propItem.find(".style_enable").prop("checked",true);
			this.setSytleItemEnable(propItem,true);
			var option = propItem.find("select option[value='"+ textProp + "']");


			if(option.length == 1){
				option.attr("selected",true);
			}else {
				var html = "<option value='" + textProp + "''>"
					+	textProp + "</option>";
				option = propItem.find("select option[value='"+ textProp + "']");
				option.attr("selected",true);
			}
		}
	},

	displayTextText : function(textItem,textText){
		if(textText == null){
			textItem.find(".style_enable").prop("checked",false);
			this.setSytleItemEnable(textItem,false);
		}else{
			textItem.find(".style_enable").prop("checked",true);
			this.setSytleItemEnable(textItem,true);
			textItem.find("input[type='text']").val(textText);
		}
	},

	displayTextFont : function(fontItem,textFont){
		if(textFont == null){
			fontItem.find(".style_enable").prop("checked",false);
			this.setSytleItemEnable(fontItem,false);
		}else{
			fontItem.find(".style_enable").prop("checked",true);
			this.setSytleItemEnable(fontItem,true);
			var familySelect = fontItem.find(".font-family");
			var family = textFont.family;
			if(family != null){
				familySelect.find("option[value='" + family + "']")
					.attr("selected",true);
			}

			var styleSelect = fontItem.find(".font-style")
			var style = textFont.style;
			if(style != null){
				styleSelect.find("option[value='" + style + "']")
					.attr("selected",true);
			}

			var weightSelect = fontItem.find(".font-weight");
			var weight = textFont.weight;
			if(weight != null){
				weightSelect.find("option[value='" + weight + "']")
					.attr("selected",true);
			}

			var sizeInput = fontItem.find(".font-size");
			var fontSize = textFont.size;
			if(fontSize != null){
				sizeInput.val(fontSize);
			}
		}
	},

	// 获得当前设置完的样式
	getRule : function(){
		var rule = new GeoBeans.Rule();
		var symbolizer = this.getSymbolizer();
		rule.symbolizer = symbolizer;
		var textSymbolizer = this.getTextSymbolizer();
		rule.textSymbolizer = textSymbolizer;

		var minScaleItem = this.panel.find("#style-info .sytle-min-scale");
		var minScale = this.getMinScale(minScaleItem);
		rule.minScale = minScale;

		var maxScaleItem = this.panel.find("#style-info .sytle-max-scale");
		var maxScale = this.getMaxScale(maxScaleItem);
		rule.maxScale = maxScale;

		return rule;
	},

	getSymbolizer : function(){
		var symbolizer = null;
		switch(this.type){
			case GeoBeans.Symbolizer.Type.Point:{
				symbolizer = this.getPointSymbolizer();
				break;
			}
			case  GeoBeans.Symbolizer.Type.Line:{
				symbolizer = this.getLineSymbolizer();
				break;
			}
			case  GeoBeans.Symbolizer.Type.Polygon:{
				symbolizer = this.getPolygonSymbolizer();
				break;
			}
			default:
				break;
		}
		return symbolizer;
	},

	getPointSymbolizer : function(){
		var pointSymbolizer = new GeoBeans.Symbolizer.PointSymbolizer();

		var fillItem = this.panel.find("#style-info .style-fill");
		var fill = this.getFill(fillItem);
		pointSymbolizer.fill = fill;

		var strokeItem = this.panel.find("#style-info .style-stroke");
		var stroke = this.getStroke(strokeItem);
		pointSymbolizer.stroke = stroke;
		
		var shadowItem = this.panel.find("#style-info .style-shadow");
		var shadow = this.getShadow(shadowItem);
		pointSymbolizer.shadow = shadow;

		var sizeItem = this.panel.find("#style-info .style-mark");
		var size = this.getSize(sizeItem);
		pointSymbolizer.size = size;

		return pointSymbolizer;
	},

	getLineSymbolizer : function(){
		var lineSymbolizer = new GeoBeans.Symbolizer.LineSymbolizer();

		var strokeItem = this.panel.find("#style-info .style-stroke");
		var stroke = this.getStroke(strokeItem);
		lineSymbolizer.stroke = stroke;

		var fillItem = this.panel.find("#style-info .style-fill");
		var fill = this.getFill(fillItem);
		lineSymbolizer.fill = fill;

		var shadowItem = this.panel.find("#style-info .style-shadow");
		var shadow = this.getShadow(shadowItem);
		lineSymbolizer.shadow = shadow;

		return lineSymbolizer;
	},

	getPolygonSymbolizer : function(){
		var polygonSymbolizer = new GeoBeans.Symbolizer.PolygonSymbolizer();
		
		var strokeItem = this.panel.find("#style-info .style-stroke");
		var stroke = this.getStroke(strokeItem);
		polygonSymbolizer.stroke = stroke;		


		var shadowItem = this.panel.find("#style-info .style-shadow");
		var shadow = this.getShadow(shadowItem);
		polygonSymbolizer.shadow = shadow;

		var fillItem = this.panel.find("#style-info .style-fill");
		var fill = this.getFill(fillItem);
		polygonSymbolizer.fill = fill;

		return polygonSymbolizer;
	},

	getFill : function(fillItem){
		if(fillItem.length != 1){
			return null;
		}
		var flag =  fillItem.find(".style_enable").prop("checked");
		if(!flag){
			return null;
		}
		var fill = new GeoBeans.Fill();
		var colorItem = fillItem.find(".colorSelector div");
		var backgroundColor = colorItem.css("background-color");
		var opacity = colorItem.css("opacity");
		var color = new GeoBeans.Color();
		color.setByRgb(backgroundColor,opacity);
		fill.color = color;
		return fill;
	},

	getStroke : function(strokeItem){
		if(strokeItem.length != 1){
			return null;
		}
		var flag = strokeItem.find(".style_enable").prop("checked");
		if(!flag){
			return null;
		}
		var stroke = new GeoBeans.Stroke();
		var colorItem = strokeItem.find(".colorSelector div");
		var backgroundColor = colorItem.css("background-color");
		var opacity = colorItem.css("opacity");
		var color = new GeoBeans.Color();
		color.setByRgb(backgroundColor,opacity);
		stroke.color = color;

		var strokeWidth = strokeItem.find(".stroke-width").val();
		stroke.width = parseFloat(strokeWidth);

		var lineCap = strokeItem.find(".stroke-line-cap option:selected")
								.val();
		stroke.lineCap = lineCap;

		var lineJoin = strokeItem.find(".stroke-line-join option:selected")
								.val();
		stroke.lineJoin = lineJoin;
		return stroke;									
		
	},

	getShadow : function(shadowItem){
		return null;
	},

	getSize : function(markItem){
		if(markItem.length != 1){
			return null;
		}
		var flag = markItem.find(".style_enable").prop("checked");
		if(!flag){
			return null;
		}
		var size = markItem.find(".mark-size").val();
		return size;
	},


	getMinScale : function(minScaleItem){
		if(minScaleItem.length != 1){
			return null;
		}

		var flag = minScaleItem.find(".style_enable").prop("checked");
		if(!flag){
			return null;
		}

		var minScale = minScaleItem.find(".min-scale-value").val();
		return minScale;		
	},

	getMaxScale : function(maxScaleItem){
		if(maxScaleItem.length != 1){
			return null;
		}

		var flag = maxScaleItem.find(".style_enable").prop("checked");
		if(!flag){
			return null;
		}

		var maxScale = maxScaleItem.find(".max-scale-value").val();
		return maxScale;
	},


	getTextSymbolizer : function(){
		var textPanel = this.panel.find("#style-text");
		var propItem = textPanel.find(".text-prop");
		var textItem = textPanel.find(".text-text");
		var propFlag = propItem.find(".style_enable").prop("checked");
		var textFlag = textItem.find(".style_enable").prop("checked");
		if(!propFlag && !textFlag){
			return null;
		}

		var textSymbolizer = new GeoBeans.Symbolizer.TextSymbolizer();
		if(propFlag){
			var labelProp = propItem.find("select option:selected").val();
			textSymbolizer.labelProp = labelProp;
		}

		if(textFlag){
			var labelText = textItem.find("input[type='text']").val();
			textSymbolizer.labelText = labelText;
		}

		var fontItem = textPanel.find(".text-font");
		var font = this.getFont(fontItem);
		textSymbolizer.font = font;

		var strokeItem = textPanel.find(".text-stroke");
		var stroke = this.getStroke(strokeItem);
		textSymbolizer.stroke = stroke;		

		var shadowItem = textPanel.find(".text-shadow");
		var shadow = this.getShadow(shadowItem);
		textSymbolizer.shadow = shadow;

		var fillItem = textPanel.find(".text-fill");
		var fill = this.getFill(fillItem);
		textSymbolizer.fill = fill;

		return textSymbolizer;
	},

	getFont : function(fontItem){
		if(fontItem.length != 1){
			return null;
		}

		var flag = fontItem.find(".style_enable").prop("checked");
		if(!flag){
			return null;
		}

		var font = new GeoBeans.Font();
		var fontFamily = fontItem.find(".font-family option:selected").attr("value");
		font.family = fontFamily;

		var fontStyle = fontItem.find(".font-style option:selected").val();
		font.style = fontStyle;

		var fontWeight = fontItem.find(".font-weight option:selected").val();
		font.weight = fontWeight;
	
		var fontSize = fontItem.find(".font-size").val();
		font.size = fontSize;

		return font;
	}



});