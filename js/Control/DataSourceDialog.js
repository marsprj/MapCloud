MapCloud.DataSourceDialog = MapCloud.Class(MapCloud.Dialog,{
	dataSourceNameCur 	: null,
	dataSourceCur 		: null,
	isSelected 			: null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		dialog.panel.find("#data_source_list").each(function(){
			$(this).change(function(){
				var name = this.value;
				dialog.getDataSource(name);
			});
		});

		//注册
		dialog.panel.find("#register_data_source").each(function(){
			$(this).click(function(){
				MapCloud.pgis_connection_dialog.showDialog();
			});
		});
		// 注销
		dialog.panel.find("#unregis_data_source").each(function(){
			$(this).click(function(){
				var name = dialog.panel
					.find("#data_source_list option:selected").val();
				var result = confirm("确认删除" + name 
						+ "数据源？");
				if(result){
					dialog.unRegisterDataSource(name);
				}
			});
		});
		dialog.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				//返回选择的数据
				if(dialog.isSelected){
					var dataSetSel = dialog.panel
						.find("#datasets_div table tbody tr.selected");
					var index = dataSetSel.attr("index");
					if(dialog.dataSourceCur != null){
						var dataSets = dialog.dataSourceCur.dataSets;
						if(dataSets != null){
							var dataSet = dataSets[index];
							MapCloud.new_layer_dialog
								.setDataSet(dialog.dataSourceCur,
									dataSet);
						}
					}
				}
				dialog.closeDialog();
			});
		});
	},

	showDialog : function(flag){
		if(flag == "select"){
			this.isSelected = true;
			this.panel.find(".btn-confirm").html("选择");
		}else{
			this.isSelected = false;
			this.panel.find(".btn-confirm").html("确定");
		}
		MapCloud.alert_info.loading();
		dbsManager.getDataSources(this.getDataSources_callback);
		this.cleanup();
		this.panel.modal("toggle");
	},

	getDataSources_callback : function(dataSources){
		MapCloud.alert_info.hideLoading();
		var dataSource = null;
		var name = null;
		var html = "";
		for(var i = 0; i < dataSources.length;++i){
			dataSource = dataSources[i];
			name = dataSource.name;
			html += "<option value='" + name + "'>" 
						+ name + "</option>";
		}
		var dialog = MapCloud.data_source_dialog
		var panel = dialog.panel;
		panel.find("#data_source_list").html(html);

		dialog.dataSourceNameCur = 
			panel.find("#data_source_list option:selected").val();
		// dialog.showDataSets
		dialog.getDataSource(dialog.dataSourceNameCur);
	},

	getDataSource : function(dataSourceName){
		if(dataSourceName == null){
			return;
		}
		dbsManager.getDataSource(dataSourceName,
				this.getDataSource_callback);

	},

	getDataSource_callback : function(dataSource){
		if(dataSource == null){
			return;
		}
		var dialog = MapCloud.data_source_dialog
		var panel = dialog.panel;
		dialog.dataSourceCur = dataSource;
		dialog.getDataSets(dialog.dataSourceCur);
	},

	getDataSets : function(dataSource){
		if(dataSource == null){
			return;
		}
		dataSource.getDataSets(this.getDataSets_callback);
	},

	getDataSets_callback : function(dataSets){
		if(dataSets == null){
			return;
		}
		var dialog = MapCloud.data_source_dialog;
		var panel = dialog.panel;

		var dataSet = null;
		var name,srid,geometryType;
		var html = "";
		for(var i = 0; i < dataSets.length;++i){
			dataSet = dataSets[i];
			name = dataSet.name;
			srid = dataSet.srid;
			geometryType = dataSet.geometryType;
			html += "<tr index='" + i + "'>"
			+ 	"	<td>" + name + "</td>"
			+	"	<td>" + geometryType + "</td>"
			+ 	"	<td>" + srid + "</td>"
			+ 	"</tr>";
		}
		panel.find("#datasets_div tbody").html(html);
		dialog.registerDataSourceSelected();
	},
	//选择一个数据源
	registerDataSourceSelected : function(){
		var dialog = this;
		this.panel
			.find("#datasets_div tbody tr").each(function(){
				$(this).click(function(){
					$(this).parent().children().removeClass("selected");
					$(this).addClass("selected");
				}).dblclick(function(){
					var index = $(this).attr("index");
					if(dialog.dataSourceCur != null){
						var dataSets = dialog.dataSourceCur.dataSets;
						if(dataSets != null){
							var dataSet = dataSets[index];
							MapCloud.new_layer_dialog
								.setDataSet(dialog.dataSourceCur,
									dataSet);
							dialog.closeDialog();
						}
					}
				});
		});
	},

	unRegisterDataSource : function(dataSourceName){
		if(dataSourceName == null){
			return;
		}
		MapCloud.alert_info.loading();
		dbsManager.unRegisterDataSource(dataSourceName,
			this.unRegisterDataSource_callback);
	},

	unRegisterDataSource_callback : function(result){
		// alert(result);
		var dialog = MapCloud.data_source_dialog;
		var name = dialog.panel
					.find("#data_source_list option:selected").val();
		var info = "注销数据源 [ " + name + " ]";
		MapCloud.alert_info.showInfo(result,info);
		var dialog = MapCloud.data_source_dialog;
		dbsManager.getDataSources(dialog.getDataSources_callback);
	}
});