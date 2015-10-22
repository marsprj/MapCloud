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

    dbsManager = user.getDBSManager();

    MapCloud.notify	= new MapCloud.Notify("container","alert_loading");
	MapCloud.pgis_connection_dialog = new MapCloud.PGISConnectDialog("pgisConnDialog");
	MapCloud.create_tile_store_dialog = new MapCloud.CreateTileStoreDialog("create_tile_store_dialog");

	MapCloud.tilePanel = new MapCloud.TilePanel("tile_panel");

	
    $(".modal").draggable({
        handle: ".modal-header"
    }); 
});