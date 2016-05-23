MapCloud.GPSFeatureImportDialog = MapCloud.Class(MapCloud.Dialog,{
	// 要导入的文件的路径
	paths : null,

	// 要导入的数据库
	outputSourceName : null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this,arguments);
		var dialog = this;

		this.registerPanelEvent();
	},


	registerPanelEvent : function(){

		var dialog = this;

		this.panel.find('[data-toggle="tooltip"]').tooltip({container: 'body'});

		// 展开log
		dialog.panel.find(".gps-oper-btn-log").click(function(){
			if($(this).hasClass("log-col")){
				var height = dialog.panel.find(".modal-body").css("height");
				height = parseInt(height.slice(0,height.lastIndexOf("px")));
				var heightExp = height + 200;
				dialog.panel.find(".modal-body").css("height",heightExp + "px");

				dialog.panel.find(".gps-oper-log-wrapper").slideDown(500); 
				$(this).find("i").removeClass("fa-chevron-down").addClass("fa-chevron-up");
				$(this).removeClass("log-col").addClass("log-exp");
			}else{
				var height = dialog.panel.find(".modal-body").css("height");
				height = parseInt(height.slice(0,height.lastIndexOf("px")));
				var heightCol = height - 200;
				dialog.panel.find(".modal-body").css("height",heightCol + "px");
				
				dialog.panel.find(".gps-oper-log-wrapper").slideUp(500);
				$(this).find("i").removeClass("fa-chevron-up").addClass("fa-chevron-down");
				$(this).removeClass("log-exp").addClass("log-col");
			}
		});	

		// choose output sourcename
		dialog.panel.find(".btn-choose-output-source-name").click(function(){
			MapCloud.gps_output_source_dialog.showDialog("featureImport","Feature");
		});	

		// 添加
		dialog.panel.find(".gps-oper-btn-add").click(function(){
			MapCloud.file_dialog.showDialog("gps-choose-shp");
		});

		// 删除
		dialog.panel.find(".gps-oper-btn-remove").click(function(){
			dialog.removePath();
		});

		// 重置
		this.panel.find(".gps-btn-reset").click(function(){
			dialog.cleanup();
		});

		// 上传
		this.panel.find(".gps-btn-oper-btn").click(function(){
			dialog.importFeatures();
		});

	},

	cleanup : function(){
		this.outputSourceName = null;
		this.panel.find(".gps-output-source-name").val("");
		this.panel.find(".import-list-div").empty();
		this.panel.find(".gps-oper-log-div").empty();
	},


	// 输出
	setOutputSource : function(outputSourceName){
		this.outputSourceName = outputSourceName;
		this.panel.find(".gps-output-source-name").val(this.outputSourceName);
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
				+  "<div class='col-md-4 col-xs-4 fpath'>" + path + "</div>"
				+  "<div class='col-md-2 col-xs-2'>public</div>"
				+  "<div class='col-md-3 col-xs-3 col-md-edit fname'><span>" + tableName + "</span></div>"
				+  "<div class='col-md-2 col-xs-2 col-md-edit fgeom'><span>" + "shape" + "</span></div>"
				+  "<div class='col-md-1 col-xs-1 col-md-edit fsrid'><span>" + "4326" + "</span></div>"
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
		if(this.outputSourceName == null){
			MapCloud.notify.showInfo("请选择要导入的数据库","Warning");
			return;
		}
		
		if(this.paths == null || this.paths.length == 0){
			MapCloud.notify.showInfo("请添加上传数据","Warning");
			return;
		}

		var features = this.getFeatures();
		this.features = features;
		var feature = features[0];
		if(feature != null){
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
		gpsManager.featureImport(this.outputSourceName,typeName,shpPath,
			shpName,srid,geom,this.importFeature_callback);
	},

	importFeature_callback : function(result){
		var dialog = MapCloud.gps_feature_import_dialog;
		var f = dialog.features[0];
		if(f != null){
			var html = "<div class='row'>" + f.path + " : " + result + "</div>";
			dialog.features.splice(0,1);
			dialog.panel.find(".gps-oper-log-div").append(html);
		}
		MapCloud.notify.hideLoading();
		if(dialog.features != null){
			var length = dialog.features.length;
			if(length >= 1){
				var feature = dialog.features[0];
				dialog.importFeature(feature);
			}
		}

	}	
});