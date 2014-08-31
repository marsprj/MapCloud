MapCloud.Logo = MapCloud.Class({
	
	initialize : function(){

		$("#logo_panel").each(function() {
						
			$(this).click(function(){

				var wrapper = $("#ribbon_wrapper").first();
				var ribbon = wrapper.find("#ribbon").first();
				var ribbon_container = wrapper.find("#ribbon_container").first();
				
				if(wrapper.css("height") == ribbon.css("height")){
					var ribbon_s =  ribbon.css("height");
					var ribbon_h = parseInt(ribbon_s.substring(0,ribbon_s.length-2));
					var tabs_s =  ribbon_container.css("height");
					var tabs_h = parseInt(tabs_s.substring(0,tabs_s.length-2));
					var height = (ribbon_h + tabs_h) + "px";
					
					wrapper.css("height", height);
				}
				else{
					wrapper.css("height", ribbon.css("height"));
				}

				
//				$("#ribbon_wrapper").first(function() {				
//				$("#ribbon_wrapper").each(function() {
//                    var  = $(this).css("height");
//                });
			});
        });
	}
});
	