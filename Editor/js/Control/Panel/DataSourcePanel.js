MapCloud.DataSourcePanel = MapCloud.Class(MapCloud.Panel,{
	

	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
	},

	showPanel : function(){
		if(this.panel.css("display") == "none"){
			this.cleanup();
			this.panel.css("display","block");
			this.getDataSources();
		}

		this.registerPanelEvent();
	},

	cleanup : function(){
		this.panel.find(".db-list").empty();
		this.panel.find(".table-tree").empty();
	},

	registerPanelEvent : function(){
		var that = this;
		// 切换数据库
		this.panel.find(".db-list").change(function(){
			var sourceName = $(this).val();
			that.getDataSource(sourceName);
		});

		// 刷新
		this.panel.find(".btn-refresh").click(function(){
			that.refresh();
		});

		// 导入
		this.panel.find(".btn-upload").click(function(){
			MapCloud.import_dialog.showDialog("dataPanel");
			var sourceName = that.panel.find(".db-list").val();
			MapCloud.import_dialog.setDataSourceName(sourceName);
		});
	},

	getDataSources : function(){
		dbsManager.getDataSources(this.getDataSources_callback,"Feature");
	},

	refresh : function(){
		var sourceName = this.panel.find(".db-list").val();
		this.getDataSource(sourceName);
	},
	getDataSources_callback : function(dataSources){
		MapCloud.notify.hideLoading();
		var panel = MapCloud.data_source_panel;
		panel.showDataSources(dataSources);
	},

	showDataSources : function(dataSources){
		if(dataSources == null){
			return;
		}
		var dataSource = null;
		var name = null;
		var html = "";
		for(var i = dataSources.length - 1; i >= 0; --i){
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
			this.getDataSource(currentDB);
		}
	},

	// 获取数据库
	getDataSource : function(dataSourceName){
		this.panel.find(".table-tree").empty();
		MapCloud.notify.loading();
		dbsManager.getDataSource(dataSourceName,
				this.getDataSource_callback);
	},

	getDataSource_callback : function(dataSource){
		var panel = MapCloud.data_source_panel;
		panel.getDataSets(dataSource);
	},

	// 获取数据表
	getDataSets : function(dataSource){
		if(dataSource == null){
			return;
		}
		dataSource.getDataSets(this.getDataSets_callback);
	},

	getDataSets_callback : function(dataSets){
		MapCloud.notify.hideLoading();
		var panel = MapCloud.data_source_panel;
		panel.showDataSets(dataSets);
	},

	showDataSets : function(dataSets){
		if(dataSets == null){
			return;
		}
		var html = "";
		var dataSet = null;
		var geomType = null;
		var name = null;
		var geomTypeHtml = "";
		for(var i = 0; i < dataSets.length; ++i){
			dataSet = dataSets[i];
			if(dataSet == null){
				continue;
			}
			name = dataSet.name;
			geomType = dataSet.geometryType;
			geomTypeHtml = MapCloud.vector_db_dialog.getDataSetGeomTypeHtml(geomType);

			html += "<div class='row' lname='" + name + "'>"
			+ "<div class='col-md-1'>" + geomTypeHtml + "</div>"
			+ "<div class='col-md-9'>" + name + "</div>"
			+ "<div class='col-md-1'>";
			if(geomType != null){
				html +=	"<div class='fa fa-plus mc-icon add_layer'  "
					+ "	data-toggle='tooltip' data-placement='top' data-original-title='添加到地图'></div>"
			}
			html += "</div>"
			+ "</div>"
		}
		this.panel.find(".table-tree").html(html);	

		this.panel.find("[data-toggle='tooltip']").tooltip({container:'body'});

		var that = this;
		// 添加到地图
		this.panel.find(".table-tree .add_layer").click(function(){
			if(mapObj == null){
				MapCloud.notify.showInfo("当前地图为空","Warning");
				return;
			}
			var name = $(this).parents(".row").attr("lname");
			if(name == null){
				MapCloud.notify.showInfo("图层为空","Warning");
				return;
			}
			var dbName = that.panel.find(".db-list").val();
			var layer = new GeoBeans.Layer.FeatureDBLayer(name,null,dbName,name,null,null);
			MapCloud.notify.loading();
			mapObj.insertLayer(layer,that.addLayer_callback);
		});
	},

	addLayer_callback : function(result){
		var panel = MapCloud.data_source_panel;
		MapCloud.notify.showInfo(result,"注册图层");
		if(result.toLowerCase() == "success"){
			MapCloud.refresh_panel.refreshPanel();
		}
	}


});