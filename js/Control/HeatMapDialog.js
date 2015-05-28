MapCloud.HeatMapDialog = MapCloud.Class(MapCloud.Dialog,{
	
	// heatMapLayer : null,
	layer : null,


	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;
		// this.heatMapLayer = new GeoBeans.Layer.HeatMapLayer("heatMap"); 
		// this.panel.find("#heat_map_layer").change(function(event) {
		// 	var name = $(this).val();
		// 	dialog.showFields(name);
		// });

		// this.panel.find("#remove_heat_map").click(function(){
		// 	if(dialog.heatMapLayer == null){
		// 		return;
		// 	}
		// 	mapObj.removeLayer(dialog.heatMapLayer.name);
		// 	mapObj.draw();
		// });

		this.panel.find(".btn-confirm").click(function(){
			dialog.closeDialog();
			// var layerName = dialog.panel.find("#heat_map_layer").val();
			// var field = dialog.panel.find("#heat_map_field").val();
			// var layer = mapObj.getLayer(layerName);
			// if(layer == null || field == null){
			// 	return;
			// }
			// if(dialog.heatMapLayer != null){
			// 	mapObj.removeLayer(dialog.heatMapLayer.name);
			// 	dialog.heatMapLayer = null;
			// }
			// dialog.heatMapLayer 
			// 	= new GeoBeans.Layer.HeatMapLayer(layerName + "-heatMap");
			// dialog.heatMapLayer.setLayer(layer,field);
			// mapObj.addLayer(dialog.heatMapLayer);
			// mapObj.draw();
			var field = dialog.panel.find("#heat_map_field").val();
			if(dialog.layer == null){
				return;
			}
			mapObj.addHeatMap(dialog.layer.name,field);
			mapObj.draw();
			MapCloud.refresh_panel.refreshPanel();
		});
	},

	// showDialog : function(){
	// 	this.panel.modal();
	// 	if(mapObj == null){
	// 		return;
	// 	}
	// 	var layers = mapObj.getLayers();
	// 	var html = "";
	// 	for(var i = 0; i < layers.length; ++i){
	// 		var layer = layers[i];
	// 		if(layer instanceof GeoBeans.Layer.DBLayer){
	// 			html += "<option value='" + layer.name + "'>" 
	// 				+ layer.name 
	// 				+ "</option>";
	// 		}
	// 	}
	// 	this.panel.find("#heat_map_layer").html(html);
	// 	var name = this.panel
	// 		.find("#heat_map_layer option:selected").val();
	// 	this.showFields(name);

	// 	if(this.heatMapLayer != null){
	// 		var layer = this.heatMapLayer.layer;
	// 		var field = this.heatMapLayer.field;
	// 		if(layer == null || field == null){
	// 			return;
	// 		}
	// 		var name = layer.name;
	// 		this.panel.find("#heat_map_layer option[value='" 
	// 			+ name + "']").attr("selected",true);
	// 		this.showFields(name);
	// 		this.panel.find("#heat_map_field option[value='"
	// 			+ field + "']").attr("selected",true);
	// 	}

	// },

	setLayer : function(layer){
		if(layer == null){
			return;
		}
		this.layer = layer;
		var heatMapLayer = layer.getHeatMapLayer();

		if(heatMapLayer == null){
			this.showFields(layer);
		}else{
			var field = heatMapLayer.getField();
			this.showFields(layer);
			this.panel.find("#heat_map_field option[value='"
				+ field + "']").attr("selected",true);
		}

	},

	//展示字段
	showFields : function(layer){
		if(layer == null || mapObj == null){
			return;
		}
	
		var fields = layer.getFields();
		if(fields == null){
			return;
		}
		var html = "";
		for(var i = 0; i < fields.length; ++i){
			var field = fields[i];
			var type = field.type;
			type = type.toLowerCase();
			if(type == "int" || type == "double" || type == "float"){
				html += "<option value='" + field.name + "'>" 
					+ 	field.name 
					+ "</option>";
			}
		}
		this.panel.find("#heat_map_field").html(html);
	}
});