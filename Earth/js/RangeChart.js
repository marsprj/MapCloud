MapCloud.RangeChart = MapCloud.Class({

	server : null,

	// 底图数据库
	baseSourceName : null,

	// 底图图层
	baseLayer : null,

	// 底图匹配字段
	baseLayerPostionField : null,

	baseLayerFeatureType : null,

	// 数据数据库
	chartSourceName : null,

	// 数据图层
	chartLayer : null,

	// 数据匹配字段
	chartLayerPositionField : null,

	// 展示字段
	chartLayerChartField : null,

	chartLayerFeatureType : null,

	// 色阶ID
	colorMapID : null,

	initialize : function(server,baseLayerOption,chartLayerOption,colorMapID){
		var workspace = null;
		if(server != null){
			this.server = server;
			workspace = new GeoBeans.WFSWorkspace("tmp",this.server,"1.0.0");
		}
		

		if(baseLayerOption!= null){
			this.baseSourceName = baseLayerOption.sourceName;
			this.baseLayer = baseLayerOption.layerName;
			this.baseLayerPostionField = baseLayerOption.positionField;
			if(workspace != null && this.baseLayer != null){
				this.baseLayerFeatureType = new GeoBeans.FeatureType(workspace,this.baseLayer);
			}
			
		}
		if(chartLayerOption != null){
			this.chartSourceName = chartLayerOption.sourceName;
			this.chartLayer = chartLayerOption.layerName;
			this.chartLayerPositionField = chartLayerOption.positionField;
			this.chartLayerChartField = chartLayerOption.chartField;
			if(workspace != null && this.chartLayer != null){
				this.chartLayerFeatureType = new GeoBeans.FeatureType(workspace,this.chartLayer);
			}
		}

		this.colorMapID = colorMapID;
	},

	show : function(){
		if(this.baseLayerFeatureType == null || this.chartLayerFeatureType == null){
			return;
		}
		this.getFeatures();
	},

	getFeatures : function(){
		// 获取chart元素，数据量相对小
		var chartFields = this.chartLayerFeatureType.getFields(null,this.chartSourceName);

		var chartFeatures = this.chartLayerFeatureType.getFeaturesFilter(null,
			this.chartSourceName,null,null,null,[this.chartLayerPositionField].concat(this.chartLayerChartField));

		this.chartFeatures = chartFeatures;

		// 计算底图数据
		var baseFields = this.baseLayerFeatureType.getFields(null,this.baseSourceName);
		var fields = [this.baseLayerFeatureType.geomFieldName,this.baseLayerPostionField];

		this.baseLayerFeatureType.getFeaturesFilterAsync2(null,this.baseSourceName,null,null,
			null,fields,null,this,this.getBaseLayerFeatures_callback);


	},

	getBaseLayerFeatures_callback : function(chart,features){
		if(chart == null || features == null){
			return;
		}
		chart.setBaseLayerFeatures(features);
	},

	// 设置底图
	setBaseLayerFeatures : function(features){
		// alert(features.length);
		if(features == null){
			return;
		}
		this.baseFeatures = features;

		var baseLayerPostionFieldIndex = this.baseLayerFeatureType.getFieldIndex(this.baseLayerPostionField);
		

		var chartLayerPositionFieldIndex = this.chartLayerFeatureType.getFieldIndex(this.chartLayerPositionField);

		var chartLayerChartFieldIndex = this.chartLayerFeatureType.getFieldIndex(this.chartLayerChartField);

		if(baseLayerPostionFieldIndex == -1 || chartLayerPositionFieldIndex == -1 
			|| chartLayerChartFieldIndex == -1){
			return;
		}

		// 从底图开始匹配
		var feature = null;
		var values = null;
		var chartFeature = null, chartValues = null;
		for(var i = 0; i < features.length; ++i){
			feature = features[i];
			if(feature == null){
				continue;
			}
			values = feature.values;
			if(values == null){
				continue;
			}
			var baseLayerPosition = values[baseLayerPostionFieldIndex];
			for(var j = 0; j < this.chartFeatures.length; ++j){
				chartFeature = this.chartFeatures[j];
				if(chartFeature == null){
					continue;
				}
				chartValues = chartFeature.values;
				if(chartValues == null){
					continue;
				}
				var chartLayerPosition = chartValues[chartLayerPositionFieldIndex];
				if(baseLayerPosition == chartLayerPosition){
					// 如果位置一致
					var chartValue = chartValues[chartLayerChartFieldIndex];
					feature.chartValue = chartValue;
				}

			}
		}

		// 按照样式进行绘制
		this.drawBaseLayerFeatures();
	},

	// 绘制底图
	drawBaseLayerFeatures : function(){
		if(this.baseFeatures == null){
			return;
		}

		var colorRangeMap = this.getColorRangeMap();
		var geomField = this.baseLayerFeatureType.geomFieldName;
		var geomFieldIndex = this.baseLayerFeatureType.getFieldIndex(geomField);

		var feature = null,values = null,geometry  = null;
		var polygons = [];
		for(var i = 0; i < this.baseFeatures.length; ++i){
			feature = this.baseFeatures[i];
			if(feature == null){
				return;
			}
			values = feature.values;
			if(values == null){
				return;
			}
			geometry = values[geomFieldIndex];
			chartValue = feature.chartValue;
			var color = colorRangeMap.getValue(chartValue);
			color = Cesium.Color.fromCssColorString(color.getHex());
			chartValue = parseFloat(chartValue) * 100;
			console.log(values[1] + "," + chartValue  + "," + color);
            if(!$.isNumeric(chartValue)){
            	chartValue = 0;
            }

			var points = geometry.toPointsArray();
			var polgyon = Radi.Earth.addPolygon(points,color,chartValue,false);
			// Radi.Earth.addPolygon(points,null,60000);
			polygons.push(polgyon);
		}
		Radi.Earth.zoom(polygons);
	},


	getColorRangeMap : function(){
		if(this.colorMapID == null){
			this.colorMapID = 1;
		}
		var minMaxValue = this.getMinMaxValue();
		var uerServer = this.server.slice(0,this.server.lastIndexOf("/mgr"));;
		var styleMgr = new GeoBeans.StyleManager(uerServer);
		var colorMap = styleMgr.getColorMapByID(this.colorMapID);

		var colorRangeMap = new GeoBeans.ColorRangeMap(colorMap.startColor,
			colorMap.endColor,minMaxValue.min,minMaxValue.max);
		return colorRangeMap;
	},


	// 获得最大最小值
	getMinMaxValue : function(){
		if(this.baseFeatures == null){
			return null;
		}
		var feature = null;
		var chartValue = null;
		var min = null, max = null;
		for(var i = 0; i < this.baseFeatures.length; ++i){
			feature = this.baseFeatures[i];
			if(feature == null){
				continue;
			}
			chartValue = feature.chartValue;
			chartValue = parseFloat(chartValue);
			if(min == null){
				min = chartValue;
			}else{
				min = (chartValue < min ) ? chartValue : min; 
			}
			if(max == null){
				max = chartValue;
			}else{
				max = (chartValue > max) ? chartValue : max;
			}			
		}
		return{
			min : min,
			max : max
		};
	},

});