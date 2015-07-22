$().ready(function(){
	
	$(".service_title").click(function(){
		var item_container = $(this).next();
		if(item_container.css("height")=="0px")
		{
			var count = item_container.children().length;
			item_container.css("height", (count*30).toString() + "px");
		}
		else
		{
			item_container.css("height","0px");
		}
	})
})