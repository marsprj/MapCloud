MapCloud.CityPanel = MapCloud.Class(MapCloud.Panel,{


	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		
		this.registerEvent();
	},

	show : function(){
		this.panel.slideDown();
	},

	hide : function(){
		this.panel.slideUp();
	},
	registerEvent : function(){
		var that = this;
		this.panel.find("li").click(function(){
			var name = $(this).html();
			var position = MapCloud.cityPosition.getCityPosition(name);
			if(position != null){
				var x = position.lon;
				var y = position.lat;

				MapCloud.currentCity = name;
				MapCloud.searchPanel.getAQICityInfo(name);
				MapCloud.currentCityPanel.setCity(name,x,y);
				that.hide();
			}
		});

		// 离开
		this.panel.mouseleave(function(){
			that.hide();
		});
	},

	setCity : function(city){
		if(city == null){
			return;
		}
		this.panel.find(".city-list-current span").html(city);
	}
});