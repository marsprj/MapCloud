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
		$(".mc-mask").css("display", "block");	
		this.panel.css("display", "block");
	},
	
	closeDialog : function() {
//		$(".mc-mask").css("display", "none");
		this.panel.css("display", "none");
		var that = this;
		var flag = false;
		$(document).find(".mc-dialog").each(function(){
			if($(this).css("display") == "block" && $(this) != that){
				flag = true;
				return false;
			}
			return true;
		});

		if(!flag){
			$(".mc-mask").css("display", "none");
		}
	},
	
	cleanup : function(){
		
	}
});
	