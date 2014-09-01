MapCloud.NewMapDialog = MapCloud.Class(MapCloud.Dialog, {
	
	initialize : function(id){
		MapCloud.Dialog.prototype.initialize.apply(this, arguments);
		
		var dialog = this;
		this.panel.click(function(){
			//dialog.closeDialog();
		});
		
		this.panel.find(".mc-map-thumb").each(function(){
			$(this).mouseover(function(){
				$(this).addClass("mc-map-thumb-over");
			});
			$(this).mouseout(function(){
				$(this).removeClass("mc-map-thumb-over");
			});
		});

	},
	
	destory : function(){
		MapCloud.Dialog.prototype.destory.apply(this, arguments);
	},
	
	cleanup : function(){
		this.panel.find("#map_name").each(function(){
			$(this).val("");
		});
	}
	
});
	