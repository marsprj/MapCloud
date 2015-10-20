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

	
    getDataSources();

    // 当前数据源
    var dataSourceCur = null;
    // 当前图层
    var dataSetCur = null;

    // 一页显示个数
    var maxFeatures = 30;

    reigsterPanelEvent();
	
});

	// function getDataSources(){
	// 	$(".right-panel-tab").css("display","none");
	// 	$("#datasources_tab").css("display","block");
	// 	MapCloud.notify.loading();
	// 	dbsManager.getDataSources(getDataSources_callback,"Feature");
	// }

function getDataSources_callback(dataSources){
	MapCloud.notify.hideLoading();
	showDataSourcesTree(dataSources);
	showDataSourcesList(dataSources);
}
// 左侧树
function showDataSourcesTree(dataSources){
	if(!$.isArray(dataSources)){
		return;
	}
	var dataSource = null;
	var name = null;
	var html = "";
	for(var i = 0; i < dataSources.length;++i){
		dataSource = dataSources[i];
		if(dataSource == null){
			continue;
		}
		name = dataSource.name;
		html += '<div class="row" dname="' + name + '">'
			+	'	<div class="col-md-1 col-md-20px">'
			+	'		<div class="glyphicon glyphicon-chevron-right mc-icon mc-icon-right mc-icon-rotate"></div>'
			+	'	</div>'
			+	'	<div class="col-md-1 col-md-20px">'
			+	'		<i class="db-icon list-icon"></i>'
			+	'	</div>'
			+	'	<div class="col-md-7 db-tree-name">' + name  + '</div>'
			+	'</div>';
	}
	$(".vector-db-tree").html(html);


	$(".vector-db-tree .glyphicon-chevron-right").click(function(){
		var name = $(this).parents(".row").first().attr("dname");
		if($(this).hasClass("mc-icon-right")){
			// 展开
			$(this).removeClass("mc-icon-right");
			$(this).addClass("mc-icon-down");
			$(this).css("transform","rotate(90deg) translate(3px,0px)");
			$(".vector-db-tree .nav[dname='" + name + "']").remove();
			getDataSource(name);
		}else{
			$(this).css("transform","rotate(0deg) translate(0px,0px)");
			$(this).addClass("mc-icon-right");
			$(this).removeClass("mc-icon-down");	
			$(".vector-db-tree .nav[dname='" + name + "']").slideUp(500);	
		}
	});
}

// 展示右侧的列表
function showDataSourcesList(dataSources){
	if(!$.isArray(dataSources)){
		return;
	}
	var dataSource = null;
	var name = null;
	var html = "";
	var engine = null;
	var constr = null;
	for(var i = 0; i < dataSources.length; ++i){
		dataSource = dataSources[i];
		if(dataSource == null){
			continue;
		}
		name = dataSource.name;
		constr = dataSource.constr;
		engine = dataSource.engine;
		var conObj = getDataSourceInfo(constr);
		html += '<div class="row" dname="' + name + '">'
			+	'	<div class="col-md-1">'
			+		(i+1)
			+	'	</div>'
			+	'	<div class="col-md-2">'
			+	     	name
			+	'	</div>'
			+	'	<div class="col-md-2">'
			+			conObj.server
			+	'	</div>'
			+	'	<div class="col-md-1">'
			+			conObj.instance
			+	'	</div>'
			+	'	<div class="col-md-1">'
			+			conObj.database
			+	'	</div>'
			+	'	<div class="col-md-1">'
			+			conObj.user
			+	'	</div>'
			+	'	<div class="col-md-2">'
			+			conObj.password
			+	'	</div>'
			+	'	<div class="col-md-2">'
			+	'		<a href="javascript:void(0)" class="oper enter-db">进入</a>'
			+	'		<a href="javascript:void(0)" class="oper remove-db">删除</a>'
			+	'	</div>'
			+	'</div>';
	}

	$(".vector-db-list").html(html);

	// 进入数据库
	$(".vector-db-list .enter-db").click(function(){
		var name = $(this).parents(".row").first().attr("dname");
		if(name == null){
			return;
		}
		var icon = $(".vector-db-tree .row[dname='" + name + "'] .glyphicon-chevron-right");
		icon.removeClass("mc-icon-right");
		icon.addClass("mc-icon-down");
		icon.css("transform","rotate(90deg) translate(3px,0px)");
		$(".vector-db-tree .nav[dname='" + name +"']").remove();
		getDataSource(name);
	});

	// 删除数据库
	$(".vector-db-list .remove-db").click(function(){
		var name = $(this).parents(".row").first().attr("dname");
		if(name == null){
			return;
		}
		if(!confirm("确定删除数据库[" + name + "]?")){
			return;
		}
		MapCloud.notify.loading();
		dbsManager.unRegisterDataSource(name,unRegisterDataSource_callback);

	});
}


