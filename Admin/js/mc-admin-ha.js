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


    MapCloud.notify	= new MapCloud.Notify("container","alert_loading");

    MapCloud.haPanel = new MapCloud.HaPanel("ha_panel");  
});