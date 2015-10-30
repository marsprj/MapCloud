MapCloud.PoiDialog = MapCloud.Class(MapCloud.Dialog,{
	

	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		var dialog = this;
		this.registerPageEvent();
	},

	registerPageEvent : function(){

	},

	cleanup : function(){
		this.panel.find("table tbody").empty();
	},


	showDialog : function(){
		MapCloud.Dialog.prototype.showDialog.apply(this,arguments);
	},

	setPois : function(pois){
		if(!$.isArray(pois)){
			return;
		}
		var poi = null;
		var name = null;
		var x = null;
		var y = null;
		var address = null;
		var type = null;
		var html = "";
		for(var i = 0; i < pois.length; ++i){
			poi = pois[i];
			if(poi == null){
				continue;
			}
			name = poi.name;
			x = poi.x;
			y = poi.y;
			address = poi.address;
			type = poi.type;
			html += "<tr>"
				+	"	<td>" + (i+1) + "</td>"
				+	"	<td>" + name + "</td>"
				+	"	<td>" + address + "</td>"
				+	"	<td>" + type + "</td>"
				+	"	<td>" + x + "</td>"
				+	"	<td>" + y + "</td>"
				+	"</tr>";
		}
		this.panel.find("table tbody").html(html);
	}
});