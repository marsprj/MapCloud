//打开地图
MapCloud.GetMapsDialog = MapCloud.Class(MapCloud.Dialog,{
	
	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		// 确定
		this.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				var a = dialog.panel
				.find(".maps-thumb .thumbnail.selected");
				if(a.length == 0){
					alert("请选择一个地图！");
					return;
				}
				// 获得地图名称
				var name = a.parents(".maps-thumb").attr("name");
				if(name == null){
					return;
				}
				dialog.closeDialog();
				dialog.openMap(name);
			});
		});
		
	},
	cleanup : function(){
		this.panel.find("#maps_list").html("");
	},

	showDialog : function(){
		this.cleanup();
		this.panel.modal();
		MapCloud.alert_info.loading();
		// 获得地图列表
		mapManager.getMaps(this.getMaps_callback);
	},

	// 返回地图列表
	getMaps_callback : function(maps){
		MapCloud.alert_info.hideLoading();
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
		//注册点击和双击事件
		panel.find(".thumbnail").each(function(){
			$(this).click(function(){
				panel.find(".thumbnail").each(function(){
					$(this).removeClass("selected");
				});
				$(this).addClass("selected");
			}).dblclick(function(){
				var name = $(this).parent().attr("name");
				dialog.openMap(name);
			});
		});
	},

	///打开地图
	openMap : function(name){
		this.closeDialog();
		MapCloud.alert_info.loading();
		var info = "打开地图 [ " + name + " ]";
		mapObj = mapManager.getMap("mapCanvas_wrapper",name);
		if(mapObj == null){
			MapCloud.alert_info.showInfo("failed",info);
		}else{
			mapObj.setViewer(new GeoBeans.Envelope(-180,-90,180,90));
			mapObj.draw();
			MapCloud.refresh_panel.refreshPanel();
			MapCloud.dataGrid.cleanup();
			//显示信息
			MapCloud.alert_info.showInfo("success",info);
		}
	}

});