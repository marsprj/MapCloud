MapCloud.AQITimelineChartPanel = MapCloud.Class(MapCloud.Panel,{
	// 数据库
	dbName : "base",

	// 时间表名称
	timeTableName : "gc_aqi_uptime",

	// 时间表的时间字段
	timeTableTimeField : "uptime",	

	// AQI TABLE
	tableName : "gc_aqi",

	// AQI table 时间字段
	timeField : "time_point",
	// 辅助字段
	labelField : "position_name",

	//标志字段
	flagField : "station_code", 	

	// 样式管理器
	styleMgr 	: null,

	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);

		this.registerEvent();
	},

	showPanel : function(){
		if(this.panel.css("display") == "none"){
			this.cleanup();
			this.panel.css("display","block");

			var colors = styleManager.getColorMaps();
			this.getColorMaps_callback(colors);
		}
	},

	cleanup : function(){
		this.chartLayer = null;
		this.panel.find(".chart-table-name").val("空气质量指数时间序列图");
		this.panel.find(".aqi-start-time-points").empty();
		this.panel.find(".aqi-end-time-points").empty();
		this.panel.find(".aqi-index option[value='aqi']").attr("selected",true);
		this.panel.find(".date input").val("");
		this.panel.find(".chart-interval").html("3000");
	},

	// 色阶地图 
	getColorMaps_callback : function(colorMaps){
		if(colorMaps == null){
			return;
		}
		
		var that = MapCloud.aqi_timeline_chart_panel;
		var colorMap = null;
		var url = null;
		var html = "";
		for(var i = 0; i < colorMaps.length; ++i){
			colorMap = colorMaps[i];
			url = colorMap.url;
			html += "<li cid='" + colorMap.id + "'>"
				+ 	"	<div class='color-ramp-item' style='background-image:"
				+ 	"	url(" + url + ")'>"
				+ 	"	</div>"
				+	"</li>"
		}
		that.panel.find(".color-ramp-div ul").html(html);

		colorMap = colorMaps[0];
		if(colorMap != null){
			url = colorMap.url;
			var id = colorMap.id;
			var htmlSel = "<li cid='" + id + "'>"
				+ 	"	<div class='color-ramp-item' style='background-image:"
				+ 	"	url(" + url + ")'>"
				+ 	"	</div>"
				+	"</li>";
			that.panel.find(".select-color-ramp").html(htmlSel);
		}

		that.panel.find(".color-ramp-div ul li").click(function(){
			var id = $(this).attr("cid");
			that.panel.find(".select-color-ramp li").attr("cid",id);
			var backgroundUrl = $(this).find(".color-ramp-item").css("background-image");
			that.panel.find(".select-color-ramp li .color-ramp-item").css("background-image",backgroundUrl);
		});
	},			

	registerEvent : function(){
		var that = this;

		// 选择起始时间
		this.panel.find(".start_form_datetime").datetimepicker({
	        format: "yyyy-mm-dd",
	        autoclose : true,
	        minView : 'month',
	        maxView : "year",
	        language : "zh-CN"
	        // startDate: "2014-06-20"
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
	    	var endTime = new Date(year + "-" + (month+1) + "-" + (day+1) + " 00:00:00");
	    	var div = that.panel.find(".aqi-start-time-points");
	    	that.displayTimeList(startTime,endTime,div);
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
	    	var date = ev.date;
	    	if(date == null){
	    		// 清空
	    		return;
	    	}
	    	var year = date.getUTCFullYear();
	    	var month = date.getUTCMonth();
	    	var day = date.getUTCDate();
	    	var startTime = new Date(year + "-" + (month+1) + "-" + day + " 00:00:00");
	    	var endTime = new Date(year + "-" + (month+1) + "-" + (day+1) + " 00:00:00");
	    	var div = that.panel.find(".aqi-end-time-points");
	    	that.displayTimeList(startTime,endTime,div);
	    });	

	    // 增加
	    this.panel.find(".btn-add-chart").click(function(){
	    	if(that.chartLayer == null){
	    		that.addChart();
	    	}else{
	    		that.changeChartOption();
	    	}
	    	MapCloud.refresh_panel.refreshPanel();
	    });

	    //关闭
		this.panel.find(".btn-cancel").click(function(){
			that.hidePanel();
		});


		// 双击变悬浮框
		this.panel.find(".panel-header").dblclick(function(){
			that.panel.css("display","none");
			MapCloud.tools.showToolBox("aqiTimeline");
		});

	},

	displayTimeList : function(startTime,endTime,div){
		if(startTime == null || endTime == null || div == null){
			return;
		}
		var html = "";
		var startTimeStr = startTime.getUTCFullYear() + "-" + (startTime.getUTCMonth()+1)
			+ "-" + startTime.getDate() + " 00:00:00";
		var endTimeStr = endTime.getUTCFullYear() + "-" + (endTime.getUTCMonth()+1)
			+ "-" + endTime.getDate() + " 00:00:00"
		var timeList = new GeoBeans.AQITimePointList("tmp",this.dbName,
			this.timeTableName,this.timeTableTimeField,startTimeStr,endTimeStr);
		timeList.setMap(mapObj);
		var list = timeList.getTimeList();
		if(list == null){
			return;
		}
		for(var i = 0; i < list.length; ++i){
			html += "<option value='" + list[i] + "'>" + list[i] + "</option>";
		}
		div.html(html);
	},

	addChart : function(){
		var name = this.panel.find(".chart-table-name").val();
    	if(name == null || name == ""){
    		MapCloud.notify.showInfo("请输入名称","Warning");
    		this.panel.find(".chart-table-name").focus();
    		return;
    	}

    	var startTimePoint = this.panel.find(".aqi-start-time-points").val();
    	if(startTimePoint == null){
    		MapCloud.notify.showInfo("请选择一个时刻","Warning");
    		return;
    	} 

    	var endTimePoint = this.panel.find(".aqi-end-time-points").val();
    	if(endTimePoint == null){
    		MapCloud.notify.showInfo("请选择一个时刻","Warning");
    		return;
    	}  
    	if(startTimePoint == endTimePoint){
    		MapCloud.notify.showInfo("请至少选择两个时刻","Warning");
    		return;
    	}
    	var chartField = this.panel.find(".aqi-index").val();

    	var colorMapID = this.panel.find(".select-color-ramp li").attr("cid");
    	var option = {
    		colorMapID : colorMapID
    	};

    	var timeList = new GeoBeans.AQITimePointList("tmp",this.dbName,
			this.timeTableName,this.timeTableTimeField,startTimePoint,endTimePoint);
    	timeList.setMap(mapObj);
		var list = timeList.getTimeList();
		if(list.length == 0){
			MapCloud.notify.showInfo("请选择一个有效的时间段","Warning");
    		return;
		}
		if(list.length > 20){
			MapCloud.notify.showInfo("请选择少于20个时间点的时间段","Warning");
			return;
		}

    	var colorMapID = this.panel.find(".select-color-ramp li").attr("cid");
    	var option = {
    		colorMapID : colorMapID
    	};


    	var interval = this.panel.find(".chart-interval").val();
    	interval = parseInt(interval);
    	if(!($.isNumeric(interval) && interval > 0)){
			MapCloud.notify.showInfo("请设置一个有效的时间间隔","Warning");
			return;
		}

    	var layer = new GeoBeans.Layer.AQITimelineLayer(name,this.dbName,
    		this.tableName,chartField,this.labelField,this.flagField,
    		this.timeField,list,interval,option);

    	mapObj.addLayer(layer,this.addLayer_callback);
	},

	addLayer_callback : function(result){
		var panel = MapCloud.aqi_timeline_chart_panel;
		if(result == "success"){
			mapObj.draw();
			var layerName = panel.panel.find(".chart-table-name").val();
			var layer = mapObj.getLayer(layerName);
			if(layer != null){
				panel.chartLayer = layer;
			}
		}else{
			MapCloud.notify.showInfo(result,"Error");
		}
	},

	changeChartOption : function(){
		var name = this.panel.find(".chart-table-name").val();
		this.chartLayer.setName(name);

		// 时间段
		var startTimePoint = this.panel.find(".aqi-start-time-points").val();
    	if(startTimePoint == null){
    		MapCloud.notify.showInfo("请选择一个时刻","Warning");
    		return;
    	} 
		var endTimePoint = this.panel.find(".aqi-end-time-points").val();
    	if(endTimePoint == null){
    		MapCloud.notify.showInfo("请选择一个时刻","Warning");
    		return;
    	}  

    	if(startTimePoint == endTimePoint){
    		MapCloud.notify.showInfo("请至少选择两个时刻","Warning");
    		return;
    	}

    	var timePoints = this.chartLayer.getTimePoints();
    	if(timePoints != null && timePoints.length >= 2){
    		var count = timePoints.length;
    		var start = timePoints[0];
    		var end = timePoints[count - 1];
    		if(start != startTimePoint || end != endTimePoint){
     			// 计算出时间段
				var timeList = new GeoBeans.AQITimePointList("tmp",this.dbName,
					this.timeTableName,this.timeTableTimeField,startTimePoint,endTimePoint);
		    	timeList.setMap(mapObj);
				var list = timeList.getTimeList();
				if(list.length == 0){
					MapCloud.notify.showInfo("请选择一个有效的时间段","Warning");
		    		return;
				}
				if(list.length > 20){
					MapCloud.notify.showInfo("请选择少于20个时间点的时间段","Warning");
					return;
				}
				this.chartLayer.setTimePoints(list);   			
    		}
    	}
		
		var interval = this.panel.find(".chart-interval").val();
		interval = parseInt(interval);
		if(!($.isNumeric(interval) && interval > 0)){
			MapCloud.notify.showInfo("请设置一个有效的时间间隔","Warning");
			return;
		}
		this.chartLayer.setInterval(interval);

		var colorMapID = this.panel.find(".select-color-ramp li").attr("cid");
    	if(this.chartLayer.getChartOption().colorMapID != colorMapID){
    		var option = {
	    		colorMapID : colorMapID
	    	};
	    	this.chartLayer.setChartOption(option);
    	}
    	

    	var chartField = this.panel.find(".aqi-index").val();
		if(this.chartLayer.getChartField() != chartField){
			this.chartLayer.setChartField(chartField);
		}
		

		mapObj.draw();
	},

	setChartLayer : function(chartLayer){
		this.chartLayer = chartLayer;
		if(this.chartLayer == null){
			return;
		}
		var name = this.chartLayer.name;
		this.panel.find(".chart-table-name").val(name);

			
		var chartOption = this.chartLayer.getChartOption();
		if(chartOption != null){
			var colorMapID = chartOption.colorMapID;
			if(colorMapID != null){
				colorMapID = parseInt(colorMapID);
				this.panel.find(".select-color-ramp li").attr("cid",colorMapID);
				var li = this.panel.find(".dropdown-menu li[cid='" + colorMapID +"']");
				var backgroundUrl = li.find(".color-ramp-item").css("background-image");
				this.panel.find(".select-color-ramp li .color-ramp-item").css("background-image",backgroundUrl);
			}
		}

		var chartField = this.chartLayer.getChartField();
		if(chartField != null){
			this.panel.find(".aqi-index option[value='" + chartField + "']")
			.attr("selected",true);
		}

		var timePoints = this.chartLayer.getTimePoints();
		if(timePoints != null && timePoints.length >= 2){
			var count = timePoints.length;
			var startTime = timePoints[0];
			var endTime = timePoints[count - 1];

			var dateStr_1 = startTime.slice(0,10);
			this.panel.find(".start_form_datetime input").val(dateStr_1);
			this.panel.find(".start_form_datetime").datetimepicker("update");
			var date_1 = new Date(dateStr_1);
			var year_1 = date_1.getUTCFullYear();
	    	var month_1 = date_1.getUTCMonth();
	    	var day_1 = date_1.getUTCDate();
	    	var startTime_1 = new Date(year_1 + "-" + (month_1+1) + "-" + day_1 + " 00:00:00");
	    	var endTime_1 = new Date(year_1 + "-" + (month_1+1) + "-" + (day_1+1) + " 00:00:00");
	    	var div_1 = this.panel.find(".aqi-start-time-points");
	    	this.displayTimeList(startTime_1,endTime_1,div_1);
	    	this.panel.find(".aqi-start-time-points option[value='" + startTime + "']")
	    		.attr("selected",true);


			var dateStr_2 = endTime.slice(0,10);
			this.panel.find(".end_form_datetime input").val(dateStr_2);
			this.panel.find(".end_form_datetime").datetimepicker("update");
			var date_2 = new Date(dateStr_1);
			var year_2 = date_2.getUTCFullYear();
	    	var month_2 = date_2.getUTCMonth();
	    	var day_2 = date_2.getUTCDate();
	    	var startTime_2 = new Date(year_2 + "-" + (month_2+1) + "-" + day_2 + " 00:00:00");
	    	var endTime_2 = new Date(year_2 + "-" + (month_2+1) + "-" + (day_2+1) + " 00:00:00");
	    	var div_2 = this.panel.find(".aqi-end-time-points");
	    	this.displayTimeList(startTime_2,endTime_2,div_2);
	    	this.panel.find(".aqi-end-time-points option[value='" + endTime + "']")
	    		.attr("selected",true);	    		
		}

		var interval = this.chartLayer.getInterval();
		this.panel.find(".chart-interval").val(interval);

	},
});