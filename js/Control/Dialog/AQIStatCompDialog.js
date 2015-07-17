MapCloud.AQIStatCompDialog = MapCloud.Class(MapCloud.Dialog,{
	
	// chart layer
	chartLayer : null,
	// 控制框
	controlPanel : null,

	// 站点列表
	stations : null,

	chart : null,

	initialize : function(id,controlId){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		this.controlPanel = $("#" + controlId);
		var that = this;
		this.stations = [];

		this.controlPanel.find(".aqi-station-btn .btn-comp").click(function(){
			if(that.stations.length < 2){
				MapCloud.alert_info.showInfo("请至少选择两个站点","Warning");
				return;
			}
			that.showDialog();
			that.compareStations();
		});

		this.controlPanel.find(".aqi-station-btn .btn-close").click(function(){
			that.hideControlPanel();
		});

		this.container = this.panel.find("#aqi_stat_com_div");
	},

	cleanup : function(){
		if(this.chart != null){
			this.chart.cleanup();
		}
	},

	cleanupStations : function(){
		this.stations = [];
		this.displayStations();
		this.hideControlPanel();
		this.cleanup();
	},

	setChartLayer : function(layer){
		this.chartLayer = layer;
	},

	showControlPanel : function(){
		this.controlPanel.css("display","block");
	},

	hideControlPanel : function(){
		this.controlPanel.css("display","none");
	},

	// 新增站点
	addStation : function(station){
		this.showControlPanel();
		if(station == null){
			return;
		}
		var name = station.name;
		var code = station.code;

		var s = null;
		for(var i = 0; i < this.stations.length; ++i){
			s = this.stations[i];
			if(s.code == code){
				return;
			}
		}

		this.stations.push(station);
		this.displayStations();
		this.showControlPanel();
	},

	// 展示列表
	displayStations : function(){
		if(this.stations == null){
			return;
		}
		var station = null;
		var html = "";
		for(var i = 0; i < this.stations.length; ++i){
			station = this.stations[i];
			if(station == null){
				continue;
			}
			var name = station.name;
			var code = station.code;

			html += '<div class="aqi-station-div" code="' + code + '">'
			+ '		<button type="button" class="close">'
			+ '			<span aria-hidden="true">×</span>'
			+ '			<span class="sr-only">Close</span>'
			+ '		</button>'
			+ '		<span>' + name + '</span>'
			+ '	</div>';			
		}
		this.controlPanel.find(".aqi-station-list").html(html);
		this.registerStationListEvent();
	},

	// 列表删除事件
	registerStationListEvent : function(){
		var that = this;
		this.controlPanel.find(".close").click(function(){
			var parent = $(this).parents(".aqi-station-div");
			var code = parent.attr("code");
			that.removeStation(code);
		});
	},

	// 删除观测站
	removeStation : function(stationCode){
		if(stationCode == null){
			return;
		}
		var station = null;
		var code = null;
		for(var i = 0; i < this.stations.length; ++i){
			station = this.stations[i];
			if(station == null){
				continue;
			}
			code = station.code;
			if(code == stationCode){
				this.stations.splice(i,1);
				this.displayStations();
				return;
			}
		}
	},

	// 开始对比
	compareStations : function(){
		if(this.stations == null || this.stations.length == 0
			|| this.chartLayer == null){
			return;
		}
		var stationCodes = this.getStationCodes();
		if(stationCodes == null){
			return;
		}

		var dbName = this.chartLayer.getDbName();
		var tableName = this.chartLayer.getTableName();
		var chartField = this.chartLayer.getChartField();
		var flagField = this.chartLayer.getFlagField();
		var timeField = this.chartLayer.getTimeField();
		var timePoint = this.chartLayer.getTimePoint();
		var timeList = MapCloud.aqi_24h_dialog.getTimeList(timePoint);
		if(timeList == null){
			return;
		}
		var positionField = this.chartLayer.getLableField();

		var chart = new GeoBeans.AQIStatCompChart("站点对比图",this.container[0],
			dbName,tableName,[chartField],flagField,stationCodes,timeField,
			timeList[0],timeList[1],positionField);
		chart.setMap(mapObj);
		chart.show();
		this.chart = chart;
	},


	// 获得站点code列表
	getStationCodes : function(){
		if(this.stations == null){
			return null;
		}
		var station = null;
		var code = null;
		var codes = [];
		for(var i = 0; i < this.stations.length; ++i){
			station = this.stations[i];
			if(station == null){
				continue;
			}
			code = station.code;
			codes.push(code);
		}
		return codes;
	},
});