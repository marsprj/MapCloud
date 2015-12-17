MapCloud.QueryResultPanel = MapCloud.Class(MapCloud.Panel,{
	// 每页的展示条数
	maxFeatures 	: 20,

	// 展示图层
	layer 			: null,

	// 展示要素
	features 		: null,

	// 查询函数
	query_function 	: null,

	//输出函数
	output_function : null,


	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		
		this.registerEvent();
		this.registerPageEvent();

	},	

	registerEvent : function(){
		var that = this;
		this.panel.find(".btn-hide").click(function(){
			that.hidePanel();
		});
	},

	showPanel : function(){
		this.panel.animate({"height":"250px"},300);
		$("#map_container").animate({"bottom":"250px"},300,null,function(){
			mapObj.resize("height");
		});
		
	},	

	hidePanel : function(){
		this.panel.animate({"height":"0px"},300);
		$("#map_container").animate({"bottom":"0px"},300,null,function(){
			mapObj.resize("height");
		});
	},


	// 翻页事件
	registerPageEvent : function(){
		var that = this;
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

		// 导出
		this.panel.find(".download-features").click(function(){
			// var url = mapObj.queryByRectOutput(null,null);
			if(that.output_function != null){
				var url = that.output_function();
				window.open(url,'_blank');
			}
		});

		// 清空
		this.panel.find(".clear-features").click(function(){
			mapObj.endQuery();
			that.cleanup();
		});
	},


	// 展示要素
	showFeatures : function(features){
		if(features == null){
			return;
		}
		this.features = features;
		var featureType = null;
		var feature = features[0];
		
		if(feature != null){
			featureType = feature.featureType;
		}
		if(featureType == null){
			return;
		}
		var fields = featureType.getFields();
		if(fields == null){
			return;
		}

		this.setFieldsHtml(fields);
		this.setValuesHtml(features);
	},


	// 设置字段
	setFieldsHtml : function(fields){
		var html = "";
		var field = null;
		var name = null;
		var html = "";
		var widthAll = 0;
		for(var i = 0; i < fields.length; ++i){
			field = fields[i];
			if(field.type != "geometry"){
				name = field.name;
				html += "<th width='80'>"
				+ 		name 
				+ 	"</th>";
				widthAll += 1;
			}
		}
		this.panel.find("#datagrid_content table thead tr").html(html);

	},

	// 设置feature的values
	setValuesHtml : function(features){
				//features display
		html = "";
		var feature = null;
		var values = null;
		var value = null;
		for(var i = 0; i < features.length;++i){
			feature = features[i];
			if(feature == null){
				continue;
			}
			values = feature.values;
			if(values == null){
				continue;
			}
			html += "<tr index='" + i + "'>";
			for(var j = 0; j < values.length; ++j){
				value = values[j];
				// if(value == null){
				// 	continue;
				// }
				if(value instanceof GeoBeans.Geometry){
					continue;
				}
				html += "<td>" +  value + "</td>";
			}
			html += "</tr>";
		}

		this.panel
			.find("#datagrid_content table tbody").html(html);
		this.registerFeatureSelected();
	},	



	// 展示页码
	setQuery : function(layer,count,query_function){
		if(layer == null || count == null){
			return;
		}
		this.layer = layer;
		this.query_function = query_function;
		if(count == 0){
			this.clearData();
			this.showPanel();
			return;
		}
		this.panel.find(".query_count").html(count);
		var pageCount = Math.ceil(count/this.maxFeatures);
		this.panel.find(".pages-form-pages").html(pageCount);
		this.panel.find("#datagrid_content table thead tr").html("");
		this.panel.find("#datagrid_content table tbody").html("");
		this.setPage(1);
		this.showPanel();
	},
	setOutput : function(output_function){
		this.output_function = output_function;
	},

	// 设置页码
	setPage : function(page){

		var pageCount = parseInt(this.panel
				.find(".pages-form-pages").html());

		this.panel.find(".pages-form-page").val(page);
		if(page　== 1 ){
			this.panel.find(".glyphicon-step-backward")
				.addClass("disabled");
		}else{
			this.panel.find(".glyphicon-step-backward")
				.removeClass("disabled");
		}
		if(page == pageCount){
			this.panel.find(".glyphicon-step-forward")
				.addClass("disabled");
		}else{
			this.panel.find(".glyphicon-step-forward")
				.removeClass("disabled");
		}

		if(page - 1 <= 0){
			this.panel.find(".glyphicon-chevron-left")
				.addClass("disabled");
		}else{
			this.panel.find(".glyphicon-chevron-left")
				.removeClass("disabled");
		}

		if(page + 1 > pageCount){
			this.panel.find(".glyphicon-chevron-right")
				.addClass("disabled");
		}else{
			this.panel.find(".glyphicon-chevron-right")
				.removeClass("disabled");
		}
		if(page < 0 || page > pageCount){
			return;
		}
		var offset = ( page -1 ) * this.maxFeatures;
		// var features = mapObj.queryByRectPage(this.maxFeatures,offset);
		var features = this.query_function(this.maxFeatures,offset);
		this.showFeatures(features);
	},


	// 清空数据
	clearData : function(){
		this.panel.find("#datagrid_content table thead tr").html("");
		this.panel.find("#datagrid_content table tbody").html("");
		this.panel.find(".query_count").html("0");
		this.panel.find(".pages-form-page").val(0);
		this.panel.find(".pages-form-pages").html("0");
	},

	// 选中要素事件
	registerFeatureSelected : function(){
		var that = this;
		this.panel.find("#datagrid_content table tbody tr").each(function(){
			$(this).click(function(){
				$(this).parents("tbody").children().removeClass("selected");
				$(this).addClass("selected");
				var index = $(this).attr("index");
				var feature = that.features[index];
				if(feature != null){
					mapObj.setFeatureBlink(feature,3);
				}
			});
		});
	}		
});