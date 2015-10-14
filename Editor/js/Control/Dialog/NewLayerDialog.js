// 新建图层
MapCloud.NewLayerDialog = MapCloud.Class(MapCloud.Dialog, {
	// 选中的数据源
	dataSource 	: null,

	// 选中的数据
	dataSet 	: null,

	// 选择的样式
	style : null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		
		var dialog = this;

		// 选择数据源,弹出数据源窗口
		dialog.panel.find("#new_layer_select_dbs").each(function(){
			$(this).click(function(){
				MapCloud.vector_db_dialog.showDialog("select");
			});
		});

		dialog.panel.find("#new_layer_select_style").click(function(){
			if(dialog.dataSet == null){
				MapCloud.notify.showInfo("请先选择数据源","Warning");
				return;
			}
			var geomType = dialog.dataSet.geometryType;
			if(geomType == null){
				MapCloud.notify.showInfo("请选择有效的数据源","Warning");
				return;
			}
			MapCloud.style_list_dialog.showDialog(geomType);
		});

		// 确定
		dialog.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				var name = dialog.panel.find("#new_layer_name").val();
				if(name == null || name == ""){
					MapCloud.notify.showInfo("请输入名称","Warning");
					dialog.panel.find("#new_layer_name").focus();
					return;
				}
				var nameReg = /^[0-9a-zA-Z_]+$/;
				if(!nameReg.test(name)){
					MapCloud.notify.showInfo("请输入有效的名称","Warning");
				}
				

				if(dialog.dataSource == null || 
					dialog.dataSet == null){
					MapCloud.notify.showInfo("请选择数据","Warning");
					return;
				}
				// if(dialog.style == null){
				// 	MapCloud.notify.showInfo("请选择样式","Warning");
				// 	return;
				// }
				var dbName = dialog.dataSource.name;
				var typeName = dialog.dataSet.name;
				if(mapObj == null){
					MapCloud.notify.showInfo("当前地图为空","Warning");
					return;
				}
				if(mapObj != null){
					var layer = new GeoBeans.Layer.FeatureDBLayer(name,null,dbName,typeName,null,null);
					// var layer = new GeoBeans.Layer.DBLayer(name,
					// 	dbName,typeName); 
					MapCloud.notify.loading();
					layer.geomType = dialog.dataSet.geometryType;
					// 注册图层
					mapObj.insertLayer(layer,dialog.insertLayer_callback);
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
		this.panel.find("#new_layer_style").val("");
		this.style = null;
		this.dataSource = null;
		this.dataSet = null;
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
	insertLayer_callback : function(result){
		var dialog = MapCloud.new_layer_dialog;
		var name = dialog.panel.find("#new_layer_name").val();
		var info = "注册图层 [ " + name + " ]";
		MapCloud.notify.showInfo(result,info);
		if(result.toLowerCase() == "success"){
			MapCloud.refresh_panel.refreshPanel();
			// mapObj.draw();
			if(dialog.style != null){
				mapObj.setStyle(name,dialog.style,dialog.setStyle_callback);
			}			
		}
		mapObj.draw();
	},

	setStyle : function(style){
		if(style == null){
			return;
		}
		this.style = style;

		this.panel.find("#new_layer_style").val(this.style.name);
	},

	setStyle_callback : function(result){
		if(result.toLowerCase() != "success"){
			MapCloud.notify.showInfo(result,"设置样式");
		}
		mapObj.draw();
	}
});
	