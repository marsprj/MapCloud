MapCloud.GPSBuildPyramidDialog = MapCloud.Class(MapCloud.Dialog,{
	
	outputSourceName : null,


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
			// MapCloud.gps_output_source_dialog.showDialog("buildPyramid","Tile");
			MapCloud.tile_db_dialog.showDialog("buildPyramid");
		});	


		// 操作
		this.panel.find(".gps-btn-oper-btn").click(function(){
			var mapName = dialog.panel.find(".gps-map-name").val();
			if(mapName == ""){
				MapCloud.notify.showInfo("当前地图为空","Warning");
				return;
			}

			if(dialog.outputSourceName == null){
				MapCloud.notify.showInfo("请选择输出的数据库","Warning");
				return;
			}

			var tileStore = dialog.panel.find(".gps-tile-store").val();
			if(tileStore == null){
				MapCloud.notify.showInfo("请输入瓦片库的名称","Warning");
				return;
			}

			var start = dialog.panel.find(".gps-start-level").val();
			if(!$.isNumeric(start)){
				MapCloud.notify.showInfo("请输入起始级别","Warning");
				dialog.panel.find(".gps-start-level").focus();
				return;
			}
			start = parseInt(start);
			if(start <= 0){
				MapCloud.notify.showInfo("请输入有效的起始级别","Warning");
				dialog.panel.find(".gps-start-level").focus();
				return;
			}

			var end = dialog.panel.find(".gps-end-level").val();
			if(!$.isNumeric(end)){
				MapCloud.notify.showInfo("请输入终止级别","Warning");
				dialog.panel.find(".gps-end-level").focus();
				return;
			}
			end = parseInt(end);
			if(end <= 0){
				MapCloud.notify.showInfo("请输入有效的终止级别","Warning");
				dialog.panel.find(".gps-end-level").focus();
				return;
			}
			if(start > end){
				MapCloud.notify.showInfo("请输入有效的起止级别","Warning");
				return;
			}
			MapCloud.notify.loading();
			gpsManager.buildPyramid(mapName,dialog.outputSourceName,tileStore,start,end,
				dialog.buildPyramid_callback);
		});

		// 重置
		this.panel.find(".gps-btn-reset").click(function(){
			dialog.cleanup();
		});
	},

	showDialog : function(){
		MapCloud.Dialog.prototype.showDialog.apply(this,arguments);
		if(mapObj != null){
			this.panel.find(".gps-map-name").val(mapObj.name);
		}
	},

	cleanup : function(){
		this.outputSourceName = null;
		this.tileStoreName = null;

		this.panel.find(".gps-map-name").val("");
		this.panel.find(".gps-output-source-name").val("");
		this.panel.find(".gps-tile-store").val("");
		this.panel.find(".gps-start-level").val("");
		this.panel.find(".gps-end-level").val("");
		this.panel.find(".gps-oper-log-div").empty();
	},

	// // 输出
	// setOutputSource : function(outputSourceName){
	// 	this.outputSourceName = outputSourceName;
	// 	this.panel.find(".gps-output-source-name").val(this.outputSourceName);
	// },

	// 输出瓦片库信息
	setTileStore : function(sourceName,tileStoreName){
		this.outputSourceName = sourceName;
		this.panel.find(".gps-output-source-name").val(this.outputSourceName);

		this.tileStoreName = tileStoreName;
		this.panel.find(".gps-tile-store").val(this.tileStoreName);
	},

	// 结果
	buildPyramid_callback : function(result){
		MapCloud.notify.hideLoading();
		var dialog = MapCloud.gps_build_pyramid_dialog;
		var html = "<div class='row'>"
		+ result + "</div>";
		dialog.panel.find(".gps-oper-log-div").append(html);
	},

});