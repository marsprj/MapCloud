// 数据源对话框
MapCloud.DataSourceDialog = MapCloud.Class(MapCloud.Dialog,{
	// 当前的数据源名称
	dataSourceNameCur 	: null,
	// 当前的数据源
	dataSourceCur 		: null,
	// 当前的数据
	dataSetCur 			: null,
	//是否是选中返回新建图层的 
	isSelected 			: null,
	// 每页显示的个数
	maxFeatures 		: 20,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		//注册标签页事件 
		dialog.panel.find("#datasets_tab a").each(function(){
			$(this).click(function(e){
				e.preventDefault();
				$(this).tab("show");
			});
		});

		// 切换数据源
		dialog.panel.find("#data_source_list").each(function(){
			$(this).change(function(){
				dialog.cleanup();
				var name = this.value;
				dialog.getDataSource(name);
			});
		});

		//注册数据源
		dialog.panel.find("#register_data_source").each(function(){
			$(this).click(function(){
				// 弹出注册对话框
				MapCloud.pgis_connection_dialog.showDialog();
			});
		});

		// 注销数据源
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

		// 确定
		dialog.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				//返回选择的数据到新建图层中
				if(dialog.isSelected){
					var dataSetSel = dialog.panel
						.find("#datasets_div .list-group-item.selected");
					if(dataSetSel.length == 0){
						MapCloud.alert_info.showInfo("请选择一个dataSet","Warning");
						return;
					}
					var index = dataSetSel.attr("index");
					if(dialog.dataSourceCur != null){
						var dataSets = dialog.dataSourceCur.dataSets;
						if(dataSets != null){
							var dataSet = dataSets[index];
							MapCloud.new_layer_dialog.setDataSet(dialog.dataSourceCur,
									dataSet);
						}
					}
				}
				dialog.closeDialog();
			});
		});

		//页面设置
		// 首页
		this.panel.find(".glyphicon-step-backward").each(function(){
			$(this).click(function(){
				dialog.setDataSetFeaturePage(1);
			});
		});

		//末页
		this.panel.find(".glyphicon-step-forward").each(function(){
			$(this).click(function(){
				var count = parseInt(dialog.panel
					.find(".pages-form-pages").html());
				dialog.setDataSetFeaturePage(count);
			});
		});

		//上一页
		this.panel.find(".glyphicon-chevron-left").each(function(){
			$(this).click(function(){
				var page = parseInt(dialog.panel
					.find(".pages-form-page").val());
				dialog.setDataSetFeaturePage(page - 1);
			});	
		});

		//下一页
		this.panel.find(".glyphicon-chevron-right").each(function(){
			$(this).click(function(){
				var page = parseInt(dialog.panel
					.find(".pages-form-page").val());
				dialog.setDataSetFeaturePage(page + 1);
			});
		});

		//导入
		this.panel.find("#import-vector-btn").click(function(){
			// 弹出导入对话框
			MapCloud.importVector_dialog.showDialog();
			MapCloud.importVector_dialog.setDataSource(dialog.dataSourceNameCur);
		});

		//删除dataset
		this.panel.find("#remove-dataset").click(function(){
			var dataSetSel = dialog.panel.find("#datasets_div .list-group-item.selected");
			if(dataSetSel.length == 0){
				MapCloud.alert_info.showInfo("请选择一个dataSet","Warning");
				return;
			}
			var index = dataSetSel.attr("index");
			if(dialog.dataSourceCur != null){
				var dataSets = dialog.dataSourceCur.dataSets;
				if(dataSets != null){
					var dataSet = dataSets[index];
					MapCloud.alert_info.loading();
					// 删除数据
					dialog.dataSourceCur.removeDataSet(dataSet.name,
						dialog.removeDataSet_callback);
				}
			}
		});
	},

	cleanup : function(){
		this.dataSetCur = null;
		this.dataSourceNameCur = null;
		this.dataSourceCur = null;
		this.panel.find("#datasets_div list-group").html("");
		this.panel.find("#dataset_fields table tbody").html("");
		this.panel.find("#dataset_features_list table thead tr").html("");
		this.panel.find("#dataset_features_list table tbody").html("");
		this.panel.find("#dataset_preview_img").attr("src","");
		this.panel.find(".query_count span").html(0);
		this.panel.find(".pages-form-page").val(0);
		this.panel.find(".pages-form-pages").html(0);
		this.panel.find("#dataset_features .glyphicon")
			.addClass("disabled");
	},

	showDialog : function(flag){
		if(flag == "select"){
			// 从新建图层过来的
			this.isSelected = true;
			this.panel.find(".btn-confirm").html("选择");
		}else{
			this.isSelected = false;
			this.panel.find(".btn-confirm").html("确定");
		}
		MapCloud.alert_info.loading();
		this.cleanup();
		// 初始化时获得数据源列表
		dbsManager.getDataSources(this.getDataSources_callback);
		this.panel.modal();
	},

	// 返回数据源列表
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

		// 展示第一个数据源
		dialog.dataSourceNameCur = 
			panel.find("#data_source_list option:selected").val();
		dialog.getDataSource(dialog.dataSourceNameCur);
	},

	// 展示数据源
	getDataSource : function(dataSourceName){
		if(dataSourceName == null){
			return;
		}
		dbsManager.getDataSource(dataSourceName,
				this.getDataSource_callback);
	},

	// 返回数据源
	getDataSource_callback : function(dataSource){
		if(dataSource == null){
			return;
		}
		var dialog = MapCloud.data_source_dialog
		var panel = dialog.panel;
		dialog.dataSourceCur = dataSource;
		// 获得数据列表
		dialog.getDataSets(dialog.dataSourceCur);
	},

	// 获得数据列表
	getDataSets : function(dataSource){
		if(dataSource == null){
			return;
		}
		dataSource.getDataSets(this.getDataSets_callback);
	},

	// 返回数据列表
	getDataSets_callback : function(dataSets){
		if(dataSets == null){
			return;
		}
		var dialog = MapCloud.data_source_dialog;
		var panel = dialog.panel;

		var html = dialog.getDataSetsHtml(dataSets);
		panel.find("#datasets_div list-group").html(html);
		dialog.registerDataSourceSelected();
	},

	// 获得数据源的列表html
	getDataSetsHtml : function(dataSets){
		var dataSet = null;
		var name,srid,geometryType;
		var html = "";
		var typeHtml = "";
		for(var i = 0; i < dataSets.length;++i){
			dataSet = dataSets[i];
			name = dataSet.name;
			geometryType = dataSet.geometryType;
			typeHtml = MapCloud.getLayerGeomTypeHtml(geometryType);
			html += "<a href='#' class='list-group-item' index='"
				 + 		i + "'>"
				 + 		typeHtml
				 + 		"<span class='dataset-name'>" + name + "</span>" 
				 + 	"</a>";
		}
		return html;
	},

	//选择一个数据源
	registerDataSourceSelected : function(){
		var dialog = this;
		this.panel
			.find("#datasets_div div a").each(function(){
				$(this).click(function(){
					$(this).parent().children().removeClass("selected");
					$(this).addClass("selected");
					var index = $(this).attr("index");
					if(dialog.dataSourceCur != null){
						var dataSets = dialog.dataSourceCur.dataSets;
						if(dataSets != null){
							dialog.panel.find("#dataset_fields table tbody").html("");
							dialog.panel.find("#dataset_features_list table thead tr").html("");
							dialog.panel.find("#dataset_features_list table tbody").html("");
							dialog.panel.find("#dataset_preview_img").attr("src","");
							dialog.panel.find(".pages-form-page").val(0);
							dialog.panel.find(".pages-form-pages").html(0);
							dialog.panel.find("#dataset_features .glyphicon")
								.addClass("disabled");
							var dataSet = dataSets[index];
							dialog.dataSetCur = dataSet;
							// 展示数据
							dialog.displayDataSet(dataSet);
						}
					}
				}).dblclick(function(){ //注册双击事件，返回到新建图层里面
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

	// 注销数据源
	unRegisterDataSource : function(dataSourceName){
		if(dataSourceName == null){
			return;
		}
		MapCloud.alert_info.loading();
		dbsManager.unRegisterDataSource(dataSourceName,
			this.unRegisterDataSource_callback);
	},

	// 返回注销数据源结果
	unRegisterDataSource_callback : function(result){
		var dialog = MapCloud.data_source_dialog;
		var name = dialog.panel
					.find("#data_source_list option:selected").val();
		var info = "注销数据源 [ " + name + " ]";
		MapCloud.alert_info.showInfo(result,info);
		var dialog = MapCloud.data_source_dialog;
		// 展示第一个数据源
		dbsManager.getDataSources(dialog.getDataSources_callback);
	},

	// 展示数据
	displayDataSet : function(dataSet){
		if(dataSet == null){
			return;
		}
		this.displayDataSetFields(dataSet);
		this.displayDataSetFeatures(dataSet);
		this.displayDataSetPreview(dataSet);
	},

	//展示字段 
	displayDataSetFields : function(dataSet){
		if(dataSet == null){
			return;
		}
		var fields = dataSet.getFields();
		var html = "";
		var field = null;
		var name = null;
		var type = null;
		for(var i = 0; i < fields.length; ++i){
			field = fields[i];
			name = field.name;
			type = field.type;
			html += "<tr>"
				+ 	"	<td>"
				+ 			name 
				+ 	"	</td>"
				+ 	"	<td>"
				+ 			type
				+ 	"	</td>"
				+	"</tr>";
		}
		this.panel.find("#dataset_fields table tbody").html(html);
	},

	// 展示元素
	displayDataSetFeatures : function(dataSet){
		if(dataSet == null){
			return;
		}
		var fields = dataSet.getFields();
		if(fields == null){
			return;
		}
		this.displayDataSetFeaturesFields(fields);

		//设置页码
		var count = dataSet.getFeatureCount();
		var pageCount = Math.ceil(count/this.maxFeatures);
		this.panel.find(".pages-form-pages").html(pageCount);
		this.panel.find(".query_count span").html(count);
		// 获得第一页数据
		if(pageCount >= 1){
			this.setDataSetFeaturePage(1);
		}
	},

	//设置页码
	setDataSetFeaturePage : function(page){
		var pageCount = parseInt(this.panel
				.find(".pages-form-pages").html());
		this.panel.find(".pages-form-page").val(page);
		if(page　== 1 ){
			this.panel.find(".glyphicon-step-backward")
				.addClass("disabled");
		}else{
			this.panel.find(".glyphicon-step-backward")
				.removeClass("disabled");
		}
		if(page == pageCount){
			this.panel.find(".glyphicon-step-forward")
				.addClass("disabled");
		}else{
			this.panel.find(".glyphicon-step-forward")
				.removeClass("disabled");
		}

		if(page - 1 <= 0){
			this.panel.find(".glyphicon-chevron-left")
				.addClass("disabled");
		}else{
			this.panel.find(".glyphicon-chevron-left")
				.removeClass("disabled");
		}

		if(page + 1 > pageCount){
			this.panel.find(".glyphicon-chevron-right")
				.addClass("disabled");
		}else{
			this.panel.find(".glyphicon-chevron-right")
				.removeClass("disabled");
		}

		var offset = ( page -1 ) * this.maxFeatures;
		var features = this.dataSetCur.getFeatures(this.maxFeatures, offset); 
		this.displayFeatures(features);
	},

	// 设置展示元素中的字段表头
	displayDataSetFeaturesFields : function(fields){
		if(fields == null){
			return;
		}
		var field = null;
		var name = null;
		var html = "";
		var widthAll = 0;
		for(var i = 0; i < fields.length; ++i){
			field = fields[i];
			if(field.type != "geometry"){
				name = field.name;
				html += "<th width='80'>"
				+ 		name 
				+ 	"</th>";
				widthAll += 1;
			}
		}
		this.panel.find("#dataset_features_list table thead tr")
			.html(html);

		var widthAllWidth = 80*widthAll;
		var divWidth = parseFloat(this.panel
			.find("#dataset_features_list").width());
		if(widthAllWidth < divWidth){
			this.panel.find("#dataset_features_list table thead tr th")
				.attr("width",Math.ceil(divWidth/widthAll));
		}else{
			this.panel.find("#dataset_features_list table")
			.css("width",widthAllWidth + "px");
		}
	},

	// 展示元素
	displayFeatures : function(features){
		if(features == null){
			return;
		}
		var html = "";
		var feature = null;
		var values = null;
		var value = null;
		for(var i = 0; i < features.length;++i){
			feature = features[i];
			if(feature == null){
				continue;
			}
			values = feature.values;
			if(values == null){
				continue;
			}
			html += "<tr>";
			for(var j = 0; j < values.length; ++j){
				value = values[j];
				if(value == null){
					continue;
				}
				if(value instanceof GeoBeans.Geometry){
					continue;
				}
				html += "<td>" +  value + "</td>";
			}
			html += "</tr>";
		}

		this.panel
			.find("#dataset_features_list table tbody").html(html);
	},

	// 展示预览图
	displayDataSetPreview : function(dataSet){
		if(dataSet == null){
			return;
		}

		var height = this.panel.find("#dataset_preview_img").height();
		var width = this.panel.find("#dataset_preview_img").width();

		var url = dataSet.getPreview(width,height);
		this.panel.find("#dataset_preview_img").attr("src",url);
	},

	//刷新当前datasource
	refreshDatasource : function(){
		this.cleanup();
		this.dataSourceNameCur = 
			this.panel.find("#data_source_list option:selected").val();
		this.getDataSource(this.dataSourceNameCur);
	},

	// 删除数据后结果
	removeDataSet_callback : function(result){
		MapCloud.alert_info.showInfo(result,"删除dataset");		
		var dialog = MapCloud.data_source_dialog;
		dialog.refreshDatasource();
	}
});