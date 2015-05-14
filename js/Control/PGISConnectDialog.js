MapCloud.PGISConnectDialog = MapCloud.Class(MapCloud.Dialog, {
	
	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		
		var dialog = this;
		
		//连接测试
		this.panel.find("#data_source_conn_test").each(function(){
			$(this).click(function(){
				var server = dialog.panel
					.find("#data_source_conn_server").val();
				if(server == null || server == ""){
					alert("请输入地址");
					return;
				}
				var instance = dialog.panel
					.find("#data_source_conn_instance").val();
				if(instance == null || instance == ""){
					alert("请输入端口");
					return;
				}

				var db = dialog.panel
					.find("#data_source_conn_db").val();
				if(db == null || db == ""){
					alert("请输入数据库名称");
					return;
				}
				var user = dialog.panel
					.find("#data_source_conn_user").val();
				if(user == null || user == ""){
					alert("请输入用户");
					return;
				}
				var password = dialog.panel
					.find("#data_source_conn_password").val();
				if(password == null || password == ""){
					alert("请输入密码");
					return;
				}
				var str = dialog.getConnetStr(server,
						instance,db,user,password);

				MapCloud.alert_info.loading();
				dbsManager.tryConnection(str,
					dialog.connection_callback);
			});			
		});

		this.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				var name = dialog.panel
					.find("#data_source_conn_name").val();
				if(name == null || name == ""){
					alert("请输入名称");
					return;
				}
				var server = dialog.panel
					.find("#data_source_conn_server").val();
				if(server == null || server == ""){
					alert("请输入地址");
					return;
				}
				var instance = dialog.panel
					.find("#data_source_conn_instance").val();
				if(instance == null || instance == ""){
					alert("请输入端口");
					return;
				}

				var db = dialog.panel
					.find("#data_source_conn_db").val();
				if(db == null || db == ""){
					alert("请输入数据库名称");
					return;
				}
				var user = dialog.panel
					.find("#data_source_conn_user").val();
				if(user == null || user == ""){
					alert("请输入用户");
					return;
				}
				var password = dialog.panel
					.find("#data_source_conn_password").val();
				if(password == null || password == ""){
					alert("请输入密码");
					return;
				}
				var str = dialog.getConnetStr(server,
						instance,db,user,password);
				MapCloud.alert_info.loading();
				dbsManager.registerDataSource(name,"Postgres",
					str,dialog.registerDBS_callback);
			});
		});
	},
	
	destory : function(){
		MapCloud.Dialog.prototype.destory.apply(this, arguments);
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

	setParm: function(name,host,port,database,username,password){
		this.panel.find("#data_source_conn_name").each(function(){
			$(this).val(name);
		});

		this.panel.find("#data_source_conn_server").each(function(){
			$(this).val(host);
		});

		this.panel.find("#data_source_conn_instance").each(function(){
			$(this).val(port);
		});

		this.panel.find("#data_source_conn_db").each(function(){
			$(this).val(database);
		});

		this.panel.find("#data_source_conn_user").each(function(){
			$(this).val(username);
		});

		this.panel.find("#data_source_conn_password").each(function(){
			$(this).val(password);
		});
	},


	getConnetStr: function(server,
						instance,db,user,password){
		if( server == null 
			|| instance == null || db == null 
			|| user == null || password == null){
			return;
		}
		var str = "server=" + server + ";instance=" + instance 
			+ ";database=" + db + ";user=" + user + ";password=" 
			+ password + ";encoding=GBK";
		return str;
	},

	connection_callback : function(result){
		var info = "连接测试";
		MapCloud.alert_info.showInfo(result,info);
	},

	registerDBS_callback : function(result){
		var info = "注册数据源";
		MapCloud.alert_info.showInfo(result,info);
		
		var parentDialog = MapCloud.data_source_dialog;
		dbsManager.getDataSources(parentDialog
			.getDataSources_callback);
		var dialog = MapCloud.pgis_connection_dialog;
		dialog.closeDialog();
		var dbsList = parentDialog.panel.find("#data_source_list");
		var name = dialog.panel.find("#data_source_conn_name").val();
		dbsList.find("option[value='" + name + "']" )
			.attr("selected",true);
		parentDialog.getDataSource(name);
	}
});
	