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
    fileManager = user.getFileManager();
    gpsManager = user.getGPSManager();
    MapCloud.notify	= new MapCloud.Notify("container","alert_loading");
	MapCloud.pgis_connection_dialog = new MapCloud.PGISConnectDialog("pgisConnDialog");
	MapCloud.import_dialog = new MapCloud.ImportDialog("import_dialog");
	MapCloud.file_dialog = new MapCloud.FileDialog("fileDialog");
	MapCloud.importCSV_dialog = new MapCloud.ImportCSVDialog("import_csv_dialog");
	MapCloud.create_dataset_dialog = new MapCloud.CreateDataSetDialog("create_dataset_dialog");

	MapCloud.vectorPanel = new MapCloud.VectorPanel("vector_panel");

    $(".modal").draggable({
        handle: ".modal-header"
    }); 
	
	
});

