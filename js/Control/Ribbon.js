MapCloud.Ribbon = MapCloud.Class({
	
	height_max : "100px",
	height_min : "20px",
	ribbon : null,
	
	initialize : function(){
	
		this.ribbon = $("#ribbon_wrapper").first();

		this.hideAllRibbons();
		this.registerRibbonEvents();
		
		this.enableMneuEffect();
		this.registerMenuEvents();
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
	},
	
	registerRibbonEvents : function(){
	
		var mcribbon = this;	
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
	},
	
	enableMneuEffect : function(){
		$(".ribbon-item").each(function(index, element) {
			$(this).mouseover(function(){
				$(this).addClass("ribbon-item-over");
			});
			$(this).mouseout(function(){
				$(this).removeClass("ribbon-item-over");
			});	
        });
	},
	
	registerMenuEvents : function(){
		var that = this;
		$(".ribbon-item").each(function(index, element) {
			$(this).click(function(e) {
				switch(index){
				// Map Events
				case 0:
					that.onMapNew();
					break;
				case 1:
					that.onMapPropertis();
					break;
				// Layer Events
				case 2:
					that.onLayerNew();
					break;
				case 3:
					that.onLayerAddVector();
					break;
				case 4:
					that.onLayerAddWMS();
					break;
				case 5:
					that.onLayerAddWFS();
					break;
				// Data Events
				case 6:
					that.onFile();
					break;
				case 7:
					that.onDatabase();
					break;
				case 8:
					that.onDataImport();
					break;
				};
			});
        });
	},

	/**************************************************************/
	/* Map Event                                                  */
	/**************************************************************/
	onMapNew : function(){
		alert("onMapNew");
	},
	
	onMapPropertis : function(){
		alert("onMapPropertis");
	},
	
	/**************************************************************/
	/* Layer Event                                                */
	/**************************************************************/
	onLayerNew : function(){
		alert("onLayerNew");
	},
	
	onLayerAddVector : function(){
		alert("onLayerAddVector");
	},
	
	onLayerAddRaster : function(){
		alert("onLayerAddRaster");
	},
	
	onLayerAddWMS : function(){
		alert("onLayerAddWMS");
	},
	
	onLayerAddWFS : function(){
		alert("onLayerAddWFS");
	},
	
	/**************************************************************/
	/* Data Event                                                */
	/**************************************************************/
	onFile : function(){
		alert("onFile");
	},
	
	onDatabase : function(){
		alert("onDatabase");
	},
	
	onDataImport : function(){
		alert("onDataImport");
	},
});
	