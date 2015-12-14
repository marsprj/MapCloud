MapCloud.CityPosition = MapCloud.Class({
	// 城市列表
	cityList : null,

	initialize : function(){
		this.cityList = [
			{
				"name" 	: "合肥",
				"lon" 	: 117.275703,
				"lat" 	: 31.863255
			},{
				"name" 	: "安庆",
				"lon" 	: 117.034431,
				"lat" 	: 30.512646
			},{
				"name" 	: "蚌埠",
				"lon"	: 117.361382,
				"lat"	: 32.939243
			},{
				"name" 	: "亳州",
				"lon"	: 115.770900,
				"lat"	: 33.879292
			},{
				"name" 	: "池州",
				"lon"	: 117.487494,
				"lat"	: 30.668548
			},{
				"name" 	: "滁州",
				"lon"	: 118.301163,
				"lat"	: 32.316532
			},{
				"name" 	: "阜阳",
				"lon"	: 115.809731,
				"lat"	: 32.902206
			},{
				"name" 	: "淮北",
				"lon"	: 116.787498,
				"lat"	: 33.970490
			},{
				"name" 	: "淮南",
				"lon"	: 117.02072,
				"lat"	: 32.616695
			},{
				"name" 	: "黄山",
				"lon"	: 118.309067,
				"lat"	: 29.720844
			},{
				"name" 	: "六安",
				"lon"	: 116.492790,
				"lat"	: 31.753523
			},{
				"name" 	: "马鞍山",
				"lon"	: 118.480713,
				"lat"	: 31.724924
			},{
				"name" 	: "宿州",
				"lon"	: 116.970154,
				"lat"	: 33.640133
			},{
				"name" 	: "铜陵",
				"lon"	: 117.813179,
				"lat"	: 30.925247
			},{
				"name" 	: "芜湖",
				"lon"	: 118.359833,
				"lat"	: 31.334496
			},{
				"name" 	: "宣城",
				"lon"	: 118.73,
				"lat"	: 30.965
			},{
				"name" 	: "福州",
				"lon"	: 119.297813,
				"lat"	: 26.078590
			},{
				"name" 	: "龙岩",
				"lon"	: 117.030388,
				"lat"	: 25.109703
			},{
				"name" 	: "南平",
				"lon"	: 118.169121,
				"lat"	: 26.644842
			},{
				"name" 	: "宁德",
				"lon"	: 119.518318,
				"lat"	: 26.666477
			},{
				"name" 	: "莆田",
				"lon"	: 119.010323,
				"lat"	: 25.438137
			},{
				"name" 	: "泉州",
				"lon"	: 118.589638,
				"lat"	: 24.915918
			},{
				"name" 	: "三明",
				"lon"	: 117.601227,
				"lat"	: 26.223013
			},{
				"name" 	: "厦门",
				"lon"	: 118.087517,
				"lat"	: 24.457436
			},{
				"name" 	: "漳州",
				"lon"	: 117.653091,
				"lat"	: 24.518164
			},{
				"name" 	: "广州",
				"lon"	: 113.261429,
				"lat"	: 23.118912
			},{
				"name" 	: "潮州",
				"lon"	: 116.636660,
				"lat"	: 23.667706
			},{
				"name" 	: "东莞",
				"lon"	: 113.748772,
				"lat"	: 23.048536
			},{
				"name" 	: "佛山",
				"lon"	: 113.114517,
				"lat"	: 23.034878
			},{
				"name" 	: "河源",
				"lon"	: 114.693817,
				"lat"	: 23.734840
			},{
				"name" 	: "惠州",
				"lon"	: 114.392403,
				"lat"	: 23.087957
			},{
				"name" 	: "江门",
				"lon"	: 113.084747,
				"lat"	: 22.591190
			},{
				"name" 	: "揭阳",
				"lon"	: 116.349770,
				"lat"	: 23.542976
			},{
				"name" 	: "茂名",
				"lon"	: 110.888847,
				"lat"	: 21.670717
			},{
				"name" 	: "梅州",
				"lon"	: 116.107941,
				"lat"	: 24.314501
			},{
				"name" 	: "清远",
				"lon"	: 113.021263,
				"lat"	: 23.719597
			},{
				"name" 	: "汕头",
				"lon"	: 116.683800,
				"lat"	: 23.362692
			},{
				"name" 	: "汕尾",
				"lon"	: 115.364014,
				"lat"	: 22.778687
			},{
				"name" 	: "韶关",
				"lon"	: 113.605392,
				"lat"	: 24.808777
			},{
				"name" 	: "深圳",
				"lon"	: 114.110672,
				"lat"	: 22.556396
			},{
				"name" 	: "阳江",
				"lon"	: 111.957893,
				"lat"	: 21.845234
			},{
				"name" 	: "云浮",
				"lon"	: 112.039990,
				"lat"	: 22.933193
			},{
				"name" 	: "湛江",
				"lon"	: 110.399223,
				"lat"	: 21.194998
			},{
				"name" 	: "肇庆",
				"lon"	: 112.451408,
				"lat"	: 23.057882
			},{
				"name" 	: "中山",
				"lon"	: 113.371452,
				"lat"	: 22.526854
			},{
				"name" 	: "珠海",
				"lon"	: 113.568260,
				"lat"	: 22.272589
			},{
				"name" 	: "南宁",
				"lon"	: 108.311768,
				"lat"	: 22.806543
			},{
				"name" 	: "百色",
				"lon"	: 106.612106,
				"lat"	: 23.901583
			},{
				"name" 	: "北海",
				"lon"	: 109.119171,
				"lat"	: 21.479797
			},{
				"name" 	: "崇左",
				"lon"	: 107.355060,
				"lat"	: 22.420197
			},{
				"name" 	: "防城港",
				"lon"	: 108.362153,
				"lat"	: 21.691939
			},{
				"name" 	: "桂林",
				"lon"	: 110.286682,
				"lat"	: 25.281883
			},{
				"name" 	: "河池",
				"lon"	: 108.051628,
				"lat"	: 24.696892
			},{
				"name" 	: "贺州",
				"lon"	: 111.549191,
				"lat"	: 24.404280
			},{
				"name" 	: "来宾",
				"lon"	: 109.232940,
				"lat"	: 23.731440
			},{
				"name" 	: "柳州",
				"lon"	: 109.402809,
				"lat"	: 24.310406
			},{
				"name" 	: "钦州",
				"lon"	: 108.614700,
				"lat"	: 21.949869
			},{
				"name" 	: "梧州",
				"lon"	: 111.305946,
				"lat"	: 23.486620
			},{
				"name" 	: "玉林",
				"lon"	: 110.141472,
				"lat"	: 22.631897
			},{
				"name" 	: "贵阳",
				"lon"	: 106.711372,
				"lat"	: 26.576874
			},{
				"name" 	: "安顺",
				"lon"	: 105.926071,
				"lat"	: 26.244259
			},{
				"name" 	: "毕节",
				"lon"	: 105.282417,
				"lat"	: 27.306295
			}
			// 	"name" 	: "六盘水",
			// 	"lon"	: ,
			// 	"lat"	: 
			// },{
			// 	"name" 	: "黔东南州",
			// 	"lon"	: ,
			// 	"lat"	: 
			// },{
			// 	"name" 	: "黔南州",
			// 	"lon"	: ,
			// 	"lat"	: 
			// },{
			// 	"name" 	: "黔西南州",
			// 	"lon"	: ,
			// 	"lat"	: 
			// },{
			// 	"name" 	: "铜仁",
			// 	"lon"	: ,
			// 	"lat"	: 
			// },{
			// 	"name" 	: "遵义",
			// 	"lon"	: ,
			// 	"lat"	: 
			// },{
			// 	"name" 	: "",
			// 	"lon"	: ,
			// 	"lat"	: 
			// },{
			// 	"name" 	: "",
			// 	"lon"	: ,
			// 	"lat"	: 
			// },{
			// 	"name" 	: "",
			// 	"lon"	: ,
			// 	"lat"	: 
			// },{
			// 	"name" 	: "",
			// 	"lon"	: ,
			// 	"lat"	: 
			// },{
			// 	"name" 	: "",
			// 	"lon"	: ,
			// 	"lat"	: 
			// },{
			// 	"name" 	: "",
			// 	"lon"	: ,
			// 	"lat"	: 
			// },{
			// 	"name" 	: "",
			// 	"lon"	: ,
			// 	"lat"	: 
			// },{
			// 	"name" 	: "",
			// 	"lon"	: ,
			// 	"lat"	: 
			// },{
			// 	"name" 	: "",
			// 	"lon"	: ,
			// 	"lat"	: 
			// },{
			// 	"name" 	: "",
			// 	"lon"	: ,
			// 	"lat"	: 
			// }
		]
	},


	getCityPosition : function(name){
		if(name == null){
			return null;
		}
		var cityObj = null,cityName = null,lon = null, lat = null;
		for(var i = 0; i < this.cityList.length; ++i){
			cityObj = this.cityList[i];
			cityName = cityObj.name;
			if(cityName == name){
				lon = cityObj.lon;
				lat = cityObj.lat;

				return {
					lon : lon,
					lat : lat
				};
			}
		}
		return null;
	},
});