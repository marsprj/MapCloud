var admin = null;
var cookieObj = null;
$().ready(function(){
	cookieObj = new MapCloud.Cookie();
	var cookiedUserName = cookieObj.getCookie("username");
	if(cookiedUserName != null  && cookiedUserName == "admin"){
		admin = new GeoBeans.User(cookiedUserName);
	}

	MapCloud.notify	= new MapCloud.Notify("container","alert_loading");
    MapCloud.accountPanel = new MapCloud.AccountPanel("login-panel","register-panel");

	var authServer = "/ows/admin/mgr";
	authManager = new GeoBeans.AuthManager(authServer);

	MapCloud.cookieObj = new MapCloud.Cookie();
    if(admin == null){
    	loadLoginPanel();
    }else{
    	loadCatalog();
    }

    // 退出
	$("#user_logout").click(function(){
		if(!confirm("确定要退出当前账户吗？")){
			return;
		}
		MapCloud.notify.loading();
		authManager.logout(admin.name,logout_callback);
	});
});

function loadLoginPanel(){
	$(".user-panel").css("display","none");
	$(".login-panel").css("display","block");
}
function logout_callback(result){
	MapCloud.notify.showInfo(result,"注销");
	if(result == "success"){
		MapCloud.accountPanel.hideRegisterPanel();
		MapCloud.accountPanel.hideUserpPanel();
		MapCloud.accountPanel.showLoginPanel();
		admin.logout();
		MapCloud.cookieObj.delCookie("username","/MapCloud");

	}
}


function loadCatalog(){
	$(".login-panel").css("display","none");
	$(".user-panel").css("display","block");
	var html  = "";
	var count = g_catalog.length;
	var name = null;
	var link = null;
	var icon = null;
	for(var i=0; i<count; i++){
		

		var catalog = g_catalog[i];
		name = catalog.name;
		icon = catalog.icon;
		link = catalog.link;
		html += "<div class='catalog-item' onclick='onItemClick(\"" + name + "\",\"" + link + "\");' iname='"+ name + "'>"
			+ 	"	<img src='../images/" + icon + "'>"
			+ 	"	<h5>" + name + "</h5>"
			+	"</div>";
	}

	document.getElementById("catalog_container").innerHTML = html;
	$(".catalog-item").first().addClass("selected");
}