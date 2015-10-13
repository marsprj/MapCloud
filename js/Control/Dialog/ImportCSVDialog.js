MapCloud.ImportCSVDialog = MapCloud.Class(MapCloud.Dialog,{
	
	// 数据源
	dataSourceName : null,

	// 文件路径
	csvPath : null,

	// dataSet name
	typeName : null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);

		this.registerPanelEvent();
	},


	registerPanelEvent : function(){
		var dialog = this;

		this.panel.find('[data-toggle="tooltip"]').tooltip({container: 'body'});

		// 添加
		this.panel.find(".import-btn-add").click(function(){
			MapCloud.file_dialog.showDialog("csv");

		});

		// 清空
		this.panel.find(".import-btn-remove").click(function(){

		});

		// 导入
		this.panel.find(".import-btn-upload").click(function(){
			var fields = dialog.getFields();
			var path = dialog.csvPath;
			var name = dialog.panel.find(".csv-typename").val();
			if(name == null || name == ""){
				MapCloud.notify.showInfo("请输入导入后的文件名称","Warning");
				return;
			}
			dialog.typeName = name;
			var html = "<div class='row'>开始新建表格</div>"
			dialog.panel.find(".import-log-div").append(html);
			dbsManager.createDataSet(dialog.dataSourceName,name,fields,dialog.createDataSet_callback);
		});

		// log
		this.panel.find(".import-btn-log").click(function(){
			if($(this).hasClass("log-col")){
				dialog.panel.find(".modal-body").css("height","600px");
				dialog.panel.find(".import-log-wrapper").slideDown(500); 
				$(this).find("i").removeClass("fa-chevron-down").addClass("fa-chevron-up");
				$(this).removeClass("log-col").addClass("log-exp");
			}else{
				dialog.panel.find(".modal-body").css("height","470px");
				dialog.panel.find(".import-log-wrapper").slideUp(500);
				$(this).find("i").removeClass("fa-chevron-up").addClass("fa-chevron-down");
				$(this).removeClass("log-exp").addClass("log-col");
			}
		});

		// 关闭
		this.panel.on('hidden.bs.modal',function(){
			dialog.closeDialog();
		});

	},

	cleanup : function(){
		this.panel.find(".csv-fields-div").empty();
		this.panel.find(".csv-path").val("");
		this.panel.find(".csv-typename").val("");
		this.panel.find(".import-log-div").empty();

		this.dataSourceName = null;
		this.csvPath = null;
		this.typeName = null;
	},

	closeDialog : function(){
		this.panel.modal("hide");
		var parent = MapCloud.vector_db_dialog;
		parent.getDataSets(parent.dataSourceCur);
	},

	// 设置数据库名称
	setDataSourceName : function(dataSourceName){
		this.dataSourceName = dataSourceName;
	},

	// 设置上传的CSV
	setImportCsv : function(csvPath){
		if(csvPath == null){
			return;
		}
		this.csvPath = csvPath;
		this.panel.find(".csv-path").val(this.csvPath);

		var name = this.csvPath.slice(this.csvPath.lastIndexOf("/")+1,this.csvPath.length-4);
		this.panel.find(".csv-typename").val(name);

		fileManager.describeCsv(this.csvPath,this.describeCsv_callback);
	},

	describeCsv_callback : function(fields){
		if(!$.isArray(fields)){
			MapCloud.notify.showInfo(fields,"Warning");
			return;
		}

		var dialog = MapCloud.importCSV_dialog;
		dialog.setCSVFields(fields);
	},

	setCSVFields : function(fields){
		if(fields == null){
			return;
		}

		var html = "";
		var field = null;
		for(var i = 0; i < fields.length; ++i){
			field = fields[i];
			if(field == null){
				continue;
			}
			html += "<div class='row'>"
				+ 	"	<div class='col-md-5'>"
				+ 	"		<input class='form-control input-sm csv-field-name' type='text' value='" + field + "' disabled=''>"
				+ 	"	</div>"
				+	"	<div class='col-md-4'>"
				+	"		<select class='form-control input-sm csv-field-type'>"
				+ 	"			<option>int</option>"
				+ 	"			<option>string</option>"
				+ 	"			<option>double</option>"
				+	"		</select>"
				+	"	</div>"
				+	"	<div class='col-md-3'>"
				+	"		<input class='form-control input-sm csv-field-length' type='text' value='32' readonly=''>"
				+	"	</div>"
				+	"</div>";
		}

		this.panel.find(".csv-fields-div").html(html);

		// 选择类型
		this.panel.find(".csv-field-type").change(function(){
			var type = $(this).val();
			if(type == "string"){
				$(this).parents(".row").first().find(".csv-field-length").removeAttr("readonly");
			}else{
				$(this).parents(".row").first().find(".csv-field-length").prop("readonly","true");
			}
		});
	},

	getFields : function(){
		var fields = [];
		this.panel.find(".csv-fields-div .row").each(function(){
			var name = $(this).find(".csv-field-name").val();
			var type = $(this).find(".csv-field-type").val();
			var length = null;
			if(type == "string"){
				length = $(this).find(".csv-field-length").val();
			}

			var field = new GeoBeans.GField(name,type,length);
			fields.push(field);
		});
		return fields;
	},

	createDataSet_callback : function(result){
		var html = "<div class='row'>创建表格结束：" + result + "</div>";
		var dialog = MapCloud.importCSV_dialog;
		dialog.panel.find(".import-log-div").append(html);

		if(result == "success"){
			dialog.importCsv();
		}

	},

	// 导入CSV
	importCsv : function(){
		var sourceName = this.dataSourceName;
		var typeName = this.typeName;

		var path = this.csvPath;
		var name = this.csvPath.slice(this.csvPath.lastIndexOf("/")+1,this.csvPath.length);
		var csvPath = this.csvPath.slice(0,this.csvPath.lastIndexOf("/"));


		var html = "<div class='row'>开始导入到数据中</div>"; 
		this.panel.find(".import-log-div").append(html);
		gpsManager.csvImport(sourceName,typeName,csvPath,name,null,this.importCsv_callback);

	},

	importCsv_callback : function(result){
		var html = "<div class='row'>导入到数据库结束：" + result + "</div>"; 
		var dialog = MapCloud.importCSV_dialog;
		dialog.panel.find(".import-log-div").append(html);
	}
});