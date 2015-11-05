MapCloud.UserToolBar = MapCloud.Class(MapCloud.Panel,{
	
	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);


	},

	showUser : function(username){
		this.panel.find(".login-li").html('<a href="javascript:void(0)" id="logout_btn">退出</a>');
		// 区别对待
		if(username == "admin"){
			this.panel.find(".register-li").html('<a href="../Admin" target="_blank">' + username + '</a>');
		}else{
			this.panel.find(".register-li").html('<a href="../User" target="_blank">' + username + '</a>');
		}
		// this.panel.find(".register-li").html('<a href="../User" target="_blank">' + username + '</a>');

		var that = this;
		that.username = username;

		$("#logout_btn").click(function(){
			if(!confirm("确定要退出当前账户吗？")){
				return;
			}
			authManager.logout(that.username,that.logout_callback);
		});
	},

	logout_callback : function(result){
		MapCloud.notify.showInfo(result,"注销");
		var that = MapCloud.userToolBar;
		if(result == "success"){
			MapCloud.account.showLoginPanel();
			$(".map-panel").css("display","none");
			$(".register-panel").css("display","none");
			$(".login-panel").css("display","block");
			user.logout();
			MapCloud.cookieObj.delCookie("username","/MapCloud");
			MapCloud.refresh_panel.cleanup();
			if(mapObj != null){
				mapObj.close();
			}
			mapObj = null;
		}
	}
});