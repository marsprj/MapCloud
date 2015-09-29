MapCloud.AQI24hDialog = MapCloud.Class(MapCloud.Dialog,{
	// 数据库
	dbName : null,

	tableName : null,

	// 时间字段
	timeField : null,

	// 基础时间
	timePoint : null,

	chartField : null,

	// 站点字段
	stationCodeField : null,

	// 站点编号
	stationCode : null,

	// 站点名称
	positionName : null,

	container : null,

	chart : null,

	// 复选框
	indexSelect : null,


	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		this.container = this.panel.find("#aqi_24_div");
		this.chartFields = [];

		var that = this;

		// // 初始化复选框
		// this.indexSelect = this.panel.find('#aqi_24_index_select');
		// this.indexSelect.multiselect({
		// 	 buttonWidth: '40px',
		// 	 onChange : function(element,checked){
		// 	 	var chartFields = that.indexSelect.val();
		// 		that.chartFields = chartFields;
		// 		if(that.chart != null){
		// 			that.chart.setChartFields(chartFields);
		// 			that.chart.show();
		// 		}
		// 	 }
		// });

	},

	cleanup : function(){
		if(this.chart != null){
			this.chart.cleanup();
			this.chart = null;
		}
		this.chartFields = [];
		this.panel.find(".aqi-index-div").empty();
		var html = '<select id="aqi_24_index_select" multiple="multiple" style="width:100%">'
	        	+ '		<option value="aqi">空气质量指数</option>'
				+ '		<option value="pm10">颗粒物（粒径小于等于10μm）1小时平均</option>'
				+ '		<option value="pm10_24h">颗粒物（粒径小于等于10μm）24小时滑动平均</option>'
				+ '		<option value="pm2_5">颗粒物（粒径小于等于2.5μm）1小时平均</option>'
				+ '		<option value="pm2_5_24h">颗粒物（粒径小于等于2.5μm）24小时滑动平均</option>'
				+ '		<option value="no2">二氧化氮1小时平均</option>'
				+ '		<option value="no2_24h">二氧化氮24小时滑动平均</option>'
				+ '		<option value="o3">臭氧1小时平均</option>'
				+ '		<option value="o3_24h">臭氧日最大1小时平均</option>'
				+ '		<option value="o3_8h">臭氧8小时滑动平均</option>'
				+ '		<option value="o3_8h_24h">臭氧日最大8小时滑动平均</option>'
				+ '		<option value="so2">二氧化硫1小时平均</option>'
				+ '		<option value="so2_24h">二氧化硫24小时滑动平均</option>'
				+ '		<option value="co">一氧化碳1小时平均</option>'
				+ '		<option value="co_24h">一氧化碳24小时滑动平均</option>'
	    		+ '	</select>';
		this.panel.find(".aqi-index-div").html(html);

		var that = this;
		this.indexSelect = this.panel.find('#aqi_24_index_select');
		this.indexSelect.multiselect({
			 buttonWidth: '30px',
			 onChange : function(element,checked){
			 	var chartFields = that.indexSelect.val();
			 	if(chartFields == null){
			 		MapCloud.notify.showInfo("请选择一个展示的质量指数","Warning");
			 		return;
			 	}
				that.chartFields = chartFields;
				if(that.chart != null){
					that.chart.setChartFields(chartFields);
					that.chart.show();
				}
			 }
		});

		$("#aqi_24_index_select").multiselect();
		
		// $("#aqi_24_index_select").multiselect('deselectAll', true);
		// $("#aqi_24_index_select").multiselect('updateButtonText',true);
	},


	setTimeField : function(timeField){
		this.timeField = timeField;
	},

	setTimePoint : function(timePoint){
		this.timePoint = timePoint;
	},

	setStationCode : function(stationCode){
		this.stationCode = stationCode;
	},

	setStationCodeField :function(stationCodeField){
		this.stationCodeField = stationCodeField;
	},

	setDbName : function(dbName){
		this.dbName = dbName;
	},

	setTableName : function(tableName){
		this.tableName = tableName;
	},

	// 设置字段
	setChartField : function(chartField){
		// this.chartFields = [];
		this.chartFields.push(chartField);
		this.indexSelect.multiselect('select',[chartField]);
	},

	setPositionName : function(positionName){
		this.positionName = positionName;
	},

	showAQIIndexChart : function(){
		if(this.container == null || this.dbName == null || this.tableName == null
			|| this.chartFields == null || this.stationCode == null 
			|| this.stationCodeField == null || this.timeField == null){
			return;
		}
		var timeList = this.getTimeList(this.timePoint);
		if(timeList == null){
			return;
		}

		var name = this.positionName + "24小时空气质量变化情况";
		this.panel.find(".modal-title").html(name);
		var chart = new GeoBeans.AQIIndexChart(name,this.container[0],
			this.dbName,this.tableName,this.chartFields,this.stationCodeField,
			this.stationCode,this.timeField,timeList[0],timeList[1]);
		chart.setMap(mapObj);
		chart.show();
		this.chart = chart;
	},

	// 计算24小时
	getTimeList : function(timePoint){
		if(timePoint == null){
			return null;
		}
		var startTime = new Date(timePoint);
		var endTime = new Date(timePoint);
		var date = new Date(timePoint); 
		var hour = date.getHours();
		startTime.setHours(hour - 12);
		endTime.setHours(hour + 12);

		var startTimeStr = this.toTimeFormat(startTime);
		var endTimeStr = this.toTimeFormat(endTime);
		return [startTimeStr,endTimeStr];
	},


	toTimeFormat : function(date){
		if(date == null){
			return null;
		}
		var yyyy = date.getFullYear().toString();
		var MM = (date.getMonth() + 1).toString();;
		var dd = date.getDate().toString();
		var hh = date.getHours().toString();
		var mm = date.getMinutes().toString();
   		var ss = date.getSeconds().toString();
   		 return yyyy + '-' + (MM[1]?MM:"0"+MM[0]) 
   		 + '-' + (dd[1]?dd:"0"+dd[0]) + ' ' + (hh[1]?hh:"0"+hh[0]) 
   		 + ':' + (mm[1]?mm:"0"+mm[0]) + ':' + (ss[1]?ss:"0"+ss[0]);
	}
});