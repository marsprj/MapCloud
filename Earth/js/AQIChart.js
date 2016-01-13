MapCloud.AQIChart = MapCloud.Class({

	server : null,
	// 数据库
	sourceName : "base",

	layerName : "gc_aqi_ranking",

	// 时间点
	timepoint : null,

	chartField : null,

	areaField : "area",

	xField : "x",

	yField : "y",

	timepointField : "time_point",


	featureType : null,

	features : null,


	initialize : function(server,chartField,timepoint){
		this.server = server;
		this.chartField = chartField;
		this.timepoint = timepoint;

		var workspace = new GeoBeans.WFSWorkspace("tmp",this.server,"1.0.0");
		this.featureType = new GeoBeans.FeatureType(workspace, this.layerName);
	},


	show : function(){
		
		if(this.features != null){
			Radi.Earth.cleanup();
			this.showAQIChart(this.features);
			return;
		}


		var timeFilter = new GeoBeans.BinaryComparisionFilter();
		timeFilter.operator = GeoBeans.ComparisionFilter.OperatorType.ComOprEqual;
		var prop = new GeoBeans.PropertyName();
		prop.setName(this.timepointField);
		var literal = new GeoBeans.Literal();
		literal.setValue(this.timepoint);
		timeFilter.expression1 = prop;
		timeFilter.expression2 = literal;

		// var fields = [this.chartField,this.areaField,this.xField,this.yField];
		var fields = [this.chartField,this.xField,this.yField];


		this.featureType.getFeaturesFilterAsync2(null,this.sourceName,timeFilter,
				400,0,fields,null,this,this.getAQIFeatures_callback);
	},


	getAQIFeatures_callback : function(chart,features){
		if(chart == null || features == null || !$.isArray(features)){
			return;
		}
		chart.features = features;
		Radi.Earth.cleanup();
		chart.showAQIChart(features);
	},

	showAQIChart : function(features){
		if(features == null){
			return;
		}
		var feature = null, values = null;
		var areaFieldIndex = this.featureType.getFieldIndex(this.areaField);
		var chartFieldIndex = this.featureType.getFieldIndex(this.chartField);
		var xFieldIndex = this.featureType.getFieldIndex(this.xField);
		var yFieldIndex = this.featureType.getFieldIndex(this.yField);
		var area = null, chartValue = null, x = null, y = null;
		var aqi3D = null, aqi3DList = [];
		for(var i = 0; i < features.length; ++i){
			feature = features[i];
			if(feature == null){
				continue;
			}
			values = feature.values;
			if(values == null){
				continue;
			}
			// area = values[areaFieldIndex];
			chartValue = values[chartFieldIndex];
			x = values[xFieldIndex];
			x = parseFloat(x);
			y = values[yFieldIndex];
			y = parseFloat(y);

			var color = MapCloud.getAQILevelColor(chartValue);
			var z = parseInt(chartValue) *1000;
			// var z = parseInt(chartValue)*100;
			if(x != 0 && y != 0 && z != 0){
				aqi3D = Radi.Earth.addCylinder(x,y,z,12000,color);
				// aqi3D = Radi.Earth.addCylinder(x,y,1000,z,color);
				var labelText = chartValue;
				// Radi.Earth.addLabel(x,y,z/2+3000, labelText);
				aqi3DList.push(aqi3D);	
			}
					
		}
	},

	cleanup : function(){
		this.features = null;
	}
});