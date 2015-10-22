$().ready(function(){
	MapCloud.notify	= new MapCloud.Notify("container","alert_loading");
	$(".map-tree").empty();
	$(".map-list").empty();

	// showMapList
	$("#show-map-list").click(function(){
		$("#show-map-thumb").attr("disabled",false);
		$(this).attr("disabled",true);
		$(".right-panel-content-tab").css("display","none");
		$("#map_list_tab").css("display","block");
	});

	// show map thumb
	$("#show-map-thumb").click(function(){
		$("#show-map-list").attr("disabled",false);
		$(this).attr("disabled",true);
		$(".right-panel-content-tab").css("display","none");
		$("#map_thumb_list").css("display","block");
	});


	// 地图页面切换
	$("#show_map_info").click(function(){
		$("#show_map_view").attr("disabled",false);
		$(this).attr("disabled",true);
		$("#map_tab .right-panel-content-tab").css("display","none");
		$("#map_tab #map_info_tab").css("display","block");
	});

	$("#show_map_view").click(function(){
		$("#show_map_info").attr("disabled",false);
		$(this).attr("disabled",true);
		$("#map_tab .right-panel-content-tab").css("display","none");
		$("#map_tab #map_view_tab").css("display","block");
		var name = $(".map-tree .row.selected").attr("mname");
		showMapView(name);
	});

	// 返回地图列表
	$(".return-map-list").click(function(){
		$(".right-panel-tab").css("display","none");
		$("#maps_tab").css("display","block");
		if($("#show-map-thumb").attr("disabled") == "disabled"){
			$("#map_thumb_list").css("display","block");
			$("#map_list_tab").css("display","none");
		}else if($("#show-map-list").attr("disabled") == "disabled"){
			$("#map_list_tab").css("display","block");
			$("#map_thumb_list").css("display","none");
		}
		
	});

 	cookieObj = new MapCloud.Cookie();
 	var cookiedUserName = cookieObj.getCookie("username");
 	user = null;
    if(cookiedUserName != null){
    	user = new GeoBeans.User(cookiedUserName);
    }
    if(user == null){
    	return;
    }

	var mapManager = user.getMapManager();

	mapManager.getMaps(getMaps_callback);


	function getMaps_callback(maps){
		showMapsTree(maps);
		showMapsList(maps);
		showMapsThumb(maps);
	}

	// 左侧树
	function showMapsTree(maps){
		if(!$.isArray(maps)){
			return;
		}
		var html = "";
		var map = null;
		var mapName = null;
		for(var i = 0; i < maps.length; ++i){
			map = maps[i];
			if(map == null){
				continue;
			}
			mapName = map.name;
			html += '<div class="row" mname="' + mapName + '">'
				+	'	<div class="col-md-1">'
				+	'		<i class="map-icon list-icon"></i>'
				+	'	</div>'
				+	'	<div class="col-md-9 map-tree-name">'
				+		mapName
				+	'	</div>'
				+	'</div>';
		}
		$(".map-tree").html(html);

		$(".map-tree .row").click(function(){
			var name = $(this).attr("mname");
			showMap(name);
		});
	}

	// 右侧列表
	function showMapsList(maps){
		if(!$.isArray(maps)){
			return;
		}
		var html = "";
		var map = null;
		var mapName = null;
		var mapExtent = null;
		var mapSrid = null;
		var mapExtentHtml = "";
		for(var i = 0; i < maps.length; ++i){
			map = maps[i];
			if(map == null){
				continue;
			}
			mapName = map.name;
			mapExtent = map.extent;
			mapSrid = map.srid;
			if(mapExtent != null){
				mapExtentHtml = mapExtent.xmin.toFixed(2) + " , " + mapExtent.ymin.toFixed(2)
					+ " , " + mapExtent.xmax.toFixed(2) + " , " + mapExtent.ymax.toFixed(2);
			}
			html += '<div class="row" mname="' + mapName + '">'
				+	'	<div class="col-md-1">'
				+	(i+1)		
				+	'	</div>'
				+	'	<div class="col-md-3">'
				+			mapName
				+	'	</div>'
				+	'	<div class="col-md-2">'
				+			mapSrid
				+	'	</div>'
				+	'	<div class="col-md-4">'
				+			mapExtentHtml
				+	'	</div>'
				+	'	<div class="col-md-2">'
				// +	'		<span class="oper enter-map">进入</span>'
				// +	'		<span class="oper remove-map">删除</span>'
				+	'		<a href="javascript:void(0)" class="oper enter-map">进入</a>'
				+	'		<a href="javascript:void(0)" class="oper remove-map">删除</a>'
				+	'	</div>'
				+	'</div>';
		}
		$(".map-list").html(html);	

		// 进入地图
		$(".enter-map").click(function(){
			var name = $(this).parents(".row").first().attr("mname");
			if(name != null){
				showMap(name);
			}
		});

		// 删除地图
		$(".remove-map").click(function(){
			var name = $(this).parents(".row").first().attr("mname");
			if(name == null){
				return;
			}
			if(!confirm("确定删除地图[" + name+ "]?")){
				return;
			}
			MapCloud.notify.loading();
			var result = mapManager.removeMap(name);
			var info = "删除地图 [ " + name + " ]";
			MapCloud.notify.showInfo(result,info);
			if(result == "success"){
				mapManager.getMaps(getMaps_callback);
			}
		});
	}


	// 缩略图
	function showMapsThumb(maps){
		if(!$.isArray(maps)){
			return;
		}	

		var html = "<ul id='maps_thumb_ul'>";	
		var map = null;
		var mapName = null;
		var mapThumb = null;
		for(var i = 0; i < maps.length; ++i){
			map = maps[i];
			if(map == null){
				continue;
			}
			mapName = map.name;
			mapThumb = map.thumbnail;
			html += '<li class="map-thumb" mname="' + mapName + '">'
				+	'	<a href="javascript:void(0)" class="map-thumb-a" style="background-image:url(' 
				+  mapThumb+ ')"></a>'
				+ 	'<div class="caption text-center">'
				+	'	<h6>' + mapName + '</h6>'
				+	'</div>'
				+	'</li>';
		}

		$("#map_thumb_list").html(html);

		$("#map_thumb_list a").dblclick(function(){
			var name = $(this).parent().attr("mname");
			if(name != null){
				showMap(name);
			}
		});
	}

	// 展示某一个地图
	function showMap(name){
		if(name == null){
			return;
		}
		$(".right-panel-tab").css("display","none");
		$("#map_tab").css("display","block");
		$("#map_info_tab").css("display","block");
		$("#show_map_view").attr("disabled",false);
		$("#show_map_info").attr("disabled",true);

		$(".map-tree .row").removeClass("selected");
		$(".map-tree .row[mname='" + name + "']").addClass("selected");
		$(".current-map").html(name);
		showMapInfo(name);
		// showMapView(name);
	}
	// 展示地图信息
	function showMapInfo(name){
		mapManager.getMapObj(name,showMapInfo_callback);
	}

	function showMapInfo_callback(map){
		if(map == null){
			return;
		}
		var name = map.name;
		var srid = map.srid;
		$("#map_info_tab .map-info-name").html(name);
		$("#map_info_tab .map-info-srid").html(srid);

		var extent = map.extent;
		if(extent != null){
			var extentStr = extent.xmin.toFixed(2) + " , " + extent.ymin.toFixed(2)
					+ " , " + extent.xmax.toFixed(2) + " , " + extent.ymax.toFixed(2);
			$("#map_info_tab .map-info-extent").html(extentStr);
		}
		// layer
		$("#map_info_tab .map-info-layers").empty();
		// var layers = map.getLayers();
		var layers = map.layers;
		var layer = null;
		var name = null;
		var extent = null;
		var geomType = null;
		var html = "";
		for(var i = 0; i < layers.length; ++i){
			layer = layers[i];
			if(layer == null){
				continue;
			}
			name = layer.name;
			geomType = layer.geomType;
			

			html += '<div class="map-info-row">'
				+	'	<span class="map-info-layer-name">' + name +  '</span>'
				+ 	'	<span class="map-info-item">类型：</span>';
			if(geomType != null){
					html +=	'	<span class="map-info-name">' + geomType + '</span>';
			}else{
				if(layer.type == "raster"){
					
					html +=	'	<span class="map-info-name">' + "Raster" + '</span>';
				}
			}
			extent = layer.extent;
			if(extent != null){
				var extentStr = extent.xmin.toFixed(2) + " , " + extent.ymin.toFixed(2)
					+ " , " + extent.xmax.toFixed(2) + " , " + extent.ymax.toFixed(2);
				// html +=	'<div class="map-info-row">'
				html += 	'	<span class="map-info-item">范围：</span>'
					+	'	<span class="map-info-extent">' + extentStr + '</span>';
			}
			html += "</div>";	
		}
		$("#map_info_tab .map-info-layers").append(html);		
	}

	// 绘制地图
	function showMapView(name){
		if(name == null){
			return;
		}
		var map = mapManager.getMap("map_view_tab",name);
		if(map == null){

		}else{
			map.draw();
		}
	}


})