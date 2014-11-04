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
		this.getPosition();
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

		if(this.screenX < 0 || this.screenY < 0){
			$("#" + this.id).remove();
			
		}else{
			if($("#" + this.id).length == 0){
				this.show();
			}	
			this.chart.resize();
		}

	},

	move:function(d_x,d_y){
		var panel = $("#" + this.id);
		this.screenX = this.screenX + d_x;
		this.screenY = this.screenY + d_y;
		panel.css("left",this.screenX);
		panel.css("top",this.screenY);

		// if(this.screenX < 0 || this.screenY < 0){
		// 	$("#" + this.id).remove();
		// }else{
		// 	if($("#" + this.id).length == 0){
		// 		this.reShow();
		// 	}else{
		// 		this.chart.resize();
		// 	}
		// }
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
	}
});