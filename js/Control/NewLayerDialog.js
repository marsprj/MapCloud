MapCloud.NewLayerDialog = MapCloud.Class(MapCloud.Dialog, {
	dataSource 	: null,
	dataSet 	: null,


	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		
		var dialog = this;
		dialog.panel.find("#new_layer_select_dbs").each(function(){
			$(this).click(function(){
				MapCloud.data_source_dialog.showDialog("select");
				// MapCloud.data_source_dialog.showDialog();
			});
		});
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

	setDataSet : function(dataSource,dataSet){
		if(dataSource == null || dataSet == null){
			return;
		}
		this.dataSource = dataSource;
		this.dataSet = dataSet;
		var text = "数据源：" + dataSource.name 
				+ "; 数据：" + dataSet.name;
		this.panel.find("#new_layer_dbs").val(text);	
	},

	addLayer_callback : function(result){
		var dialog = MapCloud.new_layer_dialog;
		var name = dialog.panel.find("#new_layer_name").val();
		var info = "注册图层 [ " + name + " ]";
		MapCloud.alert_info.showInfo(result,info);
		MapCloud.refresh_panel.refreshPanel();
	}
});
	