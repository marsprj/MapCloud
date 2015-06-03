// 信息提示
MapCloud.AlertInfo = MapCloud.Class({
	// 提示框
	panel : null,

	// loading框
	loadingPanel : null,

	initialize : function(id,loadingID){
		this.loadingPanel = $("#" + loadingID);
		this.panel = $("#" + id);
		this.panel.find(".close").click(function(){
			$(this).parent(".alert-result").hide();
		});
	},

	hide : function(){
		this.panel.hide();
	},

	// 显示加载框
	loading : function(){
		this.loadingPanel.show();
	},

	// 隐藏加载框
	hideLoading : function(){
		this.loadingPanel.hide();
	},
	
	// 显示信息
	showInfo : function(result,action){
		this.hideLoading();
		var html = action + " : " + result;
		this.panel.find("p").html(html);
		this.panel.show();
		var that = this;
		if(result.toLowerCase() == "success"){
			window.setTimeout(function(){
				that.hide();
			}, 3000);
		}else{
			window.setTimeout(function(){
				that.hide();
			}, 5000);
		}
		
	},

});