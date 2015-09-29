MapCloud.WFSDatasourceDialog = MapCloud.Class(MapCloud.Dialog, {

	geomType:null,

	layer: null,



	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		
		var dialog = this;

		//获取到的图层列表
		var types = null;

		this.panel.find("#wfsDatasourceDialogTab a").each(function(){
			$(this).click(function(e){
				e.preventDefault()
				$(this).tab("show");
			});
		});

		// 获取信息
		this.panel.find("#wfs_datasource_get_info").each(function(){
			$(this).click(function(){
				dialog.panel.find("#wfs_datasource_layer_url").each(function(){
					var url = $(this).val();
					if(url== ""){
						MapCloud.notify.showInfo("请输入WFS服务地址","Warning");
						dialog.panel.find("#wfs_datasource_layer_url").focus();
						return;
					}
					var version = "1.0.0";

					var wfsworkspace = new GeoBeans.WFSWorkspace("world", url, version);
					if(wfsworkspace == null){
						MapCloud.notify.showInfo("error");
						return;
					}
					types = wfsworkspace.getFeatureTypes();
					if(types == null){
						MapCloud.notify.showInfo("无法获取图层","error");
						return;
					}

					// 展示图层
					dialog.displayLayers(types);
					dialog.types = types;
				});
			});
		});

		// 确定
		this.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				var layer_name = null;
				layer_name = dialog.panel.find("#wfs_datasource_layer_name").val();
				if (layer_name == null || layer_name == "")
				{
					MapCloud.notify.showInfo("输入图层名","Warning");
					dialog.panel.find("#wfs_datasource_layer_name").focus();
					return;
				}

				var nameReg = /^[0-9a-zA-Z_]+$/;
				if(!nameReg.test(layer_name)){
					MapCloud.notify.showInfo("请输入有效的图层名","Warning");
					dialog.panel.find("#wfs_datasource_layer_name").focus();
					return;
				}

				if(mapObj == null){
					MapCloud.notify.showInfo("当前地图为空","Warning");
					return;
				}

				var layers = mapObj.getLayers();
				for(var i = 0; i < layers.length; ++i){
					var layer = layers[i];
					if(layer.name == layer_name){
						MapCloud.notify.showInfo("图层名重复，请修改","Warning");
						dialog.panel.find("#wfs_datasource_layer_name").focus();
						return;
					}
				}

				// 获取图层名
				var typename = null;
				typename = dialog.panel.find("#wfs_datasource_layers option:selected").text();
				if(typename == null || typename == ""){
					MapCloud.notify.showInfo("设置有效的图层","Warning");
					return;
				}


				// 获取地址
				var server = null;
				dialog.panel.find("#wfs_datasource_layer_url").each(function(){
					server = $(this).val();
				});
				if(server == null || server == ""){
					MapCloud.notify.showInfo("请输入有效的地址","Warning");
					dialog.panel.find("#wfs_datasource_layer_url").focus();
					return;
				}
				dialog.layer = new GeoBeans.Layer.WFSLayer(layer_name,
										server,
										typename,
										"GML2");
				var type = dialog.getFeatureType(typename);
				if(type != null){
					var extent = type.extent;
					dialog.layer.extent = extent;
				}

				mapObj.addLayer(dialog.layer);


				if(mapObj.getViewer() == null){
					mapObj.setViewer(new GeoBeans.Envelope(-180,-90,180,90));	
				}
				mapObj.draw();	

				dialog.closeDialog();
				// dialog.showFeaturesTable();

				MapCloud.refresh_panel.refreshPanel();	
				// MapCloud.resizeCharts();

			});
		});


		//切换图层
		this.panel.find("#wfs_datasource_layers").each(function(){
			$(this).change(function(){
				var value = $(this).find("option:selected").attr("value");
				var selected_type = types[value];
				if(selected_type== null){
					return;
				}
				dialog.panel.find("#wfs_datasource_layer_epsg").each(function(){
					$(this).val(selected_type.srs);
				});

				var extent = selected_type.extent;
				dialog.panel.find("#wfs_datasource_layer_xmin").each(function(){
					$(this).val(extent.xmin);
				});
				dialog.panel.find("#wfs_datasource_layer_ymin").each(function(){
					$(this).val(extent.ymin);
				});
				dialog.panel.find("#wfs_datasource_layer_xmax").each(function(){
					$(this).val(extent.xmin);
				});
				dialog.panel.find("#wfs_datasource_layer_ymax").each(function(){
					$(this).val(extent.ymax);
				});
			});
		});
		
	},
	
	destory : function(){
		MapCloud.Dialog.prototype.destory.apply(this, arguments);
	},
	
	cleanup : function(){
//		this.panel.find("#wfs_datasource_layer_name").each(function(){
//			$(this).val("");
//		});
//		this.panel.find("#wfs_datasource_layer_url").each(function(){
//			$(this).val("");
//		});
		this.panel.find("#wfs_datasource_layers").each(function(){
			$(this).empty();
		});

		this.geomType = null;

		this.layer = null;

		this.types = null;
	
	},
	

	// 展示获取到的图层
	displayLayers : function(types){
		this.panel.find("#wfs_datasource_layers").each(function(){
			$(this).empty();
		});

		for(var i = 0; i < types.length;++i){
			var type = types[i];
			this.panel.find("#wfs_datasource_layers").each(function(){
				var html = "<option value='" + i + "'>" + type.name + "</option>";
				$(this).append(html);
			});
		}

		var type_first = types[0];
		this.panel.find("#wfs_datasource_layer_epsg").each(function(){
			$(this).val(type_first.srs);
		});

		var extent = type_first.extent;
		this.panel.find("#wfs_datasource_layer_xmin").each(function(){
			$(this).val(extent.xmin);
		});
		this.panel.find("#wfs_datasource_layer_ymin").each(function(){
			$(this).val(extent.ymin);
		});
		this.panel.find("#wfs_datasource_layer_xmax").each(function(){
			$(this).val(extent.xmin);
		});
		this.panel.find("#wfs_datasource_layer_ymax").each(function(){
			$(this).val(extent.ymax);
		});		
	},


	getFeatureType : function(name){
		if(this.types == null){
			return null;
		}
		var type = null;
		for(var i = 0; i < this.types.length; ++i){
			type = this.types[i];
			if(type.name == name){
				return type;
			}
		}
		return null;
	}

		
});
	