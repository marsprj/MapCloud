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
    MapCloud.notify	= new MapCloud.Notify("container","alert_loading");
	MapCloud.pgis_connection_dialog = new MapCloud.PGISConnectDialog("pgisConnDialog");

	MapCloud.vectorPanel = new MapCloud.VectorPanel("vector_panel");
	
    // getDataSources();

    // // 当前数据源
    // var dataSourceCur = null;
    // // 当前图层
    // var dataSetCur = null;

    // // 一页显示个数
    // var maxFeatures = 30;

    // reigsterPanelEvent();
	
});

