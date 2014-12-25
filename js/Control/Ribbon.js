MapCloud.Ribbon = MapCloud.Class({
	
	height_max : "100px",
	height_min : "20px",
	ribbon : null,
	
	initialize : function(){
	
		this.ribbon = $("#ribbon_wrapper").first();

		this.hideAllRibbons();
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
	
	showRibbon : function(type){
		$("#"+type+"_ribbon").css("display","block");
	},
	
	expand : function(){
		this.ribbon.css("height", this.height_max);
	},
	
	collapse : function(){
		this.ribbon.css("height", this.height_min);
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
					that.onMapNew();
					break;
				case 1:
					that.onMapPropertis();
					break;
				// Layer Events
				case 2:
					that.onLayerNew();
					break;
				case 3:
					that.onLayerAddVector();
					break;
				case 4:
					that.onLayerAddWMS();
					break;
				case 5:
					that.onLayerAddWFS();
					break;
				case 6:
					that.onLayerNew();
					break;
				case 7:
					that.onEditLayer();
					break;
				case 8:
					that.onShareLayer();
					break;
				case 9:
					that.onCreateLayer();
					break;
				case 10:
					//复制图层
					that.onDuplicateLayer();
					break;
				case 11:
					//删除图层
					that.onDeleteLayer();
					break;
				case 12:
					//图层定位
					that.onZoomLayer();
					break;
				case 13:
					//选择所有
					that.onSelectAllLayers();
					break;
				case 14:
					//导入图层
					that.onImportLayer();
					break;
				case 15:
					//导出图层
					that.onExportLayer();
					break;
				//Data Events
				case 16:
					that.addChart();
					break;
				// Tools Events
				case 17:
					that.onFile();
					break;
				case 18:
					that.onDatabase();


				// Data Events
/*				case 6:
					that.onFile();
					break;
				case 7:
					that.onDatabase();
					break;
				case 8:
					that.onDataImport();
					break;
*/				};
			});
        });
	},

	/**************************************************************/
	/* Map Event                                                  */
	/**************************************************************/
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
		alert("onLayerAddVector");
	},
	
	onLayerAddRaster : function(){
		alert("onLayerAddRaster");
	},
	
	onLayerAddWMS : function(){
		alert("onLayerAddWMS");
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
		$("#layerAppearanceDialog").modal();
		$("#layerAppearanceDialog").find("#layerAppearanceDialogTab a").each(function(){
			$(this).click(function(e){
				e.preventDefault()
				$(this).tab("show");
			});
		});
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


	onFile : function(){
		if(MapCloud.file_dialog == null){
			MapCloud.file_dialog = new MapCloud.FileDialog("file_dialog");
		}
		
		MapCloud.file_dialog.showDialog();

	},
	
	onDatabase : function(){
		if(MapCloud.database_dlg == null){
			MapCloud.database_dlg = new MapCloud.DatabaseDialog("database_dialog");
		}		
		MapCloud.database_dlg.showDialog();
	},
	
	onDataImport : function(){
		alert("onDataImport");
	}
});
	