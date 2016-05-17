MapCloud.TilePanel = MapCloud.Class({

	panel : null,


	map : null,

	// 当前数据库名称
	dataSourceNameCur : null,

	// 当前的tileStore
	tileStore : null,
	
	initialize : function(id){
		this.panel = $("#" + id);

		this.registerPanelEvent();
		this.getDataSources();
	},


	registerPanelEvent : function(){
		var that = this;

		// 数据库列表
		this.panel.find(".return-datasources-list").click(function(){
			that.getDataSources();
		});
		
		// 返回数据库
		this.panel.find(".return-datasource").click(function(){
			var name = $(this).html();
			if(name == null){
				return;
			}
			that.getTileStores(name);
		});

		// 新增数据库
		this.panel.find(".add-db").click(function(){
			MapCloud.pgis_connection_dialog.showDialog("tile","user-tile");
		});

		// 新建瓦片库
		this.panel.find(".create-tilestroe").click(function(){
			var sourceName = that.panel.find("#datasource_tab .current-db").html();
			if(sourceName == null){
				MapCloud.notify.showInfo("请选择一个数据源","Warning");
				return;
			}
			MapCloud.create_tile_store_dialog.showDialog("tileDB-user",sourceName);
		});

		// 瓦片库信息
		this.panel.find("#show_tilestore_infos").click(function(){
			that.panel.find("#show_tilestore_preview").attr("disabled",false);
			$(this).attr("disabled",true);
			if(that.tileStore != null){
				that.showTileStoreInfo(that.tileStore);
			}
		});

		// 瓦片库预览
		this.panel.find("#show_tilestore_preview").click(function(){
			that.panel.find("#show_tilestore_infos").attr("disabled",false);
			$(this).attr("disabled",true);
			if(that.tileStore != null){
				that.showTileStorePreview(that.tileStore);
			}
		});

	},


	getDataSources : function(){
		this.panel.find(".right-panel-tab").css("display","none");
		this.panel.find("#datasources_tab").css("display","block");
		MapCloud.notify.loading();
		dbsManager.getDataSources(this.getDataSources_callback,"Tile");
	},


	getDataSources_callback : function(dataSources){
		MapCloud.notify.hideLoading();
		var that = MapCloud.tilePanel;
		that.showDataSourcesTree(dataSources);
		that.showDataSourcesList(dataSources);
	},

	// 左侧树
	showDataSourcesTree: function(dataSources){
		if(!$.isArray(dataSources)){
			return;
		}
		var dataSource = null;
		var name = null;
		var html = "";
		for(var i = 0; i < dataSources.length;++i){
			dataSource = dataSources[i];
			if(dataSource == null){
				continue;
			}
			name = dataSource.name;
			html += '<div class="row" dname="' + name + '">'
				+	'	<div class="col-md-1 col-xs-1 col-md-20px">'
				+	'		<div class="glyphicon glyphicon-chevron-right mc-icon mc-icon-right mc-icon-rotate"></div>'
				+	'	</div>'
				+	'	<div class="col-md-1 col-xs-1 col-md-20px">'
				+	'		<i class="db-icon list-icon"></i>'
				+	'	</div>'
				+	'	<div class="col-md-7 col-xs-7 db-tree-name">' + name  + '</div>'
				+	'</div>';
		}
		this.panel.find(".tile-db-tree").html(html);

		var that = this;
		this.panel.find(".tile-db-tree .glyphicon-chevron-right").click(function(){
			var name = $(this).parents(".row").first().attr("dname");
			if($(this).hasClass("mc-icon-right")){
				// 展开
				$(this).removeClass("mc-icon-right");
				$(this).addClass("mc-icon-down");
				$(this).css("transform","rotate(90deg) translate(3px,0px)");
				that.panel.find(".tile-db-tree .nav[dname='" + name + "']").remove();
				that.getTileStores(name);
			}else{
				$(this).css("transform","rotate(0deg) translate(0px,0px)");
				$(this).addClass("mc-icon-right");
				$(this).removeClass("mc-icon-down");	
				that.panel.find(".tile-db-tree .nav[dname='" + name + "']").slideUp(500);	
			}
		});
	},	


	// 展示右侧的列表
	showDataSourcesList : function(dataSources){
		if(!$.isArray(dataSources)){
			return;
		}
		var dataSource = null;
		var name = null;
		var html = "";
		var engine = null;
		var constr = null;
		for(var i = 0; i < dataSources.length; ++i){
			dataSource = dataSources[i];
			if(dataSource == null){
				continue;
			}
			name = dataSource.name;
			constr = dataSource.constr;
			engine = dataSource.engine;
			var conObj = this.getDataSourceInfo(constr);
			html += '<div class="row" dname="' + name + '">'
				+	'	<div class="col-md-1 col-xs-1">'
				+		(i+1)
				+	'	</div>'
				+	'	<div class="col-md-2 col-xs-2">'
				+	     	name
				+	'	</div>'
				+	'	<div class="col-md-2 col-xs-2">'
				+			conObj.server
				+	'	</div>'
				+	'	<div class="col-md-1 col-xs-1">'
				+			conObj.instance
				+	'	</div>'
				+	'	<div class="col-md-1 col-xs-1">'
				+			conObj.database
				+	'	</div>'
				+	'	<div class="col-md-1 col-xs-1">'
				+			conObj.user
				+	'	</div>'
				+	'	<div class="col-md-2 col-xs-2">'
				+			conObj.password
				+	'	</div>'
				+	'	<div class="col-md-2 col-xs-2">'
				+	'		<a href="javascript:void(0)" class="oper enter-db">进入</a>'
				+	'		<a href="javascript:void(0)" class="oper remove-db">删除</a>'
				+	'	</div>'
				+	'</div>';
		}

		this.panel.find(".tile-db-list").html(html);

		var that = this;
		// 进入数据库
		$(".tile-db-list .enter-db").click(function(){
			var name = $(this).parents(".row").first().attr("dname");
			if(name == null){
				return;
			}
			var icon = that.panel.find(".tile-db-tree .row[dname='" + name + "'] .glyphicon-chevron-right");
			icon.removeClass("mc-icon-right");
			icon.addClass("mc-icon-down");
			icon.css("transform","rotate(90deg) translate(3px,0px)");
			that.panel.find(".tile-db-tree .nav[dname='" + name +"']").remove();
			// that.getDataSource(name);
			that.getTileStores(name);
		});

		// 删除数据库
		this.panel.find(".tile-db-list .remove-db").click(function(){
			var name = $(this).parents(".row").first().attr("dname");
			if(name == null){
				return;
			}
			if(!confirm("确定删除数据库[" + name + "]?")){
				return;
			}
			MapCloud.notify.loading();
			dbsManager.unRegisterDataSource(name,unRegisterDataSource_callback);
		});
	},	

	getDataSourceInfo : function(str){
		if(str == null){
			return null;
		}
		var serverIndex = str.indexOf("server=");
		var index = str.indexOf(";");
		var server = str.slice(serverIndex + "server=".length,index);

		str = str.slice(index+1,str.length);
		var instanceIndex = str.indexOf("instance=");
		index = str.indexOf(";")
		var instance = str.slice(instanceIndex + "instance=".length,index);

		str = str.slice(index+1,str.length);
		var databaseIndex = str.indexOf("database=");
		index = str.indexOf(";");
		var database = str.slice(databaseIndex + "database=".length, index);

		str = str.slice(index+1,str.length);
		var userIndex = str.indexOf("user=");
		index = str.indexOf(";");
		var user = str.slice(userIndex + "user=".length, index);

		str = str.slice(index+1,str.length);
		var passwordIndex = str.indexOf("password=");
		index = str.indexOf(";");
		var password = str.slice(passwordIndex + "password=".length,index);

		return {
			server 		: server,
			instance 	: instance,
			database 	: database,
			user 		: user,
			password 	: password
		}
	},	

	unRegisterDataSource_callback : function(result){
		MapCloud.notify.showInfo(result,"删除数据源");
		var that = MapCloud.tilePanel; 
		that.getDataSources();
	},

	getTileStores : function(name){
		this.panel.find(".right-panel-tab").css("display","none");
		this.panel.find("#datasource_tab").css("display","block");
		this.panel.find("#datasource_tab .tilestore-list").empty();
		this.panel.find("#datasource_tab .current-db").html(name);
		this.panel.find(".nav[dname='" + name + "']").remove();
		this.tileStore = null;
		if(name == null){
			return;
		}

		this.dataSourceNameCur = name;
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
		var that = MapCloud.tilePanel;
		that.showTileStoreTree(tileStores);
		that.showTileStoreListPanel(tileStores);
	},	

	// 左侧树
	showTileStoreTree : function(tileStores){
		if(!$.isArray(tileStores)){
			return;
		}

		var html = "<ul class='nav' dname='" + this.dataSourceNameCur + "'>";
		var tileStore = null;
		var name = null;
		for(var i = 0; i < tileStores.length; ++i){
			tileStore = tileStores[i];
			if(tileStore == null){
				continue;
			}
			name = tileStore.name;
			html += "<li  tname='" + name + "'>"
			+	"		<a href='javascript:void(0)' class='tile-store-name'>"
			+	"			<i class='mc-icon mc-icon-tilestore'></i>"
			+ 	"			<span title='" + name + "'>" + name + "</span>"
			+ 	"		</a>"
			+	"</li>";
		}
		html += "</ul>";

		var dataSourceTreeItem = this.panel.find(".tile-db-tree .row[dname='" +  this.dataSourceNameCur + "']");
		dataSourceTreeItem.after(html);

		var that = this;
		// 进入瓦片
		this.panel.find(".nav[dname='" + this.dataSourceNameCur + "'] li").click(function(){
			if(that.dataSourceNameCur == null){
				return;
			}
			var name = $(this).attr("tname");
			if(name == null){
				return;
			}
			that.showTileStore(that.dataSourceNameCur,name);
		});

	},

	// 右侧面板
	showTileStoreListPanel : function(tileStores){
		if(!$.isArray(tileStores)){
			return;
		}
		var html = "";
		var tileStore = null;
		var name = null;
		var format = null;
		var extent = null;
		var tms = null;
		var extentHtml = "";
		for(var i = 0; i < tileStores.length; ++i){
			tileStore = tileStores[i];
			if(tileStore == null){
				continue;
			}
			name = tileStore.name;
			format = tileStore.format;
			tms = tileStore.tms;
			extent = tileStore.extent;
			html += "<div class='row' tname='" + name + "'>"
				+	"	<div class='col-md-1 col-xs-1'>" + (i+i) + "</div>"
				+	"	<div class='col-md-2 col-xs-2'>" + name + "</div>"
				+	"	<div class='col-md-2 col-xs-2'>" + format + "</div>"
				+	"	<div class='col-md-2 col-xs-2'>" + tms + "</div>";
			if(extent == null){
				html += "<div class='col-md-3 col-xs-3'></div>";
			}else{
				extentHtml = extent.xmin.toFixed(2) + " , " + extent.ymin.toFixed(2)
					+ " , " + extent.xmax.toFixed(2) + " , " + extent.ymax.toFixed(2); 
				html += "<div class='col-md-3 col-xs-3'>" + extentHtml + "</div>";
			}
			html +=	'	<div class="col-md-2 col-xs-2">'
				+	'		<a href="javascript:void(0)" class="oper enter-tilestore">进入</a>'
				+	'		<a href="javascript:void(0)" class="oper remove-tilestore">删除</a>'
				+	'	</div>'
			html += "</div>";
		}

		this.panel.find("#datasource_tab .tilestore-list").html(html);

		var that = this;
		// 进入
		this.panel.find("#datasource_tab .enter-tilestore").click(function(){
			var name = $(this).parents(".row").attr("tname");
			if(name == null){
				return;
			}
			var dbName = that.panel.find("#datasource_tab .current-db").html();
			if(dbName == null){
				return;
			}
			that.showTileStore(dbName,name);
		});

		// 删除
		this.panel.find("#datasource_tab .remove-tilestore").click(function(){
			var name = $(this).parents(".row").attr("tname");
			if(name == null){
				return;
			}

			var sourceName = that.dataSourceNameCur;
			if(sourceName == null){
				return;
			}
			that.removeTileStore(sourceName,name);
		});
	},

	// 进入tilestore页面
	showTileStore : function(dbName,tileStoreName){
		this.panel.find(".right-panel-tab").css("display","none");
		this.panel.find("#tilestore_tab").css("display","block");
		this.panel.find("#tilestore_tab .return-datasource").html(dbName);
		this.panel.find("#tilestore_tab .current-tilestore").html(tileStoreName);
		this.panel.find(".nav[dname='" + dbName + "'] li").removeClass("selected");
		this.panel.find(".nav[dname='" + dbName + "'] li[tname='" + tileStoreName + "']").addClass("selected");

		if(name == null){
			return;
		}
		MapCloud.notify.loading();
		dbsManager.describeTileStore(dbName,tileStoreName,this.describeTileStore_callback);
	},

	describeTileStore_callback : function(tileStore){
		MapCloud.notify.hideLoading();
		var that = MapCloud.tilePanel;
		that.tileStore = tileStore;

		if(that.panel.find("#show_tilestore_infos").attr("disabled") == "disabled"){
			that.showTileStoreInfo(tileStore);
		}
		if(that.panel.find("#show_tilestore_preview").attr("disabled") == "disabled"){
			that.showTileStorePreview(tileStore);
		}
	},

	// 展示tilestore的信息
	showTileStoreInfo : function(tileStore){
		this.panel.find("#tilestore_tab .right-panel-content-tab").css("display","none");
		this.panel.find("#tilestore_infos_tab").css("display","block");
		if(tileStore == null){
			return;
		}

		var html = "";
		html += "<div class='row'>"
		+ "			<div class='col-md-3 col-xs-3'>瓦片库名称</div>"
		+ "			<div class='col-md-8 col-xs-8'>" + tileStore.name + "</div>"
		+ "		</div>"
		+ "		<div class='row'>"
		+ "			<div class='col-md-3 col-xs-3'>格式</div>"
		+ "			<div class='col-md-8 col-xs-8'>" + tileStore.format + "</div>"
		+ "		</div>"
		+ "		<div class='row'>"
		+ "			<div class='col-md-3 col-xs-3'>切图标准</div>"
		+ "			<div class='col-md-8 col-xs-8'>" + tileStore.tms + "</div>"
		+ "		</div>"
		+ "		<div class='row'>"
		+ "			<div class='col-md-3 col-xs-3'>范围</div>"
		+ "			<div class='col-md-8 col-xs-8'>" + (tileStore.extent!=null ? tileStore.extent.toString() : "") + "</div>"
		+ "		</div>"
		+ "		<div class='row'>"
		+ "			<div class='col-md-3 col-xs-3'>投影</div>"
		+ "			<div class='col-md-8 col-xs-8'>" +  tileStore.srid + "</div>"
		+ "		</div>"
		+ "		<div class='row'>"
		+ "			<div class='col-md-3 col-xs-3'>起始级别</div>"
		+ "			<div class='col-md-8 col-xs-8'>" +  tileStore.startLevel + "</div>"
		+ "		</div>"
		+ "		<div class='row'>"
		+ "			<div class='col-md-3 col-xs-3'>终止级别</div>"
		+ "			<div class='col-md-8 col-xs-8'>" +  tileStore.endLevel + "</div>"
		+ "		</div>"		
		;
		
		this.panel.find("#tilestore_infos_tab").html(html);
	},

	// 展示预览图
	showTileStorePreview : function(tileStore){
		this.panel.find("#tilestore_tab .right-panel-content-tab").css("display","none");
		this.panel.find("#tilestore_preview_tab").css("display","block");
		if(tileStore == null){
			return;
		}

		var layer = new GeoBeans.Layer.WMTSLayer(tileStore.name,dbsManager.server,tileStore.name,
			tileStore.extent,tileStore.tms,tileStore.format,tileStore.sourceName);
		var startLevel = tileStore.startLevel;
		var endLevel = tileStore.endLevel;
		if(startLevel != null){
			layer.MIN_ZOOM_LEVEL = startLevel;
		}
		if(endLevel != null){
			layer.MAX_ZOOM_LEVEL = endLevel;
		}
		if(this.map != null){
			this.map.removeBaseLayer();
			this.map.draw();
			this.map.setBaseLayer(layer);
		}else{
			var extent = layer.extent;
			var srid = 4326;
			this.map = new GeoBeans.Map(user.server,"tilestore_preview_tab","tile",extent,srid,extent);
			this.map.setBaseLayer(layer);
			
		}
		if(tileStore.extent != null){
			var center = tileStore.extent.getCenter();
			this.map.setCenter(center);
		}
		this.map.draw();
	},


	// 删除瓦片库
	removeTileStore : function(sourceName,tileStoreName){
		if(!confirm("确定要删除[" + tileStoreName + "]")){
			return;
		}
		MapCloud.notify.loading();
		dbsManager.removeTileStore(sourceName,tileStoreName,this.removeTileStore_callback);
	},

	removeTileStore_callback : function(result){
		MapCloud.notify.showInfo(result,"删除瓦片库");
		var that = MapCloud.tilePanel;
		var sourceName = that.dataSourceNameCur;
		that.getTileStores(sourceName);
	},




});