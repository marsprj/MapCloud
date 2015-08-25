MapCloud.FeaturesDialog = MapCloud.Class(MapCloud.Dialog,{
	layerName : null,

	maxFeatures : 30,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;
		this.registerPageEvent();
	},

	setLayerName : function(layerName){
		this.layerName = layerName;
	},

	showDialog : function(){
		this.panel.modal();
		
		this.showFields();
		var layer = mapObj.getLayer(this.layerName);
		var count = layer.getFeatureCount(null,null);
		this.showPages(count);
		this.setPage(1);
	},

	cleanup : function(){
		this.panel.find(".features-list table thead tr").html("");
		this.panel.find(".features-list table tbody").html("");
		this.panel.find(".query_count span").html("0");
		this.panel.find(".pages-form-page").html("0");
		this.panel.find(".pages-form-pages").html("0");
		this.layerName = null;
	},

	// 翻页事件
	registerPageEvent : function(){
		var that = this;

		this.panel.find(".pages-form-page").keyup(function(event){
			if(event.keyCode == 13){
				var page = parseInt($(this).val());
				that.setPage(page);
				return false;
			}
		});
		this.panel.find(".glyphicon-step-backward").each(function(){
			$(this).click(function(){
				var count = parseInt(that.panel
					.find(".pages-form-pages").html());
				if(count >=1){
					that.setPage(1);
				}
			});
		});
		//末页
		this.panel.find(".glyphicon-step-forward").each(function(){
			$(this).click(function(){
				var count = parseInt(that.panel
					.find(".pages-form-pages").html());
				if(count >= 1){
					that.setPage(count);
				}
			});
		});

		//上一页
		this.panel.find(".glyphicon-chevron-left").each(function(){
			$(this).click(function(){
				var page = parseInt(that.panel
					.find(".pages-form-page").val());
				that.setPage(page - 1);
			});	
		});

		//下一页
		this.panel.find(".glyphicon-chevron-right").each(function(){
			$(this).click(function(){
				var page = parseInt(that.panel
					.find(".pages-form-page").val());
				that.setPage(page + 1);
			});
		});

	},

	// 显示字段，表头
	showFields : function(){
		var layer = mapObj.getLayer(this.layerName);
		if(layer == null){
			return;
		}
		
		var fields = layer.getFields();
		if(fields == null){
			return;
		}

		var field = null;
		var name = null;
		var html = "";
		for(var i = 0; i < fields.length; ++i){
			field = fields[i];
			if(field.type != "geometry"){
				html += "<th>"
					+ 		field.name
					+ 	"</th>";
			}
		}
		this.panel.find(".features-list table thead tr").html(html);
	},

	// 显示页码
	showPages : function(count){
		if(count == null){
			return;
		}
		if(count == 0){
			this.cleanup();
			return;
		}
		this.panel.find(".query_count span").html(count);
		var pageCount = Math.ceil(count/this.maxFeatures);
		this.panel.find(".pages-form-pages").html(pageCount);
		this.setPage(1);
	},

	// 设置页码
	setPage : function(page){
		var pageCount = parseInt(this.panel.find(".pages-form-pages").html());
		this.panel.find(".pages-form-page").val(page);
		if(page　== 1 ){
			this.panel.find(".glyphicon-step-backward").addClass("disabled");
		}else{
			this.panel.find(".glyphicon-step-backward").removeClass("disabled");
		}
		if(page == pageCount){
			this.panel.find(".glyphicon-step-forward").addClass("disabled");
		}else{
			this.panel.find(".glyphicon-step-forward").removeClass("disabled");
		}

		if(page - 1 <= 0){
			this.panel.find(".glyphicon-chevron-left").addClass("disabled");
		}else{
			this.panel.find(".glyphicon-chevron-left").removeClass("disabled");
		}

		if(page + 1 > pageCount){
			this.panel.find(".glyphicon-chevron-right")
				.addClass("disabled");
		}else{
			this.panel.find(".glyphicon-chevron-right")
				.removeClass("disabled");
		}
		if(page <= 0 || page > pageCount){
			return;
		}

		// 设置偏移量
		var offset = ( page -1 ) * this.maxFeatures;
		var layer = mapObj.getLayer(this.layerName);
		MapCloud.notify.loading();
		var features = layer.getFeatureBBoxGet(null,this.maxFeatures,offset);
		this.showFeatures(features);
		MapCloud.notify.hideLoading();
	},

	// 显示features
	showFeatures : function(features){
		if(features == null){
			return;
		}
		var html = "";
		var feature = null;
		var value = null;
		var values = null;
		for(var i = 0; i < features.length; ++i){
			feature = features[i];
			if(feature == null){
				continue;
			}
			values = feature.values;
			if(values == null){
				continue;
			}
			html += "<tr>";
			for(var j = 0; j < values.length;++j){
				value = values[j];
				if(value instanceof GeoBeans.Geometry){
					continue;
				}
				html += '<td>' + value + "</td>"
			}
			html += "</tr>";
		}

		this.panel.find(".features-list table tbody").html(html);
	}

});