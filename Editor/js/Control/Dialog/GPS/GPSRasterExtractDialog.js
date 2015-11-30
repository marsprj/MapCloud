MapCloud.GPSRasterExtractDialog = MapCloud.Class(MapCloud.Dialog,{
	
	// 输入数据库
	inputSourceName : null,

	// 输入影像
	inputRasterName : null,
	
	// 输入影像路径
	inputRasterPath : null,
	// 输出数据库
	outputSourceName : null,

	// 输出影像路径
	outputRasterPath : null,

	// 输入影像的范围
	rasterExtent : null,

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

		// choose input source name & input raster name
		dialog.panel.find(".btn-choose-input-raster").click(function(){
			MapCloud.raster_db_dialog.showDialog("rasterExtract",false);
		});


		// choose output sourcename
		dialog.panel.find(".btn-choose-output-source-name").click(function(){
			MapCloud.raster_db_dialog.showDialog("rasterExtract",true);
		});


		// 操作
		this.panel.find(".gps-btn-oper-btn").click(function(){
			if(dialog.inputSourceName == null || dialog.inputRasterName == null 
				|| dialog.inputRasterPath == null){
				MapCloud.notify.showInfo("请选择输入的影像","Warning");
				return;
			}

			if(dialog.outputSourceName == null || dialog.outputRasterPath == null){
				MapCloud.notify.showInfo("请选择输出影像的位置","Warning");
				return;
			}
			var outputRasterName = dialog.panel.find(".gps-output-raster-name").val();
			if(outputRasterName == null || outputRasterName == ""){
				MapCloud.notify.showInfo("请选择输出影像的名称","Warning");
				dialog.panel.find(".gps-output-raster-name").focus();
				return;
			}
			var nameReg = /^[0-9a-zA-Z_]+$/;
			if(!nameReg.test(outputRasterName)){
				MapCloud.notify.showInfo("请输入有效的输出影像的名称","Warning");
				dialog.panel.find(".gps-output-raster-name").focus();
				return;
			}


			var ouputRasterFormat = dialog.panel.find(".gps-output-raster-format").val();
			outputRasterName += ouputRasterFormat;


			var xmin = dialog.panel.find(".gps-output-raster-xmin").val();
			var xmax = dialog.panel.find(".gps-output-raster-xmax").val();
			var ymin = dialog.panel.find(".gps-output-raster-ymin").val();
			var ymax = dialog.panel.find(".gps-output-raster-ymax").val();
			if(!$.isNumeric(xmin) || !$.isNumeric(xmax) ||!$.isNumeric(ymin)
				|| !$.isNumeric(ymax)){
				MapCloud.notify.showInfo("请输入要截取的范围","Warning");
				return;
			}



			xmin = parseFloat(xmin);
			xmax = parseFloat(xmax);
			ymin = parseFloat(ymin);
			ymax = parseFloat(ymax);

			if(xmin < dialog.rasterExtent.xmin){
				MapCloud.notify.showInfo("请输入有效的范围","Warning");
				dialog.panel.find(".gps-output-raster-xmin").focus();
				return;
			}

			if(ymin < dialog.rasterExtent.ymin){
				MapCloud.notify.showInfo("请输入有效的范围","Warning");
				dialog.panel.find(".gps-output-raster-ymin").focus();
				return;
			}

			if(xmax > dialog.rasterExtent.xmax){
				MapCloud.notify.showInfo("请输入有效的范围","Warning");
				dialog.panel.find(".gps-output-raster-xmax").focus();
				return;
			}		

			if(ymax > dialog.rasterExtent.ymax){
				MapCloud.notify.showInfo("请输入有效的范围","Warning");
				dialog.panel.find(".gps-output-raster-ymax").focus();
				return;
			}		

			if(xmin > xmax || ymin > ymax){
				MapCloud.notify.showInfo("请输入有效的范围","Warning");
				return;
			}

			var extent = new GeoBeans.Envelope(xmin,ymin,xmax,ymax);
			MapCloud.notify.loading();
			gpsManager.rasterExtractByRectangle(dialog.inputSourceName,dialog.inputRasterName,
				dialog.inputRasterPath,dialog.outputSourceName, outputRasterName,
				dialog.outputRasterPath,extent,dialog.rasterExtractByRectangle_callback);


		});

		// 重置
		this.panel.find(".gps-btn-reset").click(function(){
			dialog.cleanup();
		});
	},

	cleanup : function(){
		this.panel.find(".gps-input-source-name").val("");
		this.panel.find(".gps-input-raster-path").val("");
		this.panel.find(".gps-input-raster-name").val("");
		this.panel.find(".gps-output-source-name").val("");
		this.panel.find(".gps-output-raster-path").val("");
		this.panel.find(".gps-output-raster-name").val("");
		this.panel.find(".gps-input-raster-xmin").val("");
		this.panel.find(".gps-input-raster-ymin").val("");
		this.panel.find(".gps-input-raster-xmax").val("");
		this.panel.find(".gps-input-raster-xmax").val("");
		this.panel.find(".gps-input-raster-ymax").val("");
		this.panel.find(".gps-output-raster-xmin").val("");
		this.panel.find(".gps-output-raster-ymin").val("");
		this.panel.find(".gps-output-raster-xmax").val("");
		this.panel.find(".gps-output-raster-ymax").val("");

		this.panel.find(".gps-oper-log-div").empty();

		this.inputSourceName = null;
		this.inputRasterName = null;
		this.inputRasterPath = null;
		this.outputSourceName = null;
		this.outputRasterPath = null;
		this.rasterExtent = null;
	},

	// 输入影像
	setRaster : function(inputSourceName,inputRasterName,inputRasterPath,raster){
		this.inputSourceName = inputSourceName;
		this.inputRasterName = inputRasterName;
		this.inputRasterPath = inputRasterPath;

		this.panel.find(".gps-input-source-name").val(this.inputSourceName);
		this.panel.find(".gps-input-raster-name").val(this.inputRasterName);
		this.panel.find(".gps-input-raster-path").val(this.inputRasterPath);

		if(raster != null){
			var extent = raster.extent;
			if(extent != null){
				this.rasterExtent = extent;
				this.panel.find(".gps-input-raster-xmin").val(extent.xmin);
				this.panel.find(".gps-input-raster-ymin").val(extent.ymin);
				this.panel.find(".gps-input-raster-xmax").val(extent.xmax);
				this.panel.find(".gps-input-raster-ymax").val(extent.ymax);
			}
		}
	},

	// 输出参数
	setOutput : function(outputSourceName,outputRasterPath){
		this.outputSourceName  = outputSourceName;
		this.outputRasterPath = outputRasterPath;

		this.panel.find(".gps-output-source-name").val(this.outputSourceName);
		this.panel.find(".gps-output-raster-path").val(this.outputRasterPath);
	},


	rasterExtractByRectangle_callback : function(result){
		MapCloud.notify.hideLoading();
		var dialog = MapCloud.gps_raster_extract_dialog;
		var outputRasterName = dialog.panel.find(".gps-output-raster-name").val() 
				+ dialog.panel.find(".gps-output-raster-format").val();
		var html = "<div class='row'>"
			+ "输入 [ 数据库 : " + dialog.inputSourceName + " ; 路径 : " + dialog.inputRasterPath
			+ " ; 影像 : " + dialog.inputRasterName
			+ " ]; 输出 [ 数据库 : " + dialog.outputSourceName + " ; 路径 :  " + dialog.outputRasterPath
			+ "; 影像 : " 
			+ outputRasterName + " ];  结果 : "
			+ result;
		dialog.panel.find(".gps-oper-log-div").append(html);		
	}
});