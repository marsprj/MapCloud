MapCloud.Ribbon = MapCloud.Class({
	
	height_max : "100px",
	height_min : "20px",
	ribbon : null,
	ribbonContainer : null,
	
	initialize : function(){
	
		this.ribbon = $("#ribbon_wrapper").first();
		this.ribbonContainer = $("#ribbon_container").first();

		this.hideAllRibbons();
		this.displayFirstRibbon();
		this.registerRibbonEvents();
		
		this.enableMneuEffect();
		this.registerMenuEvents();
	},
	
	destory : function(){
	},
	
	hideAllRibbons : function(){
		$(".ribbon_panel").each(function() {
			$(this).css("display","none");					
		});
	},

	displayFirstRibbon : function(){
		$("#map_ribbon").css("display","block");
	},
	
	showRibbon : function(type){
		$("#"+type+"_ribbon").css("display","block");
	},
	
	expand : function(){
		this.ribbon.css("height", this.height_max);
		this.ribbonContainer.css("height","80px");
		$("#main_panel").css("height","calc(100% - 122px)");
	},
	
	collapse : function(){
		this.ribbon.css("height", this.height_min);
		this.ribbonContainer.css("height","0px");
		$("#main_panel").css("height","calc(100% - 42px)");
	},
	
	isCollapsed : function(){
		return (this.ribbon.css("height") == this.height_min);
	},
	
	registerRibbonEvents : function(){
	
		var mcribbon = this;	
		$("#ribbon_tabs li").each(function() {
						
			$(this).mouseover(function(){
				$(this).addClass("mc-theme-color-hover");
			});
			$(this).mouseout(function(){
				$(this).removeClass("mc-theme-color-hover");
			});			
			$(this).click(function(){
				var id =  $(this).attr("id");
				var type = id.substr(0, id.length-4);
				$("#ribbon_tabs li").each(function() {
                    $(this).removeClass("mc-active-tab");					
                });
				$(this).addClass("mc-active-tab");
				
				mcribbon.hideAllRibbons();
				mcribbon.showRibbon(type);
			});
        });
	},
	
	enableMneuEffect : function(){
		$(".ribbon-item").each(function(index, element) {
			$(this).mouseover(function(){
				$(this).addClass("ribbon-item-over");
			});
			$(this).mouseout(function(){
				$(this).removeClass("ribbon-item-over");
			});	
        });
	},
	
	registerMenuEvents : function(){
		var that = this;
		$(".ribbon-item").each(function(index, element) {
			$(this).click(function(e) {
				switch(index){
				// Map Events
				case 0:
					that.onGetMaps();
					break;
				case 1:
					that.onCreateMap();
					break;
				case 2:
					// that.onMapNew();
					that.onMapMgr();
					break;
				case 3:
					that.onMapPropertis();
					break;
				// Layer Events
				case 4:
					that.onLayerNew();
					break;
				case 5:
					that.onLayerAddWMS();
					break;
				case 6:
					that.onLayerAddWFS();
					break;
				case 7:
					that.onLayerNew();
					break;
				case 8:
					// 编辑图层
					// that.onEditLayer();
					break;
				case 9:
					that.onShareLayer();
					break;
				case 10:
					// that.onCreateLayer();
					break;
				case 11:
					//复制图层
					that.onDuplicateLayer();
					break;
				case 12:
					//删除图层
					that.onDeleteLayer();
					break;
				case 13:
					//图层定位
					that.onZoomLayer();
					break;
				case 14:
					//选择所有
					that.onSelectAllLayers();
					break;
				case 15:
					//导入图层
					that.onImportLayer();
					break;
				case 16:
					//导出图层
					that.onExportLayer();
					break;
				//Data Events
				case 17:
					that.addChart();
					break;
				case 18:
					// 文件管理
					// that.onFile();
					break;
				case 19:
					//数据库管理
					that.onDataSource();
					break;
				case 20:
				// 导入矢量
					that.onImportVector();
					break;
				case 21:
				// 	导入影像
					break;
				case 22:
				// 热力图
					that.onHeatMap();
					break;
				// Tools Events
				case 23:
					// 标注
					that.onLayerAddVector();
					break;
				case 24:
					// 图层样式
					that.onStyleManager();
					break;
				};
			});
        });
	},

	/**************************************************************/
	/* Map Event                                                  */
	/**************************************************************/
	onGetMaps : function(){
		MapCloud.get_maps_dlg.showDialog();
	},

	onMapMgr : function(){
		MapCloud.map_mgr_dialog.showDialog();
	},

	onCreateMap : function(){
		MapCloud.create_map_dlg.showDialog();
	},
	onMapNew : function(){
		if(MapCloud.new_map_dlg == null){
			MapCloud.new_map_dlg = new MapCloud.NewMapDialog("newMapDialog");
		}
		MapCloud.new_map_dlg.showDialog();

		// $("#newMapDialog").modal();
		
	},
	
	onMapPropertis : function(){
		alert("onMapPropertis");
	},
	
	/**************************************************************/
	/* Layer Event                                                */
	/**************************************************************/
	onLayerNew : function(){
		if(MapCloud.new_layer_dialog == null){
			MapCloud.new_layer_dialog = new MapCloud.NewLayerDialog("new_layer_dialog");
		}
		MapCloud.new_layer_dialog.showDialog();
	},
	
	onLayerAddVector : function(){
		if(MapCloud.overlay_panel == null){
			MapCloud.overlay_panel = new MapCloud.TrackOverlay("left_panel_overlay",
										"map_overlay_wrapper");
		}
		MapCloud.overlay_panel.show();
	},
	
	onLayerAddRaster : function(){
		alert("onLayerAddRaster");
	},
	
	onLayerAddWMS : function(){
		if(MapCloud.wms_dialog == null){
			MapCloud.wms_dialog = new MapCloud.WMSDialog("wmsDialog");
		}
		MapCloud.wms_dialog.showDialog();
	},
	
	onLayerAddWFS : function(){
		if(MapCloud.wfs_datasource_dialog == null){
			MapCloud.wfs_datasource_dialog = new MapCloud.WFSDatasourceDialog("wfsDatasourceDialog");
		}
		MapCloud.wfs_datasource_dialog.showDialog();
/*		$("#wfsDatasourceDialog").modal();
		$("#wfsDatasourceDialogTab a").click(function(e){
			e.preventDefault()
			$(this).tab("show");
		});
*/	},

	onEditLayer: function(){
		if(MapCloud.edit_layer_dialog == null){
			MapCloud.edit_layer_dialog = new MapCloud.EditLayerDialog("editLayerDialog");
		}
		if($("#layers_row .layer_row.layer_row_selected").length == 0){
			alert("请先选择图层");
			return;			
		}
		var layer_id = $("#layers_row .layer_row.layer_row_selected").attr("value");
		MapCloud.selected_layer = mapObj.layers[layer_id];
		if(MapCloud.selected_layer == null){
			return;
		}
		//设置修改的图层
		MapCloud.edit_layer_dialog.setLayer(MapCloud.selected_layer);
		MapCloud.edit_layer_dialog.showDialog();
	},
	
	onShareLayer:function(){
		alert("分享");
		// $("#layerAppearanceDialog").modal();
		// $("#layerAppearanceDialog").find("#layerAppearanceDialogTab a").each(function(){
		// 	$(this).click(function(e){
		// 		e.preventDefault()
		// 		$(this).tab("show");
		// 	});
		// });
	},

	onCreateLayer:function(){
		if(MapCloud.create_layer_dialog == null){
			MapCloud.create_layer_dialog = new MapCloud.CreateLayerDialog("create_layer_dialog");
		}
		MapCloud.create_layer_dialog.showDialog();
	},
	
	onDuplicateLayer:function(){
		if(confirm("你确定要复制图层吗？")){
			alert("复制图层并刷新tree");
		}
	},

	onDeleteLayer:function(){
		if($("#layers_row .layer_row.layer_row_selected").length == 0){
			alert("请先选择图层");
			return;			
		}
		var layer_id = $("#layers_row .layer_row.layer_row_selected").attr("value");
		MapCloud.selected_layer = mapObj.layers[layer_id];
		if(MapCloud.selected_layer == null){
			return;
		}

		if(confirm("你确定要删除图层吗？")){
			var layer_name = MapCloud.selected_layer.name;
			mapObj.removeLayer(layer_name);
			if(MapCloud.refresh_panel ==null){
				MapCloud.refresh_panel = new MapCloud.refresh("left_panel");
			}
			MapCloud.refresh_panel.refreshPanel();
			mapObj.setViewer(new GeoBeans.Envelope(-180,-90,180,90));
			mapObj.draw();				
		}
	},

	onZoomLayer:function(){
		alert("图层定位");
	},

	onSelectAllLayers:function(){
		alert("选择图层");
	},
	
	onImportLayer:function(){
		alert("导入图层");
	},
	
	onExportLayer:function(){
		alert("导出图层");
	},



	/**************************************************************/
	/* Data Event                                                */
	/**************************************************************/
	addChart:function(){



		if(MapCloud.new_chart_dialog == null){
			MapCloud.new_chart_dialog = new MapCloud.NewChartDialog("newChartDialog");
		}
		MapCloud.new_chart_dialog.showDialog();		

	},

	onHeatMap : function(){
		var layerName = $("#layers_row .layer_row_selected")
			.attr("lname");
		if(layerName == null || layerName == ""){
			MapCloud.alert_info.showInfo("请选择图层","Warning");
			return;
		}
		var layer = mapObj.getLayer(layerName);
		if(layer == null){
			return;
		}
		MapCloud.heatMap_dialog.showDialog();
		MapCloud.heatMap_dialog.setLayer(layer);
	},

	onFile : function(){
		if(MapCloud.file_dialog == null){
			MapCloud.file_dialog = new MapCloud.FileDialog("file_dialog");
		}
		
		MapCloud.file_dialog.showDialog();

	},
	
	onDataSource : function(){
		MapCloud.data_source_dialog.showDialog();
	},

	onDatabase : function(){
		if(MapCloud.database_dlg == null){
			MapCloud.database_dlg = new MapCloud.DatabaseDialog("database_dialog");
		}		
		MapCloud.database_dlg.showDialog();
	},
	
	//导入矢量
	onImportVector : function(){
		MapCloud.importVector_dialog.showDialog();
	},

	//导入影像
	onImportImage : function(){

	},

	onDataImport : function(){
		alert("onDataImport");
	},

	onStyleManager : function(){
		// if(MapCloud.styleMgr_dialog == null){
		// 	MapCloud.styleMgr_dialog = new MapCloud.StyleMgrDialog("style-mgr-dialog");
		// }
		// MapCloud.styleMgr_dialog.showDialog();
		MapCloud.styleManager_dialog.showDialog();
	}
});
	