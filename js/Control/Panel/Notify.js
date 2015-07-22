MapCloud.Notify  = MapCloud.Class(MapCloud.Panel,{
	container : null,

	initialize : function(id,loadingID){
		this.loadingPanel = $("#" + loadingID);
		this.panel = $("#" + id);

		this.container = this.panel.notify();
	},


	// 显示加载框
	loading : function(){
		this.loadingPanel.show();
	},

	// 隐藏加载框
	hideLoading : function(){
		this.loadingPanel.hide();
	},

	showInfo : function(result,info){
		var params = {
			title : info,
			text : result
		};
		if(result.toLowerCase() == "success"){
			this.container.notify("create","default",params,{expires:5000});
		}else{
			this.container.notify("create","default",params,{expires:8000});
		}
	}
});