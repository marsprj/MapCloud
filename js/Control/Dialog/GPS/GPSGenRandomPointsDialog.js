MapCloud.GPSGenRandomPointsDialog = MapCloud.Class(MapCloud.Dialog,{
	
	// 输出的数据库
	outputSourceName : null,
	// 输出投影
	outputSrid : null,

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


		// choose output sourcename
		dialog.panel.find(".btn-choose-output-source-name").click(function(){
			MapCloud.gps_output_source_dialog.showDialog("genRandomPoints","Feature");
		});

		// choose ouput srid
		dialog.panel.find(".btn-choose-output-srid").click(function(){
			MapCloud.gps_srid_dialog.showDialog("genRandomPoints");
		});



		// 操作
		this.panel.find(".gps-btn-oper-btn").click(function(){
			if(dialog.outputSourceName == null){
				MapCloud.notify.showInfo("请选择输出的数据库","Warning");
				return;
			}

			var outputTypeName = dialog.panel.find(".gps-output-typename").val();
			if(outputTypeName == ""){
				MapCloud.notify.showInfo("请输入输出的数据名称","Warning");
				return;
			}

			var count = dialog.panel.find(".gps-output-count").val();
			count = parseInt(count);
			if(count == null || count < 0){
				MapCloud.notify.showInfo("请输入随机生成点的个数","Warning");
				return;
			}


			if(dialog.outputSrid == null){
				MapCloud.notify.showInfo("请输入转换后的投影","Warning");
				return;
			}

			var xmin = dialog.panel.find(".gps-output-xmin").val();
			var xmax = dialog.panel.find(".gps-output-xmax").val();
			var ymin = dialog.panel.find(".gps-output-ymin").val();
			var ymax = dialog.panel.find(".gps-output-ymax").val();

			xmin = parseFloat(xmin);
			xmax = parseFloat(xmax);
			ymin = parseFloat(ymin);
			ymax = parseFloat(ymax);

			if(typeof(xmin) != "number" || typeof(xmax) != "number"
				|| typeof(ymin) != "number" || typeof(ymax) != "number"){
				MapCloud.notify.showInfo("请输入随机生成点的范围","Warning");
				return;
			}

			var extent = new GeoBeans.Envelope(xmin,ymin,xmax,ymax);
			MapCloud.notify.loading();
			gpsManager.generateRandomPoints(dialog.outputSourceName,outputTypeName,extent,
				dialog.outputSrid,count,dialog.generateRandomPoints_callback);
		});

		// 重置
		this.panel.find(".gps-btn-reset").click(function(){
			dialog.cleanup();
		});

	},

	cleanup : function(){
		this.panel.find(".gps-output-source-name").val("");
		this.panel.find(".gps-output-typename").val("");
		this.panel.find(".gps-output-srid").val("");
		this.panel.find(".gps-oper-log-div").empty();
		this.panel.find(".gps-output-count").val("");
		this.panel.find(".gps-output-xmin").val("-180.0");
		this.panel.find(".gps-output-xmax").val("180.0");
		this.panel.find(".gps-output-ymin").val("-90.0");
		this.panel.find(".gps-output-ymax").val("90.0");


		this.outputSrid = null;
		this.outputSourceName = null;
	},



	// 输出
	setOutputSource : function(outputSourceName){
		this.outputSourceName = outputSourceName;
		this.panel.find(".gps-output-source-name").val(this.outputSourceName);
	},

	// 设置输出的srid
	setSrid : function(srid){
		this.outputSrid = srid;
		this.panel.find(".gps-output-srid").val(this.outputSrid);
	},


	generateRandomPoints_callback : function(result){
		MapCloud.notify.hideLoading();
		var dialog = MapCloud.gps_gen_random_points_dialog;
		var html =  "<div class='row'>"
			+ " 输出 [ 数据库 : " + dialog.outputSourceName + "; 表 : " 
			+ dialog.panel.find(".gps-output-typename").val() + " ];  结果 : "
			+ result + "</div>";
		dialog.panel.find(".gps-oper-log-div").append(html);
	}


});