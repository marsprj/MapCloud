MapCloud.LayerTree = MapCloud.Class({
	
	initialize : function(){

		$("#layers_tree li").each(function() {
			$(this).mouseover(function(){
				$(this).addClass("mc-layer-item-hover");
			});
			$(this).mouseout(function(){
				$(this).removeClass("mc-layer-item-hover");
			});
			$(this).click(function(){
				$("#layers_tree li").each(function() {
                    $(this).removeClass("mc-layer-item-active");
                });
				$(this).addClass("mc-layer-item-active");
			});
        });
	},
	
	destory : function(){
	}
});
	