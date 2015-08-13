MapCloud.NewRasterDBLayerDialog = MapCloud.Class(MapCloud.Dialog,{
	


	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		
		this.registerPanelEvent();
	},


	registerPanelEvent : function(){
		var dialog = this;

		// 选择影像
		this.panel.find(".btn-choose-raster").click(function(){
			MapCloud.raster_db_dialog.showDialog("newLayer",false);
		}),

		// 确定
		this.panel.find(".btn-confirm").click(function(){
			if(mapObj == null){
				MapCloud.notify.showInfo("当前地图为空","Warning");
				return;
			}
			var name = dialog.panel.find(".new-layer-name").val();
			if(name == null || name == ""){
				MapCloud.notify.showInfo("请输入名称","Warning");
				return;
			}

			if(dialog.sourceName == null || dialog.rasterName == null || dialog.rasterPath == null){
				MapCloud.notify.showInfo("请选择影像","Warning");
					return;
			}
			var layer = new GeoBeans.Layer.RasterDBLayer(name,null,dialog.sourceName,
				dialog.rasterName,null,dialog.rasterPath);
			MapCloud.notify.loading();
			mapObj.addLayer(layer,dialog.addLayer_callback);
		});
	},

	// 输入影像
	setRaster : function(sourceName,rasterName,rasterPath){
		this.sourceName = sourceName;
		this.rasterName = rasterName;
		this.rasterPath = rasterPath;

		this.panel.find(".source-name").val(this.sourceName);
		this.panel.find(".raster-name").val(this.rasterName);
		this.panel.find(".raster-path").val(this.rasterPath);
	},

	// 注册图层回调函数
	addLayer_callback : function(result){
		var dialog = MapCloud.new_raster_dblayer_dialog;
		var name = dialog.panel.find(".new-layer-name").val();
		var info = "注册图层 [ " + name + " ]";
		MapCloud.notify.showInfo(result,info);
		if(result.toLowerCase() == "success"){
			MapCloud.refresh_panel.refreshPanel();
			mapObj.draw();
		}
		dialog.closeDialog();
	},

 
});