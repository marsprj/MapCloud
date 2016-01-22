MapCloud.SymbolChartPanel = MapCloud.Class(MapCloud.Panel,{
	
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
			
			this.showLayerTab();
		}
	},

	hidePanel : function(){
		MapCloud.Panel.prototype.hidePanel.apply(this,arguments);
		MapCloud.refresh_panel.refreshPanel();
	},

	cleanup : function(){
		this.chartLayer = null;
		this.dbName = null;
		this.tableName = null;

		this.panel.find(".chart-table-name").val("等级符号图");
		this.panel.find(".chart-table").val("");
		this.panel.find(".chart-table-fields").empty();
		this.panel.find(".chart-base-layer").empty();
		this.panel.find(".chart-base-layer-fields").empty();
		this.panel.find("#symbol_chart_style_fields").empty();
		this.panel.find(".form-group-color input.slider").slider("setValue",100);
		this.panel.find(".form-group-border input.slider").slider("setValue",100);
		this.panel.find("#symbol_chart_style_opacity,#symbol_chart_style_border_opacity").html(1.0);
		this.panel.find(".chart-table-max-size").val(2);
		this.panel.find(".form-group-choose-level input[type='checkbox']").prop("checked",false);
		this.panel.find("#chart_table_level").prop("disabled",true);
		this.panel.find("#chart_table_level option[value='4']").attr("selected",true);
		this.panel.find(".colorSelector").colpickSetColor("#EEEEEE");
		this.panel.find(".colorSelector div").css("background-color",'#EEEEEE');
		this.panel.find(".colorSelector div").css("opacity",1);
			
	},

	registerEvent : function(){
		var that = this;

		// 选择图表
		this.panel.find(".btn-chose-chart").click(function(){
			MapCloud.vector_db_dialog.showDialog("symbol");
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
		this.panel.find(".form-group-color .slider").each(function(){
			$(this).slider({
				tooltip : 'hide'
			});
			$(this).on("slide",function(slideEvt){
				var opacity = slideEvt.value;
				that.panel.find("#symbol_chart_style_opacity").html(opacity/100);
				var styleDiv = $(this).parent().prev().find(".colorSelector div");
				styleDiv.css("opacity",opacity/100);
			});
		});

		// 设置边界透明度
		this.panel.find(".form-group-border .slider").each(function(){
			$(this).slider({
				tooltip : 'hide'
			});
			$(this).on("slide",function(slideEvt){
				var opacity = slideEvt.value;
				that.panel.find("#symbol_chart_style_border_opacity").html(opacity/100);
				var styleDiv = $(this).parent().prev().find(".colorSelector div");
				styleDiv.css("opacity",opacity/100);
			});
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

		// 切换底图
		this.panel.find(".chart-base-layer").change(function(){
			var value = $(this).val();
			that.showFields();
			// if(that.chartLayer != null){
			// 	that.chartLayer.setBaseLayer(value);
			// }
		});

		// 切换底图关联字段
		this.panel.find(".chart-base-layer-fields").change(function(){
			var value = $(this).val();
			// if(that.chartLayer != null){
			// 	that.chartLayer.setBaseLayerField(value);
			// }
		});		

		// 表格匹配字段
		this.panel.find(".chart-table-fields").change(function(){
			var value = $(this).val();
			// if(that.chartLayer != null){
			// 	that.chartLayer.setTableField(value);
			// }
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

	// 显示底图
	showLayerTab : function(){
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
		this.panel.find(".chart-base-layer").html(html);

		var value = this.panel.find(".chart-base-layer").val();
		this.showFields(value);
	},	

	// 展示底图字段
	showFields : function(layerName){
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
		this.panel.find(".chart-base-layer-fields").html(html);
	},

	// 初始化选择图表
	setDataSet : function(dbName,tableName){
		this.dbName = dbName;
		this.tableName = tableName;

		this.panel.find(".chart-table").val(this.tableName);
		this.showTableFields(this.dbName,this.tableName);
	
		// if(this.chartLayer != null){
		// 	this.chartLayer.setDbName(this.dbName);
		// 	this.chartLayer.setTableName(this.tableName);
		// }
		
	},

	// 选择的图表的字段
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

	// 设置数值类的字段
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
		this.panel.find("#symbol_chart_style_fields").html(html);		
	},

	// 添加chart
	addChart : function(){
		if(mapObj == null){
			MapCloud.notify.showInfo("当前地图为空","Warning");
			return;
		}
		var name = this.panel.find(".chart-table-name").val();
		if(name == ""){
			MapCloud.notify.showInfo("请输入专题图名称","Warning");
			this.panel.find(".chart-table-name").focus();
			return;
		}
		var baseLayerName = this.panel.find(".chart-base-layer").val();
		if(baseLayerName == null || baseLayerName == ""){
			MapCloud.notify.showInfo("请选择底图","Warning");
			return;
		}


		var baseLayerField = this.panel.find(".chart-base-layer-fields").val();
		if(baseLayerField == null || baseLayerField == ""){
			MapCloud.notify.showInfo("请选择空间字段","Warning");
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
		
		var chartField = this.panel.find("#symbol_chart_style_fields").val();
		if(chartField == null || chartField == ""){
			MapCloud.notify.showInfo("请设置专题图字段","Warning");
			return;
		}
		var chartFields = [chartField];

		var maxSize = this.panel.find(".chart-table-max-size").val();
		if(maxSize == null || maxSize == ""){
			MapCloud.notify.showInfo("请设置符号大小","Warning");
			return;
		}			
		var chartOption = this.getChartOption();
		var layer = new GeoBeans.Layer.SymbolChartLayer(name,baseLayerName,baseLayerField,
			dbName,tableName,tableField,chartFields,chartOption);
		mapObj.addLayer(layer,this.addChartLayer_callback);
		mapObj.draw();
	},

	addChartLayer_callback : function(result){
		if(result == "success"){
			mapObj.draw();
			var that = MapCloud.symbol_chart_panel;
			var name = that.panel.find(".chart-table-name").val();
			that.chartLayer = mapObj.getLayer(name);
		}else{
			MapCloud.notify.showInfo(result,"添加等级符号图");
		}
	},


	// 获取专题图参数
	getChartOption : function(){
		var colorDiv = this.panel.find(".form-group-color .colorSelector div");
		var opacity = colorDiv.css("opacity");
		var colorRgb = colorDiv.css("background-color");
		var color = new GeoBeans.Color();
		color.setByRgb(colorRgb,1);
		var colorHex = color.getHex();

		var borderDiv = this.panel.find(".form-group-border .colorSelector div");
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

	// 修改参数
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


		var baseLayerName = this.panel.find(".chart-base-layer").val();
		if(baseLayerName == null || baseLayerName == ""){
			MapCloud.notify.showInfo("请选择底图","Warning");
			return;
		}
		this.chartLayer.setBaseLayer(baseLayerName);

		var baseLayerField = this.panel.find(".chart-base-layer-fields").val();
		if(baseLayerField == null || baseLayerField == ""){
			MapCloud.notify.showInfo("请选择空间字段","Warning");
			return;
		}
		this.chartLayer.setBaseLayerField(baseLayerField);

		if(this.dbName != this.chartLayer.dbName){
			this.chartLayer.setDbName(this.dbName);
		}
		if(this.tableName != this.chartLayer.tableName){
			this.chartLayer.setTableName(this.tableName);
		}

		var chartField = this.panel.find("#symbol_chart_style_fields").val();
		if(chartField == null || chartField == ""){
			MapCloud.notify.showInfo("请设置专题图字段","Warning");
			return;
		}
		if(chartField != this.chartLayer.chartFields[0]){
			this.chartLayer.setChartFields([chartField]);
		}

		var chartOption = this.getChartOption();
		this.chartLayer.setChartOption(chartOption);

		mapObj.draw();
	},


	setChartLayer : function(layer){
		this.chartLayer = layer;
		if(this.chartLayer == null){
			return;
		}


		var name = this.chartLayer.name;
		this.panel.find(".chart-table-name").val(name);

		// 底图设置
		var baseLayerName = this.chartLayer.getBaseLayer();
		var baseLayerField = this.chartLayer.getBaseLayerField();
		var dbName = this.chartLayer.getDbName();
		var tableName = this.chartLayer.getTableName();
		var tableField = this.chartLayer.getTableField();

		this.dbName = dbName;
		this.tableName = tableName;
		this.panel.find(".chart-table").val(this.tableName);
		this.showTableFields(this.dbName,this.tableName);
		this.panel.find(".chart-table-fields option[value='" 
				+ tableField + "']").attr("selected",true);
		this.panel.find(".chart-base-layer option[value='"
				+ baseLayerName+ "']").attr("selected",true);
		this.panel.find(".chart-base-layer-fields option[value='"
				+ baseLayerField + "']").attr("selected",true);	
				

		var chartFields = this.chartLayer.getChartFields();
		var chartField = chartFields[0];
		if(chartField != null){
			this.panel.find("#symbol_chart_style_fields option[value='" +  chartField+ "']")
				.attr("selected",true);
		}	

		// 设置option
		var chartOption = this.chartLayer.getChartOption();
		var color = chartOption.color;
		var opacity = chartOption.opacity;
		var border = chartOption.border;
		var borderOpacity = chartOption.borderOpacity;
		var byLevelFlag = chartOption.byLevel;
		var maxsize = chartOption.maxsize;
		var level = chartOption.level;


		this.panel.find(".form-group-color input.slider").slider("setValue",opacity*100);
		this.panel.find(".form-group-border input.slider").slider("setValue",borderOpacity*100);
		this.panel.find("#symbol_chart_style_opacity").html(opacity);
		this.panel.find("#symbol_chart_style_border_opacity").html(borderOpacity);
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
		this.panel.find(".form-group-color .colorSelector").colpickSetColor(color);
		this.panel.find(".form-group-color .colorSelector div").css("background-color",color);
		this.panel.find(".form-group-color .colorSelector div").css("opacity",opacity);
		this.panel.find(".form-group-border .colorSelector").colpickSetColor(border);
		this.panel.find(".form-group-border .colorSelector div").css("background-color",border);
		this.panel.find(".form-group-border .colorSelector div").css("opacity",borderOpacity);
	},

});