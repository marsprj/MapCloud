MapCloud.BaseLayerDialog = MapCloud.Class(MapCloud.Dialog,{
	
	map : null,


	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		this.panel.find(".list-group-item").click(function(){
			// if($(this).hasClass('active')){
			// 	return;
			// }
			// dialog.panel.find(".list-group-item").removeClass('active');
			var type = $(this).attr("btype");
			// $(this).addClass("active");
			dialog.showMap(type);
		});

		this.panel.find(".btn-confirm").click(function(){
			if(mapObj == null){
				MapCloud.notify.showInfo("当前地图为空","Warning");
				return;
			}
			var type = dialog.panel.find(".list-group-item.active").attr("btype");
			var layer = null;
			if(type == "image"){
				layer = new GeoBeans.Layer.QSLayer("base","/QuadServer/maprequest?services=world_image");
			}else if(type == "vector"){
				layer = new GeoBeans.Layer.QSLayer("base","/QuadServer/maprequest?services=world_vector");
			}
			if(layer == null){
				return;
			}
			// mapObj.setBaseLayer(layer);

			// var viewer = mapObj.viewer;
			// var level = null;
			// if(mapObj.level != null){
			// 	level = mapObj.level;
			// }else{
			// 	level = mapObj.getLevel(viewer);
			// 	if(level == null){
			// 		level = 2;
			// 	}
			// }

			// var center = mapObj.center;
			// if(center == null){
			// 	center = new GeoBeans.Geometry.Point(0,0);	
			// }
			// // var level = 2;
			// mapObj.setCenter(center);
			// mapObj.setLevel(level);	
			// mapObj.draw();
			layer.MAX_ZOOM_LEVEL = 18;
			MapCloud.notify.loading();
			mapObj.insertLayer(layer,dialog.insertLayer_callback);
			dialog.closeDialog();
		});
	},

	insertLayer_callback : function(result){
		var dialog = MapCloud.base_layer_dialog;
		var type = dialog.panel.find(".list-group-item.active").attr("btype");
		var layerType = "";
		if(type == "image"){
			layerType = "影像";
		}else if(type == "vector"){
			layerType = "矢量";
		}
		var name = dialog.panel.find("#new_layer_name").val();
		var info = "注册" + layerType +　"底图 ";
		MapCloud.notify.showInfo(result,info);
		if(result.toLowerCase() == "success"){
			MapCloud.refresh_panel.refreshPanel();
		}
		mapObj.draw();
	},

	showDialog : function(type){
		MapCloud.Dialog.prototype.showDialog.apply(this, arguments);
		this.showMap(type);
	},

	cleanup : function(){
		this.panel.find("#base_layer_canvas_wrapper").empty();
		if(this.map != null){
			this.map.close();
			this.map = null;
		}
	},

	// 根据类型展示底图
	showMap : function(type){
		if(type == null){
			return;
		}
		this.panel.find(".list-group-item").removeClass('active');
		this.panel.find(".list-group-item[btype='" + type  + "']").addClass("active");

		var center = new GeoBeans.Geometry.Point(0,0);	
		var level = 2;

		if(this.map == null){
			// var extent = new GeoBeans.Envelope(-180,-90,180,90);
			// this.map = new GeoBeans.Map(user.server,"base_layer_canvas_wrapper","tmp",extent,4326,extent);
			var extent = new GeoBeans.Envelope(-180,-90,180,90);
			this.map = new GeoBeans.Map(null,"base_layer_canvas_wrapper","name",extent,4326);
		}else{
			this.map.removeBaseLayer();
			this.map.draw();
			center = this.map.center;
			level = this.map.level;
		}

		var layer = null;

		if(type == "image"){
			layer = new GeoBeans.Layer.QSLayer("base","/QuadServer/maprequest?services=world_image");
		}else if(type == "vector"){
			layer = new GeoBeans.Layer.QSLayer("base","/QuadServer/maprequest?services=world_vector");
		}
		this.map.setBaseLayer(layer);
		
		this.map.setCenter(center);
		this.map.setLevel(level);	
		this.map.draw();			
	}

});