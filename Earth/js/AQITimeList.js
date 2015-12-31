MapCloud.AQITimeList = MapCloud.Class({
	
	server : null,

	sourceName : "base",

	layerName : "gc_aqi_uptime",

	timeField : "uptime",

	featureType : null,

	// 回调函数
	callback : null,

	initialize : function(server){
		this.server = server;

		var workspace = new GeoBeans.WFSWorkspace("tmp",this.server,"1.0.0");
		this.featureType = new GeoBeans.FeatureType(workspace, this.layerName);
	},

	// 往前推一天
	get24hTimeList : function(timepoint,callback){
		if(timepoint == null){
			if(callback != null){
				callback("timepoint is null");
			}
			return;
		}
		this.callback  = callback;

		var startTime = MapCloud.dateAdd(timepoint,"day",-1);
		var startTimeStr = MapCloud.dateFormat(startTime,"yyyy-MM-dd hh:mm:ss");

		var filter = new GeoBeans.BinaryLogicFilter();
		filter.operator = GeoBeans.LogicFilter.OperatorType.LogicOprAnd;

		var startTimeFilter =  new GeoBeans.BinaryComparisionFilter();
		startTimeFilter.operator = GeoBeans.ComparisionFilter.OperatorType.ComOprGreaterThanOrEqual;
		prop = new GeoBeans.PropertyName();
		prop.setName(this.timeField);
		literal = new GeoBeans.Literal();
		literal.setValue(startTimeStr);
		startTimeFilter.expression1 = prop;
		startTimeFilter.expression2 = literal;

		var endTimeFilter =  new GeoBeans.BinaryComparisionFilter();
		endTimeFilter.operator = GeoBeans.ComparisionFilter.OperatorType.ComOprLessThan;
		prop = new GeoBeans.PropertyName();
		prop.setName(this.timeField);
		literal = new GeoBeans.Literal();
		literal.setValue(timepoint);
		endTimeFilter.expression1 = prop;
		endTimeFilter.expression2 = literal;

		filter.addFilter(startTimeFilter);
		filter.addFilter(endTimeFilter);

		this.featureType.getFields(null,this.sourceName);

		var fields = [this.timeField];
		this.featureType.getFeaturesFilterAsync2(null,this.sourceName,filter,24,0,fields,null,
			this,this.getTimeList_callback);
	},

	getTimeList_callback : function(timelistObj,features){
		if(timelistObj == null || features == null || !$.isArray(features)){
			return;
		}
		timelistObj.getTimeList(features);
	},

	// 获取时间列表
	getTimeList : function(features){
		if(features == null){
			return;
		}
		var f = null,values = null,time = null;
		var timepoints = [];
		var timeFiledIndex = this.featureType.getFieldIndex(this.timeField);
		for(var i = 0; i < features.length; ++i){
			f = features[i];
			if(f == null){
				continue;
			}
			values = f.values;
			if(values == null){
				continue;
			}
			time = values[timeFiledIndex];
			if(time == null){
				continue;
			}
			timepoints.push(time);
		}
		if(this.callback != null){
			this.callback(timepoints);
			this.callback = null;
		}
	},

	getDayHourTimeList : function(startTime,endTime,callback){
		if(startTime == null || endTime == null){
			return;
		}

		// if(startDay >= endDay){
		// 	return;
		// }
		this.callback = callback;
		var filter = new GeoBeans.BinaryLogicFilter();
		filter.operator = GeoBeans.LogicFilter.OperatorType.LogicOprOr;
		
		var startTimeFilter =  new GeoBeans.BinaryComparisionFilter();
		startTimeFilter.operator = GeoBeans.ComparisionFilter.OperatorType.ComOprEqual;
		prop = new GeoBeans.PropertyName();
		prop.setName(this.timeField);
		literal = new GeoBeans.Literal();
		literal.setValue(startTime);
		startTimeFilter.expression1 = prop;
		startTimeFilter.expression2 = literal;
		filter.addFilter(startTimeFilter);

		var nextTime = MapCloud.dateAdd(startTime,"day",1);
		var nextTimeStr = MapCloud.dateFormat(nextTime,"yyyy-MM-dd hh:mm:ss");
		while(nextTimeStr != endTime){
			var nextTimeFilter =  new GeoBeans.BinaryComparisionFilter();
			nextTimeFilter.operator = GeoBeans.ComparisionFilter.OperatorType.ComOprEqual;
			prop = new GeoBeans.PropertyName();
			prop.setName(this.timeField);
			literal = new GeoBeans.Literal();
			literal.setValue(nextTimeStr);
			nextTimeFilter.expression1 = prop;
			nextTimeFilter.expression2 = literal;
			filter.addFilter(nextTimeFilter);

			nextTime = MapCloud.dateAdd(nextTime,"day",1);
			nextTimeStr = MapCloud.dateFormat(nextTime,"yyyy-MM-dd hh:mm:ss");
		}
		var endTimeFilter =  new GeoBeans.BinaryComparisionFilter();
		endTimeFilter.operator = GeoBeans.ComparisionFilter.OperatorType.ComOprEqual;
		prop = new GeoBeans.PropertyName();
		prop.setName(this.timeField);
		literal = new GeoBeans.Literal();
		literal.setValue(endTime);
		endTimeFilter.expression1 = prop;
		endTimeFilter.expression2 = literal;
		filter.addFilter(endTimeFilter);


		this.featureType.getFields(null,this.sourceName);

		var fields = [this.timeField];
		this.featureType.getFeaturesFilterAsync2(null,this.sourceName,filter,24,0,fields,null,
			this,this.getTimeList_callback);
	},
});