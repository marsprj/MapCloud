MapCloud.NewMapDialog = MapCloud.Class(MapCloud.Dialog, {
	
	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		
		var dialog = this;
		this.panel.click(function(){
			//dialog.closeDialog();
		});
		
		this.panel.find(".mc-map-thumb").each(function(){
			$(this).mouseover(function(){
				$(this).addClass("mc-map-thumb-over");
			});
			$(this).mouseout(function(){
				$(this).removeClass("mc-map-thumb-over");
			});
		});

		this.panel.find(".thumbnail").each(function(){
			$(this).click(function(){
				dialog.panel.find(".thumbnail").each(function(){
					$(this).removeClass("selected");
				});
				$(this).addClass("selected");
			});
		});

		this.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				var map_name = null;
				dialog.panel.find("#new_map_dialog_name").each(function(){
					map_name = $(this).val();
				});
				if(map_name == null || map_name == ""){
					alert("请输入地图名称");
					return;
				}

				var map_type = null;
				dialog.panel.find(".thumbnail.selected").each(function(){
					map_type = $(this).attr("id"); 
				});

				var url = null;
				switch(map_type){
					case "map_vector":
						url = "/QuadServer/maprequest?services=world_vector";
						break;
					case "map_image":
						url = "/QuadServer/maprequest?services=world_image";
						break;
					case "map_none":
						url = null;
						break;
					default:
						url = null;
						break;
				}
				if(url != null){
					var center = new GeoBeans.Geometry.Point(0,0);	
					var layer = new GeoBeans.Layer.QSLayer(map_name,url);
					mapObj.setBaseLayer(layer);
					mapObj.setCenter(center);
					mapObj.setLevel(2);	
					mapObj.draw();					
				}
				dialog.closeDialog();
				var refresh = new MapCloud.refresh("left_panel");
				refresh.refreshPanel();
				$("#map_name").html(map_name);
			});
		});		
	},
	
	destory : function(){
		MapCloud.Dialog.prototype.destory.apply(this, arguments);
	},
	
	cleanup : function(){
		this.panel.find("#map_name").each(function(){
			$(this).val("");
		});
	}
	
});
	