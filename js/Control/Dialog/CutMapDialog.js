MapCloud.CutMapDialog = MapCloud.Class(MapCloud.Dialog,{
	
	// 新建的瓦片库名称
	createTileStoreName : null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		
		var dialog = this;

		dialog.registerPanelDialog();
	},

	registerPanelDialog : function(){
		var dialog = this;

		// 切换数据库
		this.panel.find(".db-list").change(function(){
			dialog.createTileStoreName = null;
			var name = $(this).val();
			dialog.getTileStores(name);
		});

		// 新建瓦片库
		this.panel.find(".btn-create-tile-store").click(function(){
			dialog.createTileStoreName = null; 
			var sourceName = dialog.panel.find(".db-list").val();
			MapCloud.create_tile_store_dialog.showDialog("cutMap",sourceName);
		});		

		// 切图
		this.panel.find(".btn-build-pyramid").click(function(){
			if(mapObj == null){
				MapCloud.notify.showInfo("当前地图为空","Warning");
				return;
			}
			var sourceName = dialog.panel.find(".db-list").val();
			if(sourceName == null || sourceName == ""){
				MapCloud.notify.showInfo("请选择一个数据库","Warning");
				return;
			}
			var tileStore = dialog.panel.find(".tile-list").val();
			if(tileStore == null || tileStore == ""){
				MapCloud.notify.showInfo("请选择一个瓦片库","Warning");
				return;
			}
			var startLevel = dialog.panel.find(".map-start-level").val();
			if(startLevel == null || startLevel == ""){
				MapCloud.notify.showInfo("请输入起始级别","Warning");
				return;
			}
			var endLevel = dialog.panel.find(".map-end-level").val();
			if(endLevel == null || endLevel == ""){
				MapCloud.notify.showInfo("请输入终止级别","Warning");
				return;
			}
			MapCloud.notify.loading();
			gpsManager.buildPyramid(mapObj.name,sourceName,tileStore,startLevel,endLevel,
				dialog.buildPyramid_callback);
		});
	},

	showDialog : function(){
		MapCloud.Dialog.prototype.showDialog.apply(this,arguments);

		if(mapObj == null){
			return;
		}
		var srid = mapObj.srid;
		var extent = mapObj.extent;

		this.panel.find(".map-srid").val(srid);

		if(extent != null){
			this.panel.find(".map-extent-xmin").val(extent.xmin);
			this.panel.find(".map-extent-xmax").val(extent.xmax);
			this.panel.find(".map-extent-ymin").val(extent.ymin);
			this.panel.find(".map-extent-ymax").val(extent.ymax);
		}

		this.getDataSources();
	},


	cleanup : function(){
		this.panel.find(".db-list").empty();
		this.panel.find(".tile-list").empty();
		this.panel.find(".cut-map-extent input").val("");
		this.panel.find(".map-srid").val("");
		this.panel.find(".map-start-level").val("1");
		this.panel.find(".map-end-level").val("5");
		this.panel.find(".result-div").empty();

		this.createTileStoreName = null;
	},

	// 获取数据库列表
	getDataSources : function(){
		dbsManager.getDataSources(this.getDataSources_callback,"Tile");
	},

	getDataSources_callback : function(dataSources){
		MapCloud.notify.hideLoading();
		var dialog = MapCloud.cut_map_dialog;
		dialog.showDataSources(dataSources);
	},
		// 展示数据库
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
			this.getTileStores(currentDB);
		}
	},

	getTileStores : function(name){
		this.panel.find(".tile-list").empty();
		MapCloud.notify.loading();
		dbsManager.describeTileStores(name,this.getTileStores_callback);
	},


	getTileStores_callback : function(tileStores){
		MapCloud.notify.hideLoading();
		var dialog = MapCloud.cut_map_dialog;
		dialog.showTileStoreList(tileStores);
	},

	// 展示瓦片库名称
	showTileStoreList : function(tileStores){
		if(tileStores == null){
			return;
		}
		var html = "";
		var tileStore = null;
		for(var i = 0; i < tileStores.length; ++i){
			tileStore = tileStores[i];
			if(tileStore == null){
				continue;
			}
			html += "<option value='" + tileStore.name + "'>" + tileStore.name + "</option>";
		}
		this.panel.find(".tile-list").html(html);

		if(this.createTileStoreName != null){
			this.panel.find(".tile-list option[value='" + this.createTileStoreName+ "']").attr("selected",true);
			this.createTileStoreName = null;
		}
	},


	// 结果
	buildPyramid_callback : function(result){
		MapCloud.notify.hideLoading();
		var dialog = MapCloud.cut_map_dialog;
		var html = "切图结果:" + result;
		dialog.panel.find(".result-div").html(html);
	},

	// 设置新新建的瓦片库名称
	setCreateStoreName : function(createTileStoreName){
		this.createTileStoreName = createTileStoreName;
	},

});