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

		var mapManager = user.getMapManager();

		mapManager.getMaps(getMaps_callback);
		
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
    mapObj = null;
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
				+	'	<div class="col-md-1 col-xs-1">'
				+	'		<i class="map-icon list-icon"></i>'
				+	'	</div>'
				+	'	<div class="col-md-9 col-xs-9 map-tree-name">'
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
		var thumb = null;
		for(var i = 0; i < maps.length; ++i){
			map = maps[i];
			if(map == null){
				continue;
			}
			mapName = map.name;
			mapExtent = map.extent;
			mapSrid = map.srid;
			thumb = map.thumbnail;
			if(mapExtent != null){
				mapExtentHtml = mapExtent.xmin.toFixed(2) + " , " + mapExtent.ymin.toFixed(2)
					+ " , " + mapExtent.xmax.toFixed(2) + " , " + mapExtent.ymax.toFixed(2);
			}

			html += '<div class="row map-row" mname="' + mapName + '">'
				+	'	<div class="col-md-1  col-xs-1 col-order">'
				+	(i+1)		
				+	'	</div>'
				+	'	<div class="col-md-3 col-xs-3">'
				+			mapName
				+	'	</div>'
				+	'	<div class="col-md-2 col-xs-2">'
				+			mapSrid
				+	'	</div>'
				+	'	<div class="col-md-4 col-xs-4">'
				+			mapExtentHtml
				+	'	</div>'
				+	'	<div class="col-md-2 col-xs-2">'
				+	'		<a href="javascript:void(0)" class="oper enter-map">进入</a>'
				+	'		<a href="javascript:void(0)" class="oper remove-map">删除</a>'
				+	'	</div>'
				+	'</div>'
				+ 	'<div class="row info-row" mname="' + mapName + '">'
				+	'	<div class="col-md-1 col-xs-1 col-order">'
				+	'	</div>'
				+	'	<div class="col-md-3 col-xs-3 thumb-div" style="background-image:url(' + thumb + ')">'
				+	'	</div>'
				+	'	<div class="col-md-4 col-xs-4">'
				+	'		<div class="row info-row-item">'
				+	'			<div class="col-md-3 col-xs-3">名称:</div>'
				+	'			<div class="col-md-5 col-xs-5">' + mapName + '</div>'
				+	'		</div>'
				+	'		<div class="row info-row-item">'
				+	'			<div class="col-md-3 col-xs-3">空间参考:</div>'
				+	'			<div class="col-md-5 col-xs-5">' + mapSrid + '</div>'
				+	'		</div>'
				+	'	</div>'
				+ 	'</div>';

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

		$(".map-list .map-row").click(function(){
			var nextRow = $(this).next();
			if(nextRow.css("display") == "block"){
				nextRow.slideUp();
				$(this).removeClass("selected");
				nextRow.removeClass("selected");
			}else{
				var name = $(this).attr("mname");
				mapManager.getMapObj(name,showMoreListInfo_callback);
			}
		});
	}
	function showMoreListInfo_callback(map){
		if(map == null){
			return;
		}
		var mapName = map.name;
		var thumb = map.thumbnail;
		var mapSrid = map.srid;
		var layers = map.layers;

		// var layersHtml = '<div class="row info-row-item">'
		// 	+	'		<div class="col-md-3">图层:</div>'
		// 	+	'		<div class="col-md-5">' + (layers[0] == null?"":layers[0].name)  + '</div>'
		// 	+	'	</div>';
		// for(var j = 1; j < layers.length;++j){
		// 	layer = layers[j];
		// 	if(layer != null){
		// 		layersHtml += '<div class="row info-row-item">'
		// 			+	'		<div class="col-md-3"></div>'
		// 			+	'		<div class="col-md-5">' + (layers[j] == null?"":layers[j].name)  + '</div>'
		// 			+	'	</div>';
		// 	}
		// }

		var extent = map.extent;
		var extentHtml = "";
		if(extent != null){
			extentHtml += 	'<div class="row info-row-item">'
					+	'	<span class="col-md-3 col-xs-3">空间范围 :</span>'
					+	'	<span class="col-md-5 col-xs-5">东 : ' + extent.xmax + '</span>'
					+	'</div>'
					+	'<div class="row info-row-item">'
					+	'	<span class="col-md-3 col-xs-3"></span>'
					+	'	<span class="col-md-5 col-xs-5">南 : ' + extent.ymin + '</span>'
					+	'</div>'
					+	'<div class="row info-row-item">'
					+	'	<span class="col-md-3 col-xs-3"></span>'
					+	'	<span class="col-md-5 col-xs-5">西 : ' + extent.xmin + '</span>'
					+	'</div>'
					+	'<div class="row info-row-item">'
					+	'	<span class="col-md-3 col-xs-3"></span>'
					+	'	<span class="col-md-5 col-xs-5">北 : ' + extent.ymax + '</span>'
					+	'</div>';
		}

		var html = 	'	<div class="col-md-1 col-xs-1 col-order">'
				+	'	</div>'
				+	'	<div class="col-md-3 col-xs-3 thumb-div" style="background-image:url(' + thumb + ')">'
				+	'	</div>'
				+	'	<div class="col-md-4 col-xs-4">'
				+	'		<div class="row info-row-item">'
				+	'			<div class="col-md-3 col-xs-3">名称:</div>'
				+	'			<div class="col-md-5 col-xs-5">' + mapName + '</div>'
				+	'		</div>'
				+	'		<div class="row info-row-item">'
				+	'			<div class="col-md-3 col-xs-3">空间参考:</div>'
				+	'			<div class="col-md-5 col-xs-5">' + mapSrid + '</div>'
				+	'		</div>'
				+	'		<div class="row info-row-item">'
				+	'			<div class="col-md-3 col-xs-3">图层个数:</div>'
				+	'			<div class="col-md-5 col-xs-5">' + layers.length + '</div>'
				+	'		</div>'
				+			extentHtml
				+	'	</div>';


		$(".info-row[mname='" +mapName +  "']").html(html);
		$(".info-row[mname='" +mapName +  "']").slideDown();
		$(".map-row[mname='" +mapName +  "']").addClass("selected");
		$(".map-row[mname='" +mapName +  "']").next().addClass("selected");
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
		$(".service-extent").remove();
		$(".map-tree .row").removeClass("selected");
		$(".map-tree .row[mname='" + name + "']").addClass("selected");
		$(".current-map").html(name);
		$(".map-info-name").empty();
		$(".map-info-srid").empty();
		$(".map-info-layers").empty();
		$(".thumb-big-div").css("background-image","");
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
			var extentHtml = "";
			extentHtml += 	'<div class="map-info-row service-extent">'
					+	'	<span class="map-info-item">空间范围 :</span>'
					+	'	<span class="map-info-extent">东 : ' + extent.xmax + '</span>'
					+	'</div>'
					+	'<div class="map-info-row service-extent">'
					+	'	<span class="map-info-item"></span>'
					+	'	<span class="map-info-extent">南 : ' + extent.ymin + '</span>'
					+	'</div>'
					+	'<div class="map-info-row service-extent">'
					+	'	<span class="map-info-item"></span>'
					+	'	<span class="map-info-extent">西 : ' + extent.xmin + '</span>'
					+	'</div>'
					+	'<div class="map-info-row service-extent">'
					+	'	<span class="map-info-item"></span>'
					+	'	<span class="map-info-extent">北 : ' + extent.ymax + '</span>'
					+	'</div>';
			$(".map-info-srid").parent().after(extentHtml);
		}
		// 通过名称查找
		// var url = $(".info-row[mname='" +  name + "']").find(".thumb-div").css("background-image");
		$(".thumb-big-div").css("background-image","url(" + map.thumbnail + ")");

		// layer
		$("#map_info_tab .map-info-layers").empty();
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
				+	'	<span class="map-info-layer-name">' + name +  '</span>';
			var type = "";
			if(geomType != null){
				type =  geomType;
			}else{
				if(layer.type == "raster"){
					type = "Raster";
				}
			}
			html +=	'	<span class="map-info-name">' + type + '</span>';
			extent = layer.extent;
			if(extent != null){
				var extentStr = extent.xmin.toFixed(2) + " , " + extent.ymin.toFixed(2)
					+ " , " + extent.xmax.toFixed(2) + " , " + extent.ymax.toFixed(2);
				// html +=	'<div class="map-info-row">'
				html +=	'	<span class="map-info-extent">' + extentStr + '</span>'
					+ 	'<span class="map-info-layer-name pull-right">'
					+	'	<input type="checkbox" name="my-checkbox" data-size="mini" data-on-color="info" disabled>'
					+	'</span>'
					+ 	'<span class="map-info-layer-name pull-right">'
					+	'	<input type="checkbox" name="my-checkbox" checked data-size="mini" data-on-color="info">'
					+	'</span>';
			}
			html += "</div>";	
		}
		$("#map_info_tab .map-info-layers").append(html);		
		$("[name='my-checkbox']").bootstrapSwitch();
	}

	// 绘制地图
	function showMapView(name){
		if(name == null){
			return;
		}
		if(mapObj != null){
			mapObj.close();
			mapObj = null;
		}
		mapObj = mapManager.getMap("map_view_tab",name);
		if(mapObj == null){

		}else{
			mapObj.draw();
		}
	}


})