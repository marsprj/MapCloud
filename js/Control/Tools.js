MapCloud.Tools = MapCloud.Class({
	// 悬浮窗
	toolBoxPanel : null,
	
	// 悬浮来源
	toolBoxFlag : null,

	initialize : function(){
		this.toolBoxPanel = $(".float-tool-box");

		this.registerPanelEvent();
	},

	registerPanelEvent : function(){
		var that = this;
		// 双击显示原窗口
		this.toolBoxPanel.click(function(){
			var panel = null;
			switch(that.toolBoxFlag){
				case "chart":{
					panel = MapCloud.chart_panel;
					break;
				}
				case "barChart":{
					panel = MapCloud.bar_chart_panel;
					break;
				}
				case "pieChart":{
					panel = MapCloud.pie_chart_panel;
					break;
				}
				case "aqiChart":{
					panel = MapCloud.aqi_chart_panel;
					break;
				}
				case "aqiTimeline":{
					panel = MapCloud.aqi_timeline_chart_panel;
					break;
				}
				default :{
					break;
				}
			}
			if(panel != null){
				panel.panel.css("display","block");
			}
			that.toolBoxPanel.css("display","none");
		});
	},


	onMapMove : function(evt){
		var mapX = evt.mapX;
		var mapY = evt.mapY;
		if(mapX == null || mapY == null){
			return;
		}
		var str = mapX.toFixed(4) + " , " + mapY.toFixed(4);
		$(".float-coordinates .coor-value").html(str);
	},

	showToolBox : function(flag){
		if(flag == null){
			return;
		}
		this.toolBoxFlag = flag;
		var html = "";
		switch(flag){
			case "chart":{
				html = "<i class='fa fa-bar-chart'></i>";
				break;
			}
			case "barChart":{
				html = "<i class='fa fa-bar-chart'></i>";
				break;
			}
			case "pieChart":{
				html = "<i class='fa fa-pie-chart'></i>";
				break;
			}
			case "aqiChart":{
				html = "<i class='fa fa-cloud'></i>";
				break;
			}
			case "aqiTimeline":{
				html = "<i class='fa fa-cloud'></i>";
				break;
			}
			default:
				break;
		}
		this.toolBoxPanel.html(html);
		this.toolBoxPanel.css("display","block");

	}
});