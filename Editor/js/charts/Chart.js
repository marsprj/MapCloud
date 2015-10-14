MapCloud.Chart = MapCloud.Class({
	id: "chart",
	x : 0,
	y : 0,
	screenX : 0,
	screenY : 0,
	offsetX : 0,
	offsetY : 0, 
	height: 200,
	width: 200,
	option:null,
	chart: null,
	currentScale : null,
	showFlag : true,


	initialize:function(id,x,y,height,width,offsetX,offsetY,option){
		this.id = id;
		this.x = x;
		this.y = y;
		this.height = height;
		this.width = width;
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		this.option = option;

		this.currentScale = mapObj.transformation.scale;

		this.getPosition();
	},

	getPosition: function(){
		var scale = mapObj.transformation.scale;
		var win_h = mapObj.transformation.win_h;
		var viewer = mapObj.getViewer();
		var xmin = viewer.xmin;
		var ymin = viewer.ymin;
		var xOffset = 0 - scale * xmin;
		var yOffset = 0 - scale * ymin;

		this.screenX = scale *  this.x + xOffset  - this.width/2 + this.offsetX;
		this.screenY = win_h - (scale *  this.y + yOffset + this.offsetY) - this.height;
		this.currentScale = scale;

	},
	show:function(){
		// 为echarts对象加载数据 
		// this.getPosition();
		var div = "<div class='chart-div' style='left:" + this.screenX + "px;top:" + this.screenY + 
			"px;height: " + this.height +  "px; width:" + this.width + "px' id='" 
			+ this.id +　"'></div>";

		var parentDiv = $("#mapCanvas_wrappper");
		parentDiv.append(div);

		this.chart = echarts.init(document.getElementById(this.id));
		this.chart.setOption(this.option); 

	},
	resize:function(){
		
		var scale = mapObj.transformation.scale;
		var changeScale = scale / this.currentScale;
		this.width = changeScale * this.width;
		this.height = changeScale * this.height;
		
		this.getPosition();

		var panel = $("#" + this.id);
		panel.height(this.height);
		panel.width(this.width);
		panel.css("left",this.screenX);
		panel.css("top",this.screenY);

		var mapCanvasWidth = $("#mapCanvas").width();
		var mapCanvasHeight = $("#mapCanvas").height();
		if(this.screenX < 0 || this.screenY < 0 || this.screenX > mapCanvasWidth || this.screenY > mapCanvasHeight){
			if($("#" + this.id).length == 1){
				this.chart.dispose();
				$("#" + this.id).remove();				
			}
			
		}else{
			if($("#" + this.id).length == 0){
				this.show();
			}	
			this.chart.resize();
		}

	},


	move:function(d_x,d_y){

		this.screenX = this.screenX + d_x;
		this.screenY = this.screenY + d_y;

	},
	reShow: function(){
		var div = "<div class='chart-div' style='left:" + this.screenX + "px;top:" + this.screenY + 
			"px;height: " + this.height +  "px; width:" + this.width + "px' id='" 
			+ this.id +　"'></div>";

		var parentDiv = $("#mapCanvas_wrappper");
		parentDiv.append(div);

		this.chart = echarts.init(document.getElementById(this.id));
		this.chart.setOption(this.option); 		
	},

	setOption:function(option){
		this.option = option;
	},


	// 是否与另一个chart重叠
	intersectRect:function(chart2){
		var xmin_1 = this.screenX;
		var ymin_1 = this.screenY;
		var xmax_1 = this.screenX + this.width;
		var ymax_1 = this.screenY + this.height;
		var xmin_2 = chart2.screenX;
		var ymin_2 = chart2.screenY;
		var xmax_2 = chart2.screenX + chart2.width;
		var ymax_2 = chart2.screenY + chart2.height;	

		if(Math.abs(xmin_2 - xmin_1) <= this.width && Math.abs(ymin_2 - ymin_1) <= this.height){
			return true;
		}
		return false;
	},

	// 调整位置和大小
	resizeChartPosition:function(){
		var scale = mapObj.transformation.scale;
		var changeScale = scale / this.currentScale;
		this.width = changeScale * this.width;
		this.height = changeScale * this.height;
		
		this.getPosition();
	}
});