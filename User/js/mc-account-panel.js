MapCloud.AccountPanel = MapCloud.Class({
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
			that.hideUserpPanel();
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
			that.hideUserpPanel();
			that.showLoginPanel();
		});

		// enter register
		this.registerPanel.find("input[name='repassword']").keypress(function(e){
			if(e.which == 13){
				that.register();
			}
		});

		this.registerPanel.find("input[name='password']").bind('keyup onfocus onblur', function () {
			var oTips = document.getElementById('tips');
			var aSpan = oTips.getElementsByTagName("span");
	        var index = that.checkStrong(this.value);
	        var aStr = ["弱", "中", "强", "非常好"];
	       	oTips.style.display = "block";
	        
	        oTips.className = "s" + index;
	        for (var i = 0; i < aSpan.length; i++) {
	            //先清空在赋值
	            aSpan[i].className = aSpan[i].innerHTML = "";
	            //赋值
	            if (this.value != "") {
	                aSpan[index - 1].className = "active";
	                aSpan[index - 1].innerHTML = aStr[index - 1];
	            }

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


	hideUserpPanel : function(){
		$(".user-panel").css("display","none");
	},

	showUserPanel : function(){
		$(".user-panel").css("display","block");
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
			var that = MapCloud.accountPanel;
			if(that.loginName == "admin"){
				MapCloud.cookieObj.setCookie("username",that.loginName,"/MapCloud");
				window.location.href = "../Admin";
			}else{
				that.hideLoginPanel();
				that.hideRegisterPanel();
				that.showUserPanel();
				that.initUser(that.loginName);
			}
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

		MapCloud.cookieObj.setCookie("username",username,"/MapCloud");
		loadCatalog();
		$("#title_panel").html("[" + username + "]管理页面" );

		// MapCloud.userPanel.getUserInfo(username);
		MapCloud.userPanel = new MapCloud.UserPanel("user_panel");
		MapCloud.userPanel.panel =  $("#iframeId").contents().find("#user_panel");
		MapCloud.userPanel.registerPanelEvent();
		MapCloud.userPanel.getUserInfo(username);

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
			this.registerPanel.find("input[name='alias'").focus();
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
			var that = MapCloud.accountPanel;
			// that.initRegisterUser();
			that.hideLoginPanel();
			$(".map-panel").css("display","block");
			that.initUser(that.registerName);
		}
	},	

	// 1) 任何在1-6之间的字符的组合，弱；例如： win
	// 2) 任何字符数的两类字符组合，中； 例如： win123
	// 3) 12位字符数以下的三类或四类字符组合，强；  例如： win123abcABC
	// 4) 12位字符数以上的三类或四类字符组合，非常好。 例如：win123abcABC!

	checkStrong : function(sValue) {
	    var modes = 0;
	    //正则表达式验证符合要求的
	    if (sValue.length < 1) return modes;
	    if (/\d/.test(sValue)) modes++; //数字
	    if (/[a-z]/.test(sValue)) modes++; //小写
	    if (/[A-Z]/.test(sValue)) modes++; //大写  
	    if (/\W/.test(sValue)) modes++; //特殊字符
	   
	   //逻辑处理
	    switch (modes) {
	        case 1:
	            return 1;
	            break;
	        case 2:
	            return 2;
	        case 3:
	        case 4:
	            return sValue.length < 12 ? 3 : 4
	            break;
	    }
	}	
});