MapCloud.CityPanel = MapCloud.Class(MapCloud.Panel,{


	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		
		this.registerEvent();
	},

	registerEvent : function(){
		var that = this;
	},
});