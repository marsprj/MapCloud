MapCloud.WFSLayerChart = MapCloud.Class({
	layer: null,
	chartsArray:new Array(),
	option: null,
	showFlag: true,


	initialize:function(layer,chartsArray,option){
		this.layer = layer;
		this.chartsArray = chartsArray;
		this.option = option;
	},

	removeCharts: function(id){
		var chartsDiv = $(".chart-div[id*='WFSChart" + id + "']");
		chartsDiv.remove();
		this.showFlag = false;
		for(var i = 0; i < this.chartsArray.length; ++i){
			var chart = this.chartsArray[i];
			chart.showFlag = this.showFlag;			
		}		
	},

	show:function(){
		//先设置居中
		mapObj.setViewer(new GeoBeans.Envelope(-180,-90,180,90));
		mapObj.draw();
		this.showFlag = true;

		for(var i = 0; i < this.chartsArray.length; ++i){
			var chart = this.chartsArray[i];
			chart.showFlag = this.showFlag;
			// if(chart.screenX > 0 && chart.screenY > 0){
			// 	chart.reShow();
			// }
//			chart.resize();
		}
	}
})