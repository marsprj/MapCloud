MapCloud.Ribbon = MapCloud.Class({
	
	initialize : function(){

		$("#ribbon_tabs li").each(function() {
			$(this).mouseover(function(){
				$(this).addClass("mc-theme-color-hover");
			});
			$(this).mouseout(function(){
				$(this).removeClass("mc-theme-color-hover");
			});
			$(this).click(function(){
				$("#ribbon_tabs li").each(function() {
                    $(this).removeClass("mc-active-tab");
                });
				$(this).addClass("mc-active-tab");
			});
        });
	},
	
	destory : function(){
	}
});
	