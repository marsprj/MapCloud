MapCloud.DataSourceDialog = MapCloud.Class(MapCloud.Dialog,{
	dataSourceNameCur 	: null,
	dataSourceCur 		: null,
	dataSetCur 			: null,
	isSelected 			: null,

	maxFeatures 		: 20,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		dialog.panel.find("#datasets_tab a").each(function(){
			$(this).click(function(e){
				e.preventDefault();
				$(this).tab("show");
			});
		});

		dialog.panel.find("#data_source_list").each(function(){
			$(this).change(function(){
				dialog.cleanup();
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
					var dataSetSel = dialog.panel.find("#datasets_div .list-group-item.selected");
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
		this.panel.find(".pages-form-page").val(0);
		this.panel.find(".pages-form-pages").html(0);
		this.panel.find("#dataset_features .glyphicon")
			.addClass("disabled");
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
		this.cleanup();
		dbsManager.getDataSources(this.getDataSources_callback);
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
		panel.find("#datasets_div list-group").html(html);
		dialog.registerDataSourceSelected();
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
							dialog.displayDataSet(dataSet);
						}
					}

					
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
	},

	displayDataSet : function(dataSet){
		if(dataSet == null){
			return;
		}
		this.displayDataSetFields(dataSet);
		this.displayDataSetFeatures(dataSet);
		this.displayDataSetPreview(dataSet);
	},

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
		this.setDataSetFeaturePage(1);
		
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

	displayFeatures : function(features){
		// alert(features.length);
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

	displayDataSetPreview : function(dataSet){
		if(dataSet == null){
			return;
		}

		var height = this.panel.find("#dataset_preview_img").height();
		var width = this.panel.find("#dataset_preview_img").width();

		var url = dataSet.getPreview(width,height);
		this.panel.find("#dataset_preview_img").attr("src",url);
	}




});