MapCloud.MapLayersControl = MapCloud.Class(MapCloud.Panel,{
	

	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		
		this.registerPanelEvent();
	},
	

	registerPanelEvent : function(){
		var that = this;
		this.panel.click(function(){
			var listPanel = MapCloud.mapLayersPanel;
			if(listPanel.panel.css("display") == "none"){
				listPanel.show();
			}else{
				listPanel.hide();
			}
		});
	},
});