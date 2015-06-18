MapCloud.WMTSDialog = MapCloud.Class(MapCloud.Dialog,{
	
	wmtsWorkspace : null,


	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;

		dialog.panel.find("#wmts_get_layers").click(function(){
			var url = dialog.panel.find("#wmts_url").val();
			if(url == null || url == ""){
				MapCloud.alert_info.showInfo("请输入地址","Warning");
				return;
			}
			var wmtsWorkspace = new GeoBeans.WMTSWorkspace("tmp",url);
			if(wmtsWorkspace == null){
				return;
			}
			dialog.wmtsWorkspace = wmtsWorkspace;
			var layers = wmtsWorkspace.getLayers();
			var layer = null;
			var html = "";
			for(var i = 0; i < layers.length; ++i){
				layer = layers[i];
				html += "<option>" + layer.name + "</option>";
			}

			dialog.panel.find("#wmts_layers").html(html);
		});

		dialog.panel.find(".btn-confirm").click(function(){
			var name = dialog.panel.find("#wmts_layer_name").val();
			if(name == null || name == ""){
				MapCloud.alert_info.showInfo("请输入图层名称","Warning");
				return;
			}
			var url = dialog.panel.find("#wmts_url").val();
			if(url == null || url == ""){
				MapCloud.alert_info.showInfo("请输入地址","Warning");
				return;
			}

			var layerName = dialog.panel
				.find("#wmts_layers option:selected").val();
			if(layerName == null || layerName == ""){
				MapCloud.alert_info.showInfo("请选择一个图层","Warning");
				return;
			}

			var layer = dialog.wmtsWorkspace.getLayer(layerName,name);
			if(mapObj != null){
				mapObj.addLayer(layer);
				mapObj.draw();
			}
			dialog.closeDialog();
		});
	},


});