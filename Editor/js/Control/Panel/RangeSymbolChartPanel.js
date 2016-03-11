MapCloud.RangeSymbolChartPanel = MapCloud.Class(MapCloud.Panel,{
	dbName : null,

	tableName : null,


	chartLayer : null,

	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		this.registerEvent();
	},

	showPanel : function(){
		if(this.panel.css("display") == "none"){
			this.cleanup();
			this.panel.css("display","block");
			this.panel.find(".panel-collapse").each(function(){
				if($(this).hasClass("in")){
					$(this).collapse("hide");
				}
			});
			var firstPanel = this.panel.find(".panel-collapse").first();
			if(!firstPanel.hasClass("in")){
				firstPanel.collapse("show");
			}
			var colors = styleManager.getColorMaps();
			this.getColorMaps_callback(colors);
			this.showLayerTab();
		}
	},
	hidePanel : function(){
		MapCloud.Panel.prototype.hidePanel.apply(this,arguments);
		MapCloud.refresh_panel.refreshPanel();
	},

	cleanup : function(){
		this.dbName = null;
		this.tableName = null;
		this.chartLayer = null;
		this.panel.find(".chart-table-name").val("分级和等级符号图");
		this.panel.find(".chart-table").val("");
		this.panel.find(".chart-table-fields").empty();
		this.panel.find(".r-chart-base-layer").empty();
		this.panel.find(".r-chart-base-layer-fields").empty();
		this.panel.find(".s-chart-base-layer").empty();
		this.panel.find(".s-chart-base-layer-fields").empty();
		this.panel.find("#r_chart_style_fields").empty();
		this.panel.find("#s_chart_style_fields").empty();

		this.panel.find(".colorSelector").colpickSetColor("#EEEEEE");
		this.panel.find(".colorSelector div").css("background-color",'#EEEEEE');
		this.panel.find(".colorSelector div").css("opacity",1);
		this.panel.find("input.slider").slider("setValue",100);
		this.panel.find(".opacity-value").html(1);
		
		this.panel.find(".chart-table-max-size").val(2);
		this.panel.find(".form-group-choose-level input[type='checkbox']").prop("checked",false);
		this.panel.find("#chart_table_level").prop("disabled",true);
		this.panel.find("#chart_table_level option[value='4']").attr("selected",true);

	},

	registerEvent : function(){
		var that = this;

		// 选择图表
		this.panel.find(".btn-chose-chart").click(function(){
			MapCloud.vector_db_dialog.showDialog("rs");
		});

		// 设置颜色选择器
		this.panel.find(".colorSelector").each(function(){
			$(this).colpick({
				color:'EEEEEE',
				onChange:function(hsb,hex,rgb,el,bySetColor) {
					$(el).children().css("background-color","#" + hex);
				},
				onSubmit:function(hsb,hex,rgb,el,bySetColor){
					$(el).children().css("background-color","#" + hex);
					$(el).colpickHide();
				}
			});
		});

		// 设置颜色透明度
		this.panel.find(".form-group .slider").each(function(){
			$(this).slider({
				tooltip : 'hide'
			});
			$(this).on("slide",function(slideEvt){
				var opacity = slideEvt.value;
				$(this).parents(".control-label").next().html(opacity/100);
				var styleDiv = $(this).parent().prev().find(".colorSelector div");
				styleDiv.css("opacity",opacity/100);
			});
		});

		// 切换range base 
		this.panel.find(".r-chart-base-layer").change(function(){
			var value = $(this).val();
			that.showRangeBaseLayerFields(value);
		});

		// 切换symbol base
		this.panel.find(".s-chart-base-layer").change(function(){
			var value = $(this).val();
			that.showSymbolBaseLayerFields(value);
		});

		//关闭
		this.panel.find(".btn-cancel").click(function(){
			that.hidePanel();
		});

		// 添加
		this.panel.find(".btn-add-chart").click(function(){
			if(that.chartLayer == null){
				that.addChart();
			}else{
				that.changeChartOption();
			}
			MapCloud.refresh_panel.refreshPanel();
		});

		// 设置是否是分等级
		this.panel.find(".form-group-choose-level input[type='checkbox']").change(function(){
			var checked = $(this).prop("checked");
			if(checked){
				that.panel.find("#chart_table_level").prop("disabled",false);
			}else{
				that.panel.find("#chart_table_level").prop("disabled",true);
			}
		});
	},

	// 初始化选择图表
	setDataSet : function(dbName,tableName){
		this.dbName = dbName;
		this.tableName = tableName;

		this.panel.find(".chart-table").val(this.tableName);
		this.showTableFields(this.dbName,this.tableName);
	},

	// 图表的字段
	showTableFields : function(db,table){
		var workspace = new GeoBeans.WFSWorkspace("tmp",
				mapObj.server,"1.0.0");
		var tableFeatureType = new GeoBeans.FeatureType(workspace,table);
		var fields = tableFeatureType.getFields(null,db);
		if(fields == null){
			return;
		}
		var field = null;
		var name = null;
		var html = "";
		for(var i = 0; i < fields.length; ++i){
			field = fields[i];
			if(field == null){
				continue;
			}
			name = field.name;
			html += "<option value='" + name +　"'>" + name + "</option>";
		}

		this.panel.find(".chart-table-fields").html(html);
		this.showChartFields(fields);		
	},

	showLayerTab : function(){
		// range base layer
		this.showRangeBaseLayer();
		this.showSymbolBaseLayer();
	},
	// range base 
	showRangeBaseLayer : function(){
		if(mapObj == null){
			return;
		}
		var layers = mapObj.getLayers();
		var layer = null;
		var name = null;
		var html = "";
		for(var i = 0; i < layers.length; ++i){
			layer = layers[i];
			if(layer instanceof GeoBeans.Layer.DBLayer && 
				(layer.geomType == GeoBeans.Geometry.Type.POLYGON
				|| layer.geomType == GeoBeans.Geometry.Type.MULTIPOLYGON)){
				name = layer.name;
				html += "<option value='" + name + "'>" 
				+ name + "</option>";
			}
		}
		this.panel.find(".r-chart-base-layer").html(html);
		var layerName = this.panel.find(".r-chart-base-layer").val();
		this.showRangeBaseLayerFields(layerName);		
	},

	showRangeBaseLayerFields : function(layerName){
		var layer = mapObj.getLayer(layerName);
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
			if(field == null){
				continue;
			}
			name = field.name;
			html += "<option value ='" + name + "'>"
			+ name + "</option>";
		}
		this.panel.find(".r-chart-base-layer-fields").html(html);		
	},

	// symbol base
	showSymbolBaseLayer : function(){
		if(mapObj == null){
			return;
		}
		var layers = mapObj.getLayers();
		var layer = null;
		var html = "";
		var name = null;
		for(var i = 0; i < layers.length; ++i){
			layer = layers[i];
			if(layer != null && layer instanceof GeoBeans.Layer.DBLayer
				&& layer.geomType == GeoBeans.Geometry.Type.POINT){
				name = layer.name;
				html += "<option value='" + name + "'>" 
					+ name + "</option>";
			}
		}
		this.panel.find(".s-chart-base-layer").html(html);

		var layerName = this.panel.find(".s-chart-base-layer").val();
		this.showSymbolBaseLayerFields(layerName);
	},

	showSymbolBaseLayerFields : function(layerName){
		var layer = mapObj.getLayer(layerName);
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
			if(field == null){
				continue;
			}
			name = field.name;
			html += "<option value ='" + name + "'>"
			+ name + "</option>";
		}
		this.panel.find(".s-chart-base-layer-fields").html(html);		
	},

	// set number fields
	showChartFields : function(fields){
		if(fields == null){
			return;
		}
		var field = null;
		var name = null;
		var type = null;
		var html = "";
		for(var i = 0; i < fields.length; ++i){
			field = fields[i];
			if(field == null){
				continue;
			}
			type = field.type;
			if(type == "double" || type == "int" || type == "float"){
				name = field.name;
				html += "<option value='" + name +"'>" 
				+ name + "</option>";
			}
			
		}
		this.panel.find("#r_chart_style_fields,#s_chart_style_fields").html(html);
	},

	addChart : function(){
		if(mapObj == null){
			MapCloud.notify.showInfo("当前地图为空","Warning");
			return;
		}

		var dbName =  this.dbName;
		var tableName = this.tableName;
		if(dbName == null || tableName == null){
			MapCloud.notify.showInfo("请设置表格","Warning");
			return;
		}
		var tableField = this.panel.find(".chart-table-fields").val();
		if(tableField == null || tableField == ""){
			MapCloud.notify.showInfo("请设置关联字段","Warning");
			return;
		}	

		var name = this.panel.find(".chart-table-name").val();
		if(name == ""){
			MapCloud.notify.showInfo("请输入专题图名称","Warning");
			this.panel.find(".chart-table-name").focus();
			return;
		}
		var rangeBaseLayerName = this.panel.find(".r-chart-base-layer").val();
		if(rangeBaseLayerName == null || rangeBaseLayerName == ""){
			MapCloud.notify.showInfo("请选择面底图","Warning");
			return;
		}
		var rangeBaseLayerField = this.panel.find(".r-chart-base-layer-fields").val();
		if(rangeBaseLayerField == null || rangeBaseLayerField == ""){
			MapCloud.notify.showInfo("请选择面底图的关联字段","Warning");
			return;
		}

		var symbolBaseLayerName = this.panel.find(".s-chart-base-layer").val();
		if(symbolBaseLayerName == null || symbolBaseLayerName == ""){
			MapCloud.notify.showInfo("请选择点底图","Warning");
			return;
		}
		var symbolBaseField = this.panel.find(".s-chart-base-layer-fields").val();
		if(symbolBaseField == null || symbolBaseField == ""){
			MapCloud.notify.showInfo("请选择点底图的关联字段","Warning");
			return;
		}

		var rangeChartField = this.panel.find("#r_chart_style_fields").val();
		if(rangeChartField == null || rangeChartField == ""){
			MapCloud.notify.showInfo("请选择分级图的字段","Warning");
			return;
		}

		var symbolChartField = this.panel.find("#s_chart_style_fields").val();
		if(symbolChartField == null || symbolChartField == ""){
			MapCloud.notify.showInfo("请选择等级符号图的字段","Warning");
			return;
		}

		var maxSize = this.panel.find(".chart-table-max-size").val();
		if(maxSize == null || maxSize == ""){
			MapCloud.notify.showInfo("请设置等级符号大小","Warning");
			return;
		}	

		var rangeOption = this.getRangeChartOption();
		var symbolOption = this.getSymbolChartOption();
		var layer = new GeoBeans.Layer.RangeSymbolChartLayer(name,rangeBaseLayerName,rangeBaseLayerField,
			rangeChartField,symbolBaseLayerName,symbolBaseField,symbolChartField,dbName,tableName,tableField,
			rangeOption,symbolOption);
		mapObj.addLayer(layer,this.addLayer_callback);

	},

	changeChartOption : function(){
		if(this.chartLayer == null){
			return;
		}
		var name = this.panel.find(".chart-table-name").val();
		if(name == ""){
			MapCloud.notify.showInfo("请输入专题图名称","Warning");
			this.panel.find(".chart-table-name").focus();
			return;
		}
		this.chartLayer.setName(name);

		if(this.dbName != this.chartLayer.dbName){
			this.chartLayer.setDbName(this.dbName);
		}
		if(this.tableName != this.chartLayer.tableName){
			this.chartLayer.setTableName(this.tableName);
		}

		var tableField = this.panel.find(".chart-table-fields").val();
		if(tableField == null || tableField == ""){
			MapCloud.notify.showInfo("请设置关联字段","Warning");
			return;
		}
		this.chartLayer.setTableField(tableField);			


		var rangeBaseLayerName = this.panel.find(".r-chart-base-layer").val();
		if(rangeBaseLayerName == null || rangeBaseLayerName == ""){
			MapCloud.notify.showInfo("请选择面底图","Warning");
			return;
		}
		this.chartLayer.setRangeBaseLayer(rangeBaseLayerName);

		var rangeBaseLayerField = this.panel.find(".r-chart-base-layer-fields").val();
		if(rangeBaseLayerField == null || rangeBaseLayerField == ""){
			MapCloud.notify.showInfo("请选择面底图的关联字段","Warning");
			return;
		}
		this.chartLayer.setRangeBaseLayerField(rangeBaseLayerField);


		var symbolBaseLayerName = this.panel.find(".s-chart-base-layer").val();
		if(symbolBaseLayerName == null || symbolBaseLayerName == ""){
			MapCloud.notify.showInfo("请选择点底图","Warning");
			return;
		}

		var symbolBaseLayerName = this.panel.find(".s-chart-base-layer").val();
		if(symbolBaseLayerName == null || symbolBaseLayerName == ""){
			MapCloud.notify.showInfo("请选择点底图","Warning");
			return;
		}
		this.chartLayer.setSymbolBaseLayer(symbolBaseLayerName);

		var symbolBaseField = this.panel.find(".s-chart-base-layer-fields").val();
		if(symbolBaseField == null || symbolBaseField == ""){
			MapCloud.notify.showInfo("请选择点底图的关联字段","Warning");
			return;
		}
		this.chartLayer.setSymbolBaseLayerField(symbolBaseField);

		var rangeChartField = this.panel.find("#r_chart_style_fields").val();
		if(rangeChartField == null || rangeChartField == ""){
			MapCloud.notify.showInfo("请选择分级图的字段","Warning");
			return;
		}
		this.chartLayer.setRangeChartField(rangeChartField);


		var symbolChartField = this.panel.find("#s_chart_style_fields").val();
		if(symbolChartField == null || symbolChartField == ""){
			MapCloud.notify.showInfo("请选择等级符号图的字段","Warning");
			return;
		}
		this.chartLayer.setSymbolChartField(symbolChartField);	

		var rangeOption = this.getRangeChartOption();
		this.chartLayer.setRangeChartOption(rangeOption);
		var symbolOption = this.getSymbolChartOption();
		this.chartLayer.setSymbolChartOption(symbolOption);

		mapObj.draw();
	},

	// 色阶地图 
	getColorMaps_callback : function(colorMaps){
		if(colorMaps == null){
			return;
		}
		
		var that = MapCloud.range_symbol_chart_panel;
		var colorMap = null;
		var url = null;
		var html = "";
		for(var i = 0; i < colorMaps.length; ++i){
			colorMap = colorMaps[i];
			url = colorMap.url;
			html += "<li cid='" + colorMap.id + "'>"
				+ 	"	<div class='color-ramp-item' style='background-image:"
				+ 	"	url(" + url + ")'>"
				+ 	"	</div>"
				+	"</li>"
		}
		that.panel.find(".color-ramp-div ul").html(html);

		colorMap = colorMaps[0];
		if(colorMap != null){
			url = colorMap.url;
			var id = colorMap.id;
			var htmlSel = "<li cid='" + id + "'>"
				+ 	"	<div class='color-ramp-item' style='background-image:"
				+ 	"	url(" + url + ")'>"
				+ 	"	</div>"
				+	"</li>";
			that.panel.find(".select-color-ramp").html(htmlSel);
		}

		that.panel.find(".color-ramp-div ul li").click(function(){
			var id = $(this).attr("cid");
			that.panel.find(".select-color-ramp li").attr("cid",id);
			var backgroundUrl = $(this).find(".color-ramp-item").css("background-image");
			that.panel.find(".select-color-ramp li .color-ramp-item").css("background-image",backgroundUrl);
		});
	},	

	// range option 
	getRangeChartOption : function(){
		var borderDiv = this.panel.find("#r_chart_style_coll .form-group-border .colorSelector div")
		var borderOpacity = borderDiv.css("opacity");
		var colorRgb = borderDiv.css("background-color");
		var color = new GeoBeans.Color();
		color.setByRgb(colorRgb,1);
		var colorHex = color.getHex();
		var colorMapID = this.panel.find(".select-color-ramp li").attr("cid");
		var opacity = this.panel.find("#r_chart_style_coll .form-group-color .opacity-value").html()
		var option = {
			colorMapID 		: colorMapID,
			opacity 		: parseFloat(opacity),
			border 			: colorHex,
			borderOpacity	: parseFloat(borderOpacity)
		};
		return option;
	},

	// symbol option
	getSymbolChartOption : function(){
		var colorDiv = this.panel.find("#s_chart_style_coll .form-group-color .colorSelector div");
		var opacity = colorDiv.css("opacity");
		var colorRgb = colorDiv.css("background-color");
		var color = new GeoBeans.Color();
		color.setByRgb(colorRgb,1);
		var colorHex = color.getHex();

		var borderDiv = this.panel.find("#s_chart_style_coll .form-group-border .colorSelector div");
		var borderOpacity = borderDiv.css("opacity");
		var borderColorRgb = borderDiv.css("background-color");
		var color = new GeoBeans.Color();
		color.setByRgb(borderColorRgb,1);
		var borderColorHex = color.getHex();

		var maxSize = this.panel.find(".chart-table-max-size").val();
		var checked = this.panel.find(".form-group-choose-level input[type='checkbox']")
			.prop("checked");
		var level = this.panel.find("#chart_table_level").val();
		var byLevelFlag = false;
		if(checked){
			byLevelFlag = true;
		}
		var chartOption = {
			color : colorHex,
			opacity : parseFloat(opacity),
			border : borderColorHex,
			borderOpacity : parseFloat(borderOpacity),
			maxsize : parseFloat(maxSize),
			byLevel : byLevelFlag,
			level : level
		};
		return chartOption;
	},

	addLayer_callback : function(result){
		var that = MapCloud.range_symbol_chart_panel;
		if(result == "success"){
			mapObj.draw();
			var name = that.panel.find(".chart-table-name").val();
			that.chartLayer = mapObj.getLayer(name);			
		}else{
			MapCloud.notify.showInfo(result,"添加分级和等级符号图");
		}	
	},
	setChartLayer : function(layer){
		this.chartLayer = layer;
		if(this.chartLayer == null){
			return;
		}
		//底图设置
		var name = this.chartLayer.name;
		this.panel.find(".chart-table-name").val(name);
		var rangeBaseLayerName = this.chartLayer.rangeBaseLayerName;
		var rangeBaseLayerField = this.chartLayer.rangeBaseLayerField;
		var rangeChartField = this.chartLayer.rangeChartField;

		var symbolBaseLayerName = this.chartLayer.symbolBaseLayerName;
		var symbolBaseLayerField = this.chartLayer.symbolBaseLayerField;
		var symbolChartField = this.chartLayer.symbolChartField;

		var dbName = this.chartLayer.dbName;
		var tableName = this.chartLayer.tableName;
		var tableField = this.chartLayer.tableField;


		this.dbName = dbName;
		this.tableName = tableName;
		this.panel.find(".chart-table").val(this.tableName);
		this.showTableFields(this.dbName,this.tableName);
		this.panel.find(".chart-table-fields option[value='" + tableField + "']")
			.attr("selected",true);
		this.panel.find(".r-chart-base-layer option[value='" + rangeBaseLayerName + "']")
			.attr("selected",true);
		this.panel.find(".r-chart-base-layer-fields option[value='" + rangeBaseLayerField+ "']")
			.attr("selected",true);
		this.panel.find(".s-chart-base-layer option[value='" + symbolBaseLayerName + "']")
			.attr("selected",true);
		this.panel.find(".s-chart-base-layer-fields option[value='" + symbolBaseLayerField + "']")
			.attr("selected",true);


		// range option
		this.panel.find("#r_chart_style_fields option[value='" + rangeChartField + "']")
			.attr("selected",true);
		var rangeOption = this.chartLayer.rangeOption;
		var colorMapID = rangeOption.colorMapID;
		var border = rangeOption.border;
		var borderOpacity = rangeOption.borderOpacity;
		var opacity = rangeOption.opacity;


		this.panel.find("#r_chart_style_coll .form-group-color input.slider")
			.slider("setValue",opacity*100);
		this.panel.find("#r_chart_style_coll .form-group-border input.slider")
			.slider("setValue",borderOpacity*100);
		this.panel.find("#r_chart_style_coll .form-group-border .colorSelector").colpickSetColor(border);
		this.panel.find("#r_chart_style_coll .form-group-border .colorSelector div").css("background-color",border);
		this.panel.find("#r_chart_style_coll .form-group-border .colorSelector div").css("opacity",borderOpacity);

		this.panel.find("#r_chart_style_coll .form-group-color .opacity-value").html(opacity);
		this.panel.find("#r_chart_style_coll .form-group-border .opacity-value").html(borderOpacity);

		colorMapID = parseInt(colorMapID);
		this.panel.find(".select-color-ramp li").attr("cid",colorMapID);
		var li = this.panel.find(".dropdown-menu li[cid='" + colorMapID +"']");
		var backgroundUrl = li.find(".color-ramp-item").css("background-image");
		this.panel.find(".select-color-ramp li .color-ramp-item").css("background-image",backgroundUrl);


		// symbol option
		this.panel.find("#s_chart_style_fields option[value='" + symbolChartField +"']")
			.attr("selected",true);
		var symbolOption = this.chartLayer.symbolOption;
		var color = symbolOption.color;
		var opacity = symbolOption.opacity;
		var border = symbolOption.border;
		var borderOpacity = symbolOption.borderOpacity;
		var byLevelFlag = symbolOption.byLevel;
		var maxsize = symbolOption.maxsize;
		var level = symbolOption.level;

		this.panel.find("#s_chart_style_coll .form-group-color input.slider")
			.slider("setValue",opacity*100);
		this.panel.find("#s_chart_style_coll .form-group-border input.slider")
			.slider("setValue",borderOpacity*100);
		this.panel.find("#s_chart_style_coll .form-group-color .opacity-value").html(opacity);
		this.panel.find("#s_chart_style_coll .form-group-border .opacity-value").html(borderOpacity);
		this.panel.find(".chart-table-max-size").val(maxsize);	

		if(byLevelFlag){
			this.panel.find(".form-group-choose-level input[type='checkbox']")
			.prop("checked",true);
			this.panel.find("#chart_table_level").val(level);
		}else{
			this.panel.find(".form-group-choose-level input[type='checkbox']")
			.prop("checked",false);
		}	

		// 设置颜色
		this.panel.find("#s_chart_style_coll .form-group-color .colorSelector").colpickSetColor(color);
		this.panel.find("#s_chart_style_coll .form-group-color .colorSelector div").css("background-color",color);
		this.panel.find("#s_chart_style_coll .form-group-color .colorSelector div").css("opacity",opacity);
		this.panel.find("#s_chart_style_coll .form-group-border .colorSelector").colpickSetColor(border);
		this.panel.find("#s_chart_style_coll .form-group-border .colorSelector div").css("background-color",border);
		this.panel.find("#s_chart_style_coll .form-group-border .colorSelector div").css("opacity",borderOpacity);		
	},
});