$().ready(function(){
	cookieObj = new MapCloud.Cookie();
 	var cookiedUserName = cookieObj.getCookie("username");
    user = null;
    if(cookiedUserName != null){
    	user = new GeoBeans.User(cookiedUserName);
    }
    if(user == null){
    	return;
    }

    var authServer = "/ows/admin/mgr";
	authManager = new GeoBeans.AuthManager(authServer);
    MapCloud.notify	= new MapCloud.Notify("container","alert_loading");

    jobManager = user.getJobManager();
    // MapCloud.userPanel = new MapCloud.UserPanel("user_panel");
    MapCloud.userPanel = new MapCloud.UserPanel("user_info_panel");
    
});