// 新建数据库连接
MapCloud.PGISConnectDialog = MapCloud.Class(MapCloud.Dialog, {
	
	// 上级对话框的输入类型
	type: null,

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
				var name = dialog.panel.find("#data_source_conn_name").val();
				if(name == null || name == ""){
					MapCloud.notify.showInfo("请输入名称","Warning");
					dialog.panel.find("#data_source_conn_name").focus();
					return;
				}
				var nameReg = /^[0-9a-zA-Z_]+$/;
				if(!nameReg.test(name)){
					MapCloud.notify.showInfo("请输入有效的名称","Warning");
					dialog.panel.find("#data_source_conn_name").focus();
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

	showDialog : function(type,source){
		MapCloud.Dialog.prototype.showDialog.apply(this,arguments);
		this.type = type;
		this.source = source;
		if(this.type == "tile"){
			this.panel.find("#data_source_conn_instance").val("27017");
			this.panel.find("#data_source_conn_test").css("display","none");
		}else{
			this.panel.find("#data_source_conn_instance").val("5432");
			this.panel.find("#data_source_conn_test").css("display","inline-block");
		}
	},
	
	cleanup : function(){
		this.panel.find("#data_source_conn_name").val("");
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
		var server = this.panel.find("#data_source_conn_server").val();
		if(server == null || server == ""){
			MapCloud.notify.showInfo("请输入服务器地址","Warning");
			this.panel.find("#data_source_conn_server").focus();
			return null;
		}
		var serverReg = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
		if(!serverReg.test(server)){
			MapCloud.notify.showInfo("请输入有效的服务器地址","Warning");
			this.panel.find("#data_source_conn_server").focus();
			return null;
		}

		var instance = this.panel.find("#data_source_conn_instance").val();
		if(instance == null || instance == ""){
			MapCloud.notify.showInfo("请输入端口","Warning");
			this.panel.find("#data_source_conn_instance").focus();
			return null;
		}
		var instanceReg = /^[0-9]*[1-9][0-9]*$/;
		if(!instanceReg.test(instance)){
			MapCloud.notify.showInfo("请输入有效的端口","Warning");
			this.panel.find("#data_source_conn_instance").focus();
			return null;
		}

		var db = this.panel.find("#data_source_conn_db").val();
		if(db == null || db == ""){
			MapCloud.notify.showInfo("请输入数据库名称","Warning");
			this.panel.find("#data_source_conn_db").focus();
			return null;
		}
		var nameReg = /^[0-9a-zA-Z_]+$/;
		if(!nameReg.test(db)){
			MapCloud.notify.showInfo("请输入有效的数据库名称","Warning");
			this.panel.find("#data_source_conn_db").focus();
			return null;
		}

		var user = this.panel.find("#data_source_conn_user").val();
		if(user == null || user == ""){
			MapCloud.notify.showInfo("请输入用户","Warning");
			this.panel.find("#data_source_conn_user").focus();
			return null;
		}
		if(!nameReg.test(user)){
			MapCloud.notify.showInfo("请输入有效的用户","Warning");
			this.panel.find("#data_source_conn_user").focus();
			return null;
		}
		var password = this.panel.find("#data_source_conn_password").val();
		if(password == null || password == ""){
			MapCloud.notify.showInfo("请输入密码","Warning");
			this.panel.find("#data_source_conn_password").focus();
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
		var engine = null;
		if(this.type == "tile"){
			engine = "tilemgo";
		}else{
			engine = "Postgres";
		}
		dbsManager.registerDataSource(name,engine,
			str,this.type,this.registerDBS_callback);
	},

	// 注册数据源结果
	registerDBS_callback : function(result){
		var info = "注册数据源";
		MapCloud.notify.showInfo(result,info);
		
		var dialog = MapCloud.pgis_connection_dialog;
		var sourceName = dialog.panel.find("#data_source_conn_name").val();

		if(dialog.source == "raster"){
			var parentDialog = MapCloud.raster_db_dialog;
			parentDialog.getDataSources();
			parentDialog.setRegisterDataSourceName(sourceName);
		}else if(dialog.source == "feature"){
			var parentDialog = MapCloud.vector_db_dialog;
			parentDialog.getDataSources();
			parentDialog.setRegisterDataSourceName(sourceName);
		}else if(dialog.source == "tile"){
			var parentDialog = MapCloud.tile_db_dialog;
			parentDialog.getDataSources();
			parentDialog.setRegisterDataSourceName(sourceName);
		}else if(dialog.source == "user-feature"){
			var parent = MapCloud.vectorPanel;
			if(parent != null){
				parent.getDataSources();
			}
		}else if(dialog.source == "user-raster"){
			var parent = MapCloud.rasterPanel;
			if(parent != null){
				parent.getDataSources();
			}
		}else if(dialog.source == "user-tile"){
			var parent = MapCloud.tilePanel;
			if(parent != null){
				parent.getDataSources();
			}
		}
		dialog.closeDialog();
	}
});
	