MapCloud.Dialog = MapCloud.Class({

	panel : null,

	initialize : function(id){
		var that = this;

		this.panel = $("#"+id);

		this.panel.find(".mc-dialog-close,.mc-dialog-close-button").each(function(){
			$(this).click(function(){
				that.closeDialog();
			});
		});
	},

	destory : function(){

	},

	showDialog : function(){
		this.cleanup();
		this.panel.modal();
	},

	closeDialog : function() {
		this.panel.modal("hide");
	},

	cleanup : function(){

	}
});
