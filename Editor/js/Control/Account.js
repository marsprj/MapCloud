MapCloud.Account = MapCloud.Class({
	// 登录页面
	loginPanel : null,

	// 登录用户名
	loginName : null,

	// 注册页面
	registerPanel : null,

	// 注册账户名
	registerName : null,


	initialize : function(loginId,registerId){
		this.loginPanel = $("." + loginId);
		this.registerPanel = $("." + registerId);

		var that = this;
		// 登录
		this.loginPanel.find(".btn-account").click(function(){
			that.login();
		});

		// 登录页面跳转至注册
		this.loginPanel.find(".btn-register").click(function(){
			that.hideLoginPanel();
			that.showRegisterPanel();

		});


		// enter登录
		this.loginPanel.find("input[name='password']").keypress(function(e){
			if(e.which == 13){
				that.login();
			}
		});


		// 注册
		this.registerPanel.find(".btn-account").click(function(){
			that.register();
		});

		// 注册页面跳转至登录
		this.registerPanel.find(".btn-login").click(function(){
			that.hideRegisterPanel();
			that.showLoginPanel();
		});

		// enter register
		this.registerPanel.find("input[name='repassword']").keypress(function(e){
			if(e.which == 13){
				that.register();
			}
		});
	},

	showLoginPanel : function(){

		this.loginName = null;
		this.loginPanel.css("display","block");
		this.loginPanel.find("input").val("");
		this.loginPanel.find("input").first().focus();


	},

	hideLoginPanel : function(){
		this.loginPanel.css("display","none");
	},

	showRegisterPanel : function(){
		this.registerName = null;
		this.registerPanel.css("display","block");
		this.registerPanel.find("input").val("");
		this.registerPanel.find("input").first().focus();
	},

	hideRegisterPanel : function(){
		this.registerPanel.css("display","none");
	},


	hideMapPanel : function(){
		$(".map-panel").css("display","none");
	},

	showMapPanel : function(){
		$(".map-panel").css("display","block");
	},


	// 登录
	login : function(){
		var name = this.loginPanel.find("input[name='username']").val();
		if(name == ""){
			MapCloud.notify.showInfo("请输入用户名","Warning");
			this.loginPanel.find("input[name='username']").focus();
			return;
		}

		var password = this.loginPanel.find("input[name='password']").val();
		if(password == ""){
			MapCloud.notify.showInfo("请输入密码","Warning");
			this.loginPanel.find("input[name='password']").focus();
			return;
		}
		MapCloud.notify.loading();
		this.loginName = name;
		authManager.login(name,password,this.login_callback);
	},

	login_callback : function(result){
		MapCloud.notify.showInfo(result,"登录");
		if(result == "success"){
			var that = MapCloud.account;

			that.hideLoginPanel();
			$(".map-panel").css("display","block");
			that.initUser(that.loginName);
		}else{

		}
			
	},


	initUser : function(username){
		if(username == null){
			return;
		}
		user = new GeoBeans.User(username);

		mapManager = user.getMapManager();
		styleManager = user.getStyleManager();
		fileManager = user.getFileManager();
		dbsManager = user.getDBSManager();
		rasterDBManager = user.getRasterDBManager();
		gpsManager = user.getGPSManager();
		poiManager = user.getPoiManager();
		subManager = user.getSubManager();

		// 设置参数
		// subManager.setSubParams("base","gc_aqi_ranking","time_point","area",MapCloud.topicPanel.getSub_callback);
		subManager.setSubParams("base","gc_aqi_ranking","time_point","area",
		"gc_aqi_ranking_uptime","uptime","downtime",MapCloud.topicPanel.getSub_callback);
		
		MapCloud.cookieObj.setCookie("username",username,"/MapCloud");

		MapCloud.userToolBar.showUser(username);
		// this.hideLoginPanel();
		// $(".map-panel").css("display","block");
		// 加载地图
		MapCloud.notify.loading();
		mapManager.getMaps(ribbonObj.getMaps_callback);		
	},


	register : function(){

		// 名称
		var name = this.registerPanel.find("input[name='username']").val();
		if(name == null || name == "" ){
			MapCloud.notify.showInfo("请输入注册的用户名","Warning");
			this.registerPanel.find("input[name='username']").focus();
			return;
		}
		var nameReg = /^[0-9a-zA-Z_]+$/;
		if(!nameReg.test(name)){
			MapCloud.notify.showInfo("请输入有效的用户名","Warning");
			this.registerPanel.find("input[name='username']").focus();
			return;
		}

		// 昵称
		var alias = this.registerPanel.find("input[name='alias']").val();
		if(alias == null || alias == ""){
			MapCloud.notify.showInfo("请输入注册的昵称","Warning");
			this.registerPanel.find("input[name='alias'").focus();
			return;
		}
		if(!nameReg.test(alias)){
			MapCloud.notify.showInfo("请输入有效的昵称","Warning");
			this.registerPanel.find("input[name='alias']").focus();
			return;
		}

		// 邮箱
		var email = this.registerPanel.find("input[name='email']").val();
		if(email == null || email == ""){
			MapCloud.notify.showInfo("请输入注册的邮箱","Warning");
			this.registerPanel.find("input[name='email']").focus();
			return;
		}
		var emailReg = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if(!emailReg.test(email)){
			MapCloud.notify.showInfo("请输入有效的邮箱","Warning");
			this.registerPanel.find("input[name='email']").focus();
			return;
		}

		// 密码
		var password = this.registerPanel.find("input[name='password']").val();
		if(password == null || password == ""){
			MapCloud.notify.showInfo("请输入注册的密码","Warning");
			this.registerPanel.find("input[name='password']").focus();
			return;
		}

		var repassword = $("input[name='repassword'").val();
		if(repassword == null || repassword == ""){
			MapCloud.notify.showInfo("请再次输入注册的密码","Warning");
			this.registerPanel.find("input[name='repassword']").focus();
			return;
		}

		if(password != repassword){
			MapCloud.notify.showInfo("两次输入的密码不同","Warning");
			this.registerPanel.find("input[name='repassword']").focus();
			return;
		}
		this.registerName = name;
		MapCloud.notify.loading();
		authManager.createUser(name,alias,password,email,"normal",this.register_callback);
	},

	register_callback : function(result){
		MapCloud.notify.showInfo(result,"注册");
		if(result == "success"){
			var that = MapCloud.account;
			// that.initRegisterUser();
			that.hideLoginPanel();
			$(".map-panel").css("display","block");
			that.initUser(that.registerName);
		}
	},

});