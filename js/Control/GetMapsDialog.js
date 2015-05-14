MapCloud.GetMapsDialog = MapCloud.Class(MapCloud.Dialog,{
	// url 		: "/ows/user1/mgr",
	// mapManager 	: null,	

	
	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;
		// this.mapManager = new GeoBeans.MapManager(this.url);
		this.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				var a = dialog.panel
				.find(".maps-thumb .thumbnail.selected");
				if(a.length == 0){
					alert("请选择一个地图！");
					return;
				}
				var name = a.parents(".maps-thumb").attr("name");
				if(name == null){
					return;
				}
				dialog.closeDialog();
				MapCloud.alert_info.loading();
				mapObj = mapManager.getMap("mapCanvas_wrappper",name);
				if(mapObj == null){
					//
				}else{
					mapObj.setViewer(new GeoBeans.Envelope(-180,-90,180,90));
					mapObj.draw();
					MapCloud.refresh_panel.refreshPanel();
					var info = "打开地图 [ " + name + " ]";
					MapCloud.alert_info.showInfo("success",info);
				}
			});
		});
		
	},
	cleanup : function(){
		this.panel.find("#maps_list").html("");
	},

	showDialog : function(){
		this.cleanup();
		this.panel.modal();
		mapManager.getMaps(this.getMaps_callback);
	},

	getMaps_callback : function(maps){
		var dialog = MapCloud.get_maps_dlg;
		var panel = dialog.panel;
		var html = "";
		for(var i = 0; i < maps.length;++i){
			var map = maps[i];
			var name = map.name;
			html += "<li class='maps-thumb' name='" + name + "'>"
				 + 	"	<a href='#' class='thumbnail'>"
				 + 	"		<img src='images/map.png' alt='" + name + "'>"
				 +  "	</a>"
				 + 	"	<div class='caption text-center'>"
				 + 	"		<h6>" + name + "</h6>"
				 + 	"	</div>"
				 + 	"</li>";
		}
		panel.find("#maps_list").html(html);
		panel.find(".thumbnail").each(function(){
			$(this).click(function(){
				panel.find(".thumbnail").each(function(){
					$(this).removeClass("selected");
				});
				$(this).addClass("selected");

			}).dblclick(function(){
				var name = $(this).parent().attr("name");
				MapCloud.alert_info.loading();
				dialog.closeDialog();
				mapObj = mapManager.getMap("mapCanvas_wrappper",name);
				if(mapObj == null){
					var info = "打开地图 [ " + name + " ]";
					MapCloud.alert_info.showInfo("failed",info);
				}else{
					mapObj.setViewer(new GeoBeans.Envelope(-180,-90,180,90));
					mapObj.draw();
					MapCloud.refresh_panel.refreshPanel();
					var info = "打开地图 [ " + name + " ]";
					MapCloud.alert_info.showInfo("success",info);
				}
			});

		});
	},

});