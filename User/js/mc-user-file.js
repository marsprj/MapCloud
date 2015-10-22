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

    fileManager = user.getFileManager();
    MapCloud.notify	= new MapCloud.Notify("container","alert_loading");

    MapCloud.importVector_dialog = new MapCloud.ImportVectorDialog("importVectorDialog");
    MapCloud.create_folder_dialog = new MapCloud.CreateFolderDialog("create_folder_dialog");
    MapCloud.filePanel = new MapCloud.FilePanel("file_panel");
	


    $(".modal").draggable({
        handle: ".modal-header"
    }); 
});