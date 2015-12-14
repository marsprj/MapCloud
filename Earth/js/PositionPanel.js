MapCloud.PositionPanel = MapCloud.Class(MapCloud.Panel,{
	
	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		var windowWidth = $(window).width();
		var width = this.panel.find(".postion-content").width();
		var left = (windowWidth - width) / 2;
		this.panel.find(".postion-content").css("left",left + "px");
	},

	// 设置位置
	setPosition : function(position){
		if(position == null){
			return;
		}
		var lat = position.lat;
		var lon = position.lon;
		var height = position.height;
		if(lat != null){
			lat = parseFloat(lat);
			lat = lat.toFixed(3);
			this.panel.find(".position-lat").html(lat);
		}
		if(lon != null){
			lon = parseFloat(lon);
			lon = lon.toFixed(3);
			this.panel.find(".position-lon").html(lon);
		}
		
		this.setHeight(height);
	},

	// 设置高度
	setHeight : function(height){
		if(height == null){
			return;
		}
		this.panel.find(".position-height").html(height);
	},

});