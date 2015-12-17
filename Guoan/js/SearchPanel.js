MapCloud.SearchPanel = MapCloud.Class(MapCloud.Panel,{
	
	poiPageCount : 20,

	poiCurrentPage : null,

	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		
		this.registerEvent();

		this.poiManager = user.getPoiManager();

	},

	registerEvent : function(){
		var that = this;

		// 切换面板
		this.panel.find(".menu li").click(function(){
			var sname = $(this).attr("sname");
			that.panel.find(".menu li").removeClass("active");
			$(this).addClass("active");

			that.panel.find(".search-tab-panel").hide();
			that.panel.find(".search-tab-panel[sname='" + sname + "']").show();
		});

		// 查看poi
		this.panel.find(".search-panel .search-btn").click(function(){
			var text = that.panel.find(".search-keyword").val();
			if(text == ""){
				return;
			}
			that.searchPoi([text]);
		});

		// 显示删除按钮
		this.panel.find(".search-keyword").on("input",function(e){
			var keyword = $(this).val();
			if(keyword.length > 0){
				that.panel.find(".remove-poi-search").show();
			}else{
				that.panel.find(".remove-poi-search").hide();
			}
		});

		// 删除搜索结果
		this.panel.find(".remove-poi-search").click(function(){
			$(this).hide();
			that.clearPoiSearch();
		});
	},

	searchPoi : function(keyword){
		if(keyword == null){
			return;
		}
		this.keyword = keyword;
		this.poiCurrentPage = 0;
		this.searchPoiByPage(keyword,this.poiCurrentPage);
	},

	searchPoiByPage : function(keyword,page){
		if(page < 0 || keyword == null){
			return;
		}
		this.panel.find(".result-content-div .pagination").remove();
		this.panel.find(".result-main-div").empty();
		mapObj.clearOverlays();
		var offset = page * this.poiPageCount;
		this.poiManager.getPoi(keyword,this.poiPageCount,offset,null,this.searchPoi_callback);

	},	

	searchPoi_callback : function(features){
		// console.log(features.length);
		if(!$.isArray(features)){
			return;
		}
		var that = MapCloud.searchPanel;
		that.showPoiResults(features);
		that.showPoiInMap(features);
	},

	showPoiResults : function(pois){
		if(pois == null){
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
				var obj = this.mercator2lonlat(x,y);
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

		var pageHtml = '<ul class="pagination">'
					+	'	<li class="pre-page">上一页</li>'
					+	'	<li class="next-page">下一页</li>'
					+	'</ul>';
		this.panel.find(".result-main-div").after(pageHtml);

		var that = this;
		// 上一页
		this.panel.find(".result-content-div .pre-page").click(function(){
			var page = that.poiCurrentPage;
			if(page <= 0){
				return;
			}
			that.poiCurrentPage = page - 1;
			that.searchPoiByPage(that.keyword,that.poiCurrentPage);
		});
		// 下一页
		this.panel.find(".result-content-div .next-page").click(function(){
			var count = that.panel.find(".result-main-div li").length;
			if(count < that.poiPageCount){
				return;
			}
			var page = that.poiCurrentPage;
			that.poiCurrentPage = page + 1;
			that.searchPoiByPage(that.keyword,that.poiCurrentPage);
		});	

	},

	// 墨卡托转经纬度
    mercator2lonlat : function(x,y){
        var lonlat={x:0,y:0};   
        var x = x/20037508.34*180; 
        var y = y/20037508.34*180; 
        y= 180/Math.PI*(2*Math.atan(Math.exp(y*Math.PI/180))-Math.PI/2);
        lonlat.x = x;
        lonlat.y = y;
        return lonlat;
    },


    showPoiInMap : function(pois){

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
				var obj = this.mercator2lonlat(x,y);
				x = obj.x;
				y = obj.y;
			}
			address = poi.address;
			var pt = new GeoBeans.Geometry.Point(x,y);
			var symbolizer = this.getSymbolizer("point");
			var marker = new GeoBeans.Overlay.Marker("maker",pt,symbolizer);
			mapObj.addOverlay(marker);
		}
		mapObj.draw();
    },
    getSymbolizer : function(type){
    	if(type == "point"){
    		var symbolizer = new GeoBeans.Symbolizer.PointSymbolizer();
			symbolizer.icon_url = "../images/marker.png";
			symbolizer.icon_offset_x = 0;
			symbolizer.icon_offset_y = 0;
			return symbolizer;
    	}
    },

    clearPoiSearch : function(){
    	if(mapObj != null){
    		mapObj.clearOverlays();
    	}
    	this.panel.find(".result-content-div .pagination").remove();
		this.panel.find(".result-main-div").empty();
		this.poiCurrentPage = null;
		this.panel.find(".search-keyword").val("");
    },


});