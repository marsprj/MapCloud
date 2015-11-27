MapCloud.TopicPanel = MapCloud.Class(MapCloud.Panel,{
	// 点集合
	pois : null,

	// aqi数据
	aqiFeatures : null,

	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		
		this.registerEvent();
	},

	showPanel : function(){
		// this.panel.css("display","block");
		this.panel.css("width","300px");
		$(".float-coordinates").css("right","330px");
	},


	hidePanel : function(){
		this.panel.css("width","0px");
		// this.panel.css("display","none");
		$(".float-coordinates").css("right","30px");
		this.pois = null;
		this.aqiFeatures = null;
	},

	registerEvent : function(){
		var that = this;

		this.panel.find(".topic-count").click(function(){
			alert("infos");
		});
	},


	setPois : function(pois){
		if(pois.length == 0){
			return;
		}
		var date = new Date();
		date = date.toLocaleString();
		var html = '<div class="row">'
			+	'	<i class="fa fa-clock-o"></i>'
			+	'<span>' + date + "</span>"
			+	'<br/><br/>'
			+	'<span style="margin-left:15px">新增订阅信息<a href="javascript:void(0)" class="topic-count">' 
			+   pois.length + '</a>条</span>'
			+	'</div>';
		this.panel.find(".panel-content").html(html);
		this.showPanel();
		this.pois = pois;

		var that = this;
		// 弹出页面
		this.panel.find(".topic-count").click(function(){
			MapCloud.poi_dialog.showDialog();
			MapCloud.poi_dialog.setPois(that.pois);
		});
	},

	getSub_callback : function(time,poiFeatures,aqiFeatures){
		var that = MapCloud.topicPanel;
		that.setResults(time,poiFeatures,aqiFeatures);
	},	


	setResults : function(time,pois,aqiFeatures){
		var date = new Date();
		console.log(date);
		if(time == null || !$.isArray(aqiFeatures) || !$.isArray(pois)){
			return;
		}

		console.log(time);
		console.log(aqiFeatures == null ? "aqi null" : aqiFeatures.length);
		console.log(pois == null ? "pois null" : pois.length); 
		if(aqiFeatures.length == 0 && pois.length == 0){
			return;
		}
		var timeStr = time.toLocaleString();
		var html = "";
		var html = '<div class="row">'
			+	'	<i class="fa fa-clock-o"></i>'
			+	'<span>' + timeStr + "</span></div>";
		if(aqiFeatures.length != 0){
			html += '<div class="row"> 新增AQI点<a href="javascript:void(0)" class="aqi-count">' + 
				+ aqiFeatures.length + '</a>条</div>';
		}
		if(pois.length != 0){
			html += '<div class="row"> 新增POI点<a href="javascript:void(0)" class="poi-count">' + 
				+ pois.length + '</a>条</div>';
		}
		this.panel.find(".panel-content").html(html);
		this.showPanel();

		var that = this;
		that.pois = pois;
		that.aqiFeatures = aqiFeatures;

		// 弹出对话框
		// aqi
		this.panel.find(".aqi-count").click(function(){
			MapCloud.aqi_features_dialog.showDialog();
			MapCloud.aqi_features_dialog.setAqiFeatures(that.aqiFeatures);
		});

		// poi
		this.panel.find(".poi-count").click(function(){
			MapCloud.poi_dialog.showDialog();
			MapCloud.poi_dialog.setPois(that.pois);
		});
	}
});