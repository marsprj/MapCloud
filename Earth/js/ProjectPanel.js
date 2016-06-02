MapCloud.ProjectPanel = MapCloud.Class(MapCloud.Panel,{
	
	showFlag : false,

	server : "/ows/radi/mgr",

	baseSourceName : "base",

	// 地震
	// earthquakeLayerName : "x3_地震",
	// earthquakeFeatures : null,
	// earthquakeFeatureType : null,
	// earthquakeFields : ["title","shape"],
	earthquakeNodes : null,

	// 演习
	// exerciseLayerName : "x3_演习",
	// exerciseFeatures : null,
	// exerciseFeatureType : null,
	// exerciseFields : ["title","shape"],
	exerciseNodes : null,

	// 流感
	// fluLayerName : "流感",
	// fluFeatures : null,
	// fluFeatureType : null,
	// fluFields : ['shape',"title"],
	fluNodes : null,


	// 非洲地名
	// africaLayerName : "非洲地名",
	// africaLayerName : "gz_africa",
	// africaFeatures : null,
	// africaFeatureType : null,
	// africaFields : ["cnname","shape"],
	africaNodes: null,

	// 美日东盟会议
	// usaLayerName : "x3_美日东盟会议",
	// usaFeatures : null,
	// usaFeatureType : null,
	// usaFields : ["title","shape"],
	usaNodes : null,

	// 中国东盟会议
	// chinaLayerName : "x3_中国东盟会议",
	// chinaFeatures : null,
	// chinaFeatureType : null,
	// chinaFields : ["title","shape"],
	chinaNodes: null,

	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		this.registerEvent();

		this.showFlag = MapCloud.topicPanel.showFlag;

		// var workspace = new GeoBeans.WFSWorkspace("tmp",this.server,"1.0.0");
		// this.earthquakeFeatureType = new GeoBeans.FeatureType(workspace,this.earthquakeLayerName);
		// this.exerciseFeatureType = new GeoBeans.FeatureType(workspace,this.exerciseLayerName);
		// this.fluFeatureType = new GeoBeans.FeatureType(workspace,this.fluLayerName);
		// this.africaFeatureType = new GeoBeans.FeatureType(workspace,this.africaLayerName);
		// this.usaFeatureType = new GeoBeans.FeatureType(workspace,this.usaLayerName);
		// this.chinaFeatureType = new GeoBeans.FeatureType(workspace,this.chinaLayerName);
		Radi.Earth.addMoveModelEventListener();
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
						if(that.preIndex == i && that.showFlag){
							that.cleanup();
							that.showFlag = false;
						}else{
							// that.getEarthquake();
							that.getEarthquakeJson();
							that.showFlag = true;
						}
						break;
					}
					case 2:{
						if(that.preIndex == i && that.showFlag){
							that.cleanup();
							that.showFlag = false;
						}else{
							// that.getExercise();
							that.getExerciseJson();
							that.showFlag = true;
						}
						break;
					}
					// case 3:{
					// 	if(that.preIndex == i && that.showFlag){
					// 		Radi.Earth.cleanup();
					// 		that.showFlag = false;
					// 	}else{
					// 		// that.getFlu();
					// 		that.getFluJson();
					// 		that.showFlag = true;
					// 	}
					// 	break;
					// }
					case 3:{
						if(that.preIndex == i && that.showFlag){
							that.cleanup();
							that.showFlag = false;
						}else{
							// that.getAfrica();
							that.getAfricaJson();
							that.showFlag = true;
						}
						break;
					}
					// case 5:{
					// 	if(that.preIndex == i && that.showFlag){
					// 		Radi.Earth.cleanup();
					// 		that.showFlag = false;
					// 	}else{
					// 		// that.getUsa();
					// 		that.getUsaJson();
					// 		that.showFlag = true;
					// 	}
					// 	break;
					// }
					case 4:{
						if(that.preIndex == i && that.showFlag){
							that.cleanup();
							that.showFlag = false;
						}else{
							// that.getChina();
							that.getChinaJson();
							that.showFlag = true;
						}
						break;
					}
					case 5:{
						if(that.preIndex == i && that.showFlag){
							that.cleanup();
							that.showFlag = false;
						}else{
							
							that.getNanhaiIslandsJson();
							that.showFlag = true;
						}
						break;
					}
					case 6:{
						
						if(that.preIndex == i && that.showFlag){
							that.cleanup();
							that.showFlag = false;
						}else{
							
							that.getNaihaiAirportJson();
							that.showFlag = true;
						}
						break;
					}
					case 7:{
						if(that.preIndex == i && that.showFlag){
							that.cleanup();
							that.removeZhibei();
							that.showFlag = false;
						}else{
							
							that.addZhibei();
							that.showFlag = true;
						}
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
			this.panel.animate({'width':'323px'},300);
		}else{
			this.panel.children().not(".mc-stretch").css("display","none");
			$(item).removeClass("mc-icon-right");
			$(item).addClass("mc-icon-left");
			this.panel.animate({'width':'40px'},300);
		}
	},

	// // 地震数据
	// getEarthquake : function(){
	// 	if(this.earthquakeFeatures != null){
	// 		this.showEarthquake(this.earthquakeFeatures);
	// 		return;
	// 	}
	// 	this.earthquakeFeatureType.fields = this.earthquakeFeatureType.getFields(null,this.baseSourceName);
	// 	this.earthquakeFeatureType.getFeaturesFilterAsync(null,this.baseSourceName,null,5000,0,
	// 		this.earthquakeFields,null,this.getEarthquake_callback);
	// 	// var path = "js/data/earthquake.xml"; 
	// 	// var that = this;
	// 	// this.earthquakeFeatureType.fields = this.earthquakeFeatureType.getFields(null,this.baseSourceName);
	// 	// $.get(path,function(xml){
	// 	// 	var features = that.earthquakeFeatureType.parseFeatures(xml);
	// 	// 	that.earthquakeFeatures = features;
	// 	// 	that.showEarthquake(features);
	// 	// });
	// },

	// showEarthquake : function(features){
	// 	if(features == null){
	// 		return;
	// 	}
	// 	Radi.Earth.cleanup();
	// 	var url = "../images/flag_2.png";
	// 	var feature = null,values = null, geometry = null,x = null,y = null;
		
	// 	for(var i = 0; i < features.length; ++i){
	// 		feature = features[i];
	// 		if(feature == null){
	// 			continue;
	// 		}
	// 		values = feature.values;
	// 		if(values == null){
	// 			continue;
	// 		}
	// 		geometry = feature.geometry;
	// 		if(geometry == null){
	// 			continue;
	// 		}
	// 		x = geometry.x;
	// 		y = geometry.y;
	// 		if(x != null && y != null){
	// 			Radi.Earth.addBillboard(x,y,"",url);
	// 		}
	// 	}	
	// 	var cx = 107;
	// 	var cy = 30;
	// 	var cz = 8260681;
	// 	var heading = 360;
	// 	var pitch = -90;
	// 	var roll = 0;
	// 	Radi.Earth.flyTo(cx,cy,cz,heading,pitch,roll);	

		// var titleFieldIndex = this.earthquakeFeatureType.getFieldIndex("title");
		// var f = null;
		// var nodes = [];
		// for(var i = 0; i < features.length;++i){
		// 	f = features[i];
		// 	geometry = f .geometry;
		// 	var title = f.values[titleFieldIndex];
		// 	var obj = {
		// 		x : geometry.x,
		// 		y : geometry.y,
		// 		title : title
		// 	};
		// 	nodes.push(obj);
		// }
		// var json = {
		// 	nodes : nodes
		// };
		// var a = JSON.stringify(json);
	// },


	// getEarthquake_callback : function(features){
	// 	console.log(features.length);
	// 	var that = MapCloud.projectPanel;
	// 	that.showEarthquake(features);
	// },

	getEarthquakeJson : function(){
		
		if(this.earthquakeNodes != null){
			this.showEarthquakeJson(this.earthquakeNodes);
			return;
		}
		
		var url = "js/data/earthquake.json";
		var that = this;
		$.ajax({
			type	:"get",
			url		: url,
			dataType: "json",
			async	: true,
			beforeSend: function(XMLHttpRequest){
			},
			success	: function(json, textStatus){
				that.earthquakeNodes = json.nodes;
				that.showEarthquakeJson(that.earthquakeNodes);
			},
			complete: function(XMLHttpRequest, textStatus){
			},
			error	: function(){
			}
		});
	},

	showEarthquakeJson : function(nodes){
		this.cleanup();
		MapCloud.showProject = true;
		var url = "../images/flag_2.png";
		for(var i = 0; i < nodes.length;++i){
			var node = nodes[i];
			var x = node.x;
			var y = node.y;
			var a = Radi.Earth.addBillboard(x,y,"",url);
			a.billboard.text = node.title;
		}
		var cx = 107;
		var cy = 30;
		var cz = 8260681;
		var heading = 360;
		var pitch = -90;
		var roll = 0;
		Radi.Earth.flyTo(cx,cy,cz,heading,pitch,roll);	
	},

	// 演习
	// getExercise : function(){
	// 	// if(this.exerciseFeatures != null){
	// 	// 	this.showExercise(this.exerciseFeatures);
	// 	// 	return;
	// 	// }

	// 	// this.exerciseFeatureType.fields = this.exerciseFeatureType.getFields(null,this.baseSourceName);
	// 	// this.exerciseFeatureType.getFeaturesFilterAsync(null,this.baseSourceName,null,null,0,
	// 	// 	this.exerciseFields,null,this.getExercise_callback);
	// 	var path = "js/data/exercise.xml"; 
	// 	var that = this;
	// 	this.exerciseFeatureType.fields = this.exerciseFeatureType.getFields(null,this.baseSourceName);
	// 	$.get(path,function(xml){
	// 		var features = that.exerciseFeatureType.parseFeatures(xml);
	// 		that.exerciseFeatures = features;
	// 		that.showExercise(features);
	// 	});
	// },

	// getExercise_callback : function(features){
	// 	if(!$.isArray(features)){
	// 		return;
	// 	}
	// 	var that = MapCloud.projectPanel;
	// 	that.exerciseFeatures = features;
	// 	that.showExercise(features);
	// },

	// showExercise : function(features){
	// 	if(features == null){
	// 		return;
	// 	}
	// 	Radi.Earth.cleanup();
	// 	var url = "../images/marker.png";
	// 	var feature = null,values = null, geometry = null,x = null,y = null;
		
	// 	for(var i = 0; i < features.length; ++i){
	// 		feature = features[i];
	// 		if(feature == null){
	// 			continue;
	// 		}
	// 		values = feature.values;
	// 		if(values == null){
	// 			continue;
	// 		}
	// 		geometry = feature.geometry;
	// 		if(geometry == null){
	// 			continue;
	// 		}
	// 		x = geometry.x;
	// 		y = geometry.y;
	// 		if(x != null && y != null){
	// 			Radi.Earth.addBillboard(x,y,"",url);
	// 		}
	// 	}
	// 	var cx = 107;
	// 	var cy = 30;
	// 	var cz = 8260681;
	// 	var heading = 360;
	// 	var pitch = -90;
	// 	var roll = 0;
	// 	Radi.Earth.flyTo(cx,cy,cz,heading,pitch,roll);

	// 	var titleFieldIndex = this.exerciseFeatureType.getFieldIndex("title");
	// 	var f = null;
	// 	var nodes = [];
	// 	for(var i = 0; i < features.length;++i){
	// 		f = features[i];
	// 		geometry = f .geometry;
	// 		var title = f.values[titleFieldIndex];
	// 		var obj = {
	// 			x : geometry.x,
	// 			y : geometry.y,
	// 			title : title
	// 		};
	// 		nodes.push(obj);
	// 	}
	// 	var json = {
	// 		nodes : nodes
	// 	};
	// 	var a = JSON.stringify(json);
	// },

	getExerciseJson : function(){
		MapCloud.showProject = true;
		if(this.exerciseNodes != null){
			this.showExerciseJson(this.exerciseNodes);
			return;
		}
		
		var url = "js/data/exercise.json";
		var that = this;
		$.ajax({
			type	:"get",
			url		: url,
			dataType: "json",
			async	: true,
			beforeSend: function(XMLHttpRequest){
			},
			success	: function(json, textStatus){
				that.exerciseNodes = json.nodes;
				that.showExerciseJson(that.exerciseNodes);
			},
			complete: function(XMLHttpRequest, textStatus){
			},
			error	: function(){
			}
		});
	},

	showExerciseJson : function(nodes){
		this.cleanup();
		MapCloud.showProject = true;
		var url = "../images/marker.png";
		for(var i = 0; i < nodes.length;++i){
			var node = nodes[i];
			var x = node.x;
			var y = node.y;
			var a = Radi.Earth.addBillboard(x,y,"",url);
			a.billboard.text = node.title;
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
	// getFlu : function(){
	// 	this.time = new Date();
	// 	if(this.fluFeatures != null){
	// 		this.showFlu(this.fluFeatures);
	// 		return;
	// 	}

	// 	this.fluFeatureType.fields = this.fluFeatureType.getFields(null,this.baseSourceName);
	// 	this.fluFeatureType.getFeaturesFilterAsync(null,this.baseSourceName,null,null,0,
	// 		this.fluFields,null,this.getFlu_callback);
	// 	// var path = "js/data/flu.xml"; 
	// 	// var that = this;
	// 	// this.fluFeatureType.fields = this.fluFeatureType.getFields(null,this.baseSourceName);
	// 	// $.get(path,function(xml){
	// 	// 	var features = that.fluFeatureType.parseFeatures(xml);
	// 	// 	that.fluFeatures = features;
	// 	// 	that.showFlu(features);
	// 	// });
	// },

	// getFlu_callback : function(features){
	// 	if(!$.isArray(features)){
	// 		return;
	// 	}
	// 	var that = MapCloud.projectPanel;
	// 	that.fluFeatures = features;
	// 	that.showFlu(features);
	// },

	// showFlu : function(features){
	// 	if(features == null){
	// 		return;
	// 	}
	// 	Radi.Earth.cleanup();
	// 	var url = "../images/virus-red.png";
	// 	var feature = null,values = null, geometry = null,lon = null,lat = null;
	// 	var titleFieldIndex = this.fluFeatureType.getFieldIndex("title");
	// 	for(var i = 0; i < features.length; ++i){
	// 		feature = features[i];
	// 		if(feature == null){
	// 			continue;
	// 		}
	// 		values = feature.values;
	// 		if(values == null){
	// 			continue;
	// 		}
	// 		geometry = feature.geometry;
	// 		if(geometry == null){
	// 			continue;
	// 		}
	// 		lon = geometry.x;
	// 		lat = geometry.y;
	// 		if(lon != null && lat != null){
	// 			Radi.Earth.addBillboard(lon,lat,"",url);
	// 		}
	// 	}
	// 	var cx = 107.2598;
	// 	var cy = 34.4148;
	// 	var cz = 4633881;
	// 	var heading = 360;
	// 	var pitch = -90;
	// 	var roll = 0;
	// 	Radi.Earth.flyTo(cx,cy,cz,heading,pitch,roll);
	// 	var delta = new Date() - this.time;
	// 	console.log(delta);

	// 	//  生成json
	// 	// var json
	// 	var f = null;
	// 	var nodes = [];
	// 	for(var i = 0; i < features.length;++i){
	// 		f = features[i];
	// 		geometry = f .geometry;
	// 		var title = f.values[titleFieldIndex];
	// 		var obj = {
	// 			x : geometry.x,
	// 			y : geometry.y,
	// 			title : title
	// 		};
	// 		nodes.push(obj);
	// 	}
	// 	var json = {
	// 		nodes : nodes
	// 	};
	// 	var a = JSON.stringify(json);
	// },

	getFluJson : function(){
		MapCloud.showProject = true;
		if(this.fluNodes != null){
			this.showFluJson(this.fluNodes);
			return;
		}
		
		var url = "js/data/flu.json";
		var that = this;
		$.ajax({
			type	:"get",
			url		: url,
			dataType: "json",
			async	: true,
			beforeSend: function(XMLHttpRequest){
			},
			success	: function(json, textStatus){
				that.fluNodes = json.nodes;
				that.showFluJson(that.fluNodes);
			},
			complete: function(XMLHttpRequest, textStatus){
			},
			error	: function(){
			}
		});
	},

	showFluJson : function(nodes){
		this.cleanup();
		MapCloud.showProject = true;
		var url = "../images/flag_2.png";
		for(var i = 0; i < nodes.length;++i){
			var node = nodes[i];
			var x = node.x;
			var y = node.y;
			var a = Radi.Earth.addBillboard(x,y,"",url);
			a.billboard.text = node.title;
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
	// getAfrica : function(){
	// 	if(this.africaFeatures != null){
	// 		this.showAfrica(this.africaFeatures);
	// 		return;
	// 	}
	// 	// this.time = new Date();
	// 	// var sourceName = "gisdb";
	// 	// this.africaFeatureType.fields = this.africaFeatureType.getFields(null,sourceName);
	// 	// this.africaFeatureType.getFeaturesFilterAsync(null,sourceName,null,null,0,
	// 	// 	this.africaFields,null,this.getAfrica_callback);
	// 	var path = "js/data/africa.xml"; 
	// 	var that = this;
	// 	var sourceName = "gisdb";
	// 	this.africaFeatureType.fields = this.africaFeatureType.getFields(null,sourceName);
	// 	$.get(path,function(xml){
	// 		var features = that.africaFeatureType.parseFeatures(xml);
	// 		that.africaFeatures = features;
	// 		that.showAfrica(features);
	// 	});
	// },

	// getAfrica_callback : function(features){
	// 	if(!$.isArray(features)){
	// 		return;
	// 	}
	// 	var that = MapCloud.projectPanel;
	// 	that.africaFeatures = features;
	// 	that.showAfrica(features);
	// },

	// showAfrica : function(features){
	// 	if(features == null){
	// 		return;
	// 	}
	// 	Radi.Earth.cleanup();
	// 	var url = "../images/marker.png";
	// 	var feature = null,values = null, geometry = null,lon = null,lat = null,name = null;
	// 	var nameFieldIndex = this.africaFeatureType.getFieldIndex("cnname");
	// 	for(var i = 0; i < features.length; ++i){
	// 		feature = features[i];
	// 		if(feature == null){
	// 			continue;
	// 		}
	// 		values = feature.values;
	// 		if(values == null){
	// 			continue;
	// 		}
	// 		name = values[nameFieldIndex];
	// 		if(name == null){
	// 			name = "";
	// 		}
	// 		geometry = feature.geometry;
	// 		if(geometry == null){
	// 			continue;
	// 		}
	// 		lon = geometry.x;
	// 		lat = geometry.y;
	// 		if(lon != null && lat != null){
	// 			Radi.Earth.addBillboard(lon,lat,name,url);
	// 		}
	// 	}
	// 	var cx = 7.2598;
	// 	var cy = 15.4148;
	// 	var cz = 4633881;
	// 	var heading = 360;
	// 	var pitch = -90;
	// 	var roll = 0;
	// 	Radi.Earth.flyTo(cx,cy,cz,heading,pitch,roll);
	// },

	getAfricaJson : function(){
		MapCloud.showProject = true;
		if(this.africaNodes != null){
			this.showAfricaJson(this.africaNodes);
			return;
		}
		
		var url = "js/data/africa.json";
		var that = this;
		$.ajax({
			type	:"get",
			url		: url,
			dataType: "json",
			async	: true,
			beforeSend: function(XMLHttpRequest){
			},
			success	: function(json, textStatus){
				that.africaNodes = json.nodes;
				that.showAfricaJson(that.africaNodes);
			},
			complete: function(XMLHttpRequest, textStatus){
			},
			error	: function(){
			}
		});
	},

	showAfricaJson : function(nodes){
		this.cleanup();
		MapCloud.showProject = true;
		var url = "../images/marker.png";
		for(var i = 0; i < nodes.length;++i){
			var node = nodes[i];
			var x = node.x;
			var y = node.y;
			var a = Radi.Earth.addBillboard(x,y,"",url);
			a.billboard.text = node.title;
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
	// getUsa : function(){
	// 	if(this.usaFeatures != null){
	// 		this.showUsa(this.usaFeatures);
	// 		return;
	// 	}

	// 	// this.usaFeatureType.fields = this.usaFeatureType.getFields(null,this.baseSourceName);
	// 	// this.usaFeatureType.getFeaturesFilterAsync(null,this.baseSourceName,null,null,0,
	// 	// 	this.usaFields,null,this.getFlu_callback);
	// 	var path = "js/data/usa.xml"; 
	// 	var that = this;
	// 	this.usaFeatureType.fields = this.usaFeatureType.getFields(null,this.baseSourceName);
	// 	$.get(path,function(xml){
	// 		var features = that.usaFeatureType.parseFeatures(xml);
	// 		that.usaFeatures = features;
	// 		that.showUsa(features);
	// 	});
	// },

	// showUsa : function(features){
	// 	if(features == null){
	// 		return;
	// 	}
	// 	Radi.Earth.cleanup();
	// 	var url = "../images/flag_1.png";
	// 	var feature = null,values = null, geometry = null,lon = null,lat = null,title = null;
	// 	var titleFieldIndex = this.usaFeatureType.getFieldIndex("title");
	// 	for(var i = 0; i < features.length; ++i){
	// 		feature = features[i];
	// 		if(feature == null){
	// 			continue;
	// 		}
	// 		values = feature.values;
	// 		if(values == null){
	// 			continue;
	// 		}
	// 		title = values[titleFieldIndex];
	// 		if(title == null){
	// 			title = "";
	// 		}
	// 		geometry = feature.geometry;
	// 		if(geometry == null){
	// 			continue;
	// 		}
	// 		lon = geometry.x;
	// 		lat = geometry.y;
	// 		if(lon != null && lat != null){
	// 			Radi.Earth.addBillboard(lon,lat,"",url);
	// 		}
	// 	}
	// 	var cx = 107;
	// 	var cy = 30;
	// 	var cz = 8260681;
	// 	var heading = 360;
	// 	var pitch = -90;
	// 	var roll = 0;
	// 	Radi.Earth.flyTo(cx,cy,cz,heading,pitch,roll);

	// },


	getUsaJson : function(){
		MapCloud.showProject = true;
		if(this.usaNodes != null){
			this.showUsaJson(this.usaNodes);
			return;
		}
		
		var url = "js/data/usa.json";
		var that = this;
		$.ajax({
			type	:"get",
			url		: url,
			dataType: "json",
			async	: true,
			beforeSend: function(XMLHttpRequest){
			},
			success	: function(json, textStatus){
				that.usaNodes = json.nodes;
				that.showUsaJson(that.usaNodes);
			},
			complete: function(XMLHttpRequest, textStatus){
			},
			error	: function(){
			}
		});
	},

	showUsaJson : function(nodes){
		this.cleanup();
		MapCloud.showProject = true;
		var url = "../images/flag_1.png";
		for(var i = 0; i < nodes.length;++i){
			var node = nodes[i];
			var x = node.x;
			var y = node.y;
			var a = Radi.Earth.addBillboard(x,y,"",url);
			a.billboard.text = node.title;
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
	// getChina : function(){
	// 	if(this.chinaFeatures != null){
	// 		this.showChina(this.chinaFeatures);
	// 		return;
	// 	}

	// 	// this.chinaFeatureType.fields = this.chinaFeatureType.getFields(null,this.baseSourceName);
	// 	// this.chinaFeatureType.getFeaturesFilterAsync(null,this.baseSourceName,null,null,0,
	// 	// 	this.chinaFields,null,this.getFlu_callback);
	// 	var path = "js/data/china.xml"; 
	// 	var that = this;
	// 	this.chinaFeatureType.fields = this.chinaFeatureType.getFields(null,this.baseSourceName);
	// 	$.get(path,function(xml){
	// 		var features = that.chinaFeatureType.parseFeatures(xml);
	// 		that.chinaFeatures = features;
	// 		that.showChina(features);
	// 	});
	// },

	// showChina : function(features){
	// 	if(features == null){
	// 		return;
	// 	}
	// 	Radi.Earth.cleanup();
	// 	var url = "../images/flag_1.png";
	// 	var feature = null,values = null, geometry = null,lon = null,lat = null,title = null;
	// 	var titleFieldIndex = this.chinaFeatureType.getFieldIndex("title");
	// 	for(var i = 0; i < features.length; ++i){
	// 		feature = features[i];
	// 		if(feature == null){
	// 			continue;
	// 		}
	// 		values = feature.values;
	// 		if(values == null){
	// 			continue;
	// 		}
	// 		title = values[titleFieldIndex];
	// 		if(title == null){
	// 			title = "";
	// 		}
	// 		geometry = feature.geometry;
	// 		if(geometry == null){
	// 			continue;
	// 		}
	// 		lon = geometry.x;
	// 		lat = geometry.y;
	// 		if(lon != null && lat != null){
	// 			Radi.Earth.addBillboard(lon,lat,"",url);
	// 		}
	// 	}
	// 	var cx = 107;
	// 	var cy = 30;
	// 	var cz = 8260681;
	// 	var heading = 360;
	// 	var pitch = -90;
	// 	var roll = 0;
	// 	Radi.Earth.flyTo(cx,cy,cz,heading,pitch,roll);

	// },

	getChinaJson : function(){
		MapCloud.showProject = true;
		if(this.chinaNodes != null){
			this.showUsaJson(this.chinaNodes);
			return;
		}
		
		var url = "js/data/china.json";
		var that = this;
		$.ajax({
			type	:"get",
			url		: url,
			dataType: "json",
			async	: true,
			beforeSend: function(XMLHttpRequest){
			},
			success	: function(json, textStatus){
				that.chinaNodes = json.nodes;
				that.showChinaJson(that.chinaNodes);
			},
			complete: function(XMLHttpRequest, textStatus){
			},
			error	: function(){
			}
		});
	},

	showChinaJson : function(nodes){
		this.cleanup();
		MapCloud.showProject = true;
		var url = "../images/flag_1.png";
		for(var i = 0; i < nodes.length;++i){
			var node = nodes[i];
			var x = node.x;
			var y = node.y;
			var a = Radi.Earth.addBillboard(x,y,"",url);
			a.billboard.text = node.title;
		}
		var cx = 107;
		var cy = 30;
		var cz = 8260681;
		var heading = 360;
		var pitch = -90;
		var roll = 0;
		Radi.Earth.flyTo(cx,cy,cz,heading,pitch,roll);
	},


	getNanhaiIslandsJson : function(){
		// var f = null;
		// var nodes = [];
		// var self = this;
		// $.get("./data/nanhai/nh_isands.xml", function(xml){
  //           $(xml).find("featureMember").each(function(index, element) {

	 //             var name = self.getNodeValue(this,"标准名称");
	 //            // var icon = self.getAirportIcon(type);

	 //            var pos_node = $(this).find("pos")[0];
	 //            var pos = $(pos_node).text();
	 //            var pts = pos.split(" ");
	 //            var x = pts[1];
	 //            var y = pts[0];

	 //            // var airport = self.addAirport(x, y, name, icon);
	 //            // if(airport!=undefined){
	 //            //     pins.push(airport);
	 //            // }
	 //            var obj = {
		// 			x : x,
		// 			y : y,
		// 			title : name
		// 		};
		// 		nodes.push(obj);
	 //        });
	 //        var json = {
		// 		nodes : nodes
		// 	};
		// 	var a = JSON.stringify(json);

  //       });
		MapCloud.showProject = true;
		if(this.islandNodes != null){
			this.showIslandJson(this.islandNodes);
			return;
		}
		
		var url = "js/data/islands.json";
		var that = this;
		$.ajax({
			type	:"get",
			url		: url,
			dataType: "json",
			async	: true,
			beforeSend: function(XMLHttpRequest){
			},
			success	: function(json, textStatus){
				that.islandNodes = json.nodes;
				that.showIslandJson(that.islandNodes);
			},
			complete: function(XMLHttpRequest, textStatus){
			},
			error	: function(){
			}
		});
	},
	getNodeValue: function(xmlNode, nodeName){
        var xnode = $(xmlNode).find(nodeName)[0];
        return $(xnode).text();
    },

	showIslandJson : function(nodes){
		this.cleanup();
		MapCloud.showProject = true;
		var url = "../images/islands.png";
		for(var i = 0; i < nodes.length;++i){
			var node = nodes[i];
			var x = node.x;
			var y = node.y;
			var a = Radi.Earth.addBillboard(x,y,"",url);
			a.billboard.text = node.title;
		}
		var cx = 110;
		var cy = 8;
		var cz = 4260681;
		var heading = 360;
		var pitch = -90;
		var roll = 0;
		Radi.Earth.flyTo(cx,cy,cz,heading,pitch,roll);
	},

	getNaihaiAirportJson : function(){
		MapCloud.showProject = true;
		if(this.airportNodes != null){
			this.showAirportJson(this.airportNodes);
			return;
		}
		
		var url = "js/data/airport.json";
		var that = this;
		$.ajax({
			type	:"get",
			url		: url,
			dataType: "json",
			async	: true,
			beforeSend: function(XMLHttpRequest){
			},
			success	: function(json, textStatus){
				that.airportNodes = json.nodes;
				that.showAirportJson(that.airportNodes);
			},
			complete: function(XMLHttpRequest, textStatus){
			},
			error	: function(){
			}
		});
	},

	showAirportJson : function(nodes){
		this.cleanup();
		MapCloud.showProject = true;
		var url = "../images/plane_18.png";
		for(var i = 0; i < nodes.length;++i){
			var node = nodes[i];
			var x = node.x;
			var y = node.y;
			var a = Radi.Earth.addBillboard(x,y,"",url);
			a.billboard.text = node.title;
		}
		var cx = 110;
		var cy = 8;
		var cz = 8260681;
		var heading = 360;
		var pitch = -90;
		var roll = 0;
		Radi.Earth.flyTo(cx,cy,cz,heading,pitch,roll);
	},

	addZhibei : function(){
		this.cleanup();
		 var value = Math.PI * 256.0 / 180.0;
        var extent = new Cesium.Rectangle(-value, -value, value, value);
        var layers = g_earth_view.scene.imageryLayers;
		var zhibeiLayer = layers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
                  url : '/QuadServer/services/maps/wmts100',
                  layer : 'zhibei',
                  style : 'default',
                  format : 'image/jpeg',
                  tileMatrixSetID : 'PGIS_TILE_STORE',
                  // tileMatrixLabels : ['default028mm:0', 'default028mm:1', 'default028mm:2' ...],
                  minimumLevel: 0,
                  maximumLevel: 19,
                  credit : new Cesium.Credit('zhibei'),
                  tilingScheme : new Cesium.GeographicTilingScheme({rectangle : extent})
        }));

        this.zhibeiLayer = zhibeiLayer;
        var cx = 106;
		var cy = 31;
		var cz = 10530054;
		var heading = 360;
		var pitch = -90;
		var roll = 0;
		Radi.Earth.flyTo(cx,cy,cz,heading,pitch,roll);
	},

	removeZhibei : function(){
		var layers = g_earth_view.scene.imageryLayers;
		layers.remove(this.zhibeiLayer);
		this.zhibeiLayer = null;
	},


	// 定义清空事件
	cleanup : function(){
		Radi.Earth.cleanup();
		this.removeZhibei();
	},
});