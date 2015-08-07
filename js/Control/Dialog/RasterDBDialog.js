MapCloud.RasterDBDialog = MapCloud.Class(MapCloud.Dialog,{
	
	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		this.registerPanelEvent();
	},

	registerPanelEvent : function(){
		var dialog = this;

		// 切换数据库
		this.panel.find(".db-list").change(function(){
			var value = $(this).val();
			if(value != null){
				dialog.getList(value,"/");
			}
		});

		// 新建文件夹
		this.panel.find(".btn-add-folder").click(function(){
			dialog.createFolder();
		});

		// 删除
		this.panel.find(".btn-remove-file").click(function(){
			var checkboxs = dialog.panel.find("input[type='checkbox']:checked");
			if(checkboxs.length == 0){
				MapCloud.notify.showInfo("请选择要删除的文件","Warning");
				return;
			}
			if(!confirm("确定要删除吗？")){
				return;
			}
			checkboxs.each(function(){
				var parent = $(this).parent().parent().parent();
				var path = parent.attr("fpath");
				var sourceName = dialog.panel.find(".db-list").val();
				if(parent.hasClass("row-file")){
					var rasterPath = dialog.panel.find(".current-path").val();
					var rasterName = parent.find(".row-fname span").html();
					dialog.removeRaster(sourceName,rasterPath,rasterName);
				}else if(parent.hasClass('row-folder')){
					dialog.removeFolder(sourceName,path);
				}
			});
		});

		// 上传
		this.panel.find(".btn-upload-raster").click(function(){
			var sourceName = dialog.panel.find(".db-list").val();
			var path = dialog.panel.find(".current-path").val();
			MapCloud.import_raster_dialog.showDialog();
			MapCloud.import_raster_dialog.setRasterPath(sourceName,path);
		});

		// 刷新
		this.panel.find(".btn-refresh").click(function(){
			var sourceName = dialog.panel.find(".db-list").val();
			var path = dialog.panel.find(".current-path").val();
			dialog.getListRefresh(sourceName,path);
		});
	},

	showDialog : function(){
		MapCloud.notify.loading();
		this.cleanup();
		this.panel.modal();
		dbsManager.getDataSources(this.getDataSources_callback);
	},

	cleanup : function(){
		this.panel.find(".db-list").html("");
		this.panel.find(".nav.foler-ul").remove();
		this.panel.find(".raster-list-content-div").empty();
		this.panel.find(".current-path").val("/");
	},

	getDataSources_callback : function(dataSources){
		MapCloud.notify.hideLoading();
		var dialog = MapCloud.raster_db_dialog;
		dialog.showDataSources(dataSources);
	},

	// 数据库列表
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

		var currentDB = this.panel.find(".db-list").val();
		if(currentDB != null && currentDB != ""){
			this.getList(currentDB,"/");
		}
	},

	getList : function(sourceName,path){
		if(sourceName == null || path == null){
			return;
		}
		MapCloud.notify.loading();
		rasterDBManager.getList(sourceName,path,this.getList_callback);
	},

	getList_callback : function(list){
		MapCloud.notify.hideLoading();
		var dialog = MapCloud.raster_db_dialog;
		dialog.showListTree(list);
		dialog.showListPanel(list);
	},

	// 左侧的tree单击
	getListTreeClick : function(sourceName,path){
		MapCloud.notify.loading();
		rasterDBManager.getList(sourceName,path,this.getListTreeClick_callback);
	},

	getListTreeClick_callback : function(list){
		MapCloud.notify.hideLoading();
		var dialog = MapCloud.raster_db_dialog;
		dialog.list = list;
		dialog.showListPanel(list);
	},

	// 展示左侧的树
	showListTree : function(list){
		var l = null;
		// var path = null;
		var currentPath = null;
		var	html = "<ul class='nav foler-ul'>";
		
		for(var i = 0; i< list.length; ++i){
			l = list[i];
			if(l == null){
				continue;
			}

			if(l instanceof GeoBeans.Folder){
				var name = l.name;
				html += "<li>"
				+ "<a href='javascript:void(0)' class='tree-folder' fpath=\"" + l.path + "\">"
				+ "<i class=\"fa fa-folder-o\"></i>"
				+ "<span>" + name + "</span>"
				+ "</a>"
				+ "</li>";
			}
		}	
		html += "</ul>";
		currentPath = this.panel.find(".current-path").val();
		var node = this.panel.find(".db-tree a[fpath='" + currentPath +"']");
		node.parent().find("ul.nav").remove();
		node.after(html);

		var that = this;	

		this.panel.find(".tree-folder").unbind("click");
		this.panel.find(".tree-folder").unbind("dblclick");	

		var DELAY = 300,clicks = 0, timer = null;
		this.panel.find(".tree-folder").on("click",function(e){
			clicks ++;
			if(clicks === 1){
				var node = this;
				timer = setTimeout(function(){
					var path = $(node).attr("fpath");
					that.panel.find(".current-path").val(path);
					var sourceName = that.panel.find(".db-list").val();
					that.getListTreeClick(sourceName,path);
					that.panel.find(".tree-folder.selected").removeClass("selected");
					$(node).addClass("selected");
					clicks = 0;
				}, DELAY);
			}else{
				//双击事件
				clearTimeout(timer);
				var path = $(this).attr("fpath");
				var parent = $(this).parent();
				if(parent.find("ul.nav").length != 0 &&
					parent.find("ul.nav").first().css("display") == "none"){
					parent.find("ul.nav").first().css("display","block");
					var sourceName = that.panel.find(".db-list").val();
					that.getListTreeClick(sourceName,path);
				}else if(parent.find("ul.nav").length != 0 && 
					parent.find("ul.nav").first().css("display") == "block"){
					parent.find("ul.nav").first().css("display","none");
					var sourceName = that.panel.find(".db-list").val();
					that.getListTreeClick(sourceName,path);
				}else {
					that.panel.find(".current-path").val(path);
					var sourceName = that.panel.find(".db-list").val();
					that.getList(sourceName,path);
				}
				that.panel.find(".tree-folder").removeClass("selected");
				$(this).addClass("selected");
				clicks = 0;
			}
		}).on("dblclick", function(e){
			e.preventDefault();  
		});

	},


	// 展示右侧面板
	showListPanel : function(list){
		var l = null;
		var html = "";
		for(var i = 0; i < list.length; ++i){
			l = list[i];
			if(l == null){
				continue;
			}
			if(l instanceof GeoBeans.File){
				var name = l.name;
				var accessTime = l.accessTime;
				var lastTime = l.lastTime;
				var size = l.size;
				var path = l.path;
				

				html += "<div class='row row-file' fpath='" + path + "'>"
				// + "<div class='col-md-1'>";
				+ "<div class='col-md-1 row'>"
				+ "<div class='col-md-6'>"

				if(this.flag == "choose-shp"){
					var fileFix = name.slice(name.lastIndexOf(".")+1,name.length);
					if(fileFix.toLowerCase() == "shp"){
						html += "		<input type='checkbox' name='" + name + "'>";
					}else{
						html += "		<input type='checkbox' name='" + name + "' disabled>";
					}
				}else{
					html += "		<input type='checkbox' name='" + name + "'>";
				}
				html += "</div>"
				+ 	"<div class='col-md-6'>"
				+ 	"<i class='fa fa-file-o'></i>"
				+ 	"</div>";

				html+= "</div>"
				+ "<div class='col-md-3 row-fname'>"
				// + "		<i class='fa fa-file-o'></i>"
				+ "		<span>" + name + "</span>"
				+ "</div>"
				+ "<div class='col-md-1'>文件</div>"
				+ "<div class='col-md-3'>" + accessTime + "</div>"
				+ "<div class='col-md-3'>" + lastTime + "</div>"
				+ "<div class='col-md-1'>" + size + "</div>"
				+ "</div>";
			}else if(l instanceof GeoBeans.Folder){
				var name = l.name;
				var accessTime = l.accessTime;
				var lastTime = l.lastTime;
				var path = l.path;
				html += "<div class='row row-folder' fpath='" + path + "'>"
				+ "<div class='col-md-1 row'>"
				+ "<div class='col-md-6'>";

				if(this.flag == "choose-shp"){
					html += "	<input type='checkbox' name='" + name + "' disabled>"
				}else{
					html += "	<input type='checkbox' name='" + name + "'>"
				}
				html += "</div>"
				+ 	"<div class='col-md-6'>"
				+ 	"<i class='fa fa-folder-o'></i>"
				+ 	"</div>";
				
				html += "</div>"
				+ "<div class='col-md-3 row-fname'>"
				// + "		<i class='fa fa-folder-o'></i>"
				+ "		<span>" + name + "</span>"
				+ "</div>"
				+ "<div class='col-md-1'>文件夹</div>"
				+ "<div class='col-md-3'>" + accessTime + "</div>"
				+ "<div class='col-md-3'>" + lastTime + "</div>"
				+ "<div class='col-md-1'></div>"
				+ "</div>";			
			}
		}
		this.panel.find(".raster-list-content-div").html(html);

		var that = this;
		this.panel.find(".row-folder .row-fname").click(function(){
			var path = $(this).parent().attr("fpath");
			that.panel.find(".tree-folder").removeClass("selected");
			var node = that.panel.find(".tree-folder[fpath='" + path + "']");
			node.parents(".nav").first().css("display","block");
			node.addClass("selected");
			that.panel.find(".current-path").val(path);
			var sourceName = that.panel.find(".db-list").val();
			that.getList(sourceName,path);
		});

	},
	// 新建文件夹
	createFolder : function(){
		var sourceName = this.panel.find(".db-list").val();
		if(sourceName == null){
			MapCloud.notify.showInfo("请选择一个数据源","Warning");
			return;
		}
		MapCloud.create_folder_dialog.showDialog("raster");	
	},

	// 新创建的文件夹
	setCreateFolderName: function(name){
		var currentPath = this.panel.find(".current-path").val();
		var path = null;
		if(currentPath == "/"){
			path = "/" + name;
		}else{
			path = currentPath + "/" + name;
		}
		var sourceName = this.panel.find(".db-list").val();
		this.rasterCreateFolder(sourceName,path);
	},

	// 新建文件夹
	rasterCreateFolder : function(sourceName,path){
		if(sourceName == null || path == null){
			MapCloud.notify.showInfo("参数无效","Warning");
			return;
		}
		MapCloud.notify.loading();
		rasterDBManager.createFolder(sourceName,path,this.createFolder_callback);

		// fileManager.createFolder(path,this.createFolder_callback);
	},	

	createFolder_callback : function(result){
		var info = "新建文件夹";
		MapCloud.notify.showInfo(result,info);
		var dialog = MapCloud.raster_db_dialog;
		var sourceName = dialog.panel.find(".db-list").val();
		var path = dialog.panel.find(".current-path").val();
		dialog.getList(sourceName,path);	
	},

	// 刷新
	getListRefresh : function(sourceName,path){
		if(sourceName == null || path == null){
			return;
		}
		MapCloud.notify.loading();
		rasterDBManager.getList(sourceName,path,this.getListRefresh_callback);
	},

	getListRefresh_callback : function(list){
		MapCloud.notify.showInfo("Success","刷新成功");
		var dialog = MapCloud.raster_db_dialog;
		dialog.showListTree(list);
		dialog.showListPanel(list);		
	},

	// 删除raster
	removeRaster : function(sourceName,rasterPath,rasterName){
		rasterDBManager.removeRaster(sourceName,rasterName,rasterPath,this.removeRaster_callback);
	},

	removeRaster_callback : function(result){
		MapCloud.notify.showInfo(result,"删除影像");
		var dialog = MapCloud.raster_db_dialog;
		var sourceName = dialog.panel.find(".db-list").val();
		var path = dialog.panel.find(".current-path").val();
		dialog.getList(sourceName,path);
	},

	// 删除文件夹
	removeFolder : function(sourceName,folderPath){
		rasterDBManager.removeFolder(sourceName,folderPath,this.removeFolder_callback);
	},

	removeFolder_callback : function(result){
		MapCloud.notify.showInfo(result,"删除文件夹");
		var dialog = MapCloud.raster_db_dialog;
		var sourceName = dialog.panel.find(".db-list").val();
		var path = dialog.panel.find(".current-path").val();
		dialog.getList(sourceName,path);
	}

});