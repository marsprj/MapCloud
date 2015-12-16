MapCloud.TopicPanel = MapCloud.Class(MapCloud.Panel,{
	// 人口数据
	popRangeChart : null,

	// 经济数据
	encoRangeChart : null,

	// 人均数据
	perRangeChart : null,

	


	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		this.registerEvent();
	},


	registerEvent : function(){
		var that = this;

		this.panel.find("[data-toggle='tooltip']").tooltip({container:'body'});
		this.panel.find(".mc-icon").click(function(){
			if($(this).hasClass("mc-stretch")){
				that.onStretch(this);
			}else if($(this).hasClass("mc-icon-enco")){
				// MapCloud.searchPanel.showRangeChart();
				that.showEncoRangeChart();
			}else if($(this).hasClass("mc-icon-aqi")){
				MapCloud.searchPanel.showAQIChart();
			}else if($(this).hasClass("mc-icon-pop")){
				that.showPopRangeChart();
			}else if($(this).hasClass("mc-icon-per")){
				that.showPerRangeChart();
			}
		});

	},

	onStretch : function(item){
		if($(item).hasClass("mc-icon-left")){
			this.panel.children().not(".mc-stretch").css("display","block");
			$(item).removeClass("mc-icon-left");
			$(item).addClass("mc-icon-right");
			// this.panel.css("width","203px");
			this.panel.animate({'width':'202px'},300);
		}else{
			this.panel.children().not(".mc-stretch").css("display","none");
			$(item).removeClass("mc-icon-right");
			$(item).addClass("mc-icon-left");
			// this.panel.css("width","40px");
			this.panel.animate({'width':'40px'},300);
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
});