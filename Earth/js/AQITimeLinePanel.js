MapCloud.AQITimeLinePanel = MapCloud.Class(MapCloud.Panel,{
	aqiTimeLineChart  : null,

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

		this.panel.find(".aqi-24h").click(function(){
			that.show24AQITimeLineChart();
		});

		// 选择起始时间
		this.panel.find(".start_form_datetime").datetimepicker({
	        format: "yyyy-mm-dd",
	        autoclose : true,
	        minView : 'month',
	        maxView : "year",
	        language : "zh-CN"
	        // startDate: "2014-06-20"
	    }).on('changeDate',function(ev){

	    });


	    // 选择终止时间
		this.panel.find(".end_form_datetime").datetimepicker({
	        format: "yyyy-mm-dd",
	        autoclose : true,
	        minView : 'month',
	        maxView : "year",
	        language : "zh-CN"
	        // startDate: "2014-06-20"
	    }).on('changeDate',function(ev){

	    });

	    this.panel.find(".btn-chart").click(function(){
	    	var timepoint = that.panel.find(".timepoint").val();
	    	var startTime = that.panel.find(".start_form_datetime input").val();
	    	if(startTime == ""){
	    		alert("请选择起始日期");
	    		return;
	    	}
	    	var endTime = that.panel.find(".end_form_datetime input").val();
	    	if(endTime == ""){
	    		alert("请选择终止日期");
	    		return;
	    	}
	    	var startTimeStr = startTime + " " + timepoint;
	    	var endTimeStr = endTime + " " + timepoint;
	    	that.cleanupChart();
	    	
	    	MapCloud.aqiTimeList.getDayHourTimeList(startTimeStr,endTimeStr,that.get24hTimeList_callback);
	    });

	    // 清空
	    this.panel.find(".btn-remove").click(function(){
	    	that.cleanupChart();
	    });
	},

	show24AQITimeLineChart : function(){
		this.cleanupChart();
		var timepoint = MapCloud.searchPanel.timepoint;
		MapCloud.aqiTimeList.get24hTimeList(timepoint,this.get24hTimeList_callback);

	},

	get24hTimeList_callback : function(timepoints){
		var panel = MapCloud.aqiTimelinePanel;
		var server = MapCloud.server;
		var chartField = "aqi";
		var interval = "3000";
		var aqiTimeLineChart = new MapCloud.AQITimeLineChart(server,chartField,timepoints,interval);
		aqiTimeLineChart.show();
		panel.aqiTimeLineChart = aqiTimeLineChart;
	},	

	cleanupChart : function(){
		if(this.aqiTimeLineChart != null){
			this.aqiTimeLineChart.cleanup();
			this.aqiTimeLineChart = null;
		}
		Radi.Earth.cleanup();
	}
});