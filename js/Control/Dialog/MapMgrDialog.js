// 管理地图
MapCloud.MapMgrDialog = MapCloud.Class(MapCloud.Dialog,{
	
	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		// 全不选
		dialog.panel.find("#remove_select_maps").each(function(){
			$(this).click(function(){
				dialog.panel.find(".selected").removeClass("selected");
			});
		});

		// 删除地图
		dialog.panel.find("#remove_maps").each(function(){
			$(this).click(function(){
				
				// 获取待删除的地图列表
				var maps = [];
				dialog.panel.find(".selected").each(function(){
					var name = $(this).parent().attr("name");
					maps.push(name);
				});

				var map = null;
				var result = null;
				for(var i = 0; i < maps.length;++i){
					map = maps[i];
					result = mapManager.removeMap(map);
					var info = "Remove Map [ " + map + " ]";
					MapCloud.alert_info.showInfo(result,info);
				}
				// 删除完重新获取列表
				mapManager.getMaps(dialog.getMaps_callback);
			});
		});

		// 确定
		dialog.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				dialog.closeDialog();
			});
		});
	},

	cleanup : function(){
		this.panel.find("#maps_list").html("");
	},

	showDialog : function(){
		this.cleanup();
		this.panel.modal();
		
		// 获得地图列表
		mapManager.getMaps(this.getMaps_callback);
	},

	//返回地图列表
	getMaps_callback : function(maps){
		var dialog = MapCloud.map_mgr_dialog;
		var panel = dialog.panel;
		var html = "";
		for(var i = 0; i < maps.length;++i){
			var map = maps[i];
			var name = map.name;
			html += "<li class='maps-thumb' name='" + name + "'>"
				 + 	"	<a href='#' class='thumbnail'>"
				 + 	"		<img src='images/map.png' alt='" + name + "'>"
				 +  "			<div class='map-check'>"
				 + 	"				<img src='images/check.png'>"
				 +  "			</div>"
				 +  "	</a>"
				 + 	"	<div class='caption text-center'>"
				 + 	"		<h6>" + name + "</h6>"
				 + 	"	</div>"
				 + 	"</li>";
		}
		panel.find("#maps_list").html(html);

		// 注册选中事件
		panel.find(".thumbnail").each(function(){
			$(this).click(function(){
				//点击选中或者撤销选中
				if($(this).hasClass("selected")){
					$(this).removeClass("selected");
				}else{
					$(this).addClass("selected");
				}
			});
		});
	}
});