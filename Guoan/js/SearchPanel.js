MapCloud.SearchPanel = MapCloud.Class(MapCloud.Panel,{
	
	poiPageCount : 20,

	poiCurrentPage : null,

	// 标绘工具栏
	overlayControlPanel : null,

	trackOverlayControl : null,

	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		
		

		this.poiManager = user.getPoiManager();

		this.overlayControlPanel = $("#map_overlay_wrapper");

		this.trackOverlayControl = new GeoBeans.Control.TrackOverlayControl();
		if(mapObj != null){
			mapObj.controls.add(this.trackOverlayControl);	
		}

		this.registerEvent();
		mapObj.registerOverlayEvent();
	},

	registerEvent : function(){
		var that = this;

		// 切换面板
		this.panel.find(".menu li").click(function(){
			var sname = $(this).attr("sname");
			that.panel.find(".menu li").removeClass("active");
			$(this).addClass("active");
			that.overlayControlPanel.hide();

			that.panel.find(".search-tab-panel").hide();
			that.panel.find(".search-tab-panel[sname='" + sname + "']").show();

			if(sname == "overlay"){
				that.showOverlayPanel();
			}else{
				mapObj.unregisterOverlayEvent();
			}
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


		// 绘制点
		this.overlayControlPanel.find("#track_marker").each(function(){
			$(this).click(function(e){
				e.preventDefault();
				that.trackMarker();
			});
		});

		// 绘制线
		this.overlayControlPanel.find("#track_polyline").each(function(){
			$(this).click(function(e){
				e.preventDefault();
				that.trackPolyline();
			});
		});

		// 绘制面
		this.overlayControlPanel.find("#track_polygon").each(function(){
			$(this).click(function(e){
				e.preventDefault();
				that.trackPolygon();
			});
		});

		// 清空overlays
		this.panel.find(".remove-overlays").click(function(){
			if(!confirm("确定删除所有标注吗?")){
				return;
			}

			mapObj.clearOverlays();
			var overlays = mapObj.getOverlays();
			that.showOverlaysList(overlays);
		});

		// 删除overlay
		this.panel.find('.remove-overlay').click(function(){
			that.editOverlay.endEdit();
			mapObj.removeOverlayObj(that.editOverlay);
			that.editOverlay = null;
			that.panel.find(".overlay-tab-panel").hide();
			that.panel.find(".overlay-list-tab").show();
			var overlays = mapObj.getOverlays();
			that.showOverlaysList(overlays);		
		});

		// 返回overlay list
		this.panel.find(".return-overlay-list").click(function(){
			that.editOverlay.endEdit();
			that.editOverlay = null;
			that.panel.find(".overlay-tab-panel").hide();
			that.panel.find(".overlay-list-tab").show();
			var overlays = mapObj.getOverlays();
			that.showOverlaysList(overlays);		
		});

		// 保存overlay
		this.panel.find(".save-overlay").click(function(){
			that.editOverlay.removeKeys();
			var name = that.panel.find("#overlay_edit_name").val();
			that.panel.find("#overlay_edit_values_row li").each(function(){
				var key = $(this).find(".overlay_key input").val();
				var value = $(this).find(".overlay_value input").val();
				that.editOverlay.addKeyValue(key,value);
			});
			that.editOverlay.name = name;
			that.editOverlay.endEdit();
			that.editOverlay = null;
			var overlays = mapObj.getOverlays();
			that.showOverlaysList(overlays);			
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
			html += "<li pindex='" + i +"'>"
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

		// 定位
		this.panel.find(".result-main-div li").click(function(){
			var index = $(this).attr("pindex");
			var overlay = mapObj.getOverlay(index);
			mapObj.setFitView(overlay);
		});

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

    // 标绘面板
    showOverlayPanel : function(){
    	mapObj.clearOverlays();
    	this.overlayControlPanel.show();
    	this.trackMarker();
    	this.panel.find(".overlay-tab-panel").hide();
    	this.panel.find(".overlay-list-tab").show();
    },

	// 点
	trackMarker : function(){
		this.trackOverlayControl.trackMarker(this.callbackTrackOverlay);
	},

	// 线
	trackPolyline : function(){
		this.trackOverlayControl.trackLine(this.callbackTrackOverlay);
	},

	// 面
	trackPolygon : function(){
		this.trackOverlayControl.trackPolygon(this.callbackTrackOverlay);
	},

	callbackTrackOverlay : function(overlay){
		if(overlay == null){
			return;
		}
		var that = MapCloud.searchPanel;
		var overlays = mapObj.getOverlays();
		that.showOverlaysList(overlays);
	},

	showOverlaysList : function(overlays){
		if(overlays == null){
			return;
		}
		this.panel.find(".overlay-tab-panel").hide();
		this.panel.find(".overlay-list-tab").show();
		var overlay = null,name = null,type = null;
		var html = "";
		for(var i = 0; i < overlays.length; ++i){
			overlay = overlays[i];
			if(overlay == null){
				continue;
			}
			name = overlay.name;
			type = overlay.type;
			var typeHtml = this.getOverlayTypeSpanHtml(type);
			html += "<div class='row' oindex='" + i + "'>"
				+	"	<div class='col-md-2'>"
				+	typeHtml
				+	"	</div>"
				+	"	<div class='col-md-6'>"
				+	"		<span class='overlay-name'>" + name + "</span>"
				+	"	</div>"
				+	"	<div class='col-md-4'>"
				+	"		<a class='oper oper-edit-overlay' href='javascript:void(0)'>编辑</a>"
				+	"		<a class='oper oper-remove-overlay' href='javascript:void(0)'>删除</a>"
				+	"	</div>"
				+	"</div>";
		}
		this.panel.find(".overlay-list-div").html(html);

		// 删除overlay
		var that = this;
		this.panel.find(".overlay-list-div .oper-remove-overlay").click(function(){
			var name = $(this).parents(".row").find(".overlay-name").html();
			if(!confirm("确定要删除[" + name + "]吗?")){
				return;
			}
			var index = $(this).parents(".row").attr("oindex");
			mapObj.removeOverlay(parseInt(index));
			mapObj.draw();
			var overlays = mapObj.getOverlays();
			that.showOverlaysList(overlays);
		});

		// 编辑overlay
		this.panel.find(".overlay-list-div .oper-edit-overlay").click(function(){
			var index = $(this).parents(".row").attr("oindex");
			var overlay = mapObj.getOverlay(index);
			if(overlay == null){
				return;
			}
			that.editOverlay = overlay;
			that.showEditOverlayPanel(overlay);
			overlay.beginEdit();
			mapObj.setFitView(overlay);
		});
	},

	// 根据类型获取图标
	getOverlayTypeSpanHtml : function(type){
		var html = "";
		switch(type){
			case GeoBeans.Overlay.Type.MARKER:
				html = "<span class=' glyphicon "
					+   "glyphicon-map-marker span-overlay-marker'></span>";
				break;
			case GeoBeans.Overlay.Type.PLOYLINE:
				html = "<span class=' mc-icon "
					+	"mc-icon-line span-overlay-marker'></span>";
				break;
			case GeoBeans.Overlay.Type.POLYGON:
				html = "<span class=' glyphicon "
					+	"glyphicon-unchecked span-overlay-marker'></span>";
				break;
			default:
				html = "<span class=' glyphicon "
					+	"glyphicon-globe span-overlay-marker'></span>";
				break;
		}
		return html;
	},	

	showEditOverlayPanel : function(overlay){
		if(overlay == null){
			return;
		}

    	this.panel.find(".overlay-tab-panel").hide();
    	this.panel.find(".overlay-edit-tab").show();	

		// this.editOverlay = overlay.clone();
		this.editOverlay = overlay;
		var html = "";
		var name = overlay.name;
		var type = overlay.type;
		var typeHtml = this.getOverlayTypeSpanHtml(type);
		var kvMap = overlay.kvMap;
		var valuesHtml = this.getEditOverlayValuesHtml(kvMap);

		html = 	"<div class='row overlay-edit-name-row'>"
			+	"	<div class='input-group'>"
			+ 			"<span class='input-group-addon'>名称</span>"
			+	"	  <input type='text' class='form-control input-overlay-read' id='overlay_edit_name'"
			+	"		 value='" + name  + "'>"
			+	"	</div>"						
			+	"</div>	" 
			+ 	valuesHtml;
		this.panel.find(".overlay-edit-div").html(html);

		this.panel.find("[data-toggle='tooltip']").tooltip({container:'body'});

		//添加key/value
		var that = this;
		this.panel.find(".glyphicon-plus").each(function(){
			$(this).click(function(){
				var html = "<li class='row left_row'>"
					+	"	<div class='col-md-4 overlay_key'>"
					+	"		<input type='text' class='form-control' placeholder='key' value=''>"
					+	"	</div>"
					+	"	<div class='input-group col-md-8 overlay_value'>"
					+	"		<input type='text' class='form-control' placeholder='Value' value=''>"
					+	"		<span class='input-group-addon glyphicon glyphicon-trash span-overlay-marker'></span>"
					+	"	</div>"
					+	"</li>";
				that.panel.find("#overlay_edit_values_row").append(html);
				that.panel.find(".glyphicon-trash").each(function(){
					$(this).click(function(){
						$(this).parents("li").remove();
					});
				});				
			});
		});	 

		// 删除一行
		this.panel.find(".glyphicon-trash").each(function(){
			$(this).click(function(){
				$(this).parents("li").remove();
			});
		});   		
	},
	getEditOverlayValuesHtml : function(kvMap){
		var html =  "<div class='row left_row_wrapper' id='overlay_add_value_row'>"
				+	"	 <button type='button' class='btn glyphicon glyphicon-plus "
				+	"		col-md-4 col-md-offset-4' data-toggle='tooltip' data-placement='top' data-original-title='添加属性'></button>"
				+	"</div>"
				+	"<ul class='row left_row_wrapper' id='overlay_edit_values_row'>";
		for(var key in kvMap){
			var value = kvMap[key];
			html += "<li class='row left_row'>"
				+	"	<div class='col-md-4 overlay_key'>"
				+	"		<input type='text' class='form-control' value='" + key + "'>"
				+	"	</div>"
				+	"	<div class='input-group col-md-8 overlay_value'>"
				+	"		<input type='text' class='form-control' value='" + value + "'>"
				+	"		<span class='input-group-addon glyphicon glyphicon-trash span-overlay-marker'></span>"
				+	"	</div>"
				+	"</li>";
		}
		html += "</ul>";
		return html;
	},

});