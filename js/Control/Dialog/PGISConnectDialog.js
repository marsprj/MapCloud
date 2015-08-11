// 新建数据库连接
MapCloud.PGISConnectDialog = MapCloud.Class(MapCloud.Dialog, {
	
	// 上级对话框
	source : null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		
		var dialog = this;
		
		//连接测试
		this.panel.find("#data_source_conn_test").each(function(){
			$(this).click(function(){
				var str = dialog.getConnetStr();
				if(str != null){
					dialog.tryConnection(str);
				}
				
			});			
		});

		// 确定，新建连接
		this.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				var name = dialog.panel
					.find("#data_source_conn_name").val();
				if(name == null || name == ""){
					alert("请输入名称");
					return;
				}

				var str = dialog.getConnetStr();
				dialog.registerDBS(name,str);
			});
		});
	},
	
	destory : function(){
		MapCloud.Dialog.prototype.destory.apply(this, arguments);
	},

	showDialog : function(source){
		MapCloud.Dialog.prototype.showDialog.apply(this,arguments);
		this.source = source;
	},
	
	cleanup : function(){
		// this.panel.find("#data_source_conn_name").each(function(){
		// 	$(this).val("");
		// });

		// this.panel.find("#data_source_conn_server").each(function(){
		// 	$(this).val("");
		// });

		// this.panel.find("#data_source_conn_instance").each(function(){
		// 	$(this).val("");
		// });

		// this.panel.find("#data_source_conn_db").each(function(){
		// 	$(this).val("");
		// });

		// this.panel.find("#data_source_conn_user").each(function(){
		// 	$(this).val("");
		// });

		// this.panel.find("#data_source_conn_password").each(function(){
		// 	$(this).val("");
		// });
	},

	// 获得连接字符串
	getConnetStr : function(){
		var server = this.panel
			.find("#data_source_conn_server").val();
		if(server == null || server == ""){
			alert("请输入地址");
			return null;
		}
		var instance = this.panel
			.find("#data_source_conn_instance").val();
		if(instance == null || instance == ""){
			alert("请输入端口");
			return null;
		}

		var db = this.panel
			.find("#data_source_conn_db").val();
		if(db == null || db == ""){
			alert("请输入数据库名称");
			return null;
		}
		var user = this.panel
			.find("#data_source_conn_user").val();
		if(user == null || user == ""){
			alert("请输入用户");
			return null;
		}
		var password = this.panel
			.find("#data_source_conn_password").val();
		if(password == null || password == ""){
			alert("请输入密码");
			return null;
		}

		var str = "server=" + server + ";instance=" + instance 
			+ ";database=" + db + ";user=" + user + ";password=" 
			+ password + ";encoding=GBK";
		return str;
	},

	// 连接测试
	tryConnection : function(str){
		MapCloud.notify.loading();
		dbsManager.tryConnection(str,
			this.connection_callback);
	},

	// 设置参数，未用
	// setParams: function(name,host,port,database,username,password){
	// 	this.panel.find("#data_source_conn_name").each(function(){
	// 		$(this).val(name);
	// 	});

	// 	this.panel.find("#data_source_conn_server").each(function(){
	// 		$(this).val(host);
	// 	});

	// 	this.panel.find("#data_source_conn_instance").each(function(){
	// 		$(this).val(port);
	// 	});

	// 	this.panel.find("#data_source_conn_db").each(function(){
	// 		$(this).val(database);
	// 	});

	// 	this.panel.find("#data_source_conn_user").each(function(){
	// 		$(this).val(username);
	// 	});

	// 	this.panel.find("#data_source_conn_password").each(function(){
	// 		$(this).val(password);
	// 	});
	// },

	// 连接测试结果
	connection_callback : function(result){
		var info = "连接测试";
		MapCloud.notify.showInfo(result,info);
	},

	// 注册数据源
	registerDBS : function(name,str){
		MapCloud.notify.loading();
		dbsManager.registerDataSource(name,"Postgres",
			str,this.registerDBS_callback);
	},

	// 注册数据源结果
	registerDBS_callback : function(result){
		var info = "注册数据源";
		MapCloud.notify.showInfo(result,info);
		
		// // 重新获取数据源列表
		// var parentDialog = MapCloud.data_source_dialog;
		// dbsManager.getDataSources(parentDialog
		// 	.getDataSources_callback);
		// var dialog = MapCloud.pgis_connection_dialog;
		// dialog.closeDialog();

		
		// // 显示新添加的数据源
		// var dbsList = parentDialog.panel.find("#data_source_list");
		// var name = dialog.panel.find("#data_source_conn_name").val();
		// dbsList.find("option[value='" + name + "']" )
		// 	.attr("selected",true);
		// parentDialog.getDataSource(name);

		// var parentDialog = MapCloud.db_admin_dialog;
		// dbsManager.getDataSources(parentDialog.getDataSources_callback);
		// var dialog = MapCloud.pgis_connection_dialog;
		// dialog.closeDialog();

		var dialog = MapCloud.pgis_connection_dialog;
		if(dialog.source == "raster"){
			var parentDialog = MapCloud.raster_db_dialog;
			dbsManager.getDataSources(parentDialog.getDataSources_callback);
			
		}else if(dialog.source == "vector"){
			var parentDialog = MapCloud.vector_db_dialog;
			dbsManager.getDataSources(parentDialog.getDataSources_callback)

		}
		dialog.closeDialog();
	}
});
	