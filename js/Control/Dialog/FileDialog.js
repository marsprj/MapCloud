MapCloud.FileDialog = MapCloud.Class(MapCloud.Dialog, {
	
	// 当前面板的文件列表
	list : null,


	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		
		var dialog = this;
		dialog.registerPanelEvent();
	},

	registerPanelEvent : function(){
		var dialog = this;

		this.panel.find('[data-toggle="tooltip"]').tooltip({container: 'body'});


		this.panel.find(".btn-confirm").click(function(){
			if(dialog.flag == "choose-shp"){
				var importPaths = dialog.getImportPaths();
				if(importPaths.length == 0){
					MapCloud.notify.showInfo("请选择要导入的shp文件","Warning");
					return;
				}
				// MapCloud.import_dialog.showDialog();
				MapCloud.import_dialog.addImportPaths(importPaths);
			}
			dialog.closeDialog();
		});

		// 新建文件夹
		this.panel.find(".btn-add-folder").click(function(){
			MapCloud.create_folder_dialog.showDialog();
		});

		// 删除
		this.panel.find(".btn-remove-file").click(function(){
			var checkboxs = dialog.panel.find("input[type='checkbox']:checked");
			if(checkboxs.length == 0){
				MapCloud.notify.showInfo("请选择要删除的文件","Warning");
				return;
			}
			checkboxs.each(function(){
				var parent = $(this).parents(".row").first();
				var path = parent.attr("fpath");
				if(parent.hasClass("row-file")){
					dialog.removeFile(path);
				}else if(parent.hasClass("row-folder")){
					dialog.removeFolder(path);
				}
			});
		});

		// 上传
		this.panel.find(".btn-upload-file").click(function(){
			MapCloud.importVector_dialog.showDialog();
			MapCloud.importVector_dialog.setDataSource("default");
		});

		// 过滤文件
		this.panel.find("#file_filter_select").change(function(){
			var value = $(this).val();
			dialog.showListPanelByFilter(value);
		});
	},


	cleanup : function(){
		this.list = null;
		this.flag = null;
		this.panel.find("#file_filter_select option[value='all']").attr("selected",true);
	},

	showDialog : function(flag){
		this.cleanup();

		this.flag = flag;
		if(this.flag == "choose-shp"){
			this.panel.find(".btn-confirm").html("选择");
			this.panel.find(".tool-row").css("display","none");
			this.panel.find(".file-list-wrapper").css("height","calc(100% - 54px)");
		}else{
			this.panel.find(".btn-confirm").html("确定");
			this.panel.find(".tool-row").css("display","block");
			this.panel.find(".file-list-wrapper").css("height","calc(100% - 100px)");
		}

		this.panel.modal();
		this.getList("/");
	},
	

	getList : function(path){
		MapCloud.alert_info.loading();
		fileManager.getList(path,this.getList_callback);
	},

	getList_callback : function(list){
		MapCloud.alert_info.hideLoading();
		var dialog = MapCloud.file_dialog;
		dialog.list = list;
		dialog.showListTree(list,true);
		dialog.showListPanel(list);
	},


	// 左侧的tree单击
	getListTreeClick : function(path){
		MapCloud.alert_info.loading();
		fileManager.getList(path,this.getListTreeClick_callback);
	},

	getListTreeClick_callback : function(list){
		MapCloud.alert_info.hideLoading();
		var dialog = MapCloud.file_dialog;
		dialog.list = list;
		// dialog.showListTree(list,false);
		dialog.showListPanel(list);
	},


	// 展示树
	showListTree : function(list,display){
		var l = null;
		// var path = null;
		var currentPath = null;
		var html = null;
		if(display == true){
			html = "<ul class='nav'>";
		}else{
			html = "<ul class='nav' style='display:none'>";
		}
		
		for(var i = 0; i< list.length; ++i){
			l = list[i];
			if(l == null){
				continue;
			}
			if(currentPath == null){
				currentPath = l.parPath;
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
		var node = this.panel.find(".file-tree-div a[fpath='" + currentPath +"']");
		node.parent().find("ul.nav").remove();
		node.after(html);

		var that = this;

	
		this.panel.find(".tree-folder").unbind("click");
		this.panel.find(".tree-folder").unbind("dblclick");

		var DELAY = 300, clicks = 0, timer = null;
		this.panel.find(".tree-folder").on("click", function(e){
			clicks++;  //count clicks
			if(clicks === 1) {
				var node = this;
			    timer = setTimeout(function() {
			        console.log("Single Click");  //perform single-click action    
			        var path = $(node).attr("fpath");
			        that.panel.find("#current_path").val(path);
					that.getListTreeClick(path);
					that.panel.find(".tree-folder").removeClass("selected");
					$(this).addClass("selected");
			        clicks = 0;             //after action performed, reset counter
			    }, DELAY);
			} else {
			    clearTimeout(timer);    //prevent single-click action
			    console.log("Double Click");  //perform double-click action
			    var path = $(this).attr("fpath");
		    	var parent = $(this).parent();
				if(parent.find("ul.nav").length != 0 && 
					parent.find("ul.nav").first().css("display") == "none"){
					parent.find("ul.nav").first().css("display","block");
					that.getListTreeClick(path);
				}else if(parent.find("ul.nav").length != 0 && 
					parent.find("ul.nav").first().css("display") == "block"){
					parent.find("ul.nav").first().css("display","none");
					that.getListTreeClick(path);
				}else {
					that.panel.find("#current_path").val(path);
					that.getList(path);
				}
				that.panel.find(".tree-folder").removeClass("selected");
				$(this).addClass("selected");
			    clicks = 0;             //after action performed, reset counter
			}

		}).on("dblclick", function(e){
			e.preventDefault();  //cancel system double-click event
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
		this.panel.find(".file-list-content-div").html(html);

		var that = this;
		this.panel.find(".row-folder .row-fname").click(function(){
			var path = $(this).parent().attr("fpath");
			// var path = $(this).attr("fpath");
			that.panel.find(".tree-folder").removeClass("selected");
			var node = that.panel.find(".tree-folder[fpath='" + path + "']");
			node.parents(".nav").first().css("display","block");
			node.addClass("selected");
			that.panel.find("#current_path").val(path);
			that.getList(path);
		});

		// this.panel.find(".row-file .row-fname").dblclick(function(){
		// 	var text = $(this).find("span").html();
		// 	var html = "<input type='text' value='" + text + "'>";
		// 	$(this).html(html);
		// 	var that = this;
		// 	$(this).find("input").focusout(function(){
		// 		var value = $(this).val();
		// 		$(this).parent().html("<span>" + value + "</span>");
		// 	});
		// });
	},



	setCreateFolderName: function(name){
		var currentPath = this.panel.find("#current_path").val();
		var path = null;
		if(currentPath == "/"){
			path = "/" + name;
		}else{
			path = currentPath + "/" + name;
		}
		this.createFolder(path);
	},

	// 新建文件夹
	createFolder : function(path){
		MapCloud.notify.loading();
		fileManager.createFolder(path,this.createFolder_callback);
	},

	createFolder_callback : function(result){
		var info = "新建文件夹";
		// MapCloud.alert_info.showInfo(result,info);
		MapCloud.notify.showInfo(result,info);
		var dialog = MapCloud.file_dialog;
		var currentPath = dialog.panel.find("#current_path").val();
		dialog.getList(currentPath);
	},

	// 删除文件
	removeFile : function(path){
		fileManager.removeFile(path,this.removeFile_callback);
	},

	removeFile_callback : function(result){
		var info = "删除文件";
		MapCloud.notify.showInfo(result,info);
		var dialog = MapCloud.file_dialog;
		var currentPath = dialog.panel.find("#current_path").val();
		dialog.getList(currentPath);		
	},

	// 删除文件夹
	removeFolder : function(path){
		fileManager.removeFolder(path,this.removeFolder_callback);
	},

	removeFolder_callback : function(result){
		var info = "删除文件夹";
		MapCloud.notify.showInfo(result,info);
		var dialog = MapCloud.file_dialog;
		var currentPath = dialog.panel.find("#current_path").val();
		dialog.getList(currentPath);
	},

	// 刷新当前页面
	refreshCurrentPath : function(){
		var currentPath = this.panel.find("#current_path").val();
		this.getList(currentPath);
	},

	showListPanelByFilter : function(value){
		if(value == "all"){
			this.showListPanel(this.list);
		}else if(value == "shp"){
			var filterList = [];
			var l = null;
			var name = null;
			for(var i = 0; i < this.list.length; ++i){
				l = this.list[i];
				if(l instanceof GeoBeans.File){
					name = l.name;
					if(name.lastIndexOf(".shp") == (name.length - 4)){
						filterList.push(l);
					}
				}
			}
			this.showListPanel(filterList);
		}
		// else if(value == "dbf"){
		// 	var filterList = [];
		// 	var l = null;
		// 	var name = null;
		// 	for(var i = 0; i < this.list.length; ++i){
		// 		l = this.list[i];
		// 		if(l instanceof GeoBeans.File){
		// 			name = l.name;
		// 			if(name.lastIndexOf(".dbf") == (name.length - 4)){
		// 				filterList.push(l);
		// 			}
		// 		}
		// 	}
		// 	this.showListPanel(filterList);			
		// }
	},



	// 获得要上传的文件的路径
	getImportPaths : function(){
		var checkboxs = this.panel.find("input[type='checkbox']:checked");
		var checkbox = null;
		var paths = [];
		for(var i = 0; i < checkboxs.length; ++i){
			checkbox = checkboxs[i];
			if(checkbox == null){
				continue;
			}
			var path = $(checkbox).parents(".row-file").attr("fpath");
			if(path != null){
				paths.push(path);
			}
		}
		return paths;
	},

});
	