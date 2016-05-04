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
						that.onPolygon();
						break;
					}
					case 3:{
						that.onLine();
						break;
					}
					case 4:{
						break;
					}
					case 5:{
						break;
					}
					case 6:{
						that.onFeatureInfo();
						break;
					}
					case 7:{
						that.endQuery();
						break;
					}
					case 8:{
						that.onMapGlobe();
						break;
					}
					case 9:{
						break;
					}
					case 10:{
						break;
					}
					case 11:{
						that.onZoomIn();
						break;
					}
					case 12:{
						that.onZoomOut();
						break;
					}
					case 12 :{
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

	// 多边形查询
	onPolygon : function(){
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
		this.panel.find(".mc-icon-polygon").addClass("active");
		mapObj.queryByPolygon(layerName,this.queryByPolygon_callback);
	},

	queryByPolygon_callback : function(layer,count){
		var bar = MapCloud.mapBar;
		MapCloud.dataGrid.setQuery(layer,count,bar.queryByPolygon_function);
		MapCloud.dataGrid.setOutput(bar.queryByPolygonOutput_function);
	},

	queryByPolygon_function : function(maxFeatures,offset){
		var features = mapObj.queryByPolygonPage(maxFeatures,offset);
		return features;
	},

	queryByPolygonOutput_function : function(){
		var url = mapObj.queryByPolygonOutput(null,null);
		return url;
	},


	// 线查询
	onLine : function(){
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
		this.panel.find(".mc-icon-polygon").addClass("active");
		mapObj.queryByLine(layerName,this.queryByLine_callback);
	},

	queryByLine_callback : function(layer,count){
		var bar = MapCloud.mapBar;
		MapCloud.dataGrid.setQuery(layer,count,bar.queryByLine_function);
		MapCloud.dataGrid.setOutput(bar.queryByLineOutput_function);
	},

	queryByLine_function : function(maxFeatures,offset){
		var features = mapObj.queryByLinePage(maxFeatures,offset);
		return features;
	},

	queryByLineOutput_function : function(){
		var url = mapObj.queryByLineOutput(null,null);
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
		var html = "<div style='width:220px;max-height:280px;overflow-x:hidden'>"
				+ "<table class='table table-striped' >"
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
		html += "</div>";

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
		mapObj.endZoom();
	},

	// 全图显示
	onMapGlobe : function(){
		if(mapObj == null){
				MapCloud.notify.showInfo("当前地图为空","Warning");
				return;
			}
		mapManager.zoomToGlobeMap(mapObj,this.zoomToGlobeMap_callback);
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
			this.panel.css("width","422px");
		}
	},

	// 回到初始状态
	returnEndQuery : function(){
		this.endQuery();
		this.panel.find(".mc-icon").removeClass("active");
		this.panel.find(".mc-icon-mouse").addClass("active");
	},

	// 放大到全图
	zoomToGlobeMap_callback : function(result){
		MapCloud.notify.showInfo(result,"全图显示");
		// mapObj.draw();
		MapCloud.refresh_panel.refreshPanel();
	},

	// 放大
	onZoomIn : function(){
		if(mapObj == null){
			return;
		}
		mapObj.zoomIn();
	},
	// 缩小
	onZoomOut : function(){
		mapObj.zoomOut();
	}

});