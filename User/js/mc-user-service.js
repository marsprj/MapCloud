$().ready(function(){
	// MapCloud.notify	= new MapCloud.Notify("container","alert_loading");
	// $(".service-tree").empty();
	// $("").empty();


	// cookieObj = new MapCloud.Cookie();
 // 	var cookiedUserName = cookieObj.getCookie("username");
 // 	user = null;
 //    if(cookiedUserName != null){
 //    	user = new GeoBeans.User(cookiedUserName);
 //    }
 //    if(user == null){
 //    	return;
 //    }


 //    var serviceManager = user.getServiceManager();
 //    serviceManager.describeServices

 	cookieObj = new MapCloud.Cookie();
 	var cookiedUserName = cookieObj.getCookie("username");
    user = null;
    if(cookiedUserName != null){
    	user = new GeoBeans.User(cookiedUserName);
    }
    if(user == null){
    	return;
    }

    serviceManager = user.getServiceManager();
    MapCloud.notify = new MapCloud.Notify("container","alert_loading");

    MapCloud.servicePanel = new MapCloud.ServicePanel("service_panel");


});