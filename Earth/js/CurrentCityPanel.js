MapCloud.CurrentCityPanel = MapCloud.Class(MapCloud.Panel,{
	
	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		
		this.registerEvent();
		this.cleanup();
	},

	registerEvent : function(){
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

		// 显示AQI
		var that = this;
		this.panel.find(".current-city-aqi").click(function(){
			MapCloud.searchPanel.showAQIPanel();
		});

	},

	cleanup : function(){
		this.panel.find(".current-city-name").html(MapCloud.currentCity);
		this.panel.find(".current-city-aqi span").html("");
	},

	setAQI : function(aqi){
		this.panel.find(".current-city-aqi span").html(aqi);	
	},

	setCity : function(city,x,y){
		this.panel.find(".current-city-name").html(city);
		MapCloud.cityPanel.setCity(city);
		if(x != null && y != null){
			var h = 50000;
			Radi.Earth.flyTo(x,y,h);
			var position = {
				lon : x,
				lat : y,
				height : h
			};
			MapCloud.positionPanel.setPosition(position);
			MapCloud.positionControl.setPosition(position);
		}
	},
});