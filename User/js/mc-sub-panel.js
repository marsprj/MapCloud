MapCloud.SubPanel = MapCloud.Class({
	panel : null,

	poiNames : null,

	aqiCitys : null,

	// 设置的AQI城市列表
	setAQICity : null,


	// 初始设置的城市
	citys : null,

	aqiCityLayer : "gc_aqi_city",

	sourceName : "base",

	// 城市名称字段
	aqiCityField : "name",

	featuretype : null,

	// 每页显示的最大条数
	maxCount : 10,

	// 页数
	pageCount : null,

	// 显示的页数
	pageNumber : 5,

	initialize : function(id){
		this.panel = $("#" + id);

		if(user != null && subManager != null){
			subManager.getSubscription(this.getSubscription_callback);
			// this.getSubscription();
			
		}

		this.registerPanelEvent();

		this.showAQIList();
	},

	registerPanelEvent : function(){
		var that = this;

		// // 选择城市
		// this.panel.find(".select-city").click(function(){
		// 	MapCloud.aqi_city_dialog.showDialog(that.aqiCitys,user.server);
		// });

		// 订阅
		this.panel.find(".btn-subscribe").click(function(){
			that.subscribe();
		});


		// 查询
		this.panel.find(".query-city").click(function(){
			var name = that.panel.find(".query-city-name").val();
			if(name == ""){
				MapCloud.notify.showInfo("请输出查询的城市名称","Warning");
				return;
			}

			that.getAQICityByName(name,that.getAQICityByName_callback);
		});
		

		// 返回列表
		this.panel.find(".return-list").click(function(){
			that.initPageControl(1,that.pageCount);
		});

		// 订阅
		this.panel.find(".btn-confirm").click(function(){
			if(!confirm("确定进行订阅吗？")){
				return;
			}
			that.setSelectAQICity(that.aqiCitys);
		});

		// 取消
		this.panel.find(".btn-cancel").click(function(){
			if(!confirm("确定取消修改吗？")){
				return;
			}
			subManager.getSubscription(that.getSubscription_callback);
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
		this.beforeCitys = aqiCitys.slice(0,aqiCitys.length);

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
		this.showSelectedCity(this.aqiCitys);
		// // 设置aqi
		// var html = "";
		// for(var i = 0; i < aqiCitys.length; ++i){
		// 	city = aqiCitys[i];
		// 	html += "<span class='label label-success aqi-city-label'>" + city + "</span>";
		// }
		// this.panel.find(".aqi-city").html(html);
	},

	// getSub_callback : function(){

	// },

	// 订阅AQI城市
	subscribeAQI_callback : function(result){
		var that = MapCloud.subPanel;
		MapCloud.notify.showInfo(result,"订阅AQI城市");
		subManager.getSubscription(that.getSubscription_callback);
	},

	// 对订阅和取消进行设置
	setSelectAQICity : function(citys){
		this.setAQICity = citys;

		// var html = "", city = null;
		// for(var i = 0; i < citys.length; ++i){
		// 	city = citys[i];
		// 	html += "<span class='label label-success aqi-city-label'>" + city + "</span>";
		// }
		// this.panel.find(".aqi-city").html(html);

		var city = null;
		var index = null;
		var subArray = [];
		for(var i = 0; i < citys.length; ++i){
			city = citys[i];
			index = this.beforeCitys.indexOf(city);
			if(index == -1){
				subArray.push(city);
			}
		}
		if(subArray.length != 0){
			subManager.subscribe("aqi",subArray,this.subscribeAQI_callback);	
		}

		for(var i = 0; i < this.beforeCitys.length; ++i){
			city = this.beforeCitys[i];
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


	showAQIList : function(){
		var workspace = new GeoBeans.WFSWorkspace("tmp",user.server,"1.0.0");
		this.featuretype = new GeoBeans.FeatureType(workspace, this.aqiCityLayer);

		this.getAQICitysCount();
	},

	getAQICitysCount : function(){
		this.featuretype.getFeatureFilterCountAsync(null,this.sourceName,null,null,this.getAQICitysCount_callback);
	},

	getAQICitysCount_callback : function(obj,count){
		// alert(count);

		var that = MapCloud.subPanel;
		var pageCount = Math.ceil(count/that.maxCount);
		that.pageCount = pageCount;

		that.initPageControl(1,that.pageCount);
	},

	// 初始化页码
	initPageControl : function(currentPage,pageCount){
		if(currentPage <=0 || currentPage > pageCount){
			return;
		}
		var html = "";
		// 前一页
		if(currentPage == 1){
			html += '<li class="disabled">'
				+ '		<a href="#" aria-label="Previous">'
				+ '			<span aria-hidden="true">«</span>'
				+ '		</a>'
				+ '	</li>';
		}else{
			html += '<li>'
				+ '		<a href="#" aria-label="Previous">'
				+ '			<span aria-hidden="true">«</span>'
				+ '		</a>'
				+ '	</li>';
		}
		// 如果页码总数小于要展示的页码，则每个都显示
		if(pageCount <= this.pageNumber){
			for(var i = 1; i <= pageCount; ++i){
				if(i == currentPage){
					html += '<li class="active">'
					+ 	'	<a href="#">' + currentPage.toString() 
					+ 	'		<span class="sr-only">(current)</span>'
					// + 	'		<span class="sr-only">(' + currentPage + ')</span>'
					+	'</a>'
					+ 	'</li>';
				}else{
					html += "<li>"
						+ "<a href='#'>" + i + "</a>"
						+ "</li>";	
				}
			}	
		}else{
			// 开始不变化的页码
			var beginEndPage = pageCount - this.pageNumber + 1;
			if(currentPage <= beginEndPage){
				for(var i = currentPage; i < currentPage + this.pageNumber;++i){
					if(i == currentPage){
						html += '<li class="active">'
						+ 	'	<a href="#">' + currentPage
						// + 	'		<span class="sr-only">(current)</span>'
						+	'</a>'
						+ 	'</li>';
					}else{
						html += "<li>"
							+ "<a href='#'>" + i + "</a>"
							+ "</li>";	
					}					
				}
			}else{
				for(var i = beginEndPage; i <= pageCount; ++i){
					if(i == currentPage){
						html += '<li class="active">'
						+ 	'	<a href="#">' + currentPage
						// + 	'		<span class="sr-only">(current)</span>'
						+	'</a>'
						+ 	'</li>';
					}else{
						html += "<li>"
							+ "<a href='#'>" + i + "</a>"
							+ "</li>";	
					}
				}
			}
		}

		// 最后一页
		if(currentPage == pageCount){
			html += '<li class="disabled">'
				+ '		<a href="#" aria-label="Next">'
				+ '			<span aria-hidden="true">»</span>'
				+ '		</a>'
				+ '	</li>';
		}else{
			html += '<li>'
				+ '		<a href="#" aria-label="Next">'
				+ '			<span aria-hidden="true">»</span>'
				+ '		</a>'
				+ '	</li>';
		}

		this.panel.find(".pagination").html(html);

		this.registerPageEvent();

		var offset = (currentPage-1) * this.maxCount
		this.getAQICityList(this.maxCount,offset);
	},
	getAQICityList : function(count,offset){
		MapCloud.notify.loading();
		// this.featuretype.getFeaturesFilterAsync(null,this.sourceName,null,count,offset,null,null,this.getAQICity_callback);
		this.featuretype.getFeaturesAsync(null,this.sourceName,count,offset,null,this.getAQICity_callback);
	},

	getAQICity_callback : function(list){
		MapCloud.notify.hideLoading();
		var that = MapCloud.subPanel;
		that.showAQICityList(list);
	},

	//  翻页事件
	registerPageEvent : function(){
		var that = this;
		this.panel.find(".pagination li a").click(function(){
			var active = that.panel.find(".pagination li.active a").html();
			var currentPage = parseInt(active);

			var label = $(this).attr("aria-label");
			if(label == "Previous"){
				currentPage = currentPage - 1;
			}else if(label == "Next"){
				currentPage = currentPage + 1;
			}else{
				currentPage = parseInt($(this).html());
			}
			
			that.initPageControl(currentPage,that.pageCount);
		});
	},	


	// 按照名称查询城市
	getAQICityByName : function(name,callback){
		if(name == null){
			return;
		}

		var filter = new GeoBeans.BinaryComparisionFilter();
		filter.operator = GeoBeans.ComparisionFilter.OperatorType.ComOprEqual;
		var prop = new GeoBeans.PropertyName();
		prop.setName(this.aqiCityField);
		var literal = new GeoBeans.Literal();
		literal.setValue(name);
		filter.expression1 = prop;
		filter.expression2 = literal;

		var xml = this.featuretype.buildGetFeatureFilterXML(null,this.sourceName,
		filter,null,null,null);

		var url = user.server;
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
				var features = that.featuretype.parseFeatures(xml);
				if(callback != undefined){
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

	getAQICityByName_callback : function(features){
		var that = MapCloud.subPanel;
		that.showAQICityList(features);
	},

	showAQICityList : function(list){
		var city = null;
		var values = null;
		var gid = null,name = null,pyname = null,type = null;
		var html = "";
		for(var i = 0; i < list.length; ++i){
			city = list[i];
			values = city.values;
			gid = values[0];
			name = values[1];
			pyname = values[2];
			type = values[4];

			var checked = false;
			var flag = this.aqiCitys.indexOf(name);
			if(flag != -1){
				checked = true;
			}
			html += "<div class='row' cname='" + name + "'>"
				+ 	"	<div class='col-md-1'>";
			if(checked){
				html += "		<input type='checkbox' checked>";
			}else{
				html += "		<input type='checkbox'>";
			}
				
				html+=	"	</div>"
				+	"	<div class='col-md-2'>" + gid + "</div>"
				+	"	<div class='col-md-3'>" + name + "</div>"
				+	"	<div class='col-md-4'>" + pyname + "</div>"
				+	"	<div class='col-md-2'>" + type + "</div>"
				+	"</div>";
		}
		this.panel.find(".aqi-city-list-div").html(html);


		var that = this;
		this.panel.find(".aqi-city-list-div input").change(function(){
			var checked = $(this).prop("checked");
			var name = $(this).parents(".row").attr("cname");
			// 选择
			if(checked){
				if(that.aqiCitys.indexOf(name) == -1){
					if(that.aqiCitys.length == 5){
						$(this).prop("checked",false);
						MapCloud.notify.showInfo("最多选择5个城市","Warning");
						return;
					}
					that.aqiCitys.push(name);
					that.showSelectedCity(that.aqiCitys);
				}
			}else{
				var index = that.aqiCitys.indexOf(name);
				if(index != -1){
					that.aqiCitys.splice(index,1);
					that.showSelectedCity(that.aqiCitys);
				}
			}
		});
	},
	
	// 显示已经选择的城市
	showSelectedCity : function(citys){
		var html = "";
		for(var i = 0; i < citys.length; ++i){
			city = citys[i];
			html += '<span class="label label-success aqi-city-label">'
				+	'	<span class="aqi-city-name">' + city + '</span>'
				+	'	<span aria-hidden="true">×</span>'
				+	'</span>';
		}
		this.panel.find(".aqi-city").html(html);

		var that = this;
		this.panel.find(".aqi-city .aqi-city-label").click(function(){
			var name = $(this).find(".aqi-city-name").html();
			var index = that.aqiCitys.indexOf(name);
			if(index == -1){
				return;
			}
			that.panel.find(".aqi-city-list-div .row[cname='" +  name + "'] input").prop("checked",false);
			that.aqiCitys.splice(index,1);
			that.showSelectedCity(that.aqiCitys);
		});		
	}

});