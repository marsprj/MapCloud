MapCloud.RasterPanel = MapCloud.Class({
	
	panel : null,

	// 影像
	raster : null,

	initialize : function(id){
		this.panel = $("#" + id);

		this.registerPanelEvent();

		this.getDataSources();
	},

	registerPanelEvent :function(){
		var that = this;
		// 增加数据库
		this.panel.find(".add-db").click(function(){
			MapCloud.pgis_connection_dialog.showDialog("raster","user-raster");
		});

		// 返回数据库列表
		this.panel.find(".return-datasources-list").click(function(){
			that.getDataSources();
		});

		// 新增文件夹
		this.panel.find(".add-folder").click(function(){
			that.createFolder();
		});

		// 删除文件
		this.panel.find(".remove-file").click(function(){
			var sourceName = that.panel.find("#datasource_tab .current-db").html();
			if(sourceName == null){
				MapCloud.notify.showInfo("请选择一个数据源","Warning");
				return;
			}
			var checkboxs = that.panel.find("input[type='checkbox']:checked");
			if(checkboxs.length == 0){
				var path = that.panel.find(".folder-tree[dname='" + sourceName +"'] .tree-folder.selected").attr("fpath");
				if(path == "/"){
					MapCloud.notify.showInfo("无法删除根目录","Warning");
					return;
				}
				var folderName = that.panel.find(".folder-tree[dname='" + sourceName +"'] .tree-folder.selected span").html();
				if(folderName == null){
					MapCloud.notify.showInfo("请选择删除的文件","Warning");
					return;
				}
				if(!confirm("确定要删除文件夹[" + folderName + "]?")){
					return;
				}
				// 更改为上一级对话框
				var parentNode = that.panel.find(".folder-tree[dname='" + sourceName +"'] .tree-folder.selected").parents(".nav").first().prev();
				// that.panel.find(".tree-folder.selected").parents(".nav").first().remove();
				that.panel.find(".folder-tree[dname='" + sourceName +"'] .tree-folder").removeClass("selected");
				parentNode.addClass("selected");
				var parentPath = parentNode.attr("fpath");
				that.panel.find(".current-path").val(parentPath);
				
				that.removeFolder(sourceName,path);
				return;
			}
			if(!confirm("确定要删除吗？")){
				return;
			}
			checkboxs.each(function(){
				var parent = $(this).parent().parent().parent();
				var path = parent.attr("fpath");
				if(parent.hasClass("row-file")){
					var rasterPath = that.panel.find(".current-path").val();
					var rasterName = parent.find(".row-fname span").html();
					that.removeRaster(sourceName,rasterPath,rasterName);
				}else if(parent.hasClass('row-folder')){
					that.removeFolder(sourceName,path);
				}
			});
		});

		// 刷新目录
		this.panel.find(".refresh-folder").click(function(){
			that.getListRefresh();
		});

		// 上传影像
		this.panel.find(".upload-raster").click(function(){
			var sourceName = that.panel.find("#datasource_tab .current-db").html();
			if(sourceName == null){
				MapCloud.notify.showInfo("请选择要上传的数据源","Warning");
				return;
			}
			var path = that.panel.find(".current-path").val();
			MapCloud.import_raster_dialog.showDialog("raster-user");
			MapCloud.import_raster_dialog.setRasterPath(sourceName,path);
		});

		// 影像信息
		this.panel.find("#show_raster_infos").click(function(){
			that.panel.find("#raster_tab .right-panel-content-tab").css("display","block");
			that.panel.find("#raster_infos_tab").css("display","block");
			$(this).attr("disabled",true);
			that.panel.find("#show_raster_preview").attr("disabled",false);
			that.showRasterInfo(that.raster);
		});

		// 影像预览
		this.panel.find("#show_raster_preview").click(function(){
			that.panel.find("#raster_tab .right-panel-content-tab").css("display","block");
			that.panel.find("#raster_preview_tab").css("display","block");
			$(this).attr("disabled",true);
			that.panel.find("#show_raster_infos").attr("disabled",false);

			var sourceName = that.panel.find("#raster_tab .current-db").html();
			that.showRasterPreview(sourceName,that.rasterName,that.rasterPath);

		});
	},

	getDataSources : function(){
		$(".right-panel-tab").css("display","none");
		$("#datasources_tab").css("display","block");
		MapCloud.notify.loading();
		dbsManager.getDataSources(this.getDataSources_callback,"Raster");
	},

	getDataSources_callback : function(dataSources){
		var that = MapCloud.rasterPanel;
		MapCloud.notify.hideLoading();
		that.showDataSourcesTree(dataSources);
		that.showDataSourcesList(dataSources);
	},

	// 左侧树
	showDataSourcesTree : function(dataSources){
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
				+	'	<div class="col-md-1 col-md-20px">'
				+	'		<div class="glyphicon glyphicon-chevron-right mc-icon mc-icon-right mc-icon-rotate"></div>'
				+	'	</div>'
				+	'	<div class="col-md-1 col-md-20px">'
				+	'		<i class="db-icon list-icon"></i>'
				+	'	</div>'
				+	'	<div class="col-md-7 db-tree-name">' + name  + '</div>'
				+	'</div>'
				+ 	'<ul class="nav folder-tree" dname="' + name + '">'
				+	'	<li>'
				+	'		<a href="javascript:void(0)" class="file-tree tree-folder selected" fpath="/">'				+	'			<i class="fa fa-folder-o"></i>'
				+	'			<span>/</span>'
				+	'		</a>'
				+	'	</li>'
				+	'</ul>'
		}
		$(".raster-db-tree").html(html);

		var that = this;
		$(".raster-db-tree .glyphicon-chevron-right").click(function(){
			var name = $(this).parents(".row").first().attr("dname");
			if($(this).hasClass("mc-icon-right")){
				// 展开
				$(this).removeClass("mc-icon-right");
				$(this).addClass("mc-icon-down");
				$(this).css("transform","rotate(90deg) translate(3px,0px)");
				$(".raster-db-tree .folder-tree[dname='" + name + "'] .foler-ul").remove();
				that.panel.find(".right-panel-tab").css("display","none");
				that.panel.find("#datasource_tab").css("display","block");
				that.panel.find("#datasource_tab .current-db").html(name);
				that.panel.find("#datasource_tab .current-path").val("/");
				that.panel.find(".nav.folder-tree[dname='" + name + "']").css("display","block");
				that.getList(name,"/");
			}else{
				$(this).css("transform","rotate(0deg) translate(0px,0px)");
				$(this).addClass("mc-icon-right");
				$(this).removeClass("mc-icon-down");	
				$(".raster-db-tree .folder-tree[dname='" + name + "']").slideUp(500);	
			}
		});
	},

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
				+	'	<div class="col-md-1">'
				+		(i+1)
				+	'	</div>'
				+	'	<div class="col-md-2">'
				+	     	name
				+	'	</div>'
				+	'	<div class="col-md-2">'
				+			conObj.server
				+	'	</div>'
				+	'	<div class="col-md-1">'
				+			conObj.instance
				+	'	</div>'
				+	'	<div class="col-md-1">'
				+			conObj.database
				+	'	</div>'
				+	'	<div class="col-md-1">'
				+			conObj.user
				+	'	</div>'
				+	'	<div class="col-md-2">'
				+			conObj.password
				+	'	</div>'
				+	'	<div class="col-md-2">'
				+	'		<a href="javascript:void(0)" class="oper enter-db">进入</a>'
				+	'		<a href="javascript:void(0)" class="oper remove-db">删除</a>'
				+	'	</div>'
				+	'</div>';
		}

		$(".raster-db-list").html(html);

		var that = this;
		// 进入
		$(".raster-db-list .enter-db").click(function(){
			var name = $(this).parents(".row").first().attr("dname");
			if(name == null){
				return;
			}
			var path = "/";
			that.panel.find(".right-panel-tab").css("display","none");
			that.panel.find("#datasource_tab").css("display","block");
			that.panel.find("#datasource_tab .current-db").html(name);

			var icon = $(".raster-db-tree .row[dname='" + name + "'] .glyphicon-chevron-right");
			icon.removeClass("mc-icon-right");
			icon.addClass("mc-icon-down");
			icon.css("transform","rotate(90deg) translate(3px,0px)");

			that.panel.find(".nav.folder-tree[dname='" + name + "']").css("display","block");
			that.getList(name,path);
		});


		// 删除
		$(".raster-db-list .remove-db").click(function(){
			var name = $(this).parents(".row").first().attr("dname");
			if(name == null){
				return;
			}
			if(!confirm("确定删除数据库[" + name + "]?")){
				return;
			}
			MapCloud.notify.loading();
			dbsManager.unRegisterDataSource(name,that.unRegisterDataSource_callback);
		});


	},

	// 分解数据库信息
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

	// 删除数据库
	unRegisterDataSource_callback : function(result){
		MapCloud.notify.showInfo(result,"删除数据源");
		var that = MapCloud.rasterPanel;
		that.getDataSources();
	},

	// 获取列表
	getList : function(sourceName,path){
		if(sourceName == null || path == null){
			return;
		}
		MapCloud.notify.loading();
		rasterDBManager.getList(sourceName,path,this.getList_callback);
	},


	getList_callback : function(list){
		MapCloud.notify.hideLoading();
		var that = MapCloud.rasterPanel;
		that.showListTree(list);
		that.showListPanel(list);
	},

	// 左侧树
	showListTree : function(list){
		var l = null;
		var currentPath = null;
		var	html = "<ul class='nav folder-ul'>";
		
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
		var dbName = this.panel.find("#datasource_tab .current-db").html();
		var node = this.panel.find(".nav[dname='" + dbName + "'] a[fpath='" + currentPath +"']");
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
					var sourceName = that.panel.find("#datasource_tab .current-db").html();
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
					var sourceName = that.panel.find("#datasource_tab .current-db").html();
					that.getListTreeClick(sourceName,path);
				}else if(parent.find("ul.nav").length != 0 && 
					parent.find("ul.nav").first().css("display") == "block"){
					parent.find("ul.nav").first().css("display","none");
					$(this).find("i").addClass("fa-folder-o");
					$(this).find("i").removeClass("fa-folder-open-o");
					var sourceName = that.panel.find("#datasource_tab .current-db").html();
					that.getListTreeClick(sourceName,path);
				}else {
					var sourceName = that.panel.find("#datasource_tab .current-db").html();
					that.getList(sourceName,path);
				}
				that.panel.find(".current-path").val(path);
				that.panel.find(".tree-folder").removeClass("selected");
				$(this).addClass("selected");
				clicks = 0;
			}
		}).on("dblclick", function(e){
			e.preventDefault();  
		});
	},
	// 左侧的tree单击
	getListTreeClick : function(sourceName,path){
		MapCloud.notify.loading();
		rasterDBManager.getList(sourceName,path,this.getListTreeClick_callback);
	},

	getListTreeClick_callback : function(list){
		MapCloud.notify.hideLoading();
		var that = MapCloud.rasterPanel;
		that.list = list;
		that.showListPanel(list);
	},

	// 右侧列表
	showListPanel : function(list){
		if(!$.isArray(list)){
			return;
		}

		var l = null;
		var html = "";
		for(var i = 0; i < list.length;++i){
			l = list[i];
			if(l == null){
				return;
			}
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
		}

		this.panel.find(".right-panel-tab").css("display","none");
		this.panel.find("#datasource_tab").css("display","block");
		this.panel.find(".raster-folder-list").html(html);

		var that = this;
		// 点击文件夹
		this.panel.find(".raster-folder-list .row-folder .row-fname").click(function(){
			var sourceName = that.panel.find("#datasource_tab .current-db").html();
			var path = $(this).parent().attr("fpath");
			that.panel.find(".nav.folder-tree[dname='" + sourceName + "'] .tree-folder").removeClass("selected");
			var node = that.panel.find(".nav.folder-tree[dname='" + sourceName + "'] .tree-folder[fpath='" + path + "']");
			node.parents(".nav").first().css("display","block");
			node.addClass("selected");
			that.panel.find(".current-path").val(path);
			
			that.getList(sourceName,path);
		});

		this.panel.find(".raster-folder-list .row-file .row-fname").click(function(){
			var sourceName = that.panel.find("#datasource_tab .current-db").html();
			var rasterName = $(this).find("span").html();
			var rasterPath = that.panel.find(".current-path").val();
			that.rasterName = rasterName;
			that.rasterPath = rasterPath;
			that.showRasterTab(sourceName,rasterName,rasterPath);
		});
	},

	// 展示raster信息
	showRasterTab : function(sourceName,rasterName,rasterPath){
		this.panel.find(".right-panel-tab").css("display","none");
		this.panel.find("#raster_tab").css("display","block");
		this.panel.find("#raster_infos_tab").css("display","block");
		this.panel.find("#raster_preview_tab").css("display","none");
		this.panel.find("#show_raster_infos").attr("disabled",true);
		this.panel.find("#show_raster_preview").attr("disabled",false);

		var currentRasterPath = "";
		if(rasterPath == "/"){
			currentRasterPath = "/" + rasterName;
		}else{
			currentRasterPath = rasterPath + "/" + rasterName;
		}
		this.panel.find("#raster_tab .current-db").html(sourceName);
		this.panel.find(".current-raster-path").val(currentRasterPath);
		this.panel.find("#raster_infos_tab").css("display","none");
		rasterDBManager.describeRaster(sourceName,rasterName,rasterPath,this.describeRaster_callback);
	},

	describeRaster_callback : function(raster){
		var that = MapCloud.rasterPanel;
		that.raster = raster;
		that.showRasterInfo(raster);
	},

	// 展示影像信息
	showRasterInfo : function(raster){
		if(raster == null){
			return;
		}
		var html = "";
		html += "<div class='row'>"
		+ "		<div class='col-md-3'>名称</div>"
		+ "		<div class='col-md-8'>" + raster.name + "</div>"
		+ "	</div>"
		+ "	<div class='row'>"
		+ "		<div class='col-md-3'>格式</div>"
		+ "		<div class='col-md-8'>" + raster.format + "</div>"
		+ "	</div>"
		+ "	<div class='row'>"
		+ "		<div class='col-md-3'>波段</div>"
		+ "		<div class='col-md-8'>" + raster.bands + "</div>"
		+ "	</div>"
		+ "	<div class='row'>"
		+ "		<div class='col-md-3'>空间参考</div>"
		+ "		<div class='col-md-8'>" + raster.srid + "</div>"
		+ "	</div>"
		+ "	<div class='row'>"
		+ "		<div class='col-md-3'>宽度</div>"
		+ "		<div class='col-md-8'>" + raster.width + "</div>"
		+ "	</div>"		
		+ "	<div class='row'>"
		+ "		<div class='col-md-3'>高度</div>"
		+ "		<div class='col-md-8'>" + raster.height + "</div>"
		+ "	</div>"	;

		var extent = raster.extent;
		if(extent != null){
			html += "	<div class='row'>"
			+ "		<div class='col-md-3'>范围</div>"
			+ "		<div class='col-md-8'>" + extent.xmin + "," + extent.ymin + ","
			+ 		extent.xmax + "," + extent.ymax +  "</div>"
			+ "	</div>"	;
		}
		this.panel.find("#raster_infos_tab").html(html);	

		this.panel.find("#raster_tab .right-panel-content-tab").css("display","block");
		this.panel.find("#raster_infos_tab").css("display","block");
		this.panel.find(".raster-preview-div").css("display","none");
	},

	// 显示预览图
	showRasterPreview : function(sourceName,rasterName,rasterPath){
		var url = rasterDBManager.getRasterUrl(sourceName,rasterName,rasterPath);
		if(url != null){
			// this.panel.find("#raster_preview_tab img").attr("src",url);
		}
		this.panel.find("#raster_preview_tab").empty();
		this.panel.find("#raster_infos_tab").css("display","none");
		this.panel.find("#raster_preview_tab").css("display","block");

		var image = new Image();
		image.src = url;
		image.onload = function(){
			var width = $("#raster_preview_tab").width();
			var height = $("#raster_preview_tab").height();
			var scale_m = image.width/image.height;
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
			var html = "<img src='" + url + "' width='" 
				+ width + "'  height='" + height +"'>";
			$("#raster_preview_tab").html(html);
			if(marginTop != null){
				$("#raster_preview_tab img").css("margin-top",marginTop);
			}
			if(marginWidth != null){
				$("#raster_preview_tab img").css("margin-left",marginWidth);
			}
		};
	},

	// 新建文件夹
	createFolder : function(){
		var sourceName = this.panel.find("#datasource_tab .current-db").html();
		if(sourceName == null){
			MapCloud.notify.showIno("请选择一个数据库","Warning");
			return;
		}
		MapCloud.create_folder_dialog.showDialog("raster-user");	
	},

	// 新创建的文件夹
	setCreateFolderName: function(name){
		var currentPath = this.panel.find("#datasource_tab .current-path").val();
		var path = null;
		if(currentPath == "/"){
			path = "/" + name;
		}else{
			path = currentPath + "/" + name;
		}
		var sourceName = this.panel.find("#datasource_tab .current-db").html();
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
		var that = MapCloud.rasterPanel;
		var sourceName = that.panel.find("#datasource_tab .current-db").html();
		var path = that.panel.find(".current-path").val();
		that.getList(sourceName,path);	
	},

	// 刷新
	getListRefresh : function(sourceName,path){
		var sourceName = this.panel.find("#datasource_tab .current-db").html();
		if(sourceName == null){
			MapCloud.notify.showInfo("请选择一个数据源","Warning");
			return;
		}
		var path = this.panel.find("#datasource_tab .current-path").val();
		if(path == null){
			MapCloud.notify.showInfo("请选择刷新的路径","Warning");
		}
		MapCloud.notify.loading();
		rasterDBManager.getList(sourceName,path,this.getListRefresh_callback);
	},

	getListRefresh_callback : function(list){
		MapCloud.notify.showInfo("Success","刷新成功");
		var that = MapCloud.rasterPanel;
		that.showListTree(list);
		that.showListPanel(list);		
	},

	// 删除raster
	removeRaster : function(sourceName,rasterPath,rasterName){
		rasterDBManager.removeRaster(sourceName,rasterName,rasterPath,this.removeRaster_callback);
	},

	removeRaster_callback : function(result){
		MapCloud.notify.showInfo(result,"删除影像");
		var that = MapCloud.rasterPanel;
		var sourceName = that.panel.find("#datasource_tab .current-db").html();
		var path = that.panel.find(".current-path").val();
		that.getList(sourceName,path);
	},

	// 删除文件夹
	removeFolder : function(sourceName,folderPath){
		rasterDBManager.removeFolder(sourceName,folderPath,this.removeFolder_callback);
	},

	removeFolder_callback : function(result){
		MapCloud.notify.showInfo(result,"删除文件夹");
		var that = MapCloud.rasterPanel;
		var sourceName = that.panel.find("#datasource_tab .current-db").html();
		var path = that.panel.find(".current-path").val();
		that.panel.find(".tree-folder[fpath='" + path +"']").next().remove();
		that.getList(sourceName,path);
	},	
});