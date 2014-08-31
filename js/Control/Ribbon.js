MapCloud.Ribbon = MapCloud.Class({
	
	height_max : "100px",
	height_min : "20px",
	ribbon : null,
	
	initialize : function(){

		var mcribbon = this;
		
		this.ribbon = $("#ribbon_wrapper").first();

		this.hideAllRibbons();

		$("#ribbon_tabs li").each(function() {
						
			$(this).mouseover(function(){
				$(this).addClass("mc-theme-color-hover");
			});
			$(this).mouseout(function(){
				$(this).removeClass("mc-theme-color-hover");
			});			
			$(this).click(function(){
				var id =  $(this).attr("id");
				var type = id.substr(0, id.length-4);
				$("#ribbon_tabs li").each(function() {
                    $(this).removeClass("mc-active-tab");					
                });
				$(this).addClass("mc-active-tab");
				
				mcribbon.hideAllRibbons();
				mcribbon.showRibbon(type);
			});
        });
		
		$(".ribbon-item").each(function() {
			$(this).mouseover(function(){
				$(this).addClass("ribbon-item-over");
			});
			$(this).mouseout(function(){
				$(this).removeClass("ribbon-item-over");
			});			
		});
	},
	
	destory : function(){
	},
	
	hideAllRibbons : function(){
		$(".ribbon_panel").each(function() {
			$(this).css("display","none");					
		});
	},
	
	showRibbon : function(type){
		$("#"+type+"_ribbon").css("display","block");
	},
	
	expand : function(){
		this.ribbon.css("height", this.height_max);
	},
	
	collapse : function(){
		this.ribbon.css("height", this.height_min);
	},
	
	isCollapsed : function(){
		return (this.ribbon.css("height") == this.height_min);
	}
	
});
	