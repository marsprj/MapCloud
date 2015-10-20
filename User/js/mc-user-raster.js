$().ready(function(){
	
	cookieObj = new MapCloud.Cookie();
 	var cookiedUserName = cookieObj.getCookie("username");
    if(cookiedUserName != null){
    	user = new GeoBeans.User(cookiedUserName);
    }
    if(user == null){
    	return;
    }

    dbsManager = user.getDBSManager();
    rasterDBManager = user.getRasterDBManager();
    MapCloud.notify	= new MapCloud.Notify("container","alert_loading");
    MapCloud.pgis_connection_dialog = new MapCloud.PGISConnectDialog("pgisConnDialog");

    MapCloud.rasterPanel = new MapCloud.RasterPanel("raster_panel");
	
});