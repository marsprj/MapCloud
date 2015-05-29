MapCloud.CreateMapDialog = MapCloud.Class(MapCloud.Dialog,{
	
	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

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

		this.panel.find("#create_map_infos").click(function(){
			if($(this).hasClass(".info-invis")){
				dialog.panel.find(".create-map-info-item").slideDown();	
				$(this).removeClass(".info-invis");
				$(this).addClass(".info-vis");
			}else{
				dialog.panel.find(".create-map-info-item").slideUp();	
				$(this).addClass(".info-invis");
				$(this).removeClass(".info-vis");
			}
			
		});

		this.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				var mapName = dialog.panel
					.find("#create_map_name").val();
				if(mapName == null || mapName == ""){
					alert("请输入地图名称！");
					return;
				}
				var srid = dialog.panel
					.find("#create_map_srid").val();
				if(srid == null || srid == ""){
					alert("请输入srid！");
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
					alert("请输入有效的范围！");
					return;
				}
				MapCloud.alert_info.loading();
				mapManager.createMap("mapCanvas_wrapper",
					mapName,extent,srid,dialog.createMap_callback);

			});
		});
	},

	createMap_callback : function(map,result){
		var dialog = MapCloud.create_map_dlg;
		var name = dialog.panel.find("#create_map_name").val();
		if(map != null){
			mapObj = map;
			// mapObj.setViewer(new GeoBeans.Envelope(-180,-90,180,90));
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
			if(url != null){
				var center = new GeoBeans.Geometry.Point(0,0);	
				var layer = new GeoBeans.Layer.QSLayer(name,url);
				mapObj.setBaseLayer(layer);
				mapObj.setCenter(center);
				mapObj.setLevel(2);	
			}else{
				mapObj.setViewer(mapObj.extent);
			}

			mapObj.draw();
			MapCloud.refresh_panel.refreshPanel();
			MapCloud.dataGrid.cleanup();
		}else{
			// alert("创建失败：" + result);
		}

		var info = "创建地图 [ " + name + " ]";
		MapCloud.alert_info.showInfo(result,info);
		
		dialog.closeDialog();
	},
	
	cleanup : function(){
		this.panel.find("#create_map_name").each(function(){
			$(this).val("");
		});
	}


});