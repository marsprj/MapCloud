MapCloud.MapLayersPanel = MapCloud.Class(MapCloud.Panel,{
	
	dbsManager : null,

	sourceName : "tianjin",

	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		
		this.dbsManager = user.getDBSManager();
		this.registerPanelEvent();
		this.getDataSource();
	},	

	showPanel : function(){
		MapCloud.Panel.prototype.showPanel.apply(this,arguments);
	},

	show : function(){
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
		// 添加当前图层
		this.panel.find("input[type='checkbox']").change(function(){
			var name = $(this).parents(".row").find(".layer-name").html();
			if($(this).prop("checked")){
				// 选中
				var layerName = that.getLayerName(name);
				if(layerName == null){
					return;
				}
				var layer = new GeoBeans.Layer.FeatureDBLayer(layerName,null,that.sourceName,name,null,null);
				mapObj.insertLayer(layer,that.addLayer_callback);
			}else{
				// 去掉选中
				var layerName = that.getLayerName(name);
				mapObj.removeLayer(layerName,that.removeLayer_callback);
				if($(this).parents(".row").hasClass("active")){
					// MapCloud.currentLayer = null;
					MapCloud.mapBar.setCurrentLayer(null,null);
					$(this).parents(".row").removeClass("active");
					that.panel.find(".current-layer-name").empty();
				}
			}
		});

		// 选中当前图层
		this.panel.find(".glyphicon-ok").click(function(){
			var name = $(this).parents(".row").find(".layer-name").html();
			if(name == MapCloud.currentLayer){
				MapCloud.currentLayer = null;
				that.panel.find(".current-layer-name").empty();
				$(this).parents(".row").removeClass("active");
				return;
			}
			var layer = mapObj.getLayer(name);
			if(layer == null){
				// 添加该图层
				var layer = new GeoBeans.Layer.FeatureDBLayer(name,null,that.sourceName,name,null,null);
				mapObj.insertLayer(layer,that.addLayer_callback);
				$(this).parents(".row").find("input[type='checkbox']").prop("checked",true);
			}else{
				mapObj.zoomToLayer(name);
			}

			that.panel.find(".map-layers-list .row").removeClass("active");
			$(this).parents(".row").addClass("active");
			that.panel.find(".current-layer-name").html(name);
			MapCloud.currentLayer = name;

		});

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
	}

});