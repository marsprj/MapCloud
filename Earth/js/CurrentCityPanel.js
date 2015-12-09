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
				MapCloud.cityPanel.panel.slideUp();
			}else{
				MapCloud.cityPanel.panel.slideDown();
			}
		});

		// 显示AQI
		var that = this;
		this.panel.find(".current-city-aqi").click(function(){
			MapCloud.searchPanel.showAQIPanel();
		});

		// 切换城市，显示AQI数值，及AQI城市
	},

	cleanup : function(){
		this.panel.find(".current-city-name").html(MapCloud.currentCity);
		this.panel.find(".current-city-aqi span").html("");
	},

	setAQI : function(aqi){
		this.panel.find(".current-city-aqi span").html(aqi);	
	}
});