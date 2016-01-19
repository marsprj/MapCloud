MapCloud.TopicPanel = MapCloud.Class(MapCloud.Panel,{
	// AQI
	aqiChart : null,
	// 人口数据
	popRangeChart : null,

	// 经济数据
	encoRangeChart : null,

	// 人均数据
	perRangeChart : null,

	// 海洋浮标地图
	agroMapName : "agro",

	// 海洋浮标图层
	agroLayerName : "agro",

	agroFields : ["ppt","x","y"],

	agroFeatureType : null,

	agroChartFlag : false,

	// 上一次点击的序号
	preIndex : null,
	showFlag : false,

	// 浮标数据
	argoFeatures : null,

	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		this.registerEvent();

		var workspace = new GeoBeans.WFSWorkspace("tmp",MapCloud.server,"1.0.0");
		this.agroFeatureType = new GeoBeans.FeatureType(workspace, this.agroLayerName);
	},


	registerEvent : function(){
		var that = this;

		this.panel.find("[data-toggle='tooltip']").tooltip({container:'body'});
		this.panel.find(".mc-icon").each(function(i,element){
			$(this).click(function(){
				switch(i){
					case 0:{
						that.onStretch(this);
						break;
					}
					case 1:{
						if(that.preIndex == 1 && that.showFlag){
							Radi.Earth.cleanup();
							that.showFlag = false;
						}else{
							that.showPerRangeChart();
							that.showFlag = true;
						}
						break;
					}
					case 2:{
						if(that.preIndex == 2 && that.showFlag){
							Radi.Earth.cleanup();
							that.showFlag = false;
						}else{
							that.showEncoRangeChart();
							that.showFlag = true;
						}
						break;
					}
					case 3:{
						if(that.preIndex == 3 && that.showFlag){
							Radi.Earth.cleanup();
							that.showFlag = false;
						}else{
							that.showPopRangeChart();
							that.showFlag = true;
						}
						break;
					}
					case 4:{
						if(that.preIndex == 4 && that.showFlag){
							Radi.Earth.cleanup();
							that.showFlag = false;
						}else{
							that.getAgroData();
							that.showFlag = true;
						}
						break;
					}
					case 5:{
						if(that.preIndex == 5 && that.showFlag){
							Radi.Earth.cleanup();
							that.showFlag = false;
						}else{
							that.show3DModel();
							that.showFlag = true;
						}
						break;
					}
					case 6:{
						if(that.preIndex == 6 && that.showFlag){
							Radi.Earth.cleanup();
							that.showFlag = false;
						}else{
							that.showAQIChart();
							that.showFlag = true;
						}
						break;
					}
					case 7:{
						that.show24AQITimeLineChart();
						break;
					}
					case 8:{
						that.showAQITimeLineChart();
						break;
					}
					default:
						break;
				}
				that.preIndex = i;
			});
		})

	},

	onStretch : function(item){
		if($(item).hasClass("mc-icon-left")){
			this.panel.children().not(".mc-stretch").css("display","block");
			$(item).removeClass("mc-icon-left");
			$(item).addClass("mc-icon-right");
			this.panel.animate({'width':'362px'},300);
		}else{
			this.panel.children().not(".mc-stretch").css("display","none");
			$(item).removeClass("mc-icon-right");
			$(item).addClass("mc-icon-left");
			this.panel.animate({'width':'40px'},300);
			MapCloud.aqiTimelinePanel.hide();
			MapCloud.aqi24TimelinePanel.hide();
		}
	},

	// AQI 
	showAQIChart : function(){
		if(this.aqiChart == null){
			var server =  MapCloud.server;
			var chartField = "aqi";
			var timepoint = MapCloud.searchPanel.timepoint;
			var aqiChart = new MapCloud.AQIChart(server,chartField,timepoint);
			aqiChart.show();
			this.aqiChart = aqiChart;
		}else{
			Radi.Earth.cleanup();
			this.aqiChart.show();
		}

	},

	// 人口数据
	showPopRangeChart : function(){
		if(this.popRangeChart == null){
			var server =  MapCloud.server;
			var baseLayerOption = {
				sourceName : "base",
				layerName : "prov_bount_4m",
				positionField : "name",
			};
			var chartLayerOption = {
				sourceName : "base",
				layerName : "china_econmic_2014",
				positionField : "省区市",
				chartField : "人口_万人"
			};

			var colorMapID = 12;
			var chart = new MapCloud.RangeChart(server,baseLayerOption,chartLayerOption,colorMapID);
			chart.show();
			this.popRangeChart = chart;
			this.setCameraPosition();
		}else{
			Radi.Earth.cleanup();
			this.popRangeChart.show();
			this.setCameraPosition();
		}

	},

	// 经济数据
	showEncoRangeChart : function(){
		if(this.encoRangeChart == null){
			this.cleanupChart();

			var server =  MapCloud.server;
			var baseLayerOption = {
				sourceName : "base",
				layerName : "prov_bount_4m",
				positionField : "name",
			};
			var chartLayerOption = {
				sourceName : "base",
				layerName : "china_econmic_2014",
				positionField : "省区市",
				chartField : "gdp_亿元"
			};

			var colorMapID = 12;
			var chart = new MapCloud.RangeChart(server,baseLayerOption,chartLayerOption,colorMapID);
			chart.show();
			this.encoRangeChart = chart;
			this.setCameraPosition();
		}else{
			Radi.Earth.cleanup();
			this.encoRangeChart.show();
			this.setCameraPosition();
		}
	},

	// 人均数据
	showPerRangeChart : function(){
		if(this.perRangeChart == null){
			this.cleanupChart();
			var server =  MapCloud.server;
			var baseLayerOption = {
				sourceName : "base",
				layerName : "prov_bount_4m",
				positionField : "name",
			};
			var chartLayerOption = {
				sourceName : "base",
				layerName : "china_econmic_2014",
				positionField : "省区市",
				chartField : "人均gdp_元"
			};

			var colorMapID = 12;
			var chart = new MapCloud.RangeChart(server,baseLayerOption,chartLayerOption,colorMapID);
			chart.show();
			this.perRangeChart = chart;
			this.setCameraPosition();
		}else{
			Radi.Earth.cleanup();
			this.perRangeChart.show();
			this.setCameraPosition();
		}
	},


	cleanupChart : function(){
		if(this.popRangeChart != null){
			this.popRangeChart.cleanup();
			this.popRangeChart = null;
		}
		if(this.encoRangeChart != null){
			this.encoRangeChart.cleanup();
		 	this.encoRangeChart = null;
		}
		if(this.perRangeChart != null){
			this.perRangeChart.cleanup();
			this.perRangeChart = null;
		}		
	},

	setCameraPosition : function(){
		var x = 97.92627;
		var y = 15.730198;
		var z =  5543911;
		var heading = 8.9819126;
		var pitch = -70.75989;
		var roll = 359.990288;
		Radi.Earth.flyTo(x,y,z,heading,pitch,roll);
	},

	getAgroData : function(){
		if(this.argoFeatures != null){
			this.showArgoData(this.argoFeatures);
			return;
		}
		this.agroFeatureType.fields = this.agroFeatureType.getFields(this.agroMapName,null);
		this.agroFeatureType.getFeaturesFilterAsync(this.agroMapName,null,null,333,0,
			this.agroFields,null,this.getAgroData_callback);
	},


	getAgroData_callback : function(features){
		if(!$.isArray(features)){
			return;
		}
		var that = MapCloud.topicPanel;
		that.argoFeatures = features;
		that.showArgoData(features);
	},


	showArgoData : function(features){
		if(features == null){
			return;
		}
		Radi.Earth.cleanup();
		var url = "../images/agro_marker.png";
		var pptFieldIndex = this.agroFeatureType.getFieldIndex("ppt");
		var xFieldIndex = this.agroFeatureType.getFieldIndex("x");
		var yFieldIndex = this.agroFeatureType.getFieldIndex("y");
		var feature = null,values = null,ppt = null,x = null,y= null;
		var agro3D = null, agro3DList = [];
		for(var i = 0; i < features.length; ++i){
			feature = features[i];
			if(feature == null){
				continue;
			}
			values = feature.values;
			if(values == null){
				continue;
			}
			ppt = values[pptFieldIndex];
			x = values[xFieldIndex];
			y = values[yFieldIndex];
			if(x != null && y != null){
				agro3D = Radi.Earth.addBillboard(x,y,"",url);
				agro3DList.push(agro3D);
			}
		}
		var cx = 107.18924;
		var cy = 25.566601;
		var cz = 11677693;
		var heading = 358.15;
		var pitch = -89.76141;
		var roll = 0;
		Radi.Earth.flyTo(cx,cy,cz,heading,pitch,roll);
		this.agroChartFlag = true;
	},


	showAQITimeLineChart : function(){
		var aqi24Panel = MapCloud.aqi24TimelinePanel;
		var aqiPanel = MapCloud.aqiTimelinePanel; 
		if(aqiPanel.panel.css("display") == "none"){
			if(aqi24Panel.panel.css("display") == "block"){
				aqi24Panel.hide();
			}
			aqiPanel.show();
		}else{
			aqiPanel.hide();
		}
	},


	show24AQITimeLineChart : function(){
		var aqi24Panel = MapCloud.aqi24TimelinePanel;
		var aqiPanel = MapCloud.aqiTimelinePanel; 
		if(aqi24Panel.panel.css("display") == "none"){
			if(aqiPanel.panel.css("display") == "block"){
				aqiPanel.hide();
			}
			aqi24Panel.show();
		}else{
			aqi24Panel.hide();
		}
	},


	show3DModel : function(){
		var handler = function(){

		};
		var that = this;
		Radi.Earth.camera().moveEnd.addEventListener(that.addTianjinModel);
		Radi.Earth.flyTo(117.186,39.119,30000);
		
	},

	addTianjinModel : function(){
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

		var that = MapCloud.topicPanel;
		Radi.Earth.camera().moveEnd.removeEventListener(that.addTianjinModel);				
	}
});