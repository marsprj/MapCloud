MapCloud.BarChartPanel = MapCloud.Class(MapCloud.Panel,{
	// 图
	chartLayer 	: null,

	// 数据库
	dbName 		: null,

	// 表格名称
	tableName 	: null,
	


	// 图表字段
	chartFields : null,

	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		this.registerEvent();
	},

	showPanel : function(){
		if(this.panel.css("display") == "none"){
			this.cleanup();
			this.panel.css("display","block");
			this.panel.find(".panel-collapse:not(:eq(0))").each(function(){
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
		this.chartFields = [];
		this.dbName = null;
		this.tableName = null;
		this.panel.find(".form-group-field").remove();
		this.panel.find(".chart-table").val("");
		this.panel.find(".chart-table-fields").empty();
		this.panel.find(".chart-base-layer").empty();
		this.panel.find(".chart-base-layer-fields").empty();
		this.panel.find(".chart-table-name").val("柱状图");
		this.panel.find(".chart-table-radius").val("100");
		this.panel.find(".chart-table-offset-x").val("0");
		this.panel.find(".chart-table-offset-y").val("0");
		this.panel.find(".chart-table-show-label").prop("checked",false);
		this.panel.find(".chart-fields").empty();
		this.panel.find("input.slider").slider("setValue",100);
		this.panel.find(".chart-opacity").html("1");
	},

	registerEvent : function(){
		var that = this;

		this.panel.find('[data-toggle="tooltip"]').tooltip();

		// 选择图表
		this.panel.find(".btn-chose-chart").click(function(){
			MapCloud.vector_db_dialog.showDialog("bar");
		});

		// 切换底图
		this.panel.find(".chart-base-layer").change(function(){
			var value = $(this).val();
			that.showFields();
			if(that.chartLayer != null){
				that.chartLayer.setBaseLayer(value);
			}
		});

		// 切换底图关联字段
		this.panel.find(".chart-base-layer-fields").change(function(){
			var value = $(this).val();
			if(that.chartLayer != null){
				that.chartLayer.setBaseLayerField(value);
			}
		});

		// 表格匹配字段
		this.panel.find(".chart-table-fields").change(function(){
			var value = $(this).val();
			if(that.chartLayer != null){
				that.chartLayer.setTableField(value);
			}
		});


		// 增加
		this.panel.find(".btn-add-chart").click(function(){
			if(that.chartLayer == null){
				that.addChart();
			}else{
				// 修改
				that.changeChartOption();
			}
			MapCloud.refresh_panel.refreshPanel();
		});

		//关闭
		this.panel.find(".btn-cancel").click(function(){
			that.hidePanel();
		});

		// 透明度
		this.panel.find(".slider").each(function(){
			$(this).slider({
				tooltip : 'hide'
			});
			$(this).on("slide",function(slideEvt){
				var opacity = slideEvt.value;
				that.panel.find(".chart-opacity").html(opacity/100);
				that.changeOpacity(opacity/100);
				that.changeDisplayOpacity();
				// that.displayChartFields();
			});
		});

		// 双击变悬浮框
		this.panel.find(".panel-header").dblclick(function(){
			that.panel.css("display","none");
			MapCloud.tools.showToolBox("barChart");
		});
	},

	setDataSet : function(dbName,tableName){
		this.dbName = dbName;
		this.tableName = tableName;

		this.panel.find(".chart-table").val(this.tableName);
		this.showTableFields(this.dbName,this.tableName);
	
		if(this.chartLayer != null){
			this.chartLayer.setDbName(this.dbName);
			this.chartLayer.setTableName(this.tableName);
		}
		
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

	// 显示在图上显示的字段
	showChartFields : function(fields){
		var field = null;
		var name = null;
		var html = "<list-group>";
		for(var i = 0; i < fields.length; ++i){
			field = fields[i];
			if(field == null){
				continue;
			}
			name = field.name;
			html += "<a href='#' class='list-group-item'>" + name 
				+ "<input type='checkbox' value='" + name + "'></a>";
		}
		this.panel.find(".chart-fields").html(html);

		var that = this;
		var checkboxs = this.panel.find(".chart-fields .list-group-item input[type='checkbox']");
		checkboxs.change(function(){
			var value = $(this).val();
			var checked = $(this).prop("checked");
			if(checked){
				that.addChartField(value);
			}else{
				that.removeChartField(value);
			}
			that.displayChartFields();
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

	// 增加一个图表显示字段
	addChartField : function(field){
		if(field == null){
			return;
		}
		// this.chartFields.push(field);
		var color = new GeoBeans.Color();
		var opacity = this.panel.find(".chart-opacity").html();
		color.setOpacity(parseFloat(opacity));
		// var hex = color.getHex();
		var obj = {
			name : field,
			color : color
		}
		this.chartFields.push(obj);		
	},

	// 删除一个图表显示字段
	removeChartField : function(field){
		if(field == null){
			return;
		}
		var chartField = null;
		var fieldName = null;
		for(var i = 0; i < this.chartFields.length; ++i){
			chartField = this.chartFields[i];
			if(chartField == null){
				continue;
			}
			fieldName = chartField.name;
			if(fieldName == field){
				this.chartFields.splice(i,1);
			}
		}
	},

	getChartField : function(name){
		if(name == null){
			return null;
		}
		var chartField = null;
		for(var i = 0; i < this.chartFields.length; ++i){
			chartField = this.chartFields[i];
			if(chartField == null){
				continue;
			}
			if(chartField.name == name){
				return chartField;
			}
		}
		return null;
	},

	// 改变颜色
	changeChartFieldColor : function(el,color){
		if(el == null){
			return;
		}
		var formGroup = $(el).parents(".form-group-field");
		var name = formGroup.attr("fname");
		var chartField = null;
		for(var i = 0; i < this.chartFields.length; ++i){
			chartField = this.chartFields[i];
			if(chartField == null){
				continue;
			}
			if(chartField.name == name){
				chartField.color = color;
			}

		}

	},

	// 改变透明度
	changeOpacity : function(opacity){
		if(opacity == null){
			return;
		}
		var chartField = null;
		for(var i = 0; i < this.chartFields.length;++i){
			chartField = this.chartFields[i];
			if(chartField == null){
				continue;
			}
			// chartField.opacity = opacity;
			var color = chartField.color;
			if(color == null){
				continue;
			}
			color.setOpacity(opacity);
		}
	},

	changeDisplayOpacity : function(){
		var that = this;
		this.panel.find(".colorSelector").each(function(){
			var formGroup = $(this).parents(".form-group-field");
			var name = formGroup.attr("fname");
			var chartField = that.getChartField(name);
			if(chartField != null){
				var color = chartField.color;
				$(this).find("div").css("background-color",color.getRgba());
			}
			

		});
	},

	// 展示字段的值、颜色信息等
	displayChartFields : function(){
		var field = null;
		var name = null;
		var html = "";
		for(var i = 0; i < this.chartFields.length; ++i){
			field = this.chartFields[i];
			if(field == null){
				continue;
			}
			name = field.name;
			html += "<div class='form-group form-group-sm form-group-field' fname='" 
			+ 		name + "'>"
			+	"	<div class='col-md-1 col-md-offset-3'>"
			+	"		<div class='btn btn-default colorSelector'>"
			+	"			<div></div>"
			+	"		</div>"
			+	"	</div>"
			+	"	<div class='col-md-6'>"
			+	"		<span>"
			+			name
			+	"		</span>"
			+	"	</div>"
			+	"</div>";
		}
		this.panel.find(".form-group-field").remove();
		this.panel.find("#bar_chart_table_style_coll .panel-body .form-horizontal").append(html);
		
		var that = this;
		this.panel.find(".colorSelector").each(function(){
			$(this).colpick({
				color:'EEEEEE',
				onChange:function(hsb,hex,rgb,el,bySetColor) {
					var opacity = that.panel.find(".chart-opacity").html();
					var color = new GeoBeans.Color();
					color.setByHex('#' + hex,parseFloat(opacity));
					$(el).children().css("background-color",color.getRgba());
					that.changeChartFieldColor(el,color);
				},
				onSubmit:function(hsb,hex,rgb,el,bySetColor){
					var opacity = that.panel.find(".chart-opacity").html();
					var color = new GeoBeans.Color();
					color.setByHex('#' + hex,parseFloat(opacity));
					$(el).children().css("background-color",color.getRgba());
					that.changeChartFieldColor(el,color);
					$(el).colpickHide();
				}
			});
			var formGroup = $(this).parents(".form-group-field");
			var name = formGroup.attr("fname");
			var field = null;
			var color = null;
			for(var i = 0; i < that.chartFields.length;++i){
				field = that.chartFields[i];
				if(field == null){
					continue;
				}
				if(field.name == name){
					color = field.color;
				}
			}
			if(color != null){
				var backgroundColor = color.getHex();
				$(this).colpickSetColor(backgroundColor);
				var rgba = color.getRgba();
				$(this).find("div").css("background-color",rgba);
			}
		});
	},

	// 获取图的参数
	getChartOption : function(){
		var height = this.panel.find(".chart-table-height").val();
		var width = this.panel.find(".chart-table-width").val();
		var offsetX = this.panel.find(".chart-table-offset-x").val();
		var offsetY = this.panel.find(".chart-table-offset-y").val();
		var top = this.panel.find(".chart-table-top").val();
		var bottom = this.panel.find(".chart-table-bottom").val();
		var left = this.panel.find(".chart-table-left").val();
		var right = this.panel.find(".chart-table-right").val();
		var x_axisLine = this.panel.find(".chart-table-x-axisLine").prop("checked")
		var x_splitLine = this.panel.find(".chart-table-x-splitLine").prop("checked");

		var y_axisLine = this.panel.find(".chart-table-y-axisLine").prop("checked")
		var y_splitLine = this.panel.find(".chart-table-y-splitLine").prop("checked");
	
		var colors = [];
		var color = null;
		var chartField = null;
		for(var i = 0; i < this.chartFields.length; ++i){
			chartField = this.chartFields[i];
			if(chartField == null){
				continue;
			}
			color = chartField.color;
			if(color == null){
				continue;
			}
			colors.push(color.getHex());
		}
		var opacity = this.panel.find(".chart-opacity").html();
		var showLabel = this.panel.find(".chart-table-show-label").prop("checked");
		var option = {
			height 		: parseFloat(height),
			width 		: parseFloat(width),
			colors 		: colors,
			offsetX 	: parseFloat(offsetX),
			offsetY 	: parseFloat(offsetY),
			left 		: parseFloat(left),
			right 		: parseFloat(right),
			top 		: parseFloat(top),
			bottom 		: parseFloat(bottom),
			showLabel 	: showLabel,
			opacity 	: parseFloat(opacity),
			x_axisLine  : x_axisLine,
			x_splitLine : x_splitLine,
			y_axisLine  : y_axisLine,
			y_splitLine : y_splitLine
		};

		return option;
	},

	// 获取显示的字段
	getChartFields : function(){
		var fields = [];
		var field = null;
		for(var i = 0; i < this.chartFields.length; ++i){
			field = this.chartFields[i];
			if(field == null){
				continue;
			}
			fields.push(field.name);
		}
		return fields;
	},

	// 添加图层
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

		var chartFields = this.getChartFields();
		if(chartFields == null || chartFields.length == 0){
			MapCloud.notify.showInfo("请选择专题图字段","Warning");
			return;
		}
		
		var chartOption = this.getChartOption();
		var chartLayer = new GeoBeans.Layer.BarChartLayer(name,baseLayerName,
				baseLayerField,dbName,tableName,tableField,chartFields,chartOption);
		mapObj.addLayer(chartLayer,this.addChartLayer_callback);
	},

	addChartLayer_callback : function(result){
		if(result == "success"){
			mapObj.draw();
			var that = MapCloud.bar_chart_panel;
			var name = that.panel.find(".chart-table-name").val();
			that.chartLayer = mapObj.getLayer(name);
		}else{
			MapCloud.notify.showInfo(result,"添加柱状图");
		}
	},

	// 修改了chart
	changeChartOption : function(){
		if(this.chartLayer == null){
			return;
		}
		var name = this.panel.find(".chart-table-name").val();
		if(name == null || name == ""){
			MapCloud.notify.showInfo("请输入专题图名称","Warning");
			this.panel.find(".chart-table-name").focus();
			return;
		}
		var chartOption = this.getChartOption();
		var chartFields = this.getChartFields();
		this.chartLayer.setChartFields(chartFields);
		this.chartLayer.setChartOption(chartOption);
		this.chartLayer.setName(name);
		mapObj.draw();
	},

	// 初始化
	setChartLayer : function(chartLayer){
		this.chartLayer = chartLayer;
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

		// chartFields
		var chartFields = this.chartLayer.getChartFields();
		var chartField = null;
		
		for(var i = 0; i < chartFields.length; ++i){
			chartField = chartFields[i];
			this.panel.find(".list-group-item input[value='" 
				+ chartField + "']").attr("checked",true);
		}
		// option
		var chartOption =this.chartLayer.getChartOption();
		if(chartOption != null){
			var height 		= chartOption.height;
			var width 		= chartOption.width;
			var colors 		= chartOption.colors;
			var offsetX 	= chartOption.offsetX;
			var offsetY 	= chartOption.offsetY;
			var left 		= chartOption.left;
			var right 		= chartOption.right;
			var top 		= chartOption.top;
			var bottom 		= chartOption.bottom;
			var showLabel 	= chartOption.showLabel;
			var opacity 	= chartOption.opacity;
			var x_axisLine 	= chartOption.x_axisLine;
			var x_axisLabel = chartOption.x_axisLabel;
			var x_axisTick 	= chartOption.x_axisTick;
			var x_splitLine = chartOption.x_splitLine;
			var y_axisLine 	= chartOption.y_axisLine;
			var y_axisLabel = chartOption.y_axisLabel;
			var y_axisTick 	= chartOption.y_axisTick;
			var y_splitLine = chartOption.y_splitLine;

			this.panel.find(".chart-table-height").val(height);
			this.panel.find(".chart-table-width").val(width);
			this.panel.find(".chart-table-offset-x").val(offsetX);
			this.panel.find(".chart-table-offset-y").val(offsetY);
			this.panel.find(".chart-table-top").val(top);
			this.panel.find(".chart-table-bottom").val(bottom);
			this.panel.find(".chart-table-left").val(left);
			this.panel.find(".chart-table-right").val(right);
			this.panel.find(".chart-table-x-axisLine").prop("checked",x_axisLine);
			this.panel.find(".chart-table-x-axisLabel").prop("checked",x_axisLabel);
			this.panel.find(".chart-table-x-axisTick").prop("checked",x_axisTick);
			this.panel.find(".chart-table-x-splitLine").prop("checked",x_splitLine);
			this.panel.find(".chart-table-y-axisLine").prop("checked",y_axisLine);
			this.panel.find(".chart-table-y-axisLabel").prop("checked",y_axisLabel);
			this.panel.find(".chart-table-y-axisTick").prop("checked",y_axisTick);
			this.panel.find(".chart-table-y-splitLine").prop("checked",y_splitLine);
			this.panel.find(".chart-table-show-label").prop("checked",showLabel);
			this.panel.find(".chart-opacity").html(opacity);
			this.panel.find("input.slider").slider("setValue",opacity*100);
		
			var obj = null;
			var colorValue = null;
			var chartField = null;
			var color = null;
			this.chartFields = [];
			for(var i = 0; i < chartFields.length; ++i){
				chartField = chartFields[i];
				colorValue = colors[i];
				color = new GeoBeans.Color();
				color.setByHex(colorValue,opacity);
				obj = {
					name : chartField,
					color : color
				}
				this.chartFields.push(obj);
			}
			this.displayChartFields();
		}

	}



});