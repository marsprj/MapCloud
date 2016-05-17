MapCloud.VectorPanel = MapCloud.Class({

	panel : null,


    // 当前数据源
    dataSourceCur : null,
    // 当前图层
    dataSetCur : null,

    // 一页显示个数
    maxFeatures : 30,

	initialize : function(id){
		this.panel = $("#" + id);

		this.registerPanelEvent();

		this.getDataSources();
	},


	registerPanelEvent : function(){
		var that = this;
		// 返回数据库列表
		this.panel.find(".return-datasources-list").click(function(){
			that.getDataSources();
		});

		// 返回数据库
		this.panel.find(".return-datasource").click(function(){
			var name = $(this).html();
			that.getDataSource(name);
		});

		// 新增数据库
		this.panel.find(".add-db").click(function(){
			MapCloud.pgis_connection_dialog.showDialog("feature","user-feature");
		});

		// 数据库面板
		// 展示图层列表
		this.panel.find("#show_datasets_list").click(function(){
			that.panel.find("#show_datasets_thumb").attr("disabled",false);
			$(this).attr("disabled",true);
			that.panel.find("#datasource_tab .right-panel-content-tab").css("display","none");
			that.panel.find("#datasets_list_tab").css("display","block");
		});
		// 展示图层缩略图
		this.panel.find("#show_datasets_thumb").click(function(){
			that.panel.find("#show_datasets_list").attr("disabled",false);
			$(this).attr("disabled",true);
			that.panel.find("#datasource_tab .right-panel-content-tab").css("display","none");
			that.panel.find("#datasets_thumb_tab").css("display","block");		
		});

		// 导入矢量
		this.panel.find(".import-vector").click(function(){
			if(that.dataSourceCur == null){
				MapCloud.notify.showInfo("请选择一个数据库","Warning");
				return;
			}
			MapCloud.import_dialog.showDialog("vector-user");
			MapCloud.import_dialog.setDataSourceName(that.dataSourceCur.name);
		});

		// 导入csv
		this.panel.find(".import-csv").click(function(){
			if(that.dataSourceCur == null){
				MapCloud.notify.showInfo("请选择一个数据库","Warning");
				return;
			}
			MapCloud.importCSV_dialog.showDialog("vector-user");
			MapCloud.importCSV_dialog.setDataSourceName(that.dataSourceCur.name);
		});

		// 新建表格
		this.panel.find(".create-dataset").click(function(){
			that.createDataSet();
		});

		//dataset 面板
		this.panel.find("#show_dataset_infos").click(function(){
			 that.panel.find("#dataset_tab .btn-group .btn").attr("disabled",false);
			 $(this).attr("disabled",true);
			 if(that.dataSetCur != null){
			 	that.showDataSetInfos(that.dataSetCur);
			 }
		});

		$("#show_dataset_fields").click(function(){
			 $("#dataset_tab .btn-group .btn").attr("disabled",false);
			 $(this).attr("disabled",true);
			 if(that.dataSetCur != null){
			 	that.showDataSetFields(that.dataSetCur);
			 }
		});

		this.panel.find("#show_dataset_features").click(function(){
			 that.panel.find("#dataset_tab .btn-group .btn").attr("disabled",false);
			 $(this).attr("disabled",true);
			 if(that.dataSetCur != null){
			 	that.showDataSetFeatures(that.dataSetCur);
			 }
		});

		this.panel.find("#show_dataset_preview").click(function(){
			that.panel.find("#dataset_tab .btn-group .btn").attr("disabled",false);
			 $(this).attr("disabled",true);
			 if(that.dataSetCur != null){
			 	that.showDataSetPreview(that.dataSetCur);
			 }
		});

		//页面设置
		// 首页
		this.panel.find(".glyphicon-step-backward").each(function(){
			$(this).click(function(){
				var pageCount = parseInt(that.panel.find(".pages-form-pages").html());
				if(pageCount >= 1){
					that.setDataSetFeaturePage(1);
				}
			});
		});

		//末页
		this.panel.find(".glyphicon-step-forward").each(function(){
			$(this).click(function(){
				var count = parseInt(that.panel.find(".pages-form-pages").html());
				if(count >= 1){
					that.setDataSetFeaturePage(count);
				}
			});
		});

		//上一页
		this.panel.find(".glyphicon-chevron-left").each(function(){
			$(this).click(function(){
				var page = parseInt(that.panel.find(".pages-form-page").val());
				that.setDataSetFeaturePage(page - 1);
			});	
		});

		//下一页
		this.panel.find(".glyphicon-chevron-right").each(function(){
			$(this).click(function(){
				var page = parseInt(that.panel.find(".pages-form-page").val());
				that.setDataSetFeaturePage(page + 1);
			});
		});
	},


	getDataSources : function(){
		this.panel.find(".right-panel-tab").css("display","none");
		this.panel.find("#datasources_tab").css("display","block");
		MapCloud.notify.loading();
		dbsManager.getDataSources(this.getDataSources_callback,"Feature");
	},

	getDataSources_callback :function(dataSources){
		MapCloud.notify.hideLoading();
		var that = MapCloud.vectorPanel;
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
		this.panel.find(".vector-db-tree").html(html);

		var that = this;
		this.panel.find(".vector-db-tree .glyphicon-chevron-right").click(function(){
			var name = $(this).parents(".row").first().attr("dname");
			if($(this).hasClass("mc-icon-right")){
				// 展开
				$(this).removeClass("mc-icon-right");
				$(this).addClass("mc-icon-down");
				$(this).css("transform","rotate(90deg) translate(3px,0px)");
				that.panel.find(".vector-db-tree .nav[dname='" + name + "']").remove();
				that.getDataSource(name);
			}else{
				$(this).css("transform","rotate(0deg) translate(0px,0px)");
				$(this).addClass("mc-icon-right");
				$(this).removeClass("mc-icon-down");	
				that.panel.find(".vector-db-tree .nav[dname='" + name + "']").slideUp(500);	
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

		this.panel.find(".vector-db-list").html(html);

		var that = this;
		// 进入数据库
		$(".vector-db-list .enter-db").click(function(){
			var name = $(this).parents(".row").first().attr("dname");
			if(name == null){
				return;
			}
			var icon = that.panel.find(".vector-db-tree .row[dname='" + name + "'] .glyphicon-chevron-right");
			icon.removeClass("mc-icon-right");
			icon.addClass("mc-icon-down");
			icon.css("transform","rotate(90deg) translate(3px,0px)");
			that.panel.find(".vector-db-tree .nav[dname='" + name +"']").remove();
			that.getDataSource(name);
		});

		// 删除数据库
		this.panel.find(".vector-db-list .remove-db").click(function(){
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
		var that = MapCloud.vectorPanel; 
		dbsManager.getDataSources(that.getDataSources_callback,"Feature");
	},


	getDataSource : function(name){
		
		this.panel.find(".right-panel-tab").css("display","none");
		this.panel.find("#datasource_tab").css("display","block");
		this.panel.find("#show_datasets_list").css("disabled",false);
		this.panel.find("#show_datasets_thumb").css("disabled",true);
		this.panel.find(".vector-db-tree .row").removeClass("selected");
		this.panel.find(".vector-db-tree .row[dname='" + name + "']").addClass("selected");
		this.panel.find(".vector-db-tree .nav[dname='" + name + "']").remove();
		this.panel.find(".current-db").html(name);
		this.panel.find(".datasets-list").empty();
		this.panel.find(".datasets_thumb_tab").empty();

		if(name == null){
			return;
		}
		MapCloud.notify.hideLoading();
		dbsManager.getDataSource(name,this.getDataSource_callback);
	},	

	getDataSource_callback: function(dataSource){
		MapCloud.notify.hideLoading();
		if(dataSource == null){
			return;
		}
		var that = MapCloud.vectorPanel;
		that.dataSourceCur = dataSource;
		that.getDataSets(that.dataSourceCur);
	},

	getDataSets : function(dataSource){
		this.panel.find(".vector-db-tree .row").removeClass("selected");
		this.panel.find(".vector-db-tree .row[dname='" + dataSource.name + "']").addClass("selected");
		this.panel.find(".vector-db-tree .nav[dname='" + dataSource.name + "']").remove();
		this.panel.find(".current-db").html(dataSource.name);
		this.panel.find(".datasets-list").empty();
		this.panel.find(".datasets_thumb_tab").empty();
		if(dataSource == null){
			return;
		}
		MapCloud.notify.loading();
		dataSource.getDataSets(this.getDataSets_callback);
	},

	// 获得图层数据
	getDataSets_callback : function(dataSets){
		MapCloud.notify.hideLoading();
		var that = MapCloud.vectorPanel;
		that.showDataSetsTree(dataSets);
		that.showDataSetsList(dataSets);
		that.showDataSetsThumb(dataSets);
	},

	// 图层左侧树
	showDataSetsTree : function(dataSets){
		if(!$.isArray(dataSets)){
			return;
		}

		var dataSourceName = null;
		if(dataSets.length >0){
			dataSet = dataSets[0];
			if(dataSet != null){
				var dataSource = dataSet.dataSource;
				if(dataSource != null){
					dataSourceName = dataSource.name;
				}
			}
		}
		if(dataSourceName == null){
			return;
		}

		var dataSet = null;
		var name = null;
		var html = "<ul class='nav' dname='" + dataSourceName + "'>";
		for(var i = 0; i < dataSets.length; ++i){
			dataSet = dataSets[i];
			if(dataSet == null){
				continue;
			}
			name = dataSet.name;
			geomType = dataSet.geometryType;
			geomTypeHtml = this.getDataSetGeomTypeHtml(geomType);
			html += "<li sname='" + name + "'>"
				+ 	"	<a href='#' class='tree-table' dindex='"
				+		i + "'>"
				+ 		geomTypeHtml
				+	"		<span title='" + name + "'>"	 + name + "</span>"
				+	"	</a>"
				+	"</li>";
		}
		
		var dataSourceTreeItem = this.panel.find(".vector-db-tree .row[dname='" +  dataSourceName + "']");
		dataSourceTreeItem.after(html);

		var that = this;
		this.panel.find(".nav[dname='" + dataSourceName + "'] li").click(function(){
			var name =$(this).attr("sname");
			if(name == null){
				return;
			}
			if(that.dataSourceCur == null){
				return;
			}
			that.getDataSet(that.dataSourceCur,name);
		});

	},
	
	// 展示列表
	showDataSetsList : function(dataSets){
		if(!$.isArray(dataSets)){
			return;
		}

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
			html += "<div class='row' sname='" + name +"'>"
				+	'	<div class="col-md-1 col-xs-1">' + (i+1) + "</div>"
				+	'	<div class="col-md-4 col-xs-4">' + name + "</div>"
				+	'	<div class="col-md-3 col-xs-3">' + geomType + "</div>"
				+	'	<div class="col-md-2 col-xs-2">' + srid + "</div>"
				+	'	<div class="col-md-2 col-xs-2">'
				+	'		<a href="javascript:void(0)" class="oper enter-dataset">进入</a>'
				+	'		<a href="javascript:void(0)" class="oper remove-dataset">删除</a>'
				+	'	</div>'
				+	'</div>';
		}
		this.panel.find(".datasets-list").html(html);

		var that = this;
		// 进入图层
		this.panel.find(".datasets-list .enter-dataset").click(function(){
			var name = $(this).parents(".row").attr("sname");
			if(name == null){
				return;
			}
			if(that.dataSourceCur == null){
				return;
			}
			that.getDataSet(that.dataSourceCur,name);
		});

		// 删除图层
		this.panel.find(".datasets-list .remove-dataset").click(function(){
			var name = $(this).parents(".row").attr("sname");
			if(name == null){
				return;
			}
			if(that.dataSourceCur == null){
				return;
			}
			if(!confirm("确定要删除[" + name + "]?")){
				return;
			}
			MapCloud.notify.loading();
			that.dataSourceCur.removeDataSet(name,that.removeDataSet_callback);

		});
	},

	removeDataSet_callback :function(result){
		MapCloud.notify.showInfo(result,"删除图层");
		var that = MapCloud.vectorPanel;
		that.getDataSource(that.dataSourceCur.name);
	},

	// 展示数据库图层缩略图
	showDataSetsThumb : function(dataSets){
		if(!$.isArray(dataSets)){
			return;
		}

		var html = "";
		var dataSet = null;
		var geomType = null;
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
				
				html += "<li class='dataset-thumb' dname='" + name + "'>"
				+ "<a href='#' class='dataset-thumb-a' dindex='" + i 
				+ "' style='background-image:url(" + thumbnail + ")'></a>";
			}
			html += "<div class='caption text-center'>"
				+	"	<h6 title='" + name + " class='text-ellipsis'>" + name + "</h6>"
				+	"</div>"
				+	"</li>";
		}
		this.panel.find("#datasets_thumb_tab").html(html);

		var that = this;
		// 双击
		this.panel.find("#datasets_thumb_tab .dataset-thumb-a").dblclick(function(){
			var name = $(this).parent().attr("dname");
			if(name == null){
				return;
			}
			if(that.dataSourceCur == null){
				return;
			}
			that.getDataSet(that.dataSourceCur,name);
		});
	},


	getDataSetGeomTypeHtml : function(geomType){
		var html = "";
		switch(geomType){
			case GeoBeans.Geometry.Type.POINT:
			case GeoBeans.Geometry.Type.MULTIPOINT:{
				html = '<i class="mc-icon mc-db-icon-dataset-point"></i>';
				break;
			}
			case GeoBeans.Geometry.Type.LINESTRING:
			case GeoBeans.Geometry.Type.MULTILINESTRING:{
				html = '<i class="mc-icon mc-db-icon-dataset-line"></i>';
				break;
			}
			case GeoBeans.Geometry.Type.POLYGON:
			case GeoBeans.Geometry.Type.MULTIPOLYGON:{
				html = '<i class="mc-icon mc-db-icon-dataset-polygon"></i>';
				break;
			}
			default :{
				html = '<i class="mc-icon mc-db-icon-dataset"></i>';
				break;
			}
		};
		return html;
	},

	// 进入图层
	getDataSet : function(dataSource,name){
		this.panel.find(".vector-db-tree li").removeClass("selected");
		this.panel.find(".vector-db-tree li[sname='" + name + "']").addClass("selected");

		if(dataSource == null || name == null){
			return;
		}
		this.panel.find(".right-panel-tab").css("display","none");
		this.panel.find("#dataset_tab").css("display","block");
		this.panel.find(".return-datasource").html(dataSource.name);
		this.panel.find(".current-dataset").html(name);
		this.panel.find(".dataset-infos").empty();
		this.panel.find(".dataset-fields").empty();
		this.panel.find("#dataset_features_list table thead tr").html("");
		this.panel.find("#dataset_features_list table tbody").html("");
		this.panel.find(".dataset_preview_tab").empty();

		dataSource.getDataSet(name,this.getDataSet_callback);
	},


	getDataSet_callback : function(dataSet){
		if(dataSet == null){
			return;
		}
		var that = MapCloud.vectorPanel;
		that.dataSetCur = dataSet;
		// 先展示上次展示的
		var btnId = that.panel.find("#dataset_tab .btn-group .btn[disabled='disabled']").attr("id");
		if(dataSet.geometryType == null){
			that.panel.find("#show_dataset_preview").attr("disabled",true);
			if(btnId == "show_dataset_preview"){
				that.panel.find("#dataset_tab .btn-group #show_dataset_infos").attr("disabled",true);
				btnId = "show_dataset_infos";
			}
		}else{
			if(btnId != "show_dataset_preview"){
				that.panel.find("#show_dataset_preview").attr("disabled",false);
			}
		}
		switch(btnId){
			case "show_dataset_infos":{
				that.showDataSetInfos(dataSet);
				break;
			}
			case "show_dataset_fields":{
				that.showDataSetFields(dataSet);
				break;
			}
			case "show_dataset_features":{
				that.showDataSetFeatures(dataSet);
				break;
			}
			case "show_dataset_preview":{
				that.showDataSetPreview(dataSet);
				break;
			}
			default:
			break;
		}		
	},

	// 元数据
	showDataSetInfos : function(dataSet){
		this.panel.find("#dataset_tab .right-panel-content-tab").css("display","none");
		this.panel.find("#dataset_infos_tab").css("display","block");
		if(dataSet == null){
			return;
		}
		var html = "";
		html += "<div class='row'>"
			+ 	"	<div class='col-md-3 col-xs-3'>名称</div>" 
			+	"	<div class='col-md-6 col-xs-6'>" + dataSet.name + "</div>"
			+	"</div>";
		if(dataSet.type != null){
			html+=  "<div class='row'>"
				+	"	<div class='col-md-3 col-xs-3'>类型</div>"
				+	"	<div class='col-md-6 col-xs-6'>" + dataSet.type + "</div>"
				+	"</div>";
		}
		if(dataSet.geometryType != null){
			html+=	"<div class='row'>"
				+	"	<div class='col-md-3 col-xs-3'>几何类型</div>"			
				+	"	<div class='col-md-6 col-xs-6'>" + dataSet.geometryType + "</div>"
				+	"</div>";
		}
		if(dataSet.count != null){
			html+=	"<div class='row'>"
				+	"	<div class='col-md-3 col-xs-3'>个数</div>"			
				+	"	<div class='col-md-6 col-xs-3'>" + dataSet.count + "</div>"
				+	"</div>";
		}
		if(dataSet.srid != null){
			html+=	"<div class='row'>"
				+	"	<div class='col-md-3 col-xs-3'>空间参考</div>"			
				+	"	<div class='col-md-6 col-xs-6'>" + dataSet.srid + "</div>"
				+	"</div>";
		}
		var extent = dataSet.extent;
		if(extent != null){
			html+=	"<div class='row'>"
				+	"	<div class='col-md-3 col-xs-3'>范围</div>"			
				+	"	<div class='col-md-6 col-xs-6'>东 :" + extent.xmax + "</div>"
				+	"</div>"
				+	"<div class='row'>"
				+	"	<div class='col-md-3 col-xs-3'></div>"
				+	"	<div class='col-md-6 col-xs-6'>西 :" + extent.xmin + "</div>"
				+	"</div>"
				+	"<div class='row'>"
				+	"	<div class='col-md-3 col-xs-3'></div>"
				+	"	<div class='col-md-6 col-xs-6'>南 :" + extent.ymin + "</div>"
				+	"</div>"
				+	"<div class='row'>"
				+	"	<div class='col-md-3 col-xs-3'></div>"
				+	"	<div class='col-md-6 col-xs-6'>北 :" + extent.ymax + "</div>"
				+	"</div>";		
		}

		this.panel.find(".dataset-infos").html(html);

	},	

	// 字段
	showDataSetFields : function(dataSet){
		this.panel.find("#dataset_tab .right-panel-content-tab").css("display","none");
		this.panel.find("#dataset_fields_tab").css("display","block");
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
			html += "<div class='row'>"
				+ 	"	<div class='col-md-4 col-xs-4'>"
				+ 			name 
				+ 	"	</div>"
				+ 	"	<div class='col-md-3 col-xs-3'>"
				+ 			type
				+ 	"	</div>"
				+ 	"	<div class='col-md-3 col-xs-3'>"
				+ 			((length == null)?"":length)
				+ 	"	</div>"				
				+	"</div>";
		}		
		this.panel.find(".dataset-fields").html(html);
	},

	// 列表
	showDataSetFeatures : function(dataSet){
		this.panel.find("#dataset_tab .right-panel-content-tab").css("display","none");
		this.panel.find("#dataset_features_tab").css("display","block");
		if(dataSet == null){
			return;
		}
		var fields = dataSet.getFields();
		if(fields == null){
			return;
		}
		this.showDataSetFeautresFields(fields);

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

	//设置页码
	setDataSetFeaturePage : function(page){
		var pageCount = parseInt($(".pages-form-pages").html());
		$(".pages-form-page").val(page);
		if(page　== 1 ){
			this.panel.find(".glyphicon-step-backward").addClass("disabled");
		}else{
			this.panel.find(".glyphicon-step-backward").removeClass("disabled");
		}
		if(page == pageCount){
			this.panel.find(".glyphicon-step-forward").addClass("disabled");
		}else{
			this.panel.find(".glyphicon-step-forward").removeClass("disabled");
		}

		if(page - 1 <= 0){
			this.panel.find(".glyphicon-chevron-left").addClass("disabled");
		}else{
			this.panel.find(".glyphicon-chevron-left").removeClass("disabled");
		}

		if(page + 1 > pageCount){
			this.panel.find(".glyphicon-chevron-right").addClass("disabled");
		}else{
			this.panel.find(".glyphicon-chevron-right").removeClass("disabled");
		}

		var offset = ( page -1 ) * this.maxFeatures;
		
		MapCloud.notify.loading();
		var fields = this.dataSetCur.getFieldsWithoutGeom();
		this.dataSetCur.getFeatures(this.maxFeatures, offset,fields,this.getFeatures_callback); 
	},

	// 列表中的字段名称
	showDataSetFeautresFields : function(fields){
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
		this.panel.find("#dataset_features_list table thead tr").html(html);
	},


	getFeatures_callback : function(features){
		MapCloud.notify.hideLoading();
		var that = MapCloud.vectorPanel;
		that.showFeatures(features);
	},

	showFeatures : function(features){
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
	showDataSetPreview : function (dataSet){
		this.panel.find("#dataset_tab .right-panel-content-tab").css("display","none");
		this.panel.find("#dataset_preview_tab").css("display","block");
		if(dataSet == null){
			return;
		}
		if(dataSet == null || dataSet.geometryType == null){
			return;
		}
		var width = this.panel.find("#dataset_preview_tab").width();
		var height = this.panel.find("#dataset_preview_tab").height();
		var scale_m = 512/384;
		var scale_s = width/height;
		var marginTop = null;
		var marginWidth = null;
		if(scale_m > scale_s){
			marginTop = (height - width /scale_m)/2;
			height = width /scale_m;
		}else{
			marginWidth = (width - height*scale_m)/2 ;
			width = height*scale_m;
		}
		var thumbnail = dataSet.thumbnail;
		var html = "<img src='" + thumbnail + "' width='" 
			+ width + "'  height='" + height +"'>";
		this.panel.find("#dataset_preview_tab").html(html);
		if(marginTop != null){
			this.panel.find("#dataset_preview_tab img").css("margin-top",marginTop);
		}
		if(marginWidth != null){
			this.panel.find("#dataset_preview_tab img").css("margin-left",marginWidth);
		}
	},

	// 新建表格
	createDataSet : function(){
		if(this.dataSourceCur == null){
			MapCloud.notify.showInfo("请选择一个数据库","Warning");
			return;
		}
		MapCloud.create_dataset_dialog.showDialog("vector-user");
		MapCloud.create_dataset_dialog.setDataSourceName(this.dataSourceCur.name);
	},
});