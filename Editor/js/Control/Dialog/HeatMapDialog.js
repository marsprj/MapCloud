// 热力图
MapCloud.HeatMapDialog = MapCloud.Class(MapCloud.Dialog,{
	
	// 当前图层
	layer : null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		
		var dialog = this;

		this.panel.find(".field-enable").change(function(){
			var parent = $(this).parents(".form-group");
			if(this.checked){
				parent.find("#heat_map_field").prop("disabled",false);
			}else{
				parent.find("#heat_map_field").prop("disabled",true);
			}
		});

		this.panel.find(".btn-confirm").click(function(){
			if(dialog.layer == null){
				MapCloud.notify.showInfo("请先设置点图层","Warning");
				return;
			}

			dialog.closeDialog();

			var checked = dialog.panel.find(".field-enable").prop("checked");
			var field = null;
			var uniqueValue = null;
			if(checked){
				field = dialog.panel.find("#heat_map_field").val();
			}else{
				uniqueValue = 1;
			}

			if(field == null && uniqueValue == null){
				MapCloud.notify.showInfo("请设置有效的字段","Warning");
				return;
			}
			// var config = {
			// 	gradient :{
			// 		'.1': 'blue',
			// 		'.7': 'green',
			// 		// '.9': 'yellow',
			// 		'0.8' : '#ebaeb8',
			// 	    '.9': 'red'
			// 	    // '.95': 'white'
			// 	}
			// };
			mapObj.addHeatMap(dialog.layer.name,field,uniqueValue,null);
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
			this.showFields(layer);
			var uniqueValue = heatMapLayer.getUniqueValue();
			var field = heatMapLayer.getField();
			if(uniqueValue == null && field != null){
				this.panel.find(".field-enable").prop("checked",true);
				this.panel.find("#heat_map_field").prop("disabled",false);
				this.panel.find("#heat_map_field option[value='" + field + "']").attr("selected",true);
			}
			if(uniqueValue != null){
				this.panel.find(".field-enable").prop("checked",false);
				this.panel.find("#heat_map_field").prop("disabled",true);
			}
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
	},

	cleanup : function(){
		this.layer = null;
		this.panel.find("#heat_map_field").empty().prop("disabled",false);
		this.panel.find(".field-enable").prop("checked",true);
	},
});