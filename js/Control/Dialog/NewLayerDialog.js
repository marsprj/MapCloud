// 新建图层
MapCloud.NewLayerDialog = MapCloud.Class(MapCloud.Dialog, {
	// 选中的数据源
	dataSource 	: null,

	// 选中的数据
	dataSet 	: null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		
		var dialog = this;

		// 选择数据源,弹出数据源窗口
		dialog.panel.find("#new_layer_select_dbs").each(function(){
			$(this).click(function(){
				// MapCloud.data_source_dialog.showDialog("select");
				// MapCloud.db_admin_dialog.showDialog("select");
				MapCloud.vector_db_dialog.showDialog("select");
			});
		});

		// 确定
		dialog.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				var name = dialog.panel.find("#new_layer_name").val();
				if(name == null || name == ""){
					alert("请输入名称！");
					return;
				}
				if(dialog.dataSource == null || 
					dialog.dataSet == null){
					alert("请选择数据");
					return;
				}
				var dbName = dialog.dataSource.name;
				var typeName = dialog.dataSet.name;
				if(mapObj != null){
					var layer = new GeoBeans.Layer.DBLayer(name,
						dbName,typeName); 
					MapCloud.alert_info.loading();
					layer.geomType = dialog.dataSet.geometryType;
					// 注册图层
					mapObj.addLayer(layer,dialog.addLayer_callback);
				}
				dialog.closeDialog();
			});
		});
	},
	
	destory : function(){
		MapCloud.Dialog.prototype.destory.apply(this, arguments);
	},
	
	cleanup : function(){
		this.panel.find("#new_layer_name").val("");
		this.panel.find("#new_layer_dbs").val("");
	},

	// 选择数据源返回的数据源和数据
	setDataSet : function(dataSource,dataSet){
		if(dataSource == null || dataSet == null){
			return;
		}
		this.dataSource = dataSource;
		this.dataSet = dataSet;
		var text = "数据源：" + dataSource.name 
				+ "; 数据：" + dataSet.name;
		this.panel.find("#new_layer_dbs").val(text);

		this.panel.find("#new_layer_name").val(dataSet.name);	
	},

	// 注册图层回调函数
	addLayer_callback : function(result){
		var dialog = MapCloud.new_layer_dialog;
		var name = dialog.panel.find("#new_layer_name").val();
		var info = "注册图层 [ " + name + " ]";
		MapCloud.alert_info.showInfo(result,info);
		MapCloud.refresh_panel.refreshPanel();
		mapObj.draw();
	}
});
	