MapCloud.AirlinePanel = MapCloud.Class(MapCloud.Panel,{
	chartLayer : null,

	dbName : "base",
	typeName : "osm_airports",

	option : {
		curveness : 0.4
	},

	initialize : function(){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);

		this.registerPanelEvent();
	},

	cleanup : function(){
		this.panel.find(".chart-table-name").val("航线图");
		this.panel.find(".chart-table-radius").val("6");
		this.panel.find(".line-width").val("0.6");
		this.panel.find(".style_enable").prop("checked",true);

		this.panel.find("input.slider").slider("setValue",100);

		this.panel.find(".colorSelector").colpickSetColor("#EEEEEE");
		this.panel.find(".colorSelector").attr("disabled",false);
		this.panel.find(".colorSelector div").css("background-color",'#EEEEEE');
		this.panel.find(".colorSelector div").css("opacity",1);
		this.panel.find(".color-opacity").html("1.0");
	},


	registerPanelEvent : function(){
		var that = this;

		//样式初始化，拖动条
		this.panel.find(".slider").each(function(){
			$(this).slider({
				tooltip : 'hide'
			});
			$(this).on("slide",function(slideEvt){
				var parent = $(this).parents(".form-group");
				var input = parent.find(".color-opacity")
								.html(slideEvt.value/100);
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

		// 添加
		this.panel.find(".btn-add-chart").click(function(){
			
			that.addLayer();
			MapCloud.refresh_panel.refreshPanel();
		});

		// 关闭
		this.panel.find(".btn-cancel").click(function(){
			that.hidePanel();
		});

		this.panel.find(".style_enable").click(function(){
			var item = $(this).parents(".form-group");
			var sliderControl = item.find("input.slider");
			var inputs = item.find("input[type='text']").not(".slider-value ,.slider");
			var colorSelector = item.find(".colorSelector");
			var flag = $(this).prop("checked");
			if(flag){
				inputs.prop("readonly",false);
				sliderControl.slider("enable");
				colorSelector.attr("disabled",false);
			}else{
				inputs.prop("readonly",true);
				sliderControl.slider("disable");
				colorSelector.attr("disabled",true);
			}	
		});

	},


	addLayer : function(){
		var name = this.panel.find(".chart-table-name").val();
    	if(name == null || name == ""){
    		MapCloud.notify.showInfo("请输入名称","Warning");
    		return;
    	}

    	var size = this.panel.find(".chart-table-radius").val();
    	if(size == null || size == ""){
    		MapCloud.notify.showInfo("请输入机场的点半径","Warning");
    		return;
    	}


    	var width = this.panel.find(".line-width").val();
    	if(width == null || width == ""){
    		MapCloud.notify.showInfo("请输入航线的宽度","Warning");
    		return;
    	}


    	var airportFillItem = this.panel.find(".airport-fill-div");
    	var pointFillColor = this.getColor(airportFillItem);
    	var airportStrokeItem = this.panel.find(".airport-stroke-div");
    	var pointStrokeColor = this.getColor(airportStrokeItem);

    	var airlineStrokeItem = this.panel.find(".airline-stroke-div");
    	var lineStrokeColor = this.getColor(airlineStrokeItem);

    	var pointSymbolizer = new GeoBeans.Symbolizer.PointSymbolizer();
    	if(pointStrokeColor == null){
    		pointSymbolizer.stroke = null;
    	}else{
    		pointSymbolizer.stroke.color = pointStrokeColor;
    	}
    	if(pointFillColor == null){
    		pointSymbolizer.fill = null;
    	}else{
    		pointSymbolizer.fill.color = pointFillColor;
    	}
    	
    	pointSymbolizer.size = size;

    	var lineSymbolizer = new GeoBeans.Symbolizer.LineSymbolizer();
    	lineSymbolizer.stroke.color = lineStrokeColor;
    	lineSymbolizer.fill = null;
    	lineSymbolizer.stroke.width = width;


    	// console.log(color);
    	// var colorItem = airportStrokeItem.find(".colorSelector div");

    	if(this.layer != null){
    		mapObj.removeLayer(this.layer.name);
    	}

    	var layer = new GeoBeans.Layer.AirLineLayer(name,this.dbName,this.typeName,
    		lineSymbolizer,pointSymbolizer,this.option);
    	mapObj.addLayer(layer,this.addLayer_callback);
	},

	// 设置颜色
	getColor : function(item){
		if(item == null){
			return;
		}
		var flag = item.find(".style_enable").prop("checked");
		if(!flag){
			return null;
		} 

		var colorItem = item.find(".colorSelector div");
		var backgroundColor = colorItem.css("background-color");
		var opacity = colorItem.css("opacity");

		var color = new GeoBeans.Color();
		color.setByRgb(backgroundColor,opacity);
		return color;
	},

	addLayer_callback : function(result){
		if(result == "success"){
			mapObj.draw();
			var that = MapCloud.airline_panel;
			var name = that.panel.find(".chart-table-name").val();
			that.layer = mapObj.getLayer(name);
		}else{
			MapCloud.notify.showInfo(result,"添加航线图");
		}
	},


	setLayer : function(layer){
		if(layer == null){
			return;
		}
		this.layer = layer;

		var name = layer.name;
		this.panel.find(".chart-table-name").val(name);

		var pointSymbolizer = layer.pointSymbolizer;
		var pointStroke = pointSymbolizer.stroke;
		if(pointStroke != null){
			var airportStrokeItem = this.panel.find(".airport-stroke-div");
			var color = pointStroke.color;
			this.setColor(airlineStrokeItem,color);

		}
		var pointFill = pointSymbolizer.fill;
		if(pointFill != null){
			var airportFillItem = this.panel.find(".airport-fill-div");
			var color = pointFill.color;
			this.setColor(airportFillItem,color);
		}

		var size = pointSymbolizer.size;
		this.panel.find('.chart-table-radius').val(size);

		var lineSymbolizer = layer.symbolizer;
		var lineStroke = lineSymbolizer.stroke;
		var airlineStrokeItem = this.panel.find(".airline-stroke-div");
		this.setColor(airlineStrokeItem,lineStroke.color);
		var width = lineStroke.width;
		this.panel.find(".line-width").val(width);

	},


	setColor : function(item,color){
		if(item == null || color == null){
			return;
		}

		var hex = color.getHex();
		item.find(".colorSelector").colpickSetColor(hex);
		item.find(".colorSelector div").css("background-color",hex);

		var opacity = color.getOpacity();
		item.find("input.slider").slider("setValue",opacity*100);
		item.find(".colorSelector div").css("opacity",opacity);
	},








})
