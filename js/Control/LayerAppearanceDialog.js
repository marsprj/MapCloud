MapCloud.LayerAppearanceDialog = MapCloud.Class(MapCloud.Dialog, {

	geomType : null,
	symbolizer : null,
	textSymbolizer : null,
	callback: null,
	index: null,
	layerIndex : null,
	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);

		this.panel.find("#layerAppearanceDialogTab a").each(function(){
			$(this).click(function(e){
				e.preventDefault()
				$(this).tab("show");
			});
		});

		var dialog = this;
		/***********************可视化初始化设置*********************/
		//透明度
		$('#layer_color_transparency').slider();
		$("#layer_color_transparency").on("slide",function(slideEvt){
			$("#layer_color_transparency_value").val(slideEvt.value);
			$("#layer_color div").css("opacity",slideEvt.value/100);

		});

		$('#layer_border_color_transparency').slider();
		$("#layer_border_color_transparency").on("slide",function(slideEvt){
			$("#layer_border_color_transparency_value").val(slideEvt.value);
			$("#layer_border_color div").css("opacity",slideEvt.value/100);
		});

		$("#layer_shadow_color_transparency").slider();
		$("#layer_shadow_color_transparency").on("slide",function(slideEvt){
			$("#layer_shadow_color_transparency_value").val(slideEvt.value);
			$("#layer_shadow_color div").css("opacity",slideEvt.value/100);
		});



		//颜色选择器
		$('#layer_color').colpick({
			onChange:function(hsb,hex,rgb,el,bySetColor) {
				$("#layer_color div").css("background-color","#" + hex);
			},
			onSubmit:function(hsb,hex,rgb,el,bySetColor) {
				$("#layer_color div").css("background-color","#" + hex);
				$('#layer_color').colpickHide();
			},
		});

		$('#layer_border_color').colpick({
			onChange:function(hsb,hex,rgb,el,bySetColor) {
				$("#layer_border_color div").css("background-color","#" + hex);
			},
			onSubmit:function(hsb,hex,rgb,el,bySetColor) {
				$("#layer_border_color div").css("background-color","#" + hex);
				$('#layer_border_color').colpickHide();
			},
		});

		$('#layer_shadow_color').colpick({
			onChange:function(hsb,hex,rgb,el,bySetColor) {
				$("#layer_shadow_color div").css("background-color","#" + hex);
			},
			onSubmit:function(hsb,hex,rgb,el,bySetColor) {
				$("#layer_shadow_color div").css("background-color","#" + hex);
				$('#layer_shadow_color').colpickHide();
			},
		});

		/***********************文字标记初始化设置*********************/
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


		//文字标记
		this.panel.find("#label_show").each(function(){
			$(this).change(function(){
				var fieldset = $("#label_show_fieldset");
				if(this.checked){
					fieldset.removeClass("disable-show");

					fieldset.find("#label_field").prop("disabled",false);
					fieldset.find("#label_font_family").prop("disabled",false);
					fieldset.find("#label_font_weight").prop("disabled",false);
					fieldset.find("#label_font_style").prop("disabled",false);
					fieldset.find("#label_font_size").prop("readonly",false);


					//字体填充
					fieldset.find("#label_show_fill").each(function(){
						$(this).change(function(){
							var labelShowFlag = $("#label_show").prop("checked");
							if(!labelShowFlag){
								return;
							}
							dialog.changeShowFillState(this.checked);
						});
						dialog.changeShowFillState(this.checked);
					});
					//边框线
					fieldset.find("#label_show_outline").each(function(){
						$(this).change(function(){
							var labelShowFlag = $("#label_show").prop("checked");
							if(!labelShowFlag){
								return;
							}
							dialog.changeShowOutlineState(this.checked);
						});
						dialog.changeShowOutlineState(this.checked);
					});

					//阴影
					fieldset.find("#label_show_shadow").each(function(){
						$(this).change(function(){
							var shadowFieldset = $(this).parent().parent();
							var labelShowFlag = $("#label_show").prop("checked");
							if(!labelShowFlag){
								return;
							}
							dialog.changeShowShadowState(this.checked);
						});
						dialog.changeShowShadowState(this.checked);
					});
				}else{
					fieldset.addClass("disable-show");
					fieldset.find("select").prop("disabled","diabled");
					fieldset.find('#label_fill_color_transparency').slider("disable");
					fieldset.find('#label_border_color_transparency').slider("disable");
					fieldset.find('#label_shadow_color_transparency').slider("disable");
					fieldset.find("#label_font_size").prop("readonly",true);
					fieldset.find("#label_border_width").prop("readonly",true);
					fieldset.find("#label_shadow_offset_x").prop("readonly",true);
					fieldset.find("#label_shadow_offset_y").prop("readonly",true);
					fieldset.find("#label_shadow_blur").prop("readonly",true);
				}
			});
		});



		//确定之后传递样式
		this.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){

				dialog.symbolizer = dialog.getGeomSymbolizer();
				/***********************文字标记设置获取*********************/
				dialog.textSymbolizer = dialog.getTextSymbolizer();

				dialog.closeDialog();
//				dialog.callback(dialog.symbolizer,dialog.index);
				dialog.callback(dialog.symbolizer,dialog.textSymbolizer, dialog.index,dialog.layerIndex);
			});
		});

	},

	destory : function(){
		MapCloud.Dialog.prototype.destory.apply(this, arguments);
	},

	cleanup : function(){
	},

	registerTabEvents:function(){
		var that = this;
		this.panel.find(".mc-tabs-ul li").each(function(index,element){
			$(this).click(function(e){
				that.panel.find(".mc-tab-form").each(function(){
					$(this).removeClass("active_tab");
				});

				that.panel.find(".mc-tab-form:eq(" +index + ")").addClass("active_tab");

				that.panel.find(".mc-tabs-ul li").removeClass("active");
				$(this).addClass("active");

			});
		});
	},

	//根据geomSymbolizer的样式来设置可视化tab
	setGeomSymbolizer:function(geomType,symbolizer,index,callback,layerIndex){
		this.geomType = geomType;
		this.symbolizer = symbolizer;
		this.callback = callback;
		this.index = index;
		this.layerIndex = layerIndex;

		var colorRgba = symbolizer.color;
		var width = symbolizer.width;
		var fillColorRgba = symbolizer.fillColor;
		var size = symbolizer.size;

		var showOutline = symbolizer.showOutline;
		var outLineColorRgba = symbolizer.outLineColor;
		var outLineWidth = symbolizer.outLineWidth;
		var outLineJoin = symbolizer.outLineJoin;
		var outLineCap = symbolizer.outLineCap;

		var showShadow = symbolizer.showShadow;
		var shadowBlur = symbolizer.shadowBlur;
		var shadowColorRgba = symbolizer.shadowColor;
		var shadowOffsetX = symbolizer.shadowOffsetX;
		var shadowOffsetY = symbolizer.shadowOffsetY;

		var colorHex = null;
		var color = null;
		var colorTransparency = null;
		if(colorRgba !=  null){
			color = MapCloud.rgba2rgb(colorRgba);
			colorHex = MapCloud.rgb2hex(color);
			colorTransparency = MapCloud.rgba2Opacity(colorRgba);
		}

		var fillColorHex = null;
		var fillColor = null;
		var fillColorTransparency = null;
		if(fillColorRgba != null){
			fillColor = MapCloud.rgba2rgb(fillColorRgba);
			fillColorHex = MapCloud.rgb2hex(fillColor);
			fillColorTransparency = MapCloud.rgba2Opacity(fillColorRgba);
		}

		var outLineColorHex = null;
		var outLineColor = null;
		var outLineColorTransparency = null;
		if(outLineColorRgba != null){
			outLineColor = MapCloud.rgba2rgb(outLineColorRgba);
			outLineColorHex = MapCloud.rgb2hex(outLineColor);
			outLineColorTranparency = MapCloud.rgba2Opacity(outLineColorRgba);
		}

		var shadowColorHex = null;
		var shadowColor = null;
		var shadowColorTransparency = null;
		if(shadowColorRgba != null){
			shadowColor = MapCloud.rgba2rgb(shadowColorRgba);
			shadowColorHex = MapCloud.rgb2hex(shadowColor);
			shadowColorTransparency = MapCloud.rgba2Opacity(shadowColorRgba);
		}



		var outLineCapType = null;
		switch(outLineCap){
			case GeoBeans.Style.LineCap.BUTT :{
				outLineCapType = "BUTT";
				break;
			}
			case GeoBeans.Style.LineCap.ROUND :{
				outLineCapType = "ROUND";
				break;
			}
			case GeoBeans.Style.LineCap.SQUARE :{
				outLineCapType = "SQUARE";
				break;
			}
			default:{
				break;
			}
		}
//		$("#layer_line_cap").find("option[value=" + outLineCapType + "]").attr("selected","true");


		var outLineJoin = null;
		switch(outLineJoin){
			case GeoBeans.Style.LineJoin.BEVEL:{
				outLineJoin = "BEVEL";
				break;
			}
			case GeoBeans.Style.LineJoin.ROUND:{
				outLineJoin = "ROUND";
				break;
			}
			case GeoBeans.Style.LineJoin.MITER:{
				outLineJoin = "MITER";
				break;
			}
			default:{
				break;
			}
		}
//		$("#layer_line_join").find("option[value=" + outLineCapType + "]").attr("selected","true");

		var geomTypeLower = geomType.toLowerCase();
		switch(geomTypeLower){
			case "point":{
				this.panel.find(".layer_polygon_type").css("display","none");
				this.panel.find(".layer_point_type").css("display","table-cell");
				$("#layer_color div").css("background-color",fillColor);
				$("#layer_color div").css("opacity",fillColorTransparency);
				$("#layer_color").colpickSetColor(fillColorHex);
				$("#layer_color_transparency").slider("setValue",fillColorTransparency*100);
				$("#layer_color_transparency_value").val(fillColorTransparency*100);
				$("#layer_size").val(size);

				$("#layer_show_outline").attr("checked",showOutline);
				var fieldset = $("#layer_show_outline_fieldset");
				if(showOutline){
					fieldset.removeClass("disable-show-outline");
					$("#layer_border_width").prop("readonly",false);
					$('#layer_border_color_transparency').slider("enable");
					$("#layer_line_cap").prop("disabled",false);
					$("#layer_line_join").prop("disabled",false);

					$("#layer_border_color div").css("background-color",outLineColor);
					$("#layer_border_color div").css("opacity",outLineColorTranparency);
					$("#layer_border_color").colpickSetColor(outLineColorHex);
					$("#layer_border_color_transparency").slider("setValue",outLineColorTranparency*100);
					$("#layer_border_color_transparency_value").val(outLineColorTranparency*100);
					$("#layer_border_width").val(outLineWidth);
					$("#layer_line_cap").find("option[value=" + outLineCapType + "]").attr("selected","true");
					$("#layer_line_join").find("option[value=" + outLineJoin + "]").attr("selected","true");
				}else{
					fieldset.addClass("disable-show-outline");
					$("#layer_border_width").prop("readonly",true);
					$('#layer_border_color_transparency').slider("disable");
					$("#layer_line_cap").prop("disabled","disabled");
					$("#layer_line_join").prop("disabled","disabled");
				}

				$("#layer_show_shadow").attr("checked",showShadow);
				var shadowFieldset = $("#layer_show_shadow_fieldset");
				if(showShadow){
					shadowFieldset.removeClass("disable-show-shadow");
					$("#layer_shadow_offset_x").prop("readonly",false);
					$("#layer_shadow_offset_y").prop("readonly",false);
					$("#layer_shadow_blur").prop("readonly",false);
					$('#layer_shadow_color_transparency').slider("enable");

					$("#layer_shadow_color div").css("background-color",shadowColor);
					$("#layer_shadow_color div").css("opacity",shadowColorTransparency);
					$("#layer_shadow_color").colpickSetColor(shadowColorHex);
					$("#layer_shadow_color_transparency").slider("setValue",shadowColorTransparency*100);
					$("#layer_shadow_color_transparency_value").val(shadowColorTransparency*100);

				}else{
					shadowFieldset.addClass("disable-show-shadow");
					$("#layer_shadow_offset_x").prop("readonly",true);
					$("#layer_shadow_offset_y").prop("readonly",true);
					$("#layer_shadow_blur").prop("readonly",true);
					$('#layer_shadow_color_transparency').slider("disable");

				}
				break;
			}

			case "multipolygon":
			case "polygon":{
				this.panel.find(".layer_point_type").css("display","none");
				this.panel.find(".layer_polygon_type").css("display","table-cell");
				$("#layer_border_color div").css("background-color",outLineColor);
				$("#layer_border_color div").css("opacity",outLineColorTranparency);
				$("#layer_border_color").colpickSetColor(outLineColorHex);
				$("#layer_border_color_transparency").slider("setValue",outLineColorTranparency*100);
				$("#layer_border_color_transparency_value").val(outLineColorTranparency*100);
				$("#layer_border_width").val(outLineWidth);

				$("#layer_color div").css("background-color",fillColor);
				$("#layer_color div").css("opacity",fillColorTransparency);
				$("#layer_color").colpickSetColor(fillColorHex);
				$("#layer_color_transparency").slider("setValue",fillColorTransparency*100);
				$("#layer_color_transparency_value").val(fillColorTransparency*100);

				break;
			}
			case "multilinestring":
			case "linestring":{
				this.panel.find(".layer_polygon_type, .layer_point_type").css("display","none");
				$("#layer_border_color div").css("background-color",color);
				$("#layer_border_color div").css("opacity",colorTransparency);
				$("#layer_border_color").colpickSetColor(colorHex);
				var colorTransparencyValue = colorTransparency*100;
				$("#layer_border_color_transparency").slider("setValue",colorTransparencyValue);
				$("#layer_border_color_transparency_value").val(colorTransparencyValue);
				$("#layer_border_width").val(width);

			}
			default:{
				break;
			}
		}
	},

	//设置文字标记的样式
	setTextSymbolizer:function(textSymbolizer){

		this.textSymbolizer = textSymbolizer;

		if(textSymbolizer == null){
			this.panel.find("#label_show").prop("checked",false);
			var fieldset = $("#label_show_fieldset");
			fieldset.addClass("disable-show");
			fieldset.find("select").prop("disabled","diabled");
			fieldset.find('#label_fill_color_transparency').slider("disable");
			fieldset.find('#label_border_color_transparency').slider("disable");
			fieldset.find('#label_shadow_color_transparency').slider("disable");
			fieldset.find("#label_font_size").prop("readonly",true);
			fieldset.find("#label_border_width").prop("readonly",true);
			fieldset.find("#label_shadow_offset_x").prop("readonly",true);
			fieldset.find("#label_shadow_offset_y").prop("readonly",true);
			fieldset.find("#label_shadow_blur").prop("readonly",true);

			return;
		}

		this.panel.find("#label_show").prop("checked",true);
		var fieldset = $("#label_show_fieldset");
		fieldset.removeClass("disable-show");
		var fieldname = textSymbolizer.field;
		var fontFamily = textSymbolizer.fontFamily;
		var fontSize = textSymbolizer.fontSize;
		var fontWeight = textSymbolizer.fontWeight;
		var fontStyle = textSymbolizer.fontStyle;

		var showFill = textSymbolizer.showFill;
		var fillColorRgba = textSymbolizer.fillColor;

		var showOutline = textSymbolizer.showOutline;
		var outLineColorRgba = textSymbolizer.outLineColor;
		var outLineWidth = textSymbolizer.outLineWidth;
		var outLineJoin = textSymbolizer.outLineJoin;
		var outLineCap = textSymbolizer.outLineCap;

		var showShadow = textSymbolizer.showShadow;
		var shadowColorRgba = textSymbolizer.shadowColor;
		var shadowOffsetX = textSymbolizer.shadowOffsetX;
		var shadowOffsetY = textSymbolizer.shadowOffsetY;

		//基本属性
		this.panel.find("#label_field").find("option[value=" + fieldname + "]").attr("selected",true);
		this.panel.find("#label_font_family").find("option[value=\"" + fontFamily + "\"]").attr("selected",true);
		this.panel.find("#label_font_weight").find("option[value=" + fontWeight + "]").attr("selected",true);
		this.panel.find("#label_font_style").find("option[value=" + fontStyle + "]").attr("selected",true);
		this.panel.find("#label_font_size").val(fontSize);

		//字体填充
		var fillColorHex = null;
		var fillColor = null;
		var fillColorTransparency = null;
		if(fillColorRgba != null){
			fillColor = MapCloud.rgba2rgb(fillColorRgba);
			fillColorHex = MapCloud.rgb2hex(fillColor);
			fillColorTransparency = MapCloud.rgba2Opacity(fillColorRgba);
		}

		//边框颜色
		var outLineColorHex = null;
		var outLineColor = null;
		var outLineColorTransparency = null;
		if(outLineColorRgba != null){
			outLineColor = MapCloud.rgba2rgb(outLineColorRgba);
			outLineColorHex = MapCloud.rgb2hex(outLineColor);
			outLineColorTranparency = MapCloud.rgba2Opacity(outLineColorRgba);
		}

		//阴影颜色
		var shadowColorHex = null;
		var shadowColor = null;
		var shadowColorTransparency = null;
		if(shadowColorRgba != null){
			shadowColor = MapCloud.rgba2rgb(shadowColorRgba);
			shadowColorHex = MapCloud.rgb2hex(shadowColor);
			shadowColorTransparency = MapCloud.rgba2Opacity(shadowColorRgba);
		}


		var outLineCapType = null;
		switch(outLineCap){
			case GeoBeans.Style.LineCap.BUTT :{
				outLineCapType = "BUTT";
				break;
			}
			case GeoBeans.Style.LineCap.ROUND :{
				outLineCapType = "ROUND";
				break;
			}
			case GeoBeans.Style.LineCap.SQUARE :{
				outLineCapType = "SQUARE";
				break;
			}
			default:{
				break;
			}
		}

		var outLineJoin = null;
		switch(outLineJoin){
			case GeoBeans.Style.LineJoin.BEVEL:{
				outLineJoin = "BEVEL";
				break;
			}
			case GeoBeans.Style.LineJoin.ROUND:{
				outLineJoin = "ROUND";
				break;
			}
			case GeoBeans.Style.LineJoin.MITER:{
				outLineJoin = "MITER";
				break;
			}
			default:{
				break;
			}
		}

		this.panel.find('#label_fill_color').attr('checked', showFill);
		this.changeShowFillState(showFill);
		if (showFill) {
			this.panel.find("#label_fill_color div").css("background-color",fillColor);
			this.panel.find("#label_fill_color div").css("opacity",fillColorTransparency);
			this.panel.find("#label_fill_color").colpickSetColor(fillColorHex);
			this.panel.find("#label_fill_color_transparency").slider("setValue",fillColorTransparency*100);
			this.panel.find("#label_fill_color_transparency_value").val(fillColorTransparency*100);

		}

		this.panel.find('#label_show_outline').attr('checked', showOutline);
		this.changeShowOutlineState(showOutline);
		if (showOutline) {
			this.panel.find("#label_border_color div").css("background-color",outLineColor);
			this.panel.find("#label_border_color div").css("opacity",outLineColorTranparency);
			this.panel.find("#label_border_color").colpickSetColor(outLineColorHex);
			this.panel.find("#label_border_color_transparency").slider("setValue",outLineColorTranparency*100);
			this.panel.find("#label_border_color_transparency_value").val(outLineColorTranparency*100);
			this.panel.find("#label_border_width").val(outLineWidth);
			this.panel.find("#label_line_cap").find("option[value=" + outLineCapType + "]").attr("selected","true");
			this.panel.find("#label_line_join").find("option[value=" + outLineJoin + "]").attr("selected","true");
		}

		this.panel.find("#label_show_shadow").attr("checked", showShadow);
		this.changeShowShadowState(showShadow);
		if (showShadow) {
			this.panel.find("#label_shadow_color div").css("background-color",shadowColor);
			this.panel.find("#label_shadow_color div").css("opacity",shadowColorTransparency);
			this.panel.find("#label_shadow_color").colpickSetColor(shadowColorHex);
			this.panel.find("#label_shadow_color_transparency").slider("setValue",shadowColorTransparency*100);
			this.panel.find("#label_shadow_color_transparency_value").val(shadowColorTransparency*100);
		}
	},
	//改变字体填充的状态
	changeShowFillState: function(checked){
		var fillFieldset = $("#label_show_fill_fieldset");
		if(checked){
			fillFieldset.removeClass("disable-show");
			fillFieldset.find('#label_fill_color_transparency').slider("enable");
		}else{
			fillFieldset.addClass("disable-show");
			fillFieldset.find('#label_fill_color_transparency').slider("disable");
		}

	},

	//改变边框的状态
	changeShowOutlineState:function(checked){
		var outlineFieldset = $("#label_show_outline_fieldset");
		if(checked){
			outlineFieldset.removeClass("disable-show");
			outlineFieldset.find("#label_border_width").prop("readonly",false);
			outlineFieldset.find('#label_border_color_transparency').slider("enable");
			outlineFieldset.find("#label_line_cap").prop("disabled",false);
			outlineFieldset.find("#label_line_join").prop("disabled",false);
		}else{
			outlineFieldset.addClass("disable-show");
			outlineFieldset.find("#label_border_width").prop("readonly",true);
			outlineFieldset.find('#label_border_color_transparency').slider("disable");
			outlineFieldset.find("#label_line_cap").prop("disabled","disabled");
			outlineFieldset.find("#label_line_join").prop("disabled","disabled");
		}

	},

	//改变阴影的状态
	changeShowShadowState:function(checked){
		var shadowFieldset = $("#label_show_shadow_fieldset");
		if(checked){
			shadowFieldset.removeClass("disable-show");
			shadowFieldset.find("#label_shadow_offset_x").prop("readonly",false);
			shadowFieldset.find("#label_shadow_offset_y").prop("readonly",false);
			shadowFieldset.find("#label_shadow_blur").prop("readonly",false);
			shadowFieldset.find('#label_shadow_color_transparency').slider("enable");
		}else{
			shadowFieldset.addClass("disable-show");
			shadowFieldset.find("#label_shadow_offset_x").prop("readonly",true);
			shadowFieldset.find("#label_shadow_offset_y").prop("readonly",true);
			shadowFieldset.find("#label_shadow_blur").prop("readonly",true);
			shadowFieldset.find('#label_shadow_color_transparency').slider("disable");
		}
	},

	//设置字段
	setLayerFields: function(fields){
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

	//可视化设置获取
	getGeomSymbolizer:function(){
		var dialog = this;
		var geomSymbolizer = null;
		var fillColor = dialog.panel.find("#layer_color div").css("background-color");
		var fillColorTransparency = dialog.panel.find("#layer_color div").css("opacity");
		var fillColorRgba = MapCloud.rgb2rgba(fillColor,fillColorTransparency);

		var size = dialog.panel.find("#layer_size").val();


		var borderColorRgba = null;
		var borderWidth = null;
		var lineCapType = null;
		var lineJoinType = null;
		//边框
		var layerShowOutLineFlag = $("#layer_show_outline").prop("checked");
		if(layerShowOutLineFlag == true){
			var borderColor = dialog.panel.find("#layer_border_color div").css("background-color");
			var borderColorTransparency = dialog.panel.find("#layer_border_color div").css("opacity");
			borderColorRgba = MapCloud.rgb2rgba(borderColor,borderColorTransparency);

			borderWidth = dialog.panel.find("#layer_border_width").val();

			var lineCap = dialog.panel.find("#layer_line_cap").find("option:selected").attr("value");
			switch(lineCap){
				case "BUTT":{
					lineCapType = GeoBeans.Style.LineCap.BUTT;
					break;
				}
				case "ROUND":{
					lineCapType = GeoBeans.Style.LineCap.ROUND;
					break;
				}
				case "SQUARE":{
					lineCapType = GeoBeans.Style.LineCap.SQUARE;
					break;
				}
				default:
					break;
			}

			var lineJoin = dialog.panel.find("#layer_line_join").find("option:selected").attr("value");
			switch(lineJoin){
				case "MITER":{
					lineJoinType = GeoBeans.Style.LineJoin.MITER;
					break;
				}
				case "ROUND":{
					lineJoinType = GeoBeans.Style.LineJoin.ROUND;
					break;
				}
				case "BEVEL":{
					lineJoinType = GeoBeans.Style.LineJoin.BEVEL;
					break;
				}
			}
		}

		var shadowColorRgba = null;
		var shadowOffsetX = null;
		var shadowOffsetY = null;
		var shadowBlur = null;

		//阴影
		var layerShowShadowFlag = $("#layer_show_shadow").prop("checked");
		if(layerShowShadowFlag == true){
			var shadowColor = dialog.panel.find("#layer_shadow_color div").css("background-color");
			var shadowColorTransparency = dialog.panel.find("#layer_shadow_color div").css("opacity");
			shadowColorRgba = MapCloud.rgb2rgba(shadowColor,shadowColorTransparency);


			shadowOffsetX = dialog.panel.find("#layer_shadow_offset_x").val();
			shadowOffsetY = dialog.panel.find("#layer_shadow_offset_y").val();

			shadowBlur = dialog.panel.find("#layer_shadow_blur").val();

		}
		var geomTypeLower = dialog.geomType.toLowerCase();
		switch(geomTypeLower){
			case "point":{
				geomSymbolizer = new GeoBeans.Style.PointSymbolizer();
				geomSymbolizer.size = size;
				geomSymbolizer.fillColor = fillColorRgba;
				geomSymbolizer.showOutline = layerShowOutLineFlag;
				if(geomSymbolizer.showOutline){
					geomSymbolizer.outLineWidth = borderWidth;
					geomSymbolizer.outLineColor = borderColorRgba;
					geomSymbolizer.outLineCap = lineCapType;
					geomSymbolizer.outLineJoin = lineJoinType;
					geomSymbolizer.showOutline = true;
				}
				geomSymbolizer.showShadow = layerShowShadowFlag;
				if(geomSymbolizer.showShadow){
					geomSymbolizer.shadowColor = shadowColorRgba;
					geomSymbolizer.shadowOffsetX = shadowOffsetX;
					geomSymbolizer.shadowOffsetY = shadowOffsetY;
					geomSymbolizer.shadowBlur = shadowBlur;
				}
				break;
			}

			case "multipolygon":
			case "polygon":
				geomSymbolizer = new GeoBeans.Style.PolygonSymbolizer();
				geomSymbolizer.fillColor = fillColorRgba;
				geomSymbolizer.outLineWidth = borderWidth;
				geomSymbolizer.outLineColor = borderColorRgba;
				geomSymbolizer.outLineCap = lineCapType;
				geomSymbolizer.outLineJoin = lineJoinType;
				geomSymbolizer.showOutline = true;
				break;
			case "multilinestring":
			case "linestring":
				geomSymbolizer = new GeoBeans.Style.LineSymbolizer();
				geomSymbolizer.width = borderWidth;
				geomSymbolizer.color = borderColorRgba;
				geomSymbolizer.outLineCap = lineCapType;
				geomSymbolizer.outLineJoin = lineJoinType;
				geomSymbolizer.showOutline = true;
				break;
			default:
				break;
		}
		return geomSymbolizer;
	},


	//获得文字标记样式
	getTextSymbolizer:function(){
		var textSymbolizer = null;
		var labelShowFlag = this.panel.find("#label_show").prop("checked");
		if(!labelShowFlag){
			return textSymbolizer;
		}
		//基本属性
		var fieldname = this.panel.find("#label_field").find("option:selected").attr("value");
		var fontFamily = this.panel.find("#label_font_family").find("option:selected").attr("value");
		var fontSize = this.panel.find("#label_font_size").val();
		var fontWeight = this.panel.find("#label_font_weight").find("option:selected").attr("value");
		var fontStyle = this.panel.find("#label_font_style").find("option:selected").attr("value");

		//填充颜色
		var labelFillColorRgba = null;
		var labelFillColorFlag = this.panel.find("#label_show_fill").prop("checked");
		if(labelFillColorFlag){
			var fillColor = this.panel.find("#label_fill_color div").css("background-color");
			var fillColorTransparency = this.panel.find("#label_fill_color div").css("opacity");
			labelFillColorRgba = MapCloud.rgb2rgba(fillColor,fillColorTransparency);

		}

		var labelBorderColorRgba = null;
		var labelBorderWidth = null;
		var labelLineCapType = null;
		var labelLineJoinType = null;

		//文字边框
		var labelShowOutLineFlag = this.panel.find("#label_show_outline").prop("checked");
		if(labelShowOutLineFlag == true){
			var borderColor = this.panel.find("#label_border_color div").css("background-color");
			var borderColorTransparency = this.panel.find("#label_border_color div").css("opacity");
			labelBorderColorRgba = MapCloud.rgb2rgba(borderColor,borderColorTransparency);

			labelBorderWidth = this.panel.find("#label_border_width").val();

			var lineCap = this.panel.find("#label_line_cap").find("option:selected").attr("value");
			switch(lineCap){
				case "BUTT":{
					labelLineCapType = GeoBeans.Style.LineCap.BUTT;
					break;
				}
				case "ROUND":{
					labelLineCapType = GeoBeans.Style.LineCap.ROUND;
					break;
				}
				case "SQUARE":{
					labelLineCapType = GeoBeans.Style.LineCap.SQUARE;
					break;
				}
				default:
					break;
			}

			var lineJoin = this.panel.find("#label_line_join").find("option:selected").attr("value");
			switch(lineJoin){
				case "MITER":{
					labelLineJoinType = GeoBeans.Style.LineJoin.MITER;
					break;
				}
				case "ROUND":{
					labelLineJoinType = GeoBeans.Style.LineJoin.ROUND;
					break;
				}
				case "BEVEL":{
					labelLineJoinType = GeoBeans.Style.LineJoin.BEVEL;
					break;
				}
			}
		}
		var labelShadowColorRgba = null;
		var labelShadowOffsetX = null;
		var labelShadowOffsetY = null;
		var labelShadowBlur = null;

		//阴影
		var labelShowShadowFlag = this.panel.find("#label_show_shadow").prop("checked");
		if(labelShowShadowFlag == true){
			var shadowColor = this.panel.find("#label_shadow_color div").css("background-color");
			var shadowColorTransparency = this.panel.find("#label_shadow_color div").css("opacity");
			labelShadowColorRgba = MapCloud.rgb2rgba(shadowColor,shadowColorTransparency);


			labelShadowOffsetX = this.panel.find("#label_shadow_offset_x").val();
			labelShadowOffsetY = this.panel.find("#label_shadow_offset_y").val();

			labelShadowBlur = this.panel.find("#label_shadow_blur").val();
		}

		textSymbolizer = new GeoBeans.Style.TextSymbolizer();
		textSymbolizer.field = fieldname;
		textSymbolizer.fontFamily = fontFamily;
		textSymbolizer.fontSize = fontSize;
		textSymbolizer.fontWeight = fontWeight;
		textSymbolizer.fontStyle = fontStyle;
		textSymbolizer.showFill = labelFillColorFlag;
		if(textSymbolizer.showFill){
			textSymbolizer.fillColor = labelFillColorRgba;
		}
		textSymbolizer.showOutline = labelShowOutLineFlag;
		if(textSymbolizer.showOutline){
			textSymbolizer.outLineWidth = labelBorderWidth;
			textSymbolizer.outLineColor = labelBorderColorRgba;
			textSymbolizer.outLineCap = labelLineCapType;
			textSymbolizer.outLineJoin = labelLineJoinType;
		}
		textSymbolizer.showShadow = labelShowShadowFlag;
		if(textSymbolizer.showShadow){
			textSymbolizer.shadowColor = labelShadowColorRgba;
			textSymbolizer.shadowOffsetX = labelShadowOffsetX;
			textSymbolizer.shadowOffsetY = labelShadowOffsetY;
			textSymbolizer.shadowBlur = labelShadowBlur;
		}
		return textSymbolizer;
	},
});
