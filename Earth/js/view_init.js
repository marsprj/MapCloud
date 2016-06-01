
$().ready(function(){
	MapCloud.server = "/ows/user1/mgr";
	MapCloud.currentCity = "北京";
	MapCloud.aqiTimeLineChart = null;

	Radi.Earth.initEarth('earth_container');
	MapCloud.searchPanel = new MapCloud.SearchPanel("search_container");
	MapCloud.currentCityPanel = new MapCloud.CurrentCityPanel("city_container");
	MapCloud.cityPanel = new MapCloud.CityPanel("city_list_container");
	MapCloud.aqiChartDialog = new MapCloud.AQIChartDialog("aqi_chart_dialog","aqi_chart_container");
	MapCloud.positionControl = new MapCloud.PositionControl();
	MapCloud.positionPanel = new MapCloud.PositionPanel("position_container");
	MapCloud.cityPosition = new MapCloud.CityPosition();
	MapCloud.topicPanel = new MapCloud.TopicPanel("topic_container");
	MapCloud.projectPanel = new MapCloud.ProjectPanel("project_container");
	MapCloud.aqiTimeList = new MapCloud.AQITimeList(MapCloud.server);
	MapCloud.aqiTimelinePanel = new MapCloud.AQITimeLinePanel("aqi_timeline_container");
	MapCloud.aqi24TimelinePanel = new MapCloud.AQI24TimeLinePanel("aqi_24_timeline_container");
	MapCloud.chartPanel = new MapCloud.ChartPanel("chart_container");
	MapCloud.addressService = new MapCloud.AddressService();

	
	MapCloud.currentCity = "北京";



	var camera = Radi.Earth.camera();
	camera.setView({
   	 destination : Cesium.Cartesian3.fromDegrees(106,31.69,26221083)
	});



	// 日期相加
	MapCloud.dateAdd =  function(date,interval,units){
		var ret = new Date(date); //don't change original date
		switch(interval.toLowerCase()) {
			case 'year'   :  ret.setFullYear(ret.getFullYear() + units);  break;
			case 'quarter':  ret.setMonth(ret.getMonth() + 3*units);  break;
			case 'month'  :  ret.setMonth(ret.getMonth() + units);  break;
			case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
			case 'day'    :  ret.setDate(ret.getDate() + units);  break;
			case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
			case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
			case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
			default       :  ret = undefined;  break;
		}
		return ret;
	};

	MapCloud.dateFormat = function(date,fmt){ //author: meizz   
		var o = {   
			"M+" : date.getMonth()+1,                 //月份   
			"d+" : date.getDate(),                    //日   
			"h+" : date.getHours(),                   //小时   
			"m+" : date.getMinutes(),                 //分   
			"s+" : date.getSeconds(),                 //秒   
			"q+" : Math.floor((date.getMonth()+3)/3), //季度   
			"S"  : date.getMilliseconds()             //毫秒   
		};   
		if(/(y+)/.test(fmt))   
			fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));   
		for(var k in o)   
			if(new RegExp("("+ k +")").test(fmt))   
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
		return fmt;   
	};

	// 
	MapCloud.getAQILevelClass = function(aqi){
		if(!$.isNumeric(aqi)){
			return "label-aqi-level-1";
		}
		if(aqi <= 50 ){
			return "label-aqi-level-1";
		}else if(aqi > 50 && aqi <= 100){
			return "label-aqi-level-2";
		}else if(aqi > 100 && aqi <= 150){
			return "label-aqi-level-3";
		}else if(aqi > 150 && aqi <= 200){
			return "label-aqi-level-4";
		}else if(aqi > 200 && aqi <= 300){
			return "label-aqi-level-5";
		}else if(aqi > 300){
			return "label-aqi-level-6";
		}
	};

	MapCloud.getAQILevelColor  = function(aqi){
		if(!$.isNumeric(aqi)){
			return Cesium.Color.GREEN;
		}
		if(aqi <= 50 ){
			return Cesium.Color.GREEN;
		}else if(aqi > 50 && aqi <= 100){
			return Cesium.Color.YELLOW;
		}else if(aqi > 100 && aqi <= 150){
			return Cesium.Color.ORANGE;
		}else if(aqi > 150 && aqi <= 200){
			return Cesium.Color.RED;
		}else if(aqi > 200 && aqi <= 300){
			return Cesium.Color.PURPLE;
		}else if(aqi > 300){
			return Cesium.Color.BROWN;
		}		
	},

	MapCloud.getAQILevelColorAlpha  = function(aqi,alpha){

		if(!$.isNumeric(aqi)){
			return Cesium.Color.fromAlpha(Cesium.Color.GREEN, alpha);
		}
		if(aqi <= 50 ){
			return Cesium.Color.fromAlpha(Cesium.Color.GREEN, alpha);
		}else if(aqi > 50 && aqi <= 100){
			return Cesium.Color.fromAlpha(Cesium.Color.YELLOW, alpha);
		}else if(aqi > 100 && aqi <= 150){
			return Cesium.Color.fromAlpha(Cesium.Color.ORANGE, alpha);
		}else if(aqi > 150 && aqi <= 200){
			return Cesium.Color.fromAlpha(Cesium.Color.RED, alpha);
		}else if(aqi > 200 && aqi <= 300){
			return Cesium.Color.fromAlpha(Cesium.Color.PURPLE, alpha);
		}else if(aqi > 300){
			return Cesium.Color.fromAlpha(Cesium.Color.BROWN, alpha);
		}		
	}

});