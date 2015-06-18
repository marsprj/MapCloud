MapCloud.DBAdminDialog = MapCloud.Class(MapCloud.Dialog,{
	dataSourceCur 	: null,

	dataSetCur 		: null,

	// 每页显示的个数
	maxFeatures 	: 20,


	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;
		dialog.panel.find(".tree-servers").click(function(){
			// var ul = dialog.panel.parent().find("ul.nav");
			var ul = $(this).next();
			if(ul.css("display") == "none"){
				ul.slideDown();
			}else if(ul.css("display") == "block"){
				ul.slideUp();
			}
			dialog.panel.find(".db-pane").css("display","none");
			dialog.panel.find(".servers-pane").css("display","block");

		});

		// 注册页面设置事件
		dialog.registerPanelEvent();
	},

	showDialog : function(){
		MapCloud.alert_info.loading();
		this.cleanup();
		this.panel.modal();
		dbsManager.getDataSources(this.getDataSources_callback);
	},

	cleanup : function(){
		this.dataSourceCur = null;
		this.dataSetCur = null;
		this.panel.find(".servers-pane table tbody").html("");
		this.panel.find(".server-pane table tbody").html("");
		this.panel.find(".table-pane #dataset_fields table tbody").html("");
		this.panel.find(".table-pane #dataset_features table tbody").html("");
		this.panel.find(".table-pane #dataset_preview img").css("src","");
		this.panel.find(".query_count span").html(0);
		this.panel.find(".pages-form-page").val(0);
		this.panel.find(".pages-form-pages").html(0);
	},

	//  注册panel中的按钮点击事件
	registerPanelEvent : function(){
		var dialog = this;
		// servers pane
		// 增加dataSource
		dialog.panel.find("#add_server").click(function(){
			MapCloud.pgis_connection_dialog.showDialog();
		});
		// 删除dataSource
		dialog.panel.find("#remove_server").click(function(){
			dialog.removeDataSource();
		});

		// server pane
		dialog.panel.find("#import-vector").click(function(){
			// 弹出导入对话框
			MapCloud.importVector_dialog.showDialog();
			MapCloud.importVector_dialog.setDataSource(dialog.dataSourceCur.name);
		});

		dialog.panel.find("#remove-dataset").click(function(){
			dialog.removeDataSet();
		});

		// table pane
		dialog.panel.find("#show-dataset-fields").click(function(){
			dialog.panel.find(".table-pane .btn-group-justified .btn")
				.removeClass("selected");
			dialog.panel.find(".table-pane #show-dataset-fields").addClass("selected");

			dialog.panel.find(".dataset-pane").css("display","none");
			dialog.panel.find("#dataset_fields").css("display","block");
		});

		dialog.panel.find("#show-dataset-features").click(function(){
			dialog.panel.find(".table-pane .btn-group-justified .btn")
				.removeClass("selected");
			dialog.panel.find(".table-pane #show-dataset-features").addClass("selected");

			dialog.panel.find(".dataset-pane").css("display","none");
			dialog.panel.find("#dataset_features").css("display","block");
		});

		dialog.panel.find("#show-dataset-preview").click(function(){
			dialog.panel.find(".table-pane .btn-group-justified .btn")
				.removeClass("selected");
			dialog.panel.find(".table-pane #show-dataset-preview").addClass("selected");

			dialog.panel.find(".dataset-pane").css("display","none");
			dialog.panel.find("#dataset_preview").css("display","block");
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

	// 数据库操作
	getDataSources_callback : function(dataSources){
		MapCloud.alert_info.hideLoading();
		var dialog = MapCloud.db_admin_dialog;
		dialog.showServer(dataSources);
		dialog.showServersPanel(dataSources);
	},

	getDataSource : function(dataSourceName){

		if(dataSourceName == null){
			return;
		}
		this.panel.find(".server-pane table tbody").html("");
		MapCloud.alert_info.loading();
		dbsManager.getDataSource(dataSourceName,
				this.getDataSource_callback);
	},

	getDataSource_callback : function(dataSource){
		MapCloud.alert_info.hideLoading();
		if(dataSource == null){
			return;
		}
		var dialog = MapCloud.db_admin_dialog;
		dialog.dataSourceCur = dataSource;
		dialog.getDataSets(dataSource);
	},

	getDataSets : function(dataSource){
		if(dataSource == null){
			return;
		}
		dataSource.getDataSets(this.getDataSets_callback);
	},

	getDataSets_callback : function(dataSets){

		var dialog = MapCloud.db_admin_dialog;
		dialog.showDataSets(dataSets);
		dialog.showDataSetsPanel(dataSets);	
	},

		// 删除dataSource
	removeDataSource : function(){
		var dialog = this;
		var checkboxs = this.panel
			.find(".servers-pane table input[type='checkbox']:checked");
		checkboxs.parents("tr").find(".server-name").each(function(){
			var name = $(this).html();
			dbsManager.unRegisterDataSource(name,
				dialog.unRegisterDataSource_callback);
		});
	},

	unRegisterDataSource_callback : function(result){
		var info = "注销数据源";
		MapCloud.alert_info.showInfo(result,info);
		var dialog =MapCloud.db_admin_dialog;
		dialog.panel.find(".servers-pane table tbody").html("");
		dbsManager.getDataSources(dialog.getDataSources_callback);
	},

	// 删除dataSet
	removeDataSet : function(){
		var dialog = this;
		var checkboxs = this.panel
			.find(".server-pane table input[type='checkbox']:checked");
		checkboxs.parents("tr").find(".dataset-name").each(function(){
			var name = $(this).html();
			dialog.dataSourceCur.removeDataSet(name,
						dialog.removeDataSet_callback);
		});
	},

	removeDataSet_callback : function(result){
		var info = "注销图层";
		MapCloud.alert_info.showInfo(result,info);
		var dialog = MapCloud.db_admin_dialog;
		dialog.panel.find(".server-pane table tbody").html("");
		dialog.getDataSets(dialog.dataSourceCur);
	},

	// tree action
	showServer : function(dataSources){
		var html = "";
		var dataSource = null;
		var name = null;
		html += "<ul class='nav tree-servers-ul'>";

		for(var i = 0; i < dataSources.length;++i){
			dataSource = dataSources[i];
			name = dataSource.name;
			html += "<li>"
			+ 	"	<a href='#' class='tree-server' sname='" 
			+		 name + "'>"
			+	"		<i class='mc-db-icon mc-db-icon-server'></i>"
			+ 	"<span>" + name + "</span></a>"
			+	"</li>";
		}
		var node = this.panel.find(".tree-servers");
		if(node.parent().find("ul.nav").length != 0){
			node.parent().find("ul.nav").remove();
		}
		this.panel.find(".tree-servers").after(html);

		var that = this;
		this.panel.find(".tree-server").click(function(){
			that.panel.find("#db-tree a.selected").removeClass("selected");
			$(this).addClass("selected");
			var ul = $(this).parent().find("ul.nav");
			if(ul.length == 1 && ul.css("display") == "block"){
				ul.slideUp();
			}else{
				var name = $(this).attr("sname");

				that.getDataSource(name);				
			}
			that.panel.find(".db-pane").css("display","none");
			that.panel.find(".server-pane").css("display","block");
		});
	},



	showDataSets : function(dataSets){
		if(dataSets == null){
			return;
		}
		var dialog = this;
		if(this.dataSourceCur == null){
			return;
		}
		var dataSourceName = dialog.dataSourceCur.name;
		var node = dialog.panel.find(".tree-server[sname='" + 
			dataSourceName + "']");
		var dataSet = null;
		var name = null;
		var html = "<ul class='nav' style='display:none'>";
		for(var i = 0; i < dataSets.length; ++i){
			dataSet = dataSets[i];
			name = dataSet.name;
			html += "<li>"
				+ 	"	<a href='#' class='tree-table' dindex='"
				+		i + "'>"
				+	"		<i class='mc-db-icon mc-db-icon-dataset'></i>"
				+	"		<span>"	 + name + "</span>"
				+	"	</a>"
				+	"</li>";
		}
		html += "</ul>";

		
		if(node.parent().find("ul.nav").length != 0){
			node.parent().find("ul.nav").remove();
		}
		node.after(html);
		node.parent().find("ul.nav").slideDown();
		dialog.panel.find(".tree-table").click(function(){
			dialog.panel.find("#db-tree a.selected").removeClass("selected");
			$(this).addClass("selected");
			var index = $(this).attr("dindex");
			if(dialog.dataSourceCur != null){
				var dataSets = dialog.dataSourceCur.dataSets;
				if(dataSets != null){
					var dataSet = dataSets[index];
					dialog.showDataSetPanel(dataSet);
				}
			}
		}).dblclick(function(){	//注册双击事件，返回到新建图层对话框
			var index = $(this).attr("dindex");
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
	},

	//panel display
	showServersPanel : function(dataSources){
		this.panel.find(".db-pane").css("display","none");
		this.panel.find(".servers-pane").css("display","block");
		var dataSource = null;
		var name = null;
		var html = "";
		for(var i = 0; i < dataSources.length;++i){
			dataSource = dataSources[i];
			name = dataSource.name;
			html += "<tr >"
			+ 	"		<td width='80'><input type='checkbox'></td>"
			+	"		<td width='80' class='server-name'>" + name + "</td>"
			+	"</tr>";
		}
		this.panel.find(".servers-pane table tbody").html(html);

		var that = this;
		this.panel.find(".servers-pane table tbody tr td.server-name").click(function(){
			var ul = that.panel.find(".tree-servers").next();
			if(ul.css("display") == "none"){
				ul.slideDown();
			}
			var name = $(this).html();
			that.getDataSource(name);	

			// 列表选中
			that.panel.find("#db-tree a.selected").removeClass("selected");
			var serverTree = that.panel.find(".tree-server[sname='"
							 + name + "']");
			serverTree.addClass("selected");
		});
	},

	// 展示表名
	showDataSetsPanel : function(dataSets){
		this.panel.find(".db-pane").css("display","none");
		this.panel.find(".server-pane").css("display","block");
		var dataSet = null;
		var name = null;
		var geomType = null;
		var srid = null;
		var html = "";
		for(var i = 0; i < dataSets.length;++i){
			dataSet = dataSets[i];
			name = dataSet.name;
			geomType = dataSet.geometryType;
			srid = dataSet.srid;
			html += "<tr>"
			+	"		<td><input type='checkbox'></td>"
			+	"		<td class='dataset-name' dindex='" +
						+ i + "'>" + name + "</td>"
			+	"		<td>" + geomType + "</td>"
			+	"		<td>" + srid + "</td>"
			+	"</tr>";
		}
		this.panel.find(".server-pane table tbody").html(html);

		var that = this;
		this.panel.find(".server-pane table tbody tr td.dataset-name").click(function(){
			var index = $(this).attr("dindex");
			if(that.dataSourceCur != null){
				var dataSets = that.dataSourceCur.dataSets;
				if(dataSets != null){
					var dataSet = dataSets[index];
					that.showDataSetPanel(dataSet);
				}
				var dataSourceName = that.dataSourceCur.name;
				var dataSourceTree = that.panel
					.find(".tree-server[sname='" +dataSourceName + "']");
				var ul = dataSourceTree.next();
				if(ul.css("display") == "none"){
					ul.slideDown();
				}

				var dataSetTree = ul.find(".tree-table[dindex='" +
					index + "']");
				that.panel.find("#db-tree a.selected").removeClass("selected");
				dataSetTree.addClass("selected");
			}

		});
	},

	showDataSetPanel : function(dataSet){
		if(dataSet == null){
			return;
		}
		this.dataSetCur = dataSet;
		this.panel.find(".db-pane").css("display","none");
		this.panel.find(".table-pane").css("display","block");
		this.panel.find(".dataset-pane").css("display","none");
		this.panel.find(".table-pane #dataset_fields").css("display","block");
		this.panel.find(".table-pane .btn-group-justified .btn")
			.removeClass("selected");

		this.panel.find(".table-pane #show-dataset-fields").addClass("selected");
		this.showDataSetFieldsPanel(dataSet);
		this.showDataSetFeaturesPanel(dataSet);
		this.showDataSetPreviewPanel(dataSet);
	},

	// 字段
	showDataSetFieldsPanel : function(dataSet){
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

	// 列表
	showDataSetFeaturesPanel : function(dataSet){
		this.panel.find(".table-pane #dataset_features table tbody").html("");
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

	// 预览
	showDataSetPreviewPanel : function(dataSet){
		if(dataSet == null){
			return;
		}

		var height = this.panel.find("#dataset_preview").css("height");
		var width = this.panel.find("#dataset_preview").css("width");

		height = parseFloat(height.slice(0,height.indexOf("px")));
		width = parseFloat(width.slice(0,width.indexOf("px")));

		// var height = this.panel.find("#dataset_preview_img").height();
		// var width = this.panel.find("#dataset_preview_img").width();

		var url = dataSet.getPreview(width,height);
		this.panel.find("#dataset_preview_img").attr("src",url);
	},



});