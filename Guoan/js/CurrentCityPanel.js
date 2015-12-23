MapCloud.CurrentCityPanel = MapCloud.Class(MapCloud.Panel,{


	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		
		this.registerPanelEvent();
		this.cleanup();
	},	

	registerPanelEvent : function(){
		var that = this;
		// 切换城市
		this.panel.find(".current-city").click(function(){
			var flag = MapCloud.cityPanel.panel.css("display");
			if(flag == "block"){
				MapCloud.cityPanel.hide();
			}else{
				MapCloud.cityPanel.show();
			}
		});

	},

	setCity : function(city,x,y){
		this.panel.find(".current-city-name").html(city);
		MapCloud.cityPanel.setCity(city);
		if(x != null && y != null && mapObj != null){
			var center = new GeoBeans.Geometry.Point(x,y);
			mapObj.setCenter(center);
			mapObj.setLevel(10);
			mapObj.draw();			
			
		}

	},
});