function getDataSourceInfo(str){
	if(str == null){
		return null;
	}
	var serverIndex = str.indexOf("server=");
	var index = str.indexOf(";");
	var server = str.slice(serverIndex + "server=".length,index);

	str = str.slice(index+1,str.length);
	var instanceIndex = str.indexOf("instance=");
	index = str.indexOf(";")
	var instance = str.slice(instanceIndex + "instance=".length,index);

	str = str.slice(index+1,str.length);
	var databaseIndex = str.indexOf("database=");
	index = str.indexOf(";");
	var database = str.slice(databaseIndex + "database=".length, index);

	str = str.slice(index+1,str.length);
	var userIndex = str.indexOf("user=");
	index = str.indexOf(";");
	var user = str.slice(userIndex + "user=".length, index);

	str = str.slice(index+1,str.length);
	var passwordIndex = str.indexOf("password=");
	index = str.indexOf(";");
	var password = str.slice(passwordIndex + "password=".length,index);

	return {
		server 		: server,
		instance 	: instance,
		database 	: database,
		user 		: user,
		password 	: password
	}
}

function unRegisterDataSource_callback(result){
	MapCloud.notify.showInfo(result,"删除数据源");
	dbsManager.getDataSources(getDataSources_callback,"Feature");
}


function getDataSource(name){
	
	$(".right-panel-tab").css("display","none");
	$("#datasource_tab").css("display","block");
	$("#show_datasets_list").css("disabled",false);
	$("#show_datasets_thumb").css("disabled",true);
	$(".vector-db-tree .row").removeClass("selected");
	$(".vector-db-tree .row[dname='" + name + "']").addClass("selected");
	$(".current-db").html(name);
	$(".datasets-list").empty();
	$(".datasets_thumb_tab").empty();

	if(name == null){
		return;
	}
	MapCloud.notify.hideLoading();
	dbsManager.getDataSource(name,getDataSource_callback);
}

function getDataSource_callback(dataSource){
	MapCloud.notify.hideLoading();
	if(dataSource == null){
		return;
	}
	dataSourceCur = dataSource;
	getDataSets(dataSourceCur);
}

function getDataSets(dataSource){
	if(dataSource == null){
		return;
	}
	MapCloud.notify.loading();
	dataSource.getDataSets(getDataSets_callback);
}

// 获得图层数据
function getDataSets_callback(dataSets){
	MapCloud.notify.hideLoading();
	showDataSetsTree(dataSets);
	showDataSetsList(dataSets);
	showDataSetsThumb(dataSets);
}

// 图层左侧树
function showDataSetsTree(dataSets){
	if(!$.isArray(dataSets)){
		return;
	}

	var dataSourceName = null;
	if(dataSets.length >0){
		dataSet = dataSets[0];
		if(dataSet != null){
			var dataSource = dataSet.dataSource;
			if(dataSource != null){
				dataSourceName = dataSource.name;
			}
		}
	}
	if(dataSourceName == null){
		return;
	}

	var dataSet = null;
	var name = null;
	var html = "<ul class='nav' dname='" + dataSourceName + "'>";
	for(var i = 0; i < dataSets.length; ++i){
		dataSet = dataSets[i];
		if(dataSet == null){
			continue;
		}
		name = dataSet.name;
		geomType = dataSet.geometryType;
		geomTypeHtml = getDataSetGeomTypeHtml(geomType);
		html += "<li sname='" + name + "'>"
			+ 	"	<a href='#' class='tree-table' dindex='"
			+		i + "'>"
			+ 		geomTypeHtml
			+	"		<span title='" + name + "'>"	 + name + "</span>"
			+	"	</a>"
			+	"</li>";
	}
	
	var dataSourceTreeItem = $(".vector-db-tree .row[dname='" +  dataSourceName + "']");
	dataSourceTreeItem.after(html);

	$(".nav[dname='" + dataSourceName + "'] li").click(function(){
		var name =$(this).attr("sname");
		if(name == null){
			return;
		}
		if(dataSourceCur == null){
			return;
		}
		getDataSet(dataSourceCur,name);
	});

}

