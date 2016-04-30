// 新建地图
MapCloud.CreateMapDialog = MapCloud.Class(MapCloud.Dialog,{
	
	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		//注册底图的选中事件
		this.panel.find(".thumbnail").each(function(){
			$(this).click(function(){
				if($(this).hasClass("selected")){
					$(this).removeClass("selected");
				}else{
					$(this).parents("#base_map_list")
						.find(".thumbnail").removeClass("selected")
					$(this).addClass("selected");
				}
			});
		});

		//具体信息的展示
		this.panel.find("#create_map_infos").click(function(){
			if($(this).hasClass("info-invis")){
				dialog.panel.find(".create-map-info-item").slideDown();	
				$(this).removeClass("info-invis");
				$(this).addClass("info-vis");
			}else{
				dialog.panel.find(".create-map-info-item").slideUp();	
				$(this).addClass("info-invis");
				$(this).removeClass("info-vis");
			}
		});

		// enter create_map_name
		this.panel.find("#create_map_name").keypress(function(e){
			if(e.which == 13){
				dialog.onCreateMap();
			}
		});

		///确定
		this.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				dialog.onCreateMap();
			});
		});
	},

	onCreateMap : function(){
		var dialog = this;

		//获得各个输入参数
		var mapName = dialog.panel.find("#create_map_name").val();
		if(mapName == null || mapName == ""){
			MapCloud.notify.showInfo("请输入地图名称！","Warning");
			dialog.panel.find("#create_map_name").focus();
			return;
		}
		var nameReg = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9]|[_])*$/;
		if(!nameReg.test(mapName)){
			MapCloud.notify.showInfo("请输入有效的地图名称","Warning");
			dialog.panel.find("#create_map_name").focus();
			return;
		}

		var srid = dialog.panel.find("#create_map_srid").val();
		if(srid == null || srid == ""){
			MapCloud.notify.showInfo("请输入空间参考","Warning");
			dialog.panel.find("#create_map_srid").focus();
			return;
		}

		if(!$.isNumeric(srid)){
			MapCloud.notify.showInfo("请输入有效的空间参考","Warning");
			dialog.panel.find("#create_map_srid").focus();
			return;
		}

		var xmin = dialog.panel
			.find("#create_map_xmin").val();
		var ymin = dialog.panel
			.find("#create_map_ymin").val();
		var xmax = dialog.panel
			.find("#create_map_xmax").val();
		var ymax = dialog.panel
			.find("#create_map_ymax").val();
		var extent = new GeoBeans.Envelope(
					parseFloat(xmin),
					parseFloat(ymin),
					parseFloat(xmax),
					parseFloat(ymax));
		if(extent == null){
			MapCloud.notify.showInfo("请输入有效的范围！","Warning");
			return;
		}
		MapCloud.notify.loading();
		//新建地图
		mapManager.createMap("mapCanvas_wrapper",
			mapName,extent,srid,dialog.createMap_callback);
		ribbonObj.showMapTab();
	},

	//新建地图结果
	createMap_callback : function(map,result){
		var dialog = MapCloud.create_map_dlg;
		var name = dialog.panel.find("#create_map_name").val();
		var info = "创建地图 [ " + name + " ]";
		MapCloud.notify.showInfo(result,info);
		dialog.closeDialog();
		// ribbonObj.showMapTab();
		
		// 获取底图名称
		var url = null;
		var type = dialog.panel.find(".thumbnail.selected").attr("bname");
		switch(type){
			case "vector":{
				url = "/QuadServer/maprequest?services=world_vector";
				break;
			}
			case "image":{
				url = "/QuadServer/maprequest?services=world_image";
				break;
			}
			case "none":{
				url = null;
				break;
			}
			default:
				break;
		}
		// 绘制地图
		dialog.drawMap(map,url);
		dialog.cleanupPage();
	},

	showDialog : function(){
		this.cleanup();
		this.panel.modal();
		var dialog = this;
		this.panel.on('shown.bs.modal',function(){
			dialog.panel.find("#create_map_name").focus();
		});
	},
	
	cleanup : function(){
		this.panel.find("#create_map_name").each(function(){
			$(this).val("");
		});
	},

	//绘制地图
	drawMap : function(map,url){
		if(map != null){
			mapObj = map;
			// 绘制底图
			if(url != null){
				// var center = new GeoBeans.Geometry.Point(0,0);	
				var layer = new GeoBeans.Layer.QSLayer("base",url);
				// mapObj.setBaseLayer(layer);
				// mapObj.setCenter(center);
				// mapObj.setLevel(2);	
				mapObj.insertLayer(layer,null);
			}else{
				mapObj.setViewer(mapObj.extent);
			}
			mapObj.draw();
			mapObj.addEventListener(GeoBeans.Event.MOUSE_MOVE, MapCloud.tools.onMapMove);
			mapObj.setNavControl(false);
		}
		$(".mc-panel").css("display","none");
	},

	//整理整个页面
	cleanupPage : function(){
		MapCloud.refresh_panel.refreshPanel();
		MapCloud.dataGrid.cleanup();
		$(".mc-panel").css("display","none");
	}
});