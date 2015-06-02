// 热力图
MapCloud.HeatMapDialog = MapCloud.Class(MapCloud.Dialog,{
	
	// 当前图层
	layer : null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		
		var dialog = this;

		this.panel.find(".btn-confirm").click(function(){
			dialog.closeDialog();

			// 选中的字段
			var field = dialog.panel.find("#heat_map_field").val();
			if(dialog.layer == null){
				return;
			}


			mapObj.addHeatMap(dialog.layer.name,field);
			mapObj.draw();
			MapCloud.refresh_panel.refreshPanel();
		});
	},

	// 设置图层
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