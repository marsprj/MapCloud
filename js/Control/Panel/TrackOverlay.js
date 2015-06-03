// 标注
MapCloud.TrackOverlay = MapCloud.Class({
	// 左侧panel
	panel: null,

	// 控制工具条
	controlPanel : null,

	// 绘制control
	trackOverlayControl : null,
	
	// 编辑的标注
	editOverlay : null,


	initialize : function(id,control_id){
		this.panel = $("#" + id);
		this.controlPanel = $("#" + control_id);

		var that = this;

		// 绘制点
		this.controlPanel.find("#track_marker").each(function(){
			$(this).click(function(e){
				e.preventDefault();
				$(this).toggleClass("normal");
				that.trackMarker();
			});
		});

		// 绘制线
		this.controlPanel.find("#track_polyline").each(function(){
			$(this).click(function(e){
				e.preventDefault();
				that.trackPolyline();
			});
		});

		// 绘制面
		this.controlPanel.find("#track_polygon").each(function(){
			$(this).click(function(e){
				e.preventDefault();
				that.trackPolygon();
			});
		});

	},

	// 显示
	show : function(){
		if(mapObj == null){
			return;
		}
		if(this.panel.css("display") == "block" 
			&& this.controlPanel.css("display") == "block"){
			return;
		}
		if(MapCloud.refresh_panel ==null){
			MapCloud.refresh_panel = new MapCloud.refresh("left_panel");
		}
		if(this.trackOverlayControl == null){
			this.trackOverlayControl = new GeoBeans.Control.TrackOverlayControl();
			mapObj.controls.add(this.trackOverlayControl);			
		}	

		mapObj.registerOverlayEvent();

		MapCloud.refresh_panel.hide();

		this.panel.css({"display":"block","opacity":"0"}).animate({"opacity": "1"}, 1000);
		this.controlPanel.css({"display":"block","opacity":"0"}).animate({"opacity": "1"}, 1000);
		// this.controlPanel.css("display","block");
		var overlays = mapObj.getOverlays();
		this.showOverlaysList(overlays);		
	},

	// 隐藏
	hide : function(){
		MapCloud.refresh_panel.show();
		this.panel.css("display","none");
		this.controlPanel.css("display","none");
		mapObj.unregisterOverlayEvent();		
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
		if(overlay == null && MapCloud.overlay_panel.editOverlay == null){
			var overlays = mapObj.getOverlays();
			MapCloud.overlay_panel.showOverlaysList(overlays);
			return;
		}else if(overlay == null && MapCloud.overlay_panel.editOverlay != null){
			return;
		}
		var isEdit = overlay.isEdit;
		if(isEdit){
			MapCloud.overlay_panel.showEditOverlay(overlay);
		}else{
			MapCloud.overlay_panel.showHitOverlay(overlay);
		}
	},

	// 显示待编辑的标注
	showEditOverlay : function(overlay){
		if(overlay == null){
			return;
		}
		// this.editOverlay = overlay.clone();
		this.editOverlay = overlay;
		var html = "";
		var name = overlay.name;
		var type = overlay.type;
		var typeHtml = this.getOverlayTypeSpanHtml(type);
		var kvMap = overlay.kvMap;
		var valuesHtml = this.getEditOverlayValuesHtml(kvMap);

		html =  "<div class=\"row left_row\">"
			+	"	<button type=\"button\" class=\"btn btn-default col-md-offset-3 btn-cancel\">撤销</button>"
			+	"	<button type=\"button\" class=\"btn btn-primary btn-confirm col-md-offset-1\">保存</button>"
			+	"</div>"
			+	"<div class=\"row left_row_wrapper left_row_title\">"
			+  	"	<div class=\"col-md-3 left_row_title\">名称</div>"
			+	"</div>"
			+	"<div class=\"row left_row overlay_row\">"
			+	"	<div class=\"input-group\">"
			+ 			typeHtml
			+	"	  <input type=\"text\" class=\"form-control input-overlay-read\" id=\"overlay_edit_name\""
			+	"		 value=\"" + name  + "\">"
			+	"	</div>"						
			+	"</div>	" 
			+ 	"<div class=\"row left_row_wrapper left_row_title\">"
			+	"	<div class=\"col-md-3 left_row_title\">属性</div>"
			+	"</div>"
			+ 	valuesHtml;
		this.panel.html(html);

		//添加key/value
		var that = this;
		this.panel.find(".glyphicon-plus").each(function(){
			$(this).click(function(){
				var html = "<li class=\"row left_row\">"
					+	"	<div class=\"col-md-4 overlay_key\">"
					+	"		<input type=\"text\" class=\"form-control\" placeholder=\"key\" value=\"\">"
					+	"	</div>"
					+	"	<div class=\"input-group col-md-8 overlay_value\">"
					+	"		<input type=\"text\" class=\"form-control\" placeholder=\"Value\" value=\"\">"
					+	"		<span class=\"input-group-addon glyphicon glyphicon-trash span-overlay-marker\"></span>"
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

		this.panel.find(".glyphicon-trash").each(function(){
			$(this).click(function(){
				$(this).parents("li").remove();
			});
		});


		// 撤销
		this.panel.find(".btn-cancel").each(function(){
			$(this).click(function(){
				that.editOverlay.endEdit();
				that.editOverlay = null;
				// mapObj.draw();
				var overlays = mapObj.getOverlays();
				that.showOverlaysList(overlays);
			});
		});
		// 保存
		this.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				// var geometry = that.editOverlay.geometry;
				// var symbolizer = that.editOverlay.symbolizer;
				that.editOverlay.removeKeys();
				var name = that.panel.find("#overlay_edit_name").val();
				// var overlay = new GeoBeans.Overlay(name,geometry,symbolizer);
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
		});

	},


	// 显示鼠标获取到的标注
	showHitOverlay : function(overlay){
		if(this.editOverlay != null){
			return;
		}

		var html = "";
		var type = overlay.type;
		var typeHtml = this.getOverlayTypeSpanHtml(type);
		var name = overlay.name;
		var kvMap = overlay.kvMap;
		var valuesHtml = this.getHitOverlayValuesHtml(kvMap);

		html += "<div class=\"row left_row_wrapper left_row_title\">"
			+  	"	<div class=\"col-md-3 left_row_title\">名称</div>"
			+	"</div>"
		 	+	"<div class=\"row left_row overlay_row\">"
			+	"	<div class=\"input-group\">"
			+ 			typeHtml
			+	"	  <input type=\"text\" class=\"form-control input-overlay-read\" "
			+	"		 value=\"" + name  + "\" readonly>"
			+	"	</div>"						
			+	"</div>	"
			+ 	"<div class=\"row left_row_wrapper left_row_title\">"
			+	"	<div class=\"col-md-3 left_row_title\">属性</div>"
			+	"</div>"
			+ 	valuesHtml;
		this.panel.html(html);
	},

	// 显示标注列表
	showOverlaysList : function(overlays){
		var that = this;
		var html = 	"<div class=\"row left_row_wrapper\" style=\"margin-top: 10px\">"
				+	"	<button type=\"button\" class=\"btn btn-default col-md-offset-3 btn-cancel\">清空</button>"
				+	"	<button type=\"button\" class=\"btn btn-primary btn-confirm col-md-offset-1\">返回</button>"
				+	"</div>";
		html += "<ul class=\"row left_row_wrapper\" id=\"overlays_row\">";
		for(var i = 0; i < overlays.length;++i){
			var overlay = overlays[i];
			if(overlay == null){
				continue;
			}
			var overlayHtml = this.showOverlay(overlay,i);
			html += overlayHtml;
		}
		html += "</ul>";
		this.panel.html(html);

		this.panel.find("#overlays_row .input-group").mouseover(function(){
			$(this).find(".input-group-btn").css("display","table-cell");
		});
		this.panel.find("#overlays_row .input-group").mouseout(function(){
			$(this).find(".input-group-btn").css("display","none");
		});

		// 编辑
		this.panel.find(".btn-edit").each(function(){
			$(this).click(function(){
				var index = $(this).parents(".overlay_row").attr("value");
				var overlay = mapObj.getOverlay(parseInt(index));
				that.showEditOverlay(overlay);
				overlay.beginEdit();
				mapObj.setFitView(overlay);
			});
		});

		// 删除
		this.panel.find(".btn-remove").each(function(){
			$(this).click(function(){
				var index = $(this).parents(".overlay_row").attr("value");
				mapObj.removeOverlay(parseInt(index));
				mapObj.draw();
				var overlays = mapObj.getOverlays();
				that.showOverlaysList(overlays);
			});
		});

		this.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				that.hide();			
			});
		});
		this.panel.find(".btn-cancel").each(function(){
			$(this).click(function(){
				var ret = confirm("确定清空标注吗？");
				if(ret){
					mapObj.clearOverlays();
					mapObj.draw();
					var overlays = mapObj.getOverlays();
					that.showOverlaysList(overlays);					
				}else{
					return;
				}
			});
		});
	},

	showOverlay : function(overlay,index){
		var html = "";
		var name = overlay.name;
		var type = overlay.type;
		var typeHtml = this.getOverlayTypeSpanHtml(type); 

		html += "<li class=\"row left_row overlay_row\" value=\"" + index + "\">"
			+	"	<div class=\"input-group\">"
			+		  typeHtml
			+	"	  <input type=\"text\" class=\"form-control input-overlay-read\" "
			+	"			readonly value=\"" + name + "\">"
			+	"	  <span class=\"input-group-btn\" style=\"display: none;\">"
			+	"	 	 <button class=\"btn btn-default btn-edit\" type=\"button\">编辑</button>"
			+	"	  	 <button class=\"btn btn-default btn-remove\" type=\"button\">删除</button>"
			+	"	  </span>"
			+	"	</div>"						
			+	"</li>"
		return html;
	},

	// 根据类型获取图标
	getOverlayTypeSpanHtml : function(type){
		var html = "";
		switch(type){
			case GeoBeans.Overlay.Type.MARKER:
				html = "<span class=\"input-group-addon glyphicon "
					+   "glyphicon-map-marker span-overlay-marker\"></span>";
				break;
			case GeoBeans.Overlay.Type.PLOYLINE:
				html = "<span class=\"input-group-addon glyphicon "
					+	"glyphicon-align-justify span-overlay-marker\"></span>";
				break;
			case GeoBeans.Overlay.Type.POLYGON:
				html = "<span class=\"input-group-addon glyphicon "
					+	"glyphicon-unchecked span-overlay-marker\"></span>";
				break;
			default:
				html = "<span class=\"input-group-addon glyphicon "
					+	"glyphicon-globe span-overlay-marker\"></span>";
				break;
		}
		return html;
	},

	//获取hit属性值html
	getHitOverlayValuesHtml : function(kvMap){
		var html = "<ul class=\"row left_row_wrapper\" id=\"overlay_hit_values_row\">";
		for(var key in kvMap){
			var value = kvMap[key];
			html += "<li class=\"row left_row\">"
				+	"	<div class=\"col-md-5 overlay_key\">"
				+	"		<input type=\"text\" class=\"form-control\" value=\"" +  key + "\" readonly>"
				+	"	</div>"
				+	"	<div class=\"col-md-7 overlay_value\">"
				+	"		<input type=\"text\" class=\"form-control\" value=\"" + value + "\" readonly>"
				+	"	</div>"
				+	"</li>";
		}
		html += "</ul>";
		return html;
	},

	getEditOverlayValuesHtml : function(kvMap){
		var html =  "<div class=\"row left_row_wrapper\" id=\"overlay_add_value_row\">"
				+	"	 <button type=\"button\" class=\"btn glyphicon glyphicon-plus "
				+	"		col-md-4 col-md-offset-4\"></button>"
				+	"</div>"
				+	"<ul class=\"row left_row_wrapper\" id=\"overlay_edit_values_row\">";
		for(var key in kvMap){
			var value = kvMap[key];
			html += "<li class=\"row left_row\">"
				+	"	<div class=\"col-md-4 overlay_key\">"
				+	"		<input type=\"text\" class=\"form-control\" value=\"" + key + "\">"
				+	"	</div>"
				+	"	<div class=\"input-group col-md-8 overlay_value\">"
				+	"		<input type=\"text\" class=\"form-control\" value=\"" + value + "\">"
				+	"		<span class=\"input-group-addon glyphicon glyphicon-trash span-overlay-marker\"></span>"
				+	"	</div>"
				+	"</li>";
		}
		html += "</ul>";
		return html;
	}

});