MapCloud.AlertInfo = MapCloud.Class({
	panel : null,
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

	loading : function(){
		this.loadingPanel.show();
	},

	hideLoading : function(){
		this.loadingPanel.hide();
	},

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