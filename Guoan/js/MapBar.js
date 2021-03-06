MapCloud.MapBar = MapCloud.Class(MapCloud.Panel,{
	layerName : "country",

	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		this.registerEvent();
	},

	registerEvent : function(){
		var that = this;
		this.panel.find(".mc-icon").each(function(index,element){
			$(this).click(function(){
				switch(index){
					case 0:{
						that.onFeatureInfo();
						break;
					}
					case 1:{
						that.endQuery();
						break;
					}
					case 2:{
						that.onMapGlobe();
						break;
					}
					// case 0:{
					// 	that.onStretch(this);
					// 	break;
					// }
					//area
					// case 1:{
					// 	that.onArea();
					// 	break;
					// }
					// case 2:{
					// 	that.onPolygon();
					// 	break;
					// }
					// case 3:{
					// 	that.onLine();
					// 	break;
					// }
					// case 4:{
					// 	break;
					// }
					// case 5:{
					// 	break;
					// }
					// case 6:{
					// 	that.onFeatureInfo();
					// 	break;
					// }
					// case 7:{
					// 	that.endQuery();
					// 	break;
					// }
					// case 8:{
					// 	that.onMapGlobe();
					// 	break;
					// }
					default:
						break;
				}
			});
		});

		// 当前图层选择
		this.panel.find(".current-layer").click(function(){
			var listPanel = MapCloud.mapLayersPanel;
			if(listPanel.panel.css("display") == "none"){
				listPanel.show();
			}else{
				listPanel.hide();
			}
		});

		// 查询工具列表
		this.panel.find(".layer-query-tool").click(function(){
			var queryPanel = that.panel.find(".query-tools");
			if(queryPanel.css("display") == "none"){
				queryPanel.slideDown();
			}else{
				queryPanel.slideUp();
			}
		});
		// 查询工具选择
		this.panel.find(".query-tools li").each(function(index,element){
			$(this).click(function(){
				// 是否有选定图层
				if(MapCloud.currentLayer == null){
					MapCloud.notify.showInfo("请在图层列表中选择一个图层","Warning");
					return;
				}
				switch(index){
					case 0:{
						that.onArea();
						break;
					}
					case 1:{
						that.onPolygon();
						break;
					}
					case 2:{
						that.onLine();
						break;
					}
					default:
						break;
				}
				var html = $(this).html();
				// var span = $(this).find("span").html();
				that.panel.find(".layer-query-tool").html(html);
				that.panel.find(".query-tools").slideUp();
			});
		});
	},

	onStretch : function(){
		var i = this.panel.find("a.btn i");
		if(i.hasClass("fa-angle-double-left")){
			// 缩进去
			i.removeClass("fa-angle-double-left");
			i.addClass("fa-angle-double-right");
			this.panel.children().not(".control-icon").css("display","none");
			this.panel.animate({"width":"30px"},300);
		}else if(i.hasClass("fa-angle-double-right")){
			i.removeClass("fa-angle-double-right");
			i.addClass("fa-angle-double-left");
			this.panel.animate({"width":"392px"},300);
			this.panel.children().not(".control-icon").css("display","block");
		}
	},

	// 拉框查询
	onArea : function(){
		if(mapObj == null){
			return;
		}
		if(MapCloud.currentLayer == null){
			MapCloud.notify.showInfo("请在图层列表中选择一个图层","Warning");
			return;
		}
		var layer = mapObj.getLayer(MapCloud.currentLayer);
		if(layer == null){
			return;
		}

		this.panel.find(".mc-icon").removeClass("active");
		this.panel.find(".mc-icon-area").addClass("active");
		mapObj.queryByRect(MapCloud.currentLayer,this.query_callback);
	},

	query_callback : function(layer,count){
		if(layer == null && count == null){
			return;
		}
		count = parseInt(count);
		if(!$.isNumeric(count)){
			return;
		}
		MapCloud.queryResultPanel.showPanel();
		MapCloud.queryResultPanel.setQuery(layer,count,MapCloud.mapBar.query_function);
		MapCloud.queryResultPanel.setOutput(MapCloud.mapBar.output_function);
		MapCloud.mapBar.cancelQueryTool();
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
		if(mapObj == null){
			return;
		}
		if(MapCloud.currentLayer == null){
			MapCloud.notify.showInfo("请在图层列表中选择一个图层","Warning");
			return;
		}
		var layer = mapObj.getLayer(MapCloud.currentLayer);
		if(layer == null){
			return;
		}
		this.panel.find(".mc-icon").removeClass("active");
		this.panel.find(".mc-icon-polygon").addClass("active");
		mapObj.queryByPolygon(MapCloud.currentLayer,this.queryByPolygon_callback);
	},

	queryByPolygon_callback : function(layer,count){
		var bar = MapCloud.mapBar;
		MapCloud.queryResultPanel.setQuery(layer,count,MapCloud.mapBar.queryByPolygon_function);
		MapCloud.queryResultPanel.setOutput(MapCloud.mapBar.queryByPolygonOutput_function);
		bar.cancelQueryTool();
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
		if(mapObj == null){
			return;
		}
		if(MapCloud.currentLayer == null){
			MapCloud.notify.showInfo("请在图层列表中选择一个图层","Warning");
			return;
		}
		var layer = mapObj.getLayer(MapCloud.currentLayer);
		if(layer == null){
			return;
		}
		this.panel.find(".mc-icon").removeClass("active");
		this.panel.find(".mc-icon-polygon").addClass("active");
		mapObj.queryByLine(MapCloud.currentLayer,this.queryByLine_callback);
	},

	queryByLine_callback : function(layer,count){
		var bar = MapCloud.mapBar;
		MapCloud.queryResultPanel.setQuery(layer,count,bar.queryByLine_function);
		MapCloud.queryResultPanel.setOutput(bar.queryByLineOutput_function);
		bar.cancelQueryTool();
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
		if(mapObj == null){
			return;
		}
		if(MapCloud.currentLayer == null){
			MapCloud.notify.showInfo("请在图层列表中选择一个图层","Warning");
			return;
		}
		var layer = mapObj.getLayer(MapCloud.currentLayer);
		if(layer == null){
			return;
		}
		
		this.panel.find(".mc-icon").removeClass("active");
		this.panel.find(".mc-icon-info").addClass("active");
		mapObj.queryByClick(MapCloud.currentLayer,this.onFeatureInfo_callback);
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
		var html = "<div style='width:220px;max-height:280px'>"
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
		MapCloud.queryResultPanel.cleanup();
	},


	// 全图显示
	onMapGlobe : function(){
		if(mapObj == null){
			MapCloud.notify.showInfo("当前地图为空","Warning");
			return;
		}
		mapManager.zoomToGlobeMap(mapObj,this.zoomToGlobeMap_callback);
	},	
	zoomToGlobeMap_callback : function(result){

	},

	// 设置当前图层
	setCurrentLayer : function(dataSetName,layerName){
		if(dataSetName == null || layerName == null){
			this.panel.find(".current-layer").html("当前图层: 空");
			MapCloud.currentLayer = null;
		}else{
			this.panel.find(".current-layer").html("当前图层: "+ dataSetName);
			if(MapCloud.searchPanel != null){
				MapCloud.searchPanel.setOverlayLayer(dataSetName,layerName);
			}
			
			MapCloud.currentLayer = layerName;
		}
	},

	cancelQueryTool : function(){
		var html = '<div class="query-label">查询工具</div>';
		this.panel.find(".layer-query-tool").html(html);
	},
});