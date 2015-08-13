MapCloud.WMTSDialog = MapCloud.Class(MapCloud.Dialog,{
	
	// 数据源
	sourceName 	: null,

	// 图层
	layer 		: null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		this.registerPanelEvent();

	},

	registerPanelEvent : function(){
		var dialog = this;

		// 选择瓦片库
		dialog.panel.find(".btn-choose-tile").click(function(){
			MapCloud.tile_db_dialog.showDialog("wmtsLayer");
		});

		dialog.panel.find(".btn-confirm").click(function(){
			if(mapObj == null){
				MapCloud.notify.showInfo("当前地图为空","Warning");
				return;
			}
			var name = dialog.panel.find("#wmts_layer_name").val();
			if(name == null || name == ""){
				MapCloud.notify.showInfo("请输入图层名称","Warning");
				return;
			}
			if(dialog.sourceName == null || dialog.layer == null){
				MapCloud.notify.showInfo("请选择一个瓦片库","Warning");
				return;
			}
			dialog.layer.name = name;
			mapObj.addLayer(dialog.layer);
			mapObj.draw();
			MapCloud.refresh_panel.refreshPanel();
			
			dialog.closeDialog();
		});		
	},


	cleanup : function(){
		this.panel.find(".wmts-source-name").val("");
		this.panel.find(".wmts-tile-store").val("");
		this.panel.find("#wmts_layer_name").val("");

		this.sourceName = null;
		this.layer = null;
	},

	setWMTSLayer : function(sourceName,layer){
		this.sourceName = sourceName;
		this.layer = layer;

		this.panel.find(".wmts-source-name").val(sourceName);
		if(this.layer != null){
			this.panel.find(".wmts-tile-store").val(this.layer.name);
		}
	},
});