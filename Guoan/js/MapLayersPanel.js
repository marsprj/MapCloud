MapCloud.MapLayersPanel = MapCloud.Class(MapCloud.Panel,{
	
	dbsManager : null,

	sourceName : "tianjin",

	initialize : function(id){
		MapCloud.Panel.prototype.initialize.apply(this,arguments);
		
		this.dbsManager = user.getDBSManager();
		this.registerPanelEvent();
		this.getDataSource();
	},	

	showPanel : function(){
		MapCloud.Panel.prototype.showPanel.apply(this,arguments);
		

	},

	show : function(){
		this.panel.slideDown();
	},	

	hide : function(){
		this.panel.slideUp();
	},
	registerPanelEvent : function(){

	},

	getDataSource : function(){
		this.dbsManager.getDataSource(this.sourceName,this.getDataSource_callback);
	},

	getDataSource_callback : function(dataSource){
		var panel = MapCloud.mapLayersPanel;
		panel.getDataSets(dataSource);
	},

	getDataSets : function(dataSource){
		if(dataSource == null){
			return;
		}

		dataSource.getDataSets(this.getDataSets_callback);
	},



	getDataSets_callback : function(dataSets){
		var panel = MapCloud.mapLayersPanel;
		panel.showDataSets(dataSets);
	},

	showDataSets : function(dataSets){

		// var layers = mapObj.getLayers();
		var dataSet = null,name = null,layer = null;
		var html = "";
		for(var i = 0; i < dataSets.length;++i){
			dataSet = dataSets[i];
			if(dataSet == null){
				continue;
			}
			name = dataSet.name;
			layer = mapObj.getLayer(name);
			var checkboxHtml = "<input type='checkbox'>";
			if(layer != null && layer instanceof GeoBeans.Layer.FeatureDBLayer){
				checkboxHtml = "<input type='checkbox' checked>";
			}
			html += "<div class='row' lname='" + name + "'>"
				+	"	<div class='col-md-2'>"
				+	checkboxHtml
				+	"	</div>"
				+	"	<div class='col-md-7'>"
				+	"		<span class='layer-name'>" + name + "</span>"
				+	"	</div>"
				+	"	<div class='col-md-2'>"
				+	"		<div class='mc-icon glyphicon glyphicon-ok ' data-toggle='tooltip' "
				+	"		data-placement='top' data-original-title='选中该图层'></div>"
				+	"	</div>"
				+	"</div>";
		}
		this.panel.find(".map-layers-list").html(html);
		this.panel.find("[data-toggle='tooltip']").tooltip({container:'body'});

		var that = this;
		// 添加当前图层
		this.panel.find("input[type='checkbox']").change(function(){
			var name = $(this).parents(".row").find(".layer-name").html();
			if($(this).prop("checked")){
				// 选中
				
				var layer = new GeoBeans.Layer.FeatureDBLayer(name,null,that.sourceName,name,null,null);
				mapObj.insertLayer(layer,that.addLayer_callback);
			}else{
				// 去掉选中
				mapObj.removeLayer(name,that.removeLayer_callback);
				if($(this).parents(".row").hasClass("active")){
					MapCloud.currentLayer = null;
					$(this).parents(".row").removeClass("active");
					that.panel.find(".current-layer-name").empty();

				}
			}
		});

		// 选中当前图层
		this.panel.find(".glyphicon-ok").click(function(){
			var name = $(this).parents(".row").find(".layer-name").html();
			if(name == MapCloud.currentLayer){
				MapCloud.currentLayer = null;
				that.panel.find(".current-layer-name").empty();
				$(this).parents(".row").removeClass("active");
				return;
			}
			var layer = mapObj.getLayer(name);
			if(layer == null){
				// 添加该图层
				var layer = new GeoBeans.Layer.FeatureDBLayer(name,null,that.sourceName,name,null,null);
				mapObj.insertLayer(layer,that.addLayer_callback_current);
				$(this).parents(".row").find("input[type='checkbox']").prop("checked",true);
			}else{
				mapObj.zoomToLayer(name);
			}

			that.panel.find(".map-layers-list .row").removeClass("active");
			$(this).parents(".row").addClass("active");
			that.panel.find(".current-layer-name").html(name);
			MapCloud.currentLayer = name;

		});


		// 设置已经选中的图层
		if(MapCloud.currentLayer != null){
			this.panel.find(".map-layers-list .row[lname='MapCloud.currentLayer']").addClass("active");
		}
	},

	removeLayer_callback : function(obj){
		mapObj.draw();
	},
	addLayer_callback : function(obj){
		mapObj.draw();
		// mapObj.zoomToLayer(name);
	},

	addLayer_callback_current : function(obj){
		mapObj.zoomToLayer(MapCloud.currentLayer);
		mapObj.draw();
	}



});