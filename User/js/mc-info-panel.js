MapCloud.UserPanel = MapCloud.Class({

	panel : null,

	initialize : function(id){
		this.panel = $("#" + id);

		if(user != null){
			this.getUserInfo(user.name);
		}
		

		this.registerPanelEvent();
	},

	registerPanelEvent : function(){
		var that = this;

		// 用户信息
		this.panel.find(".use-info-btn").click(function(){
			that.showUserInfoPanel();
		});

		// 修改密码
		this.panel.find(".user-password-btn").click(function(){
			that.showUserPasswordPanel();
		});

		// 修改密码
		this.panel.find(".btn-change-password").click(function(){
			that.changePassword();
		});

		that.showUserInfoPanel();
	},


	showUserInfoPanel : function(){
		this.panel.find("#user_paswd_panel").css("display","none");
		this.panel.find("#user_info_panel").css("display","block");
	},

	showUserPasswordPanel : function(){
		this.panel.find("#user_info_panel").css("display","none");
		this.panel.find("#user_paswd_panel").css("display","block");
	},
	// 获取用户信息
	getUserInfo : function(name){
		authManager.getUser(name,this.getUserInfo_callback);

	},

	getUserInfo_callback : function(userObj){
		if(!(userObj instanceof Object)){
			console.log(userObj);
			return;
		}
		var that = MapCloud.userPanel;
		that.showUserInfo(userObj);
		
	},

	showUserInfo : function(userObj){
		var name = userObj.name;
		var alias = userObj.alias;
		var email = userObj.email;
		var role = userObj.role;

		this.panel.find(".user-info-name").val(name);
		this.panel.find(".user-info-alias").val(alias);
		this.panel.find(".user-info-email").val(email);
		this.panel.find(".user-info-role").val(role);
		this.panel.find(".user-passwd-name").val(name);
	},


	// 修改密码
	changePassword : function(){
		var username = this.panel.find(".user-passwd-name").val();

		var password = this.panel.find(".user-passwd").val();
		if(password == ""){
			MapCloud.notify.showInfo("请输入密码","Warning");
			this.panel.find(".user-passwd").focus();
			return;
		}


		var repassword = this.panel.find(".user-repasswd").val();
		if(repassword == ""){
			MapCloud.notify.showInfo("请再次输入密码","Warning");
			this.panel.find(".user-repasswd").focus();
			return;
		}
		if(password != repassword){
			MapCloud.notify.showInfo("两次输入的密码不一致","Warning");
			return;
		}

	},
});