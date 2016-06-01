MapCloud.ProjectPanel = MapCloud.Class(MapCloud.Panel,{
	
	showFlag : false,

	server : "/ows/radi/mgr",

	baseSourceName : "base",

	// 地震
	earthquakeLayerName : "x3_地震",
	earthquakeFeatures : null,
	earthquakeFeatureType : null,
	earthquakeFields : ["location","shape"],

	// 演习
	exerciseLayerName : "x3_演习",
	exerciseFeatures : null,
	exerciseFeatureType : null,
	exerciseFields : ["title","shape"],

	// 流感
	fluLayerName : "流感",
	fluFeatures : null,
	fluFeatureType : null,
	fluFields : ['shape'],


	// 非洲地名
	// africaLayerName : "非洲地名",
	africaLayerName : "gz_africa",
	africaFeatures : null,
	africaFeatureType : null,
	africaFields : ["cnname","shape"],

	// 美日东盟会议
	usaLayerName : "x3_美日东盟会议",
	usaFeatures : null,
	usaFeatureType : null,
	usaFields : ["title","shape"],

	// 中国东盟会议
	chinaLayerName : "x3_中国东盟会议",
	chinaFeatures : null,
	chinaFeatureType : null,
	chinaFields : ["title","shape"],

	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		this.registerEvent();

		this.showFlag = MapCloud.topicPanel.showFlag;

		var workspace = new GeoBeans.WFSWorkspace("tmp",this.server,"1.0.0");
		this.earthquakeFeatureType = new GeoBeans.FeatureType(workspace,this.earthquakeLayerName);
		this.exerciseFeatureType = new GeoBeans.FeatureType(workspace,this.exerciseLayerName);
		this.fluFeatureType = new GeoBeans.FeatureType(workspace,this.fluLayerName);
		this.africaFeatureType = new GeoBeans.FeatureType(workspace,this.africaLayerName);
		this.usaFeatureType = new GeoBeans.FeatureType(workspace,this.usaLayerName);
		this.chinaFeatureType = new GeoBeans.FeatureType(workspace,this.chinaLayerName);
	},

	registerEvent : function(){
		var that = this;

		this.panel.find("[data-toggle='tooltip']").tooltip({container:'body'});
		this.panel.find(".mc-icon").each(function(i,element){
			$(this).click(function(){
				switch(i){
					case 0:{
						that.onStretch(this);
						break;
					}
					case 1:{
						if(that.preIndex == 1 && that.showFlag){
							Radi.Earth.cleanup();
							that.showFlag = false;
						}else{
							that.getEarthquake();
							that.showFlag = true;
						}
						break;
					}
					case 2:{
						if(that.preIndex == 2 && that.showFlag){
							Radi.Earth.cleanup();
							that.showFlag = false;
						}else{
							that.getExercise();
							that.showFlag = true;
						}
						break;
					}
					case 3:{
						if(that.preIndex == 3 && that.showFlag){
							Radi.Earth.cleanup();
							that.showFlag = false;
						}else{
							that.getFlu();
							that.showFlag = true;
						}
						break;
					}
					case 4:{
						if(that.preIndex == 4 && that.showFlag){
							Radi.Earth.cleanup();
							that.showFlag = false;
						}else{
							that.getAfrica();
							that.showFlag = true;
						}
						break;
					}
					case 5:{
						if(that.preIndex == 5 && that.showFlag){
							Radi.Earth.cleanup();
							that.showFlag = false;
						}else{
							that.getUsa();
							that.showFlag = true;
						}
						break;
					}
					case 6:{
						if(that.preIndex == 6 && that.showFlag){
							Radi.Earth.cleanup();
							that.showFlag = false;
						}else{
							that.getChina();
							that.showFlag = true;
						}
						break;
					}
					default:
						break;
				}
				that.preIndex = i;
			});
		})
	},

	onStretch : function(item){
		if($(item).hasClass("mc-icon-left")){
			this.panel.children().not(".mc-stretch").css("display","block");
			$(item).removeClass("mc-icon-left");
			$(item).addClass("mc-icon-right");
			this.panel.animate({'width':'282px'},300);
		}else{
			this.panel.children().not(".mc-stretch").css("display","none");
			$(item).removeClass("mc-icon-right");
			$(item).addClass("mc-icon-left");
			this.panel.animate({'width':'40px'},300);
		}
	},

	// 地震数据
	getEarthquake : function(){
		if(this.earthquakeFeatures != null){
			this.showEarthquake(this.earthquakeFeatures);
			return;
		}
		// this.earthquakeFeatureType.fields = this.earthquakeFeatureType.getFields(null,this.baseSourceName);
		// this.earthquakeFeatureType.getFeaturesFilterAsync(null,this.baseSourceName,null,10000,0,
		// 	this.earthquakeFields,null,this.getEarthquake_callback);
		var path = "js/data/earthquake.xml"; 
		var that = this;
		this.earthquakeFeatureType.fields = this.earthquakeFeatureType.getFields(null,this.baseSourceName);
		$.get(path,function(xml){
			var features = that.earthquakeFeatureType.parseFeatures(xml);
			that.earthquakeFeatures = features;
			that.showEarthquake(features);
		});
	},

	showEarthquake : function(features){
		if(features == null){
			return;
		}
		Radi.Earth.cleanup();
		var url = "../images/flag_2.png";
		var feature = null,values = null, geometry = null,x = null,y = null;
		
		for(var i = 0; i < features.length; ++i){
			feature = features[i];
			if(feature == null){
				continue;
			}
			values = feature.values;
			if(values == null){
				continue;
			}
			geometry = feature.geometry;
			if(geometry == null){
				continue;
			}
			x = geometry.x;
			y = geometry.y;
			if(x != null && y != null){
				Radi.Earth.addBillboard(x,y,"",url);
			}
		}	
		var cx = 107;
		var cy = 30;
		var cz = 8260681;
		var heading = 360;
		var pitch = -90;
		var roll = 0;
		Radi.Earth.flyTo(cx,cy,cz,heading,pitch,roll);	
	},


	getEarthquake_callback : function(features){
		console.log(features.length);
	},

	// 演习
	getExercise : function(){
		// if(this.exerciseFeatures != null){
		// 	this.showExercise(this.exerciseFeatures);
		// 	return;
		// }

		// this.exerciseFeatureType.fields = this.exerciseFeatureType.getFields(null,this.baseSourceName);
		// this.exerciseFeatureType.getFeaturesFilterAsync(null,this.baseSourceName,null,null,0,
		// 	this.exerciseFields,null,this.getExercise_callback);
		var path = "js/data/exercise.xml"; 
		var that = this;
		this.exerciseFeatureType.fields = this.exerciseFeatureType.getFields(null,this.baseSourceName);
		$.get(path,function(xml){
			var features = that.exerciseFeatureType.parseFeatures(xml);
			that.exerciseFeatures = features;
			that.showExercise(features);
		});
	},

	getExercise_callback : function(features){
		if(!$.isArray(features)){
			return;
		}
		var that = MapCloud.projectPanel;
		that.exerciseFeatures = features;
		that.showExercise(features);
	},

	showExercise : function(features){
		if(features == null){
			return;
		}
		Radi.Earth.cleanup();
		var url = "../images/marker.png";
		var feature = null,values = null, geometry = null,x = null,y = null;
		
		for(var i = 0; i < features.length; ++i){
			feature = features[i];
			if(feature == null){
				continue;
			}
			values = feature.values;
			if(values == null){
				continue;
			}
			geometry = feature.geometry;
			if(geometry == null){
				continue;
			}
			x = geometry.x;
			y = geometry.y;
			if(x != null && y != null){
				Radi.Earth.addBillboard(x,y,"",url);
			}
		}
		var cx = 107;
		var cy = 30;
		var cz = 8260681;
		var heading = 360;
		var pitch = -90;
		var roll = 0;
		Radi.Earth.flyTo(cx,cy,cz,heading,pitch,roll);
	},

	// 流感
	getFlu : function(){
		if(this.fluFeatures != null){
			this.showFlu(this.fluFeatures);
			return;
		}

		// this.fluFeatureType.fields = this.fluFeatureType.getFields(null,this.baseSourceName);
		// this.fluFeatureType.getFeaturesFilterAsync(null,this.baseSourceName,null,null,0,
		// 	this.fluFields,null,this.getFlu_callback);
		var path = "js/data/flu.xml"; 
		var that = this;
		this.fluFeatureType.fields = this.fluFeatureType.getFields(null,this.baseSourceName);
		$.get(path,function(xml){
			var features = that.fluFeatureType.parseFeatures(xml);
			that.fluFeatures = features;
			that.showFlu(features);
		});
	},

	getFlu_callback : function(features){
		if(!$.isArray(features)){
			return;
		}
		var that = MapCloud.projectPanel;
		that.fluFeatures = features;
		that.showFlu(features);
	},

	showFlu : function(features){
		if(features == null){
			return;
		}
		Radi.Earth.cleanup();
		var url = "../images/virus-red.png";
		var feature = null,values = null, geometry = null,lon = null,lat = null;
		
		for(var i = 0; i < features.length; ++i){
			feature = features[i];
			if(feature == null){
				continue;
			}
			values = feature.values;
			if(values == null){
				continue;
			}
			geometry = feature.geometry;
			if(geometry == null){
				continue;
			}
			lon = geometry.x;
			lat = geometry.y;
			if(lon != null && lat != null){
				Radi.Earth.addBillboard(lon,lat,"",url);
			}
		}
		var cx = 107.2598;
		var cy = 34.4148;
		var cz = 4633881;
		var heading = 360;
		var pitch = -90;
		var roll = 0;
		Radi.Earth.flyTo(cx,cy,cz,heading,pitch,roll);
	},


	// 非洲地名
	getAfrica : function(){
		if(this.africaFeatures != null){
			this.showAfrica(this.africaFeatures);
			return;
		}
		// this.time = new Date();
		// var sourceName = "gisdb";
		// this.africaFeatureType.fields = this.africaFeatureType.getFields(null,sourceName);
		// this.africaFeatureType.getFeaturesFilterAsync(null,sourceName,null,null,0,
		// 	this.africaFields,null,this.getAfrica_callback);
		var path = "js/data/africa.xml"; 
		var that = this;
		var sourceName = "gisdb";
		this.africaFeatureType.fields = this.africaFeatureType.getFields(null,sourceName);
		$.get(path,function(xml){
			var features = that.africaFeatureType.parseFeatures(xml);
			that.africaFeatures = features;
			that.showAfrica(features);
		});
	},

	getAfrica_callback : function(features){
		if(!$.isArray(features)){
			return;
		}
		var that = MapCloud.projectPanel;
		that.africaFeatures = features;
		that.showAfrica(features);
	},



	showAfrica : function(features){
		if(features == null){
			return;
		}
		Radi.Earth.cleanup();
		var url = "../images/marker.png";
		var feature = null,values = null, geometry = null,lon = null,lat = null,name = null;
		var nameFieldIndex = this.africaFeatureType.getFieldIndex("cnname");
		for(var i = 0; i < features.length; ++i){
			feature = features[i];
			if(feature == null){
				continue;
			}
			values = feature.values;
			if(values == null){
				continue;
			}
			name = values[nameFieldIndex];
			if(name == null){
				name = "";
			}
			geometry = feature.geometry;
			if(geometry == null){
				continue;
			}
			lon = geometry.x;
			lat = geometry.y;
			if(lon != null && lat != null){
				Radi.Earth.addBillboard(lon,lat,name,url);
			}
		}
		var cx = 7.2598;
		var cy = 15.4148;
		var cz = 4633881;
		var heading = 360;
		var pitch = -90;
		var roll = 0;
		Radi.Earth.flyTo(cx,cy,cz,heading,pitch,roll);

	},

	// 美日东盟会议
	getUsa : function(){
		if(this.usaFeatures != null){
			this.showUsa(this.usaFeatures);
			return;
		}

		// this.usaFeatureType.fields = this.usaFeatureType.getFields(null,this.baseSourceName);
		// this.usaFeatureType.getFeaturesFilterAsync(null,this.baseSourceName,null,null,0,
		// 	this.usaFields,null,this.getFlu_callback);
		var path = "js/data/usa.xml"; 
		var that = this;
		this.usaFeatureType.fields = this.usaFeatureType.getFields(null,this.baseSourceName);
		$.get(path,function(xml){
			var features = that.usaFeatureType.parseFeatures(xml);
			that.usaFeatures = features;
			that.showUsa(features);
		});
	},

	showUsa : function(features){
		if(features == null){
			return;
		}
		Radi.Earth.cleanup();
		var url = "../images/flag_1.png";
		var feature = null,values = null, geometry = null,lon = null,lat = null,title = null;
		var titleFieldIndex = this.usaFeatureType.getFieldIndex("title");
		for(var i = 0; i < features.length; ++i){
			feature = features[i];
			if(feature == null){
				continue;
			}
			values = feature.values;
			if(values == null){
				continue;
			}
			title = values[titleFieldIndex];
			if(title == null){
				title = "";
			}
			geometry = feature.geometry;
			if(geometry == null){
				continue;
			}
			lon = geometry.x;
			lat = geometry.y;
			if(lon != null && lat != null){
				Radi.Earth.addBillboard(lon,lat,"",url);
			}
		}
		var cx = 107;
		var cy = 30;
		var cz = 8260681;
		var heading = 360;
		var pitch = -90;
		var roll = 0;
		Radi.Earth.flyTo(cx,cy,cz,heading,pitch,roll);

	},

	// 中国东盟会议
	getChina : function(){
		if(this.chinaFeatures != null){
			this.showChina(this.chinaFeatures);
			return;
		}

		// this.chinaFeatureType.fields = this.chinaFeatureType.getFields(null,this.baseSourceName);
		// this.chinaFeatureType.getFeaturesFilterAsync(null,this.baseSourceName,null,null,0,
		// 	this.chinaFields,null,this.getFlu_callback);
		var path = "js/data/china.xml"; 
		var that = this;
		this.chinaFeatureType.fields = this.chinaFeatureType.getFields(null,this.baseSourceName);
		$.get(path,function(xml){
			var features = that.chinaFeatureType.parseFeatures(xml);
			that.chinaFeatures = features;
			that.showChina(features);
		});
	},

	showChina : function(features){
		if(features == null){
			return;
		}
		Radi.Earth.cleanup();
		var url = "../images/flag_1.png";
		var feature = null,values = null, geometry = null,lon = null,lat = null,title = null;
		var titleFieldIndex = this.chinaFeatureType.getFieldIndex("title");
		for(var i = 0; i < features.length; ++i){
			feature = features[i];
			if(feature == null){
				continue;
			}
			values = feature.values;
			if(values == null){
				continue;
			}
			title = values[titleFieldIndex];
			if(title == null){
				title = "";
			}
			geometry = feature.geometry;
			if(geometry == null){
				continue;
			}
			lon = geometry.x;
			lat = geometry.y;
			if(lon != null && lat != null){
				Radi.Earth.addBillboard(lon,lat,"",url);
			}
		}
		var cx = 107;
		var cy = 30;
		var cz = 8260681;
		var heading = 360;
		var pitch = -90;
		var roll = 0;
		Radi.Earth.flyTo(cx,cy,cz,heading,pitch,roll);

	}

});