$().ready(function(){

	loadCatalog();

	$(".service_title").click(function(){
		var item_container = $(this).next();
		if(item_container.css("display")=="none")
		{
			item_container.slideDown();
			// var count = item_container.children().length;
			// item_container.css("height", (count*25).toString() + "px");
		}
		else if(item_container.css("display")== "block")
		{
			item_container.slideUp();
			// item_container.css("height","0px");
		}
	})
})

function loadCatalog(){
	var html  = "";
	var count = g_catalog.length;
	for(var i=0; i<count; i++){
		html += "<div class='service_container' scroll='no'>";

		var catalog = g_catalog[i];
		//html += "<div class='service_title'>" + catalog.name + "</div>";
		html += "<div class='service_title'>"
			+	"	<div class='service_title_icon'></div>"
			+ 	"	<span>" + catalog.name + "</span>"
			+ 	"</div>";
		html += "<div class='item_container' id='item_" + i.toString() + "'>";
		var items = catalog.items.length;
		for(var j=0; j<items; j++){

			var item = catalog.items[j];
			//html += "<div class='item_block' onclick='onItemClick(\"" + item.name + "\",\"" + item.link + "\");'>" + item.name + "</div>";
			html += "<div class='item_block' onclick='onItemClick(\"" + item.name + "\",\"" + item.link + "\");'>";
			html += "<div class='item_block_icon'></div>";
			html += "<span>" + item.capation + "</span>";
			html += "</div>";
		}

		html += "</div></div>";
	}

	document.getElementById("catalog_container").innerHTML = html;
}