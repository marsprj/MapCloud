MapCloud.GPSCsvImportDialog = MapCloud.Class(MapCloud.Dialog,{
	
	// 要导入的数据库
	outputSourceName : null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this,arguments);

		this.registerPanelEvent();		
	},

	registerPanelEvent : function(){
		var dialog = this;

		this.panel.find("[data-toggle='tooltip']").tooltip({container:'body'});

		// 展开log
		dialog.panel.find(".gps-oper-btn-log").click(function(){
			if($(this).hasClass("log-col")){
				var height = dialog.panel.find(".modal-body").css("height");
				height = parseInt(height.slice(0,height.lastIndexOf("px")));
				var heightExp = height + 200;
				dialog.panel.find(".modal-body").css("height",heightExp + "px");

				dialog.panel.find(".gps-oper-log-wrapper").slideDown(500); 
				$(this).find("i").removeClass("fa-chevron-down").addClass("fa-chevron-up");
				$(this).removeClass("log-col").addClass("log-exp");
			}else{
				var height = dialog.panel.find(".modal-body").css("height");
				height = parseInt(height.slice(0,height.lastIndexOf("px")));
				var heightCol = height - 200;
				dialog.panel.find(".modal-body").css("height",heightCol + "px");
				
				dialog.panel.find(".gps-oper-log-wrapper").slideUp(500);
				$(this).find("i").removeClass("fa-chevron-up").addClass("fa-chevron-down");
				$(this).removeClass("log-exp").addClass("log-col");
			}
		});	

		// choose input source name & input type name
		dialog.panel.find(".btn-choose-input").click(function(){
			MapCloud.vector_db_dialog.showDialog("csvImport");
		});

		// 选择CSV数据
		dialog.panel.find(".btn-choose-csv").click(function(){
			MapCloud.file_dialog.showDialog("csvImport");
		});

		// 操作
		dialog.panel.find(".gps-btn-oper-btn").click(function(){
			if(dialog.csvPath == null || dialog.csvName == null){
				MapCloud.notify.showInfo("请选择要导入的CSV数据","Warning");
				return;
			}

			if(dialog.sourceName == null || dialog.typeName == null ){
				MapCloud.notify.showInfo("请选择要导入的数据库表格","Warning");
				return;
			}

			MapCloud.notify.loading();
			gpsManager.csvImport(dialog.sourceName,dialog.typeName,dialog.csvPath,
				dialog.csvName,null,dialog.csvImport_callback);
		});

	},

	cleanup : function(){
		this.panel.find(".gps-csv-path").val("");
		this.panel.find(".gps-input-source-name").val("");
		this.panel.find(".gps-input-type-name").val("");
		this.panel.find(".gps-oper-log-div").empty();

		this.csvName = null;
		this.csvPath = null;
		this.sourceName = null;
		this.typeName = null;
	},

	// 设置要导入的CSV数据
	setImportCsv : function(csvPath){
		if(csvPath == null){
			return;
		}

		this.panel.find(".gps-csv-path").val(csvPath);
		var name = csvPath.slice(csvPath.lastIndexOf("/")+1,csvPath.length);
		var csvPath = csvPath.slice(0,csvPath.lastIndexOf("/"));

		this.csvName = name;
		this.csvPath = csvPath;
	},

	// 输入参数
	setDataSet : function(sourceName,dataSet){
		if(sourceName == null || dataSet == null){
			return;
		}
		this.sourceName = sourceName;
		this.typeName = dataSet.name;
		this.panel.find(".gps-input-source-name").val(this.sourceName);
		this.panel.find(".gps-input-type-name").val(this.typeName);
	},


	csvImport_callback : function(result){
		MapCloud.notify.hideLoading();
		var html = "<div class='row'>导入到数据库：" + result + "</div>"; 
		var dialog = MapCloud.gps_csv_import_dialog;
		dialog.panel.find(".gps-oper-log-div").append(html);
	},
});