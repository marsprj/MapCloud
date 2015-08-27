MapCloud.TileDBDialog = MapCloud.Class(MapCloud.Dialog,{
	

	// // 瓦片库
	// layers 			: null,

	// 当前瓦片库
	tileStore 		: null,

	// 新注册的数据源的名称
	registerDataSourceName : null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		this.registerPanelEvent();
	},

	registerPanelEvent : function(){
		var dialog = this;

		this.panel.find("[data-toggle='tooltip']").tooltip({container:'body'});

		// 切换数据库
		this.panel.find(".db-list").change(function(){
			var dbName = $(this).val();
			// dialog.getCapabilities(dbName);
			dialog.getTileStores(dbName);
		});


		// 新建数据库
		this.panel.find(".btn-add-server").click(function(){
			MapCloud.pgis_connection_dialog.showDialog("tile");
		});

		// 删除数据库
		this.panel.find(".btn-remove-server").click(function(){
			dialog.removeDataSource();
		});

		// 刷新
		this.panel.find(".btn-refresh").click(function(){
			var dbName = dialog.panel.find(".db-list").val();
			dialog.getTileStores(dbName);
			// MapCloud.notify.showInfo("刷新成功","Info");
		});

		// 新增瓦片库
		this.panel.find(".btn-create-tile-store").click(function(){
			var sourceName = dialog.panel.find(".db-list").val();
			MapCloud.create_tile_store_dialog.showDialog("tileDB",sourceName);
		});

		// 删除瓦片库
		this.panel.find(".btn-remove-tile-store").click(function(){
			var tileStoreName = dialog.panel.find(".tile-store-name.selected span").html();
			if(!confirm("确定删除[" + tileStoreName + "]瓦片库吗？")){
				return;
			}
			var sourceName = dialog.panel.find(".db-list").val();
			dialog.removeTileStore(sourceName,tileStoreName);
		});

		// 信息
		this.panel.find(".btn-infos").click(function(){
			dialog.panel.find(".db-tool .btn-group .btn").attr("disabled",false);
			$(this).attr("disabled",true);
			dialog.panel.find(".layer-content").removeClass("active");
			dialog.panel.find(".layer-infos-pane").addClass('active');
			var tileStoreName = dialog.panel.find(".tile-store-name.selected span").html();
			dialog.showTileStore(tileStoreName);	
		});

		// 预览
		this.panel.find(".btn-preview").click(function(){
			dialog.panel.find(".layer-content").removeClass("active");
			dialog.panel.find(".layer-preview-pane").addClass('active');
			dialog.panel.find(".db-tool .btn-group .btn").attr("disabled",false);
			$(this).attr("disabled",true);
			if(dialog.tileStore != null){
				dialog.showTileStorePreview(dialog.tileStore);
			}
		});

		// 确定，选择
		this.panel.find(".btn-confirm").click(function(){
			if(dialog.source == null){
				dialog.closeDialog();
				return;
			}
			if(dialog.source == "wmtsLayer"){
				var sourceName = dialog.panel.find(".db-list").val();
				if(sourceName == null || sourceName == ""){
					MapCloud.notify.showInfo("请选择一个数据源","Warning");
					return;
				}
				if(dialog.tileStore != null){
					var tileStore = dialog.tileStore;
					var layer = new GeoBeans.Layer.WMTSLayer(tileStore.name,dbsManager.server,tileStore.name,
					tileStore.extent,tileStore.tms,tileStore.format,tileStore.sourceName);
					MapCloud.wmts_dialog.setWMTSLayer(sourceName,layer)
				}
				
				dialog.closeDialog();
			}else if(dialog.source == "buildPyramid"){
				var sourceName = dialog.panel.find(".db-list").val();
				if(sourceName == null || sourceName == ""){
					MapCloud.notify.showInfo("请选择一个数据源","Warning");
					return;
				}
				if(dialog.tileStore != null){
					MapCloud.gps_build_pyramid_dialog.setTileStore(sourceName,dialog.tileStore.name);
				}
				
				dialog.closeDialog();
			}
		});


	},

	showDialog : function(source){
		MapCloud.Dialog.prototype.showDialog.apply(this, arguments);
		this.getDataSources();
		this.source = source;
		if(this.source != null){
			this.panel.find(".btn-confirm").html("选择");
		}else{
			this.panel.find(".btn-confirm").html("确定");
		}
	},

	getDataSources : function(){
		dbsManager.getDataSources(this.getDataSources_callback,"Tile");
	},

	cleanup : function(){
		if(this.map != null){
			this.map.close();
			this.map = null;
		}
		this.source = null;
		this.tileStore = null;

		this.panel.find(".db-list").empty();
		this.panel.find(".layer-tree .nav").empty();
		this.panel.find(".layer-infos-pane").empty();

		
	},

	getDataSources_callback : function(dataSources){
		MapCloud.notify.hideLoading();
		var dialog = MapCloud.tile_db_dialog;
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

		if(this.registerDataSourceName != null){
			this.panel.find(".db-list option[value='" + this.registerDataSourceName + "']")
				.attr("selected",true);
			this.getTileStores(this.registerDataSourceName);
			this.registerDataSourceName = null;
		}else{
			var currentDB = this.panel.find(".db-list").val();
			if(currentDB != null && currentDB != ""){
				// this.getCapabilities(currentDB);
				this.getTileStores(currentDB);
			}
		}
			
	},	

	getTileStores : function(name){
		this.panel.find(".layer-tree .nav").empty();
		this.panel.find(".layer-infos-pane").empty();
		if(this.map != null){
			this.map.removeBaseLayer("tile");
			this.map.draw();
		}
		
		this.tileStore = null;
		MapCloud.notify.loading();
		dbsManager.describeTileStores(name,this.getTileStores_callback);
	},

	getTileStores_callback : function(tileStores){
		MapCloud.notify.hideLoading();
		var dialog = MapCloud.tile_db_dialog;
		dialog.showTileStoreList(tileStores);
	},

	showTileStoreList : function(tileStores){
		if(tileStores == null){
			return;
		}

		var html = "";
		var tileStore = null;
		var name = null;
		for(var i = 0; i < tileStores.length; ++i){
			tileStore = tileStores[i];
			if(tileStore == null){
				continue;
			}
			name = tileStore.name;
			html += "<li>"
			+	"		<a href='javascript:void(0)' class='tile-store-name' tname='" + name + "'>"
			+ 	"			<span>" + name + "</span>"
			+ 	"		</a>"
			+	"</li>";
		}
		this.panel.find(".layer-tree .nav").html(html);

		// 展示第一个
		var tileStoreName = this.panel.find(".tile-store-name span").first().html();
		if(tileStoreName != null){
			this.showTileStore(tileStoreName);
		}
		

		var dialog = this;
		this.panel.find(".tile-store-name").click(function(){
			var tileStoreName = $(this).find("span").html();
			dialog.showTileStore(tileStoreName);
		});


	},

	// 展示一个瓦片库
	showTileStore : function(tileStoreName){
		this.panel.find(".tile-store-name").removeClass('selected');
		this.panel.find(".tile-store-name[tname='" + tileStoreName + "']").addClass("selected");
		var sourceName = this.panel.find(".db-list").val();
		if(tileStoreName == null){
			return;
		}
		MapCloud.notify.loading();
		dbsManager.describeTileStore(sourceName,tileStoreName,this.describeTileStore_callback);
	},

	describeTileStore_callback : function(tileStore){
		MapCloud.notify.hideLoading();
		var dialog = MapCloud.tile_db_dialog;
		dialog.showTileStoreInfo(tileStore);

	},

	showTileStoreInfo : function(tileStore){
		this.panel.find(".layer-content").removeClass("active");
		this.panel.find(".layer-infos-pane").addClass('active');
		this.panel.find(".db-tool .btn-group .btn").attr("disabled",false);
		this.panel.find(".btn-infos").attr("disabled",true);
		if(tileStore == null || !(tileStore instanceof GeoBeans.TileStore)){
			return;
		}

		this.tileStore = tileStore;

		var html = "";
		html += "<div class='row'>"
		+ "			<div class='col-md-4'>瓦片库名称</div>"
		+ "			<div class='col-md-8'>" + tileStore.name + "</div>"
		+ "		</div>"
		+ "		<div class='row'>"
		+ "			<div class='col-md-4'>格式</div>"
		+ "			<div class='col-md-8'>" + tileStore.format + "</div>"
		+ "		</div>"
		+ "		<div class='row'>"
		+ "			<div class='col-md-4'>切图标准</div>"
		+ "			<div class='col-md-8'>" + tileStore.tms + "</div>"
		+ "		</div>"
		+ "		<div class='row'>"
		+ "			<div class='col-md-4'>范围</div>"
		+ "			<div class='col-md-8'>" + (tileStore.extent!=null ? tileStore.extent.toString() : "") + "</div>"
		+ "		</div>"
		+ "		<div class='row'>"
		+ "			<div class='col-md-4'>投影</div>"
		+ "			<div class='col-md-8'>" + "" + "</div>"
		+ "		</div>"
		+ "		<div class='row'>"
		+ "			<div class='col-md-4'>起始级别</div>"
		+ "			<div class='col-md-8'>" + "" + "</div>"
		+ "		</div>"
		+ "		<div class='row'>"
		+ "			<div class='col-md-4'>终止级别</div>"
		+ "			<div class='col-md-8'>" + "" + "</div>"
		+ "		</div>"	;
		this.panel.find(".layer-infos-pane").html(html);
	},


	// 删除数据库
	removeDataSource : function(){
		var name = this.panel.find(".db-list").val();
		if(name == null){
			return;
		}
		if(!confirm("确定要删除[" + name + "]数据库吗?")){
			return;
		}
		dbsManager.unRegisterDataSource(name,this.unRegisterDataSource_callback);
	},

	unRegisterDataSource_callback : function(result){
		var info = "注销数据源";
		MapCloud.notify.showInfo(result,info);
		var dialog = MapCloud.tile_db_dialog;
		dialog.getDataSources();
	},

	// 预览瓦片库
	showTileStorePreview : function(tileStore){
		this.panel.find(".layer-content").removeClass("active");
		this.panel.find(".layer-preview-pane").addClass('active');
		if(tileStore == null){
			return;
		}
		var layer = new GeoBeans.Layer.WMTSLayer(tileStore.name,dbsManager.server,tileStore.name,
			tileStore.extent,tileStore.tms,tileStore.format,tileStore.sourceName);
		if(this.map != null){
			this.map.removeBaseLayer("tile");
			this.map.draw();
			this.map.insertLayer(layer);
			this.map.draw();
		}else{
			var extent = layer.extent;
			var srid = 4326;
			this.map = new GeoBeans.Map(url,"tile_canvas_wrapper","tile",extent,srid,extent);
			this.map.insertLayer(layer);
			this.map.draw();
		}
	},

	// 删除瓦片库
	removeTileStore : function(sourceName,tileStoreName){
		MapCloud.notify.loading();
		dbsManager.removeTileStore(sourceName,tileStoreName,this.removeTileStore_callback);
	},

	removeTileStore_callback : function(result){
		MapCloud.notify.showInfo(result,"删除瓦片库");
		var dialog = MapCloud.tile_db_dialog;
		var sourceName = dialog.panel.find(".db-list").val();
		dialog.getTileStores(sourceName);
	},

	// 设置新注册的数据源的名称
	setRegisterDataSourceName : function(registerDataSourceName){
		this.registerDataSourceName = registerDataSourceName;
	}
});