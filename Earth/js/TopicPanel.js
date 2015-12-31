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

	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		this.registerEvent();

		var workspace = new GeoBeans.WFSWorkspace("tmp",MapCloud.server,"1.0.0");
		this.agroFeatureType = new GeoBeans.FeatureType(workspace, this.agroLayerName);
	},


	registerEvent : function(){
		var that = this;

		this.panel.find("[data-toggle='tooltip']").tooltip({container:'body'});
		this.panel.find(".mc-icon").click(function(){
			if($(this).hasClass("mc-stretch")){
				that.onStretch(this);
			}else if($(this).hasClass("mc-icon-enco")){
				that.showEncoRangeChart();
			}else if($(this).hasClass("mc-icon-aqi")){
				// MapCloud.searchPanel.showAQIChart();
				that.showAQIChart();
			}else if($(this).hasClass("mc-icon-pop")){
				that.showPopRangeChart();
			}else if($(this).hasClass("mc-icon-per")){
				that.showPerRangeChart();
			}else if($(this).hasClass("mc-icon-agro")){
				if(that.agroChartFlag){
					Radi.Earth.cleanup();
					that.agroChartFlag = false;
				}else{
					that.getAgroData();
				}
				
			}else if($(this).hasClass("mc-icon-aqi-timeline")){
				that.showAQITimeLineChart();
			}
		});

	},

	onStretch : function(item){
		if($(item).hasClass("mc-icon-left")){
			this.panel.children().not(".mc-stretch").css("display","block");
			$(item).removeClass("mc-icon-left");
			$(item).addClass("mc-icon-right");
			this.panel.animate({'width':'282px'},300);
		}else{
			this.panel.children().not(".mc-stretch").css("display","none");
			$(item).removeClass("mc-icon-right");
			$(item).addClass("mc-icon-left");
			this.panel.animate({'width':'40px'},300);
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
			this.aqiChart = null;
			Radi.Earth.cleanup();
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
			this.popRangeChart.cleanup();
			this.popRangeChart = null;
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
			this.encoRangeChart.cleanup();
			this.encoRangeChart = null;
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
			this.perRangeChart.cleanup();
			this.perRangeChart = null;
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
		this.agroFeatureType.fields = this.agroFeatureType.getFields(this.agroMapName,null);
		this.agroFeatureType.getFeaturesFilterAsync(this.agroMapName,null,null,333,0,
			this.agroFields,null,this.getAgroData_callback);
	},


	getAgroData_callback : function(features){
		if(!$.isArray(features)){
			return;
		}
		var that = MapCloud.topicPanel;
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
		if(MapCloud.aqiTimelinePanel.panel.css("display") == "none"){
			MapCloud.aqiTimelinePanel.show();
		}else{
			MapCloud.aqiTimelinePanel.hide();
		}
	},


	// // AQI序列
	// showAQITimeLineChart : function(){
	// 	if(this.aqiTimeLineChart == null){
	// 		var timepoint = MapCloud.searchPanel.timepoint;
	// 		MapCloud.aqiTimeList.get24hTimeList(timepoint,this.get24hTimeList_callback);
	// 	}else{
	// 		this.aqiTimeLineChart.cleanup();
	// 		this.aqiTimeLineChart = null;
	// 		Radi.Earth.cleanup();
	// 	}
	// },

	// 某一个时刻序列
	showAQITimeLineChart2 : function(){
		if(this.aqiTimeLineChart == null){
			var timepoint = MapCloud.searchPanel.timepoint;
			var startTime = "2015-12-28 04:00:00";
			var endTime = "2015-12-31 04:00:00";
			MapCloud.aqiTimeList.getDayHourTimeList(startTime,endTime,this.get24hTimeList_callback);
		}else{
			this.aqiTimeLineChart.cleanup();
			this.aqiTimeLineChart = null;
			Radi.Earth.cleanup();
		}
	},



	get24hTimeList_callback : function(timepoints){
		var panel = MapCloud.topicPanel;
		// panel.show24AQITimeLineChart()
		var server = MapCloud.server;
		var chartField = "aqi";
		var interval = "3000";
		// var timepoints = ["2015-12-31 04:00:00","2015-12-31 06:00:00","2015-12-31 08:00:00"];
		var aqiTimeLineChart = new MapCloud.AQITimeLineChart(server,chartField,timepoints,interval);
		aqiTimeLineChart.show();
		panel.aqiTimeLineChart = aqiTimeLineChart;
	},
});