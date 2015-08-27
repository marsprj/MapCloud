MapCloud.WMSDialog = MapCloud.Class(MapCloud.Dialog,{
	
	layer : null,
	wmsWorkspace : null,

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);

		var dialog = this;

		this.panel.find("#wms_get_info").each(function(){
			$(this).click(function(){
				dialog.panel.find("#wms_url").each(function(){
					var url = $(this).val();
					if(url == ""){
						MapCloud.notify.showInfo("WMS地址为空，请输入","Warning");
						dialog.panel.find("#wms_url").focus();
						return;
					}
					var version = "1.3.0";
					var wmsName = dialog.panel.find("#wms_name").val();
					if(wmsName == "" ||wmsName == undefined){
						MapCloud.notify.showInfo("请输入WMS图层名称","Warning");
						dialog.panel.find("#wms_name").focus();
						return;
					}

					dialog.wmsWorkspace = new GeoBeans.WMSWorkspace(wmsName,url,version);
					dialog.wmsWorkspace.getLayers(dialog.getLayersCallback);
					dialog.panel.find("#wms_layers").html("");
				});

			});
		});

		this.panel.find(".btn-confirm").each(function(){
			$(this).click(function(){
				var wms_name = null;
				dialog.panel.find("#wms_name").each(function(){
					wms_name = $(this).val();
				});
				if(wms_name == null || wms_name == ""){
					MapCloud.notify.showInfo("请输入WMS图层名称","Warning");
					dialog.panel.find("#wms_name").focus();
					return;
				}
				var nameReg = /^[0-9a-zA-Z_-]+$/;
				if(!nameReg.test(wms_name)){
					MapCloud.notify.showInfo("请输入有效的图层名称","Warning");
					dialog.panel.find("#wms_name").focus();
					return;
				}

				var wms_url = null;
				dialog.panel.find("#wms_url").each(function(){
					wms_url = $(this).val();
				});

				if(wms_url == null || wms_url == ""){
					MapCloud.notify.showInfo("WMS地址为空，请输入","Warning");
					return;
				}

				var wms_layers = [];
				dialog.panel.find("input[name='wms_layer']:checked").each(function(){
					var wms_layer_name = $(this).val();
					wms_layers.push(wms_layer_name);
				});

				if(wms_layers.length == 0){
					MapCloud.notify.showInfo("请选择wms图层","Warning");
					return;
				}

				var styles = [];
				var layer = new GeoBeans.Layer.WMSLayer(wms_name,wms_url,wms_layers,
								null,null);
				// var layer = new GeoBeans.Layer.WMSLayer(dialog.wmsWorkspace,wms_name,
				// 				wms_url,wms_layers,styles);
				dialog.layer = layer;
				MapCloud.wms_layer = dialog.layer;
				
				if(mapObj == null){
					MapCloud.notify.showInfo("当前地图为空","Warning");
					return;
				}
				mapObj.insertLayer(dialog.layer);
				if(mapObj.getViewer() == null){
					mapObj.setViewer(new GeoBeans.Envelope(-180,-90,180,90));	
				}
				mapObj.draw();	

				dialog.closeDialog();		
				MapCloud.refresh_panel.refreshPanel();						
			});
		});
	},

	destory : function(){
		MapCloud.Dialog.prototype.destory.apply(this, arguments);
	},
	
	cleanup : function(){
		this.panel.find("#wms_name").each(function(){
			$(this).empty();
		});	
		this.panel.find("#wms_layers").each(function(){
			$(this).empty();
		});				
	},

	getLayersCallback : function(layers){
		var html = "<list-group>";
		var layer,name,geomType,layerTypeHtml;
		var dialog = MapCloud.wms_dialog;
		for(var i = 0; i < layers.length; ++i){
			layer = layers[i];
			name = layer.name;
			geomType = layer.geomType;
			// html += "<label class=\"checkbox-inline col-sm-3\">"
			// 	 +  "<input name=\"wms_layer\" type=\"checkbox\" value=\"" + name + "\">"
			// 	 +  name + "</label>";
			layerTypeHtml = MapCloud.getLayerGeomTypeHtml(geomType);
			html += '<a href="#" class="list-group-item">'
					+ layerTypeHtml + name 
					+ '<input type="checkbox" name="wms_layer" value="'
					+ name + '"></a>';
			
		}
		html += "</list-group>";
		dialog.panel.find("#wms_layers").html(html);
	},

})