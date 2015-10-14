MapCloud.Panel = MapCloud.Class({
	panel : null,


	initialize : function(id){
		var that = this;
		this.panel = $("#" + id);

		this.panel.find(".close").click(function(){
			that.hidePanel();
		});
	},

	cleanup : function(){

	},

	hidePanel : function(){
		this.panel.css("display","none");
	},

	showPanel : function(){
		this.panel.css("display","block");
		this.cleanup();
	}
});