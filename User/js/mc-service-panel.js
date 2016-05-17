MapCloud.ServicePanel = MapCloud.Class({
		
	panel : null,
	// 当前服务
	currentService : null,

	map : null,

	// 当前操作的服务名称
	operService : null,

	initialize : function(id){
		this.panel = $("#" + id);

		this.registerPanelEvent();

		this.describeServices();
	},


	registerPanelEvent : function(){
		var that = this;

		// 返回服务列表
		this.panel.find(".return-tree-list").click(function(){
			that.describeServices();
		});

		// 显示服务信息
		this.panel.find("#show_service_info").click(function(){
			that.panel.find("#show_service_view").attr("disabled",false);
			$(this).attr("disabled",true);
			that.panel.find("#service_tab .right-panel-content-tab").hide();
			that.panel.find("#service_tab #service_info_tab").show();

		});

		// 显示地图
		this.panel.find("#show_service_view").click(function(){
			that.panel.find("#show_service_info").attr("disabled",false);
			$(this).attr("disabled",true);
			that.panel.find("#service_tab .right-panel-content-tab").hide();
			that.panel.find("#service_tab #map_view_tab").show();
			that.showServiceMap(that.currentService);
		});

		this.panel.find(".service-oper").click(function(){
			// var name = that.panel.find(".current-service").html();
			if(that.currentService == null){
				MapCloud.notify.showInfo("当前服务为空","Warning");
				return;
			}
			var state = that.currentService.state;
			if(state == "Started"){
				that.stopService(that.currentService.name);
			}else if(state == "Stopped"){
				that.startService(that.currentService.name);
			}
		});
	},


	describeServices : function(){
		this.panel.find(".service-tree").empty();
		this.panel.find(".services-list").empty();
		this.panel.find(".right-panel-tab").hide();
		this.panel.find("#services_tab").show();
		MapCloud.notify.loading();
		serviceManager.describeServices(this.describeServices_callback);
	},

	describeServices_callback : function(services){
		MapCloud.notify.hideLoading();
		var that = MapCloud.servicePanel;
		that.showServicesTree(services);
		that.showServiceList(services);

	},

	showServicesTree : function(services){
		if(!$.isArray(services)){
			return;
		}

		var service = null,name = null;
		var html = "";
		for(var i = 0; i < services.length; ++i){
			service = services[i];
			if(service == null){
				continue;
			}
			name = service.name;
			html += '<div class="row" sname="' + name + '">'
				+	'	<div class="col-md-1 col-xs-1">'
				+	'		<i class="service-icon list-icon"></i>'
				+	'	</div>'
				+	'	<div class="col-md-9 col-xs-9 map-tree-name">'
				+		name
				+	'	</div>'
				+	'</div>';
		}

		this.panel.find(".service-tree").html(html);

		var that = this;
		this.panel.find(".service-tree .row").click(function(){
			var name = $(this).attr("sname");
			that.describeService(name);
		});
	},

	showServiceList : function(services){
		if(!$.isArray(services)){
			return;
		}


		var service = null,name = null,mapName = null,extent = null,srid = null,extentStr = "";
		var thumb = null,state = null,operations = null,operation = null;
		var html = "";
		var stateHtml = "";
		
		for(var i = 0; i < services.length;++i){
			service = services[i];
			if(service == null){
				continue;
			}
			name = service.name;
			mapName = service.mapName;
			layers = service.layers;
			srid = service.srid;
			extent = service.extent;
			if(extent != null){
				extentStr = extent.xmin.toFixed(2) + " , " + extent.ymin.toFixed(2)
					+ " , " + extent.xmax.toFixed(2) + " , " + extent.ymax.toFixed(2);
			}
			thumb = service.thumb;
			state = service.state;
			operations = service.operations;
			if(state == "Started"){
				stateHtml = '<button class="btn btn-xs btn-primary btn-state">停止服务</button>'
			}else{
				stateHtml = '<button class="btn btn-xs btn-primary btn-state">启动服务</button>'
			}
			var layersHtml = '<div class="row info-row-item">'
				+	'		<div class="col-md-3 col-xs-3">图层:</div>'
				+	'		<div class="col-md-5 col-xs-5">' + (layers[0] == null?"":layers[0].name)  + '</div>'
				+	'	</div>';
			for(var j = 1; j < layers.length;++j){
				layer = layers[j];
				if(layer != null){
					layersHtml += '<div class="row info-row-item">'
						+	'		<div class="col-md-3 col-md-3"></div>'
						+	'		<div class="col-md-5 col-xs-5">' + (layers[j] == null?"":layers[j].name)  + '</div>'
						+	'	</div>';
				}
			}
			var operationsHtml = '<div class="row info-row-item">'
				+	'		<div class="col-md-3 col-xs-3">类型:</div>'
				+	'		<div class="col-md-5 col-xs-5">' + (operations[0] == null?"":operations[0])  + '</div>'
				+	'	</div>';
			for(var j = 1; j < operations.length;++j){
				operation = operations[j];
				if(operation != null){
					operationsHtml += '<div class="row info-row-item">'
						+	'		<div class="col-md-3 col-xs-3"></div>'
						+	'		<div class="col-md-5 col-xs-5">' + (operation == null?"":operation)  + '</div>'
						+	'	</div>';
				}
			}
			var stateIconHtml = "";
			if(state == "Started"){
				stateIconHtml = '<span class="state-icon service-state-start"></span>';
			}else{
				stateIconHtml = '<span class="state-icon service-state-stop"></span>';
			}

			html += '<div class="row service-row" sname="' + name + '">'
				+	'	<div class="col-md-1 col-xs-1 col-order">'
				+		(i+1)
				+	'	</div>'
				+	'	<div class="col-md-1 col-xs-1 col-order">'
				+		stateIconHtml
				+	'	</div>'
				+	'	<div class="col-md-2 col-xs-2 col-width-name">'
				+	     	name
				+	'	</div>'
				+	'	<div class="col-md-2 col-xs-2 col-width-name">'
				+			mapName
				+	'	</div>'
				+	'	<div class="col-md-2 col-xs-2 col-width-name">'
				+			srid
				+	'	</div>'
				+	'	<div class="col-md-3 col-xs-3">'
				+			extentStr
				+	'	</div>'
				+	'	<div class="col-md-2 col-xs-2">'
				// +	'		<a href="javascript:void(0)" class="oper more-service">详细</a>'
				+	'		<a href="javascript:void(0)" class="oper enter-service">进入</a>'
				+	'		<a href="javascript:void(0)" class="oper remove-service">删除</a>'
				+	'	</div>'
				+	'</div>'

				+ 	'<div class="row info-row" sname="' + name + '">'
				+	'	<div class="col-md-1 col-xs-1 col-order">'
				+	'	</div>'
				+	'	<div class="col-md-3 col-xs-3 thumb-div" style="background-image:url(' + thumb + ')">'
				+	'	</div>'
				+	'	<div class="col-md-4 col-xs-4">'
				+	'		<div class="row info-row-item">'
				+	'			<div class="col-md-3 col-xs-3">名称:</div>'
				+	'			<div class="col-md-5 col-xs-5">' + name + '</div>'
				+	'		</div>'
				+	'		<div class="row info-row-item">'
				+	'			<div class="col-md-3 col-xs-3">状态:</div>'
				+	'			<div class="col-md-5 col-xs-5">' + stateHtml + '</div>'
				+	'		</div>'
				+ 			operationsHtml
				+ 			layersHtml
				+	'	</div>'
				+ 	'</div>';
		}

		this.panel.find(".services-list").html(html);

		var that = this;
		// 详细
		this.panel.find(".service-row").click(function(){
			var row = $(this);
			var infoRow = row.next();
			infoRow.slideToggle();
			infoRow.toggleClass("selected");
			row.toggleClass("selected");
		});
		// 进入
		this.panel.find(".enter-service").click(function(){
			var name = $(this).parents(".row").attr("sname");
			that.describeService(name);
		});

		// 删除
		this.panel.find(".remove-service").click(function(){
			var name = $(this).parents(".row").attr("sname");
			if(!confirm("确定删除服务[" + name+ "]?")){
				return;
			}
			that.removeService(name);
		});


		this.panel.find(".btn-state").click(function(){
			var name = $(this).parents(".info-row").attr("sname");
			// var stateIcon = 
			var stateIcon = that.panel.find(".service-row[sname='" +　name  +"']").find(".state-icon");
			if(stateIcon.hasClass("service-state-start")){
				that.stopService(name);
			}else if(stateIcon.hasClass("service-state-stop")){
				that.startService(name);
			}
		});

		// // 停止
		// this.panel.find(".service-oper-stop-small").click(function(){
		// 	var name = $(this).parents(".info-row").attr("sname");
		// 	that.stopService(name);
			
		// });

		// // 启动
		// this.panel.find(".service-oper-start-small").click(function(){
		// 	var name = $(this).parents(".info-row").attr("sname");
		// 	that.startService(name);
		// });

		// this.panel.find(".service-oper-small").click(function(){
		// 	var name = $(this).parents(".info-row").attr("sname");
		// 	if($(this).hasClass("service-oper-start-small")){
		// 		that.startService(name);
		// 	}else if($(this).hasClass("service-oper-stop-small")){
		// 		that.stopService(name);
		// 	}
			
		// });

	},

	// 获取一个服务
	describeService : function(name){
		if(name == null){
			return;
		}
		this.panel.find(".right-panel-tab").css("display","none");
		this.panel.find("#service_tab").show();
		this.panel.find(".service-tree .row").removeClass("selected");
		this.panel.find(".service-tree .row[sname='" + name + "']").addClass("selected");
		this.panel.find(".current-service").html(name);
		this.panel.find(".map-info-layers").empty();
		this.panel.find(".map-info-name").empty();
		this.panel.find(".map-info-map").empty();
		this.panel.find(".service-extent").remove();
		this.panel.find(".map-info-srid").empty();
		this.panel.find("#service_tab .right-panel-content-tab").hide();
		this.panel.find("#service_info_tab").show();
		this.panel.find("#show_service_info").attr("disabled",true);
		this.panel.find("#show_service_view").attr("disabled",false);
		this.panel.find(".thumb-big-div").css("background-image","");
		this.currentService = null;
		MapCloud.notify.loading();
		serviceManager.describeService(name,this.describeService_callback);

	},

	describeService_callback : function(service){
		MapCloud.notify.hideLoading();
		var that = MapCloud.servicePanel;
		that.currentService = service;
		that.showService(service);
	},

	showService : function(service){
		if(service == null){
			return;
		}

		var name = service.name;
		var mapName = service.name;
		var srid = service.srid;
		var serviceExtent = service.extent;
		var layers = service.layers;

		this.panel.find(".map-info-name").html(name);
		this.panel.find(".map-info-map").html(mapName);
		this.panel.find(".map-info-srid").html(srid);
		if(serviceExtent != null){
			var extentHtml = "";
			extentHtml += 	'<div class="map-info-row service-extent">'
					+	'	<span class="map-info-item">空间范围 :</span>'
					+	'	<span class="map-info-extent">东 : ' + serviceExtent.xmax + '</span>'
					+	'</div>'
					+	'<div class="map-info-row service-extent">'
					+	'	<span class="map-info-item"></span>'
					+	'	<span class="map-info-extent">南 : ' + serviceExtent.ymin + '</span>'
					+	'</div>'
					+	'<div class="map-info-row service-extent">'
					+	'	<span class="map-info-item"></span>'
					+	'	<span class="map-info-extent">西 : ' + serviceExtent.xmin + '</span>'
					+	'</div>'
					+	'<div class="map-info-row service-extent">'
					+	'	<span class="map-info-item"></span>'
					+	'	<span class="map-info-extent">北 : ' + serviceExtent.ymax + '</span>'
					+	'</div>';

			this.panel.find(".map-info-srid").parent().after(extentHtml);
		}
		var thumb = service.thumb;
		this.panel.find(".thumb-big-div").css("background-image","url(" + thumb + ")");

		var layer = null,extent = null,type = null,srid = null,extent;
		var html = "";
		for(var i = 0; i < layers.length;++i){
			layer = layers[i];
			if(layer == null){
				continue;
			}
			name = layer.name;
			extent = layer.extent;
			type = layer.type;
			if(type != "Feature" && type != "Raster"){
				continue;
			}
			html += '<div class="map-info-row">'
				+	'	<span class="map-info-layer-name">' + name +  '</span>'
				+ 	'	<span class="map-info-item">类型：</span>'
				+	'	<span class="map-info-name">' + type + '</span>';
			if(extent != null){
				var extentStr = extent.xmin.toFixed(2) + " , " + extent.ymin.toFixed(2)
					+ " , " + extent.xmax.toFixed(2) + " , " + extent.ymax.toFixed(2);
				// html +=	'<div class="map-info-row">'
				html += 	'	<span class="map-info-item">范围：</span>'
					+	'	<span class="map-info-extent">' + extentStr + '</span>';
			}
			html += "</div>";	
		}

		this.panel.find(".map-info-layers").html(html);

		// 设置状态样式
		var state = service.state;
		if(state == "Stopped"){
			this.panel.find(".service-state").addClass("service-state-stop").removeClass("service-state-start");
			this.panel.find(".service-oper").html("启动服务");
			this.panel.find("#show_service_view").attr("disabled",true);
		}else if(state == "Started"){
			this.panel.find(".service-state").addClass("service-state-start").removeClass("service-state-stop");
			this.panel.find(".service-oper").html("停止服务");
			this.panel.find("#show_service_view").attr("disabled",false);
		}
	},

	// 删除服务
	removeService : function(name){
		if(name == null){
			return;
		}
		MapCloud.notify.loading();
		serviceManager.removeService(name,this.removeService_callback);
	},

	removeService_callback : function(result){
		MapCloud.notify.showInfo(result,"删除服务");
		var that = MapCloud.servicePanel;
		that.describeServices();
	},

	showServiceMap : function(service){
		if(service == null){
			return;
		}

		var extent = new GeoBeans.Envelope(-180,-90,180,90);
		var srid = 4326;
		var url = "/ows/" + user.name + "/" + service.name + "/ims?";
		var layerArray = service.getWMSLayers();

		
		if(this.map == null){
			this.map = new GeoBeans.Map(null,"map_view_tab","name",extent,4326);
		}else{
			this.map.removeLayer("wms");
		}
		if(layerArray.length != 0){
			var layer = new GeoBeans.Layer.WMSLayer("wms",url,layerArray,null,null);
			this.map.insertLayer(layer,null);
		}
		
		this.map.draw();
	},

	stopService : function(name){
		MapCloud.notify.loading();
		this.operService = name;
		serviceManager.stopService(name,this.stopService_callback);
	},

	stopService_callback : function(result){
		var that = MapCloud.servicePanel;
		MapCloud.notify.showInfo(result,"停止服务" + that.operService);
		if(result == "success"){
			that.panel.find(".service-state").addClass("service-state-stop").removeClass("service-state-start");
			that.panel.find(".service-oper").html("启动服务");
			that.panel.find("#show_service_view").attr("disabled",true);
			if(that.currentService != null){
				that.currentService.state = "Stopped";
			}
			that.panel.find(".service-row[sname='" + that.operService + "'] .state-icon")
				.addClass("service-state-stop").removeClass("service-state-start");
			that.panel.find(".info-row[sname='" + that.operService + "'] .btn-primary").html("启动服务");
		}
		that.operService = null;
	},

	startService : function(name){
		MapCloud.notify.loading();
		this.operService = name;
		serviceManager.startService(name,this.startService_callback);
	},

	startService_callback : function(result){
		var that = MapCloud.servicePanel;
		MapCloud.notify.showInfo(result,"启动服务" + that.operService);
		if(result == "success"){
			that.panel.find(".service-state").removeClass("service-state-stop").addClass("service-state-start");
			that.panel.find(".service-oper").html("停止服务");
			that.panel.find("#show_service_view").attr("disabled",false);
			if(that.currentService != null){
				that.currentService.state = "Started";
			}
			that.panel.find(".service-row[sname='" + that.operService + "'] .state-icon")
				.removeClass("service-state-stop").addClass("service-state-start");
			that.panel.find(".info-row[sname='" + that.operService + "'] .btn-primary").html("停止服务");
		}
		that.operService = null;
	}
});