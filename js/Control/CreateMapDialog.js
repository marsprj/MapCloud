MapCloud.CreateMapDialog = MapCloud.Class(MapCloud.Dialog,{
	
	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

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
				mapManager.createMap("mapCanvas_wrappper",
					mapName,extent,srid,dialog.createMap_callback);

			});
		});
	},

	createMap_callback : function(map,result){
		var dialog = MapCloud.create_map_dlg;
		var name = dialog.panel.find("#create_map_name").val();
		if(map != null){
			mapObj = map;
			mapObj.setViewer(new GeoBeans.Envelope(-180,-90,180,90));
			mapObj.draw();
			MapCloud.refresh_panel.refreshPanel();
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