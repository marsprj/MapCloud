MapCloud.MapLayersPanel = MapCloud.Class(MapCloud.Panel,{
	
	dbsManager : null,

	sourceName : "tianjin",

	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		
		this.dbsManager = user.getDBSManager();
		this.registerPanelEvent();
		// this.getDataSource();
		this.showLayers();
	},	

	showPanel : function(){
		MapCloud.Panel.prototype.showPanel.apply(this,arguments);
	},

	show : function(){
		this.showLayers();
		this.panel.slideDown();
	},	

	hide : function(){
		this.panel.slideUp();
	},
	registerPanelEvent : function(){

	},

	getDataSource : function(){
		this.dbsManager.getDataSource(this.sourceName,this.getDataSource_callback);
	},

	getDataSource_callback : function(dataSource){
		var panel = MapCloud.mapLayersPanel;
		panel.getDataSets(dataSource);
	},

	getDataSets : function(dataSource){
		if(dataSource == null){
			return;
		}

		dataSource.getDataSets(this.getDataSets_callback);
	},



	getDataSets_callback : function(dataSets){
		var panel = MapCloud.mapLayersPanel;
		panel.showDataSets(dataSets);
	},

	showLayers : function(){
		if(mapObj == null){
			return;
		}
		var layers = mapObj.getLayers();
		var layer = null,layerName = null,dataSetName = null;
		var html = "";
		for(var i = 0; i < layers.length;++i){
			var layer = layers[i];
			if(layer == null){
				continue;
			}
			layerName = layer.name;
			var checkboxHtml = "<input type='checkbox'>";
			if(layer.visible){
				checkboxHtml = "<input type='checkbox' checked>";
			}
			var dataSetName = this.getDataSetName(layerName);
			if(dataSetName == null){
				console.log(layerName);
				continue;
			}
			html += "<div class='row' lname='" + layerName + "'>"
				+	"	<div class='col-md-2'>"
				+	checkboxHtml
				+	"	</div>"
				+	"	<div class='col-md-9'>"
				+	"		<span class='layer-name'>" + dataSetName + "</span>"
				+	"	</div>"
				// +	"	<div class='col-md-2'>"
				// +	"		<div class='mc-icon glyphicon glyphicon-ok ' data-toggle='tooltip' "
				// +	"		data-placement='top' data-original-title='选中该图层'></div>"
				// +	"	</div>"
				+	"</div>";
			// dataSetName = this.

		}
		this.panel.find(".map-layers-list").html(html);

		var that = this;
		// 控制显示
		this.panel.find("input[type='checkbox']").change(function(){
			// var name = $(this).parents(".row").find(".layer-name").html();
			var name = $(this).parents(".row").attr("lname");
			var layer = mapObj.getLayer(name);
			if(layer == null){
				return;
			}
			if($(this).prop("checked")){
				layer.setVisiable(true);
				mapObj.draw();
			}else{
				layer.setVisiable(false);
				mapObj.draw();			
			}
		});

		// 选中图层
		this.panel.find(".layer-name").click(function(){
			// var activeRow = that.panel.find(".row.active");
			// var preName = activeRow.attr("lname");
			var layerRow = $(this).parents(".row");
			var checkbox = layerRow.find("input[type='checkbox']");
			var name = layerRow.attr("lname");
			if(checkbox.prop("checked")){

			}else{
				checkbox.prop("checked",true);
				var layer = mapObj.getLayer(name);
				if(layer != null){
					layer.setVisiable(true);
					mapObj.draw();
				}
			}
			that.panel.find(".row").removeClass("active");
			layerRow.addClass("active");

			// if(name == preName){
			// 	return;
			// }
			// activeRow.removeClass("active");
			var dataSetName = that.getDataSetName(name);
			MapCloud.mapBar.setCurrentLayer(dataSetName,name);
		});

		// 设置一个默认选中的
		var layerRow = this.panel.find(".row[lname='wwjz']").addClass("active");
		MapCloud.mapBar.setCurrentLayer("文物旧址","wwjz");
	},

	showDataSets : function(dataSets){

		// var layers = mapObj.getLayers();
		var dataSet = null,name = null,layer = null;
		var html = "";
		for(var i = 0; i < dataSets.length;++i){
			dataSet = dataSets[i];
			if(dataSet == null){
				continue;
			}
			name = dataSet.name;
			var layerName = this.getLayerName(name);
			layer = mapObj.getLayer(layerName);
			var checkboxHtml = "<input type='checkbox'>";
			if(layer != null && layer instanceof GeoBeans.Layer.FeatureDBLayer){
				checkboxHtml = "<input type='checkbox' checked>";
			}
			html += "<div class='row' lname='" + name + "'>"
				+	"	<div class='col-md-2'>"
				+	checkboxHtml
				+	"	</div>"
				+	"	<div class='col-md-9'>"
				+	"		<span class='layer-name'>" + name + "</span>"
				+	"	</div>"
				// +	"	<div class='col-md-2'>"
				// +	"		<div class='mc-icon glyphicon glyphicon-ok ' data-toggle='tooltip' "
				// +	"		data-placement='top' data-original-title='选中该图层'></div>"
				// +	"	</div>"
				+	"</div>";
		}
		this.panel.find(".map-layers-list").html(html);
		// this.panel.find("[data-toggle='tooltip']").tooltip({container:'body'});

		var that = this;
		// // 添加当前图层
		// this.panel.find("input[type='checkbox']").change(function(){
		// 	var name = $(this).parents(".row").find(".layer-name").html();
		// 	if($(this).prop("checked")){
		// 		// 选中
		// 		var layerName = that.getLayerName(name);
		// 		if(layerName == null){
		// 			return;
		// 		}
		// 		var layer = new GeoBeans.Layer.FeatureDBLayer(layerName,null,that.sourceName,name,null,null);
		// 		mapObj.insertLayer(layer,that.addLayer_callback);
		// 	}else{
		// 		// 去掉选中
		// 		var layerName = that.getLayerName(name);
		// 		mapObj.removeLayer(layerName,that.removeLayer_callback);
		// 		if($(this).parents(".row").hasClass("active")){
		// 			// MapCloud.currentLayer = null;
		// 			MapCloud.mapBar.setCurrentLayer(null,null);
		// 			$(this).parents(".row").removeClass("active");
		// 			that.panel.find(".current-layer-name").empty();
		// 		}
		// 	}
		// });


		// 选中图层
		this.panel.find(".layer-name").click(function(){
			var activeRow = that.panel.find(".row.active");
			var preName = activeRow.attr("lname");
			var name = $(this).parents(".row").attr("lname");
			if(name == preName){
				return;
			}
			activeRow.removeClass("active");
			$(this).parents(".row").addClass("active");
			var layerName = that.getLayerName(name);
			var layer = mapObj.getLayer(layerName);
			if(layer == null){
				var layer = new GeoBeans.Layer.FeatureDBLayer(layerName,null,that.sourceName,name,null,null);
				mapObj.insertLayer(layer,that.addLayer_callback);
				$(this).parents(".row").find("input[type='checkbox']").prop("checked",true);
			}else{
				mapObj.zoomToLayer(layerName);
			}
			MapCloud.mapBar.setCurrentLayer(name,layerName);
		});


		// 设置已经选中的图层
		// if(MapCloud.currentLayer != null){
		// 	this.panel.find(".map-layers-list .row[lname='MapCloud.currentLayer']").addClass("active");
		// }

		var firstRow = this.panel.find("input[type='checkbox']:checked")
				.first().parents(".row");
		firstRow.addClass("active");
		var dataSetName = firstRow.attr("lname");
		var layerName = this.getLayerName(dataSetName);
		MapCloud.mapBar.setCurrentLayer(dataSetName,layerName);

	},

	removeLayer_callback : function(obj){
		mapObj.draw();
	},
	addLayer_callback : function(result,layer){
		mapObj.draw();
		mapObj.zoomToLayer(layer.name);
		var that = MapCloud.mapLayersPanel;
		if(result == "success"){
			that.setLayerStyle(layer);
		}
		
	},



	// 设置样式
	setLayerStyle : function(layer){
		if(layer == null){
			return;
		}
		var styleName = this.getStyleName(layer);
		if(styleName != null){
			var style = new GeoBeans.Style.FeatureStyle(styleName,null);
			mapObj.setStyle(layer.name,style,this.setStyle_callback);
		}
	},

	setStyle_callback : function(result){

	},

	getStyleName : function(layer){
		if(layer == null){
			return;
		}
		var name = layer.name;
		var styleName = null;
		switch(name){
			case "餐饮场所":
			case "cymscs":{
				styleName = "tj_cymscs";
				break;
			}
			case "车辆服务":
			case "clfw":{
				styleName = "tj_clfw";
				break;
			}
			case "次要道路":
			case "cydl":{
				styleName = "tj_cydl";
				break;
			}
			case "地标":
			case "db":{
				styleName = "tj_db";
				break;
			}
			case "地名地址":
			case "dmdz":{
				styleName = "tj_dmdz";
				break;
			}
			case "地铁站":
			case "subway":{
				styleName = "tj_subway";
				break;
			}
			case "公安局":
			case "police":{
				styleName = "tj_police";
				break;
			}
			case "公共设施":
			case "ggss":{
				styleName = "tj_ggss";
				break;
			}
			case "公园":
			case "zb":{
				styleName = "tj_zb";
				break;
			}
			case "工厂":
			case "gc":{
				styleName = "tj_gc";
				break;
			}
			case "国道环线":
			case "gdhx":{
				styleName = "tj_gdhx";
				break;
			}
			case "行政区":
			case "xzq":{
				styleName = "tj_xzq";
				break;
			}
			case "河流":
			case "hyda":{
				styleName = "tj_hyda";
				break;
			}
			case "建筑物":
			case "jzw":{
				styleName = "tj_jzw";
				break;
			}
			case "交通设施":
			case "jtss":{
				styleName = "tj_jtss";
				break;
			}
			case "街道楼盘":
			case "jdlp":{
				styleName = "tj_jdlp";
				break;
			}
			case "金融服务":
			case "jrfw":{
				styleName = "tj_jrfw";
				break;
			}
			case "酒吧":
			case "jb":{
				styleName = "tj_jb";
				break;
			}
			case "立交桥":
			case "lijiaoqiao":{
				styleName = "tj_lijiaoqiao";
				break;
			}
			case "旅游景点":
			case "spot":{
				styleName = "tj_spot";
				break;
			}
			case "其他":
			case "other":{
				styleName = "tj_xzq";
				break;
			}
			case "区县行政区":
			case "qx":{
				styleName = "tj_qx";
				break;
			}
			case "人民政府":
			case "rmzf":{
				styleName = "tj_jdlp";
				break;
			}
			case "商店":
			case "sd":{
				styleName = "tj_gc";
				break;
			}
			case "生活服务":
			case "life":{
				styleName = "tj_ggss";
				break;
			}
			case "市界线":
			case "xz_shijie":{
				styleName = "tj_xz_shijie";
				break;
			}
			case "水系":
			case "sx":{
				styleName = "tj_sx";
				break;
			}
			case "铁路":
			case "railway":{
				styleName = "tj_railway";
				break;
			}
			case "文化剧院":
			case "whjy":{
				styleName = "tj_clfw";
				break;
			}
			case "文物旧址":
			case "wwjz":{
				styleName = "tj_db";
				break;
			}
			case "县级行政区":
			case "xjxzq":{
				styleName = "tj_gdhx";
				break;
			}
			case "县界":
			case "xz_xianjie":{
				styleName = "th_xz_xianjie";
				break;
			}
			case "乡镇地址":
			case "xzdz":{
				styleName = "tj_dmdz";
				break;
			}
			case "学校":
			case "xx":{
				styleName = "tj_police";
				break;
			}
			case "医疗服务机构":
			case "ylfw":{
				styleName = "tj_jzw";
				break;
			}
			case "医院":
			case "yy":{
				styleName = "tj_spot";
				break;
			}
			case "主要道路":
			case "zydl":{
				styleName = "tj_zzdl";
				break;
			}
			case "住宿场所":
			case "zscs":{
				styleName = "tj_cymscs";
				break;
			}
			default:
				break;
		}

		if(styleName != null && styleName != ""){
			return styleName;
		}

		return null;

	},

	// 转换成字母的名字
	getLayerName: function(name){
		var layerName = null;
		switch(name){
			case "餐饮场所":{
				layerName = "cymscs";
				break;
			}
			case "车辆服务":{
				layerName = "clfw";
				break;
			}
			case "次要道路":{
				layerName = "cydl";
				break;
			}
			case "地标":{
				layerName = "db";
				break;
			}
			case "地名地址":{
				layerName = "dmdz";
				break;
			}
			case "地铁站":{
				layerName = "subway";
				break;
			}
			case "公安局":{
				layerName = "police";
				break;
			}
			case "公共设施":{
				layerName = "ggss";
				break;
			}
			case "公园":{
				layerName = "zb";
				break;
			}
			case "工厂":{
				layerName = "gc";
				break;
			}
			case "国道环线":{
				layerName = "gdhx";
				break;
			}
			case "行政区":{
				layerName = "xzq";
				break;
			}
			case "河流":{
				layerName = "hyda";
				break;
			}
			case "建筑物":{
				layerName = "jzw";
				break;
			}
			case "交通设施":{
				layerName = "jtss";
				break;
			}
			case "街道楼盘":{
				layerName = "jdlp";
				break;
			}
			case "金融服务":{
				layerName = "jrfw";
				break;
			}
			case "酒吧":{
				layerName = "jb";
				break;
			}
			case "立交桥":{
				layerName = "lijiaoqiao";
				break;
			}
			case "旅游景点":{
				layerName = "spot";
				break;
			}
			case "其他":{
				layerName = "other";
				break;
			}
			case "区县行政区":{
				layerName = "qx";
				break;
			}
			case "人民政府":{
				layerName = "rmzf";
				break;
			}
			case "商店":{
				layerName = "sd";
				break;
			}
			case "生活服务":{
				layerName = "life";
				break;
			}
			case "市界线":{
				layerName = "xz_shijie";
				break;
			}
			case "水系":{
				layerName = "sx";
				break;
			}
			case "铁路":{
				layerName = "railway";
				break;
			}
			case "文化剧院":{
				layerName = "whjy";
				break;
			}
			case "文物旧址":{
				layerName = "wwjz";
				break;
			}
			case "县级行政区":{
				layerName = "xjxzq";
				break;
			}
			case "县界":{
				layerName = "xz_xianjie";
				break;
			}
			case "乡镇地址":{
				layerName = "xzdz";
				break;
			}
			case "学校":{
				layerName = "xx";
				break;
			}
			case "医疗服务机构":{
				layerName = "ylfw";
				break;
			}
			case "医院":{
				layerName = "yy";
				break;
			}
			case "主要道路":{
				layerName = "zydl";
				break;
			}
			case "住宿场所":{
				layerName = "zscs";
				break;
			}
			default:
				break;
		}
		return layerName;
	},

	// 获得数据名称
	getDataSetName : function(layerName){
		var dataSetName = null;
		switch(layerName){
			case "cymscs":{
				dataSetName = "餐饮场所";
				break;
			}
			case "clfw":{
				dataSetName = "车辆服务";
				break;
			}
			case "cydl":{
				dataSetName = "次要道路";
				break;
			}
			case "db":{
				dataSetName = "地标";
				break;
			}
			case "dmdz":{
				dataSetName = "地名地址";
				break;
			}
			case "subway":{
				dataSetName = "地铁站";
				break;
			}
			case "police":{
				dataSetName = "公安局";
				break;
			}
			case "ggss":{
				dataSetName = "公共设施";
				break;
			}
			case "zb":{
				dataSetName = "公园";
				break;
			}
			case "gc":{
				dataSetName = "工厂";
				break;
			}
			case "gdhx":{
				dataSetName = "国道环线";
				break;
			}
			case "xzq":{
				dataSetName = "行政区";
				break;
			}
			case "hyda":{
				dataSetName = "河流";
				break;
			}
			case "jzw":{
				dataSetName = "建筑物";
				break;
			}
			case "jtss":{
				dataSetName = "交通设施";
				break;
			}
			case "jdlp":{
				dataSetName = "街道楼盘";
				break;
			}
			case "jrfw":{
				dataSetName = "金融服务";
				break;
			}
			case "jb":{
				dataSetName = "酒吧";
				break;
			}
			case "lijiaoqiao":{
				dataSetName = "立交桥";
				break;
			}
			case "spot":{
				dataSetName = "旅游景点";
				break;
			}
			case "other":{
				dataSetName = "其他";
				break;
			}
			case "qx":{
				dataSetName = "区县行政区";
				break;
			}
			case "rmzf":{
				dataSetName = "人民政府";
				break;
			}
			case "sd":{
				dataSetName = "商店";
				break;
			}
			case "life":{
				dataSetName = "生活服务";
				break;
			}
			case "xz_shijie":{
				dataSetName = "市界线";
				break;
			}
			case "sx":{
				dataSetName = "水系";
				break;
			}
			case "railway":{
				dataSetName = "铁路";
				break;
			}
			case "whjy":{
				dataSetName = "文化剧院";
				break;
			}
			case "wwjz":{
				dataSetName = "文物旧址";
				break;
			}
			case "xjxzq":{
				dataSetName = "县级行政区";
				break;
			}
			case "xz_xianjie":{
				dataSetName = "县界";
				break;
			}
			case "xzdz":{
				dataSetName = "乡镇地址";
				break;
			}
			case "xx":{
				dataSetName = "学校";
				break;
			}
			case "ylfw":{
				dataSetName = "医疗服务机构";
				break;
			}
			case "yy":{
				dataSetName = "医院";
				break;
			}
			case "zydl":{
				dataSetName = "主要道路";
				break;
			}
			case "zscs":{
				dataSetName = "住宿场所";
				break;
			}
			default:
				break;
		}
		return dataSetName;
	},

});