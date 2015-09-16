// 地图上的工具栏
MapCloud.MapBar = MapCloud.Class({
	panel : null,

	initialize : function(){
		this.panel = $("#map_bar_wrapper");
		this.registerBarEvents();
	},

	// 注册点击事件
	registerBarEvents : function(){

		this.panel.find("[data-toggle='tooltip']").tooltip({container:'body'});
		var that = this;
		this.panel.find(".mc-icon").each(function(index,element){
			$(this).click(function(){
				switch(index){
					case 0:{
						that.onStretch(this);
						break;
					}
					//area
					case 1:{
						that.onArea();
						break;
					}
					case 2:{
						break;
					}
					case 3:{
						break;
					}
					case 4:{
						that.onFeatureInfo();
						break;
					}
					case 5:{
						that.endQuery();
						break;
					}
					case 6:{
						that.onMapGlobe();
						break;
					}
					case 7:{
						break;
					}
					case 8:{
						break;
					}
					case 9:{
						break;
					}
					case 10 :{
						break;
					}
					
					default:
						break;
				}
			});
		});
	},

	//拉框查询
	onArea : function(){
		var layerName = $("#layers_row .layer_row_selected")
			.attr("lname");
		if(layerName == null || layerName == ""){
			MapCloud.notify.showInfo("请选择图层","Warning");
			return;
		}
		var layer = mapObj.getLayer(layerName);
		if(layer == null || layer.type != GeoBeans.Layer.DBLayer.Type.Feature){
			MapCloud.notify.showInfo("请选择一个矢量图层","Warning");
			return;
		}
		
		this.panel.find(".mc-icon").removeClass("active");
		this.panel.find(".mc-icon-area").addClass("active");
		mapObj.queryByRect(layerName,this.query_callback);
	},

	query_callback : function(layer,count){
		// MapCloud.dataGrid.showPages(layer,count);
		var bar = MapCloud.mapBar;
		MapCloud.dataGrid.setQuery(layer,count,bar.query_function);
		MapCloud.dataGrid.setOutput(bar.output_function);
	},

	query_function : function(maxFeatures,offset){
		var features = mapObj.queryByRectPage(maxFeatures,offset);
		return features;
	},

	output_function : function(){
		var url = mapObj.queryByRectOutput(null,null);
		return url;
	},

	//信息查询
	onFeatureInfo : function(){
		var layerName = $("#layers_row .layer_row_selected")
			.attr("lname");
		if(layerName == null || layerName == ""){
			MapCloud.notify.showInfo("请选择图层","Warning");
			return;
		}
		var layer = mapObj.getLayer(layerName);
		if(layer == null || layer.type != GeoBeans.Layer.DBLayer.Type.Feature){
			MapCloud.notify.showInfo("请选择一个矢量图层","Warning");
			return;
		}
		
		this.panel.find(".mc-icon").removeClass("active");
		this.panel.find(".mc-icon-info").addClass("active");
		mapObj.queryByClick(layerName,this.onFeatureInfo_callback);
	},

	onFeatureInfo_callback : function(layer,feature,point){
		if(feature == null || layer == null){
			return;
		}
		var fields = layer.getFields();
		if(fields == null){
			return;
		}
		var values = feature.values;
		if(values == null){
			return;
		}
		var html = "<table class='table table-striped'>"
				+ 	"<thead>"
				+ 	"<tr>"
				+ 	"<th>Field</th>"
				+ 	"<th>Value</th>"
				+	"</tr>"
				+	"</thead>"
				+ 	"<tbody>";
		for(var i = 0; i < fields.length;++i){
			field = fields[i];
			if(field == null){
				continue;
			}
			type = field.type;
			if(type != "geometry"){
				name = field.name;
				value = values[i];
				html += "<tr>"
				+  "	<td>" + name + "</td>"
				+  "	<td>" + value + "</td>"
				+  "	</tr>"
			}
		}
		html += "</tbody>";
		html += "</table>";

		var options = {
			title : layer.name
		}
		var infoWindow = new GeoBeans.InfoWindow(html,options);
		mapObj.openInfoWindow(infoWindow,point);
	},

	endQuery : function(){
		if(mapObj == null){
			return;
		}
		this.panel.find(".mc-icon").removeClass("active");
		this.panel.find(".mc-icon-mouse").addClass("active");
		mapObj.endQuery();
		MapCloud.dataGrid.cleanup();
	},

	// 全图显示
	onMapGlobe : function(){
		if(mapObj == null){
				MapCloud.notify.showInfo("当前地图为空","Warning");
				return;
			}
			// 重新读取一遍范围
			var extent = null;
			var map = mapManager.getMap("mapCanvas_wrapper",mapObj.name);
			if(map == null){
				MapCloud.notify.showInfo("failed","全图显示失败");
			}else{
				extent = map.extent;
			}
			var layers = map.getLayers();
			for(var i = 0; i < layers.length; ++i){
				var layer = layers[i];
				if(layer != null){
					var name = layer.name;
					var layer_n = mapObj.getLayer(name);
					if(layer_n != null){
						layer.visible = layer_n.visible;
					}
				}
			}
			mapObj = map;
			if(extent == null){
				return;
			}
			mapObj.setViewer(extent);

			mapObj.draw(true);
			MapCloud.refresh_panel.refreshPanel();
			MapCloud.dataGrid.cleanup();
			mapObj.setViewer(extent);
			mapObj.setNavControl(false);
			mapObj.addEventListener(GeoBeans.Event.MOUSE_MOVE, MapCloud.tools.onMapMove);
	},

	onStretch : function(bar){
		var i = $(bar).find("a.btn i");
		if(i.hasClass("fa-angle-double-left")){
			// 缩进去
			i.removeClass("fa-angle-double-left");
			i.addClass("fa-angle-double-right");
			this.panel.children().not(".control-icon").css("display","none");
			this.panel.css("width","30px");
		}else if(i.hasClass("fa-angle-double-right")){
			i.removeClass("fa-angle-double-right");
			i.addClass("fa-angle-double-left");
			this.panel.children().not(".control-icon").css("display","block");
			this.panel.css("width","332px");
		}
	},

	// 回到初始状态
	returnEndQuery : function(){
		this.endQuery();
		this.panel.find(".mc-icon").removeClass("active");
		this.panel.find(".mc-icon-mouse").addClass("active");
	},

});