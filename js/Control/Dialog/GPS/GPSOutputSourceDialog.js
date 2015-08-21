MapCloud.GPSOutputSourceDialog = MapCloud.Class(MapCloud.Dialog,{
	// 来源
	source : null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this,arguments);
		var dialog = this;


		this.registerPanelEvent();

	},

	registerPanelEvent : function(){
		var dialog = this;
		// 选择
		this.panel.find(".btn-confirm").click(function(){
			var outputSource = dialog.panel.find(".gps-output-source-list").val();
			if(outputSource == null){
				dialog.closeDialog();
				return;
			}
			var parent = null;
			switch(dialog.source){
				case "kmean":{
					parent = MapCloud.gps_kmean_dialog;
					break;
				}
				case "featureProject":{
					parent = MapCloud.gps_feature_project_dialog;
					break;
				}
				case "featureImport":{
					parent = MapCloud.gps_feature_import_dialog;
					break;
				}
				case "getArea":{
					parent = MapCloud.gps_get_area_dialog;
					break;
				}
				case "getLength":{
					parent = MapCloud.gps_get_length_dialog;
					break;
				}
				case "buffer":{
					parent = MapCloud.gps_buffer_dialog;
					break;
				}
				case "centroid":{
					parent = MapCloud.gps_centroid_dialog;
					break;
				}
				case "convexHull":{
					parent = MapCloud.gps_convex_hull_dialog;
					break;
				}
				case "buildPyramid":{
					parent = MapCloud.gps_build_pyramid_dialog;
					break;
				}
				case "updateTile":{
					parent = MapCloud.gps_update_tile_dialog;
					break;
				}
				default:
					break;
			}
			if(parent != null){
				parent.setOutputSource(outputSource);
			}
			dialog.closeDialog();
		});		
	},

	showDialog : function(source,type){
		MapCloud.Dialog.prototype.showDialog.apply(this, arguments);
		this.source = source;
		dbsManager.getDataSources(this.getDataSources_callback,type);
	},

	getDataSources_callback : function(dataSources){
		var dialog = MapCloud.gps_output_source_dialog;
		dialog.showDataSources(dataSources);
	},

	showDataSources : function(dataSources){
		var dataSource = null;
		var name = null;
		var html = "";
		for(var i = 0 ;i < dataSources.length; ++i){
			dataSource = dataSources[i];
			if(dataSource == null){
				continue;
			}
			name = dataSource.name;
			html += "<option value='" + name + "'>" + name + "</option>";
		}	
		this.panel.find(".gps-output-source-list").html(html);	
	}
});