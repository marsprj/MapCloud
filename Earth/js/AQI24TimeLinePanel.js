MapCloud.AQI24TimeLinePanel = MapCloud.Class(MapCloud.Panel,{

	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		this.registerEvent();
	},

	registerEvent : function(){
		var that = this;

		// 当前时刻往前推24小时
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
	    }).on('changeDate',function(ev){
	    	var date = ev.date;
	    	if(date == null){
	    		// 清空
	    		return;
	    	}
	    	var year = date.getUTCFullYear();
	    	var month = date.getUTCMonth();
	    	var day = date.getUTCDate();
	    	var startTime = new Date(year + "-" + (month+1) + "-" + day + " 00:00:00");
	    	var div = that.panel.find(".aqi-start-time-points");
	    	var endTime = MapCloud.dateAdd(date,"day",1);
	    	endTime.setHours(0);
	    	that.panel.find(".timepoint").empty();
	    	var endTimeStr = MapCloud.dateFormat(endTime,"yyyy-MM-dd hh:mm:ss");
	    	MapCloud.aqiTimeList.get24hTimeList(endTimeStr,that.get24hTimeList_callback_2);
	    });	

	    this.panel.find(".btn-chart").click(function(){
	    	var timepoint = that.panel.find(".timepoint").val();
	    	if(timepoint == ""){
	    		alert("请设定一个时刻");
	    		return;
	    	}
	    	MapCloud.aqiTimeList.get24hTimeList(timepoint,that.get24hTimeList_callback);
	    });

	    // 清空
	    this.panel.find(".btn-remove").click(function(){
	    	that.cleanupChart();
	    });
	},

	show : function(){
		// 获取时刻
		var timepoint = MapCloud.searchPanel.timepoint;
		if(timepoint != null){
			var date = timepoint.slice(timepoint.lastIndexOf(" ")+1,timepoint.length);
			this.panel.find(".last-time").html(date);
		}
		this.panel.slideDown();
	},

	hide : function(){
		this.panel.slideUp();

	},	

	// 24小时
	show24AQITimeLineChart : function(){
		this.cleanupChart();
		var timepoint = MapCloud.searchPanel.timepoint;
		MapCloud.aqiTimeList.get24hTimeList(timepoint,this.get24hTimeList_callback);
	},

	get24hTimeList_callback : function(timepoints){
		if(!$.isArray(timepoints)){
			return;
		}
		if(timepoints.length <= 1){
			alert("请选择有效的时间段");
			return;
		}
		var panel = MapCloud.aqi24TimelinePanel;
		panel.cleanupChart();
		var server = MapCloud.server;
		var chartField = "aqi";
		var interval = "3000";
		var aqiTimeLineChart = new MapCloud.AQITimeLineChart(server,chartField,timepoints,interval);
		aqiTimeLineChart.show();
		MapCloud.aqiTimeLineChart = aqiTimeLineChart;
	},	

	// 清空
	cleanupChart : function(){
		if(MapCloud.aqiTimeLineChart != null){
			MapCloud.aqiTimeLineChart.cleanup();
			MapCloud.aqiTimeLineChart = null;
		}
		Radi.Earth.cleanup();
	},

	// 获取某一个时刻的值
	get24hTimeList_callback_2 : function(timepoints){
		if(!$.isArray(timepoints)){
			return;
		}
		if(timepoints.length <= 1){
			alert("请选择有效的时间段");
			return;
		}	
		var panel = MapCloud.aqi24TimelinePanel;
		panel.setTimepoints(timepoints);	
	},

	// 设置时刻
	setTimepoints : function(timepoints){
		if(timepoints == null){
			return;
		}
		var timepoint = null;
		var html = "";
		for(var i = 0; i < timepoints.length; ++i){
			timepoint = timepoints[i];
			if(timepoint == null){
				continue;
			}
			html += "<option>" + timepoint + "</option>";
		}
		this.panel.find(".timepoint").html(html);
	}
});