// 展示列表
function showDataSetsList(dataSets){
	if(!$.isArray(dataSets)){
		return;
	}

	var dataSet = null;
	var name = null;
	var geomType = null;
	var srid = null;		
	var html = "";
	for(var i = 0; i < dataSets.length;++i){
		dataSet = dataSets[i];
		name = dataSet.name;
		geomType = dataSet.geometryType;
		if(geomType == null){
			geomType = "";
		}
		srid = dataSet.srid;
		if(srid == null){
			srid = "";
		}
		html += "<div class='row' sname='" + name +"'>"
			+	'	<div class="col-md-1">' + (i+1) + "</div>"
			+	'	<div class="col-md-4">' + name + "</div>"
			+	'	<div class="col-md-3">' + geomType + "</div>"
			+	'	<div class="col-md-2">' + srid + "</div>"
			+	'	<div class="col-md-2">'
			+	'		<a href="javascript:void(0)" class="oper enter-dataset">进入</a>'
			+	'		<a href="javascript:void(0)" class="oper remove-dataset">删除</a>'
			+	'	</div>'
			+	'</div>';
	}
	$(".datasets-list").html(html);

	// 进入图层
	$(".datasets-list .enter-dataset").click(function(){
		var name = $(this).parents(".row").attr("sname");
		if(name == null){
			return;
		}
		if(dataSourceCur == null){
			return;
		}
		getDataSet(dataSourceCur,name);
	});

	// 删除图层
	$(".datasets-list .remove-dataset").click(function(){
		var name = $(this).parents(".row").attr("sname");
		if(name == null){
			return;
		}
		if(dataSourceCur == null){
			return;
		}
		if(!confirm("确定要删除[" + name + "]?")){
			return;
		}
		MapCloud.notify.loading();
		dataSourceCur.removeDataSet(name,removeDataSet_callback);

	});
}

function removeDataSet_callback(result){
	MapCloud.notify.showInfo(result,"删除图层");
	getDataSets(dataSourceCur);
}

// 展示数据库图层缩略图
function showDataSetsThumb(dataSets){
	if(!$.isArray(dataSets)){
		return;
	}

	var html = "";
	var dataSet = null;
	var geomType = null;
	var thumbnail = null;
	for(var i = 0; i < dataSets.length; ++i){
		dataSet = dataSets[i];
		name = dataSet.name;
		geomType = dataSet.geometryType;
		if(geomType == null){
			continue;
		}
		thumbnail = dataSet.thumbnail;
		if(thumbnail != null){
			
			html += "<li class='dataset-thumb' dname='" + name + "'>"
			+ "<a href='#' class='dataset-thumb-a' dindex='" + i 
			+ "' style='background-image:url(" + thumbnail + ")'></a>";
		}
		html += "<div class='caption text-center'>"
			+	"	<h6 title='" + name + " class='text-ellipsis'>" + name + "</h6>"
			+	"</div>"
			+	"</li>";
	}
	$("#datasets_thumb_tab").html(html);

	// 双击
	$("#datasets_thumb_tab .dataset-thumb-a").dblclick(function(){
		var name = $(this).parent().attr("dname");
		if(name == null){
			return;
		}
		if(dataSourceCur == null){
			return;
		}
		getDataSet(dataSourceCur,name);
	});
}

function getDataSetGeomTypeHtml(geomType){
	var html = "";
	switch(geomType){
		case GeoBeans.Geometry.Type.POINT:
		case GeoBeans.Geometry.Type.MULTIPOINT:{
			html = '<i class="mc-icon mc-db-icon-dataset-point"></i>';
			break;
		}
		case GeoBeans.Geometry.Type.LINESTRING:
		case GeoBeans.Geometry.Type.MULTILINESTRING:{
			html = '<i class="mc-icon mc-db-icon-dataset-line"></i>';
			break;
		}
		case GeoBeans.Geometry.Type.POLYGON:
		case GeoBeans.Geometry.Type.MULTIPOLYGON:{
			html = '<i class="mc-icon mc-db-icon-dataset-polygon"></i>';
			break;
		}
		default :{
			html = '<i class="mc-icon mc-db-icon-dataset"></i>';
			break;
		}
	};
	return html;
}

