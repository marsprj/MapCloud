MapCloud.VectorDBDialog = MapCloud.Class(MapCloud.Dialog,{
	dataSourceCur : null,
	// 每页显示的个数
	maxFeatures 	: 20,

	flag 			: null,

	// 新增数据源的名称
	registerDataSourceName : null,


	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);

		this.registerPanelEvent();

	},

	// 注册页面的各种事件
	registerPanelEvent : function(){
		var dialog = this;

		this.panel.find('[data-toggle="tooltip"]').tooltip({container: 'body'});

		// 选择
		this.panel.find(".btn-confirm").click(function(){
			if(dialog.flag == null){
				dialog.closeDialog();
				return;
			}

			var table = dialog.panel.find(".tree-table.selected");
			var index = table.attr("dindex");
			if(index == null){
				MapCloud.notify.showInfo("请选择一个数据","Warning");
				return;
			}
			if(dialog.dataSourceCur == null){
				MapCloud.notify.showInfo("当前数据库为空","Warning");
				return;
			}
			var dataSets = dialog.dataSourceCur.dataSets;
			if(dataSets == null){
				MapCloud.notify.showInfo("当前数据库为空","Warning");
				return;
			}
			var dataSet = dataSets[index];
			var parentDialog = null;
			switch(dialog.flag){
				case "select":{
					parentDialog = MapCloud.new_layer_dialog;
					MapCloud.new_layer_dialog.setDataSet(dialog.dataSourceCur,dataSet);
					break;
				}
				case "range":{
					parentDialog = MapCloud.chart_panel;
					parentDialog.setDataSet(dialog.dataSourceCur.name,dataSet.name);
					break;
				}
				case "bar":{
					parentDialog = MapCloud.bar_chart_panel;
					parentDialog.setDataSet(dialog.dataSourceCur.name,dataSet.name);
					break;
				}
				case "pie":{
					parentDialog = MapCloud.pie_chart_panel;
					parentDialog.setDataSet(dialog.dataSourceCur.name,dataSet.name);
					break;
				}
				case "kmean":{
					parentDialog = MapCloud.gps_kmean_dialog;
					parentDialog.setDataSet(dialog.dataSourceCur.name,dataSet.name);
					break;
				}
				case "featureProject":{
					parentDialog = MapCloud.gps_feature_project_dialog;
					parentDialog.setDataSet(dialog.dataSourceCur.name,dataSet);
					break;
				}
				case "csvImport":{
					if(dataSet.geometryType != null){
						MapCloud.notify.showInfo("请选择一个属性数据","Warning");
						return;
					}
					parentDialog = MapCloud.gps_csv_import_dialog;
					parentDialog.setDataSet(dialog.dataSourceCur.name,dataSet);
					break;
				}
				case "getArea":{
					parentDialog = MapCloud.gps_get_area_dialog;
					parentDialog.setDataSet(dialog.dataSourceCur.name,dataSet.name);
					break;
				}
				case "getLength":{
					parentDialog = MapCloud.gps_get_length_dialog;
					parentDialog.setDataSet(dialog.dataSourceCur.name,dataSet.name);
					break;
				}
				case "buffer":{
					parentDialog = MapCloud.gps_buffer_dialog;
					var fields = dataSet.getFields();
					parentDialog.setDataSet(dialog.dataSourceCur.name,dataSet.name,fields);
				}
				case "centroid":{
					parentDialog = MapCloud.gps_centroid_dialog;
					parentDialog.setDataSet(dialog.dataSourceCur.name,dataSet.name);
					break;
				}
				case "convexHull":{
					parentDialog = MapCloud.gps_convex_hull_dialog;
					parentDialog.setDataSet(dialog.dataSourceCur.name,dataSet.name);
					break;
				}
				case "multiPointToPoints":{
					parentDialog = MapCloud.gps_multi_point_to_points_dialog;
					parentDialog.setDataSet(dialog.dataSourceCur.name,dataSet.name);
				}
				case "lineToPoints":{
					parentDialog = MapCloud.gps_line_to_points_dialog;
					parentDialog.setDataSet(dialog.dataSourceCur.name,dataSet.name);
					break;
				}
				case "polygonToPoints":{
					parentDialog = MapCloud.gps_polygon_to_points_dialog;
					parentDialog.setDataSet(dialog.dataSourceCur.name,dataSet.name);
					break;
				}
				case "polygonToLine":{
					parentDialog = MapCloud.gps_polygon_to_line_dialog;
					parentDialog.setDataSet(dialog.dataSourceCur.name,dataSet.name);
					break;
				}
				case "genRandomPointsInPolgyon":{
					parentDialog = MapCloud.gps_gen_random_points_in_polygon_dialog;
					parentDialog.setDataSet(dialog.dataSourceCur.name,dataSet.name);
				}
				case "delaunay":{
					parentDialog = MapCloud.gps_delaunay_dialog;
					var fields = dataSet.getFields();
					parentDialog.setDataSet(dialog.dataSourceCur.name,dataSet.name,fields);
				}
				default:{
					break;
				}
			}

			dialog.closeDialog();

		});

		// 新建数据库
		this.panel.find(".btn-add-server").click(function(){
			MapCloud.pgis_connection_dialog.showDialog("feature");
		});

		// 删除数据库
		this.panel.find(".btn-remove-server").click(function(){
			dialog.removeDataSource();
		});


		// 切换数据库
		this.panel.find(".db-list").change(function(){
			var dbName = $(this).val();
			dialog.getDataSource(dbName);
		});



		// 导入
		this.panel.find(".btn-import").click(function(){
			var dbName = dialog.panel.find(".db-list").val();
			if(dbName == null){
				MapCloud.notify.showInfo("请先选择一个数据源","Warning");
				return;
			}
			MapCloud.import_dialog.showDialog("vector");
			MapCloud.import_dialog.setDataSourceName(dbName);
		});

		// 导入CSV
		this.panel.find(".btn-import-csv").click(function(){
			var dbName = dialog.panel.find(".db-list").val();
			if(dbName == null){
				MapCloud.notify.showInfo("请先选择一个数据源","Warning");
				return;
			}
			MapCloud.importCSV_dialog.showDialog();
			MapCloud.importCSV_dialog.setDataSourceName(dbName);
		});

		// 增加
		this.panel.find(".btn-create-dataset").click(function(){
			dialog.createDataSet();
		});

		// 删除
		this.panel.find(".btn-remove-dataset").click(function(){
			dialog.removeDataset();
		});

		// 刷新
		this.panel.find(".btn-refresh").click(function(){
			dialog.refresh();
		});

		// server pane 展示方式
		// 详细信息
		this.panel.find(".btn-infos").click(function(){
			$(this).attr("disabled",true);
			dialog.panel.find(".btn-thum").attr("disabled",false);
			dialog.panel.find(".table-pane").css("display","none")
			dialog.panel.find(".server-pane").css("display","block")
			dialog.panel.find(".server-pane .db-content").css("display","none");
			dialog.panel.find(".db-infos-pane").css("display","block");
			dialog.panel.find(".table-tree .nav a.selected").removeClass("selected");
		});

		this.panel.find(".btn-thum").click(function(){
			$(this).attr("disabled",true);
			dialog.panel.find(".btn-infos").attr("disabled",false);
			dialog.panel.find(".table-pane").css("display","none")
			dialog.panel.find(".server-pane").css("display","block")
			dialog.panel.find(".server-pane .db-content").css("display","none");
			dialog.panel.find(".db-thum-pane").css("display","block");
			dialog.panel.find(".table-tree .nav a.selected").removeClass("selected");
		});

		// table pane
		// 刷新dataset
		this.panel.find(".table-pane .btn-refresh-dataset").click(function(){
			var selectDataSet = dialog.panel.find(".tree-table.selected");
			var index = selectDataSet.attr("dindex");
			if(dialog.dataSourceCur != null){
				var dataSets = dialog.dataSourceCur.dataSets;
				if(dataSets != null){
					var dataSet = dataSets[index];
					if(dataSet != null){
						dialog.dataSourceCur.refresh(dataSet.name,dialog.refreshDataSet_callback);
					}
				}
			}
		});	


		// 展示信息
		dialog.panel.find("#show-dataset-infos").click(function(){
			dialog.panel.find(".table-pane .btn-group .btn").attr("disabled",false);
			$(this).attr("disabled",true);
			if(dialog.dataSetCur != null){
				if(dialog.dataSetCur.geometryType == null){
					dialog.panel.find("#show-dataset-preview").attr("disabled",true);
				}
			}
			dialog.showDataSetInfosPanel(dialog.dataSetCur);
		});

		// 展示字段
		dialog.panel.find("#show-dataset-fields").click(function(){
			// dialog.panel.find(".table-pane .btn-group-justified .btn")
			// 	.removeClass("selected");
			// dialog.panel.find(".table-pane #show-dataset-fields").addClass("selected");

			dialog.panel.find(".table-pane .btn-group .btn").attr("disabled",false);
			$(this).attr("disabled",true);
			if(dialog.dataSetCur != null){
				if(dialog.dataSetCur.geometryType == null){
					dialog.panel.find("#show-dataset-preview").attr("disabled",true);
				}
			}
			dialog.showDataSetFieldsPanel(dialog.dataSetCur);
			// // 第一次就已经绘制了
			// dialog.panel.find(".dataset-pane").css("display","none");
			// dialog.panel.find("#dataset_fields").css("display","block");
		});

		// 展示列表
		dialog.panel.find("#show-dataset-features").click(function(){
			// dialog.panel.find(".table-pane .btn-group-justified .btn")
			// 	.removeClass("selected");
			// dialog.panel.find(".table-pane #show-dataset-features").addClass("selected");
			dialog.panel.find(".table-pane .btn-group .btn").attr("disabled",false);
			$(this).attr("disabled",true);
			if(dialog.dataSetCur != null){
				if(dialog.dataSetCur.geometryType == null){
					dialog.panel.find("#show-dataset-preview").attr("disabled",true);
				}
			}
			dialog.showDataSetFeaturesPanel(dialog.dataSetCur);
			// dialog.panel.find(".dataset-pane").css("display","none");
			// dialog.panel.find("#dataset_features").css("display","block");
		});

		// 展示预览
		dialog.panel.find("#show-dataset-preview").click(function(){
			// dialog.panel.find(".table-pane .btn-group-justified .btn")
			// 	.removeClass("selected");
			// dialog.panel.find(".table-pane #show-dataset-preview").addClass("selected");
			dialog.panel.find(".table-pane .btn-group .btn").attr("disabled",false);
			$(this).attr("disabled",true);

			dialog.showDataSetPreviewPanel(dialog.dataSetCur);
			// dialog.panel.find(".dataset-pane").css("display","none");
			// dialog.panel.find("#dataset_preview").css("display","block");
		});

		//页面设置
		// 首页
		this.panel.find(".glyphicon-step-backward").each(function(){
			$(this).click(function(){
				var pageCount = parseInt(dialog.panel.find(".pages-form-pages").html());
				if(pageCount >= 1){
					dialog.setDataSetFeaturePage(1);
				}
			});
		});

		//末页
		this.panel.find(".glyphicon-step-forward").each(function(){
			$(this).click(function(){
				var count = parseInt(dialog.panel
					.find(".pages-form-pages").html());
				if(count >= 1){
					dialog.setDataSetFeaturePage(count);
				}
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

	showDialog : function(flag){
		MapCloud.notify.loading();
		this.cleanup();
		this.panel.modal();

		this.getDataSources();
		this.flag = flag;
		if(this.flag == null){
			// this.panel.find(".btn-confirm").html("确定");
			this.panel.find(".modal-footer").css("display","none");
		}else{
			this.panel.find(".btn-confirm").html("选择");
			this.panel.find(".modal-footer").css("display","block");
		}
	},


	getDataSources  : function(){
		dbsManager.getDataSources(this.getDataSources_callback,"Feature");
	},

	cleanup : function(){
		this.flag = null;
		this.registerDataSourceName = null;
		this.panel.find(".db-pane").css("display","none");
		this.panel.find(".server-pane").css("display","block");
		this.panel.find(".db-list").empty();
		this.panel.find(".db-list-div .nav").html("");
		this.panel.find(".db-infos-pane table tbody").html("");
		this.panel.find(".db-thum-pane ul").html("");
		this.panel.find(".table-pane #dataset_infos table tbody").html("");
		this.panel.find(".table-pane #dataset_fields table tbody").html("");
		this.panel.find("#dataset_features_list table thead tr").html("");
		this.panel.find(".table-pane #dataset_features table tbody").html("");
		this.panel.find(".table-pane #dataset_preview img").css("src","");
		this.panel.find(".query_count span").html(0);
		this.panel.find(".pages-form-page").val(0);
		this.panel.find(".pages-form-pages").html(0);
	},

	getDataSources_callback : function(dataSources){
		MapCloud.notify.hideLoading();
		var dialog = MapCloud.vector_db_dialog;
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
			this.getDataSource(this.registerDataSourceName);
			this.registerDataSourceName = null;
		}else{
			var currentDB = this.panel.find(".db-list").val();
			if(currentDB != null && currentDB != ""){
				this.getDataSource(currentDB);
			}
		}

	
	},

	// 获取数据库
	getDataSource : function(dataSourceName){
		if(dataSourceName == null){
			return;
		}
		MapCloud.notify.loading();
		this.panel.find(".db-infos-pane table tbody").html("");
		this.panel.find(".db-thum-pane ul").html("");
		this.panel.find(".table-tree .nav").html("");
		this.panel.find(".query_count span").html(0);
		this.panel.find(".pages-form-page").val(0);
		this.panel.find(".pages-form-pages").html(0);
		this.panel.find(".table-pane #dataset_infos table tbody").html("");
		this.panel.find(".table-pane #dataset_fields table tbody").html("");
		this.panel.find("#dataset_features_list table thead tr").html("");
		this.panel.find(".table-pane #dataset_features table tbody").html("");
		this.panel.find(".table-pane #dataset_preview img").css("src","");
		dbsManager.getDataSource(dataSourceName,
				this.getDataSource_callback);
	},

	getDataSource_callback : function(dataSource){
		MapCloud.notify.hideLoading();
		var dialog = MapCloud.vector_db_dialog;
		dialog.dataSourceCur = dataSource;
		dialog.getDataSets(dataSource);
	},

	// 获得数据库下面的表格
	getDataSets : function(dataSource){
		if(dataSource == null){
			return;
		}
		MapCloud.notify.loading();
		this.panel.find(".table-tree .nav").html("");
		this.panel.find(".db-infos-pane table tbody").html("");
		dataSource.getDataSets(this.getDataSets_callback);
	},

	getDataSets_callback  : function(dataSets){
		MapCloud.notify.hideLoading();
		var dialog = MapCloud.vector_db_dialog;
		dialog.showDataSets(dataSets);
		dialog.showDataSetsPanel(dataSets);	
	},
	// 展示表格名称列表
	showDataSets : function(dataSets){
		if(dataSets == null){
			return;
		}
		var dialog = this;
		if(this.dataSourceCur == null){
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
			geomTypeHtml = this.getDataSetGeomTypeHtml(geomType);
			html += "<li>"
				+ 	"	<a href='#' class='tree-table' dindex='"
				+		i + "'>"
				+ 		geomTypeHtml
				+	"		<span title='" + name + "'>"	 + name + "</span>"
				+	"	</a>"
				+	"</li>";
		}
		dialog.panel.find(".table-tree .nav").html(html);

		dialog.panel.find(".tree-table").click(function(){
			var currentIndex = $(this).attr("dindex");
			var selectedIndex = dialog.panel.find(".table-tree .nav a.selected").attr("dindex");
			if(currentIndex == selectedIndex){
				return;
			}
			dialog.panel.find(".table-tree .nav a.selected").removeClass("selected");
			$(this).addClass("selected");
			var dataSetName = $(this).find("span").html();
			dialog.getDataSet(dataSetName);
			
		});
	},

	getDataSetGeomTypeHtml : function(geomType){
		var html = "";
		switch(geomType){
			case GeoBeans.Geometry.Type.POINT:
			case GeoBeans.Geometry.Type.MULTIPOINT:{
				html = '<i class="mc-db-icon mc-db-icon-dataset-point"></i>';
				break;
			}
			case GeoBeans.Geometry.Type.LINESTRING:
			case GeoBeans.Geometry.Type.MULTILINESTRING:{
				html = '<i class="mc-db-icon mc-db-icon-dataset-line"></i>';
				break;
			}
			case GeoBeans.Geometry.Type.POLYGON:
			case GeoBeans.Geometry.Type.MULTIPOLYGON:{
				html = '<i class="mc-db-icon mc-db-icon-dataset-polygon"></i>';
				break;
			}
			default :{
				html = '<i class="mc-db-icon mc-db-icon-dataset"></i>';
				break;
			}
		};
		return html;
	},

	showDataSetsPanel : function(dataSets){
		this.panel.find(".db-pane").css("display","none");
		this.panel.find(".server-pane").css("display","block");

		var dialog = this;


		// 详细信息
		var dataSet = null;
		var name = null;
		var geomType = null;
		var srid = null;
		var html = "";
		for(var i = 0; i < dataSets.length;++i){
			dataSet = dataSets[i];
			name = dataSet.name;
			geomType = dataSet.geometryType;
			if(geomType == null){
				geomType = "";
			}
			srid = dataSet.srid;
			if(srid == null){
				srid = "";
			}
			html += "<tr>"
			+	"		<td><input type='checkbox'></td>"
			+	"		<td class='dataset-name' dindex='" +
						+ i + "'>" + name + "</td>"
			+	"		<td>" + geomType + "</td>"
			+	"		<td>" + srid + "</td>"
			+	"</tr>";
		}
		this.panel.find(".server-pane .db-infos-pane table tbody").html(html);

		// 单击进入
		this.panel.find(".server-pane .dataset-name").click(function(){
			var index = $(this).attr("dindex");
			if(dialog.dataSourceCur != null){
				var name = $(this).text();
				dialog.getDataSet(name);
				dialog.panel.find(".table-tree .nav li a[dindex='" + index + "']").addClass("selected");
			}
		});


		// 缩略图
		html = "";
		var thumbnail = null;
		for(var i = 0; i < dataSets.length; ++i){
			dataSet = dataSets[i];
			name = dataSet.name;
			geomType = dataSet.geometryType;
			if(geomType == null){
				continue;
			}
			thumbnail = dataSet.thumbnail;
			if(thumbnail != null){
				
				html += "<li>"
				+ "<a href='#' class='dataset-thum' dindex='" + i 
				+ "' style='background-image:url(" + thumbnail + ")'></a>";
			}
			html += "<div class='caption text-center'><h6 title='" + name + "'>" + name + "</h6></div></li>";
		}
		this.panel.find(".server-pane .db-thum-pane ul").html(html);

		this.panel.find(".server-pane .db-thum-pane .dataset-thum").dblclick(function(){
			$(this).addClass("selected");
			var index = $(this).attr("dindex");
			if(dialog.dataSourceCur != null){
				var name = $(this).parent().find("h6").text();
				dialog.getDataSet(name);
				dialog.panel.find(".table-tree .nav li a").removeClass("selected");
				dialog.panel.find(".table-tree .nav li a[dindex='" + index + "']").addClass("selected");
			}
		}).hover(function(){
			dialog.panel.find(".server-pane .db-thum-pane .dataset-thum").removeClass('selected');
			$(this).addClass("selected");
		});



	},

	// 删除dataSet
	removeDataset : function(){
		var selectedDataSetName = MapCloud.vector_db_dialog.panel
		.find(".table-tree .tree-table.selected span").html();
		if(selectedDataSetName!= null){
			// 删除当前的dataset
			if(!confirm("确定要删除数据[" + selectedDataSetName + "]吗?")){
				return;
			}
			this.dataSourceCur.removeDataSet(selectedDataSetName,this.removeDataSet_callback);
			return;
		}

		var dialog = this;
		var checkboxs = this.panel.find(".server-pane .db-infos-pane table input[type='checkbox']:checked");
		if(checkboxs.length == 0){
			MapCloud.notify.showInfo("请选择要删除的数据","Warning");
			return;
		}
		if(!confirm("确定要删除吗？")){
			return;
		}
		var dialog = this;
		checkboxs.parents("tr").find(".dataset-name").each(function(){
			var name = $(this).html();
			dialog.dataSourceCur.removeDataSet(name,dialog.removeDataSet_callback);
		});
	},

	removeDataSet_callback : function(result){
		var info = "注销图层";
		MapCloud.notify.showInfo(result,info);
		var dialog = MapCloud.vector_db_dialog;
		dialog.panel.find(".server-pane table tbody").html("");
		dialog.getDataSets(dialog.dataSourceCur);
	},

	// 获取dataSet
	getDataSet : function(dataSetName){
		if(this.dataSourceCur == null){
			return;
		}
		this.dataSourceCur.getDataSet(dataSetName,this.getDataSet_callback);
	},

	getDataSet_callback : function(dataSet){
		var dialog = MapCloud.vector_db_dialog;
		dialog.showDataSetPanel(dataSet);
	},

	showDataSetPanel : function(dataSet){
		this.dataSetCur = dataSet;

		this.panel.find(".db-pane").css("display","none");
		this.panel.find(".table-pane").css("display","block");
		this.panel.find(".table-pane .dataset-pane").css("display","none");

		this.panel.find(".table-pane #dataset_fields").css("display","block");

		// this.panel.find(".table-pane .btn-refresh-dataset").attr("disabled","false");

		// this.panel.find(".table-pane .btn-group .btn").attr("disabled",false);
		// this.panel.find("#show-dataset-fields").attr("disabled",true);
		// 显示上一次的那个
		var btnId = this.panel.find(".table-pane .btn-group .btn[disabled='disabled']").attr("id")
		if(dataSet.geometryType == null){
			this.panel.find("#show-dataset-preview").attr("disabled",true);
			if(btnId == "show-dataset-preview"){
				this.panel.find(".table-pane .btn-group .show-dataset-infos").attr("disabled",true);
				btnId = "show-dataset-infos";
			}
		}else{
			if(btnId != "show-dataset-preview"){
				this.panel.find("#show-dataset-preview").attr("disabled",false);
			}
		}
		switch(btnId){
			case "show-dataset-infos":{
				this.showDataSetInfosPanel(dataSet);
				break;
			}
			case "show-dataset-fields":{
				this.showDataSetFieldsPanel(dataSet);
				break;
			}
			case "show-dataset-features":{
				this.showDataSetFeaturesPanel(dataSet);
				break;
			}
			case "show-dataset-preview":{
				this.showDataSetPreviewPanel(dataSet);
				break;
			}
			default:
			break;
		}

		// // 只展示字段
		// this.showDataSetFieldsPanel(dataSet);
		// this.showDataSetFeaturesPanel(dataSet);
		// this.showDataSetPreviewPanel(dataSet);
	},

	// 信息
	showDataSetInfosPanel : function(dataSet){
		this.panel.find(".dataset-pane").css("display","none");
		this.panel.find("#dataset_infos").css("display","block");
		this.panel.find(".table-pane #dataset_infos table tbody").html("");
		if(dataSet == null){
			return;
		}
		html = "<tr>"
			+ "<td>名称</td>"
			+ "<td>" + dataSet.name + "</td>"
			+ "</tr>";
		if(dataSet.type != null){
			html += "<tr>"
			+ "<td>类型</td>"
			+ "<td>" + dataSet.type + "</td>"
			+ "</tr>"; 
		}

		var geomType = dataSet.geometryType;
		if(geomType != null){
			html +=  "<tr>"
			+ "<td>几何类型</td>"
			+ "<td>" + geomType + "</td>"
			+ "</tr>";
		}

		var count = dataSet.count;
		if(count != null){
			html +=  "<tr>"
			+ "<td>个数</td>"
			+ "<td>" + count + "</td>"
			+ "</tr>";			
		}
		var srid = dataSet.srid;
		if(srid != null){
			html +=  "<tr>"
			+ "<td>空间参考</td>"
			+ "<td>" + srid + "</td>"
			+ "</tr>";		
		}
		var extent = dataSet.extent;
		if(extent != null){
			html += '	<tr>'
			+ '		<td>范围</td>'
			+ '		<td>东 :' + extent.xmax + "</td>"
			+ '	</tr>'
			+ '	<tr>'
			+ '		<td></td>'
			+ '		<td>西 :' + extent.xmin + "</td>"
			+ '	</tr>'
			+ '	<tr>'
			+ '		<td></td>'
			+ '		<td>南 :' + extent.ymin + "</td>"
			+ '	</tr>'
			+ '	<tr>'
			+ '		<td></td>'
			+ '		<td>北 :' + extent.ymax + "</td>"
			+ '	</tr>'				
		}
		this.panel.find(".table-pane #dataset_infos table tbody").html(html);
	},
	// 字段
	showDataSetFieldsPanel : function(dataSet){
		this.panel.find(".dataset-pane").css("display","none");
		this.panel.find("#dataset_fields").css("display","block");
		this.panel.find(".table-pane #dataset_fields table tbody").html("");
		if(dataSet == null){
			return;
		}
		var fields = dataSet.getFields();
		if(fields == null){
			return;
		}
		var html = "";
		var field = null;
		var name = null;
		var type = null;
		var length = null;
		for(var i = 0; i < fields.length; ++i){
			field = fields[i];
			name = field.name;
			type = field.type;
			length = field.length;
			html += "<tr>"
				+ 	"	<td>"
				+ 			name 
				+ 	"	</td>"
				+ 	"	<td>"
				+ 			type
				+ 	"	</td>"
				+ 	"	<td>"
				+ 			((length == null)?"":length)
				+ 	"	</td>"				
				+	"</tr>";
		}
		this.panel.find("#dataset_fields table tbody").html(html);
	},

	// 列表
	showDataSetFeaturesPanel : function(dataSet){
		this.panel.find(".dataset-pane").css("display","none");
		this.panel.find("#dataset_features").css("display","block");

		if(dataSet == null){
			return;
		}

		var dsName = this.panel.find(".table-pane #dataset_features").attr("dsname");
		if(dsName == null){
			this.panel.find(".table-pane #dataset_features").attr("dsname",dataSet.name);
		}
		// // 当前图层
		// if(dsName == dataSet.name){
		// 	return;
		// }
		// 切换了图层
		this.panel.find(".table-pane #dataset_features").attr("dsname",dataSet.name);
		this.panel.find(".table-pane #dataset_features table tbody").html("");
		var fields = dataSet.getFields();
		if(fields == null){
			return;
		}
		this.displayDataSetFeaturesFields(fields);

		//设置页码
		// var count = dataSet.getFeatureCount();
		var count = dataSet.count;
		var pageCount = Math.ceil(count/this.maxFeatures);
		this.panel.find(".pages-form-pages").html(pageCount);
		this.panel.find(".query_count span").html(count);
		// 获得第一页数据
		if(pageCount >= 1){
			this.setDataSetFeaturePage(1);
		}else{
			this.panel.find(".pages-form-page").val(0);
		}
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
				html += "<th width='80'><nobr>"
				+ 		name 
				+ 	"</nobr></th>";
				widthAll += 1;
			}
		}
		this.panel.find("#dataset_features_list table thead tr")
			.html(html);
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
		// var features = this.dataSetCur.getFeatures(this.maxFeatures, offset,this.getFeatures_callback); 
		// this.displayFeatures(features);
		MapCloud.notify.loading();
		var fields = this.dataSetCur.getFieldsWithoutGeom();
		this.dataSetCur.getFeatures(this.maxFeatures, offset,fields,this.getFeatures_callback); 
	},

	getFeatures_callback : function(features){
		MapCloud.notify.hideLoading();
		var dialog = MapCloud.vector_db_dialog;
		dialog.displayFeatures(features);
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

		this.panel.find("#dataset_features_list table tbody").html(html);
	},

	// 预览
	showDataSetPreviewPanel : function(dataSet){
		this.panel.find("#dataset_preview_img").attr("src",null);
		this.panel.find(".dataset-pane").css("display","none");
		this.panel.find("#dataset_preview").css("display","block");

		if(dataSet == null || dataSet.geometryType == null){
			return;
		}

		// var height = this.panel.find("#dataset_preview").css("height");
		// var width = this.panel.find("#dataset_preview").css("width");

		// height = parseFloat(height.slice(0,height.indexOf("px")));
		// width = parseFloat(width.slice(0,width.indexOf("px")));

		// var height = this.panel.find("#dataset_preview_img").attr("height");
		// var width = this.panel.find("#dataset_preview_img").attr("width");
		// height = parseFloat(height);
		// width = parseFloat(width);

		// var url = dataSet.getPreview(512,384);
		// this.panel.find("#dataset_preview_img").attr("src",url);
		this.panel.find("#dataset_preview_img").attr("src",dataSet.thumbnail);
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
		this.panel.find(".table-pane").css("display","none");
		this.panel.find(".server-pane").css("display","block");
		this.panel.find(".db-infos-pane table tbody").html("");
		this.panel.find(".table-tree .nav").html("");
		this.panel.find(".db-thum-pane ul").html("");
		this.panel.find(".query_count span").html(0);
		this.panel.find(".pages-form-page").val(0);
		this.panel.find(".pages-form-pages").html(0);
		this.panel.find(".table-pane #dataset_infos table tbody").html("");
		this.panel.find(".table-pane #dataset_fields table tbody").html("");
		this.panel.find("#dataset_features_list table thead tr").html("");
		this.panel.find(".table-pane #dataset_features table tbody").html("");
		this.panel.find(".table-pane #dataset_preview img").css("src","");
		dbsManager.unRegisterDataSource(name,this.unRegisterDataSource_callback);
	},

	unRegisterDataSource_callback : function(result){
		var info = "注销数据源";
		MapCloud.notify.showInfo(result,info);
		var dialog = MapCloud.vector_db_dialog;
		dialog.getDataSources();
	},

	// 刷新
	refresh : function(){
		var dbName = this.panel.find(".db-list").val();
		if(dbName == null){
			MapCloud.notify.showInfo("请先选择一个数据源","Warning");
			return;
		}
		this.getDataSource(dbName);
		// var selectDataSet = this.panel.find(".tree-table.selected");
		// if(selectDataSet.length == 0){
		// 	var dbName = this.panel.find(".db-list").val();
		// 	this.getDataSource(dbName);
		// }else{
		// 	var index = selectDataSet.attr("dindex");
		// 	if(this.dataSourceCur != null){
		// 		var dataSets = this.dataSourceCur.dataSets;
		// 		if(dataSets != null){
		// 			var dataSet = dataSets[index];
		// 			this.showDataSetPanel(dataSet);
		// 		}
		// 	}
		// }
	},

	// 设置新注册的数据源的名称
	setRegisterDataSourceName : function(registerDataSourceName){
		this.registerDataSourceName = registerDataSourceName;
	},


	refreshDataSet_callback : function(result){
		var dialog = MapCloud.vector_db_dialog;
		var dataSetName = dialog.panel.find(".tree-table.selected span").html();
		MapCloud.notify.showInfo(result,"刷新[" + dataSetName + "]");
		if(result == "success"){
			dialog.getDataSet(dataSetName);
		}
	},	

	// 新建表
	createDataSet : function(){
		var dbName = this.panel.find(".db-list").val();
		if(dbName == null){
			MapCloud.notify.showInfo("请先选择一个数据源","Warning");
			return;
		}
		MapCloud.create_dataset_dialog.showDialog();
		MapCloud.create_dataset_dialog.setDataSourceName(dbName);
	},
});