var authManager = null;
$().ready(function(){
	cookieObj = new MapCloud.Cookie();
 	var cookiedUserName = cookieObj.getCookie("username");
    admin = null;
    if(cookiedUserName != null){
    	admin = new GeoBeans.User(cookiedUserName);
    }
    if(admin == null){
    	return;
    }
    dbsManager = admin.getDBSManager();
    var authServer = "/ows/admin/mgr";
	authManager = new GeoBeans.AuthManager(authServer);
    MapCloud.notify	= new MapCloud.Notify("container","alert_loading");

    MapCloud.dataPanel = new MapCloud.DataPanel("data_panel");  
});