MapCloud.MapMgrDialog = MapCloud.Class(MapCloud.Dialog,{
	
	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;
		dialog.panel.find("#remove_select_maps").each(function(){
			$(this).click(function(){
				dialog.panel.find(".selected").removeClass("selected");
			});
		});

		dialog.panel.find("#remove_maps").each(function(){
			$(this).click(function(){
				var maps = [];
				dialog.panel.find(".selected").each(function(){
					var name = $(this).parent().attr("name");
					maps.push(name);
				});
				var map = null;
				var result = null;
				// var result_info = $("#result_info strong");
				for(var i = 0; i < maps.length;++i){
					map = maps[i];
					result = mapManager.removeMap(map);
					var info = "Remove Map [ " + map + " ]";
					MapCloud.alert_info.showInfo(result,info);
				}
				mapManager.getMaps(dialog.getMaps_callback);
			});
		});

		dialog.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				dialog.closeDialog();
			});
		});
	},

	cleanup : function(){
		// this.panel.find("#maps_list").html("");
	},

	showDialog : function(){
		this.cleanup();
		this.panel.modal();
		mapManager.getMaps(this.getMaps_callback);
	},

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
		panel.find(".thumbnail").each(function(){
			$(this).click(function(){
				// panel.find(".thumbnail").each(function(){
				// 	$(this).removeClass("selected");
				// });
				// var check = '<div class="map-check"> '
				// 		+ 	'	<img src="images/check.png">'
				// 		+	'</div>	';
				if($(this).hasClass("selected")){
					$(this).removeClass("selected");
					// $(this).parents(".maps-thumb")
					// 	.find(".map-check").remove();
				}else{
					$(this).addClass("selected");
					// $(check).insertAfter($(this));
					// $(check).click(function(){
					// 	$(this).parents(".maps-thumb")
					// 		.find(".thumbnail").removeClass("selected");
					// });
				}
			});
		});
	},



});