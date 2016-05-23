MapCloud.ImportRasterDialog = MapCloud.Class(MapCloud.Dialog,{
	// 上传数据库
	sourceName : null,

	// raster 上传后的路径
	rasterPath : null,

	// 上传的影像数据
	rasters : null,

	// 要上传的影像路径
	path : null,

	// 来源
	source : null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		this.registerPanelEvent();
	},

	registerPanelEvent : function(){
		var dialog = this;

		this.panel.find('[data-toggle="tooltip"]').tooltip({container: 'body'});


		// 展开log
		dialog.panel.find(".import-btn-log").click(function(){
			if($(this).hasClass("log-col")){
				var height = dialog.panel.find(".modal-body").css("height");
				height = parseInt(height.slice(0,height.lastIndexOf("px")));
				var heightExp = height + 200;
				dialog.panel.find(".modal-body").css("height",heightExp + "px");

				dialog.panel.find(".import-log-wrapper").slideDown(500); 
				$(this).find("i").removeClass("fa-chevron-down").addClass("fa-chevron-up");
				$(this).removeClass("log-col").addClass("log-exp");
			}else{
				var height = dialog.panel.find(".modal-body").css("height");
				height = parseInt(height.slice(0,height.lastIndexOf("px")));
				var heightCol = height - 200;
				dialog.panel.find(".modal-body").css("height",heightCol + "px");
				
				dialog.panel.find(".import-log-wrapper").slideUp(500);
				$(this).find("i").removeClass("fa-chevron-up").addClass("fa-chevron-down");
				$(this).removeClass("log-exp").addClass("log-col");
			}
		});

		// 添加
		this.panel.find(".import-btn-add").click(function(){
			MapCloud.file_dialog.showDialog("image");
		});;


		// 删除
		this.panel.find(".import-btn-remove").click(function(){
			dialog.removePath();
		});

		// 上传
		this.panel.find(".import-btn-upload").click(function(){
			dialog.addRasters();
		});

		this.panel.on('hidden.bs.modal',function(){
			dialog.closeDialog();
		});
	},

	cleanup : function(){
		this.sourceName = null;
		this.rasterPath = null;
		this.rasters = null;
		this.paths = null;
		this.source = null;

		this.panel.find(".import-list-div").empty();
		this.panel.find(".import-db-name").val("");
		this.panel.find(".import-raster-path").val("");
		this.panel.find(".import-log-div").empty();
	},

	showDialog : function(source){
		this.cleanup();
		this.panel.modal();
		this.source = source;
	},

	closeDialog : function(){
		this.panel.modal("hide");
		if(this.source == "raster"){
			var parentDialog = MapCloud.raster_db_dialog;
			parentDialog.getListRefresh(this.sourceName,this.rasterPath);
		}else if(this.source == "raster-user"){
			var parent = MapCloud.rasterPanel;
			if(parent != null){
				parent.getListRefresh(this.sourceName,this.rasterPath);
			}
		}
		
	},

	// 设置初始化的数据库和raster上传后的路径
	setRasterPath : function(sourceName,rasterPath){
		this.sourceName = sourceName;
		this.rasterPath = rasterPath;

		this.panel.find(".import-db-name").val(this.sourceName);
		this.panel.find(".import-raster-path").val(this.rasterPath);
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
		var rasterName = null;
		var html = "";
		for(var i = 0; i < paths.length; ++i){
			path = paths[i];
			if(path == null){
				continue;
			}
			var tmp = path.lastIndexOf("/");
			rasterName = path.slice(tmp+1,path.length);
			html += "<div class='row'>"
			+ "<div class='col-md-6 col-xs-6 fpath'>" + path + "</div>"
			+ "<div class='col-md-6 col-xs-6 col-md-edit rname'><span>" + rasterName + "</span></div>"
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

		// 选中
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

	// 获取编辑后的影像数据
	getRasterInfos : function(){
		var rows = this.panel.find(".import-list-div .row");
		var rasters = [];
		var rasterObj = null;
		var rasterName = null, filePath = null;
		var row = null;
		for(var i = 0; i < rows.length; ++i){
			row = rows[i];
			filePath = $(row).find(".fpath").html();
			rasterName = $(row).find(".rname span").html();
			rasterObj = {
				filePath : filePath,
				rasterName : rasterName
			};
			rasters.push(rasterObj);
		}
		return rasters;
	},

	// 导入影像
	addRasters : function(){
		if(this.paths == null || this.paths.length == 0){
			MapCloud.notify.showInfo("请添加要导入的影像","Warning");
			return;
		}
		if(this.sourceName == null || this.rasterPath == null){
			MapCloud.notify.showInfo("请设置要导入的数据库和路径","Warning");
			return;
		}
		var rasters = this.getRasterInfos();
		this.rasters = rasters;
		var raster = rasters[0];
		if(raster != null){
			this.addRaster(this.sourceName,raster.rasterName,this.rasterPath,raster.filePath);
		}
	},

	// 逐条导入
	addRaster : function(sourceName,rasterName,rasterPath,filePath){
		rasterDBManager.addRaster(sourceName,rasterName,rasterPath,filePath,this.addRaster_callback);
	},


	addRaster_callback : function(result){
		var dialog = MapCloud.import_raster_dialog;
		var rasters = dialog.rasters;
		var raster = rasters[0];
		if(raster != null){
			var html = "<div class='row'>" + raster.filePath + " : " + result + "</div>";
			dialog.rasters.splice(0,1);
			dialog.panel.find(".import-log-div").append(html);
		}
		if(dialog.rasters != null){
			var length = dialog.rasters.length;
			if(length >= 1){
				var raster = dialog.rasters[0];
				dialog.addRaster(dialog.sourceName,raster.rasterName,dialog.rasterPath,raster.filePath);
			}
		}

	}
});