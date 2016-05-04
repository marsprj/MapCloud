MapCloud.SearchPanel = MapCloud.Class(MapCloud.Panel,{
	userName : "user1",

	poiManager : null,

	sourceName : "base",

	aqiRankingLayer : "gc_aqi_ranking",

	aqiRankingCityField : "area",

	aqiStatLayer : "gc_aqi",

	aqiUptimeLayer : "gc_aqi_ranking_uptime",

	// 地名数据
	placeLayer : "china_county_region",

	aqiRankingFeatureType : null,

	aqiStatFeatureType : null,

	aqiUptimeFeatureType : null,

	server : null,

	pm25Field : "pm2_5",
	pm10Field : "pm10",
	aqiField : "aqi",
	primaryPollutantField : "primary_pollutant",
	qualityField : "quality",
	levelField : "level",
	aqiTimeField : "time_point",
	areaField : "area",

	positionField : "position_name",
	statXField : "x",
	statYField : "y",
	stationCodeField : "station_code",
	
	uptimeFiled : "uptime",

	// 地名字段
	placeField : "name",

	// 一页的个数
	aqiRankingCount : 12,

	// 总的页数
	aqiRankingPageCount : null,

	// aqi ranking 页码
	aqiRankingCurrentPage : null,


	// 时间
	timepoint : null,

	// 显示全国AQI分布图
	showAQIChartFlag : false,

	// poi搜索的当前页
	poiCurrentPage : null,

	poiPageCount : 20,
	// poi搜索范围
	poiExent : null,

	// 当前的地名搜索页
	addressCurrentPage : null,

	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		
		this.registerEvent();

		this.server = "/ows/" + this.userName + "/mgr";
		this.poiManager = new GeoBeans.PoiManager("/ows/user1");
		var workspace = new GeoBeans.WFSWorkspace("tmp",this.server,"1.0.0");
		this.aqiRankingFeatureType = new GeoBeans.FeatureType(workspace, this.aqiRankingLayer);
		this.aqiStatFeatureType = new GeoBeans.FeatureType(workspace,this.aqiStatLayer);
		this.aqiUptimeFeatureType = new GeoBeans.FeatureType(workspace,this.aqiUptimeLayer);
		this.placeFeatureType = new GeoBeans.FeatureType(workspace,this.placeLayer);
		this.getCurrentTime();
	},

	// 获取当前时间
	getCurrentTime : function(){
		this.aqiUptimeFeatureType.getMinMaxValueAsync(this.uptimeFiled,null,this.sourceName,
			this.getCurrentTime_callback);
	},

	getCurrentTime_callback : function(obj){
		if(obj == null){
			return;
		}
		var that = MapCloud.searchPanel;
		that.setCurrentTime(obj.max);
	},

	// 设置当前时间
	setCurrentTime : function(timepoint){
		if(timepoint == null){
			return;
		}
		this.timepoint = timepoint;
		var timeStr = timepoint.slice(timepoint.lastIndexOf(" ")+1,timepoint.length);
		this.panel.find(".current-time span").html(timeStr);

		// 获取该时刻的，当前城市的AQI
		// 城市的具体信息
		this.getAQICityInfo(MapCloud.currentCity);
	},

	// 获取一个城市的AQI信息
	getAQICityInfo : function(city){
		if(city == null){
			return;
		}
		// 如果是站点页面
		if(this.panel.find(".aqi-stat-tab").css("display") == "block"){
			this.panel.find(".search-tab-div").removeClass("active");
			this.panel.find(".aqi-tab").addClass("active");
			Radi.Earth.cleanup();
		}
		
		// 如果和当前城市一样，则不再发送请求
		var currentCity = this.panel.find(".aqi-info .aqi-stat").html();
		if(currentCity == city){
			return;
		}
		this.getAQIInfo(city,this.timepoint,this.getAQIInfo_callback);
	},

	registerEvent : function(){
		var that = this;

		this.panel.find("[data-toggle='tooltip']").tooltip({container:'body'});

		// 图片 伸缩
		that.panel.find(".logo").click(function(){
			// alert("coll");
			var contentDiv = that.panel.find("#search_content_div");
			if(contentDiv.css("display") == "block"){
				contentDiv.slideUp();
			}else{
				contentDiv.slideDown();
			}
		});

		// 切换主题
		that.panel.find(".search-item-menu li a").click(function(){
			var value = $(this).text();
			var html = value +  "<span class='caret'></span>";
			that.panel.find(".search-item").html(html);
			that.panel.find(".search-keyword").val("");
			if(value == "地名"){
				that.panel.find(".search-tab-div").removeClass("active");
				that.panel.find(".place-tab").addClass("active");
				that.panel.find(".search-menu-div li").removeClass("active");
				that.panel.find(".search-menu-div li[pname='place']").addClass("active");
				that.panel.find(".place-tab").empty();
			}else if(value == "POI"){
				that.panel.find(".search-tab-div").removeClass("active");
				that.panel.find(".poi-tab").addClass("active");
				that.panel.find(".search-menu-div li").removeClass("active");
				that.panel.find(".search-menu-div li[pname='poi']").addClass("active");
			}
		});

		// 搜索
		that.panel.find(".search-btn").click(function(){
			var text = that.panel.find(".search-keyword").val();
			if(text == ""){
				return;
			}

			var searchItem = that.panel.find(".search-item").text();
			switch(searchItem){
				case "POI":{
					that.searchPoi(text);
					break;
				}
				case "AQI":{
					break;
				}
				case "地名":{
					that.searchPlace(text);
					break;
				}
				default:
					break;
			}
		});

		// 切换搜索主题
		this.panel.find(".search-menu-div li").click(function(){
			Radi.Earth.cleanup();
			var pname = $(this).attr("pname");
			if(pname == "aqi"){
				that.showAQIPanel();
				return;	
			}

			that.panel.find(".search-menu-div li").removeClass("active");
			$(this).addClass("active");
			var panelTab = "." + pname + "-tab";
			that.panel.find(".search-tab-div").removeClass("active");
			that.panel.find(panelTab).addClass("active");

			if(pname == "poi"){
				var html = "POI" +  "<span class='caret'></span>";
				that.panel.find(".search-item").html(html);
				that.panel.find(".search-keyword").val("");
			}else if(pname == "place"){
				var html = "地名" +  "<span class='caret'></span>";
				that.panel.find(".search-item").html(html);
				that.panel.find(".place-tab").empty();
				that.panel.find(".search-keyword").val("");
			}
		});

		// 返回列表
		this.panel.find(".return-search-list-btn").click(function(){
			Radi.Earth.cleanup();
			// that.panel.find(".search-content-tab-div").css("display","none");
			// that.panel.find(".search-list-div").css("display","block");
			// that.panel.find(".search-tab-div").hide();
			// that.panel.find(".poi-tab").show();
			that.panel.find(".search-tab-div").removeClass("active");
			that.panel.find(".poi-tab").addClass("active");
		});	

		// 搜索关键词
		this.panel.find(".poi-item,.poi-list-row span").click(function(){
			var poiName = $(this).attr("piname");
			var poiList = [];
			switch(poiName){
				case "hotel":{
					poiList.push("hotel");
					poiList.push("酒店");
					break;
				}
				case "restaurant":{
					poiList.push("饭店");
					poiList.push("饭馆");
					break
				}
				case "shop":{
					poiList.push("商场");
					poiList.push("商店");
					break;
				}
				case "cinema":{
					poiList.push("电影院");
					break;
				}
				case "site":{
					poiList.push("公园");
					break;
				}
				case "bank":{
					poiList.push("银行");
					poiList.push("ATM");
					break;
				}
				case "supermarker":{
					poiList.push("超市");
					break;
				}
				case "subway":{
					poiList.push("地铁");
					break;
				}
				case "bus":{
					poiList.push("公交站");
					break;
				}
				case "gas":{
					poiList.push("加油站");
					break;
				}
				case "park":{
					poiList.push("停车场");
					break;
				}
				case "ktv":{
					poiList.push("ktv");
					break;
				}
				case "bar":{
					poiList.push("酒吧");
					break;
				}
				case "hospital":{
					poiList.push("医院");
					break;
				}
				case "school":{
					poiList.push("学校");
					poiList.push("小学");
					poiList.push("中学");
					poiList.push("大学");
					break;
				}
				case "harmacy":{
					poiList.push("药店");
					break;
				}
				case "atm":{
					poiList.push("atm");
					break;
				}
				case "chafing_dish":{
					poiList.push("火锅");
					break;
				}
				case "barbecue":{
					poiList.push("烧烤");
					poiList.push("烤串");
					break;
				}
				case "snack":{
					poiList.push("快餐");
					poiList.push("麦当劳");
					poiList.push("肯德基");
					break;
				}
				case "sichuan":{
					poiList.push("川菜");
					break;
				}
				default:
					break;
			}
			if(poiList.length != 0){
				that.searchPoi(poiList);
			}
			
		});


		// aqi页码
		this.panel.find(".aqi-ranking-page li").click(function(){
			var currentPage = that.aqiRankingCurrentPage;
			if($(this).hasClass("first-page")){
				that.aqiRankingCurrentPage = 1;
				that.getAQIRanking(that.timepoint,1);
			}else if($(this).hasClass("pre-page")){
				if(currentPage > 1 && currentPage <= that.aqiRankingPageCount){
					that.aqiRankingCurrentPage = that.aqiRankingCurrentPage - 1;
					that.getAQIRanking(that.timepoint,that.aqiRankingCurrentPage);
				}
			}else if($(this).hasClass("next-page")){
				if(currentPage > 0 && currentPage < that.aqiRankingPageCount){
					that.aqiRankingCurrentPage = that.aqiRankingCurrentPage + 1;
					that.getAQIRanking(that.timepoint,that.aqiRankingCurrentPage);
				}
			}else if($(this).hasClass("last-page")){
				// if(currentPage > 0 && )
				that.aqiRankingCurrentPage = that.aqiRankingPageCount;
				that.getAQIRanking(that.timepoint,that.aqiRankingPageCount);
			}
			var html = that.aqiRankingCurrentPage + " / " + that.aqiRankingPageCount + "页";
			that.panel.find(".aqi-ranking-page .current-page").html(html);
		});

		// 查看AQI变化图表
		this.panel.find(".aqi-chart-btn").click(function(){
			var area = $(this).parents(".board").find(".aqi-stat").html();

			var areaFilter = new GeoBeans.BinaryComparisionFilter();
			areaFilter.operator = GeoBeans.ComparisionFilter.OperatorType.ComOprEqual;
			var prop = new GeoBeans.PropertyName();
			prop.setName(that.areaField);
			var literal = new GeoBeans.Literal();
			literal.setValue(area);
			areaFilter.expression1 = prop;
			areaFilter.expression2 = literal;
			MapCloud.aqiChartDialog.showDialog(that.timepoint,that.aqiRankingFeatureType,area,areaFilter);
		});

		// 查看站点
		this.panel.find(".show-stat").click(function(){
			if(MapCloud.currentCity == null){
				return;
			}
			that.panel.find(".search-tab-div").removeClass("active");
			that.panel.find(".aqi-stat-tab").addClass("active");

			that.getAQIStat(MapCloud.currentCity,that.timepoint);
		});

		// 返回aqi页面
		this.panel.find(".return-aqi").click(function(){
			that.panel.find(".search-tab-div").removeClass("active");
			that.panel.find(".aqi-tab").addClass("active");
			Radi.Earth.cleanup();
		});

		// poi翻页
		// 上一页
		this.panel.find(".result-content-div .pre-page").click(function(){
			var item = that.panel.find(".search-item").text();
			if(item == "地名"){
				if(that.addressCurrentPage <= 1){
					return;
				}
				var name = that.panel.find(".search-keyword").val();
				that.getAddress(name,that.addressCurrentPage -1);
			}else if(item == "POI"){
				var page = that.poiCurrentPage;
				if(page <= 0){
					return;
				}
				that.poiCurrentPage = page - 1;
				that.searchPoiByPage(that.keyword,that.poiCurrentPage,that.poiExent);
			}
			
		});

		this.panel.find(".result-content-div .next-page").click(function(){
			var count = that.panel.find(".result-main-div li").length;
			if(count < that.poiPageCount){
				return;
			}
			var item = that.panel.find(".search-item").text();
			if(item == "地名"){
				var name = that.panel.find(".search-keyword").val();
				that.getAddress(name,that.addressCurrentPage +1);
			}else if(item == "POI"){
				var page = that.poiCurrentPage;
				that.poiCurrentPage = page + 1;
				that.searchPoiByPage(that.keyword,that.poiCurrentPage,that.poiExent);
			}
		});


		// poi上一页
		this.panel.find(".poi-result-tab .pre-page").click(function(){
			var page = that.poiCurrentPage;
			if(page <= 0){
				return;
			}
			that.poiCurrentPage = page - 1;
			that.searchPoiByPage(that.keyword,that.poiCurrentPage,that.poiExent);
		});	

		// poi下一页
		this.panel.find(".poi-result-tab .next-page").click(function(){
			var count = that.panel.find(".result-main-div li").length;
			if(count < that.poiPageCount){
				return;
			}
			
			var page = that.poiCurrentPage;
			that.poiCurrentPage = page + 1;
			that.searchPoiByPage(that.keyword,that.poiCurrentPage,that.poiExent);
		});			

		// 切换搜索主题
		this.panel.find(".search-item").change(function(){
			console.log($(this).text());
		});
	},

	// 查询poi
	searchPoi : function(keyword){
		if(keyword == null){
			return;
		}
		// 后端有问题，待解决
		this.keyword = keyword;
		// this.keyword = keyword[0];
		// Radi.Earth.cleanup();
		// this.panel.find(".result-main-div").empty();
		var extent = Radi.Earth.getExtentView();
		if(extent == null){
			alert("请设定有效的范围");
			return;
		}
		this.poiCurrentPage = 0;
		this.poiExent = extent;
		this.searchPoiByPage(this.keyword,this.poiCurrentPage,extent);

		// this.poiManager.getPoi(keyword,this.poiPageCount,0,null,this.searchPoi_callback);

	},

	searchPoiByPage : function(keyword,page,extent){
		if(page < 0 || keyword == null || extent == null){
			return;
		}
		// this.panel.find(".search-content-tab-div").css("display","none");
		this.panel.find(".search-tab-div").removeClass("active");
		this.panel.find(".poi-result-tab").addClass("active");
		this.panel.find(".poi-result-tab").addClass("loading");
		Radi.Earth.cleanup();
		this.panel.find(".result-main-div").empty();
		var offset = page * this.poiPageCount;
		this.poiManager.getPoi(keyword,this.poiPageCount,offset,extent,this.searchPoi_callback);
	},

	searchPoi_callback : function(pois){
		var that = MapCloud.searchPanel;
		that.panel.find(".poi-result-tab").removeClass("loading");
		console.log(pois.length);
		if(!$.isArray(pois)){
			return;
		}

		
		that.showPoisResult(pois);
		that.showPoisIn3D(pois);

	},

	// 在面板上显示查询结果
	showPoisResult : function(pois){
		if(!$.isArray(pois)){
			return;
		}
		var html = "<ul>";
		var poi = null, name = null, x = null,y = null,address = null;
		for(var i = 0; i < pois.length; ++i){
			poi = pois[i];
			if(poi == null){
				continue;
			}
			name = poi.name;
			x = poi.x;
			y = poi.y;
			x = parseFloat(x);
			y = parseFloat(y);
			if(x > 180){
				var obj = Radi.Earth.mercator2lonlat(x,y);
				x = obj.x;
				y = obj.y;
			}
			address = poi.address;
			html += "<li px='" + x + "' py='" + y +"'>"
				+	"	<div class='row'>" 
				+	"		<div class='col-md-2'>"
				+	"			<img src='../images/marker.png'>"
				+	"		</div>"
				+	"		<div class='col-md-10'>"
				+	"			<div class='row poi-name'>"
				+					name
				+	"			</div>"
				+	"			<div class='row poi-address'>"
				+	"				地址:"	+ address
				+	"			</div>"
				+	"		</div>"
				+	"	</div>"
				+	"</li>";
		}
		html += "</ul>";
		this.panel.find(".result-main-div").html(html);
		// this.panel.find(".search-content-tab-div").css("display","none");
		// this.panel.find(".result-div").css("display","block");

		// 点击定位
		this.panel.find(".result-main-div ul li").click(function(){
			var x = $(this).attr("px");
			var y = $(this).attr("py");
			if(x != null && y != null){
				var h = 10000;
				Radi.Earth.flyTo(x,y,h);
			}
		});
	},

	// 三维上显示结果
	showPoisIn3D : function(pois){
		var url = "../images/marker.png";
		var poi = null, name = null, x = null,y = null,address = null;
		var poi3DList = [];
		var poi3D = null;
		for(var i = 0; 	i < pois.length; ++i){
			poi = pois[i];
			if(poi == null){
				continue;
			}
			name = poi.name;
			x = poi.x;
			y = poi.y;
			x = parseFloat(x);
			y = parseFloat(y);
			if(x > 180){
				var obj = Radi.Earth.mercator2lonlat(x,y);
				x = obj.x;
				y = obj.y;
			}
			address = poi.address;
			type = poi.type;
			poi3D = Radi.Earth.addBillboard(x,y,name,url);
			poi3DList.push(poi3D);
		}
		// Radi.Earth.zoom(poi3DList);		
	},

	// 显示AQI面板
	showAQIPanel : function(){
		if(this.panel.find(".search-tab-div.active").hasClass("aqi-tab")){
			return;
		}
		this.panel.find(".search-menu-div li").removeClass("active");
		this.panel.find(".search-menu-div li[pname='aqi']").addClass("active");
		this.panel.find(".search-tab-div").removeClass("active");
		this.panel.find(".aqi-tab").addClass("active");



		// var city = "北京";
		// var city = "邢台";
		// var timepoint = "2015-12-08 11:00:00";
		// this.timepoint = timepoint;

		// // 城市的具体信息
		// this.getAQIInfo(MapCloud.currentCity,timepoint,this.getAQIInfo_callback);

		// 排行榜
		this.getAQIRankingCount(this.timepoint,this.getAQIRankingCount_callback);
	},

	// 获取一个城市的AQI信息
	getAQIInfo : function(city,timepoint,callback){
		if(city == null ||timepoint == null){
			return;
		}

		this.panel.find(".aqi-tab .aqi-stat").html(city);
		// 清空
		this.panel.find(".aqi-tab .aqi-info .label").html("");
		this.panel.find(".aqi-tab .aqi-number").html("");

		var cityFilter = new GeoBeans.BinaryComparisionFilter();
		cityFilter.operator = GeoBeans.ComparisionFilter.OperatorType.ComOprEqual;
		var prop = new GeoBeans.PropertyName();
		prop.setName(this.aqiRankingCityField);
		var literal = new GeoBeans.Literal();
		literal.setValue(city);
		cityFilter.expression1 = prop;
		cityFilter.expression2 = literal;


		var timeFilter = new GeoBeans.BinaryComparisionFilter();
		timeFilter.operator = GeoBeans.ComparisionFilter.OperatorType.ComOprEqual;
		var prop = new GeoBeans.PropertyName();
		prop.setName(this.aqiTimeField);
		var literal = new GeoBeans.Literal();
		literal.setValue(timepoint);
		timeFilter.expression1 = prop;
		timeFilter.expression2 = literal;

		var filter = new GeoBeans.BinaryLogicFilter();
		filter.operator = GeoBeans.LogicFilter.OperatorType.LogicOprAnd;
		filter.addFilter(cityFilter);
		filter.addFilter(timeFilter);

		this.aqiRankingFeatureType.fields = this.aqiRankingFeatureType.getFields(null,this.sourceName);

		var xml = this.aqiRankingFeatureType.buildGetFeatureFilterXML(null,this.sourceName,
			filter,1,null,null);


	
		var url = this.server;
		var that = this;
		$.ajax({
			type : "post",
			url	 : url,
			data : xml,
			// contentType: "application/xml",
			contentType : "text/xml",
			dataType: "xml",
			async	: true,
			beforeSend: function(XMLHttpRequest){
			},
			success	: function(xml, textStatus){
				var features = that.aqiRankingFeatureType.parseFeatures(xml);
				if(callback != undefined){
					// var time = that.time;
					// callback(that,time,"aqi",features);
					callback(features);
				}
			},
			complete: function(XMLHttpRequest, textStatus){
			},
			error	: function(XMLHttpRequest,textStatus,error){
				console.log("textStatus:" + textStatus);
				console.log("error:" + error);
			}
		});
	},


	// 城市的AQI详情
	getAQIInfo_callback : function(features){
		if(!$.isArray(features)){
			return;
		}
		if(features.length == 0){
			return;
		}
		var feature = features[0];
		var that = MapCloud.searchPanel;
		that.showAQIInfo(feature);
	},

	// 展示AQI具体信息
	showAQIInfo : function(feature){
		if(feature == null){
			return;
		}
		var values = feature.values;

		var qualityFieldIndex = this.aqiRankingFeatureType.getFieldIndex(this.qualityField);
		var quality = values[qualityFieldIndex];


		var levelFieldIndex = this.aqiRankingFeatureType.getFieldIndex(this.levelField);
		var level = values[levelFieldIndex];

		var pm25FieldIndex = this.aqiRankingFeatureType.getFieldIndex(this.pm25Field);
		var pm25 = values[pm25FieldIndex];

		var aqiFieldIndex = this.aqiRankingFeatureType.getFieldIndex(this.aqiField);
		var aqi = values[aqiFieldIndex];

		var pm10FieldIndex = this.aqiRankingFeatureType.getFieldIndex(this.pm10Field);
		var pm10 = values[pm10FieldIndex];


		this.panel.find(".aqi-tab .aqi-quality-label").html(quality);
		this.panel.find(".aqi-tab .aqi-level-label").html(level);
		this.panel.find(".aqi-tab .aqi-pm25-label").html(pm25);
		this.panel.find(".aqi-tab .aqi-pm10-label").html(pm10);
		this.panel.find(".aqi-tab .aqi-number").html(aqi);

		// city panel
		MapCloud.currentCityPanel.setAQI(aqi);

		var levelClass = MapCloud.getAQILevelClass(aqi);
		// var levelClass = this.getAQILevelClass(level);
		if(levelClass != null){
			this.panel.find(".aqi-info .label,.aqi-number").removeClass("label-aqi-level-1 label-aqi-level-2")
			.removeClass("label-aqi-level-3 label-aqi-level-4 label-aqi-level-5 label-aqi-level-6");
			this.panel.find(".aqi-info .label").addClass(levelClass);
			this.panel.find(".aqi-number").addClass(levelClass);
		}
	},

	getAQILevelClass : function(level){
		var levelClass = null;
		switch(level){
			case "一级":{
				levelClass = "label-aqi-level-1";
				break;
			}
			case "二级":{
				levelClass = "label-aqi-level-2";
				break;
			}
			case "三级":{
				levelClass = "label-aqi-level-3";
				break;
			}
			case "四级":{
				levelClass = "label-aqi-level-4";
				break;
			}
			case "五级":{
				levelClass = "label-aqi-level-5";
				break;
			}
			case "六级":{
				levelClass = "label-aqi-level-6";
				break;
			}
			default:
			break;
		}
		return levelClass;
	},

	// 排名
	getAQIRankingCount : function(timepoint,callback){
		if(timepoint == null){
			return;
		}

		var timeFilter = new GeoBeans.BinaryComparisionFilter();
		timeFilter.operator = GeoBeans.ComparisionFilter.OperatorType.ComOprEqual;
		var prop = new GeoBeans.PropertyName();
		prop.setName(this.aqiTimeField);
		var literal = new GeoBeans.Literal();
		literal.setValue(timepoint);
		timeFilter.expression1 = prop;
		timeFilter.expression2 = literal;
		this.aqiRankingFeatureType.getFeatureFilterCountAsync(null,this.sourceName,timeFilter,null,callback);	

	},

	getAQIRankingCount_callback : function(obj,count){
		if(!$.isNumeric(count)){
			return;
		}
		var that = MapCloud.searchPanel;
		var pageCount = Math.ceil(count / that.aqiRankingCount);
		that.aqiRankingPageCount = pageCount;
		that.aqiRankingCurrentPage = 1;
		var html = that.aqiRankingCurrentPage + " / " + that.aqiRankingPageCount + "页";
		that.panel.find(".aqi-ranking-page .current-page").html(html);	
		that.getAQIRanking(that.timepoint,1);
		
	},

	// // 显示页码
	// showPages : function(pageCount){
	// 	if(pageCount <= 0){
	// 		return;
	// 	}
	// 	this.getAQIRanking(this.timepoint,1);
	// 	this.aqiRankingCurrentPage = 1;
	// },

	// 页码
	getAQIRanking : function(timepoint,page){
		if(timepoint == null || page == null){
			return;
		}

		this.panel.find(".aqi-ranking-div").empty().addClass("loading");

		var timeFilter = new GeoBeans.BinaryComparisionFilter();
		timeFilter.operator = GeoBeans.ComparisionFilter.OperatorType.ComOprEqual;
		var prop = new GeoBeans.PropertyName();
		prop.setName(this.aqiTimeField);
		var literal = new GeoBeans.Literal();
		literal.setValue(timepoint);
		timeFilter.expression1 = prop;
		timeFilter.expression2 = literal;


		var offset = (page - 1) * this.aqiRankingCount;

		var fileds = ["aqi","area","quality","x","y"];
		var orderby = new GeoBeans.OrderBy();
		orderby.setOrder(GeoBeans.OrderBy.OrderType.OrderAsc);
		orderby.addField(this.aqiField);
		this.aqiRankingFeatureType.getFeaturesFilterAsync(null,this.sourceName,timeFilter,
			this.aqiRankingCount,offset,fileds,orderby,this.getAQIRankingFeatures_callback);
		// this.aqiRankingFeatureType.getFeaturesFilterAsync(null,this.sourceName,timeFilter,
		// 	null,offset,fileds,null,this.getAQIRankingFeatures_callback);
	},

	getAQIRankingFeatures_callback : function(features){
		// alert(features.length);
		if(!$.isArray(features)){
			return;
		}

		var that = MapCloud.searchPanel;
		that.showAQIRankingFeatures(features);
		that.panel.find(".aqi-ranking-div").removeClass("loading");
	},

	showAQIRankingFeatures : function(features){
		var feature = null, area = null,aqi = null, quality = null,values = null;
		var html = "";
		var id =  (this.aqiRankingCurrentPage - 1) * this.aqiRankingCount;
		var areaFieldIndex = this.aqiRankingFeatureType.getFieldIndex(this.areaField);
		var aqiFieldIndex = this.aqiRankingFeatureType.getFieldIndex(this.aqiField);
		var qualityFieldIndex = this.aqiRankingFeatureType.getFieldIndex(this.qualityField);
		var statXFieldIndex = this.aqiRankingFeatureType.getFieldIndex(this.statXField);
		var statYFieldIndex = this.aqiRankingFeatureType.getFieldIndex(this.statYField);
		var aqiStat3D = null;
		var aqiStat3DList = [];
		// Radi.Earth.cleanup()
		for(var i = 0; i < features.length; ++i){
			feature = features[i];
			if(feature == null){
				continue;
			}
			values = feature.values;
			if(values == null){
				continue;
			}
			
			area = values[areaFieldIndex];
			aqi = values[aqiFieldIndex];
			quality = values[qualityFieldIndex];
			var x = values[statXFieldIndex];
			x = parseFloat(x);
			var y = values[statYFieldIndex];
			y = parseFloat(y);

			html += "<div class='row' cx='" + x + "' cy='" + y + "'>"
				+	"	<div class='col-md-2'>" + (id + i + 1) + "</div>"
				+	"	<div class='col-md-4'><a href='javascript:void(0)' class='aqi-city'>" + area + "</a></div>"
				+	"	<div class='col-md-2'>" + aqi + "</div>"
				+	"	<div class='col-md-4'>" + quality + "</div>"
				+	"</div>";

			var color = MapCloud.getAQILevelColor(aqi);
			var z = parseInt(aqi) *1000;
			// aqiStat3D =  g_earth_view.entities.add({
			// 	name : 'Blue box',
			//     position: Cesium.Cartesian3.fromDegrees(x,y,1000),
			//     // box : {
			//     //     dimensions : new Cesium.Cartesian3(25000, 25000, z),
			//     //     material : color
			//     // },
			//     cylinder : {
			//         length : z,
			//         topRadius : 12000.0,
			//         bottomRadius : 12000.0,
			       
			//         material : color
			//     }
			// });
			// aqiStat3DList.push(aqiStat3D);
		}
		this.panel.find(".aqi-ranking-div").html(html);

		// Radi.Earth.zoom(aqiStat3DList);	

		var that = this;
		// 切换城市
		this.panel.find(".aqi-city").click(function(){
			var city = $(this).html();
			if(city == null || city == ""){
				return;
			}
			MapCloud.currentCity = city;
			var x = $(this).parents(".row").attr("cx");
			var y = $(this).parents(".row").attr("cy");
			that.getAQICityInfo(city);
			MapCloud.currentCityPanel.setCity(city,x,y);
		});

	},

	// 获取某个城市，某一个时间点的站点信息
	getAQIStat : function(city,timepoint){
		if(city == null || timepoint == null){
			return;
		}

		var cityFilter = new GeoBeans.BinaryComparisionFilter();
		cityFilter.operator = GeoBeans.ComparisionFilter.OperatorType.ComOprEqual;
		var prop = new GeoBeans.PropertyName();
		prop.setName(this.areaField);
		var literal = new GeoBeans.Literal();
		literal.setValue(city);
		cityFilter.expression1 = prop;
		cityFilter.expression2 = literal;

		var timeFilter = new GeoBeans.BinaryComparisionFilter();
		timeFilter.operator = GeoBeans.ComparisionFilter.OperatorType.ComOprEqual;
		var prop = new GeoBeans.PropertyName();
		prop.setName(this.aqiTimeField);
		var literal = new GeoBeans.Literal();
		literal.setValue(timepoint);
		timeFilter.expression1 = prop;
		timeFilter.expression2 = literal;	
		
		var filter = new GeoBeans.BinaryLogicFilter();
		filter.operator = GeoBeans.LogicFilter.OperatorType.LogicOprAnd;
		filter.addFilter(cityFilter);
		filter.addFilter(timeFilter);

		var fields = [this.aqiField,this.pm25Field,this.pm10Field,this.qualityField,this.positionField,
				this.primaryPollutantField,this.statXField,this.statYField,this.stationCodeField];
		this.aqiStatFeatureType.fields = this.aqiStatFeatureType.getFields(null,this.sourceName);

		this.aqiStatFeatureType.getFeaturesFilterAsync(null,this.sourceName,filter,30,null,fields,
			null,this.getAQIStat_callback);		
	},

	getAQIStat_callback : function(features){
		if(!$.isArray(features)){
			return;
		}
		var that = MapCloud.searchPanel;
		that.showAQIStatFeatures(features);
	},
	// 展示站点信息
	showAQIStatFeatures : function(features){
		if(features == null){
			return;
		}
		// alert(features.length);
		var feature = null, positionName = null, quality = null, pm25 = null, pm10 = null,aqi = null, x = null, y = null;
		var primary = null, stationCode = null;
		var positionFieldIndex = -1, aqiFieldIndex = -1, qualityFieldIndex = null, pm25FieldIndex = null;
		var statYFieldIndex = -1; statXFieldIndex = -1, pm10FieldIndex = null,primaryPollutantFieldIndex = -1;
		var stationCodeFieldIndex = -1;

		var values = null;
		var html = "";
		var aqiStat3DList = [];
		var aqiStat3D = null;
		var url = "../images/marker.png"; 
		Radi.Earth.cleanup()
		for(var i = 0; i < features.length; ++i){
			feature = features[i];
			if(feature == null){
				continue;
			}
			values = feature.values;
			if(values == null){
				continue;
			}
			positionFieldIndex = this.aqiStatFeatureType.getFieldIndex(this.positionField);
			positionName = values[positionFieldIndex];

			aqiFieldIndex = this.aqiStatFeatureType.getFieldIndex(this.aqiField);
			aqi = values[aqiFieldIndex];

			qualityFieldIndex = this.aqiStatFeatureType.getFieldIndex(this.qualityField);
			quality = values[qualityFieldIndex];

			primaryPollutantFieldIndex = this.aqiStatFeatureType.getFieldIndex(this.primaryPollutantField);
			primary = values[primaryPollutantFieldIndex];

			pm25FieldIndex = this.aqiStatFeatureType.getFieldIndex(this.pm25Field);
			pm25 = values[pm25FieldIndex];

			pm10FieldIndex = this.aqiStatFeatureType.getFieldIndex(this.pm10Field);
			pm10 = values[pm10FieldIndex];

			stationCodeFieldIndex = this.aqiStatFeatureType.getFieldIndex(this.stationCodeField);
			stationCode = values[stationCodeFieldIndex];

			statXFieldIndex = this.aqiStatFeatureType.getFieldIndex(this.statXField);
			x = values[statXFieldIndex];

			statYFieldIndex = this.aqiStatFeatureType.getFieldIndex(this.statYField);
			y = values[statYFieldIndex];

			var levelClass = MapCloud.getAQILevelClass(aqi);

			html += "<div class='aqi-stat-info board'>"
				+	"	<div class='board-title' sx='" + x+ "' sy='" + y + "'>"
				+	"		<span class='aqi-stat'><a href='javascript:void(0)'>" + positionName + "</a></span>"
				+	"		<span class='aqi-number " + levelClass + "'>" + aqi + "</span>"
				+	"	</div>"
				+	"	<div class='board-content row'>"
				+	"		<div class='col-md-8'>"
				+	"			<div class='row'>"
				+	"				<div class='col-md-4'>PM2.5:</div>"
				+	"				<div class='col-md-6'>" 
				+	"					<span class='label " + levelClass + "'>" + pm25 + "</span>"
				+ 	"				</div>"
				+	"			</div>"
				+	"			<div class='row'>"
				+	"				<div class='col-md-4'>PM10:</div>"
				+	"				<div class='col-md-6'>" 
				+	"					<span class='label " + levelClass + "'>" + pm10 + "</span>"
				+ 	"				</div>"
				+	"			</div>"
				+	"			<div class='row'>"
				+	"				<div class='col-md-4'>空气质量:</div>"
				+	"				<div class='col-md-6'>" 
				+	"					<span class='label  " + levelClass + "'>" + quality + "</span>"
				+ 	"				</div>"
				+	"			</div>"
				+	"		</div>"
				+	"		<div class='col-md-4'>"
				+	"			<div class='aqi-chart-btn' scode='" + stationCode + "'></div>"
				+	"		</div>"
				+	"	</div>"
				+	"</div>";

			// aqiStat3D = Radi.Earth.addBillboard(x,y,positionName,url);
			var color = MapCloud.getAQILevelColor(aqi);
			var z = parseInt(aqi) *60;
			x = parseFloat(x);
			y = parseFloat(y);
			if(x != 0 && y != 0 && z > 0){
				aqiStat3D = Radi.Earth.addCylinder(x,y,z,500,color);
				var labelText = positionName + " : " + aqi;
				Radi.Earth.addLabel(x,y,z/2+400, labelText);
				aqiStat3DList.push(aqiStat3D);
			}
		}

		this.panel.find(".aqi-stat-div").html(html);
		// Radi.Earth.zoom(aqiStat3DList);	


		// 定位
		this.panel.find(".aqi-stat a").click(function(){
			var x = $(this).parents(".board-title").attr("sx");
			var y = $(this).parents(".board-title").attr("sy");
			x = parseFloat(x);
			y = parseFloat(y);
			if(x != null && y != null && x != 0 && y != 0){
				var h = 30000;
				Radi.Earth.flyTo(x,y,h);
			}

		});

		// 弹出chart对话框
		var that = this;
		this.panel.find(".aqi-stat-div .aqi-chart-btn").click(function(){
			var stationCode = $(this).attr("scode");
			var stationName = $(this).parents(".aqi-stat-info").find(".aqi-stat a").html();
			// MapCloud.aqiChartDialog.showDialog(that.timepoint,stationCode,stationName);
			var statFilter = new GeoBeans.BinaryComparisionFilter();
			statFilter.operator = GeoBeans.ComparisionFilter.OperatorType.ComOprEqual;
			var prop = new GeoBeans.PropertyName();
			prop.setName(that.stationCodeField);
			var literal = new GeoBeans.Literal();
			literal.setValue(stationCode);
			statFilter.expression1 = prop;
			statFilter.expression2 = literal;

			MapCloud.aqiChartDialog.showDialog(that.timepoint,that.aqiStatFeatureType,stationName,statFilter);
		});
	},

	// 查询地名
	searchPlace : function(place){
		if(place == null){
			return;
		}

		this.getAddress(place,1);
	},

	getAddress : function(place,page){
		if(page < 0){
			return;
		}
		this.addressCurrentPage = page;
		var startIndex = (page -1)*this.poiPageCount;
		var endIndex = page *this.poiPageCount;
		Radi.Earth.cleanup();
		this.panel.find(".place-tab").empty();
		this.panel.find(".search-tab-div").removeClass("active");
		this.panel.find(".place-tab").addClass("active");
		this.panel.find(".place-tab").addClass("loading");
		MapCloud.addressService.getAddress(place,startIndex,endIndex,this.getPlace_callback);
	},

	getPlace_callback : function(addresses){
		var that = MapCloud.searchPanel;
		that.panel.find(".place-tab").removeClass("loading");
		if(!$.isArray(addresses)){
			return;
		}
		that.showPlaceResults(addresses);
		that.showPlaceIn3D(addresses);
	},



	// 显示结果
	showPlaceResults: function(addresses){
		// this.panel.find(".search-content-tab-div").hide();
		// this.panel.find(".result-div").show();
		var address = null;
		var html = "<div class='result-main-div'><ul>";
		for(var i = 0; i < addresses.length; ++i){
			address = addresses[i];
			if(address == null){
				continue;
			}
			
			html += "<li px='" + address.x + "' py='" + address.y + "'>"
				+	"	<div class='row'>" 
				+	"		<div class='col-md-2'>"
				+	"			<img src='../images/marker.png'>"
				+	"		</div>"
				+	"		<div class='col-md-10'>"
				+	"			<div class='row poi-name'>"
				+					address.address
				+	"			</div>"
				// +	"			<div class='row poi-address'>"
				// +	"				地址:"	+ address
				// +	"			</div>"
				+	"		</div>"
				+	"	</div>"
				+	"</li>";
		}
		html += "</ul></div>";
		html += "<ul class='pagination'>"
			+	"	<li class='pre-page'>上一页</li>"
			+	"	<li class='next-page'>下一页</li>"
			+	"</ul>";
		this.panel.find(".place-tab").html(html);
		
		this.panel.find(".place-tab .result-main-div ul li").click(function(){
			var x = $(this).attr("px");
			var y = $(this).attr("py");
			if(x != null && y != null){
				var h = 10000;
				Radi.Earth.flyTo(x,y,h);
			}
		});
		var that = this;
		// 上一页
		this.panel.find(".place-tab .pre-page").click(function(){
			if(that.addressCurrentPage <= 1){
				return;
			}
			var name = that.panel.find(".search-keyword").val();
			that.getAddress(name,that.addressCurrentPage -1);
		});

		this.panel.find(".place-tab .next-page").click(function(){
			var count = that.panel.find(".place-tab .result-main-div li").length;
			if(count < that.poiPageCount){
				return;
			}
			var name = that.panel.find(".search-keyword").val();
			that.getAddress(name,that.addressCurrentPage +1);
		});
	},

	// 绘制地名
	showPlaceIn3D : function(addresses){

		var url = "../images/marker.png";
		var address = null,name = null,x = null,y=null;
		var address3D = null;
		var addressList = [];
		for(var i = 0; 	i < addresses.length; ++i){
			address = addresses[i];
			if(address == null){
				continue;
			}
			
			x = address.x;
			y = address.y;
			name = address.address;
			
			address3D = Radi.Earth.addBillboard(x,y,name,url);
			addressList.push(address3D);
		}
		Radi.Earth.zoom(addressList);
	},

	// 展示经济数据
	showRangeChart : function(){
		if(this.chart == null){
			var server =  "/ows/" + this.userName + "/mgr";
			var baseLayerOption = {
				sourceName : "base",
				layerName : "prov_bount_4m",
				positionField : "name",
			};
			var chartLayerOption = {
				sourceName : "base",
				layerName : "china_econmic_2014",
				positionField : "省区市",
				chartField : "人口_万人"
			};

			var colorMapID = 12;
			var chart = new MapCloud.RangeChart(server,baseLayerOption,chartLayerOption,colorMapID);
			chart.show();
			this.chart = chart;
		}else{
			this.chart.cleanup();
			this.chart = null;
		}


	},

	// 展示全国的AQI图
	showAQIChart : function(){
		if(this.showAQIChartFlag){
			Radi.Earth.cleanup();
			this.showAQIChartFlag = false;
		}else{
			Radi.Earth.cleanup();
			var timepoint = this.timepoint;
			var timeFilter = new GeoBeans.BinaryComparisionFilter();
			timeFilter.operator = GeoBeans.ComparisionFilter.OperatorType.ComOprEqual;
			var prop = new GeoBeans.PropertyName();
			prop.setName(this.aqiTimeField);
			var literal = new GeoBeans.Literal();
			literal.setValue(timepoint);
			timeFilter.expression1 = prop;
			timeFilter.expression2 = literal;

			var fileds = ["aqi","area","x","y"];
			
			this.aqiRankingFeatureType.getFeaturesFilterAsync(null,this.sourceName,timeFilter,
				400,0,fileds,null,this.getAQIFeatures_callback);
		}
	},

	getAQIFeatures_callback : function(features){
		if(!$.isArray(features)){
			return;
		}
		var that = MapCloud.searchPanel;
		that.showAQIChartin3D(features);
	},

	// 在球上展示AQI
	showAQIChartin3D : function(features){
		if(features == null){
			return;
		}
		var feature = null, values = null;
		var areaFieldIndex = this.aqiRankingFeatureType.getFieldIndex(this.areaField);
		var aqiFieldIndex = this.aqiRankingFeatureType.getFieldIndex(this.aqiField);
		var statXFieldIndex = this.aqiRankingFeatureType.getFieldIndex(this.statXField);
		var statYFieldIndex = this.aqiRankingFeatureType.getFieldIndex(this.statYField);
		var area = null, aqi = null, x = null, y = null;
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
			area = values[areaFieldIndex];
			aqi = values[aqiFieldIndex];
			x = values[statXFieldIndex];
			x = parseFloat(x);
			y = values[statYFieldIndex];
			y = parseFloat(y);

			var color = MapCloud.getAQILevelColor(aqi);
			var z = parseInt(aqi) *1000;
			if(x != 0 && y != 0 && z != 0){
				// aqi3D =  g_earth_view.entities.add({
				// 	name : '',
				//     position: Cesium.Cartesian3.fromDegrees(x,y,1000),
				//     // box : {
				//     //     dimensions : new Cesium.Cartesian3(25000, 25000, z),
				//     //     material : color
				//     // },
				//     cylinder : {
				//         length : z,
				//         topRadius : 12000.0,
				//         bottomRadius : 12000.0,
				       
				//         material : color
				//     }
				// });
				aqi3D = Radi.Earth.addCylinder(x,y,z,12000,color);
				// var labelText = area + " : " + aqi;
				var labelText = aqi;
				Radi.Earth.addLabel(x,y,z/2+3000, labelText);
				aqi3DList.push(aqi3D);	
			}
					
		}
		// Radi.Earth.zoom(aqi3DList);	
		this.showAQIChartFlag = true;
	}



});