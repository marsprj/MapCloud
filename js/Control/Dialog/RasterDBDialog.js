MapCloud.RasterDBDialog = MapCloud.Class(MapCloud.Dialog,{
	
	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		this.registerPanelEvent();
	},

	registerPanelEvent : function(){

		this.panel.find(".db-list").change(function(){
			var value = $(this).val();
			alert(value);
		});
	},

	showDialog : function(){
		MapCloud.notify.loading();
		this.cleanup();
		this.panel.modal();

		dbsManager.getDataSources(this.getDataSources_callback);
	},

	cleanup : function(){
		this.panel.find(".db-list").html("");
	},

	getDataSources_callback : function(dataSources){
		MapCloud.notify.hideLoading();
		var dialog = MapCloud.raster_db_dialog;
		dialog.showDataSources(dataSources);
	},

	// 数据库列表
	showDataSources : function(dataSources){
		if(dataSources == null){
			return;
		}
		var dataSource = null;
		var name = null;
		var html = "";
		for(var i = 0; i < dataSources.length; ++i){
			dataSource = dataSources[i];
			if(dataSource == null){
				continue;
			}
			name = dataSource.name;
			html += "<option value='" + name + "'>" + name + "</option>";
		}
		this.panel.find(".db-list").html(html);

		var currentDB = this.panel.find(".db-list").val();
		if(currentDB != null && currentDB != ""){
			this.getList(currentDB,"/");
		}
	},

	getList : function(sourceName,path){
		if(sourceName == null || path == null){
			return;
		}
	}

});