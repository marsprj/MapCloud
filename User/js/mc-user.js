var user = null;
var cookieObj = null;
$().ready(function(){

	user = null;
 	cookieObj = new MapCloud.Cookie();
 	var cookiedUserName = cookieObj.getCookie("username");
    if(cookiedUserName != null){
    	$("#title_panel").html("[" + cookiedUserName + "]管理页面" );
    	user = new GeoBeans.User(cookiedUserName);
    }
    MapCloud.notify	= new MapCloud.Notify("container","alert_loading");
    MapCloud.accountPanel = new MapCloud.AccountPanel("login-panel","register-panel");

    var authServer = "/ows/admin/mgr";
	authManager = new GeoBeans.AuthManager(authServer);
	MapCloud.cookieObj = new MapCloud.Cookie();
    if(user == null){
    	loadLoginPanel();
    }else{
    	loadCatalog();
    }
	

	$(".service_title").click(function(){
		var item_container = $(this).next();
		if(item_container.css("height")=="0px")
		{
			var count = item_container.children().length;
			item_container.css("height", (count*25).toString() + "px");
		}
		else
		{
			item_container.css("height","0px");
		}
	});

	// 退出
	$("#user_logout").click(function(){
		if(!confirm("确定要退出当前账户吗？")){
			return;
		}
		MapCloud.notify.loading();
		authManager.logout(user.name,logout_callback);
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
		user.logout();
		MapCloud.cookieObj.delCookie("username","/MapCloud");

	}
}


function loadCatalog(){
	$(".login-panel").css("display","none");
	$(".user-panel").css("display","block");
	var html  = "";
	var count = g_catalog.length;
	for(var i=0; i<count; i++){
		html += "<div class='service_container' scroll='no'>";

		var catalog = g_catalog[i];
		//html += "<div class='service_title'>" + catalog.name + "</div>";
		html += "<div class='service_title'><div class='service_title_icon'></div><span>" + catalog.name + "</span></div>";
		html += "<div class='item_container' id='item_" + i.toString() + "'>";
		var items = catalog.items.length;
		for(var j=0; j<items; j++){

			var item = catalog.items[j];
			//html += "<div class='item_block' onclick='onItemClick(\"" + item.name + "\",\"" + item.link + "\");'>" + item.name + "</div>";
			html += "<div class='item_block' onclick='onItemClick(\"" + item.name + "\",\"" + item.link + "\");'>";
			html += "<div class='item_block_icon'></div>";
			html += "<span>" + item.name + "<span>";
			html += "</div>";
		}

		html += "</div>";
	}

	document.getElementById("catalog_container").innerHTML = html;
}