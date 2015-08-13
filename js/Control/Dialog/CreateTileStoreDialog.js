MapCloud.CreateTileStoreDialog = MapCloud.Class(MapCloud.Dialog,{

	// 打开来源
	source 		: null,

	// 数据库
	sourceName  : null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		this.registerPanelEvent();
	},

	registerPanelEvent : function(){
		var dialog = this;
		this.panel.find(".btn-confirm").click(function(){
			var name = dialog.panel.find(".tile-store-name").val();
			if(name == null || name == ""){
				MapCloud.notify.showInfo("请输入瓦片库的名称","Warning");
				return;
			}
			var type = dialog.panel.find(".tile-store-type").val();
			if(type == null || type == ""){
				MapCloud.notify.showInfo("请选择切图方式","Warning");
				return;
			}
			if(dialog.sourceName == null){
				MapCloud.notify.showInfo("当前数据库为空","Warning");
				return;
			}
			var sourceName = dialog.sourceName;
			dialog.createTileStore(sourceName,name,type);
			
		});
	},	

	showDialog : function(source,sourceName){
		MapCloud.Dialog.prototype.showDialog.apply(this,arguments);
		this.source = source;
		this.sourceName = sourceName;

	},

	createTileStore : function(sourceName,storeName,type){
		MapCloud.notify.loading();
		dbsManager.createTileStore(sourceName,storeName,type,this.createTileStore_callback);
	},

	createTileStore_callback : function(result){
		MapCloud.notify.showInfo(result,"新建瓦片库");
		var dialog = MapCloud.create_tile_store_dialog;
		dialog.closeDialog();
		var tileStoreName = dialog.panel.find(".tile-store-name").val();
		var parentDialog = null;
		if(dialog.source == "tileDB"){
			parentDialog = MapCloud.tile_db_dialog;
			var sourceName = dialog.sourceName;
			parentDialog.getTileStores(sourceName);
		}else if(dialog.source == "cutMap"){
			parentDialog = MapCloud.cut_map_dialog;
			var sourceName = dialog.sourceName;
			parentDialog.getTileStores(sourceName);
			parentDialog.setCreateStoreName(tileStoreName);
		}
	},

});