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

			// $(this).click(function(){
			// 	if(ribbonObj.isCollapsed()){
			// 		ribbonObj.ribbon.slideDown(200,function(){
			// 			ribbonObj.expand();
			// 		});
			// 		// ribbonObj.expand();
			// 	}
			// 	else{
			// 		ribbonObj.ribbon.slideUp(200,function(){
			// 			ribbonObj.collapse();
			// 		});
					
			// 	}				
			// });
        });
	}
});
	