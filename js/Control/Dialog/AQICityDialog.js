MapCloud.AQICityDialog = MapCloud.Class(MapCloud.Dialog,{
	
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
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		this.registerPanelEvent();	
	},


	showDialog : function(citys,server){
		MapCloud.Dialog.prototype.showDialog.apply(this, arguments);

		this.server = server;
		this.citys = $.isArray(citys) ? citys.slice() : [];

		var workspace = new GeoBeans.WFSWorkspace("tmp",this.server,"1.0.0");
		this.featuretype = new GeoBeans.FeatureType(workspace, this.aqiCityLayer);

		this.getAQICitysCount();

		this.showSelectedCity(this.citys);
	},

	registerPanelEvent : function(){
		var dialog = this;

		// 确定
		this.panel.find(".btn-confirm").click(function(){
			var citys = dialog.citys;
			var that = MapCloud.subPanel;
			// subManager.subscribe("aqi",citys,that.subscribeAQI_callback);
			that.setSelectAQICity(citys);
			dialog.closeDialog();
		});

		// 查询
		this.panel.find(".query-city").click(function(){
			var name = dialog.panel.find(".query-city-name").val();
			if(name == ""){
				MapCloud.notify.showInfo("请输出查询的城市名称","Warning");
				return;
			}

			dialog.getAQICityByName(name,dialog.getAQICityByName_callback);
		});

		// 返回列表
		this.panel.find(".return-list").click(function(){
			dialog.initPageControl(1,dialog.pageCount);
		});
	},

	// 设置选择的城市
	showSelectedCity : function(citys){
		if(!$.isArray(citys)){
			return;
		}
		var city = null;
		var html = "";
		for(var i = 0 ; i < citys.length; ++i){
			city = citys[i];
			html += "<span class='label label-success aqi-city-label'>"
				+	"	<span class='aqi-city-name'>" + city + "</span>"
				+	"	<span aria-hidden='true'>×</span>"
				+	"</span>";
		}
		this.panel.find(".selected-city-div").html(html);

		var dialog = this;
		this.panel.find(".selected-city-div .aqi-city-label").click(function(){
			var name = $(this).find(".aqi-city-name").html();
			var index = dialog.citys.indexOf(name);
			if(index == -1){
				return;
			}
			dialog.panel.find(".aqi-city-list-div .row[cname='" +  name + "'] input").prop("checked",false);
			dialog.citys.splice(index,1);
			dialog.showSelectedCity(dialog.citys);
		});
	},


	getAQICitysCount : function(){
		this.featuretype.getFeatureFilterCountAsync(null,this.sourceName,null,null,this.getAQICitysCount_callback);
	},

	getAQICitysCount_callback : function(obj,count){
		// alert(count);

		var dialog = MapCloud.aqi_city_dialog;
		var pageCount = Math.ceil(count/dialog.maxCount);
		dialog.pageCount = pageCount;

		dialog.initPageControl(1,dialog.pageCount);
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
		// this.featuretype.getFeaturesFilterAsync(null,this.sourceName,null,count,offset,null,null,this.getAQICity_callback);
		this.featuretype.getFeaturesAsync(null,this.sourceName,count,offset,null,this.getAQICity_callback);
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


	getAQICity_callback : function(list){
		var dialog = MapCloud.aqi_city_dialog;
		dialog.showAQICityList(list);
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
			var flag = this.citys.indexOf(name);
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


		var dialog = this;
		this.panel.find(".aqi-city-list-div input").change(function(){
			var checked = $(this).prop("checked");
			var name = $(this).parents(".row").attr("cname");
			// 选择
			if(checked){
				if(dialog.citys.indexOf(name) == -1){
					if(dialog.citys.length == 5){
						$(this).prop("checked",false);
						MapCloud.notify.showInfo("最多选择5个城市","Warning");
						return;
					}
					dialog.citys.push(name);
					dialog.showSelectedCity(dialog.citys);
				}
			}else{
				var index = dialog.citys.indexOf(name);
				if(index != -1){
					dialog.citys.splice(index,1);
					dialog.showSelectedCity(dialog.citys);
				}
			}
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
		var dialog = MapCloud.aqi_city_dialog;
		dialog.showAQICityList(features);
	},
});