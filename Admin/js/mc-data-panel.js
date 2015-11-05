MapCloud.DataPanel = MapCloud.Class({

	panel : null,

	baseDB : "base",

    // 一页显示个数
    maxFeatures : 30,	

    //底图
    map : null,

    baseLayerUrl : "/QuadServer/maprequest?services=",

    aqiLayers : ["gc_aqi","gc_aqi_ranking"],

    poiLayers : ["poi_146m"],

	initialize :function(id){
		this.panel = $("#" + id);

		this.registerPanelEvent();

		this.getBaseDataSource();
	},

	registerPanelEvent : function(){
		var that = this;

		// 左侧树展开
		this.panel.find(".db-tree .glyphicon-chevron-right").click(function(){
			var name = $(this).parents(".row").first().attr("dname");
			if($(this).hasClass("mc-icon-right")){
				// 展开
				$(this).removeClass("mc-icon-right");
				$(this).addClass("mc-icon-down");
				$(this).css("transform","rotate(90deg) translate(3px,0px)");
				that.panel.find(".db-tree .nav[dname='" + name + "']").remove();
				switch(name){
					case "base":
						// that.showBaseDataSource();
						that.getDataSets("base");
						break;
					case "tile":
						that.showTileDataSource();
						break;
					case "poi":
						// that.showPoiDataSource();
						that.getDataSets("poi");
						break;
					case "aqi":
						// that.showAqiDataSource(); 
						that.getDataSets("aqi");
						break; 
				}
				// that.getDataSource(name);
			}else{
				$(this).css("transform","rotate(0deg) translate(0px,0px)");
				$(this).addClass("mc-icon-right");
				$(this).removeClass("mc-icon-down");	
				that.panel.find(".db-tree .nav[dname='" + name + "']").slideUp(500);	
			}
		});

		//数据库 
		this.panel.find(".enter-base").click(function(){
			// that.showBaseDataSource();
			that.getDataSets("base");
		});

		// 瓦片
		this.panel.find(".enter-tile").click(function(){
			that.showTileDataSource();
		});

		// poi
		this.panel.find(".enter-poi").click(function(){
			// that.showPoiDataSource();
			that.getDataSets("poi");
		});

		// aqi
		this.panel.find(".enter-aqi").click(function(){
			// that.showAqiDataSource();
			that.getDataSets("aqi");
		});

		// 返回数据列表面板
		this.panel.find(".return-datasources-list").click(function(){
			that.showDataSourcesPanel();
		});

		// 数据库面板
		// 展示图层列表
		this.panel.find("#show_datasets_list").click(function(){
			that.panel.find("#show_datasets_thumb").attr("disabled",false);
			$(this).attr("disabled",true);
			that.panel.find("#datasource_tab .right-panel-content-tab").css("display","none");
			that.panel.find("#datasets_list_tab").css("display","block");
		});
		// 展示图层缩略图
		this.panel.find("#show_datasets_thumb").click(function(){
			that.panel.find("#show_datasets_list").attr("disabled",false);
			$(this).attr("disabled",true);
			that.panel.find("#datasource_tab .right-panel-content-tab").css("display","none");
			that.panel.find("#datasets_thumb_tab").css("display","block");		
		});

		//dataset 面板
		// 返回各自数据库的面板
		this.panel.find(".return-datasource").click(function(){
			var name = that.panel.find(".db-tree .row.selected").attr("dname");
			switch(name){
				case "base":
					that.getDataSets("base");
					break;
				case "tile":
					that.showTileDataSource();
					break;
				case "poi":
					that.getDataSets("poi");
					break;
				case "aqi":
					that.getDataSets("aqi");
					break; 
				default:{
					break;
				}
			}
		});

		this.panel.find("#show_dataset_infos").click(function(){
			 that.panel.find("#dataset_tab .btn-group .btn").attr("disabled",false);
			 $(this).attr("disabled",true);
			 if(that.dataSetCur != null){
			 	that.showDataSetInfos(that.dataSetCur);
			 }
		});

		$("#show_dataset_fields").click(function(){
			 $("#dataset_tab .btn-group .btn").attr("disabled",false);
			 $(this).attr("disabled",true);
			 if(that.dataSetCur != null){
			 	that.showDataSetFields(that.dataSetCur);
			 }
		});

		this.panel.find("#show_dataset_features").click(function(){
			 that.panel.find("#dataset_tab .btn-group .btn").attr("disabled",false);
			 $(this).attr("disabled",true);
			 if(that.dataSetCur != null){
			 	that.showDataSetFeatures(that.dataSetCur);
			 }
		});

		this.panel.find("#show_dataset_preview").click(function(){
			that.panel.find("#dataset_tab .btn-group .btn").attr("disabled",false);
			 $(this).attr("disabled",true);
			 if(that.dataSetCur != null){
			 	that.showDataSetPreview(that.dataSetCur);
			 }
		});

		//页面设置
		// 首页
		this.panel.find(".glyphicon-step-backward").each(function(){
			$(this).click(function(){
				var pageCount = parseInt(that.panel.find(".pages-form-pages").html());
				if(pageCount >= 1){
					that.setDataSetFeaturePage(1);
				}
			});
		});

		//末页
		this.panel.find(".glyphicon-step-forward").each(function(){
			$(this).click(function(){
				var count = parseInt(that.panel.find(".pages-form-pages").html());
				if(count >= 1){
					that.setDataSetFeaturePage(count);
				}
			});
		});

		//上一页
		this.panel.find(".glyphicon-chevron-left").each(function(){
			$(this).click(function(){
				var page = parseInt(that.panel.find(".pages-form-page").val());
				that.setDataSetFeaturePage(page - 1);
			});	
		});

		//下一页
		this.panel.find(".pages-form .glyphicon-chevron-right").each(function(){
			$(this).click(function(){
				var page = parseInt(that.panel.find(".pages-form-page").val());
				that.setDataSetFeaturePage(page + 1);
			});
		});


		// 瓦片数据
		this.panel.find(".return-qs-list").click(function(){
			that.showTileDataSource();
		});


	},

	// 数据列表
	showDataSourcesPanel : function(){
		this.panel.find(".right-panel-tab").css("display","none");
		this.panel.find("#datasources_tab").css("display","block");
	},

	// 首先获取基础数据库
	getBaseDataSource : function(){
		dbsManager.getDataSource("base",this.getBaseDataSource_callback);
	},

	getBaseDataSource_callback : function(dataSource){
		if(dataSource == null){
			return;
		}
		var that = MapCloud.dataPanel;
		that.dataSource = dataSource;
		if(that.flag != null){
			that.getDataSets(that.flag);
		}
	},

	getDataSets : function(flag){
		this.flag = flag;
		if(this.dataSource == null){
			this.getBaseDataSource();
			return;
		}
		this.flag = flag;
		MapCloud.notify.loading();
		this.panel.find(".right-panel-tab").css("display","none");
		this.panel.find("#datasource_tab").css("display","block");
		this.panel.find(".db-tree .row").removeClass("selected");
		this.panel.find(".db-tree .row[dname='" + flag + "']").addClass("selected");
		this.panel.find(".db-tree .nav[dname='" + flag + "']").remove();
		this.panel.find(".datasets-list").empty();
		this.panel.find(".datasets_thumb_tab").empty();
		this.dataSource.getDataSets(this.getDataSets_callback);
	},

	// 根据flag获取名称
	getDataSourceName : function(flag){
		var name = "";
		switch(flag){
			case "base":{
				name = "基础地理数据";
				break;
			}
			case "aqi":{
				name = "AQI数据";
				break;
			}
			case "poi":{
				name = "poi数据";
				break;
			}
			case "tile":{
				name = "瓦片数据";
				break
			}
		}
		return name;
	},

	// // 获得列表
	// getDataSets : function(dataSource){
	// 	this.panel.find(".db-tree .row").removeClass("selected");
	// 	this.panel.find(".db-tree .row[dname='" + dataSource.name + "']").addClass("selected");
	// 	this.panel.find(".db-tree .nav[dname='" + dataSource.name + "']").remove();
	// 	this.panel.find(".datasets-list").empty();
	// 	this.panel.find(".datasets_thumb_tab").empty();
	// 	if(dataSource == null){
	// 		return;
	// 	}
	// 	MapCloud.notify.loading();
	// 	dataSource.getDataSets(this.getDataSets_callback);
	// },

	// 获得图层数据
	getDataSets_callback : function(dataSets){
		MapCloud.notify.hideLoading();
		var that = MapCloud.dataPanel;
		var name = that.getDataSourceName(that.flag);
		that.panel.find(".current-db").html(name);
		var dataSets = that.getDataSetsByFlag(that.flag,dataSets);
		that.showDataSetsTree(dataSets);
		that.showDataSetsList(dataSets);
		that.showDataSetsThumb(dataSets);
	},

	// 根据获取的类型获取dataSets
	getDataSetsByFlag : function(flag,dataSets){
		var array = [];
		var dataSet = null;
		var name = null;
		var aqiIndex = null;
		var poiIndex = null;
		for(var i = 0; i < dataSets.length; ++i){
			dataSet = dataSets[i];
			if(dataSet == null){
				continue;
			}
			name = dataSet.name;
			aqiIndex = this.aqiLayers.indexOf(name);
			poiIndex = this.poiLayers.indexOf(name);
			if(flag == "base"){
				if(aqiIndex == -1 && poiIndex == -1){
					array.push(dataSet);
				}
			}else if(flag == "aqi"){
				if(aqiIndex != -1){
					array.push(dataSet);
				}
			}else if(flag == "poi"){
				if(poiIndex != -1){
					array.push(dataSet);
				}
			}
		}
		return array;	
	},

	// 图层左侧树
	showDataSetsTree : function(dataSets){
		if(!$.isArray(dataSets)){
			return;
		}



		var dataSet = null;
		var name = null;
		var html = "<ul class='nav' dname='" + this.flag + "'>";
		for(var i = 0; i < dataSets.length; ++i){
			dataSet = dataSets[i];
			if(dataSet == null){
				continue;
			}
			name = dataSet.name;
			geomType = dataSet.geometryType;
			geomTypeHtml = this.getDataSetGeomTypeHtml(geomType);
			html += "<li sname='" + name + "'>"
				+ 	"	<a href='#' class='tree-table' dindex='"
				+		i + "'>"
				+ 		geomTypeHtml
				+	"		<span title='" + name + "'>"	 + name + "</span>"
				+	"	</a>"
				+	"</li>";
		}
		
		var dataSourceTreeItem = this.panel.find(".db-tree .row[dname='" +  this.flag + "']");
		dataSourceTreeItem.after(html);

		var that = this;
		this.panel.find(".nav[dname='" + this.flag + "'] li").click(function(){
			var name =$(this).attr("sname");
			if(name == null){
				return;
			}
			if(that.dataSource == null){
				return;
			}
			that.getDataSet(that.dataSource,name);
		});

	},

	// 展示列表
	showDataSetsList : function(dataSets){
		if(!$.isArray(dataSets)){
			return;
		}

		var dataSet = null;
		var name = null;
		var geomType = null;
		var srid = null;		
		var html = "";
		for(var i = 0; i < dataSets.length;++i){
			dataSet = dataSets[i];
			name = dataSet.name;
			geomType = dataSet.geometryType;
			if(geomType == null){
				geomType = "";
			}
			srid = dataSet.srid;
			if(srid == null){
				srid = "";
			}
			html += "<div class='row' sname='" + name +"'>"
				+	'	<div class="col-md-1">' + (i+1) + "</div>"
				+	'	<div class="col-md-4">' + name + "</div>"
				+	'	<div class="col-md-3">' + geomType + "</div>"
				+	'	<div class="col-md-2">' + srid + "</div>"
				+	'	<div class="col-md-2">'
				+	'		<a href="javascript:void(0)" class="oper enter-dataset">进入</a>'
				+	'		<a href="javascript:void(0)" class="oper remove-dataset">删除</a>'
				+	'	</div>'
				+	'</div>';
		}
		this.panel.find(".datasets-list").html(html);

		var that = this;
		// 进入图层
		this.panel.find(".datasets-list .enter-dataset").click(function(){
			var name = $(this).parents(".row").attr("sname");
			if(name == null){
				return;
			}
			if(that.dataSource == null){
				return;
			}
			that.getDataSet(that.dataSource,name);
		});

		// 删除图层
		this.panel.find(".datasets-list .remove-dataset").click(function(){
			var name = $(this).parents(".row").attr("sname");
			if(name == null){
				return;
			}
			if(that.dataSource == null){
				return;
			}
			if(!confirm("确定要删除[" + name + "]?")){
				return;
			}
			MapCloud.notify.loading();
			that.dataSource.removeDataSet(name,that.removeDataSet_callback);

		});
	},

	removeDataSet_callback :function(result){
		MapCloud.notify.showInfo(result,"删除图层");
		var that = MapCloud.vectorPanel;
		// that.getDataSource(that.dataSourceCur.name);
		that.getDataSets(that.flag);
	},

	// 展示数据库图层缩略图
	showDataSetsThumb : function(dataSets){
		if(!$.isArray(dataSets)){
			return;
		}

		var html = "";
		var dataSet = null;
		var geomType = null;
		var thumbnail = null;
		for(var i = 0; i < dataSets.length; ++i){
			dataSet = dataSets[i];
			name = dataSet.name;
			geomType = dataSet.geometryType;
			if(geomType == null){
				continue;
			}
			thumbnail = dataSet.thumbnail;
			if(thumbnail != null){
				
				html += "<li class='dataset-thumb' dname='" + name + "'>"
				+ "<a href='#' class='dataset-thumb-a' dindex='" + i 
				+ "' style='background-image:url(" + thumbnail + ")'></a>";
			}
			html += "<div class='caption text-center'>"
				+	"	<h6 title='" + name + " class='text-ellipsis'>" + name + "</h6>"
				+	"</div>"
				+	"</li>";
		}
		this.panel.find("#datasets_thumb_tab").html(html);

		var that = this;
		// 双击
		this.panel.find("#datasets_thumb_tab .dataset-thumb-a").dblclick(function(){
			var name = $(this).parent().attr("dname");
			if(name == null){
				return;
			}
			if(that.dataSource == null){
				return;
			}
			that.getDataSet(that.dataSource,name);
		});
	},

	getDataSetGeomTypeHtml : function(geomType){
		var html = "";
		switch(geomType){
			case GeoBeans.Geometry.Type.POINT:
			case GeoBeans.Geometry.Type.MULTIPOINT:{
				html = '<i class="mc-icon mc-db-icon-dataset-point"></i>';
				break;
			}
			case GeoBeans.Geometry.Type.LINESTRING:
			case GeoBeans.Geometry.Type.MULTILINESTRING:{
				html = '<i class="mc-icon mc-db-icon-dataset-line"></i>';
				break;
			}
			case GeoBeans.Geometry.Type.POLYGON:
			case GeoBeans.Geometry.Type.MULTIPOLYGON:{
				html = '<i class="mc-icon mc-db-icon-dataset-polygon"></i>';
				break;
			}
			default :{
				html = '<i class="mc-icon mc-db-icon-dataset"></i>';
				break;
			}
		};
		return html;
	},


	// 进入图层
	getDataSet : function(dataSource,name){
		this.panel.find(".db-tree li").removeClass("selected");
		this.panel.find(".db-tree li[sname='" + name + "']").addClass("selected");

		if(dataSource == null || name == null){
			return;
		}
		this.panel.find(".right-panel-tab").css("display","none");
		this.panel.find("#dataset_tab").css("display","block");
		var dbname = this.getDataSourceName(this.flag);
		this.panel.find(".return-datasource").html(dbname);
		this.panel.find(".current-dataset").html(name);
		this.panel.find(".dataset-infos").empty();
		this.panel.find(".dataset-fields").empty();
		this.panel.find("#dataset_features_list table thead tr").html("");
		this.panel.find("#dataset_features_list table tbody").html("");
		this.panel.find(".dataset_preview_tab").empty();

		dataSource.getDataSet(name,this.getDataSet_callback);
	},

	getDataSet_callback : function(dataSet){
		if(dataSet == null){
			return;
		}
		var that = MapCloud.dataPanel;
		that.dataSetCur = dataSet;
		// 先展示上次展示的
		var btnId = that.panel.find("#dataset_tab .btn-group .btn[disabled='disabled']").attr("id");
		if(dataSet.geometryType == null){
			that.panel.find("#show_dataset_preview").attr("disabled",true);
			if(btnId == "show_dataset_preview"){
				that.panel.find("#dataset_tab .btn-group #show_dataset_infos").attr("disabled",true);
				btnId = "show_dataset_infos";
			}
		}else{
			if(btnId != "show_dataset_preview"){
				that.panel.find("#show_dataset_preview").attr("disabled",false);
			}
		}
		switch(btnId){
			case "show_dataset_infos":{
				that.showDataSetInfos(dataSet);
				break;
			}
			case "show_dataset_fields":{
				that.showDataSetFields(dataSet);
				break;
			}
			case "show_dataset_features":{
				that.showDataSetFeatures(dataSet);
				break;
			}
			case "show_dataset_preview":{
				that.showDataSetPreview(dataSet);
				break;
			}
			default:
			break;
		}		
	},
	// 元数据
	showDataSetInfos : function(dataSet){
		this.panel.find("#dataset_tab .right-panel-content-tab").css("display","none");
		this.panel.find("#dataset_infos_tab").css("display","block");
		if(dataSet == null){
			return;
		}
		var html = "";
		html += "<div class='row'>"
			+ 	"	<div class='col-md-3'>名称</div>" 
			+	"	<div class='col-md-6'>" + dataSet.name + "</div>"
			+	"</div>";
		if(dataSet.type != null){
			html+=  "<div class='row'>"
				+	"	<div class='col-md-3'>类型</div>"
				+	"	<div class='col-md-6'>" + dataSet.type + "</div>"
				+	"</div>";
		}
		if(dataSet.geometryType != null){
			html+=	"<div class='row'>"
				+	"	<div class='col-md-3'>几何类型</div>"			
				+	"	<div class='col-md-6'>" + dataSet.geometryType + "</div>"
				+	"</div>";
		}
		if(dataSet.count != null){
			html+=	"<div class='row'>"
				+	"	<div class='col-md-3'>个数</div>"			
				+	"	<div class='col-md-6'>" + dataSet.count + "</div>"
				+	"</div>";
		}
		if(dataSet.srid != null){
			html+=	"<div class='row'>"
				+	"	<div class='col-md-3'>空间参考</div>"			
				+	"	<div class='col-md-6'>" + dataSet.srid + "</div>"
				+	"</div>";
		}
		var extent = dataSet.extent;
		if(extent != null){
			html+=	"<div class='row'>"
				+	"	<div class='col-md-3'>范围</div>"			
				+	"	<div class='col-md-6'>东 :" + extent.xmax + "</div>"
				+	"</div>"
				+	"<div class='row'>"
				+	"	<div class='col-md-3'></div>"
				+	"	<div class='col-md-6'>西 :" + extent.xmin + "</div>"
				+	"</div>"
				+	"<div class='row'>"
				+	"	<div class='col-md-3'></div>"
				+	"	<div class='col-md-6'>南 :" + extent.ymin + "</div>"
				+	"</div>"
				+	"<div class='row'>"
				+	"	<div class='col-md-3'></div>"
				+	"	<div class='col-md-6'>北 :" + extent.ymax + "</div>"
				+	"</div>";		
		}

		this.panel.find(".dataset-infos").html(html);

	},	

	// 字段
	showDataSetFields : function(dataSet){
		this.panel.find("#dataset_tab .right-panel-content-tab").css("display","none");
		this.panel.find("#dataset_fields_tab").css("display","block");
		if(dataSet == null){
			return;
		}
		var fields = dataSet.getFields();
		if(fields == null){
			return;
		}
		var html = "";
		var field = null;
		var name = null;
		var type = null;
		var length = null;
		for(var i = 0; i < fields.length; ++i){
			field = fields[i];
			name = field.name;
			type = field.type;
			length = field.length;
			html += "<div class='row'>"
				+ 	"	<div class='col-md-4'>"
				+ 			name 
				+ 	"	</div>"
				+ 	"	<div class='col-md-3'>"
				+ 			type
				+ 	"	</div>"
				+ 	"	<div class='col-md-3'>"
				+ 			((length == null)?"":length)
				+ 	"	</div>"				
				+	"</div>";
		}		
		this.panel.find(".dataset-fields").html(html);
	},

	// 列表
	showDataSetFeatures : function(dataSet){
		this.panel.find("#dataset_tab .right-panel-content-tab").css("display","none");
		this.panel.find("#dataset_features_tab").css("display","block");
		if(dataSet == null){
			return;
		}
		var fields = dataSet.getFields();
		if(fields == null){
			return;
		}
		this.showDataSetFeautresFields(fields);

		var count = dataSet.count;
		var pageCount = Math.ceil(count/this.maxFeatures);
		this.panel.find(".pages-form-pages").html(pageCount);
		this.panel.find(".query_count span").html(count);
		// 获得第一页数据
		if(pageCount >= 1){
			this.setDataSetFeaturePage(1);
		}else{
			this.panel.find(".pages-form-page").val(0);
		}
	},

	//设置页码
	setDataSetFeaturePage : function(page){
		var pageCount = parseInt($(".pages-form-pages").html());
		$(".pages-form-page").val(page);
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
			this.panel.find(".glyphicon-chevron-right").addClass("disabled");
		}else{
			this.panel.find(".glyphicon-chevron-right").removeClass("disabled");
		}

		var offset = ( page -1 ) * this.maxFeatures;
		
		MapCloud.notify.loading();
		var fields = this.dataSetCur.getFieldsWithoutGeom();
		this.dataSetCur.getFeatures(this.maxFeatures, offset,fields,this.getFeatures_callback); 
	},

	// 列表中的字段名称
	showDataSetFeautresFields : function(fields){
		if(fields == null){
			return;
		}
		var field = null;
		var name = null;
		var html = "";
		var widthAll = 0;
		for(var i = 0; i < fields.length; ++i){
			field = fields[i];
			if(field.type != "geometry"){
				name = field.name;
				html += "<th width='80'><nobr>"
				+ 		name 
				+ 	"</nobr></th>";
				widthAll += 1;
			}
		}
		this.panel.find("#dataset_features_list table thead tr").html(html);
	},


	getFeatures_callback : function(features){
		MapCloud.notify.hideLoading();
		var that = MapCloud.dataPanel;
		that.showFeatures(features);
	},

	showFeatures : function(features){
		if(features == null){
			return;
		}
		var html = "";
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
			html += "<tr>";
			for(var j = 0; j < values.length; ++j){
				value = values[j];
				if(value == null){
					continue;
				}
				if(value instanceof GeoBeans.Geometry){
					continue;
				}
				html += "<td>" +  value + "</td>";
			}
			html += "</tr>";
		}

		this.panel.find("#dataset_features_list table tbody").html(html);
	},

	// 预览
	showDataSetPreview : function (dataSet){
		this.panel.find("#dataset_tab .right-panel-content-tab").css("display","none");
		this.panel.find("#dataset_preview_tab").css("display","block");
		if(dataSet == null){
			return;
		}
		if(dataSet == null || dataSet.geometryType == null){
			return;
		}
		var width = this.panel.find("#dataset_preview_tab").width();
		var height = this.panel.find("#dataset_preview_tab").height();
		var scale_m = 512/384;
		var scale_s = width/height;
		var marginTop = null;
		var marginWidth = null;
		if(scale_m > scale_s){
			marginTop = (height - width /scale_m)/2;
			height = width /scale_m;
		}else{
			marginWidth = (width - height*scale_m)/2 ;
			width = height*scale_m;
		}
		var thumbnail = dataSet.thumbnail;
		var html = "<img src='" + thumbnail + "' width='" 
			+ width + "'  height='" + height +"'>";
		this.panel.find("#dataset_preview_tab").html(html);
		if(marginTop != null){
			this.panel.find("#dataset_preview_tab img").css("margin-top",marginTop);
		}
		if(marginWidth != null){
			this.panel.find("#dataset_preview_tab img").css("margin-left",marginWidth);
		}
	},


	showTileDataSource : function(){
		this.panel.find(".right-panel-tab").css("display","none");
		this.panel.find("#qs_list_tab").css("display","block");
		var html = 	'<ul class="nav" dname="tile">'
				+	'	<li sname="world_vector" tname="矢量底图">'
				+	'		<a href="#" class="tree-table">'
				+	'			<i class="mc-icon mc-base-layer-icon"></i>'
				+	'			<span title="矢量底图">矢量底图</span>'
				+	'		</a>'
				+	'	</li>'
				+	'	<li sname="world_image" tname="影像底图">'
				+	'		<a href="#" class="tree-table">'
				+	'			<i class="mc-icon mc-base-layer-icon"></i>'
				+	'			<span title="影像底图">影像底图</span>'
				+	'		</a>'
				+	'	</li>'							
				+	'</ul>';
		this.panel.find(".db-tree .row").removeClass("selected");
		this.panel.find(".db-tree .row[dname='tile']").addClass("selected");
		this.panel.find(".db-tree .nav[dname='tile']").remove();
		this.panel.find(".db-tree .row[dname='tile']").after(html);
		// 左侧树
		var that = this;
		this.panel.find("ul[dname='tile'] li").click(function(){
			var name = $(this).attr("sname");
			if(name == null){
				return;
			}
			var title = $(this).attr("tname");
			that.showBaseLayer(name,title);
		});

		// 右侧列表
		html = 	"<div class='row' sname='world_vector' tname='矢量地图'>"
			+	"	<div class='col-md-1'>1</div>"
			+	"	<div class='col-md-3'>矢量地图</div>"
			+	"	<div class='col-md-4'>矢量地图</div>"
			+	"	<div class='col-md-3'>"
			+	"		<a href='javascript:void(0)' class='oper enter-tile'>进入</a>"
			+	"	</div>"
			+	"</div>"
			+ 	"<div class='row' sname='world_image' tname='影像地图'>"
			+	"	<div class='col-md-1'>2</div>"
			+	"	<div class='col-md-3'>影像地图</div>"
			+	"	<div class='col-md-4'>影像地图</div>"
			+	"	<div class='col-md-3'>"
			+	"		<a href='javascript:void(0)' class='oper enter-tile'>进入</a>"
			+	"	</div>"
			+	"</div>";
		this.panel.find(".tiles-list").html(html);

		this.panel.find(".tiles-list .enter-tile").click(function(){
			var name = $(this).parents(".row").first().attr("sname");
			var title = $(this).parents(".row").first().attr("tname")
			if(name == null){
				return;
			}
			that.showBaseLayer(name,title);
		});
	},

	// 展示底图
	showBaseLayer : function(name,title){
		if(name == null){
			return;
		}
		this.panel.find(".right-panel-tab").css("display","none");
		this.panel.find("#qs_tab").css("display","block");
		this.panel.find(".nav[dname='tile'] li").removeClass("selected");
		this.panel.find(".nav[dname='tile'] li[sname='" + name + "']").addClass("selected");
		this.panel.find(".current-qs").html(title);

		var center = new GeoBeans.Geometry.Point(0,0);	
		var level = 2;

		var layer = null;
		var url = this.baseLayerUrl + name;
		if(this.map == null){
			var extent = new GeoBeans.Envelope(-180,-90,180,90);
			this.map = new GeoBeans.Map(admin.server,"base_layer_canvas_wrapper","tmp",extent,4326,extent);
		}else{
			this.map.removeBaseLayer();
			this.map.draw();
			center = this.map.center;
			level = this.map.level;
		}
		layer = new GeoBeans.Layer.QSLayer("base",url);
		
		this.map.setBaseLayer(layer);
		
		this.map.setCenter(center);
		this.map.setLevel(level);	
		this.map.draw();			
	},
	showPoiDataSource : function(){

	},

	// showAqiDataSource : function(){
	// 	this.panel.find(".right-panel-tab").css("display","none");
	// 	this.panel.find("#datasource_tab").css("display","block");
	// 	this.panel.find(".db-tree .row").removeClass("selected");
	// 	this.panel.find(".db-tree .row[dname='base']").addClass("selected");
	// 	this.panel.find("#show_datasets_list").css("disabled",false);
	// 	this.panel.find("#show_datasets_thumb").css("disabled",true);
	// 	this.panel.find("#datasource_tab .current-db").html("AQI数据");


	// 	MapCloud.notify.hideLoading();
	// 	dbsManager.getDataSource("base",this.getAQIDataSource_callback);

	// 	var html =  "<ul class='nav' dname='aqi'>"
	// 			+	"	<li sname='gc_aqi'>"
	// 			+	"		<a href='#' class='tree-table'>"
	// 			+	"			<i class='mc-icon mc-db-icon-dataset-point'>"
	// 			+	"			<span title='空气质量指数'>空气质量指数</span>"
	// 			+	"		</a>"
	// 			+	"	</li>"
	// 			+	"	<li sname='gc_aqi_ranking'>"
	// 			+	"		<a href='#' class='tree-table'>"
	// 			+	"			<i class='mc-icon mc-db-icon-dataset-point'>"
	// 			+	"			<span title='空气质量指数'>空气质量指数</span>"
	// 			+	"		</a>"
	// 			+	"	</li>"
	// 			+	"</ul>";
	// 	this.panel.find()
	// },

	// getAQIDataSource_callback : function(dataSource){
	// 	MapCloud.notify.hideLoading();
	// 	if(dataSource == null){
	// 		return;
	// 	}
	// 	var that = MapCloud.dataPanel;
	// 	that.dataSourceCur = dataSource;
	// },
});