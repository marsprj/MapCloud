var g_result_panel_height = "500px";

MapView.ResultControl = MapView.Class({

	result_contaner_id : "#result_container",
	result_panctl_id : "#result_panctl",

	initialize : function(){

		this.registerExpandEvent();
		$("#result_container").css("padding","0px 0px");
		$("#result_container").css("height","0px");
		//$("#result_container").css("height",g_result_panel_height);
	},
	
	destory : function(){
	},

	registerExpandEvent : function(){
		$(this.result_panctl_id).click(this.expand);
	},

	expand : function(){

		var height = $("#result_container").first().height();
		if(height>0)
		{
			$("#result_container").css("padding","0px 0px");
			$("#result_container").css("height","0px");
		}
		else
		{
			$("#result_container").css("padding","5px 0px");
			$("#result_container").css("height",g_result_panel_height);
		}
	},
});