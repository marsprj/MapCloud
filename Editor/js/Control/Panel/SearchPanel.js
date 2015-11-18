MapCloud.SearchPanel = MapCloud.Class(MapCloud.Panel,{


	// 图层
	layer 		: null,

	// 操作符列表
	operList 	: ["=","<>","Like",">",">=","<","<="],

	// 查询filter
	fitler 		: null,

	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		// this.panel = $("#" + id);
		this.registerPanelEvent();
	},

	setLayer : function(layer){
		if(layer == null){
			return;
		}
		this.layer = layer;
		var fields = this.layer.getFields();
		this.setFields(fields);
	},

	// 设置layer
	showPanel : function(layer){
		if(layer == null){
			return;
		}
		var fields = layer.getFields();
		if(!$.isArray(fields)){
			MapCloud.notify.showInfo(fields,"Warning");
			return;
		}
		

		MapCloud.Panel.prototype.showPanel.apply(this,arguments);
		this.setFields(fields);
		this.layer = layer;

	},


	cleanup : function(){
		this.layer = null;
		this.filter = null;
		this.panel.find(".search-fields-div").html("");
		this.panel.find(".search-unique-values").html("");
		this.panel.find("#get_unique_btn").removeClass("disabled");
		this.panel.find("#search-sql-content").val("");
	},

	registerPanelEvent : function(){
		var that = this;


		// 获取唯一值
		this.panel.find("#get_unique_btn").click(function(){
			var active = that.panel.find(".search-fields-div .list-group-item.active");
			var field = active.attr("value");
			if(field == null){
				return;
			}
			$(this).addClass("disabled");
			that.getUniqueValues(field);
		});

		// 操作符
		this.panel.find(".search-oper .oper-row .btn").each(function(index,element){
			$(this).click(function(e){
				var oper = null;
				switch(index){
					case 0 :{
						// =
						oper = "=";
						break;
					}
					case 1:{
						// <>
						oper = "<>";
						break;
					}
					case 2:{
						// Like
						oper = "Like";
						break;
					}
					case 3:{
						// >
						oper = ">";
						break;
					}
					case 4: {
						// >=
						oper = ">=";
						break;
					}
					case 5 :{
						// <
						oper = "<";
						break;
					}
					case 6:{
						// <=
						oper = "<=";
						break;
					}
					default:
						break;
				}
				var sql = that.panel.find("#search-sql-content").val();
				that.sqlAddOper(sql,oper);
			});
		});

		// 清空
		this.panel.find(".sql-clear-btn").click(function(){
			that.panel.find("#search-sql-content").val("");
		});

		// 应用，查询
		this.panel.find(".btn-search").click(function(){
			that.searchFeatures();
		});
	},

	setFields : function(fields){
		if(fields == null){
			return;
		}
		var field = null;
		var name = null;
		var html = "";
		for(var i = 0; i < fields.length;++i){
			field = fields[i];
			if(field == null){
				continue;
			}
			name = field.name;
			if(field.type != "geometry"){
				html += "<a href='#' class='list-group-item' value='"
						+ 	name + "'>\"" + name + "\"</a>";
			}
		}
		this.panel.find(".search-fields-div").html(html);
		this.registerFieldEvent();
	},

	// 字段点击事件
	registerFieldEvent : function(){
		var that = this;
		this.panel.find(".search-fields-div .list-group-item").click(function(){
			// 单击
			var activeItem = that.panel.find(".search-fields-div .list-group-item.active");
			if(activeItem.attr("value") == $(this).attr("value")){
				return;
			}

			$(this).parent().children().removeClass("active");
			$(this).addClass("active");
			that.panel.find(".search-unique-values").html("");
			that.panel.find("#get_unique_btn").removeClass("disabled");
		}).dblclick(function(){
			var value = $(this).attr("value");
			var sql = that.panel.find("#search-sql-content").val();
			that.sqlAddField(sql,value);
		
		});
	},

	// 获取唯一值
	getUniqueValues : function(field){
		if(field == null || this.layer == null){
			return;
		}
		var featureType = this.layer.featureType;
		if(featureType == null){
			return;
		}
		var workspace = featureType.workspace;
		if(workspace == null){
			return;
		}
		workspace.getValue(this.layer.name,field,mapObj.name,
			this.getUniqueValues_callback);
	},

	getUniqueValues_callback : function(values){
		if(values == null){
			return;
		}
		var that = MapCloud.search_panel;
		that.displayUniqueValues(values);
	},

	// 展示唯一值
	displayUniqueValues : function(values){
		if(values == null){
			return;
		}
		var value = null;
		var html = "";
		for(var i = 0; i < values.length; ++i){
			value = values[i];
			html += "<a href='#' class='list-group-item'>" + value + '</a>';
		}
		this.panel.find(".search-unique-values").html(html);
		this.registerUniqueValuesEvent();
	},

	// 唯一值事件
	registerUniqueValuesEvent : function(){
		var that = this;
		this.panel.find(".search-unique-values .list-group-item").click(function(){
			$(this).parent().children().removeClass("active");
			$(this).addClass("active");
		}).dblclick(function(){
			//双击sql
			var value = $(this).html();
			var sql = that.panel.find("#search-sql-content").val();
			that.sqlAddValue(sql,value);
			
		});
	},

	// 查询
	searchFeatures : function(){
		var sql = this.panel.find("#search-sql-content").val();
		var filter = this.getFilter(sql);
		this.filter = filter;
		// var count = this.layer.getFeatureFilterCount(filter);
		var count = mapObj.getFeatureFilterCount(this.layer.name,filter);
		MapCloud.dataGrid.setQuery(this.layer,count,this.query_function);
		MapCloud.dataGrid.setOutput(this.output_function);
	},

	// 分页查询函数
	query_function : function(maxFeatures,offset){
		// var features = this.layer.getFeatureFilter(this.filter,maxFeatures,offset);
		var that = MapCloud.search_panel;
		// var features = that.layer.getFeatureFilter(that.filter,null,null);
		var features = mapObj.getFeatureFilter(that.layer.name,that.filter,maxFeatures,offset);
		return features;
	},

	output_function : function(maxFeatures,offset){
		var that = MapCloud.search_panel;
		var obj = mapObj.queryByFilterOutput(that.layer.name,that.filter,maxFeatures,offset);
		return obj;
	},

	//添加字段
	sqlAddField : function(sql,field){
		if(sql == null || field == null){
			return;
		}
		var parts = sql.split(" ");
		for(var i = 0; i < parts.length; ++i){
			var part = parts[i];
			if(this.isField(part)){
				var re = new RegExp(part,'g');
				sql = sql.replace(re,field);
				this.panel.find("#search-sql-content").val(sql);
				return;
			}
		}
		var val = this.panel.find("#search-sql-content").val();
		this.panel.find("#search-sql-content").val(field + val);
	},

	// 是否是字段
	isField : function(field){
		if(field == null){
			return;
		}
		var fields = this.layer.getFields();
		if(fields == null){
			return;
		}
		var f = null;
		for(var i = 0; i < fields.length; ++i){
			f = fields[i];
			if(f.name == field){
				return true;
			}
		}
		return false;
	},

	// 添加操作符
	sqlAddOper : function(sql,oper){
		if(sql == null || oper == null){
			return;
		}
		var parts = sql.split(" ");
		var fieldFlag = false;
		var fiedl = null;
		for(var i = 0; i < parts.length; ++i){
			var part = parts[i];
			if(this.isOper(part)){
				var re = new RegExp(part,'g');
				sql = sql.replace(re,oper);
				this.panel.find("#search-sql-content").val(sql);
				return;
			}
			if(this.isField(part)){
				fieldFlag = true;
				field = part;
			}
		}
		if(fieldFlag && field != null){
			var addIndex = sql.indexOf(field) + field.length;

			var array = [sql.slice(0,sql.indexOf(field) + field.length),
						" " + oper ,
						sql.slice(sql.indexOf(field) + field.length,sql.length)
						];
			sql = array.join("");
			this.panel.find("#search-sql-content").val(sql);

		}
	},

	// 是否是操作符
	isOper : function(oper){
		if(oper == null){
			return;
		}
		if(this.operList.indexOf(oper) != -1){
			return true;
		}
		return false;
	},

	// 添加查询值
	sqlAddValue : function(sql,value){
		if(sql == null || value == null){
			return;
		}
		var parts = sql.split(" ");
		var valuePart = null;
		for(var i = 0; i < parts.length; ++i){
			var part = parts[i];
			if(part == ""){
				continue;
			}
			if(!this.isOper(part) && !this.isField(part)){
				// valuePart += part;
				if(valuePart == null){
					valuePart = part;
				}else{
					valuePart += " " + part;
				}
				if(i == parts.length -1){
					var re = new RegExp(valuePart,'g');
					sql = sql.replace(re, value);
					this.panel.find("#search-sql-content").val(sql);
					return;
				}
			}
		}
		var val = this.panel.find("#search-sql-content").val();
		this.panel.find("#search-sql-content").val(val + " " + value);
	},

	// 获得filter
	getFilter : function(sql){
		if(sql == null){
			return null;
		}
		var parts = sql.split(" ");
		// if(parts.length != 3){
		// 	return null;
		// }
		var oper = null;
		var field = null;
		var value = null;
		for(var i = 0; i < parts.length; ++i){
			var part = parts[i];
			if(this.isOper(part)){
				oper = part;
			}
			if(this.isField(part)){
				field = part;
			}
			if(!this.isOper(part) && !this.isField(part)){
				// value += part;
				if(value == null){
					value = part;
				}else{
					value += (" " + part);
				}
			}
		}
		if(oper == null || field == null || value == null){
			return null;
		}

		var filter = this.createFilter(oper,field,value);
		return filter;
	},

	createFilter : function(oper,field,value){
		if(oper == null || field == null || value == null){
			return null;
		}

		var operator = this.getComparisionOperator(oper);
		if(operator == null){
			return;
		}
		var prop = new GeoBeans.PropertyName();
		prop.setName(field);
		var literal = new GeoBeans.Literal();
		literal.setValue(value);
		if(operator == GeoBeans.ComparisionFilter.OperatorType.ComOprIsLike){
			var filter = new GeoBeans.IsLikeFilter();
			filter.properyName = prop;
			filter.literal = literal;
			filter.operator = operator;
			return filter;
		}
		
		var binaryComparisionFilter = new GeoBeans.BinaryComparisionFilter();

		binaryComparisionFilter.expression1 = prop;
		binaryComparisionFilter.expression2 = literal;
		binaryComparisionFilter.operator = operator;
		return binaryComparisionFilter;
	},

	getComparisionOperator : function(oper){
		if(oper == null){
			return null;
		}
		var operator = null;
		switch(oper){
			case "=":{
				operator = GeoBeans.ComparisionFilter.OperatorType.ComOprEqual;
				break;
			}
			case "<>":{
				operator = GeoBeans.ComparisionFilter.OperatorType.ComOprNotEqual;
				break;
			}
			case "Like":{
				operator = GeoBeans.ComparisionFilter.OperatorType.ComOprIsLike;
				break;
			}
			case ">":{
				operator = GeoBeans.ComparisionFilter.OperatorType.ComOprGreaterThan;
				break;
			}
			case ">=":{
				operator = GeoBeans.ComparisionFilter.OperatorType.ComOprGreaterThanOrEqual;
				break;
			} 
			case "<":{
				operator = GeoBeans.ComparisionFilter.OperatorType.ComOprLessThan;
				break;
			}
			case "<=":{
				operator = GeoBeans.ComparisionFilter.OperatorType.ComOprLessThanOrEqual;
				break;
			}
			default:
				break;
		}
		return operator;
	}



});