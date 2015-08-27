MapCloud.QueryDialog = MapCloud.Class(MapCloud.Dialog,{
	// 图层
	layer : null,


	// 字段
	field : null,


	// 操作符
	oper : null,

	//传入的fitler
	filter : null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		this.registerPanelEvent();
	},

	registerPanelEvent : function(){
		var dialog = this;
		//获取唯一值
		this.panel.find(".btn-get-unique").click(function(){
			dialog.getUniqueValues(dialog.layer,dialog.field);
		});

		// 操作符
		this.panel.find(".search-oper .oper-row .btn").click(function(){
			var html = $(this).html();
			var oper = null;
			switch(html){
				case "=":{
					oper = "=";
					break;
				}
				case "Between":{
					oper = "between";
					break;
				}
				case "&gt;":{
					oper = ">";
					break;
				}
				case "&lt;":{
					oper = "<"
					break;
				}
				case "&gt;=":{
					oper = ">=";
					break;
				}
				case "&lt;=":{
					oper = "<=";
					break;
				}
				default:
					break;
			}
			// var operator = dialog.getComparisionOperator(oper);
			dialog.oper = oper;
			dialog.setExpression(dialog.oper);
			dialog.panel.find(".search-oper .oper-row .btn").removeClass("active");
			$(this).addClass("active");
		});

		// 确定
		this.panel.find(".btn-confirm").click(function(){
			var operator = dialog.getComparisionOperator(dialog.oper);
			if(operator == null){
				MapCloud.notify.showInfo("请选择一种查询条件","Warning");
				return;
			}
			var result = null; 
			if(operator == GeoBeans.ComparisionFilter.OperatorType.ComOprIsBetween){
				result = dialog.verifyIsBetweenQuery();
			}else{
				result = dialog.verifyQuery();
			}
			if(result != "success"){
				return;
			}
			var filter = dialog.getFilter(operator);
			if(filter == null){
				MapCloud.notify.showInfo("请检查表达式","Warning");
				return;
			}
			dialog.closeDialog();
			if(dialog.filter == null){
				filter.name = null;
			}else{
				filter.name = dialog.filter.name;
			}
			MapCloud.styleManager_dialog.setCustomFilter(filter);
		});
	},

	cleanup : function(){
		this.layer = null;
		this.field = null;
		this.panel.find(".query-field span").html("");
		this.panel.find(".query-field-input").val("");
		this.oper = "=";
		this.panel.find(".search-oper .oper-row .btn").removeClass("active");
		this.panel.find(".search-oper .oper-row .btn").first().addClass("active");
		this.panel.find(".search-unique-values").empty();
		var html = '<div class="col-md-5">'
				+ '		<input type="text" disabled="" class="form-control">'
				+ '	</div>'
				+ '	<label class="col-md-2 control-label">=</label>'
				+ '	<div class="col-md-5">'
				+ '		<input type="text" class="form-control">'
				+ '	</div>';
		this.panel.find(".query-exp").html(html);
		this.filter = null;
	},

	setLayer : function(layer,field){
		this.layer = layer;
		this.field = field;
		if(this.layer == null || this.field == null){
			return;
		}

		this.panel.find(".query-field span").html(this.field);
		this.panel.find(".query-field-input").val(this.field);
		this.setExpression("=");
	},

	getUniqueValues : function(layer,field){
		if(field == null || layer == null){
			return;
		}
		var featureType = layer.getFeatureType();
		if(featureType == null){
			return;
		}
		var workspace = featureType.workspace;
		if(workspace == null){
			return;
		}
		workspace.getValue(layer.name,field,mapObj.name,
			this.getUniqueValues_callback);
	},
	getUniqueValues_callback : function(values){
		if(values == null){
			return;
		}
		var dialog = MapCloud.query_dialog;
		dialog.displayUniqueValues(values);
	},

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
		var dialog = this;
		this.panel.find(".search-unique-values .list-group-item").click(function(){
			$(this).parent().children().removeClass("active");
			$(this).addClass("active");
		}).dblclick(function(){
			//双击sql
			var value = $(this).html();
			var input = dialog.panel.find(".query-exp input:enabled");
			if(input.length == 1){
				input.val(value);
			}else{
				for(var i = 0; i < input.length; ++i){
					if($(input[i]).val() == ""){
						$(input[i]).val(value);
						break;
					}
				}
			}
		});
	},

	// 获取操作符
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
			case "between":{
				operator = GeoBeans.ComparisionFilter.OperatorType.ComOprIsBetween;
				break;
			}
			default:
				break;
		}
		return operator;
	},

	// 设置表达式
	setExpression : function(oper){
		if(oper == null){
			return;
		}
		var html = "";
		if(oper == "between"){
			html = '<div class="col-md-3">'
				+  '		<input type="text" class="form-control" value="">'
				+  '	</div>'
				+  '		<label class="col-md-1 control-label">&lt;</label>'
				+  '	<div class="col-md-4">'
				+  '		<input type="text" disabled="" class="form-control" value="' + this.field +  '">'
				+  '	</div>'
				+  '	<label class="col-md-1 control-label">&lt;</label>'
				+  '	<div class="col-md-3">'
				+  '		<input type="text" class="form-control" value="">'
				+  '	</div>';
		}else{
			html = '<div class="col-md-5">'
				+  '	<input type="text" disabled="" class="form-control" value="' + this.field +  '">'
				+  '	</div>'
				+  '	<label class="col-md-2 control-label">' + oper + '</label>'
				+  '	<div class="col-md-5">'
				+  '		<input type="text" class="form-control" value="">'
				+  '	</div>';
		}

		this.panel.find(".query-exp").html(html);
		this.panel.find(".query-exp input:enabled").first().focus();
	},

	// between 
	verifyIsBetweenQuery : function(){
		var inputs = this.panel.find(".query-exp input:enabled");
		for(var i = 0; i < inputs.length; ++i){
			var input = $(inputs[i]);
			if(input.val() == ""){
				MapCloud.notify.showInfo("请输入查询条件","Warning");
				input.focus();
				return "failed";
			}
		}
		return "success";
	},

	// 其它查询条件
	verifyQuery : function(){
		var input = this.panel.find(".query-exp input:enabled");
		if(input.val() == ""){
			MapCloud.notify.showInfo("请输入查询条件","Warning");
			input.focus();
			return "failed";
		}
		return "success";
	},

	// 获得filter
	getFilter : function(operator){
		if(operator == null){
			return null;
		}
		var filter = null;
		if(operator == GeoBeans.ComparisionFilter.OperatorType.ComOprIsBetween){
			var min = this.panel.find(".query-exp input:enabled").first().val();
			var max = $(this.panel.find(".query-exp input:enabled")[1]).val();
			filter = this.getBetweenFilter(operator,this.field,min,max);
		}else{
			var value = this.panel.find(".query-exp input:enabled").val();
			filter = this.getBinaryComparisionFilter(operator,this.field,value);
		}
		return filter;
	},

	// between filter 
	getBetweenFilter : function(operator,field,min,max){
		if(operator != GeoBeans.ComparisionFilter.OperatorType.ComOprIsBetween
			|| field == null || min == null || max == null){
			return null;
		}
		var filter = new GeoBeans.IsBetweenFilter();
		var expression = new GeoBeans.PropertyName();
		expression.setName(field);
		var lowerBound = new GeoBeans.Literal();
		lowerBound.setValue(min);
		var upperBound = new GeoBeans.Literal();
		upperBound.setValue(max);

		filter.expression = expression;
		filter.lowerBound = lowerBound;
		filter.upperBound = upperBound;
		return filter;
	},


	// BinaryComparisionFilter
	getBinaryComparisionFilter : function(operator,field,value){
		if(operator == null || field == null || value == null){
			return null;
		}

		var filter = new GeoBeans.BinaryComparisionFilter();
		var prop = new GeoBeans.PropertyName();
		prop.setName(field);
		var literal = new GeoBeans.Literal();
		literal.setValue(value);

		filter.expression1 = prop;
		filter.expression2 = literal;
		filter.operator = operator;

		return filter;
	}

});