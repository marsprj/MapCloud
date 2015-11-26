MapCloud.SubPanel = MapCloud.Class({
	panel : null,

	poiNames : null,

	aqiCitys : null,

	// 设置的AQI城市列表
	setAQICity : null,

	initialize : function(id){
		this.panel = $("#" + id);

		if(user != null && subManager != null){
			subManager.getSubscription(this.getSubscription_callback);
			// this.getSubscription();
			
		}

		this.registerPanelEvent();
	},

	registerPanelEvent : function(){
		var that = this;

		// 选择城市
		this.panel.find(".select-city").click(function(){
			MapCloud.aqi_city_dialog.showDialog(that.aqiCitys,user.server);
		});

		// 订阅
		this.panel.find(".btn-subscribe").click(function(){
			that.subscribe();
		});

		

	},

	// 获取订阅主题
	getSubscription : function(){
		var keywords = subManager.getSubscriptionKeywords();
		this.setSubscriptionNames(keywords);
	},

	// 获取订阅主题
	getSubscription_callback : function(subMgr,obj){
		if(subMgr == null || obj == null){
			return;
		}

		var panel = MapCloud.subPanel;
		panel.setSubscriptionNames(obj);
	},

	// 在页面上设置订阅的主题
	setSubscriptionNames : function(obj){
		var poiNames = obj.poi;
		var aqiCitys = obj.aqi;

		this.poiNames = poiNames;
		this.aqiCitys = aqiCitys;


		// // 设置poi  暂时屏蔽
		// var poi = null, city = null;
		// for(var i = 0; i < poiNames.length; ++i){
		// 	poi = poiNames[i];
		// 	var item = this.panel.find(".topic-label span[pname='"+ poi +"']");
		// 	if(item.length != 0){
		// 		item.parent().find("input").prop("checked",true);
		// 	}else{
		// 		var html = '<label class="topic-label">'
		// 				'	<input type="checkbox"><span pname="' + poi +'">' + poi + '</span>'
		// 				'</label>';
		// 		this.panel.find(".poi-list").append(html);
		// 	}
		// }

		if(aqiCitys == null){
			this.aqiCitys = [];
			this.panel.find(".aqi-city").html("空");
			return;
		}
		if(this.aqiCitys.length == 0){
			this.panel.find(".aqi-city").html("空");
			return;
		}
		// 设置aqi
		var html = "";
		for(var i = 0; i < aqiCitys.length; ++i){
			city = aqiCitys[i];
			html += "<span class='label label-success aqi-city-label'>" + city + "</span>";
		}
		this.panel.find(".aqi-city").html(html);
	},

	// getSub_callback : function(){

	// },

	// 订阅AQI城市
	subscribeAQI_callback : function(result){
		var that = MapCloud.subPanel;
		MapCloud.notify.showInfo(result,"订阅AQI城市");
		subManager.getSubscription(that.getSubscription_callback);
	},


	setSelectAQICity : function(citys){
		this.setAQICity = citys;

		var html = "", city = null;
		for(var i = 0; i < citys.length; ++i){
			city = citys[i];
			html += "<span class='label label-success aqi-city-label'>" + city + "</span>";
		}
		this.panel.find(".aqi-city").html(html);

		var city = null;
		var index = null;
		var subArray = [];
		for(var i = 0; i < citys.length; ++i){
			city = citys[i];
			index = this.aqiCitys.indexOf(city);
			if(index == -1){
				subArray.push(city);
			}
		}
		if(subArray.length != 0){
			subManager.subscribe("aqi",subArray,this.subscribeAQI_callback);	
		}

		for(var i = 0; i < this.aqiCitys.length; ++i){
			city = this.aqiCitys[i];
			index = citys.indexOf(city);
			if(index == -1){
				subManager.Unsubscribe("aqi",city,this.Unsubscribe_callback);
			}
		}
	},

	Unsubscribe_callback : function(result){
		var that = MapCloud.subPanel;
		MapCloud.notify.showInfo(result,"取消订阅AQI城市");
		subManager.getSubscription(that.getSubscription_callback);
	},

	// 订阅
	subscribe : function(){
		// POI的暂时屏蔽
		// this.subscribePOI();
		this.subscribeAQI();
	},

	// 订阅POI
	subscribePOI : function(){
		var setPois = [];
		this.panel.find(".topic-label input:checked").each(function(){
			var name = $(this).parent().find("span").attr("pname");
			setPois.push(name);
		});
		var name = null,index = null;
		var subArray = [];
		for(var i = 0; i < setPois.length; ++i){
			name = setPois[i];
			index = this.poiNames.indexOf(name);
			if(index == -1){
				subArray.push(name);
			}
		}
		if(subArray.length != 0){
			subManager.subscribe("poi",subArray,this.subscribePOI_callback);
		}


		for(var i = 0; i < this.poiNames.length; ++i){
			name = this.poiNames[i];
			index = setPois.indexOf(name);
			if(index == -1){
				subManager.Unsubscribe("poi",name,this.unsubscribePoi_callback);
			}
		}

	},

	// 订阅POI
	subscribePOI_callback : function(result){
		var that = MapCloud.subPanel;
		MapCloud.notify.showInfo(result,"订阅兴趣点");
		// 重新获取

	},

	// 取消订阅POI
	unsubscribePoi_callback : function(result){
		var that = MapCloud.subPanel;
		MapCloud.notify.showInfo(result,"取消订阅兴趣点");
		// 重新获取

	},


	// 订阅AQI
	subscribeAQI : function(){
		var city = null;
		var index = null;
		var subArray = [];
		for(var i = 0; i < this.setAQICity.length; ++i){
			city = this.setAQICity[i];
			index = this.aqiCitys.indexOf(city);
			if(index == -1){
				subArray.push(city);
			}
		}
		if(subArray.length != 0){
			subManager.subscribe("aqi",subArray,this.subscribeAQI_callback);	
		}

		for(var i = 0; i < this.aqiCitys.length; ++i){
			city = this.aqiCitys[i];
			index = this.setAQICity.indexOf(city);
			if(index == -1){
				subManager.Unsubscribe("aqi",city,this.Unsubscribe_callback);
			}
		}
	},
});