// 进入图层
function getDataSet(dataSource,name){
	$(".vector-db-tree li").removeClass("selected");
	$(".vector-db-tree li[sname='" + name + "']").addClass("selected");

	if(dataSource == null || name == null){
		return;
	}
	$(".right-panel-tab").css("display","none");
	$("#dataset_tab").css("display","block");
	$(".return-datasource").html(dataSource.name);
	$(".current-dataset").html(name);
	$(".dataset-infos").empty();
	$(".dataset-fields").empty();
	$("#dataset_features_list table thead tr").html("");
	$("#dataset_features_list table tbody").html("");
	$(".dataset_preview_tab").empty();

	dataSource.getDataSet(name,getDataSet_callback);
}


function getDataSet_callback(dataSet){
	if(dataSet == null){
		return;
	}
	dataSetCur = dataSet;
	// 先展示上次展示的
	var btnId = $("#dataset_tab .btn-group .btn[disabled='disabled']").attr("id");
	if(dataSet.geometryType == null){
		$("#show_dataset_preview").attr("disabled",true);
		if(btnId == "show_dataset_preview"){
			$("#dataset_tab .btn-group #show_dataset_infos").attr("disabled",true);
			btnId = "show_dataset_infos";
		}
	}else{
		if(btnId != "show_dataset_preview"){
			$("#show_dataset_preview").attr("disabled",false);
		}
	}
	switch(btnId){
		case "show_dataset_infos":{
			showDataSetInfos(dataSet);
			break;
		}
		case "show_dataset_fields":{
			showDataSetFields(dataSet);
			break;
		}
		case "show_dataset_features":{
			showDataSetFeatures(dataSet);
			break;
		}
		case "show_dataset_preview":{
			showDataSetPreview(dataSet);
			break;
		}
		default:
		break;
	}		
}
// 元数据
function showDataSetInfos(dataSet){
	$("#dataset_tab .right-panel-content-tab").css("display","none");
	$("#dataset_infos_tab").css("display","block");
	if(dataSet == null){
		return;
	}
	var html = "";
	html += "<div class='row'>"
		+ 	"	<div class='col-md-3'>名称</div>" 
		+	"	<div class='col-md-6'>" + dataSet.name + "</div>"
		+	"</div>";
	if(dataSet.type != null){
		html+=  "<div class='row'>"
			+	"	<div class='col-md-3'>类型</div>"
			+	"	<div class='col-md-6'>" + dataSet.type + "</div>"
			+	"</div>";
	}
	if(dataSet.geometryType != null){
		html+=	"<div class='row'>"
			+	"	<div class='col-md-3'>几何类型</div>"			
			+	"	<div class='col-md-6'>" + dataSet.geometryType + "</div>"
			+	"</div>";
	}
	if(dataSet.count != null){
		html+=	"<div class='row'>"
			+	"	<div class='col-md-3'>个数</div>"			
			+	"	<div class='col-md-6'>" + dataSet.count + "</div>"
			+	"</div>";
	}
	if(dataSet.srid != null){
		html+=	"<div class='row'>"
			+	"	<div class='col-md-3'>空间参考</div>"			
			+	"	<div class='col-md-6'>" + dataSet.srid + "</div>"
			+	"</div>";
	}
	var extent = dataSet.extent;
	if(extent != null){
		html+=	"<div class='row'>"
			+	"	<div class='col-md-3'>范围</div>"			
			+	"	<div class='col-md-6'>东 :" + extent.xmax + + "</div>"
			+	"</div>"
			+	"<div class='row'>"
			+	"	<div class='col-md-3'></div>"
			+	"	<div class='col-md-6'>西 :" + extent.xmin + + "</div>"
			+	"</div>"
			+	"<div class='row'>"
			+	"	<div class='col-md-3'></div>"
			+	"	<div class='col-md-6'>南 :" + extent.ymin + + "</div>"
			+	"</div>"
			+	"<div class='row'>"
			+	"	<div class='col-md-3'></div>"
			+	"	<div class='col-md-6'>北 :" + extent.ymax + + "</div>"
			+	"</div>";		
	}

	$(".dataset-infos").html(html);

}

