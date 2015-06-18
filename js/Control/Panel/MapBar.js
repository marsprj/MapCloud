// 地图上的工具栏
MapCloud.MapBar = MapCloud.Class({
	panel : null,

	initialize : function(){
		this.panel = $("#map_bar_wrapper");
		this.registerBarEvents();
	},

	// 注册点击事件
	registerBarEvents : function(){
		var that = this;
		this.panel.find(".mc-icon").each(function(index,element){
			$(this).click(function(){
				switch(index){
					//area
					case 0:{
						that.onArea();
						break;
					}
					case 1:{
						break;
					}
					case 2:{
						break;
					}
					case 3:{
						that.onFeatureInfo();
						break;
					}
					case 4:{
						that.endQuery();
						break;
					}
					case 5:{
						that.onMapGlobe();
						break;
					}
					case 6:{
						break;
					}
					case 7:{

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
			MapCloud.alert_info.showInfo("请选择图层","Warning");
			return;
		}
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
			MapCloud.alert_info.showInfo("请选择图层","Warning");
			return;
		}
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
		mapObj.endQuery();
		MapCloud.dataGrid.cleanup();
	},

	// 全图显示
	onMapGlobe : function(){
		if(mapObj == null){
			return;
		}
		var extent = mapObj.extent;
		if(extent == null){
			return;
		}
		mapObj.setViewer(extent);
	}
});