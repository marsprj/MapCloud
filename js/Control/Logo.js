MapCloud.Logo = MapCloud.Class({
	
	initialize : function(){

		$("#logo_panel").each(function() {
						
			$(this).click(function(){
				if(ribbonObj.isCollapsed()){
					ribbonObj.expand();
				}
				else{
					ribbonObj.collapse();
				}
			});
        });
	}
});
	