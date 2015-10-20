MapCloud.RasterDBDialog = MapCloud.Class(MapCloud.Dialog,{
	
	// 当前的影像
	raster : null,

	// 当前的影像的路径
	rasterPath : null,

	// 当前的影像的名称
	rasterName : null,

	// 弹出窗口来源
	source : null,

	// 是否为输出路径的选项
	outputFlag : false,

	// 新注册的数据源的名称
	registerDataSourceName : null,


	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		this.registerPanelEvent();
	},

	registerPanelEvent : function(){
		var dialog = this;

		this.panel.find('[data-toggle="tooltip"]').tooltip({container: 'body'});

		// 切换数据库
		this.panel.find(".db-list").change(function(){
			var value = $(this).val();
			if(value != null){
				// dialog.panel.find(".folder-tree").empty();
				dialog.panel.find(".foler-ul").remove()
				dialog.getList(value,"/");
			}
		});

		// 新建数据库
		this.panel.find(".btn-add-server").click(function(){
			MapCloud.pgis_connection_dialog.showDialog("raster","raster");
		});

		// 删除数据库
		this.panel.find(".btn-remove-server").click(function(){
			dialog.removeDataSource();
		});

		// 新建文件夹
		this.panel.find(".btn-add-folder").click(function(){
			dialog.createFolder();
		});

		// 删除
		this.panel.find(".btn-remove-file").click(function(){
			var sourceName = dialog.panel.find(".db-list").val();
			if(sourceName == null){
				MapCloud.notify.showInfo("请选择一个数据源","Warning");
				return;
			}
			var checkboxs = dialog.panel.find("input[type='checkbox']:checked");
			if(checkboxs.length == 0){
				var path = dialog.panel.find(".tree-folder.selected").attr("fpath");
				if(path == "/"){
					MapCloud.notify.showInfo("无法删除根目录","Warning");
					return;
				}
				var folderName = dialog.panel.find(".tree-folder.selected span").html();
				if(folderName == null){
					MapCloud.notify.showInfo("请选择删除的文件","Warning");
					return;
				}
				if(!confirm("确定要删除文件夹[" + folderName + "]?")){
					return;
				}
				// 更改为上一级对话框
				var parentNode = dialog.panel.find(".tree-folder.selected").parents(".nav").first().prev();
				// dialog.panel.find(".tree-folder.selected").parents(".nav").first().remove();
				dialog.panel.find(".tree-folder").removeClass("selected");
				parentNode.addClass("selected");
				var parentPath = parentNode.attr("fpath");
				dialog.panel.find(".current-path").val(parentPath);
				var sourceName = dialog.panel.find(".db-list").val();
				dialog.removeFolder(sourceName,path);
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
			if(sourceName == null){
				MapCloud.notify.showInfo("请选择要上传的数据源","Warning");
				return;
			}
			var path = dialog.panel.find(".current-path").val();
			MapCloud.import_raster_dialog.showDialog();
			MapCloud.import_raster_dialog.setRasterPath(sourceName,path);
		});

		// 刷新
		this.panel.find(".btn-refresh").click(function(){

			dialog.getListRefresh();
		});

		// 影像信息
		this.panel.find(".btn-raster-info").click(function(){
			if(dialog.raster == null){
				return;
			}
			dialog.panel.find(".btn-raster-info").attr("disabled",true);
			dialog.panel.find(".bbtn-raster-preview").attr("disabled",false);
			dialog.showRasterInfo(dialog.raster);

		});

		// 影像预览
		this.panel.find(".btn-raster-preview").click(function(){
			dialog.panel.find(".btn-raster-info").attr("disabled",false);
			dialog.panel.find(".bbtn-raster-preview").attr("disabled",true);

			var sourceName = dialog.panel.find(".db-list").val();
			dialog.showRasterPreview(sourceName,dialog.rasterName,dialog.rasterPath);
		});

		// 确定
		this.panel.find(".btn-confirm").click(function(){
			if(dialog.source == null){
				dialog.closeDialog();
				return;
			}

			// 获取选择的raster
			var parentDialog = null;
			var sourceName = dialog.panel.find(".db-list").val();
			// 确定上级对话框
			switch(dialog.source){
				case "newLayer":{
					parentDialog = MapCloud.new_raster_dblayer_dialog;
					break;
				}
				case "rasterEdgeDetect":{
					parentDialog = MapCloud.gps_raster_edge_detect_dialog;
					break;
				}
				case "rasterExtract":{
					parentDialog = MapCloud.gps_raster_extract_dialog;
					break;
				}
				case "rasterReverse":{
					parentDialog = MapCloud.gps_raster_reverse_dialog;
					break;
				}
				case "rasterGraylize":{
					parentDialog = MapCloud.gps_raster_graylize_dialog;
					break;
				}
				case "rasterSmooth":{
					parentDialog = MapCloud.gps_raster_smooth_dialog;
					break;
				}
				case "rasterStretch":{
					parentDialog = MapCloud.gps_raster_stretch_dialog;
					break;
				}
				case "rasterSubtract-1":
				case "rasterSubtract-2":
				case "rasterSubtract":{
					parentDialog = MapCloud.gps_raster_subtract_dialog;
					break;
				}
				case "rasterPixelBlend-1":
				case "rasterPixelBlend-2":
				case "rasterPixelBlend":{
					parentDialog = MapCloud.gps_raster_pixel_blend_dialog;
					break;
				}
				case "rasterThreshold":{
					parentDialog = MapCloud.gps_raster_threshold_dialog;
					break;
				}
				case "rasterHisEqual":{
					parentDialog = MapCloud.gps_raster_his_equal_dialog;
					break;
				}
				case "rasterSepiaTone":{
					parentDialog = MapCloud.gps_raster_sepia_tone_dialog;
					break;
				}
				case "demAspect":{
					parentDialog = MapCloud.gps_dem_aspect_dialog;
					break;
				}
				case "demSlope":{
					parentDialog = MapCloud.gps_dem_slope_dialog;
					break;
				}
				case "demStretch":{
					parentDialog = MapCloud.gps_dem_stretch_dialog;
					break;
				}
				case "demHillshade":{
					parentDialog = MapCloud.gps_dem_hillshade_dialog;
					break;
				}
				default:{
					break;
				}
			}

			if(!dialog.outputFlag){
				// 选择输入影像
				var rasterName = null;
				var rasterPath = null;
				if(dialog.raster == null){
					var radioCheck = dialog.panel.find("input[type='radio']:checked");
					if(radioCheck.length == 0){
						MapCloud.notify.showInfo("请选择一张影像","Warning");
						return;
					}
					rasterName = radioCheck.parents(".row-file").find(".row-fname span").html();
					rasterPath = dialog.panel.find(".current-path").val();
				}else{
					rasterName = dialog.rasterName;
					rasterPath = dialog.rasterPath;
				}
				if(dialog.source == "rasterExtract"){
					dialog.returnExtractRaster(sourceName,rasterName,rasterPath);
					parentDialog.setRaster(sourceName,rasterName,rasterPath,dialog.raster);
					dialog.closeDialog();
					return;
				}
				if(dialog.source == "rasterSubtract-1"){
					parentDialog.setRaster_1(sourceName,rasterName,rasterPath);
					dialog.closeDialog();
					return;
				}
				if(dialog.source == "rasterSubtract-2"){
					parentDialog.setRaster_2(sourceName,rasterName,rasterPath);
					dialog.closeDialog();
					return;
				}
				if(dialog.source == "rasterPixelBlend-1"){
					parentDialog.setRaster_1(sourceName,rasterName,rasterPath);
					dialog.closeDialog();
					return;
				}
				if(dialog.source == "rasterPixelBlend-2"){
					parentDialog.setRaster_2(sourceName,rasterName,rasterPath);
					dialog.closeDialog();
					return;
				}
				
				if(parentDialog != null){
					parentDialog.setRaster(sourceName,rasterName,rasterPath);
				}				
			}else{
				// 是选择路径的
				var outputPath = dialog.panel.find(".current-path").val();
				if(parentDialog != null){
					parentDialog.setOutput(sourceName,outputPath);
				}
			}


			
			dialog.closeDialog();
		});
	},

	showDialog : function(source,output){
		MapCloud.notify.loading();
		this.cleanup();
		this.panel.modal();
		// 来源
		this.source = source;
		if(output != null){
			this.outputFlag = output;
		}
		
		this.getDataSources();
		if(this.source == null){
			this.panel.find(".btn-confirm").html("确定");
		}else{
			this.panel.find(".btn-confirm").html("选择");
		}
	},

	getDataSources : function(){
		dbsManager.getDataSources(this.getDataSources_callback,"Raster");
	},

	cleanup : function(){
		this.raster = null;
		this.rasterName = null;
		this.rasterPath = null;

		this.source = null;
		this.outputFlag = false;

		this.registerDataSourceName = null;

		this.panel.find(".db-list").html("");
		this.panel.find(".nav.foler-ul").remove();
		this.panel.find(".raster-list-content-div").empty();
		this.panel.find(".current-path").val("/");
		this.panel.find(".current-raster-path").val("");

		this.panel.find(".raster-col").css("display","none");
		this.panel.find(".raster-list-col").css("display","block");
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

		if(this.registerDataSourceName != null){
			this.panel.find(".db-list option[value='" + this.registerDataSourceName + "']")
				.attr("selected",true);
			this.getList(this.registerDataSourceName,"/");
			this.registerDataSourceName = null;
		}else{
			var currentDB = this.panel.find(".db-list").val();
			if(currentDB != null && currentDB != ""){
				this.getList(currentDB,"/");
			}
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
		node.find("i").removeClass("fa-folder-o");
		node.find("i").addClass("fa-folder-open-o");
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
					$(this).find("i").removeClass("fa-folder-o");
					$(this).find("i").addClass("fa-folder-open-o");
					var sourceName = that.panel.find(".db-list").val();
					that.getListTreeClick(sourceName,path);
				}else if(parent.find("ul.nav").length != 0 && 
					parent.find("ul.nav").first().css("display") == "block"){
					parent.find("ul.nav").first().css("display","none");
					$(this).find("i").addClass("fa-folder-o");
					$(this).find("i").removeClass("fa-folder-open-o");
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
		this.panel.find(".raster-col").css("display","none");
		this.panel.find(".raster-list-col").css("display","block");

		this.rasterName = null;
		this.rasterPath = null;
		this.raster = null;

		for(var i = 0; i < list.length; ++i){
			l = list[i];
			if(l == null){
				continue;
			}
			if(!this.outputFlag){
				if(l instanceof GeoBeans.File){
					var name = l.name;
					var accessTime = l.accessTime;
					var lastTime = l.lastTime;
					var size = l.size;
					var path = l.path;
					

					html += "<div class='row row-file' fpath='" + path + "'>"
					+ "<div class='col-md-1 row'>"
					+ "<div class='col-md-6'>"

					if(this.source != null){
						html += "	<input type='radio' name='chooseRaster'>";
					}else{
						html += "		<input type='checkbox' name='" + name + "'>";
					}
					html += "</div>"
					+ 	"<div class='col-md-6'>"
					+ 	"<i class='fa fa-file-o'></i>"
					+ 	"</div>";

					html+= "</div>"
					+ "<div class='col-md-3 row-fname'>"
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

					if(this.source != null){
						html += "	<input type='radio' name='chooseRaster' disabled>";
						// html += "	<input type='checkbox' name='" + name + "' disabled>";
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
					+ "<div class='col-md-3'>" + ((accessTime == null)?(" "):accessTime) +  "</div>"
					+ "<div class='col-md-3'>" + ((lastTime == null)?(" "):lastTime) + "</div>"
					+ "<div class='col-md-1'></div>"
					+ "</div>";			
				}				
			}else{
				if(l instanceof GeoBeans.Folder){
					var name = l.name;
					var accessTime = l.accessTime;
					var lastTime = l.lastTime;
					var path = l.path;
					html += "<div class='row row-folder' fpath='" + path + "'>"
					+ "<div class='col-md-1 row'>"
					+ "<div class='col-md-6'>";

					// if(this.source != null){
					// 	html += "	<input type='radio' name='choosePath'>";
					// 	// html += "	<input type='checkbox' name='" + name + "' disabled>";
					// }else{
					// 	html += "	<input type='checkbox' name='" + name + "'>"
					// }
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
				}else if(l instanceof GeoBeans.File){
					var name = l.name;
					var accessTime = l.accessTime;
					var lastTime = l.lastTime;
					var size = l.size;
					var path = l.path;
					

					html += "<div class='row row-file' fpath='" + path + "'>"
					+ "<div class='col-md-1 row'>"
					+ "<div class='col-md-6'>"

					html += "</div>"
					+ 	"<div class='col-md-6'>"
					+ 	"<i class='fa fa-file-o'></i>"
					+ 	"</div>";

					html+= "</div>"
					+ "<div class='col-md-3 row-fname'>"
					+ "		<span>" + name + "</span>"
					+ "</div>"
					+ "<div class='col-md-1'>文件</div>"
					+ "<div class='col-md-3'>" + accessTime + "</div>"
					+ "<div class='col-md-3'>" + lastTime + "</div>"
					+ "<div class='col-md-1'>" + size + "</div>"
					+ "</div>";
				}
			}
	
		}
		this.panel.find(".raster-list-content-div").html(html);

		// 点击文件夹
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

		if(!this.outputFlag){
			// 点击文件
			this.panel.find(".row-file .row-fname").click(function(){
				var sourceName = that.panel.find(".db-list").val();
				var rasterName = $(this).find("span").html();
				var rasterPath = that.panel.find(".current-path").val();
				that.rasterName = rasterName;
				that.rasterPath = rasterPath;
				that.showRasterTab(sourceName,rasterName,rasterPath);
			});
		}

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
		var sourceName = this.panel.find(".db-list").val();
		if(sourceName == null){
			MapCloud.notify.showInfo("请选择一个数据源","Warning");
			return;
		}
		var path = this.panel.find(".current-path").val();
		if(path == null){
			MapCloud.notify.showInfo("请选择刷新的路径","Warning");
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
		dialog.panel.find(".tree-folder[fpath='" + path +"']").next().remove();
		dialog.getList(sourceName,path);
	},


	// 展示raster信息
	showRasterTab : function(sourceName,rasterName,rasterPath){
		this.panel.find(".raster-list-col").css("display","none");
		this.panel.find(".raster-col").css("display","block");
		this.panel.find(".btn-raster-info").attr("disabled",true);
		this.panel.find(".bbtn-raster-preview").attr("disabled",false);
		var currentRasterPath = "";
		if(rasterPath == "/"){
			currentRasterPath = "/" + rasterName;
		}else{
			currentRasterPath = rasterPath + "/" + rasterName;
		}
		this.panel.find(".current-raster-path").val(currentRasterPath);
		this.panel.find(".raster-tab").css("display","none");
		rasterDBManager.describeRaster(sourceName,rasterName,rasterPath,this.describeRaster_callback);
	},

	describeRaster_callback : function(raster){
		var dialog = MapCloud.raster_db_dialog;
		dialog.raster = raster;
		dialog.showRasterInfo(raster);
	},

	// 展示影像信息
	showRasterInfo : function(raster){
		if(raster == null){
			return;
		}
		var html = "";
		html += "<div class='row'>"
		+ "		<div class='col-md-4'>名称</div>"
		+ "		<div class='col-md-8'>" + raster.name + "</div>"
		+ "	</div>"
		+ "	<div class='row'>"
		+ "		<div class='col-md-4'>格式</div>"
		+ "		<div class='col-md-8'>" + raster.format + "</div>"
		+ "	</div>"
		+ "	<div class='row'>"
		+ "		<div class='col-md-4'>波段</div>"
		+ "		<div class='col-md-8'>" + raster.bands + "</div>"
		+ "	</div>"
		+ "	<div class='row'>"
		+ "		<div class='col-md-4'>空间参考</div>"
		+ "		<div class='col-md-8'>" + raster.srid + "</div>"
		+ "	</div>"
		+ "	<div class='row'>"
		+ "		<div class='col-md-4'>宽度</div>"
		+ "		<div class='col-md-8'>" + raster.width + "</div>"
		+ "	</div>"		
		+ "	<div class='row'>"
		+ "		<div class='col-md-4'>高度</div>"
		+ "		<div class='col-md-8'>" + raster.height + "</div>"
		+ "	</div>"	;

		var extent = raster.extent;
		if(extent != null){
			html += "	<div class='row'>"
			+ "		<div class='col-md-4'>范围</div>"
			+ "		<div class='col-md-8'>" + extent.xmin + "," + extent.ymin + ","
			+ 		extent.xmax + "," + extent.ymax +  "</div>"
			+ "	</div>"	;
		}	
		
		this.panel.find(".raster-info-div").html(html);	 	
		this.panel.find(".raster-info-div").css("display","block");
		this.panel.find(".raster-preview-div").css("display","none");
	},

	showRasterPreview : function(sourceName,rasterName,rasterPath){
		var url = rasterDBManager.getRasterUrl(sourceName,rasterName,rasterPath);
		if(url != null){
			this.panel.find(".raster-preview-div img").attr("src",url);
		}
		this.panel.find(".raster-info-div").css("display","none");
		this.panel.find(".raster-preview-div").css("display","table-cell");
	},

	// 获取raster
	returnExtractRaster : function(sourceName,rasterName,rasterPath){
		if(this.raster != null){
			var parentDialog = MapCloud.gps_raster_extract_dialog;
			parentDialog.setRaster(sourceName,rasterName,rasterPath,this.raster);
			this.closeDialog();
		}else{
			rasterDBManager.describeRaster(sourceName,rasterName,rasterPath,this.rasterExtract_callback);
		}
	},

	rasterExtract_callback : function(raster){
		var dialog = MapCloud.raster_db_dialog;
		if(raster != null){
			var sourceName = dialog.panel.find(".db-list").val();
			var rasterPath = dialog.panel.find(".current-path").val();
			var rasterName = raster.name;
			var parentDialog = MapCloud.gps_raster_extract_dialog;
			parentDialog.setRaster(sourceName,rasterName,rasterPath,raster);
		}
		dialog.closeDialog();
		
	},

	// 删除数据源
	removeDataSource : function(){
		var name = this.panel.find(".db-list").val();
		if(name == null || name == ""){
			MapCloud.notify.showInfo("请选择一个数据源","Warning");
			return;
		}
		if(!confirm("确定要删除[" + name + "]数据库吗?")){
			return;
		}

		this.panel.find(".db-list").html("");
		this.panel.find(".nav.foler-ul").remove();
		this.panel.find(".raster-list-content-div").empty();
		this.panel.find(".current-path").val("/");
		this.panel.find(".current-raster-path").val("");
		this.panel.find(".raster-col").css("display","none");
		this.panel.find(".raster-list-col").css("display","block");
		dbsManager.unRegisterDataSource(name,this.unRegisterDataSource_callback);		
	},

	unRegisterDataSource_callback : function(result){
		var info = "注销数据源";
		MapCloud.notify.showInfo(result,info);
		var dialog = MapCloud.raster_db_dialog;
		dialog.getDataSources();
	},

	// 设置新注册的数据源的名称
	setRegisterDataSourceName : function(registerDataSourceName){
		this.registerDataSourceName = registerDataSourceName;
	}
});