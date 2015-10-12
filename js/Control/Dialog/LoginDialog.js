MapCloud.LoginDialog = MapCloud.Class(MapCloud.Dialog,{
	// 用户名
	username : null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		
		var dialog = this;

		// 登录
		this.panel.find(".btn-confirm").click(function(){
			var name = dialog.panel.find("input[name='username']").val();
			if(name == ""){
				MapCloud.notify.showInfo("请输入用户名","Warning");
				dialog.panel.find("input[name='username']").focus();
				return;
			}

			var password = dialog.panel.find("input[name='password']").val();
			if(password == ""){
				MapCloud.notify.showInfo("请输入密码","Warning");
				dialog.panel.find("input[name='password']").focus();
				return;
			}
			MapCloud.notify.loading();
			dialog.username = name;
			authManager.login(name,password,dialog.login_callback);
		});
	},

	cleanup : function(){
		this.username = null;
		this.panel.find("input").val("");
	},

	login_callback : function(result){
		MapCloud.notify.showInfo(result,"登录");
		if(result == "success"){
			var dialog = MapCloud.login_dialog;
			dialog.initUser();
			dialog.closeDialog();
		}
	},

	initUser : function(){
		user = new GeoBeans.User(this.username);

		mapManager = user.getMapManager();
		styleManager = user.getStyleManager();

		MapCloud.userToolBar.showUser(this.username);

		MapCloud.notify.loading();
		mapManager.getMaps(ribbonObj.getMaps_callback);


	},


	



});