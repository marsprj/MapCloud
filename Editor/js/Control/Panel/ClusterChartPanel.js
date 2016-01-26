MapCloud.ClusterChartPanel = MapCloud.Class(MapCloud.Panel,{
	chartLayer : null,

	initialize : function(){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);

		this.registerPanelEvent();
	},

	cleanup : function(){
		this.chartLayer = null;
		this.panel.find(".chart-layers-field").empty();
		this.panel.find(".chart-table-name").val("点聚合图");

		this.panel.find(".form-group-color input.slider").slider("setValue",100);
		this.panel.find(".form-group-border input.slider").slider("setValue",100);
		this.panel.find(".form-group-color .color-opacity").html(1.0);
		this.panel.find(".form-group-border .border-color-opacity").html(1.0);
		this.panel.find(".colorSelector").colpickSetColor("#EEEEEE");
		this.panel.find(".colorSelector div").css("background-color",'#EEEEEE');
		this.panel.find(".colorSelector div").css("opacity",1);
	},

	showPanel : function(){
		MapCloud.Panel.prototype.showPanel.apply(this,arguments);
		this.showLayers();
	},

	registerPanelEvent : function(){
		var that = this;

		this.panel.find(".btn-add-chart").click(function(){
			if(that.chartLayer == null){
				that.addChart();
			}else{
				that.changeChartOption();
			}
			
			MapCloud.refresh_panel.refreshPanel();
		});

		this.panel.find(".btn-cancel").click(function(){
			that.hidePanel();
		});

		// 设置颜色选择器
		this.panel.find(".colorSelector").each(function(){
			$(this).colpick({
				color:'EEEEEE',
				onChange:function(hsb,hex,rgb,el,bySetColor) {
					$(el).children().css("background-color","#" + hex);
				},
				onSubmit:function(hsb,hex,rgb,el,bySetColor){
					$(el).children().css("background-color","#" + hex);
					$(el).colpickHide();
				}
			});
		});
		// 设置颜色透明度
		this.panel.find(".form-group-color .slider").each(function(){
			$(this).slider({
				tooltip : 'hide'
			});
			$(this).on("slide",function(slideEvt){
				var opacity = slideEvt.value;
				that.panel.find(".color-opacity").html(opacity/100);
				var styleDiv = $(this).parent().prev().find(".colorSelector div");
				styleDiv.css("opacity",opacity/100);
			});
		});

		// 设置边界透明度
		this.panel.find(".form-group-border .slider").each(function(){
			$(this).slider({
				tooltip : 'hide'
			});
			$(this).on("slide",function(slideEvt){
				var opacity = slideEvt.value;
				that.panel.find(".border-color-opacity").html(opacity/100);
				var styleDiv = $(this).parent().prev().find(".colorSelector div");
				styleDiv.css("opacity",opacity/100);
			});
		});
	},

	showLayers : function(){
		if(mapObj == null){
			return;
		}

		var layers = mapObj.getLayers();
		var layer = null,name = null,type = null;
		var html = "";
		for(var i = 0; i < layers.length;++i){
			layer = layers[i];
			if(layer == null){
				continue;
			}
			if(layer != null && layer instanceof GeoBeans.Layer.DBLayer
				&& layer.geomType == GeoBeans.Geometry.Type.POINT){
				name = layer.name;
				html += "<option value='" + name  + "'>" + name + "</option>";
			}

		}
		this.panel.find(".chart-layers-field").html(html);
	},

	addChart : function(){
		var name = this.panel.find(".chart-table-name").val();
		if(name == null){
			MapCloud.notify.showInfo("请输入专题图名称","Warning");
			return;
		}
		var layerName = this.panel.find(".chart-layers-field").val();
		if(layerName == null){
			MapCloud.notify.showInfo("请选择一个进行聚合的点图层","Warning");
			return;
		}
		var pointLayer = mapObj.getLayer(layerName);
		var symbolizer = this.getSymbolizer();
		var layer = new GeoBeans.Layer.ClusterLayer(name,pointLayer,symbolizer);

		mapObj.addLayer(layer,this.addLayer_callback);
	},

	addLayer_callback : function(result){
		if(result == "success"){
			mapObj.draw();
			var that = MapCloud.cluster_chart_panel;
			var name = that.panel.find(".chart-table-name").val();
			that.chartLayer = mapObj.getLayer(name);
		}else{
			MapCloud.notify.showInfo(result,"注册专题图");
		}
	},

	setLayer : function(layer){
		if(layer == null){
			return;
		}
		this.chartLayer = layer;

		var name = this.chartLayer.name;
		this.panel.find(".chart-table-name").val(name);
		var pointLayer = this.chartLayer.sourceLayer;
		if(pointLayer != null){
			var layerName = pointLayer.name;
			this.panel.find(".chart-layers-field option[value='" + layerName + "']")
				.attr("selected",true);
		}
	},

	changeChartOption : function(){
		var name = this.panel.find(".chart-table-name").val();
		if(name == null){
			MapCloud.notify.showInfo("请输入专题图名称","Warning");
			return;
		}
		var layerName = this.panel.find(".chart-layers-field").val();
		if(layerName == null){
			MapCloud.notify.showInfo("请选择一个进行聚合的点图层","Warning");
			return;
		}
		if(this.chartLayer == null){
			return;
		}

		this.chartLayer.setName(name);
		var pointLayer = mapObj.getLayer(layerName);
		this.chartLayer.setLayer(pointLayer);
		var symbolizer = this.getSymbolizer();
		this.chartLayer.setSymbolizer(symbolizer);
		mapObj.draw();
	},

	getSymbolizer : function(){
		var symbolizer = new GeoBeans.Symbolizer.PolygonSymbolizer();
		var colorDiv = this.panel.find(".form-group-color .colorSelector div");
		var opacity = colorDiv.css("opacity");
		var colorRgb = colorDiv.css("background-color");
		var color = new GeoBeans.Color();
		color.setByRgb(colorRgb,opacity);
		symbolizer.fill.color = color;

		var borderDiv = this.panel.find(".form-group-border .colorSelector div");
		var borderOpacity = borderDiv.css("opacity");
		var borderColorRgb = borderDiv.css("background-color");
		var color = new GeoBeans.Color();
		color.setByRgb(borderColorRgb,borderOpacity);
		symbolizer.stroke.color = color;
		return symbolizer;
	},
});