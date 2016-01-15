MapCloud.ChartPanel = MapCloud.Class(MapCloud.Panel,{
	
	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		
		this.registerEvent();
	},

	registerEvent : function(){
		var that = this;


		this.panel.find("[data-toggle='tooltip']").tooltip({container:'body'});
		this.panel.find(".mc-stretch").click(function(){
			var content = that.panel.find(".chart-content-div");
			if(content.css("display")== "none"){
				$(this).removeClass("mc-icon-left");
				$(this).addClass("mc-icon-right");
				content.slideDown();
			}else{
				$(this).removeClass("mc-icon-right");
				$(this).addClass("mc-icon-left");				
				content.slideUp();
			}
		});

		this.panel.find(".chart-content-div li").click(function(){
			var sname = $(this).attr("mname");
			switch(sname){
				default:
					break;
			}
		});
	},


	showFenghuangModel : function(){
		// Radi.Earth.flyTo(109.483, 18.248,0);
		var modelUrl = './data/test/028.gltf';
		var x = 109.482;
		var y = 18.255;
		var height = 0;
		Radi.Earth.addModel(modelUrl,x,y,height,0.01);		
	},

});