MapCloud.AQIFeaturesDialog = MapCloud.Class(MapCloud.Dialog,{
	
	// 每页显示的最大条数
	maxCount : 30,

	// 页数
	pageCount : null,

	// 显示的页数
	pageNumber : 5,

	// aqi要素
	features : null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this,arguments);

		var dialog = this;

		// this.registerPanel
	},

	// showDialog : function(){

	// },

	cleanup : function(){
		this.panel.find("table tbody").empty();
		this.panel.find(".aqi-count span").html("0");
		this.panel.find(".pagination").empty();	
	},

	setAqiFeatures : function(aqiFeatures){
		if(!$.isArray(aqiFeatures)){
			return;
		}
		this.features = aqiFeatures;
		var count = aqiFeatures.length;
		var pageCount = Math.ceil(count/this.maxCount);
		this.pageCount = pageCount;
		this.initPageControl(1,this.pageCount);
		this.panel.find(".aqi-count span").html(count);
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

		// var offset = (currentPage-1) * this.maxCount;
		var index = (currentPage-1) * this.maxCount;
		var features = this.features.slice(index,index+this.maxCount-1);
		this.displayFeatures(features);
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

	displayFeatures : function(features){
		if(!$.isArray(features)){
			return;
		}

		var featureType = features[0].featureType;
		if(featureType == null){
			return;
		}

		var xFieldIndex = featureType.getFieldIndex("x");
		var yFieldIndex = featureType.getFieldIndex("y");

		var f = null;
		var xValue = null;
		var yValue = null;
		var values = null;
		var html = "";
		for(var i = 0; i < features.length; ++i){
			f = features[i];
			if(f == null){
				continue;
			}
			values = f.values;
			if(values == null){
				continue;
			}
			xValue = values[xFieldIndex];
			yValue = values[yFieldIndex];

			if(xValue == null || yValue == null || (xValue == '0' && yValue == '0')){
				continue;
			}
			html += "<tr>"
				+	"	<td>" + values[0]  + "</td>"
				+	"	<td>" + values[1]  + "</td>"
				+	"	<td>" + values[2]  + "</td>"
				+	"	<td>" + values[3]  + "</td>"
				+	"	<td>" + values[4]  + "</td>"
				+	"	<td>" + values[5]  + "</td>"
				+	"	<td>" + values[6]  + "</td>"
				+	"	<td>" + values[7]  + "</td>"
				+	"	<td>" + values[8]  + "</td>"
				+	"	<td>" + values[9]  + "</td>"
				+	"	<td>" + values[10]  + "</td>"
				+	"	<td>" + values[11]  + "</td>"
				+	"	<td>" + values[12]  + "</td>"
				+	"	<td>" + values[13]  + "</td>"
				+	"	<td>" + values[14]  + "</td>"
				+	"	<td>" + values[15]  + "</td>"
				+	"	<td>" + values[16]  + "</td>"
				+	"	<td>" + values[17]  + "</td>"
				+	"	<td>" + values[18]  + "</td>"
				+	"	<td>" + values[19]  + "</td>"
				+	"	<td>" + values[20]  + "</td>"
				+	"	<td class='xvalue'>" + values[21]  + "</td>"
				+	"	<td class='yvalue'>" + values[22]  + "</td>"
				+	"</tr>";
		}
		this.panel.find("table tbody").html(html);

	},


});