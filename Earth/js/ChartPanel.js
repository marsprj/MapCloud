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
				content.slideDown();
			}else{
				content.slideUp();
			}
		});

		this.panel.find(".chart-content-div li").click(function(){
			var sname = $(this).attr("mname");
			switch(sname){
				case "tj":{
					that.showTianjinModel();
					break;
				}
				default:
					break;
			}
		});
	},

	showTianjinModel : function(){
		// Radi.Earth.flyTo()
		Radi.Earth.cleanup();
		var modelUrl = "./data/tj/hepingqu/1-4/1-4.gltf";
		var x = 117.1840;
		var y = 39.0986;
		var height = 0;
		Radi.Earth.addModel(modelUrl,x,y,height,2.5);

		var modelUrl = "./data/tj/hepingqu/4330517/5.gltf";
		var x = 117.1998;
		var y = 39.11360;
		var height = 0;
		Radi.Earth.addModel(modelUrl,x,y,height,2.5);	


		var modelUrl = "./data/tj/hepingqu/4331515/4331515.gltf";
		var x = 117.18155;
		var y = 39.1216;
		var height = 0;
		Radi.Earth.addModel(modelUrl,x,y,height,1);	

		var modelUrl = "./data/tj/hepingqu/4331516/4331516.gltf";
		var x = 117.188;
		var y = 39.1261;
		var height = 0;
		Radi.Earth.addModel(modelUrl,x,y,height,1);		

		var modelUrl = "./data/tj/hepingqu/4331517/4331517.gltf";
		var x = 117.19305;
		var y = 39.11028;
		var height = 0;
		Radi.Earth.addModel(modelUrl,x,y,height,1);		

		var modelUrl = "./data/tj/hepingqu/4331518/4331518.gltf";
		var x = 117.20988;
		var y = 39.1113;
		var height = 0;
		Radi.Earth.addModel(modelUrl,x,y,height,2.5);	

		var modelUrl = "./data/tj/hepingqu/4332515/4332515.gltf";
		var x = 117.180775;
		var y = 39.12379;
		var height = 0;
		Radi.Earth.addModel(modelUrl,x,y,height,1);		

		var modelUrl = "./data/tj/hepingqu/4332516/4332516.gltf";
		var x = 117.1878;
		var y = 39.12658;
		var height = 0;
		Radi.Earth.addModel(modelUrl,x,y,height,1);	

		var modelUrl = "./data/tj/hepingqu/4332517/4332517.gltf";
		var x = 117.1985;
		var y = 39.131025;
		var height = 0;
		Radi.Earth.addModel(modelUrl,x,y,height,1);	

		var modelUrl = "./data/tj/hepingqu/4333515-7/4333515-7.gltf";
		var x = 117.1849;
		var y = 39.1331;
		var height = 0;
		Radi.Earth.addModel(modelUrl,x,y,height,1);			
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