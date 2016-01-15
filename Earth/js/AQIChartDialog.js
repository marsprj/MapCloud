MapCloud.AQIChartDialog = MapCloud.Class(MapCloud.Dialog,{

	userName : "user1",		

	// server : null,

	// 站点编码
	// stationCode : null,

	// 时间参数，按照当前时刻进行类推
	time : null,
	// startTime : null,

	// endTime : null,

	container : null,


	timeField : "time_point",
	aqiField : "aqi",
	stationCodeField : "station_code",

	aqiStatLayer : "gc_aqi",
	sourceName : "base",

	chart : null,

	features : null,

	featureType : null,


	initialize : function(id,container){
		MapCloud.Dialog.prototype.initialize.apply(this,arguments);

		this.container = this.panel.find("#" + container)[0];
		this.registerPanelEvent();
	},

	registerPanelEvent : function(){
		var dialog = this;
		dialog.panel.find(".btn-group .btn").click(function(){
			if(dialog.chart != null){
				dialog.chart.clear();
			}
			dialog.panel.find("#aqi_chart_container").addClass("loading");
			dialog.panel.find(".btn-group .btn").attr("disabled",false);
			if($(this).hasClass("aqi-24h")){
				dialog.showAQI24hFeatures();
			}else if($(this).hasClass("aqi-7d")){
				dialog.showAQI7dFeatures();
			}else if($(this).hasClass("aqi-30d")){
				dialog.showAQI30dFeatures();
			}
			$(this).attr("disabled",true);
		});
	},

	showDialog : function(time,featureType,name,postionFilter){
		MapCloud.Dialog.prototype.showDialog.apply(this,arguments);
		this.featureType = featureType;
		this.time = time;
		this.panel.find(".modal-title").html("[ " + name + " ]" + " 空气质量指数变化曲线图");
		this.postionFilter = postionFilter;
		this.showAQI24hFeatures();
	},

	cleanup : function(){
		this.panel.find(".btn-group .btn").attr("disabled",false);
		this.panel.find(".aqi-24h").attr("disabled",true);
		if(this.chart != null){
			this.chart.clear();
		}
		this.panel.find(".modal-title").html("空气质量指数变化曲线图");
	},


	// 24小时变化
	showAQI24hFeatures : function(){

		var startTime = new Date(this.time);
		var endTime = MapCloud.dateAdd(startTime,"day", -1);
		var endTimeStr = MapCloud.dateFormat(endTime,"yyyy-MM-dd hh:mm:ss");

		// 时间filter
		var timeFilter = new GeoBeans.BinaryLogicFilter();
		timeFilter.operator = GeoBeans.LogicFilter.OperatorType.LogicOprAnd;;
		
		var startTimeFilter =  new GeoBeans.BinaryComparisionFilter();
		startTimeFilter.operator = GeoBeans.ComparisionFilter.OperatorType.ComOprGreaterThanOrEqual;
		prop = new GeoBeans.PropertyName();
		prop.setName(this.timeField);
		literal = new GeoBeans.Literal();
		literal.setValue(endTimeStr);
		startTimeFilter.expression1 = prop;
		startTimeFilter.expression2 = literal;

		var endTimeFilter =  new GeoBeans.BinaryComparisionFilter();
		endTimeFilter.operator = GeoBeans.ComparisionFilter.OperatorType.ComOprLessThanOrEqual;
		prop = new GeoBeans.PropertyName();
		prop.setName(this.timeField);
		literal = new GeoBeans.Literal();
		literal.setValue(this.time);
		endTimeFilter.expression1 = prop;
		endTimeFilter.expression2 = literal;

		timeFilter.addFilter(startTimeFilter);
		timeFilter.addFilter(endTimeFilter);

		this.getFeatures(timeFilter);
	},

	// 7天变化
	showAQI7dFeatures : function(){
		var time = null,timeStr = null;
		// 设置为零点
		var endTime = new Date(this.time);
		endTime.setHours(0);
		endTime.setMinutes(0);
		endTime.setSeconds(0);

		var filter = new GeoBeans.BinaryLogicFilter();
		filter.operator = GeoBeans.LogicFilter.OperatorType.LogicOprOr;

		var timeFilter = null;
		for(var i = 0; i < 7; ++i){
			time = MapCloud.dateAdd(endTime,"day", -i);
			timeStr = MapCloud.dateFormat(time,"yyyy-MM-dd hh:mm:ss");
			timeFilter = new GeoBeans.BinaryComparisionFilter();
			timeFilter.operator = GeoBeans.ComparisionFilter.OperatorType.ComOprEqual;
			var prop = new GeoBeans.PropertyName();
			prop.setName(this.timeField);
			var literal = new GeoBeans.Literal();
			literal.setValue(timeStr);
			timeFilter.expression1 = prop;
			timeFilter.expression2 = literal;
			filter.addFilter(timeFilter);			
		}

		this.getFeatures(filter);
	},

	// 30天变化
	showAQI30dFeatures : function(){
		var time = null,timeStr = null;
		// 设置为零点
		var endTime = new Date(this.time);
		endTime.setHours(0);
		endTime.setMinutes(0);
		endTime.setSeconds(0);

		var filter = new GeoBeans.BinaryLogicFilter();
		filter.operator = GeoBeans.LogicFilter.OperatorType.LogicOprOr;

		var timeFilter = null;
		for(var i = 0; i < 30; ++i){
			time = MapCloud.dateAdd(endTime,"day", -i);
			timeStr = MapCloud.dateFormat(time,"yyyy-MM-dd hh:mm:ss");
			timeFilter = new GeoBeans.BinaryComparisionFilter();
			timeFilter.operator = GeoBeans.ComparisionFilter.OperatorType.ComOprEqual;
			var prop = new GeoBeans.PropertyName();
			prop.setName(this.timeField);
			var literal = new GeoBeans.Literal();
			literal.setValue(timeStr);
			timeFilter.expression1 = prop;
			timeFilter.expression2 = literal;
			filter.addFilter(timeFilter);			
		}
		this.getFeatures(filter);
	},

	getFeatures : function(timeFilter){
		if(timeFilter == null || this.postionFilter == null){
			return;
		}

		var filter = new GeoBeans.BinaryLogicFilter();
		filter.operator = GeoBeans.LogicFilter.OperatorType.LogicOprAnd;


		filter.addFilter(this.postionFilter);
		filter.addFilter(timeFilter);

		var fields = [this.aqiField,this.timeField];

		var orderby = new GeoBeans.OrderBy();
		orderby.setOrder(GeoBeans.OrderBy.OrderType.OrderAsc);
		orderby.addField(this.timeField);

		this.featureType.getFeaturesFilterAsync(null,this.sourceName,filter,100,null,fields,
			orderby,this.getFeatures_callback);	
	},

	getFeatures_callback : function(features){
		if(!$.isArray(features)){
			return;
		}

		var dialog = MapCloud.aqiChartDialog;
		dialog.setFeatures(features);
	},

	setFeatures : function(features){
		this.panel.find("#aqi_chart_container").removeClass("loading");
		this.features = features;
		if(this.chart == null){
			var option = this.getOption();
			var chart = echarts.init(this.container,"macarons");
			this.chart = chart;		
			chart.setOption(option); 		
		}else{
			this.chart.clear();
			var option = this.getOption();
			this.chart.setOption(option);
		}
	},	

	// 获取chart的参数
	getOption : function(){
		if(this.features == null || this.featureType == null){
			return;
		}
		var feature = null,aqi = null,timePoint = null;
		var aqiFieldIndex = -1, timeFieldIndex = -1;
		var values = null;
		var timePoints = [], aqiValues = [];
		for(var i = 0; i < this.features.length; ++i){
			feature = this.features[i];
			if(feature == null){
				continue;
			}
			values = feature.values;
			if(values == null){
				continue;
			}
			aqiFieldIndex = this.featureType.getFieldIndex(this.aqiField);
			aqi = values[aqiFieldIndex];
			aqi = parseFloat(aqi);
			aqiValues.push(aqi);

			timeFieldIndex = this.featureType.getFieldIndex(this.timeField);
			timePoint = values[timeFieldIndex];
			timePoints.push(timePoint);
		}

		var serie ={
			name : "AQI",
			type : 'line',
			smooth:true,
			data : aqiValues
		};

		var option = {
			title :{
				// text : "aqi chart",
				// x : "center",
				// y : "top"
			},
			toolbox:{
				show : true,
				x : '640',
				y : 'top',
				feature : {
					dataView : {show: true, readOnly: true},
					magicType : {show: true, type: ['line', 'bar']},
					restore : {show: true},
					saveAsImage : {show: true}
				}
			},
			grid :{
				x : '40',
				y : '40',
				x2 : '40',
				y2 : '40'
			},
		    tooltip : {
		        trigger: 'axis'
		    },	
		    legend :{
		    	data : ["AQI"],
		    	// x : "184px",
		    	// y : "top"
		    },
		    calculable : true,
		    yAxis:[{
		    	type :'value',
            	// boundaryGap : [0, 0.01]	
		    }],
		    xAxis:[{
		    	type :'category',
		    	// type : 'time',
		    	data : timePoints
		    }],
		    series : [serie]
		};
		return option;		
	},


	// 日期相加
	dateAdd : function(date,interval,units){
		var ret = new Date(date); //don't change original date
		switch(interval.toLowerCase()) {
			case 'year'   :  ret.setFullYear(ret.getFullYear() + units);  break;
			case 'quarter':  ret.setMonth(ret.getMonth() + 3*units);  break;
			case 'month'  :  ret.setMonth(ret.getMonth() + units);  break;
			case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
			case 'day'    :  ret.setDate(ret.getDate() + units);  break;
			case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
			case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
			case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
			default       :  ret = undefined;  break;
		}
		return ret;
	},
});

