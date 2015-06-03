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
						alert("空");
						return;
					}
					var version = "1.0.0";

					var wfsworkspace = new GeoBeans.WFSWorkspace("world", url, version);
					if(wfsworkspace == null){
						MapCloud.alert_info.showInfo("error");
						return;
					}
					types = wfsworkspace.getFeatureTypes();
					if(types == null){
						MapCloud.alert_info.showInfo("无法获取图层","error");
						return;
					}

					// 展示图层
					dialog.displayLayers(types);
				});
			});
		});

		// 确定
		this.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				var layer_name = null;
				dialog.panel.find("#wfs_datasource_layer_name").each(function(){
					layer_name = $(this).val();
				});
				if (layer_name == null || layer_name == "")
				{
					MapCloud.alert_info.showInfo("输入图层名","Warning");
					return;
				}
				var layers = mapObj.getLayers();
				for(var i = 0; i < layers.length; ++i){
					var layer = layers[i];
					if(layer.name == layer_name){
						MapCloud.alert_info.showInfo("图层名重复，请修改","Warning");
						dialog.panel.find("#wfs_datasource_layer_name").focus();
						return;
					}
				}

				// 获取图层名
				var typename = null;
				typename = dialog.panel.find("#wfs_datasource_layers option:selected").text();
				if(typename == null || typename == ""){
					MapCloud.alert_info.showInfo("设置有效的图层","Warning");
					return;
				}


				// 获取地址
				var server = null;
				dialog.panel.find("#wfs_datasource_layer_url").each(function(){
					server = $(this).val();
				});
				if(server == null || server == ""){
					MapCloud.alert_info.showInfo("请输入有效的地址","Warning");
					return;
				}
				dialog.layer = new GeoBeans.Layer.WFSLayer(layer_name,
										server,
										typename,
										"GML2");
				


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
	
	},
	
	// getDefaultStyle:function(){

	// 	//获得空间类型（点线面）
	// 	var ft = this.layer.featureType;
	// 	if(ft == null){
	// 		ft = this.layer.workspace.getFeatureType(this.layer.typeName);
	// 		if(ft == null){
	// 			return null;
	// 		}
	// 		this.layer.featureType = ft;
	// 	}
	// 	var fieldsArray = ft.fields;
	// 	if(fieldsArray == null){
	// 		fieldsArray = this.layer.featureType.getFields();
	// 		if(fieldsArray == null){
	// 			return null;
	// 		}
	// 	}
	// 	var geom = ft.geomFieldName;
	// 	if(geom == null){
	// 		return null;
	// 	}

	// 	var index = ft.getFieldIndex(geom);
	// 	if(index < -1 || index >= fieldsArray.length){
	// 		return null;
	// 	}
	// 	var field = fieldsArray[index];
	// 	if(field == null){
	// 		return null;
	// 	}
	// 	var geomType = field.geomType;
	// 	if(geomType == null){
	// 		return null;
	// 	}
	// 	this.geomType = geomType;

	// 	var symbolizer = MapCloud.getDeafaultSymbolizer(this.geomType);

	// 	return symbolizer;
	// },

	// showFeaturesTable: function(){
	// 	var dialog = this;
	// 	var ft = this.layer.featureType;
	// 	if(ft == null){
	// 		return;
	// 	}
	// 	var fieldsArray = ft.getFields();
	// 	if(fieldsArray == null){
	// 		return;
	// 	}
	// 	var geomName = ft.geomFieldName;
	// 	var model = new Array();
	// 	model[0] = new Object();
	// 	model[0].display = "fid";
	// 	model[0].name = "fid";
	// 	for(var i = 0; i < fieldsArray.length ; ++i){
	// 		var field = fieldsArray[i];
	// 		var obj = new Object();
	// 		obj.display = field.name;
	// 		obj.name = field.name;
	// 		if(obj.name == geomName){
	// 			obj.hide = true;
	// 		}
	// 		model[i + 1] = obj;
	// 	}
	// 	var datas = new Array();
	// 	var fts = null;
	// 	this.layer.featureType.getFeatures(function(featureType, features){
	// 		fts = features;
	// 		if(fts == null){
	// 			return;
	// 		}
	// 		for(var i = 0; i < fts.length; ++i){
	// 			var feature = fts[i];
	// 			datas[i] = feature.values;
	// 			datas[i].splice(0,0,i);
	// 		}


	// 		var table = new MapCloud.Table("datagrid_content",200,270,model,datas,10);
	// 		table.show(dialog.onFeatureTableSelected);

	// 	});
	// },
	
	// onFeatureHit:function(layer, selection, selection_old){
	// 	var i;
	// 	len = selection.length;
	// 	for(i=0; i<len; i++){
	// 		var f = selection[i];
	// 		layer.drawFeature(f, MapCloud.hited_symbolizer);
	// 	}
	// },
	
	// onFeatureTableSelected:function(trSelected){
	// 	if(trSelected == null){
	// 		return;
	// 	}
	// 	trSelected.parent().find("tr.trSelected").each(function(){
	// 		var fid_old = $(this).find("td:first div").html();
	// 		var feature_old = MapCloud.wfs_layer.getFeature(fid_old);
	// 		if(feature_old != null){
 // 				MapCloud.wfs_layer.drawFeature(feature_old);
	// 		}
	// 		$(this).removeClass("trSelected");
	// 	});

	// 	trSelected.addClass("trSelected");

	// 	var fid = -1;
	// 	var dialog = this;

	// 	trSelected.find("td:first div").each(function(){
	// 		var fid = $(this).html();

	// 		var feature = MapCloud.wfs_layer.getFeature(fid);
	// 		if(feature != null){
 // 				MapCloud.wfs_layer.drawFeature(feature, MapCloud.hited_symbolizer);
	// 			$("#right_panel").css("display","block");
	// 			$("#center_panel").addClass("col-md-7");
	// 			$("#center_panel").addClass("col-xs-7");
	// 			$("#center_panel").addClass("col-lg-7");
	// 			$("#center_panel").removeClass("col-md-9");
	// 			$("#center_panel").removeClass("col-xs-9");
	// 			$("#center_panel").removeClass("col-lg-9");

	// 			var values = feature.values;
	// 			var featureType = feature.featureType;
	// 			if(featureType == null){
	// 				return;
	// 			}
	// 			var fields = featureType.fields;
	// 			if(fields == null){
	// 				return;
	// 			}
	// 			var html = "";
	// 			for(var i = 0; i < fields.length; ++i){
	// 				var field= fields[i];
	// 				if(i % 2 == 1){
	// 					html += "<tr class=\"erow\">";
	// 				}else{
	// 					html += "<tr>";	
	// 				}
					
	// 				if(featureType.geomFieldName == field.name){
	// 					continue;
	// 				}
	// 				html += "<td class=\"table-info-key\">";
	// 				html += field.name;
	// 				html += "</td>";
	// 				html += "<td>";
	// 				html += values[i];
	// 				html += "</td>";
	// 				html += "</tr>";
	// 			}
	// 			$("#right_panel #feature_info table tbody").html(html);

	// 		}

	// 	});

	// },

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
	}

		
});
	