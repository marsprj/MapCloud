MapCloud.RasterPanel = MapCloud.Class({
	
	panel : null,


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


		$(".vector-db-tree .glyphicon-chevron-right").click(function(){
			var name = $(this).parents(".row").first().attr("dname");
			if($(this).hasClass("mc-icon-right")){
				// 展开
				$(this).removeClass("mc-icon-right");
				$(this).addClass("mc-icon-down");
				$(this).css("transform","rotate(90deg) translate(3px,0px)");
				$(".vector-db-tree .nav[dname='" + name + "']").remove();
				// getDataSource(name);
			}else{
				$(this).css("transform","rotate(0deg) translate(0px,0px)");
				$(this).addClass("mc-icon-right");
				$(this).removeClass("mc-icon-down");	
				$(".vector-db-tree .nav[dname='" + name + "']").slideUp(500);	
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
		}

		this.panel.find(".raster-folder-list").html(html);
	},
});