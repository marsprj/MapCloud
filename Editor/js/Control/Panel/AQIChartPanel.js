MapCloud.AQIChartPanel = MapCloud.Class(MapCloud.Panel,{
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

	// 选中的站点
	stationCode : null,	

	// 选中的站点名称
	positionName : null,

	// 图
	chartLayer 	: null,

	// 样式管理器
	styleMgr 	: null,

	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);

		this.registerEvent();
	},

	registerEvent : function(){
		var that = this;

		// 选择时间
		this.panel.find(".form_datetime").datetimepicker({
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
	    	// var year = date.getUTCFullYear();
	    	// var month = date.getUTCMonth();
	    	// var day = date.getUTCDate();
	    	// var startTime = new Date(year + "-" + (month+1) + "-" + day + " 00:00:00");
	    	// var endTime = new Date(year + "-" + (month+1) + "-" + (day+1) + " 00:00:00");
	    	// that.displayTimeList(startTime,endTime);

	    	var startTime = new Date(date);
	    	var endTime = new Date(date);
	    	var day = date.getDate();
	    	endTime.setDate(day + 1);
	    	startTime.setHours(0);
	    	startTime.setMinutes(0);
	    	startTime.setSeconds(0);
	    	endTime.setHours(0);
	    	endTime.setMinutes(0);
	    	endTime.setSeconds(0);

	    	that.displayTimeList(startTime,endTime);

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
			MapCloud.tools.showToolBox("aqiChart");
		});

	},

	showPanel : function(){
		if(this.panel.css("display") == "none"){
			this.cleanup();
			this.panel.css("display","block");

			var colors = styleManager.getColorMaps();
			this.getColorMaps_callback(colors);
		}
	},

	hidePanel : function(){
		MapCloud.Panel.prototype.hidePanel.apply(this,arguments);
		MapCloud.refresh_panel.refreshPanel();
	},

	cleanup : function(){
		this.chartLayer = null;
		this.panel.find(".chart-table-name").val("空气质量指数专题图");
		this.panel.find(".aqi-time-points").empty();
		this.panel.find(".aqi-index option[value='aqi']").attr("selected",true);
		this.panel.find(".form_datetime input").val("");
	},

	// 色阶地图 
	getColorMaps_callback : function(colorMaps){
		if(colorMaps == null){
			return;
		}
		
		var that = MapCloud.aqi_chart_panel;
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

	// 展示一个时间段的所有时刻
	displayTimeList : function(startTime,endTime){
		if(startTime == null || endTime == null){
			return;
		}
		var html = "";

		var startTimeStr = MapCloud.aqi_24h_dialog.toTimeFormat(startTime);
		var endTimeStr = MapCloud.aqi_24h_dialog.toTimeFormat(endTime);
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
		this.panel.find(".aqi-time-points").html(html);
	},

	addChart : function(){
		var name = this.panel.find(".chart-table-name").val();
    	if(name == null || name == ""){
    		MapCloud.notify.showInfo("请输入名称","Warning");
    		return;
    	}
    	var timePoint = this.panel.find(".aqi-time-points").val();
    	if(timePoint == null){
    		MapCloud.notify.showInfo("请选择一个时刻","Warning");
    		return;
    	}
    	var chartField = this.panel.find(".aqi-index").val();

    	var colorMapID = this.panel.find(".select-color-ramp li").attr("cid");
    	var option = {
    		colorMapID : colorMapID
    	};

    	var  layer = new GeoBeans.Layer.AQIChartLayer(name,this.dbName,
    		this.tableName,chartField,this.labelField,this.flagField,
    		this.timeField,timePoint,option);
    	mapObj.addLayer(layer,this.addLayer_callback);
	},

	addLayer_callback : function(result){
		var panel = MapCloud.aqi_chart_panel;
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

	// 修改了参数
	changeChartOption : function(){
		if(this.chartLayer == null){
			return;
		}
		var name = this.panel.find(".chart-table-name").val();
		this.chartLayer.setName(name);

		var colorMapID = this.panel.find(".select-color-ramp li").attr("cid");
		var chartOption = {
			colorMapID  : colorMapID
		};

		var chartField = this.panel.find(".aqi-index").val();
		this.chartLayer.setChartField(chartField);

		var timePoint = this.panel.find(".aqi-time-points").val();
		if(timePoint == null){
			MapCloud.notify.showInfo("请选择一个时刻","Warning");
			return;
		}
		this.chartLayer.setTimePoint(timePoint);

		this.chartLayer.setChartOption(chartOption);
		mapObj.draw();
	},

	setChartLayer : function(chartLayer){
		this.chartLayer = chartLayer;
		if(this.chartLayer == null){
			return;
		}
		var name = this.chartLayer.name;
		this.panel.find(".chart-table-name").val(name);

		// timePoint 设置
		var timePoint = this.chartLayer.getTimePoint();
		if(timePoint != null){
			var dateStr = timePoint.slice(0,10);
			this.panel.find(".form_datetime input").val(dateStr);
			this.panel.find(".form_datetime").datetimepicker("update");
			var date = new Date(dateStr);
			var day = date.getDate();
			var startTime = new Date(date);
			var endTime = new Date(date);
			startTime.setHours(0);
	    	startTime.setMinutes(0);
	    	startTime.setSeconds(0);
	    	endTime.setHours(0);
	    	endTime.setMinutes(0);
	    	endTime.setSeconds(0);
	    	endTime.setDate(day + 1);
			// var year = date.getUTCFullYear();
	  //   	var month = date.getUTCMonth();
	  //   	var day = date.getUTCDate();
	  //   	var startTime = new Date(year + "-" + (month+1) + "-" + day + " 00:00:00");
	  //   	var endTime = new Date(year + "-" + (month+1) + "-" + (day+1) + " 00:00:00");
	    	this.displayTimeList(startTime,endTime);
	    	this.panel.find(".aqi-time-points option[value='" + timePoint + "']")
	    		.attr("selected",true);
		}

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



	}
});