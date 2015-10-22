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
	},
});