MapCloud.CreateDataSetDialog = MapCloud.Class(MapCloud.Dialog,{


	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);

		this.registerPanelEvent();

	},	

	registerPanelEvent : function(){
		var dialog = this;

		// 创建字段
		this.panel.find(".btn-create-field").click(function(){
			dialog.createField();
		});

		// 清空字段
		this.panel.find(".btn-remove-fields").click(function(){
			dialog.removeFields();
		});


		// 创建表格
		this.panel.find(".btn-create-dataset").click(function(){
			dialog.createDataset();
		});

		// 关闭
		this.panel.on('hidden.bs.modal',function(){
			dialog.closeDialog();
		});
	},

	cleanup : function(){
		this.panel.find(".db-name").val("");
		this.panel.find(".dataset-name").val("");
		var html = '<div class="text-center">'
				+	'	<h2 class="text-muted fields-empty">空白字段</h2>'
				+	'</div>';
		this.panel.find(".fields-form").html(html);

		this.dataSourceName = null;
	},

	closeDialog : function(){
		this.panel.modal("hide");
		var parent = MapCloud.vector_db_dialog;
		parent.getDataSets(parent.dataSourceCur);
	},

	// 设置数据库名称
	setDataSourceName : function(dataSourceName){
		this.dataSourceName = dataSourceName;
		this.panel.find(".db-name").val(this.dataSourceName);	
	},


	// 创建字段
	createField : function(){
		var count = this.panel.find(".fields-form .form-group").length;
		var html = "";
		if(count == 0){
			this.panel.find(".fields-form").empty();
			html += '<div class="form-group form-group-header">'
				+	'	<div class="col-md-4">名称</div>'
				+	'	<div class="col-md-4">类型</div>'
				+	'	<div class="col-md-4">长度</div>'
				+	'</div>';
		}
		html += '<div class="form-group form-group-sm">'
			+	'	<div class="col-md-4">'
			+	'		<input class="form-control field-name" type="text">'
			+	'	</div>'
			+	'	<div class="col-md-4">'
			+	'		<select class="form-control field-type">'
			+	'			<option>int</option>'
			+	'			<option>string</option>'
			+	'			<option>double</option>'
			+	'		</select>'
			+	'	</div>'
			+	'	<div class="col-md-2">'
			+	'		<input class="form-control field-length" value="32" type="text" readonly="">'
			+	'	</div>'			
			+	'	<div class="col-md-2">'
			+	'		<button class="btn-link btn-remove-field">删除</button>'
			+	'	</div>'
			+	'</div>';

		this.panel.find(".fields-form").append(html);

		var dialog = this;
		this.panel.find(".fields-form .form-group").last().find(".btn-remove-field").click(function(){
			$(this).parents(".form-group").first().remove();
			if(dialog.panel.find(".fields-form .form-group-sm").length == 0){
				var html = '<div class="text-center">'
						+	'	<h2 class="text-muted fields-empty">空白字段</h2>'
						+	'</div>';
				dialog.panel.find(".fields-form").html(html);				
			}
		});

		this.panel.find(".fields-form .form-group").last().find("select").change(function(){
			var type = $(this).val();
			if(type == "string"){
				$(this).parents(".form-group").first().find(".field-length").removeAttr("readonly");
			}else{
				$(this).parents(".form-group").first().find(".field-length").prop("readonly","true");
			}
		});

	},

	// 清空字段
	removeFields : function(){
		if(!confirm("确认删除所有的字段吗？")){
			return;
		}
		var html = '<div class="text-center">'
				+	'	<h2 class="text-muted fields-empty">空白字段</h2>'
				+	'</div>';
		this.panel.find(".fields-form").html(html);		
	},


	createDataset : function(){
		var dbName = this.dataSourceName;
		if(dbName == null){
			return;
		}

		var dataSetName = this.panel.find(".dataset-name").val();
		if(dataSetName == null || dataSetName == ""){
			MapCloud.notify.showInfo("请输入表格的名称","Warning");
			this.panel.find(".dataset-name").focus();
			return;
		}

		var nameReg = /^[a-zA-Z][a-zA-Z0-9_]*$/;
		if(!nameReg.test(dataSetName)){
			MapCloud.notify.showInfo("请输入有效的表格名称","Warning");
			this.panel.find(".dataSetName").focus();
			return;
		}

		var flag = true;
		var fieldNames = this.panel.find(".fields-form .form-group-sm .field-name");
		fieldNames.each(function(){
			if($(this).val() == ""){
				flag = false;
			}
		});
		if(!flag){
			MapCloud.notify.showInfo("请输入字段名称","Warning");
			return;
		}

		var lengthFlag = true;
		var lengths = this.panel.find(".fields-form .form-group-sm .field-length:not([readonly])");
		lengths.each(function(){
			if($(this).val() == ""){
				lengthFlag = false;
			}
		});
		if(!lengthFlag){
			MapCloud.notify.showInfo("请输入字段的长度","Warning");
			return;
		}

		var fields = this.getFields();
		if(fields == null){
			return;
		}
		if(fields.length == 0){
			MapCloud.notify.showInfo("请添加表格的字段","Warning");
			return;
		}
		MapCloud.notify.loading();
		dbsManager.createDataSet(dbName,dataSetName,fields,this.createDataset_callback)

	},

	// 获取字段信息
	getFields : function(){
		var fields = [];
		this.panel.find(".fields-form .form-group-sm").each(function(){
			var name = $(this).find(".field-name").val();
			if(name == null || name == ""){
				return;
			}
			var length = null;
			var type = $(this).find(".field-type").val();
			if(type == "string"){
				length = $(this).find(".field-length").val();
			}
			
			var field = new GeoBeans.GField(name,type,length);
			fields.push(field);				
		});
		return fields;
	},


	createDataset_callback : function(result){
		MapCloud.notify.showInfo(result,"创建表格");
		var dialog = MapCloud.create_dataset_dialog;
	}


});