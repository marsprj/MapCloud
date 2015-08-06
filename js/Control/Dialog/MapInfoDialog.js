MapCloud.MapInfoDialog = MapCloud.Class(MapCloud.Dialog,{
	
	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		
		var dialog = this;

		this.panel.find("#map_info_dialog_tab a").each(function(){
			$(this).click(function(e){
				e.preventDefault()
				$(this).tab("show");
			});
		});
	},


	showDialog : function(map){
		if(map == null){
			return;
		}
		this.cleanup();
		this.panel.modal();	

		var name = map.name;
		this.panel.find(".map-info-name").val(name);
		var srid = map.srid;
		this.panel.find(".map-info-srid").val(srid);
		var extent = map.extent;
		if(extent != null){
			var extentStr = extent.xmin.toFixed(2) + " , " + extent.ymin.toFixed(2)
					+ " , " + extent.xmax.toFixed(2) + " , " + extent.ymax.toFixed(2);
			this.panel.find(".map-info-extent").val(extentStr);
		}

		this.panel.find("#map_layers").empty();
		var html = '<table class="table table-hover table-bordered ">'
			+ '<thead>'
			+ '<tr>'
			+ '	<th>名称</th>'
			+ '	<th>类型</th>'
			+ '	<th>范围</th>'
			+ '</tr>'
			+ '</thead>'
		 	+ '<tbody>';

		var layers = map.getLayers();
		var extent = null;
		var geomType = null;
		var layer = null;
		var name = null;
		var extentStr = "";
		for(var i = 0; i < layers.length;i++){
			layer = layers[i];
			if(layer == null){
				continue;
			}
			name = layer.name;
			geomType = layer.geomType;
			extent = layer.extent;
			if(extent != null){
				extentStr = extent.xmin.toFixed(2) + " , " + extent.ymin.toFixed(2)
					+ " , " + extent.xmax.toFixed(2) + " , " + extent.ymax.toFixed(2);
			}
			
			html += "<tr>"
			+ "<td>" + name + "</td>"
			+ "<td>" + geomType + "</td>"
			+ "<td>" + extentStr + "</td>"
			+ "</tr>";
		}
		html += "</tbody>";
		this.panel.find("#map_layers").html(html);
	}

});