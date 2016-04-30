MapCloud.ImportDialog = MapCloud.Class(MapCloud.Dialog,{
	// 要上传到的数据库
	dataSourceName : null,	

	// 待上传的数据信息
	features : null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);

		this.registerPanelEvent();
	},

	registerPanelEvent : function(){
		var dialog = this;

		this.panel.find('[data-toggle="tooltip"]').tooltip({container: 'body'});

		// 添加
		this.panel.find(".import-btn-add").click(function(){
			MapCloud.file_dialog.showDialog("choose-shp");

		});

		// 删除
		this.panel.find(".import-btn-remove").click(function(){
			dialog.removePath();
		});

		// 导入
		this.panel.find(".import-btn-upload").click(function(){
			dialog.importFeatures();
		});

		this.panel.find(".import-btn-log").click(function(){
			if($(this).hasClass("log-col")){
				// dialog.panel.find(".import-log-fieldset").css("display","block");
				dialog.panel.find(".modal-body").css("height","578px");
				dialog.panel.find(".import-log-wrapper").slideDown(500); 
				$(this).find("i").removeClass("fa-chevron-down").addClass("fa-chevron-up");
				$(this).removeClass("log-col").addClass("log-exp");
			}else{
				// dialog.panel.find(".import-log-fieldset").css("display","none");
				dialog.panel.find(".modal-body").css("height","366px");
				dialog.panel.find(".import-log-wrapper").slideUp(500);
				$(this).find("i").removeClass("fa-chevron-up").addClass("fa-chevron-down");
				$(this).removeClass("log-exp").addClass("log-col");
			}
		});
		// 关闭
		this.panel.find("button.close").click(function(){
			dialog.closeDialog();
		});


		this.panel.on('hidden.bs.modal',function(){
			dialog.closeDialog();
		});		
	},

	showDialog : function(source){
		MapCloud.Dialog.prototype.showDialog.apply(this, arguments);
		this.source = source;
	},

	cleanup : function(){
		this.panel.find(".import-list-div").html("");
		this.panel.find(".import-log-div").html("");
		this.paths = [];
		this.source = null;
	},

	closeDialog : function(){
		this.panel.modal("hide");
		if(this.source == "vector"){
			var parent = MapCloud.vector_db_dialog;
			parent.getDataSets(parent.dataSourceCur);
		}else if(this.source == "dataPanel"){
			var parent = MapCloud.data_source_panel;
			parent.refresh();
		}else if(this.source == "vector-user"){
			var parent = MapCloud.vectorPanel;
			if(parent != null){
				parent.getDataSets(parent.dataSourceCur);
			}
		}
		
	},

	// 设置数据库名称
	setDataSourceName : function(dataSourceName){
		this.dataSourceName = dataSourceName;
		this.panel.find(".import-db-name").html(this.dataSourceName);	
	},


	// 新增要导入的文件
	addImportPaths : function(paths){
		if(this.paths == null){
			// this.paths = [];
			this.paths = paths;
		}else{
			var path = null;
			for(var i = 0; i < paths.length; ++i){
				path = paths[i];
				if(this.paths.indexOf(path) == -1){
					this.paths.push(path);
				}
			}
		}

		this.setImportPaths(this.paths);
	},

	// 页面显示要导入的文件
	setImportPaths : function(paths){
		var path = null;
		var html = "";
		var tableName = null;
		for(var i = 0; i < paths.length; ++i){
			path = paths[i];
			if(path == null){
				continue;
			}
			var tmp1 = path.lastIndexOf(".");
			var tmp2 = path.lastIndexOf("/");
			tableName = path.slice(tmp2+1,tmp1);
			html += "<div class='row'>"
				+  "<div class='col-md-4 fpath'>" + path + "</div>"
				+  "<div class='col-md-2'>public</div>"
				+  "<div class='col-md-3 col-md-edit fname'><span>" + tableName + "</span></div>"
				+  "<div class='col-md-2 col-md-edit fgeom'><span>" + "shape" + "</span></div>"
				+  "<div class='col-md-1 col-md-edit fsrid'><span>" + "4326" + "</span></div>"
				+ "</div>";
		}

		this.panel.find(".import-list-div").html(html);

		// 双击可编辑
		this.panel.find(".import-list-div .col-md-edit").dblclick(function(){
			var text = $(this).find("span").html();
			if(text != undefined){
				var width = $(this).css("width");
				var widthValue = width.slice(0,width.lastIndexOf("px"));
				widthValue -= 2;
				var html = "<input type='text' value='" + text + "' style='width:" 
				+ widthValue +"px;padding:0px'>";
				$(this).html(html);
				$(this).css("padding","4px 2px 4px 2px");
				var that = this;
				$(this).find("input").focus();
				$(this).find("input").focusout(function(){
					var value = $(this).val();
					$(this).parent().html("<span>" + value + "</span>");
					$(this).parent().css("padding","6px 2px 6px 2px");
				});						
			}
		});

		var dialog = this;
		this.panel.find(".import-list-div .row").click(function(){
			dialog.panel.find(".import-list-div .row").removeClass("selected");
			$(this).addClass("selected");
		});
	},

	// 删除上传的路径
	removePath : function(){
		var row = this.panel.find(".import-list-div .row.selected");
		if(row.length == 0){
			MapCloud.notify.showInfo("请选择一行记录进行删除","Warning");
			return;
		}
		var path = row.find(".fpath").html();
		for(var i = 0; i < this.paths.length; ++i){
			var p = this.paths[i];
			if(p == path){
				this.paths.splice(i,1);
				break;
			}
		}
		this.setImportPaths(this.paths);
	},

	// 检验编辑后的各行数据
	getFeaturesValid : function(){
		var rows = this.panel.find(".import-list-div .row");
		var row = null;
		var path = null;
		var name = null;
		var geom = null;
		var srid = null;

		//var nameReg = /^[a-zA-Z][a-zA-Z0-9_]*$/;
		var nameReg = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9])*$/;
		var sridReg = /^[0-9]+$/;
		for(var i = 0; i < rows.length; ++i){
			row = rows[i];
			path = $(row).find(".fpath").html();
			name = $(row).find(".fname span").html();
			
			if(!nameReg.test(name)){
				MapCloud.notify.showInfo("请输入有效的表名称","Warning");
				return false;
			}
			geom = $(row).find(".fgeom span").html();
			if(!nameReg.test(geom)){
				MapCloud.notify.showInfo("请输入有效的空间列","Warning");
				return false;
			}
			srid = $(row).find(".fsrid span").html();
			if(!sridReg.test(srid)){
				MapCloud.notify.showInfo("请输入有效的空间参考","Warning");
				return false;
			}
		}
		return true;
	},


	// 获取编辑后的各行数据
	getFeatures : function(){
		var rows = this.panel.find(".import-list-div .row");
		var features = [];
		var feature = null;
		var row = null;
		var path = null;
		var name = null;
		var geom = null;
		var srid = null;
		for(var i = 0; i < rows.length; ++i){
			row = rows[i];
			path = $(row).find(".fpath").html();
			name = $(row).find(".fname span").html();
			geom = $(row).find(".fgeom span").html();
			srid = $(row).find(".fsrid span").html();
			feature = {
				path : path,
				name : name,
				geom : geom,
				srid : srid
			};
			features.push(feature);
		}
		return features;
	},

	// 导入数据
	importFeatures : function(){
		if(this.paths == null || this.paths.length == 0){
			MapCloud.notify.showInfo("请添加上传数据","Warning");
			return;
		}
		if(this.dataSourceName == null){
			MapCloud.notify.showInfo("请选择要导入的数据库","Warning");
			return;
		}
		var flag = this.getFeaturesValid();
		if(!flag){
			return;
		}
		var features = this.getFeatures();
		this.features = features;
		var feature = features[0];
		if(feature != null){
			// this.features.splice(0,1);
			this.importFeature(feature);	
		}
	},

	// 逐条导入
	importFeature : function(feature){
		if(feature == null){
			return;
		}
		var typeName = feature.name;
		var shpPath = feature.path;
		var srid = feature.srid;
		var geom = feature.geom;

		var index = shpPath.lastIndexOf("/");

		var shpName = shpPath.slice(index+1,shpPath.length);
		shpName = shpName.slice(0,shpName.lastIndexOf(".shp"));
		shpPath = shpPath.slice(0,index+1);

		MapCloud.notify.loading();
		dbsManager.featureImport(this.dataSourceName,typeName,shpPath,
			shpName,srid,geom,this.importFeature_callback);

	},

	importFeature_callback : function(result){
		MapCloud.notify.hideLoading();
		var dialog = MapCloud.import_dialog;
		var f = dialog.features[0];
		if(f != null){
			var html = "<div class='row'>" + f.path + " : " + result + "</div>";
			dialog.features.splice(0,1);
			dialog.panel.find(".import-log-div").append(html);
		}
		
		
		if(dialog.features != null){
			var length = dialog.features.length;
			if(length >= 1){
				var feature = dialog.features[0];
				dialog.importFeature(feature);
			}
		}

	}
});