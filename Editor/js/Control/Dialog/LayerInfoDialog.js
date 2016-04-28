MapCloud.LayerInfoDialog = MapCloud.Class(MapCloud.Dialog,{
	// // 当前图层
	// layer : null,


	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		this.registerPanelEvent();
	},

	registerPanelEvent : function(){

	},

	cleanup : function(){
		this.panel.find(".modal-body").empty();
	},

	showDialog : function(layerName){
		MapCloud.Dialog.prototype.showDialog.apply(this,arguments);
		if(mapObj == null){
			return;
		}

		var layer = mapObj.getLayer(layerName);
		this.getLayerInfo(layer);
	},

	getLayerInfo : function(layer){
		if(layer instanceof GeoBeans.Layer.DBLayer){
			mapObj.describeLayer(layer.name,this.describeLayer_callback);
		}else if(layer instanceof GeoBeans.Layer.ChartLayer){
			this.showChartLayer(layer);
		}else{
			this.showLayer(layer);
		}
	},

	describeLayer_callback : function(layerInfo){
		
		var dialog = MapCloud.layer_info_dialog;
		dialog.showDBLayerInfo(layerInfo);
		
	},

	// showLayerInfo : function(layer){
	// 	if(layer == null){
	// 		return;
	// 	}
	// 	var html = '<table class="table table-hover table-bordered">'
	// 		+ '<tbody>'
	// 		+ '	<tr>'
	// 		+ '		<td>名称</td>'
	// 		+ '		<td>' + layer.name  + '</td>'
	// 		+ '	</tr>';
	// 	if(layer instanceof GeoBeans.Layer.DBLayer){
	// 		var type = layer.type;
	// 		html += '	<tr>'
	// 			+ '		<td>类型</td>'
	// 			+ '		<td>' + layer.type  + '</td>'
	// 			+ '	</tr>';
	// 		if(layer.srid != null){
	// 			html += '	<tr>'
	// 			+ '		<td>空间参考</td>'
	// 			+ '		<td>' + layer.srid  + '</td>'
	// 			+ '	</tr>';
	// 		}
	// 		if(layer.extent != null){
	// 			html += '	<tr>'
	// 			+ '		<td>范围</td>'
	// 			+ '		<td>' + layer.extent  + '</td>'
	// 			+ '	</tr>';

	// 			html += '	<tr>'
	// 			+ '		<td>范围</td>'
	// 			+ '		<td>东 :' + layer.extent.xmax + "</td>"
	// 			+ '	</tr>'
	// 			+ '		<td></td>'
	// 			+ '		<td>南 :' + layer.extent.ymin + "</td>"
	// 			+ '	</tr>'
	// 			+ '		<td></td>'
	// 			+ '		<td>西 :' + layer.extent.xmin + "</td>"
	// 			+ '	</tr>'
	// 			+ '		<td></td>'
	// 			+ '		<td>北 :' + layer.extent.ymax + "</td>"
	// 			+ '	</tr>';
	// 		}
	// 	}else if(layer instanceof GeoBeans.Layer.ChartLayer){
	// 		var type = layer.type;
	// 		var layerType = null;
	// 		switch(type){
	// 			case GeoBeans.Layer.ChartLayer.Type.RANGE:{
	// 				layerType = "分级图";
	// 				break;
	// 			}
	// 			case GeoBeans.Layer.ChartLayer.Type.BAR:{
	// 				layerType = "柱状图";
	// 				break;
	// 			}
	// 			case GeoBeans.Layer.ChartLayer.Type.PIE:{
	// 				layerType = "饼状图";
	// 				break;
	// 			}
	// 			case GeoBeans.Layer.ChartLayer.Type.AQI:{
	// 				layerType = "空气质量时刻图";
	// 				break;
	// 			}
	// 			case GeoBeans.Layer.ChartLayer.Type.AQITIMELINE:{
	// 				layerType = "空气质量序列图";
	// 				break;
	// 			}
	// 			default:
	// 				break;
	// 		}
	// 		if(layerType != null ){
	// 			html += '	<tr>'
	// 			+ '		<td>类型</td>'
	// 			+ '		<td>' + layerType  + '</td>'
	// 			+ '	</tr>';
	// 		}
	// 		if(type == GeoBeans.Layer.ChartLayer.Type.AQI || 
	// 			type == GeoBeans.Layer.ChartLayer.Type.AQITIMELINE){
	// 			html += '	<tr>'
	// 			+ '		<td>字段</td>'
	// 			+ '		<td>' + layer.chartField  + '</td>'
	// 			+ '	</tr>';
	// 		}
	// 	}
	// 	html += "</tbody></table>";
	// 	this.panel.find(".modal-body").html(html);

		
	// },

	showChartLayer : function(layer){
		if(layer == null){
			return;
		}
		var type = layer.type;
		var layerType = null;
		switch(type){
			case GeoBeans.Layer.ChartLayer.Type.RANGE:{
				layerType = "分级图";
				break;
			}
			case GeoBeans.Layer.ChartLayer.Type.BAR:{
				layerType = "柱状图";
				break;
			}
			case GeoBeans.Layer.ChartLayer.Type.PIE:{
				layerType = "饼状图";
				break;
			}
			case GeoBeans.Layer.ChartLayer.Type.AQI:{
				layerType = "空气质量时刻图";
				break;
			}
			case GeoBeans.Layer.ChartLayer.Type.AQITIMELINE:{
				layerType = "空气质量序列图";
				break;
			}
			default:
				break;
		}


		 var html = '<table class="table table-hover table-bordered">'
			+ '<tbody>'
			+ '	<tr>'
			+ '		<td>名称</td>'
			+ '		<td>' + layer.name  + '</td>'
			+ '	</tr>';
		if(layerType != null ){
			html += '	<tr>'
			+ '		<td>类型</td>'
			+ '		<td>' + layerType  + '</td>'
			+ '	</tr>';
		}
		if(type == GeoBeans.Layer.ChartLayer.Type.AQI || 
			type == GeoBeans.Layer.ChartLayer.Type.AQITIMELINE){
			html += '	<tr>'
			+ '		<td>字段</td>'
			+ '		<td>' + layer.chartField  + '</td>'
			+ '	</tr>';
		}
		this.panel.find(".modal-body").html(html);
	},

	showDBLayerInfo : function(layerInfo){
		if(layerInfo == null){
			return;
		}
		var type = layerInfo.type;
		if(type == null){
			return;
		}
		type = type.toLowerCase();
		if(type == "raster"){
			this.showRasterDBLayer(layerInfo);
		}else if(type == "feature"){
			this.showFeatureDBLayer(layerInfo);
		}
	},

	// Feature DB Layer
	showFeatureDBLayer : function(layerInfo){
		var html = '<table class="table table-hover table-bordered">'
			+ '<tbody>'
			+ '	<tr>'
			+ '		<td>名称</td>'
			+ '		<td>' + layerInfo.name  + '</td>'
			+ '	</tr>'
			+ '	<tr>'
			+ '		<td>类型</td>'
			+ '		<td>' + layerInfo.type +'</td>'
			+ '	</tr>'
			+ '	<tr>'
			+ '		<td>数据名称</td>'
			+ '		<td>' + layerInfo.featureName + '</td>'
			+ '	</tr>'
			+ '	<tr>'
			+ '		<td>几何类型</td>'
			+ '		<td>' + layerInfo.geomType + '</td>'
			+ '	</tr>'
			+ '	<tr>'
			+ '		<td>要素个数</td>'
			+ '		<td>' + layerInfo.count + '</td>'
			+ '	</tr>'
			+ '	<tr>'
			+ '		<td>范围</td>'
			+ '		<td>东 :' + layerInfo.extent.xmax + "</td>"
			+ '	</tr>'
			+ '	<tr>'
			+ '		<td></td>'
			+ '		<td>西 :' + layerInfo.extent.xmin + "</td>"
			+ '	</tr>'
			+ '	<tr>'
			+ '		<td></td>'
			+ '		<td>南 :' + layerInfo.extent.ymin + "</td>"
			+ '	</tr>'
			+ '	<tr>'
			+ '		<td></td>'
			+ '		<td>北 :' + layerInfo.extent.ymax + "</td>"
			+ '	</tr>'			
			+ '</tbody>'
			+ '</table>';
		this.panel.find(".modal-body").html(html);
	},

	// Raster DB Layer
	showRasterDBLayer : function(layerInfo){
		var html = '<table class="table table-hover table-bordered">'
			+ '<tbody>'
			+ '	<tr>'
			+ '		<td>名称</td>'
			+ '		<td>' + layerInfo.name  + '</td>'
			+ '	</tr>'
			+ '	<tr>'
			+ '		<td>类型</td>'
			+ '		<td>' + layerInfo.type +'</td>'
			+ '	</tr>'
			+ '	<tr>'
			+ '		<td>数据名称</td>'
			+ '		<td>' + layerInfo.rasterName + '</td>'
			+ '	</tr>'
			+ '	<tr>'
			+ '		<td>波段个数</td>'
			+ '		<td>' + layerInfo.bands + '</td>'
			+ '	</tr>'
			+ '	<tr>'
			+ '		<td>格式</td>'
			+ '		<td>' + layerInfo.format + '</td>'
			+ '	</tr>'			
			+ '	<tr>'
			+ '		<td>像素类型</td>'
			+ '		<td>' + layerInfo.pixelType + '</td>'
			+ '	</tr>'
			+ '	<tr>'
			+ '		<td>像素宽度</td>'
			+ '		<td>' + layerInfo.pixelSize + '</td>'
			+ '	</tr>'	
			+ '	<tr>'
			+ '		<td>X分辨率</td>'
			+ '		<td>' + layerInfo.resolutionX + '</td>'
			+ '	</tr>'	
			+ '	<tr>'
			+ '		<td>Y分辨率</td>'
			+ '		<td>' + layerInfo.resolutionY + '</td>'
			+ '	</tr>'
			+ '	<tr>'
			+ '		<td>宽度</td>'
			+ '		<td>' + layerInfo.width + '</td>'
			+ '	</tr>'				
			+ '	<tr>'
			+ '		<td>高度</td>'
			+ '		<td>' + layerInfo.height + '</td>'
			+ '	</tr>'				
			+ '	<tr>'
			+ '		<td>范围</td>'
			+ '		<td>东 :' + layerInfo.extent.xmax + "</td>"
			+ '	</tr>'
			+ '	<tr>'
			+ '		<td></td>'
			+ '		<td>西 :' + layerInfo.extent.xmin + "</td>"
			+ '	</tr>'
			+ '	<tr>'
			+ '		<td></td>'
			+ '		<td>南 :' + layerInfo.extent.ymin + "</td>"
			+ '	</tr>'
			+ '	<tr>'
			+ '		<td></td>'
			+ '		<td>北 :' + layerInfo.extent.ymax + "</td>"
			+ '	</tr>'			
			+ '</tbody>'
			+ '</table>';
		this.panel.find(".modal-body").html(html);
	},


	showLayer : function(layer){


		var layerType = "";
		if(layer instanceof GeoBeans.Layer.RippleLayer){
			layerType = "波纹图";
		}else if(layer instanceof GeoBeans.Layer.AirLineLayer){
			layerType = "航线图";
		}else if(layer instanceof GeoBeans.Layer.ClusterLayer){
			layerType = "聚合图";
		}		
		var html = '<table class="table table-hover table-bordered">'
			+ '<tbody>'
			+ '	<tr>'
			+ '		<td>名称</td>'
			+ '		<td>' + layer.name  + '</td>'
			+ '	</tr>';
		if(layerType != null ){
			html += '	<tr>'
			+ '		<td>类型</td>'
			+ '		<td>' + layerType  + '</td>'
			+ '	</tr>';
		}
		this.panel.find(".modal-body").html(html);
	}

});