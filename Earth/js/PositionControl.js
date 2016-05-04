MapCloud.PositionControl = MapCloud.Class({
	// 距离限差
	tolerance : 0.03,

	// 高度限差
	heightTolerance : 150000,

	cityRegionLayer : "china_city_region",

	chinaLayer : "china_china",

	sourceName : "base",

	nameField : "aname",

	chinaNameField : "name_engli",

	//城市列表 
	featureType : null,

	// 中国范围
	chinaFeatureType : null,


	// 上一次的经纬度和高度
	lat : null,
	lon : null,
	height : null,

	// 这一次的位置
	position : null,

	initialize : function(){
		this.lat = null;
		this.lon = null;
		this.height = null;

		Radi.Earth.addClickListener(this.getPositionHandler);
		Radi.Earth.addMoveListener(this.getMousePositionHandler);
		Radi.Earth.addScrollEventListener(this.getHeightHandler);
		var workspace = new GeoBeans.WFSWorkspace("tmp",MapCloud.server,"1.0.0");
		this.featureType = new GeoBeans.FeatureType(workspace, this.cityRegionLayer);
		this.chinaFeatureType = new GeoBeans.FeatureType(workspace,this.chinaLayer);
	},	

	getPositionHandler : function(position){
		if(position == null){
			return;
		}


		var that = MapCloud.positionControl;
		that.setPostion(position);

	},

	// 设置位置
	setPostion : function(position){
		var cameraPosition = Radi.Earth.getCameraPosition();
		// var lat = position.lat;
		// var lon = position.lon;
		// var height = position.height;
		var lat = cameraPosition.lat;
		var lon = cameraPosition.lon;
		var height = cameraPosition.height;
			
		if(this.lat == null || this.lon == null){
			this.lat = lat;
			this.lon = lon;

		}else{
			this.position = cameraPosition;
			var point = new GeoBeans.Geometry.Point(lon,lat);

			// 先判断是否在中国
			this.getPositionInChina(point);

		}

	},	

	getPositionWithinCity : function(point){
		if(point == null){
			return;
		}
		this.featureType.fields = this.featureType.getFields(null,this.sourceName);
		var fields = [this.nameField];
		this.featureType.getFeaturesWithinAsync(null,this.sourceName,point,this.getPositionWithinCity_callback,fields);
	},


	getPositionWithinCity_callback : function(obj,features){
		if(!$.isArray(features)){
			return;
		}
		if(features.length == 0){
			return;
		}

		var that = MapCloud.positionControl;
		var feature = features[0];
		if(feature == null){
			return;
		}
		var values = feature.values;
		var nameFieldIndex = that.featureType.getFieldIndex(that.nameField);
		var name = values[nameFieldIndex];
		if(name == null){
			return;
		}
		that.setCurrentCity(name);
	},

	// 设置当前城市
	setCurrentCity : function(city){
		console.log(city);
		MapCloud.currentCity = city;
		MapCloud.searchPanel.getAQICityInfo(city);
		MapCloud.currentCityPanel.setCity(city);
	},

	// 鼠标位置
	getMousePositionHandler : function(position){
		if(position == null){
			return;
		}
		var that = MapCloud.positionControl;
		that.setMousePosition(position);
	},

	setMousePosition : function(position){
		if(position == null){
			return;
		}
		MapCloud.positionPanel.setPosition(position);
	},

	getHeightHandler : function(height){
		if(height == null){
			return;
		}
		MapCloud.positionPanel.setHeight(height);
		var that = MapCloud.positionControl;
		that.setPostion(null);
	},

	// 查看是否在国内
	getPositionInChina : function(point){
		if(point == null){
			return;
		}
		this.chinaFeatureType.fields = this.chinaFeatureType.getFields(null,this.sourceName);
		var fields = [this.chinaNameField];
		this.chinaFeatureType.getFeaturesWithinAsync(null,this.sourceName,point,this.getPositionInChina_callback,fields);
	},

	getPositionInChina_callback : function(features){
		if(!$.isArray(features)){
			return;
		}
		var that = MapCloud.positionControl;
		that.setPositionInChina(features);
	},

	// 设置是否在中国
	setPositionInChina : function(features){
		if(features == null){
			return;
		}
		var length = features.length;
		if(length == 0){
			// 此时在国外
			MapCloud.currentCity = null;
			MapCloud.currentCityPanel.setCity("其它地区");
			$(".current-city-aqi span").html("");
		}else{
			// 这一次的位置
			var lat = this.position.lat;
			var lon = this.position.lon;
			var height = this.position.height;

			// 先判断高度
			if(height > this.heightTolerance){
				MapCloud.currentCity = null;
				MapCloud.currentCityPanel.setCity("全国");
				$(".current-city-aqi span").html("");
			}else{
				// 具体是哪一个城市
				var distance = Math.sqrt((this.lat - lat)*(this.lat - lat) + (this.lon - lon)*(this.lon - lon));
				console.log("distance:" + distance);
				if(distance > this.tolerance){
					// 获取位置
					var point = new GeoBeans.Geometry.Point(lon,lat);
					this.getPositionWithinCity(point);
				}
			}
		}
		this.lat = this.position.lat;
		this.lon = this.position.lon;
	},

	// 设置位置
	setPosition : function(position){
		if(position == null){
			return;
		}
		var lat = position.lat;
		var lon = position.lon;
		var height = position.height;
		if(lon != null && lat != null){
			this.lat = lat;
			this.lon = lon;
		}
	},

});