MapCloud.BaseLayerPanel = MapCloud.Class(MapCloud.Panel,{
	
	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		
		this.registerEvent();

	},

	registerEvent : function(){
		var that = this;
		this.panel.find(".base-layer-icon").click(function(){
			if($(this).hasClass("vector-base")){
				// 切换至矢量地图
				that.showBaseLayer("vector");
				that.panel.find(".base-layer-icon").removeClass("active");
				that.panel.find(".image-base").addClass("active");
			}else if($(this).hasClass("image-base")){
				// 切换至影像地图
				that.showBaseLayer("image");
				that.panel.find(".base-layer-icon").removeClass("active");
				that.panel.find(".vector-base").addClass("active");
			}
		});
	},

	showBaseLayer : function(flag){
		if(mapObj == null){
			return;
		}
		var baseLayer = mapObj.baseLayer;
		var center = null,level = null;
		center = mapObj.center;
		if(center == null){
			center = new GeoBeans.Geometry.Point(0,0);	
		}
		level = mapObj.level;
		if(level == null){
			level = 2;
		}
		mapObj.removeBaseLayer();

		var layer = null;
		if(flag == "vector"){
			layer = new GeoBeans.Layer.QSLayer("base","/QuadServer/maprequest?services=world_vector");
		}else if(flag == "image"){
			layer = new GeoBeans.Layer.QSLayer("base","/QuadServer/maprequest?services=world_image");
		}

		if(layer == null){
			return;
		}
		mapObj.setBaseLayer(layer);
		mapObj.setCenter(center);
		mapObj.setLevel(level);	
		mapObj.draw();

	},

});