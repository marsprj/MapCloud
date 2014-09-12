MapCloud.PGISConnectDialog = MapCloud.Class(MapCloud.Dialog, {
	
	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		
		var dialog = this;
		this.panel.click(function(){
			//dialog.closeDialog();
		});

		//连接测试
		this.panel.find("#pgis_connection_test").each(function(){
			$(this).click(function(){
				alert("连接测试");
			});			
		});

		
	},
	
	destory : function(){
		MapCloud.Dialog.prototype.destory.apply(this, arguments);
	},
	
	cleanup : function(){
		this.panel.find("#pgis_connection_name").each(function(){
			$(this).val("");
		});

		this.panel.find("#pgis_connection_host").each(function(){
			$(this).val("");
		});

		this.panel.find("#pgis_connection_port").each(function(){
			$(this).val("");
		});

		this.panel.find("#pgis_connection_database").each(function(){
			$(this).val("");
		});

		this.panel.find("#pgis_connection_username").each(function(){
			$(this).val("");
		});

		this.panel.find("#pgis_connection_password").each(function(){
			$(this).val("");
		});
	},

	setParm: function(name,host,port,database,username,password){
		this.panel.find("#pgis_connection_name").each(function(){
			$(this).val(name);
		});

		this.panel.find("#pgis_connection_host").each(function(){
			$(this).val(host);
		});

		this.panel.find("#pgis_connection_port").each(function(){
			$(this).val(port);
		});

		this.panel.find("#pgis_connection_database").each(function(){
			$(this).val(database);
		});

		this.panel.find("#pgis_connection_username").each(function(){
			$(this).val(username);
		});

		this.panel.find("#pgis_connection_password").each(function(){
			$(this).val(password);
		});
	},

	
});
	