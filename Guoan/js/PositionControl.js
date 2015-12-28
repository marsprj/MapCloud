MapCloud.PositionControl = MapCloud.Class({

	tolerance : 0.1,

	cityRegionLayer : "china_city_region",

	chinaLayer : "china_china",

	sourceName : "base",

	nameField : "aname",

	chinaNameField : "name_engli",

	chinaFeatureType : null,

	cityFeatureType : null,


	initialize : function(){
		if(mapObj != null){
			mapObj.addEventListener(GeoBeans.Event.MOUSE_MOVE, this.onMapMove);
			mapObj.addEventListener(GeoBeans.Event.MOUSE_DOWN, this.onMapClick);
		}
		var workspace = new GeoBeans.WFSWorkspace("tmp",user.server,"1.0.0");
		this.featureType = new GeoBeans.FeatureType(workspace, this.cityRegionLayer);
		this.chinaFeatureType = new GeoBeans.FeatureType(workspace,this.chinaLayer);		
	},

	onMapMove : function(evt){
		if(evt == null){
			return;
		}
		var mapX = evt.mapX;
		var mapY = evt.mapY;
		if(mapX == null || mapY == null){
			return;
		}
		var str = mapX.toFixed(4) + " , " + mapY.toFixed(4);
		
		$(".float-coordinates .coor-value").html(str);
		// this.position = point;

			
	},

	onMapClick : function(evt){
		var center = mapObj.center;
		var that = MapCloud.positionControl;
		var point = new GeoBeans.Geometry.Point(center.x,center.y);
		if(that.position == null){
			that.x = center.x;
			that.y = center.y;
		}
		that.position = center;
		that.getPositionInChina(point);			
	},

	// 是否在中国
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
			MapCloud.currentCityPanel.setCity("其它地区");
		}else{
			var level = mapObj.level;
			if(level > 10){
				MapCloud.currentCityPanel.setCity("全国")
			}else{
				// 这一次的位置
				var x = this.x;
				var y = this.y;
				var position = this.position;
				
				// 具体是哪一个城市
				var distance = Math.sqrt((position.x - x)*(position.x - x) + (position.y - y)*(position.y - y));
				console.log(distance);
				if(distance > this.tolerance){
					// 获取位置
					var point = new GeoBeans.Geometry.Point(position.x,position.y);
					this.getPositionWithinCity(point);
				}
			}
			this.x = this.position.x;
			this.y = this.position.y;
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

	getPositionWithinCity_callback : function(features){
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
		MapCloud.currentCityPanel.setCity(name);
	},	
});