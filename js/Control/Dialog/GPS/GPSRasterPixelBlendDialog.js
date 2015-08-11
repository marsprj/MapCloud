MapCloud.GPSRasterPixelBlendDialog = MapCloud.Class(MapCloud.Dialog,{
	
	// 输入数据库1
	inputSourceName_1 : null,

	// 输入影像1
	inputRasterName_1 : null,

	// 输入影像1路径
	inputRasterPath_1 : null,

	// 输入数据库2
	inputSourceName_2 : null,

	// 输入影像2
	inputRasterName_2 : null,	

	// 输入影像2 路径
	inputRasterPath_2 : null,

	// 输出数据库
	outputSourceName : null,

	// 输出影像路径
	outputRasterPath : null,	

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this,arguments);
		var dialog = this;

		this.registerPanelEvent();
	},

	registerPanelEvent : function(){
		var dialog = this;

		this.panel.find('[data-toggle="tooltip"]').tooltip({container: 'body'});

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

		// 影像1
		dialog.panel.find(".btn-choose-input-raster-1").click(function(){
			MapCloud.raster_db_dialog.showDialog("rasterPixelBlend-1",false);
		});

		// 影像2
		dialog.panel.find(".btn-choose-input-raster-2").click(function(){
			MapCloud.raster_db_dialog.showDialog("rasterPixelBlend-2",false);
		});	

		//输出
		dialog.panel.find(".btn-choose-output-source-name").click(function(){
			MapCloud.raster_db_dialog.showDialog("rasterPixelBlend",true);
		});

		// 操作
		this.panel.find(".gps-btn-oper-btn").click(function(){
			if(dialog.inputSourceName_1 == null || dialog.inputRasterName_1 == null 
				|| dialog.inputRasterPath_1 == null){
				MapCloud.notify.showInfo("请选择输入影像-1","Warning");
				return;
			}
			if(dialog.inputSourceName_2 == null || dialog.inputRasterName_2 == null 
				|| dialog.inputRasterPath_2 == null){
				MapCloud.notify.showInfo("请选择输入影像-2","Warning");
				return;
			}

			if(dialog.outputSourceName == null || dialog.outputRasterPath == null){
				MapCloud.notify.showInfo("请选择输出影像的位置","Warning");
				return;
			}
			var outputRasterName = dialog.panel.find(".gps-output-raster-name").val();
			if(outputRasterName == null || outputRasterName == ""){
				MapCloud.notify.showInfo("请选择输出影像的名称","Warning");
				return;
			}
			var ouputRasterFormat = dialog.panel.find(".gps-output-raster-format").val();
			outputRasterName += ouputRasterFormat;

			MapCloud.notify.loading();
			gpsManager.rasterPixelBlend(dialog.inputSourceName_1,dialog.inputRasterName_1,
				dialog.inputRasterPath_1,dialog.inputSourceName_2,dialog.inputRasterName_2,
				dialog.inputRasterPath_2,dialog.outputSourceName,outputRasterName,
				dialog.outputRasterPath,dialog.rasterPixelBlend_callback);
		});

		// 重置
		this.panel.find(".gps-btn-reset").click(function(){
			dialog.cleanup();
		});

	},

	cleanup : function(){
		this.panel.find(".gps-input-source-name-1").val("");
		this.panel.find(".gps-input-raster-name-1").val("");
		this.panel.find(".gps-input-raster-path-1").val("");
		this.panel.find(".gps-input-source-name-2").val("");
		this.panel.find(".gps-input-raster-path-2").val("");
		this.panel.find(".gps-input-raster-name-2").val("");
		this.panel.find(".gps-output-source-name").val("");
		this.panel.find(".gps-output-raster-path").val("");
		this.panel.find(".gps-output-raster-name").val("");
		this.panel.find(".gps-oper-log-div").empty();

		this.inputSourceName_1 = null;
		this.inputRasterPath_1 = null;
		this.inputRasterName_1 = null;
		this.inputSourceName_2 = null;
		this.inputRasterName_2 = null;
		this.inputRasterPath_2 = null;
		this.outputSourceName = null;
		this.outputRasterPath = null;
	},	

	// 输入影像1
	setRaster_1 : function(sourceName,rasterName,rasterPath){
		this.inputSourceName_1 = sourceName;
		this.inputRasterName_1 = rasterName;
		this.inputRasterPath_1 = rasterPath;

		this.panel.find(".gps-input-source-name-1").val(this.inputSourceName_1);
		this.panel.find(".gps-input-raster-name-1").val(this.inputRasterName_1);
		this.panel.find(".gps-input-raster-path-1").val(this.inputRasterPath_1);		
	},

	// 输入影像2
	setRaster_2 : function(sourceName,rasterName,rasterPath){
		this.inputSourceName_2 = sourceName;
		this.inputRasterName_2 = rasterName;
		this.inputRasterPath_2 = rasterPath;

		this.panel.find(".gps-input-source-name-2").val(this.inputSourceName_2);
		this.panel.find(".gps-input-raster-name-2").val(this.inputRasterName_2);
		this.panel.find(".gps-input-raster-path-2").val(this.inputRasterPath_2);	
	},


	// 输出参数
	setOutput : function(outputSourceName,outputRasterPath){
		this.outputSourceName  = outputSourceName;
		this.outputRasterPath = outputRasterPath;

		this.panel.find(".gps-output-source-name").val(this.outputSourceName);
		this.panel.find(".gps-output-raster-path").val(this.outputRasterPath);
	},		
	rasterPixelBlend_callback : function(result){
		MapCloud.notify.hideLoading();
		var dialog = MapCloud.gps_raster_pixel_blend_dialog;
		var outputRasterName = dialog.panel.find(".gps-output-raster-name").val() 
				+ dialog.panel.find(".gps-output-raster-format").val();
		var html = "<div class='row'>"
			+ "输入-1 [ 数据库 : " + dialog.inputSourceName_1 + " ; 路径 : " + dialog.inputRasterPath_1
			+ " ; 影像 : " + dialog.inputRasterName_1
			+ " ]; 输入-2 [ 数据库 : " + dialog.inputSourceName_2 + " ; 路径 : " + dialog.inputRasterPath_2
			+ " ; 影像 : " + dialog.inputRasterName_2
			+ " ]; 输出 [ 数据库 : " + dialog.outputSourceName + " ; 路径 :  " + dialog.outputRasterPath
			+ "; 影像 : " + outputRasterName +  " ];  结果 : "+ result;
		dialog.panel.find(".gps-oper-log-div").append(html);		
	}
});