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
    fileManager = user.getFileManager();
    rasterDBManager = user.getRasterDBManager();
    MapCloud.notify	= new MapCloud.Notify("container","alert_loading");
    MapCloud.pgis_connection_dialog = new MapCloud.PGISConnectDialog("pgisConnDialog");
    MapCloud.create_folder_dialog  = new MapCloud.CreateFolderDialog("create_folder_dialog");
    MapCloud.import_raster_dialog = new MapCloud.ImportRasterDialog("import_raster_dialog");
    MapCloud.file_dialog = new MapCloud.FileDialog("fileDialog");

    MapCloud.rasterPanel = new MapCloud.RasterPanel("raster_panel");
	
});