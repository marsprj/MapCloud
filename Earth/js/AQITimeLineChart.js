MapCloud.AQITimeLineChart = MapCloud.Class({
	
	server : null,

	sourceName : "base",

	layerName : "gc_aqi_ranking",

	interval : null,

	layers :null,

	// 时间轴
	aqiTimeLineBar : null,

	initialize : function(server,chartField,timepoints,interval){
		this.server = server;
		this.chartField = chartField;
		this.timepoints = timepoints;
		this.interval = interval;
		this.layers = [];

		var aqiTimeLineBar = new MapCloud.AQITimeLineBar(this);
		this.aqiTimeLineBar = aqiTimeLineBar;

		var timepoint = null;
		for(var i = 0; i < this.timepoints.length;++i){
			timepoint = timepoints[i];
			if(timepoint == null){
				continue;
			}
			var layer = new MapCloud.AQIChart(this.server,this.chartField,timepoint);
			this.layers.push(layer);
		}
	},

	show : function(){
		this.drawAQIChart(0);
	},

	//绘制指定的AQI
	drawAQIChart : function(id){
		// Radi.Earth.cleanup();
		var layer = this.layers[id];
		if(layer == null){
			return;
		}
		layer.show();
	},

	cleanup : function(){
		this.aqiTimeLineBar.cleanup();
		for(var i = 0; i < this.layers.length; ++i){
			 this.layers[i].cleanup();
		}
		Radi.Earth.cleanup();
	}

});