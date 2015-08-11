MapCloud.GPSUpdateTileDialog = MapCloud.Class(MapCloud.Dialog,{
	
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
			MapCloud.gps_output_source_dialog.showDialog("updateTile");
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

			var level = dialog.panel.find(".gps-level").val();
			if(level == ""){
				MapCloud.notify.showInfo("请输入级别","Warning");
				return;
			}

			var row = dialog.panel.find(".gps-tile-row");
			if(row == ""){
				MapCloud.notify.showInfo("请输入行号","Warning");
				return;
			}

			var col = dialog.panel.find(".gps-tile-col");
			if(col == ""){
				MapCloud.notify.showInfo("请输入列号","Warning");
				return;
			}

			MapCloud.notify.loading();
			gpsManager.updateTile(mapName,dialog.outputSourceName,tileStore,level,row,
				col,dialog.updateTile_callback);
		});

		// 重置
		this.panel.find(".gps-btn-reset").click(function(){
			dialog.cleanup();
		});
	},

	cleanup : function(){
		this.panel.find(".gps-map-name").val("");
		this.panel.find(".gps-output-source-name").val("");
		this.panel.find(".gps-tile-store").val("");
		this.panel.find(".gps-level").val("");
		this.panel.find(".gps-tile-row").val("");
		this.panel.find(".gps-tile-col").val("");
		this.panel.find(".gps-oper-log-div").empty();		
	},

	showDialog : function(){
		MapCloud.Dialog.prototype.showDialog.apply(this,arguments);
		if(mapObj != null){
			this.panel.find(".gps-map-name").val(mapObj.name);
		}
	},
	// 输出
	setOutputSource : function(outputSourceName){
		this.outputSourceName = outputSourceName;
		this.panel.find(".gps-output-source-name").val(this.outputSourceName);
	},

	updateTile_callback : function(result){
		MapCloud.notify.hideLoading();
		var dialog = MapCloud.gps_update_tile_dialog;
		var html = "<div class='row'>"
		+ result + "</div>";
		dialog.panel.find(".gps-oper-log-div").append(html);
	}
	
});