// 字段
function showDataSetFields(dataSet){
	$("#dataset_tab .right-panel-content-tab").css("display","none");
	$("#dataset_fields_tab").css("display","block");
	if(dataSet == null){
		return;
	}
	var fields = dataSet.getFields();
	if(fields == null){
		return;
	}
	var html = "";
	var field = null;
	var name = null;
	var type = null;
	var length = null;
	for(var i = 0; i < fields.length; ++i){
		field = fields[i];
		name = field.name;
		type = field.type;
		length = field.length;
		html += "<div class='row'>"
			+ 	"	<div class='col-md-4'>"
			+ 			name 
			+ 	"	</div>"
			+ 	"	<div class='col-md-3'>"
			+ 			type
			+ 	"	</div>"
			+ 	"	<div class='col-md-3'>"
			+ 			((length == null)?"":length)
			+ 	"	</div>"				
			+	"</div>";
	}		
	$(".dataset-fields").html(html);
}

// 列表
function showDataSetFeatures(dataSet){
	$("#dataset_tab .right-panel-content-tab").css("display","none");
	$("#dataset_features_tab").css("display","block");
	if(dataSet == null){
		return;
	}
	var fields = dataSet.getFields();
	if(fields == null){
		return;
	}
	showDataSetFeautresFields(fields);

	var count = dataSet.count;
	var pageCount = Math.ceil(count/maxFeatures);
	$(".pages-form-pages").html(pageCount);
	$(".query_count span").html(count);
	// 获得第一页数据
	if(pageCount >= 1){
		setDataSetFeaturePage(1);
	}else{
		$(".pages-form-page").val(0);
	}
}
//设置页码
function setDataSetFeaturePage(page){
	var pageCount = parseInt($(".pages-form-pages").html());
	$(".pages-form-page").val(page);
	if(page　== 1 ){
		$(".glyphicon-step-backward").addClass("disabled");
	}else{
		$(".glyphicon-step-backward").removeClass("disabled");
	}
	if(page == pageCount){
		$(".glyphicon-step-forward").addClass("disabled");
	}else{
		$(".glyphicon-step-forward").removeClass("disabled");
	}

	if(page - 1 <= 0){
		$(".glyphicon-chevron-left").addClass("disabled");
	}else{
		$(".glyphicon-chevron-left").removeClass("disabled");
	}

	if(page + 1 > pageCount){
		$(".glyphicon-chevron-right").addClass("disabled");
	}else{
		$(".glyphicon-chevron-right").removeClass("disabled");
	}

	var offset = ( page -1 ) * maxFeatures;
	
	MapCloud.notify.loading();
	var fields = dataSetCur.getFieldsWithoutGeom();
	dataSetCur.getFeatures(maxFeatures, offset,fields,getFeatures_callback); 
}
// 列表中的字段名称
function showDataSetFeautresFields(fields){
	if(fields == null){
		return;
	}
	var field = null;
	var name = null;
	var html = "";
	var widthAll = 0;
	for(var i = 0; i < fields.length; ++i){
		field = fields[i];
		if(field.type != "geometry"){
			name = field.name;
			html += "<th width='80'><nobr>"
			+ 		name 
			+ 	"</nobr></th>";
			widthAll += 1;
		}
	}
	$("#dataset_features_list table thead tr").html(html);
}


function getFeatures_callback(features){
	MapCloud.notify.hideLoading();
	showFeatures(features);
}

