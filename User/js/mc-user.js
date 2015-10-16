var user = null;
var cookieObj = null;
$().ready(function(){


 	cookieObj = new MapCloud.Cookie();
 	var cookiedUserName = cookieObj.getCookie("username");
    if(cookiedUserName != null){
    	$("#title_panel").html("[" + cookiedUserName + "]管理页面" );
    	user = new GeoBeans.User(cookiedUserName);
    }

	loadCatalog();

	$(".service_title").click(function(){
		var item_container = $(this).next();
		if(item_container.css("height")=="0px")
		{
			var count = item_container.children().length;
			item_container.css("height", (count*25).toString() + "px");
		}
		else
		{
			item_container.css("height","0px");
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
		html += "<div class='service_title'><div class='service_title_icon'></div><span>" + catalog.name + "</span></div>";
		html += "<div class='item_container' id='item_" + i.toString() + "'>";
		var items = catalog.items.length;
		for(var j=0; j<items; j++){

			var item = catalog.items[j];
			//html += "<div class='item_block' onclick='onItemClick(\"" + item.name + "\",\"" + item.link + "\");'>" + item.name + "</div>";
			html += "<div class='item_block' onclick='onItemClick(\"" + item.name + "\",\"" + item.link + "\");'>";
			html += "<div class='item_block_icon'></div>";
			html += "<span>" + item.name + "<span>";
			html += "</div>";
		}

		html += "</div>";
	}

	document.getElementById("catalog_container").innerHTML = html;
}