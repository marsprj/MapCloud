MapCloud.MapBar = MapCloud.Class({
	panel : null,

	initialize : function(){
		this.panel = $("#map_bar_wrapper");
		this.registerBarEvents();
	},


	registerBarEvents : function(){
		var that = this;
		this.panel.find(".mc-icon").each(function(index,element){
			$(this).click(function(){
				switch(index){
					//area
					case 0:{
						that.onArea();
						break;
					}
					default:
						break;
				}
			});
		});
	},

	//拉框查询
	onArea : function(){
		var layerName = $("#layers_row .layer_row_selected")
			.attr("lname");
		if(layerName == null || layerName == ""){
			MapCloud.alert_info.showInfo("请选择图层","Warning");
			return;
		}

		mapObj.queryByRect(layerName,this.query_callback);
		// var count = mapObj.queryByRectCount(layerName);
	},

	query_callback : function(layer,count){
		MapCloud.dataGrid.showPages(layer,count);

		// MapCloud.dataGrid.showFeatures(features);
	}



});