function showFeatures(features){
	if(features == null){
		return;
	}
	var html = "";
	var feature = null;
	var values = null;
	var value = null;
	for(var i = 0; i < features.length;++i){
		feature = features[i];
		if(feature == null){
			continue;
		}
		values = feature.values;
		if(values == null){
			continue;
		}
		html += "<tr>";
		for(var j = 0; j < values.length; ++j){
			value = values[j];
			if(value == null){
				continue;
			}
			if(value instanceof GeoBeans.Geometry){
				continue;
			}
			html += "<td>" +  value + "</td>";
		}
		html += "</tr>";
	}

	$("#dataset_features_list table tbody").html(html);
}
// 预览
function showDataSetPreview(dataSet){
	$("#dataset_tab .right-panel-content-tab").css("display","none");
	$("#dataset_preview_tab").css("display","block");
	if(dataSet == null){
		return;
	}
	if(dataSet == null || dataSet.geometryType == null){
		return;
	}
	var width = $("#dataset_preview_tab").width();
	var height = $("#dataset_preview_tab").height();
	var scale_m = 512/384;
	var scale_s = width/height;
	var marginTop = null;
	var marginWidth = null;
	if(scale_m > scale_s){
		marginTop = (height - width /scale_m)/2;
		height = width /scale_m;
	}else{
		marginWidth = (width - height*scale_m)/2 ;
		width = height*scale_m;
	}
	var thumbnail = dataSet.thumbnail;
	var html = "<img src='" + thumbnail + "' width='" 
		+ width + "'  height='" + height +"'>";
	$("#dataset_preview_tab").html(html);
	if(marginTop != null){
		$("#dataset_preview_tab img").css("margin-top",marginTop);
	}
	if(marginWidth != null){
		$("#dataset_preview_tab img").css("margin-left",marginWidth);
	}
}

function reigsterPanelEvent(){
// 返回数据库列表
	$(".return-datasources-list").click(function(){
		getDataSources();
	});

	// 返回数据库
	$(".return-datasource").click(function(){
		var name = $(this).html();
		getDataSource(name);
	});

	// 新增数据库
	$(".add-db").click(function(){
		MapCloud.pgis_connection_dialog.showDialog("feature","user-feature");
	});

	// 数据库面板
	// 展示图层列表
	$("#show_datasets_list").click(function(){
		$("#show_datasets_thumb").attr("disabled",false);
		$(this).attr("disabled",true);
		$("#datasource_tab .right-panel-content-tab").css("display","none");
		$("#datasets_list_tab").css("display","block");
	});
	// 展示图层缩略图
	$("#show_datasets_thumb").click(function(){
		$("#show_datasets_list").attr("disabled",false);
		$(this).attr("disabled",true);
		$("#datasource_tab .right-panel-content-tab").css("display","none");
		$("#datasets_thumb_tab").css("display","block");		
	});

	//dataset 面板
	$("#show_dataset_infos").click(function(){
		 $("#dataset_tab .btn-group .btn").attr("disabled",false);
		 $(this).attr("disabled",true);
		 if(dataSetCur != null){
		 	showDataSetInfos(dataSetCur);
		 }
	});

	$("#show_dataset_fields").click(function(){
		 $("#dataset_tab .btn-group .btn").attr("disabled",false);
		 $(this).attr("disabled",true);
		 if(dataSetCur != null){
		 	showDataSetFields(dataSetCur);
		 }
	});

	$("#show_dataset_features").click(function(){
		 $("#dataset_tab .btn-group .btn").attr("disabled",false);
		 $(this).attr("disabled",true);
		 if(dataSetCur != null){
		 	showDataSetFeatures(dataSetCur);
		 }
	});

	$("#show_dataset_preview").click(function(){
		 $("#dataset_tab .btn-group .btn").attr("disabled",false);
		 $(this).attr("disabled",true);
		 if(dataSetCur != null){
		 	showDataSetPreview(dataSetCur);
		 }
	});

	//页面设置
	// 首页
	$(".glyphicon-step-backward").each(function(){
		$(this).click(function(){
			var pageCount = parseInt($(".pages-form-pages").html());
			if(pageCount >= 1){
				setDataSetFeaturePage(1);
			}
		});
	});

	//末页
	$(".glyphicon-step-forward").each(function(){
		$(this).click(function(){
			var count = parseInt($(".pages-form-pages").html());
			if(count >= 1){
				setDataSetFeaturePage(count);
			}
		});
	});

	//上一页
	$(".glyphicon-chevron-left").each(function(){
		$(this).click(function(){
			var page = parseInt($(".pages-form-page").val());
			setDataSetFeaturePage(page - 1);
		});	
	});

	//下一页
	$(".glyphicon-chevron-right").each(function(){
		$(this).click(function(){
			var page = parseInt($(".pages-form-page").val());
			setDataSetFeaturePage(page + 1);
		});
	});
}

function getDataSources(){
	$(".right-panel-tab").css("display","none");
	$("#datasources_tab").css("display","block");
	MapCloud.notify.loading();
	dbsManager.getDataSources(getDataSources_callback,"Feature");
}